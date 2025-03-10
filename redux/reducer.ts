import authReducer from "./auth/auth.slice";
import categoryReducer from "./category/category.slice";

const reducer = {
  auth: authReducer,
  category: categoryReducer
};

export default reducer;
