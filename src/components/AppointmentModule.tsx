import { useState } from 'react';
import { CalendarPlus, Ticket, Clock, CheckCircle2, XCircle, Play, Trash2 } from 'lucide-react';
import type { Patient, Doctor, Appointment } from '@/types';

interface AppointmentModuleProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const statusConfig: Record<Appointment['status'], { label: string; icon: typeof Clock; color: string; bg: string }> = {
  waiting: { label: 'Waiting', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  'in-progress': { label: 'In Progress', icon: Play, color: 'text-blue-600', bg: 'bg-blue-50' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
};

export default function AppointmentModule({ patients, doctors, appointments, setAppointments }: AppointmentModuleProps) {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [error, setError] = useState('');

  const nextToken = appointments.length > 0 ? Math.max(...appointments.map((a) => a.tokenNumber)) + 1 : 101;

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId) {
      setError('Please select both a patient and a doctor');
      return;
    }
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      tokenNumber: nextToken,
      patientId,
      doctorId,
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [...prev, newAppointment]);
    setPatientId('');
    setDoctorId('');
    setError('');
  };

  const updateStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const handleDelete = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const patientMap = new Map(patients.map((p) => [p.id, p.name]));
  const doctorMap = new Map(doctors.map((d) => [d.id, d.name]));
  const deptMap = new Map(doctors.map((d) => [d.id, d.department]));

  const sorted = [...appointments].sort((a, b) => a.tokenNumber - b.tokenNumber);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Appointments & Smart Tokens</h2>
        <p className="text-slate-500 text-sm mt-1">Issue smart tokens and manage the patient queue</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Issue Smart Token</h3>
              <p className="text-xs text-slate-400">Next token: #{nextToken}</p>
            </div>
          </div>
          {patients.length === 0 || doctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400 mb-2">
                {patients.length === 0 ? 'No patients registered yet.' : 'No doctors registered yet.'}
              </p>
              <p className="text-xs text-slate-400">Please add records first to issue tokens.</p>
            </div>
          ) : (
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Select Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white transition-all"
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Select Doctor</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white transition-all"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} — {d.name} ({d.department})
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="text-sm text-rose-500">{error}</p>}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-2.5 rounded-lg hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200"
              >
                Issue Token #{nextToken}
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarPlus className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800">Appointment Queue</h3>
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                {appointments.length}
              </span>
            </div>
          </div>
          {sorted.length === 0 ? (
            <p className="text-sm text-slate-400 py-12 text-center">No appointments issued yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sorted.map((apt) => {
                    const cfg = statusConfig[apt.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                            #{apt.tokenNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">{patientMap.get(apt.patientId) || 'Unknown'}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-700">{doctorMap.get(apt.doctorId) || 'Unknown'}</p>
                          <p className="text-xs text-slate-400">{deptMap.get(apt.doctorId) || ''}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {apt.status === 'waiting' && (
                              <button
                                onClick={() => updateStatus(apt.id, 'in-progress')}
                                title="Start consultation"
                                className="text-blue-500 hover:text-blue-700 transition-colors"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            {apt.status === 'in-progress' && (
                              <button
                                onClick={() => updateStatus(apt.id, 'completed')}
                                title="Mark completed"
                                className="text-emerald-500 hover:text-emerald-700 transition-colors"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                              <button
                                onClick={() => updateStatus(apt.id, 'cancelled')}
                                title="Cancel"
                                className="text-rose-400 hover:text-rose-600 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(apt.id)}
                              title="Delete"
                              className="text-slate-300 hover:text-slate-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
