import { useState } from 'react';
import { Users, Plus, Trash2, Phone, Search } from 'lucide-react';
import type { Patient } from '@/types';

interface PatientManagementProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

export default function PatientManagement({ patients, setPatients }: PatientManagementProps) {
  const [form, setForm] = useState({ id: '', name: '', age: '', contact: '' });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.age || !form.contact) {
      setError('All fields are required');
      return;
    }
    if (patients.some((p) => p.id === form.id)) {
      setError('A patient with this ID already exists');
      return;
    }
    const newPatient: Patient = {
      id: form.id,
      name: form.name,
      age: parseInt(form.age, 10),
      contact: form.contact,
      createdAt: new Date().toISOString(),
    };
    setPatients((prev) => [...prev, newPatient]);
    setForm({ id: '', name: '', age: '', contact: '' });
    setError('');
  };

  const handleDelete = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Patient Management</h2>
        <p className="text-slate-500 text-sm mt-1">Register and manage patient records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Plus className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Add Patient</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Patient ID</label>
              <input
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                placeholder="e.g. P001"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Contact</label>
                <input
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  placeholder="Phone"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium py-2.5 rounded-lg hover:shadow-lg hover:shadow-cyan-600/20 transition-all duration-200"
            >
              Register Patient
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Patient Records</h3>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {patients.length}
                </span>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-48"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-slate-400 py-12 text-center">No patients found</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-cyan-600">{patient.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{patient.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{patient.age}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {patient.contact}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
