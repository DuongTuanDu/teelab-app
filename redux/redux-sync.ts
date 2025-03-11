import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useEffect } from "react";
import { loadCartsFromStorage, saveCartToStorage } from "./cart/cart.slice";

const ReduxSync = () => {
    const dispatch = useAppDispatch();
    const { carts } = useAppSelector(state => state.cart);

    useEffect(() => {
        dispatch(loadCartsFromStorage());
    }, [dispatch]);

    useEffect(() => {
        dispatch(saveCartToStorage(carts));
    }, [carts, dispatch]);

    return null;
};

export default ReduxSync