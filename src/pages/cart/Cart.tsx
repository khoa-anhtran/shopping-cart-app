import { useSelector } from "react-redux";
import { lazy, Suspense, useRef } from "react";
import { useUserInfo } from "@/contexts/UserInfoContext";
import { useCart } from "@/contexts/CartContext";
import { selectCartOpen } from "./selectors";
import CartSkeleton from "./components/CartSkeleton";
import { useLockModal } from "@/hooks";

const CartContainer = lazy(() => import("./components/CartContainer"));

const Cart = () => {
  const { onClickCloseCart } = useCart();
  const open = useSelector(selectCartOpen);

  const { userId } = useUserInfo();

  const modalRef = useRef<HTMLDivElement>(null);

  if (!userId) throw new Error("User id is not existed");

  // lock scroll & manage focus
  useLockModal(open, modalRef, onClickCloseCart);

  return (
    <div
      className={`cart-modal ${open ? "is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      onClick={onClickCloseCart}
      ref={modalRef}
    >
      {open && (
        <Suspense fallback={<CartSkeleton />}>
          <CartContainer />
        </Suspense>
      )}
    </div>
  );
};

export default Cart;
