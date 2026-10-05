import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { FeeInvoice } from '../../types';
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Printer, 
  ShieldCheck, 
  X
} from 'lucide-react';

export const FeeManagement: React.FC = () => {
  const { fees, payFeeInvoice } = useSchoolData();
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Stripe Cloud Pay' | 'ACH Wire' | 'Direct Debit' | 'Campus Card'>('Stripe Cloud Pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'partial'>('all');

  const filteredFees = fees.filter(f => statusFilter === 'all' || f.status === statusFilter);

  const totalBilled = fees.reduce((sum, f) => sum + f.totalAmount, 0);
  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalOutstanding = fees.reduce((sum, f) => sum + f.balance, 0);
  const collectionRate = Math.round((totalCollected / totalBilled) * 100);

  const handleOpenPay = (invoice: FeeInvoice) => {
    setSelectedInvoice(invoice);
    setIsPayModalOpen(true);
  };

  const handleExecutePayment = async () => {
    if (!selectedInvoice) return;
    setIsProcessing(true);
    await payFeeInvoice(selectedInvoice.id, paymentMethod);
    setIsProcessing(false);
    setIsPayModalOpen(false);
    setIsReceiptOpen(true);
  };

  const handlePrintReceipt = (invoice: FeeInvoice) => {
    setSelectedInvoice(invoice);
    setIsReceiptOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Tuition & Campus Financial Ledger
          </h1>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>PCI-DSS Level 1 Encrypted Payment Gateway</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Reconciliation</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Stripe Tokenized Vault</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">
            Total Billed (Term 2026)
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
            ${totalBilled.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            {fees.length} Total Invoices
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">
            Total Collected
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1 tabular-nums">
            ${totalCollected.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            {collectionRate}% Collection Rate
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">
            Outstanding Receivables
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1 tabular-nums">
            ${totalOutstanding.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across active terms
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-900">Encrypted Banking Records</div>
            <div className="text-slate-500">Parent ACH & card numbers zero-knowledge hashed</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white p-2 border border-slate-200 rounded-lg text-xs font-medium">
        <span className="text-slate-500 px-2 font-semibold">Filter:</span>
        {(['all', 'paid', 'pending', 'partial'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded capitalize transition-colors ${
              statusFilter === status
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Invoice No.</th>
              <th className="py-3 px-4">Scholar & Grade</th>
              <th className="py-3 px-4">Billed Term</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
              <th className="py-3 px-4 text-right">Paid</th>
              <th className="py-3 px-4 text-right">Balance Due</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredFees.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                  {inv.invoiceNo}
                </td>

                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{inv.studentName}</div>
                  <div className="text-[11px] text-slate-500">{inv.grade} · {inv.guardianName}</div>
                </td>

                <td className="py-3 px-4 text-slate-700">
                  {inv.term}
                </td>

                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                  ${inv.totalAmount.toLocaleString()}
                </td>

                <td className="py-3 px-4 text-right font-mono text-emerald-700 tabular-nums">
                  ${inv.paidAmount.toLocaleString()}
                </td>

                <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                  <span className={inv.balance > 0 ? 'text-amber-700' : 'text-slate-400'}>
                    ${inv.balance.toLocaleString()}
                  </span>
                </td>

                <td className="py-3 px-4 capitalize font-semibold">
                  <span className={
                    inv.status === 'paid' ? 'text-emerald-700' :
                    inv.status === 'partial' ? 'text-amber-700' :
                    inv.status === 'overdue' ? 'text-rose-700' : 'text-slate-700'
                  }>
                    {inv.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  {inv.status === 'paid' ? (
                    <button
                      onClick={() => handlePrintReceipt(inv)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenPay(inv)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay ${inv.balance.toLocaleString()}</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pay Modal */}
      {isPayModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>Instant Tuition Payment</span>
              </h2>
              <button onClick={() => setIsPayModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <div><span className="text-slate-500">Student:</span> <strong className="text-slate-800">{selectedInvoice.studentName}</strong></div>
                <div><span className="text-slate-500">Invoice:</span> <span className="font-mono">{selectedInvoice.invoiceNo}</span></div>
                <div className="text-base font-bold text-slate-900 font-mono pt-1">
                  Amount Due: ${selectedInvoice.balance.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1.5">Select Payment Method</label>
                <div className="space-y-2">
                  {(['Stripe Cloud Pay', 'ACH Wire', 'Direct Debit', 'Campus Card'] as const).map(method => (
                    <label key={method} className="flex items-center gap-2 p-2.5 border rounded cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="method"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="text-indigo-600"
                      />
                      <span className="font-medium text-slate-800">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleExecutePayment}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50"
                >
                  {isProcessing ? 'Authorizing Gateway...' : `Authorize & Pay $${selectedInvoice.balance.toLocaleString()}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {isReceiptOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>Official Institution Tuition Receipt</span>
              </h2>
              <button onClick={() => setIsReceiptOpen(false)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <div className="font-bold text-sm text-slate-900">Aether Academy of Science & Arts</div>
                  <div className="text-slate-500 text-[11px]">800 Innovation Way, Silicon Valley Campus</div>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-600">
                  <div>Date: {selectedInvoice.paymentDate || '2026-10-05'}</div>
                  <div className="text-emerald-700 font-bold">STATUS: PAID</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Student:</span>
                  <div className="font-semibold text-slate-900">{selectedInvoice.studentName}</div>
                  <div className="text-slate-500 text-[11px]">{selectedInvoice.grade}</div>
                </div>
                <div>
                  <span className="text-slate-500">Invoice & Transaction:</span>
                  <div className="font-mono text-slate-900">{selectedInvoice.invoiceNo}</div>
                  <div className="font-mono text-[10px] text-slate-500 truncate">{selectedInvoice.transactionRef || 'txn_token_9841'}</div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="border border-slate-200 rounded p-3 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-sans">Tuition & Instruction:</span>
                  <span>${selectedInvoice.tuitionAmount.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-sans">Laboratory & Technology:</span>
                  <span>${selectedInvoice.labTechnologyFee.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-sans">Sports & Extracurricular:</span>
                  <span>${selectedInvoice.sportsActivityFee.toLocaleString()}.00</span>
                </div>
                {selectedInvoice.discountScholarship > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span className="font-sans">Scholarship Grant:</span>
                    <span>-${selectedInvoice.discountScholarship.toLocaleString()}.00</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-sm text-slate-900">
                  <span className="font-sans">Total Paid Settlement:</span>
                  <span>${selectedInvoice.totalAmount.toLocaleString()}.00</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[10px] font-mono text-slate-500">
                Cryptographic Authentication Hash: {selectedInvoice.transactionRef} · Verified by Aether Fiscal KMS
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsReceiptOpen(false)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
