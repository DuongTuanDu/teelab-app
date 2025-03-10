import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/configs/fetch";
import { IResponseWithData } from "@/configs/base.interface";
import { IProduct } from "./product.interface";
import { ICategory } from "../category/category.interface";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, data, params } = args;
        return baseQuery({ url, method, data, params });
    },
    endpoints: (builder) => ({
        getProductHome: builder.query<IResponseWithData<{ category: ICategory, products: IProduct[] }[]>, string>({
            query: (slugs) => {
                return {
                    url: `/products-home?categories=${slugs}`,
                    method: 'GET',
                }
            }
        })
    })
});

export const {
    useGetProductHomeQuery
} = productApi;