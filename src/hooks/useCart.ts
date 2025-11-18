import CartContext from "@/contexts/CartContext";
import { useContext } from "react";

export default function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within <CartProvider>");
    return ctx
};