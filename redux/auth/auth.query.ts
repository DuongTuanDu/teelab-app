import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/configs/fetch";
import { ICustomer, ILogin } from "./auth.interface";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, body, params } = args;
        return baseQuery({ url, method, body, params });
    },
    endpoints: (builder) => ({
        getAccount: builder.query<ICustomer, void>({
            query: () => ({
                url: `/account`,
                method: "GET",
            }),
            transformResponse: (response) => response.data
        }),
        login: builder.mutation<ILogin, { email: string, password: string }>({
            query: ({ email, password }) => ({
                url: `/login`,
                body: { email, password },
                method: "POST",
            }),
        }),
        register: builder.mutation<{ success: boolean, message: string }, { name: string, email: string, password: string }>({
            query: ({ email, password, name }) => ({
                url: `/register`,
                body: { email, password, name },
                method: "POST",
            }),
        }),
        sendOtp: builder.mutation<{ success: boolean, message: string }, { email: string }>({
            query: ({ email }) => ({
                url: `/send-otp`,
                body: { email },
                method: "POST",
            }),
        }),
        verifyOtp: builder.mutation<{ success: boolean, message: string }, { email: string, otp: string }>({
            query: ({ email, otp }) => ({
                url: `/verify-otp`,
                body: { email, otp },
                method: "POST",
            }),
        }),
        resetPassword: builder.mutation<{ success: boolean, message: string }, { email: string, password: string }>({
            query: ({ email, password }) => ({
                url: `/reset-password`,
                body: { email, password },
                method: "POST",
            }),
        }),
    })
});

export const {
    useGetAccountQuery,
    useLoginMutation,
    useRegisterMutation,
    useSendOtpMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation
} = authApi;