import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/configs/fetch";
import { IResponseWithData } from "@/configs/base.interface";
import { ICategory } from "./category.interface";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, body, params } = args;
        return baseQuery({ url, method, body, params });
    },
    endpoints: (builder) => ({
        getAllCategory: builder.query<IResponseWithData<ICategory[]>, void>({
            query: () => {
                return {
                    url: `categories`,
                    method: 'GET',
                }
            },
        })
    })
});

export const {
    useGetAllCategoryQuery
} = categoryApi;