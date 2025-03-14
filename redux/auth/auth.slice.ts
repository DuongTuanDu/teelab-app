import { createSlice } from "@reduxjs/toolkit";
import { IAuthState, ICustomer } from "./auth.interface";

const initialState: IAuthState = {
    customer: null,
    isAuthenticated: false,
    authLoading: false
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCustomer: (state, { payload }: { payload: ICustomer }) => {
            state.customer = payload;
        },
        setIsAuthenticated: (state, { payload }: { payload: boolean }) => {
            state.isAuthenticated = payload;
        },
        setAuthLoading: (state, { payload }: { payload: boolean }) => {
            state.authLoading = payload;
        },
    }
})

export const AuthActions = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;