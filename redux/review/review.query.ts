import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/configs/fetch";
import { IResponseWithPagination } from "@/configs/base.interface";
import { IReview } from "./review.interface";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, body, params } = args;
        return baseQuery({ url, method, body, params });
    },
    endpoints: (builder) => ({
        getReviews: builder.query<IResponseWithPagination<IReview[]>, { page: number, pageSize: number, slug: string }>({
                query: ({ page = 1, pageSize = 10, slug }) => {
                    const queryString = new URLSearchParams({
                        page: page.toString(),
                        pageSize: pageSize.toString(),
                    }).toString();
                    return {
                        url: `/reviews/${slug}?${queryString}`,
                        method: 'GET',
                    }
                }
            }),
    })
});

export const {
    useGetReviewsQuery
} = reviewApi;