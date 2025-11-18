import CartContext from "@/contexts/CartContext";
import { useContext } from "react";

export default function useCartContext() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCartContext must be used within <CartProvider>");
    return ctx
};