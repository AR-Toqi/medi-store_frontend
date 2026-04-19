import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User as UserIcon, Mail, Shield, Calendar, Edit2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { headers } from "next/headers";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function ProfilePage() {
  const headerList = await headers();
  let user = null;

  try {
    user = await authService.getCurrentUser(headerList);
  } catch (error) {
    // Middleware usually handles this redirect, but safety first
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center">
        <h2 className="text-2xl font-black text-slate-800">Session Expired</h2>
        <p className="text-slate-500 mb-6">Please log in again to view your profile.</p>
        <Link href="/login">
          <Button className="bg-[#00bc8c] text-white rounded-xl font-bold">Back to Login</Button>
        </Link>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Left Column - Avatar & Basic Info */}
        <Card className="w-full md:w-1/3 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-white to-slate-50/50">
          <CardContent className="pt-12 pb-8 flex flex-col items-center">
            <div className="relative">
              <div className="w-40 h-40 rounded-[2rem] overflow-hidden bg-[#00bc8c]/10 flex items-center justify-center border-4 border-white shadow-2xl transition-transform hover:scale-[1.02] duration-500">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#00bc8c] font-black text-6xl">{user.name.charAt(0)}</span>
                )}
              </div>
            </div>

            <h2 className="mt-8 text-2xl font-black text-slate-800">{user.name}</h2>

            <div className="w-full mt-10 space-y-3">
              <Link href="/profile/update" className="block w-full">
                <Button className="w-full bg-[#00bc8c] hover:bg-[#00a37b] rounded-2xl h-14 font-bold text-white shadow-lg shadow-[#00bc8c]/20 flex items-center gap-2 transition-all active:scale-95">
                  <Edit2 className="w-5 h-5" />
                  Update Profile
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Detailed Info */}
        <div className="flex-1 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white">
            <CardHeader className="pt-8 px-8">
              <CardTitle className="text-xl font-black text-slate-800">Account Information</CardTitle>
              <CardDescription>Verified details of your MediStore account</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InfoItem icon={UserIcon} label="Full Name" value={user.name} />
                <InfoItem icon={Mail} label="Email Address" value={user.email} />
                <InfoItem icon={Shield} label="Account Status" value={user.isBanned ? "Banned" : "Active"} color={user.isBanned ? "text-red-500" : "text-green-500"} />
                <InfoItem icon={Calendar} label="Join Date" value={new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-[#00bc8c]/5 overflow-hidden">
            <CardContent className="p-8 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-black text-slate-800">Secure Account</h3>
                <p className="text-sm text-slate-500 font-medium">Your email is {user.emailVerified ? "verified" : "not verified"}</p>
              </div>
              {!user.emailVerified && (
                <Link href={`/verify-email?email=${user.email}`}>
                  <Button size="sm" className="bg-[#00bc8c] text-white rounded-xl font-bold">Verify Now</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, color = "text-slate-600" }: { icon: any, label: string, value: string, color?: string }) {
  return (
    <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className={`font-bold ${color}`}>{value}</p>
    </div>
  );
}
