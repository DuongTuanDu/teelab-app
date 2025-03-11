import authReducer from "./auth/auth.slice";
import cartReducer from "./cart/cart.slice";
import categoryReducer from "./category/category.slice";
import reviewReducer from "./review/review.slice";

const reducer = {
  auth: authReducer,
  category: categoryReducer,
  review: reviewReducer,
  cart: cartReducer
};

export default reducer;
