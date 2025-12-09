import api from "./api"
import { getUserInfo, postGoogleLogin, postLogin, postLogout, postRefreshToken, postRegister } from "./authService"
import { fetchCart, putCartItems } from "./cartService"
import { fetchComments, postComment } from "./commentService"
import { fetchOrders, postOrder } from "./orderService"
import { fetchShippingAddress } from "./paymentService"
import { fetchCategories, fetchProducts } from "./productService"
import { fetchCommunes, fetchProvinces } from "./provinceService"
import { postGetImageSignature, postUploadImage } from "./uploadService"
import { postUpdateUserInfo } from "./userService"

export {
    api, fetchCart, fetchCategories, fetchComments, fetchCommunes, fetchOrders, fetchProducts, fetchProvinces,
    fetchShippingAddress, getUserInfo, postComment, postGetImageSignature, postGoogleLogin, postLogin, postLogout,
    postOrder, postRefreshToken, postRegister, postUpdateUserInfo, postUploadImage, putCartItems
}