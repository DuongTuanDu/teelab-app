import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import { productApi } from './product/product.query';
import { categoryApi } from './category/category.query';
import { reviewApi } from './review/review.query';
import { orderApi } from './order/order.query';

export const store = configureStore({
    reducer: {
        ...reducer,
        [productApi.reducerPath]: productApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            productApi.middleware,
            categoryApi.middleware,
            reviewApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
