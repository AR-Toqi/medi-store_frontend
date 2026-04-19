import { Medicine } from "./medicine";

export interface OrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  quantity: number;
  price: number;
  medicine?: Medicine; // Populated from backend
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  totalAmount: number;
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: string;
  paymentMethod: string;
  transactionId?: string;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPayload {
  addressId: string;
  paymentMethod?: string;
  customerNote?: string;
}
