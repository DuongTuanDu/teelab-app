import { createAsyncThunk } from "@reduxjs/toolkit";
import { IAccount, IAccountResponse } from "./auth.interface";
import axiosInstance from "@/configs/fetch";

export const updateAccount = createAsyncThunk<IAccountResponse, IAccount, { rejectValue: any }>(
    "auth/updateAccount",
    async (payload: IAccount, { rejectWithValue }) => {
        try {
            return await axiosInstance.put("/account", payload);
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);