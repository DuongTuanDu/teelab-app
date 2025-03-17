import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/configs/fetch";
import { IResponseWithData } from "@/configs/base.interface";
import { ICategoryProductResponse, IProduct, IProductFilterData, IProductListResponse } from "./product.interface";
import { ICategory } from "../category/category.interface";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, body, params } = args;
        return baseQuery({ url, method, body, params });
    },
    endpoints: (builder) => ({
        getProductHome: builder.query<IResponseWithData<{ category: ICategory, products: IProduct[] }[]>, string>({
            query: (slugs) => {
                return {
                    url: `/products-home?categories=${slugs}`,
                    method: 'GET',
                }
            }
        }),
        getProductDetail: builder.query<IResponseWithData<IProduct>, string>({
            query: (slug) => {
                return {
                    url: `/product-detail/${slug}`,
                    method: 'GET',
                }
            }
        }),
        getProductSearch: builder.query<IResponseWithData<IProduct[]>, string>({
            query: (search) => {
                return {
                    url: `/products-search?search=${search}`,
                    method: 'GET',
                }
            }
        }),
        getFilterOptions: builder.query<IProductFilterData, void>({
            query: () => ({
                url: "/filter-options",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        getProductsByCategory: builder.query<IProductListResponse, ICategory>({
            query: ({
                slug = "",
                priceRange = [],
                categories = [],
                rating = "",
                colors = [],
                page = 1,
                pageSize = 12,
            }) => {
                const queryString = new URLSearchParams({
                    priceRange: priceRange.join(','),
                    categories: categories.join(','),
                    rating,
                    colors: colors.join(','),
                    page: String(page),
                    pageSize: String(pageSize),
                }).toString();
                return {
                    url: `/products-by-category/${slug}?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (response) => response.data,
        }),
    })
});

export const {
    useGetProductHomeQuery,
    useGetProductDetailQuery,
    useGetProductSearchQuery,
    useGetFilterOptionsQuery,
    useGetProductsByCategoryQuery
} = productApi;