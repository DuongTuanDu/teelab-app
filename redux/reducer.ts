import authReducer from "./auth/auth.slice";
import categoryReducer from "./category/category.slice";
import reviewReducer from "./review/review.slice";

const reducer = {
  auth: authReducer,
  category: categoryReducer,
  review: reviewReducer
};

export default reducer;
