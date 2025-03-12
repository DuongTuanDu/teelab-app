import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/configs/fetch";
import { IResponseWithData } from "@/configs/base.interface";

const API_URL = process.env.EXPO_PUBLIC_API_SHIP_URL;
const TOKEN = process.env.EXPO_PUBLIC_TOKEN_SHIP;
const SHOP_ID = process.env.EXPO_PUBLIC_SHOP_ID;

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, data, params } = args;
        return baseQuery({ url, method, data, params });
    },
    endpoints: (builder) => ({
        getProvince: builder.query({
            query: () => ({
                url: API_URL + `/master-data/province`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        getDistrict: builder.query({
            query: ({ payload }) => ({
                url: API_URL + `/master-data/district?province_id=${payload}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        getWard: builder.query({
            query: ({ payload }) => ({
                url: API_URL + `/master-data/ward?district_id=${payload}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        })
    })
});

export const {

} = orderApi;