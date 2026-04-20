"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useAddress } from "@/hooks/use-address";
import { orderService } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  MapPin, 
  Truck, 
  Loader2, 
  ShoppingBag,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function CheckoutView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cart, isLoading: isCartLoading } = useCart();
  const { addresses, isCreating, createAddress, isLoading: isAddressLoading } = useAddress();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Address Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });

  // Pre-select default address if applicable
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
      setShowAddressForm(false);
    } else if (addresses.length === 0 && !isAddressLoading) {
      setShowAddressForm(true);
    }
  }, [addresses, isAddressLoading, selectedAddressId]);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressLine || !formData.city || !formData.state || !formData.postalCode) {
      toast.error("Please fill all required address fields");
      return;
    }

    try {
      const newAddress = await createAddress(formData);
      setSelectedAddressId(newAddress.id);
      setShowAddressForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }
    if (!cart?.items?.length) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const order = await orderService.checkout({
        addressId: selectedAddressId,
        paymentMethod: "COD",
      });

      // Completely clear the frontend cart cache after order
      queryClient.setQueryData(["cart"], { items: [], summary: { totalItems: 0, cartTotal: 0, hasUnavailableItems: false }});
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      
      toast.success("Order placed successfully!");
      router.push(`/order-success/${order.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to place order.");
      setIsPlacingOrder(false);
    }
  };

  if (isCartLoading || isAddressLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#00bc8c]" />
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="container mx-auto py-16 text-center max-w-md">
        <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Cart is Empty</h2>
        <p className="text-slate-500 mb-8">You cannot checkout without items.</p>
        <Button onClick={() => router.push("/shop")} className="w-full bg-[#00bc8c] hover:bg-[#00a37b] rounded-2xl h-14 font-black">
          Return to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight mb-8">
        Secure <span className="text-[#00bc8c]">Checkout</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN - Addresses & Payment */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Shipping Address Section */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#00bc8c]/10 p-3 rounded-2xl">
                <MapPin className="w-6 h-6 text-[#00bc8c]" />
              </div>
              <h2 className="text-xl font-black text-slate-800">Shipping Address</h2>
            </div>

            {/* Address List */}
            {addresses.length > 0 && !showAddressForm && (
              <div className="flex flex-col gap-4">
                {addresses.map((address: any) => (
                  <div 
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`cursor-pointer border-2 rounded-2xl p-5 flex items-start gap-4 transition-all ${
                      selectedAddressId === address.id 
                        ? "border-[#00bc8c] bg-[#00bc8c]/5 shadow-sm" 
                        : "border-slate-100 hover:border-slate-200 bg-white"
                    }`}
                  >
                    <div className="mt-1">
                      {selectedAddressId === address.id ? (
                        <CheckCircle2 className="w-6 h-6 text-[#00bc8c]" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-800">{address.fullName}</span>
                        <span className="text-sm text-slate-500">• {address.phone}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {address.addressLine}, {address.city}, {address.state} - {address.postalCode}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddressForm(true)}
                  className="mt-2 border-dashed border-2 border-slate-200 text-slate-500 hover:text-slate-800 rounded-2xl h-14 font-bold gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Address
                </Button>
              </div>
            )}

            {/* Add New Address Form */}
            {showAddressForm && (
              <form onSubmit={handleCreateAddress} className="flex flex-col gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Full Name" 
                    className="h-12 rounded-xl bg-white border-transparent shadow-sm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                  <Input 
                    placeholder="Phone Number" 
                    className="h-12 rounded-xl bg-white border-transparent shadow-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <Input 
                  placeholder="Street Address / Apartment, Suite, etc." 
                  className="h-12 rounded-xl bg-white border-transparent shadow-sm"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({...formData, addressLine: e.target.value})}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input 
                    placeholder="City" 
                    className="h-12 rounded-xl bg-white border-transparent shadow-sm"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                  <Input 
                    placeholder="State" 
                    className="h-12 rounded-xl bg-white border-transparent shadow-sm"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  />
                  <Input 
                    placeholder="ZIP Code" 
                    className="h-12 rounded-xl bg-white border-transparent shadow-sm"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button 
                    type="submit" 
                    disabled={isCreating}
                    className="flex-1 bg-[#00bc8c] hover:bg-[#00a37b] rounded-xl h-12 font-bold shadow-lg shadow-[#00bc8c]/20 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Address"}
                  </Button>
                  {addresses.length > 0 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddressForm(false)}
                      className="flex-1 rounded-xl h-12 font-bold border-slate-200 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#00bc8c]/10 p-3 rounded-2xl">
                <Truck className="w-6 h-6 text-[#00bc8c]" />
              </div>
              <h2 className="text-xl font-black text-slate-800">Payment Option</h2>
            </div>
            
            <div className="border-2 border-[#00bc8c] bg-[#00bc8c]/5 rounded-2xl p-5 flex items-center gap-4">
               <CheckCircle2 className="w-6 h-6 text-[#00bc8c]" />
               <div className="flex flex-col">
                 <span className="font-bold text-slate-800">Cash on Delivery (COD)</span>
                 <span className="text-sm text-slate-500">Pay safely upon receiving your order.</span>
               </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - Order Summary */}
        <div className="lg:col-span-5 relative">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] sticky top-28">
             <h2 className="text-xl font-black text-slate-800 mb-6">Order Summary</h2>
             
             {/* Order Details List */}
             <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                       <img src={item.medicine?.imageUrl || ""} alt={item.medicine?.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 flex flex-col justify-center">
                       <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.medicine?.name}</h4>
                       <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                     </div>
                     <div className="flex items-center">
                       <span className="text-sm font-black text-slate-800">${(typeof item.medicine?.price === 'string' ? parseFloat(item.medicine?.price) : item.medicine?.price * item.quantity).toFixed(2)}</span>
                     </div>
                  </div>
                ))}
             </div>

             {/* Calculation lines */}
             <div className="flex flex-col gap-3 py-4 border-y border-dashed border-slate-200">
               <div className="flex justify-between text-slate-500 text-sm font-medium">
                 <span>Subtotal</span>
                 <span>${cart.summary.cartTotal.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-slate-500 text-sm font-medium">
                 <span>Shipping Fee</span>
                 <span className="text-[#00bc8c] font-black uppercase">Free</span>
               </div>
             </div>

             <div className="flex justify-between items-center py-6">
                <span className="text-lg font-black text-slate-800">Total</span>
                <span className="text-3xl font-black text-[#00bc8c]">${cart.summary.cartTotal.toFixed(2)}</span>
             </div>

             <Button 
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !selectedAddressId}
                className="w-full bg-[#00bc8c] hover:bg-[#00a37b] rounded-2xl h-16 text-lg font-black shadow-xl shadow-[#00bc8c]/20 flex items-center justify-center gap-2 group transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
             >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Confirm Order
                    <CheckCircle2 className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
             </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
