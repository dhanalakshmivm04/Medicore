export interface Patient {
  id: string;
  name: string;
  age: number;
  contact: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  contact: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  tokenNumber: number;
  patientId: string;
  doctorId: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Bill {
  id: string;
  patientId: string;
  consultationFee: number;
  treatmentCosts: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  createdAt: string;
}

export type View = 'dashboard' | 'patients' | 'doctors' | 'appointments' | 'billing';
