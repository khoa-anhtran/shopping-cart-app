import authReducer from "@/pages/auth/reducers";
import cartReducer from "@/pages/cart/reducers";
import productReducer from "@/pages/products/reducers";
import { combineReducers } from "redux";

const rootReducer = combineReducers({ products: productReducer, cart: cartReducer, auth: authReducer });

export default rootReducer;