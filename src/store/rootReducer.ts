import authReducer from "@/pages/auth/reducers";
import cartReducer from "@/pages/cart/reducers";
import PaymentReducer from "@/pages/checkout/reducers";
import commentReducer from "@/pages/comments/reducers";
import uiReducer from "@/pages/loading/reducers";
import productDetailsReducer from "@/pages/product-details/reducers";
import productReducer from "@/pages/products/reducers";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    products: productReducer,
    comments: commentReducer,
    cart: cartReducer,
    auth: authReducer,
    ui: uiReducer,
    payment: PaymentReducer,
    productDetails: productDetailsReducer
});

export default rootReducer;