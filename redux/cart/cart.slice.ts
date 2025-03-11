import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICart, ICartState } from "./cart.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadCartsFromStorage = createAsyncThunk("cart/loadCarts", async () => {
    const storedCarts = await AsyncStorage.getItem("carts");
    return storedCarts ? JSON.parse(storedCarts) : [];
});

export const saveCartToStorage = createAsyncThunk(
    "cart/saveCart",
    async (carts: ICart[]) => {
        await AsyncStorage.setItem("carts", JSON.stringify(carts));
    }
);

const calculateTotalAmount = (carts: ICart[]) => {
    return carts.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
};

const initialState: ICartState = {
    carts: [],
    totalAmount: 0
};

export const cartSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addToCart: (state, { payload }: { payload: ICart }) => {
            const existingItemIndex = state.carts.findIndex(
                (item) =>
                    item.productId === payload.productId &&
                    item.size === payload.size &&
                    item.color === payload.color
            );

            if (existingItemIndex !== -1) {
                state.carts[existingItemIndex].quantity += 1;
            } else {
                state.carts.push({
                    productId: payload.productId,
                    name: payload.name,
                    image: payload.image,
                    size: payload.size,
                    color: payload.color,
                    price: payload.price,
                    quantity: 1,
                });
            }
            state.totalAmount = calculateTotalAmount(state.carts);
        },
        decrementQuantity: (state, { payload }: { payload: ICart }) => {
            const { productId, size, color } = payload;
            const itemIndex = state.carts.findIndex(
                (item) =>
                    item.productId === productId &&
                    item.size === size &&
                    item.color === color
            );
            if (itemIndex !== -1) {
                if (state.carts[itemIndex].quantity > 1) {
                    state.carts[itemIndex].quantity -= 1;
                } else {
                    state.carts.splice(itemIndex, 1);
                }
                state.totalAmount = calculateTotalAmount(state.carts);
            }
        },
        removeFromCart: (state, { payload }: { payload: ICart }) => {
            const { productId, size, color } = payload;
            state.carts = state.carts.filter(
                (item) =>
                    !(
                        item.productId === productId &&
                        item.size === size &&
                        item.color === color
                    )
            );
            state.totalAmount = calculateTotalAmount(state.carts);
        },
        clearCart: (state) => {
            state.carts = [];
            state.totalAmount = 0;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadCartsFromStorage.fulfilled, (state, action) => {
            state.carts = action.payload;
            state.totalAmount = calculateTotalAmount(action.payload);
        });
    }
})

export const CartActions = { ...cartSlice.actions, loadCartsFromStorage, saveCartToStorage };
const cartReducer = cartSlice.reducer;
export default cartReducer;