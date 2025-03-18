import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/configs/fetch";
import { IPagination, IResponseWithData } from "@/configs/base.interface";
import { IDistrict, IOrder, IPayloadOrder, IPayloadReview, IProvince, IWard } from "./order.interface";
import { IReview } from "../review/review.interface";

const API_URL = process.env.EXPO_PUBLIC_API_SHIP_URL;
const TOKEN = process.env.EXPO_PUBLIC_TOKEN_SHIP;
const SHOP_ID = process.env.EXPO_PUBLIC_SHOP_ID;

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, body, params } = args;
        return baseQuery({
            url, method, body, params,
            config: {
                headers: {
                    Token: TOKEN,
                },
            }
        });
    },
    endpoints: (builder) => ({
        getProvince: builder.query<IProvince[], void>({
            query: () => ({
                url: API_URL + `/master-data/province`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        getDistrict: builder.query<IDistrict[], number | null>({
            query: (provinceId) => ({
                url: API_URL + `/master-data/district?province_id=${provinceId}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        getWard: builder.query<IWard[], number | null>({
            query: (districtId) => ({
                url: API_URL + `/master-data/ward?district_id=${districtId}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        getOrders: builder.query<{
            data: IOrder[],
            pagination: IPagination,
            statusCounts: {
                pending: number,
                processing: number,
                shipping: number,
                delivered: number,
                cancelled: number,
            }
        }, { page: number, pageSize: number, status: string }>({
            query: ({ page = 1, pageSize = 10, status = "" }) => ({
                url: `/orders?status=${status}&page=${page}&pageSize=${pageSize}`,
                method: "GET",
            }),

        }),
        order: builder.mutation<IOrder, { order: IPayloadOrder, method: 'cod' | 'vnpay' | 'stripe' }>({
            query: ({ order, method = 'cod' }) => ({
                url: `/order-${method}`,
                method: "POST",
                body: order,
            }),
            transformResponse: (response) => response.data,
        }),
        updateOrderStatus: builder.mutation<{ data: IOrder, message: string }, { id: string, status: string }>({
            query: ({ id, status }) => ({
                url: `/order-status/${id}`,
                method: "PUT",
                body: { status },
            }),
        }),
        reviewOrder: builder.mutation<{ data: IReview, message: string }, IPayloadReview>({
            query: ({ order, product, rate, comment, images = [] }) => ({
                url: `/review`,
                method: "POST",
                body: { order, product, rate, comment, images },
            }),
        }),
    })
});

export const {
    useGetProvinceQuery,
    useGetDistrictQuery,
    useGetWardQuery,
    useGetOrdersQuery,
    useOrderMutation,
    useUpdateOrderStatusMutation,
    useReviewOrderMutation
} = orderApi;