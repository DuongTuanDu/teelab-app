import { createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "./auth.interface";

const initialState: IAuthState = {
    customer: null,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {}
})

export const AuthActions = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;