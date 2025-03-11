import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IReviewState } from "./review.interface";

const initialState: IReviewState = {
    totalRate: 0,
    averageRating: 0
};

export const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {        
        setRateInfor(state, action: PayloadAction<{ totalRate: number, averageRating: number }>) {
            state.totalRate = action.payload.totalRate
            state.averageRating = action.payload.averageRating
        }
    }
})

export const ReviewActions = reviewSlice.actions;
const reviewReducer = reviewSlice.reducer;
export default reviewReducer;