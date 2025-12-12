import { CartItem } from "@/types";
import api from "./api";

export const fetchCart = async (): Promise<{
  userId: string;
  items: Omit<CartItem, "isSelected">[];
}> => {
  const res = await api.get(`/api/carts`);

  return res.data;
};

export const putCartItems = async (items: CartItem[]) => {
  const body = {
    items: items.map((item) => {
      const { addedAt, id, quantity } = item;
      return { addedAt, itemId: id, quantity };
    }),
  };
  await api.put(`/api/carts`, body);
};
