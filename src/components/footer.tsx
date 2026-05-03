"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BriefcaseMedical, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="bg-[#00bc8c] p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <BriefcaseMedical className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-[#00bc8c]">
                MediStore
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[280px]">
              MediStore is your reliable partner in health. We provide high-quality OTC medications and wellness products with professional care.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link href="#" className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-[#00bc8c] hover:bg-[#00bc8c]/5 dark:hover:bg-[#00bc8c]/10 transition-all">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-[#00bc8c] hover:bg-[#00bc8c]/5 dark:hover:bg-[#00bc8c]/10 transition-all">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-[#00bc8c] hover:bg-[#00bc8c]/5 dark:hover:bg-[#00bc8c]/10 transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-[#00bc8c] hover:bg-[#00bc8c]/5 dark:hover:bg-[#00bc8c]/10 transition-all">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-black text-[11px] uppercase tracking-[0.15em] mb-8">Shop by Category</h4>
            <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <li><Link href="/shop" className="hover:text-[#00bc8c] transition-colors">Medicines</Link></li>
              <li><Link href="#" className="hover:text-[#00bc8c] transition-colors">Vitamins & Supplements</Link></li>
              <li><Link href="#" className="hover:text-[#00bc8c] transition-colors">Personal Care</Link></li>
              <li><Link href="#" className="hover:text-[#00bc8c] transition-colors">Health Devices</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-black text-[11px] uppercase tracking-[0.15em] mb-8">Customer Support</h4>
            <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <li><Link href="#" className="hover:text-[#00bc8c] transition-colors">Track Order</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#00bc8c] transition-colors">Shipping Policy</Link></li>
              <li><Link href="/return-refund" className="hover:text-[#00bc8c] transition-colors">Return & Refund</Link></li>
              <li><Link href="#" className="hover:text-[#00bc8c] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-black text-[11px] uppercase tracking-[0.15em] mb-8">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-[#00bc8c]">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-sm">
                   <p className="text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-0.5">Email Support</p>
                   <p className="text-slate-700 dark:text-slate-200 font-extrabold">support@medistore.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-[#00bc8c]">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-sm">
                   <p className="text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-0.5">Phone Call</p>
                   <p className="text-slate-700 dark:text-slate-200 font-extrabold">+1 (800) MEDI-CARE</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-[#00bc8c]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-sm">
                   <p className="text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-0.5">Our Location</p>
                   <p className="text-slate-700 dark:text-slate-200 font-extrabold">123 Healthcare Way, NY 10001</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 dark:border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            © 2024 MediStore Healthcare. All rights reserved.
          </p>
          <div className="flex items-center gap-4 grayscale opacity-20">
             {/* Payment Icons Placeholder */}
             <div className="text-[10px] font-black border p-1 rounded">VISA</div>
             <div className="text-[10px] font-black border p-1 rounded">MASTER</div>
             <div className="text-[10px] font-black border p-1 rounded">PAYPAL</div>
             <div className="text-[10px] font-black border p-1 rounded">STRIPE</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
