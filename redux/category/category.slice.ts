import { createSlice } from "@reduxjs/toolkit";
import { ICategory, ICategoryState } from "./category.interface";

const initialState: ICategoryState = {
    categories: [],
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategories(state, { payload }: { payload: ICategory[] }) {
            state.categories = payload
        }
    }
})

export const CategoryActions = categorySlice.actions;
const categoryReducer = categorySlice.reducer;
export default categoryReducer;