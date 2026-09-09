import { LayoutDashboard, Users, Stethoscope, CalendarPlus, Receipt, Heart } from 'lucide-react';
import type { View } from '@/types';

interface MobileNavProps {
  current: View;
  onNavigate: (view: View) => void;
}

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'appointments', label: 'Tokens', icon: CalendarPlus },
  { id: 'billing', label: 'Billing', icon: Receipt },
];

export default function MobileNav({ current, onNavigate }: MobileNavProps) {
  return (
    <>
      <header className="md:hidden flex items-center gap-3 px-4 py-4 bg-slate-900 text-white sticky top-0 z-30">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
          <Heart className="w-4 h-4 text-white" fill="white" />
        </div>
        <h1 className="text-lg font-bold tracking-tight">MediCore</h1>
      </header>
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 flex justify-around px-2 py-2 z-30">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active ? 'text-cyan-400' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
