import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAccount, IAuthState, ICustomer } from "./auth.interface";
import Storage from "@/helpers/storage";
import axiosInstance from "@/configs/fetch";

const initialState: IAuthState = {
    customer: null,
    isAuthenticated: false,
    authLoading: false,
    emailVerify: "",
    isResetPassword: false,
    userInfo: {},
    socket: null
};

export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        await Storage.removeItem("ACCESS_TOKEN");
    }
);

export const getAccount = createAsyncThunk<ICustomer>(
    "auth/account",
    async () => {
        const response = await axiosInstance.get("/account");
        return response.data;
    }
);


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCustomer: (state, { payload }: { payload: ICustomer | any }) => {
            state.customer = payload;
        },
        setIsAuthenticated: (state, { payload }: { payload: boolean }) => {
            state.isAuthenticated = payload;
        },
        setAuthLoading: (state, { payload }: { payload: boolean }) => {
            state.authLoading = payload;
        },
        setEmailVerify: (state, { payload }: { payload: string }) => {
            state.emailVerify = payload
        },
        setIsResetPassword: (state, { payload }: { payload: boolean }) => {
            state.isResetPassword = payload
        },
        setUserInfo(state, { payload }: { payload: IAccount }) {
            state.userInfo = payload;
        },
        setSocket(state, action) {
            state.socket = action.payload;
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.authLoading = false;
                state.customer = null;
            })

            .addCase(getAccount.pending, (state, action) => {
                state.authLoading = true;
            })
            .addCase(getAccount.fulfilled, (state, action: PayloadAction<ICustomer>) => {
                if (action.payload._id) {
                    state.authLoading = false;
                    state.customer = action.payload;
                    state.isAuthenticated = true;
                }
            })
            .addCase(getAccount.rejected, (state, action) => {
                state.authLoading = false;
            })
    }
})

export const AuthActions = { ...authSlice.actions, logout, getAccount };
const authReducer = authSlice.reducer;
export default authReducer;