import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IAuthState, ICustomer } from "./auth.interface";
import Storage from "@/helpers/storage";

const initialState: IAuthState = {
    customer: null,
    isAuthenticated: false,
    authLoading: false,
    emailVerify: "",
    isResetPassword: false
};

export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        await Storage.removeItem("ACCESS_TOKEN");
    }
);

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
        setEmailVerify: (state, { payload }: { payload: string }) => {
            state.emailVerify = payload
        },
        setIsResetPassword: (state, { payload }: { payload: boolean }) => {
            state.isResetPassword = payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.authLoading = false;
                state.customer = null;
            })
    }
})

export const AuthActions = { ...authSlice.actions, logout };
const authReducer = authSlice.reducer;
export default authReducer;