import { fetcher } from "@/lib/api-client";
import { Address, CreateAddressInput } from "@/types/address";

export const addressService = {
  getMyAddresses: async () => {
    return fetcher<Address[]>("/api/addresses");
  },

  createAddress: async (payload: CreateAddressInput) => {
    return fetcher<Address>("/api/addresses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  setDefaultAddress: async (id: string) => {
    return fetcher(`/api/addresses/${id}/default`, {
      method: "PUT",
    });
  },

  deleteAddress: async (id: string) => {
    return fetcher(`/api/addresses/${id}`, {
      method: "DELETE",
    });
  }
};
