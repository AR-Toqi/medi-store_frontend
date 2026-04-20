import { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Secure Checkout | MediStore",
  description: "Complete your order securely on MediStore.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
