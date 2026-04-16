import React from 'react';
import { ShieldCheck, Truck, UserRoundCheck } from 'lucide-react';

const props = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "100% Authentic",
    description: "Direct from manufacturers"
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Fast Delivery",
    description: "To your doorstep in 24h"
  },
  {
    icon: <UserRoundCheck className="w-6 h-6" />,
    title: "Pharmacist Support",
    description: "Expert consultation available"
  }
];

export function ValueProps() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {props.map((prop, i) => (
          <div 
            key={i} 
            className="flex items-center gap-6 p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(0,188,140,0.1)] hover:-translate-y-1.5 transition-all duration-500 group cursor-default"
          >
            <div className="bg-slate-50 text-[#00bc8c] p-5 rounded-[1.5rem] group-hover:bg-[#00bc8c] group-hover:text-white transition-all duration-500 shadow-inner">
              {prop.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{prop.title}</h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider leading-tight">{prop.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
