"use client";

import React, { useState, useRef } from "react";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Camera, ArrowLeft, Loader2 } from "lucide-react";
import { updateUserAction } from "@/app/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export function ProfileUpdateView() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(user?.image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      const response = await updateUserAction(data);
      
      if (response && response.success) {
        toast.success("Profile updated successfully!");
        if (response.data) {
          setUser(response.data);
        }
        router.push("/profile");
      } else if (response) {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      // Ignore Next.js redirect errors in the toast
      if (error.message?.includes("NEXT_REDIRECT")) return;
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl text-slate-900 dark:text-slate-100">
      <Link href="/profile" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#00bc8c] font-bold mb-8 transition-colors group dark:text-slate-300">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Profile
      </Link>

      <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[3rem] overflow-hidden bg-white dark:bg-slate-800">
        <CardHeader className="pt-12 px-10 text-center">
          <CardTitle className="text-3xl font-black text-slate-800 dark:text-slate-100">Update Profile</CardTitle>
          <CardDescription className="text-base font-medium">Personalize your MediStore identity</CardDescription>
        </CardHeader>
        
        <CardContent className="px-10 pb-12 pt-6">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden bg-[#00bc8c]/5 flex items-center justify-center border-4 border-dashed border-[#00bc8c]/20 group-hover:border-[#00bc8c]/50 transition-all relative">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-20 h-20 text-[#00bc8c]/30" />
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-lg">
                      <Camera className="w-6 h-6 text-[#00bc8c]" />
                    </div>
                  </div>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
                  <Camera className="w-5 h-5 text-[#00bc8c]" />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-500">Tap to change profile picture</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-black text-slate-700 dark:text-slate-300 ml-1">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="h-14 pl-12 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold focus-visible:ring-2 focus-visible:ring-[#00bc8c]/20 focus-visible:bg-white dark:focus-visible:bg-slate-900 transition-all shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 opacity-60">
                <Label htmlFor="email" className="text-sm font-black text-slate-700 dark:text-slate-300 ml-1">Email Address (Locked)</Label>
                <div className="relative">
                  <Input 
                    id="email"
                    value={user.email}
                    disabled
                    className="h-14 bg-slate-100 dark:bg-slate-700 border-none rounded-2xl font-bold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#00bc8c] hover:bg-[#00a37b] text-white rounded-[1.5rem] h-16 font-black text-lg shadow-xl shadow-[#00bc8c]/20 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Saving Changes...
                </>
              ) : (
                "Save Improvements"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
