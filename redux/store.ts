import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import { productApi } from './product/product.query';
import { categoryApi } from './category/category.query';

export const store = configureStore({
    reducer: {
        ...reducer,
        [productApi.reducerPath]: productApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            productApi.middleware,
            categoryApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
