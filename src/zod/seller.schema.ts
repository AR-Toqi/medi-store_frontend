import { z } from "zod";

export const sellerOnboardingSchema = z.object({
  shopName: z
    .string()
    .min(3, "Shop name must be at least 3 characters")
    .max(50, "Shop name must be less than 50 characters"),
  shopDescription: z
    .string()
    .max(500, "Description must be less than 500 characters"),
  licenseNumber: z
    .string()
    .min(5, "License number must be at least 5 characters")
    .max(30, "License number must be less than 30 characters"),
  shopLogo: z.any().nullable(),
});

// Refine the schema to handle the minimum length of description only if it's not empty
export const sellerOnboardingSchemaRefined = sellerOnboardingSchema.refine(
  (data) => {
    if (data.shopDescription && data.shopDescription.length > 0) {
      return data.shopDescription.length >= 10;
    }
    return true;
  },
  {
    message: "Description must be at least 10 characters",
    path: ["shopDescription"],
  }
);

export type SellerOnboardingValues = {
  shopName: string;
  shopDescription: string;
  licenseNumber: string;
  shopLogo: File | null;
};
