import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import Dashboard from '@/components/Dashboard';
import PatientManagement from '@/components/PatientManagement';
import DoctorManagement from '@/components/DoctorManagement';
import AppointmentModule from '@/components/AppointmentModule';
import BillingModule from '@/components/BillingModule';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Patient, Doctor, Appointment, Bill, View } from '@/types';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [patients, setPatients] = useLocalStorage<Patient[]>('medicore_patients', []);
  const [doctors, setDoctors] = useLocalStorage<Doctor[]>('medicore_doctors', []);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('medicore_appointments', []);
  const [bills, setBills] = useLocalStorage<Bill[]>('medicore_bills', []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar current={view} onNavigate={setView} />
      <MobileNav current={view} onNavigate={setView} />
      <main className="md:ml-64 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto">
        {view === 'dashboard' && (
          <Dashboard patients={patients} doctors={doctors} appointments={appointments} bills={bills} />
        )}
        {view === 'patients' && (
          <PatientManagement patients={patients} setPatients={setPatients} />
        )}
        {view === 'doctors' && (
          <DoctorManagement doctors={doctors} setDoctors={setDoctors} />
        )}
        {view === 'appointments' && (
          <AppointmentModule
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            setAppointments={setAppointments}
          />
        )}
        {view === 'billing' && (
          <BillingModule patients={patients} bills={bills} setBills={setBills} />
        )}
      </main>
    </div>
  );
}
