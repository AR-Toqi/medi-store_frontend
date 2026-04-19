export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  country?: string;
  city: string;
  state: string;
  area?: string;
  postalCode: string;
  addressLine: string;
  label?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  fullName: string;
  phone: string;
  country?: string;
  city: string;
  state: string;
  area?: string;
  postalCode: string;
  addressLine: string;
  label?: string;
  isDefault?: boolean;
}
