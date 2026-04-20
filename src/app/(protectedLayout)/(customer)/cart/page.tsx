import { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your Shopping Cart | MediStore",
  description: "Review and manage the medicines in your shopping cart.",
};

export default function CartPage() {
  return <CartView />;
}
