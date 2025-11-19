import cartSaga from "@/pages/cart/middlewares";
import commentsSaga from "@/pages/comments/middlewares";
import productsSaga from "@/pages/products/middlewares";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([
    productsSaga(),
    commentsSaga(),
    cartSaga()
  ])
}