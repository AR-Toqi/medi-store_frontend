"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Store, Upload, Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";

import { sellerOnboardingSchemaRefined, type SellerOnboardingValues } from "@/zod/seller.schema";
import { sellerService } from "@/services/seller.service";
import { useUser } from "@/hooks/use-user";

export function OnboardingForm() {
  const router = useRouter();
  const { user, refreshUser, isLoading: isUserLoading } = useUser();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logoUploadId = React.useId();

  // Redirect guests to login
  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login?callbackUrl=/become-a-seller");
    }
  }, [user, isUserLoading, router]);

  const form = useForm<SellerOnboardingValues>({
    resolver: zodResolver(sellerOnboardingSchemaRefined),
    defaultValues: {
      shopName: "",
      shopDescription: "",
      licenseNumber: "",
      shopLogo: undefined,
    },
  });

  const onSubmit = async (value: SellerOnboardingValues) => {
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("shopLogo", file);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <FormField
              control={form.control}
              name="shopName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Central Pharmacy"
                      className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00bc8c]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shopDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Briefly describe your pharmacy..."
                      className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00bc8c]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Help customers know what makes your store special.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drug License Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. DL-12345"
                      className="h-12 rounded-xl border-slate-200 focus-visible:ring-[#00bc8c]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shopLogo"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Shop Logo</FormLabel>
                  <FormControl>
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
                          htmlFor={logoUploadId} 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-all shadow-sm active:scale-95"
                        >
                          <Upload className="w-4 h-4" />
                          Choose Image
                        </label>
                        <input
                          id={logoUploadId}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">PNG, JPG or WebP. Max 2MB.</p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-[#00bc8c] hover:bg-[#00a37b] border-none rounded-xl text-base font-bold shadow-xl shadow-[#00bc8c]/20 transition-all active:scale-[0.98] mt-4"
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
