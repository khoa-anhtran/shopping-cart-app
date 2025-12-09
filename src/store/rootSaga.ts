import { cartSaga } from "@/pages/cart";
import { paymentSaga } from "@/pages/checkout";
import { commentsSaga } from "@/pages/comments";
import productsSaga from "@/pages/products/middlewares";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([
    productsSaga(),
    commentsSaga(),
    cartSaga(),
    paymentSaga()
  ])
}