import { authReducer } from "@/pages/auth";
import { cartReducer } from "@/pages/cart";
import { PaymentReducer } from "@/pages/checkout";
import { commentReducer } from "@/pages/comments";
import { loadingReducer } from "@/pages/loading";
import { productDetailsReducer } from "@/pages/product-details";
import { productReducer } from "@/pages/products";
import { reviewReducer } from "@/pages/reviews"
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    products: productReducer,
    comments: commentReducer,
    reviews: reviewReducer,
    cart: cartReducer,
    auth: authReducer,
    loading: loadingReducer,
    payment: PaymentReducer,
    productDetails: productDetailsReducer
});

export default rootReducer;