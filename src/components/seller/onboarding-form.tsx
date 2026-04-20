"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Store, Upload, Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FieldError,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

import { sellerOnboardingSchemaRefined, type SellerOnboardingValues } from "@/zod/seller.schema";
import { sellerService } from "@/services/seller.service";
import { useUser } from "@/hooks/use-user";

export function OnboardingForm() {
  const router = useRouter();
  const { user, refreshUser, isLoading: isUserLoading } = useUser();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Redirect guests to login
  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login?callbackUrl=/become-a-seller");
    }
  }, [user, isUserLoading, router]);

  const form = useForm({
    defaultValues: {
      shopName: "",
      shopDescription: "",
      licenseNumber: "",
      shopLogo: null as File | null,
    },
    validators: {
      onChange: sellerOnboardingSchemaRefined,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        formData.append("shopName", value.shopName);
        if (value.shopDescription) {
          formData.append("shopDescription", value.shopDescription);
        }
        formData.append("licenseNumber", value.licenseNumber);
        if (value.shopLogo) {
          formData.append("logo", value.shopLogo); // Backend expects 'logo'
        }

        await sellerService.createSellerProfile(formData);
        
        toast.success("Welcome aboard! You are now a seller.");
        
        // Refresh user state to update role to SELLER
        await refreshUser();
        
        // Redirect to seller dashboard
        router.push("/seller/dashboard");
      } catch (error: any) {
        toast.error(error.message || "Failed to create seller profile. Please try again.");
      }
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = e.target.files?.[0];
    if (file) {
      field.handleChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-slate-200/60 bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
      <CardHeader className="space-y-1 pb-8 p-8 lg:p-10">
        <div className="w-12 h-12 bg-[#00bc8c]/10 rounded-2xl flex items-center justify-center mb-4">
          <Store className="w-6 h-6 text-[#00bc8c]" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Store Details</CardTitle>
        <CardDescription className="text-slate-500 font-medium">
          Tell us about your pharmacy to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 lg:p-10 pt-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }} 
          className="space-y-7"
        >
          <form.Field
            name="shopName"
            children={(field) => (
              <div className="space-y-2">
                <FieldLabel htmlFor={field.name}>Shop Name</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="e.g. Central Pharmacy"
                  className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00bc8c]"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />

          <form.Field
            name="shopDescription"
            children={(field) => (
              <div className="space-y-2">
                <FieldLabel htmlFor={field.name}>Shop Description (Optional)</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Briefly describe your pharmacy..."
                  className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00bc8c]"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldDescription>Help customers know what makes your store special.</FieldDescription>
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />

          <form.Field
            name="licenseNumber"
            children={(field) => (
              <div className="space-y-2">
                <FieldLabel htmlFor={field.name}>Drug License Number</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="e.g. DL-12345"
                  className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00bc8c]"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />

          <form.Field
            name="shopLogo"
            children={(field) => (
              <div className="space-y-2">
                <FieldLabel>Shop Logo</FieldLabel>
                <div className="flex items-center gap-6 p-5 border-2 border-dashed border-slate-200 rounded-2xl hover:border-[#00bc8c]/50 transition-colors bg-slate-50/50">
                  <div className="relative w-20 h-20 bg-white rounded-xl border border-slate-100 overflow-hidden flex-shrink-0 shadow-sm">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <label 
                      htmlFor="logo-upload" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-all shadow-sm active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleLogoChange(e, field)}
                    />
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">PNG, JPG or WebP. Max 2MB.</p>
                  </div>
                </div>
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full h-14 bg-[#00bc8c] hover:bg-[#00a37b] rounded-xl text-base font-bold shadow-xl shadow-[#00bc8c]/20 transition-all active:scale-[0.98] mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Store...
                  </>
                ) : (
                  <>
                    Register Store
                    <CheckCircle2 className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            )}
          />
        </form>
      </CardContent>
    </Card>
  );
}
