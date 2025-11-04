import authSaga from "@/pages/auth/middlewares";
import cartSaga from "@/pages/cart/middlewares";
import productsSaga from "@/pages/products/middlewares";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([
    productsSaga(),
    cartSaga(),
    authSaga()
  ])
}