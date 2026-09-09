import { LayoutDashboard, Users, Stethoscope, CalendarPlus, Receipt, Heart } from 'lucide-react';
import type { View } from '@/types';

interface SidebarProps {
  current: View;
  onNavigate: (view: View) => void;
}

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'appointments', label: 'Appointments', icon: CalendarPlus },
  { id: 'billing', label: 'Billing', icon: Receipt },
];

export default function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-slate-200 fixed inset-y-0 left-0 z-30">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Heart className="w-5 h-5 text-white" fill="white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">MediCore</h1>
          <p className="text-xs text-slate-400">Smart Hospital System</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-slate-800">
        <p className="text-xs text-slate-500">© 2026 MediCore Systems</p>
      </div>
    </aside>
  );
}
