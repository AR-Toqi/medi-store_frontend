import { Bell, Construction } from "lucide-react";

export default function AdminAlertsPage() {
  return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-[80vh]">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
          <Construction className="w-12 h-12 text-amber-500" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Coming Soon
          </h1>
          <p className="text-slate-400 font-medium text-lg max-w-md mx-auto">
            Platform Alerts &amp; Notifications are currently under development. Stay tuned!
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-300 uppercase tracking-widest">
          <Bell className="w-4 h-4" />
          <span>Alerts Module</span>
        </div>
      </div>
    </div>
  );
}
