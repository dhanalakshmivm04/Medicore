import { Users, Stethoscope, CalendarClock, DollarSign, TrendingUp, Activity, Clock } from 'lucide-react';
import type { Patient, Doctor, Appointment, Bill } from '@/types';

interface DashboardProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  bills: Bill[];
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  sublabel,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  gradient: string;
  sublabel?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
          {sublabel && <p className="text-xs text-slate-400 mt-1">{sublabel}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ patients, doctors, appointments, bills }: DashboardProps) {
  const totalRevenue = bills.reduce((sum, b) => sum + b.total, 0);
  const waitingCount = appointments.filter((a) => a.status === 'waiting').length;

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentBills = [...bills]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const patientMap = new Map(patients.map((p) => [p.id, p.name]));
  const doctorMap = new Map(doctors.map((d) => [d.id, d.name]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Overview of your hospital operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Patients"
          value={patients.length}
          icon={Users}
          gradient="bg-gradient-to-br from-cyan-500 to-blue-500"
          sublabel="Registered in system"
        />
        <StatCard
          label="Total Doctors"
          value={doctors.length}
          icon={Stethoscope}
          gradient="bg-gradient-to-br from-teal-500 to-emerald-500"
          sublabel="Active staff"
        />
        <StatCard
          label="Queue Length"
          value={waitingCount}
          icon={CalendarClock}
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
          sublabel="Patients waiting"
        />
        <StatCard
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-rose-500 to-pink-500"
          sublabel="From all bills"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-slate-800">Recent Appointments</h3>
          </div>
          {recentAppointments.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-lg">
                      #{apt.tokenNumber}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{patientMap.get(apt.patientId) || 'Unknown'}</p>
                      <p className="text-xs text-slate-400">Dr. {doctorMap.get(apt.doctorId) || 'Unknown'}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      apt.status === 'waiting'
                        ? 'bg-amber-50 text-amber-600'
                        : apt.status === 'in-progress'
                        ? 'bg-blue-50 text-blue-600'
                        : apt.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Recent Bills</h3>
          </div>
          {recentBills.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No bills generated yet</p>
          ) : (
            <div className="space-y-3">
              {recentBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{patientMap.get(bill.patientId) || 'Unknown'}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(bill.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-800">${bill.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
