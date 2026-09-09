import { useState, useRef } from 'react';
import { Receipt, Printer, DollarSign, FileText, X, Trash2 } from 'lucide-react';
import type { Patient, Bill } from '@/types';

interface BillingModuleProps {
  patients: Patient[];
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

const DEFAULT_TAX_RATE = 8;

export default function BillingModule({ patients, bills, setBills }: BillingModuleProps) {
  const [patientId, setPatientId] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [treatmentCosts, setTreatmentCosts] = useState('');
  const [taxRate, setTaxRate] = useState(DEFAULT_TAX_RATE.toString());
  const [error, setError] = useState('');
  const [activeBill, setActiveBill] = useState<Bill | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const patientMap = new Map(patients.map((p) => [p.id, p]));

  const subtotal = (parseFloat(consultationFee) || 0) + (parseFloat(treatmentCosts) || 0);
  const taxAmount = (subtotal * (parseFloat(taxRate) || 0)) / 100;
  const total = subtotal + taxAmount;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setError('Please select a patient');
      return;
    }
    if (consultationFee === '' && treatmentCosts === '') {
      setError('Enter at least one fee');
      return;
    }
    const bill: Bill = {
      id: crypto.randomUUID(),
      patientId,
      consultationFee: parseFloat(consultationFee) || 0,
      treatmentCosts: parseFloat(treatmentCosts) || 0,
      taxRate: parseFloat(taxRate) || 0,
      taxAmount,
      total,
      createdAt: new Date().toISOString(),
    };
    setBills((prev) => [...prev, bill]);
    setActiveBill(bill);
    setPatientId('');
    setConsultationFee('');
    setTreatmentCosts('');
    setError('');
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=800,height=600');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Invoice - MediCore</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 40px; }
            .invoice { max-width: 700px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
            .logo { font-size: 28px; font-weight: 800; color: #0891b2; }
            .logo-sub { font-size: 12px; color: #64748b; }
            .invoice-meta { text-align: right; }
            .invoice-meta h2 { font-size: 22px; color: #1e293b; }
            .invoice-meta p { font-size: 13px; color: #64748b; margin-top: 4px; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; }
            .section-value { font-size: 15px; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f1f5f9; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            .totals { margin-left: auto; width: 280px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
            .totals-row.total { font-size: 18px; font-weight: 800; border-top: 2px solid #1e293b; margin-top: 8px; padding-top: 12px; }
            .footer { margin-top: 48px; text-align: center; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  const handleDelete = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    if (activeBill?.id === id) setActiveBill(null);
  };

  const recentBills = [...bills].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Billing & Invoices</h2>
        <p className="text-slate-500 text-sm mt-1">Generate invoices and manage billing records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="font-semibold text-slate-800">New Invoice</h3>
          </div>
          {patients.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No patients registered yet.</p>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Select Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white transition-all"
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
                <label className="text-xs font-medium text-slate-500 mb-1 block">Consultation Fee ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Treatment Costs ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={treatmentCosts}
                  onChange={(e) => setTreatmentCosts(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-700">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax ({parseFloat(taxRate) || 0}%)</span>
                  <span className="font-medium text-slate-700">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-800">Total</span>
                  <span className="font-bold text-slate-800">${total.toFixed(2)}</span>
                </div>
              </div>

              {error && <p className="text-sm text-rose-500">{error}</p>}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium py-2.5 rounded-lg hover:shadow-lg hover:shadow-rose-600/20 transition-all duration-200"
              >
                Generate Invoice
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800">Billing History</h3>
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{bills.length}</span>
            </div>
          </div>
          {recentBills.length === 0 ? (
            <p className="text-sm text-slate-400 py-12 text-center">No invoices generated yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subtotal</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tax</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-700">{patientMap.get(bill.patientId)?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(bill.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        ${(bill.consultationFee + bill.treatmentCosts).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">${bill.taxAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">${bill.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveBill(bill)}
                            title="View invoice"
                            className="text-cyan-600 hover:text-cyan-800 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(bill.id)}
                            title="Delete"
                            className="text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {activeBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Invoice Preview</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-600/20 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={() => setActiveBill(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-8" ref={printRef}>
              <div className="invoice">
                <div className="header">
                  <div>
                    <div className="logo">MediCore</div>
                    <div className="logo-sub">Smart Hospital Management System</div>
                  </div>
                  <div className="invoice-meta">
                    <h2>INVOICE</h2>
                    <p>{new Date(activeBill.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p>#{activeBill.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="section">
                  <div className="section-title">Billed To</div>
                  <div className="section-value">{patientMap.get(activeBill.patientId)?.name || 'Unknown'}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                    Patient ID: {activeBill.patientId}
                    {patientMap.get(activeBill.patientId) && ` • Age: ${patientMap.get(activeBill.patientId)?.age}`}
                    {patientMap.get(activeBill.patientId) && ` • Contact: ${patientMap.get(activeBill.patientId)?.contact}`}
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Consultation Fee</td>
                      <td style={{ textAlign: 'right' }}>${activeBill.consultationFee.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Treatment Costs</td>
                      <td style={{ textAlign: 'right' }}>${activeBill.treatmentCosts.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="totals">
                  <div className="totals-row">
                    <span>Subtotal</span>
                    <span>${(activeBill.consultationFee + activeBill.treatmentCosts).toFixed(2)}</span>
                  </div>
                  <div className="totals-row">
                    <span>Tax ({activeBill.taxRate}%)</span>
                    <span>${activeBill.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="totals-row total">
                    <span>Total</span>
                    <span>${activeBill.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="footer">
                  Thank you for choosing MediCore. This is a computer-generated invoice.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
