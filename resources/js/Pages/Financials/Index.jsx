import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ invoices }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const { data, setData, post, reset, errors, processing, clearErrors } = useForm({ amount: '', method: 'cash', payment_date: new Date().toISOString().split('T')[0], transaction_id: '' });

    const openPaymentModal = (invoice) => {
        clearErrors(); setSelectedInvoice(invoice);
        const totalPaid = invoice.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        setData({ amount: (parseFloat(invoice.amount) - totalPaid).toString(), method: 'cash', payment_date: new Date().toISOString().split('T')[0], transaction_id: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setTimeout(() => { setSelectedInvoice(null); reset(); }, 200); };
    const handleSubmit = (e) => { e.preventDefault(); post(route('invoices.payments.store', selectedInvoice.id), { onSuccess: closeModal }); };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid': return <span className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Paid</span>;
            case 'partial': return <span className="bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Partial</span>;
            case 'unpaid': return <span className="bg-rose-50 text-rose-700 ring-1 ring-rose-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Unpaid</span>;
            default: return <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Fees & Collections</h2>}>
            <Head title="Financials" />
            <div className="max-w-7xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Financial Ledger</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage outstanding dues and process incoming payments.</p>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Student Info</th>
                                    <th className="px-6 py-4 font-medium">Course / Period</th>
                                    <th className="px-6 py-4 font-medium">Status & Due Date</th>
                                    <th className="px-6 py-4 font-medium text-right">Balances</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No invoices found. Generate fees first.</td></tr>
                                ) : (
                                    invoices.map((invoice) => {
                                        const totalPaid = invoice.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
                                        const amount = parseFloat(invoice.amount);
                                        return (
                                            <tr key={invoice.id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{invoice.student?.name}</div>
                                                    <div className="text-xs text-gray-500 font-mono mt-1">ID: {invoice.student?.student_id_number || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-800">{invoice.course?.name}</div>
                                                    <div className="text-xs text-indigo-600 font-mono font-medium mt-1 uppercase tracking-wide">{invoice.billing_month}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="mb-2">{getStatusBadge(invoice.status)}</div>
                                                    <div className="text-xs text-gray-500 font-medium">Due: {new Date(invoice.due_date).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono">
                                                    <div className="text-gray-900 font-bold text-base">৳{amount.toLocaleString()}</div>
                                                    {totalPaid > 0 && (
                                                        <div className="text-emerald-600 flex flex-col items-end text-xs mt-1 font-semibold">
                                                            <span>- ৳{totalPaid.toLocaleString()} paid</span>
                                                            <div className="mt-1 flex flex-col items-end space-y-1">
                                                                {invoice.payments.map(p => (
                                                                    <a key={p.id} href={route('payments.receipt', p.id)} target="_blank" className="font-sans text-indigo-600 hover:text-indigo-800 hover:underline">
                                                                        Receipt #{String(p.id).padStart(5, '0')} &#8599;
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {invoice.status !== 'paid' ? (
                                                        <button onClick={() => openPaymentModal(invoice)} className="py-2 px-4 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
                                                            Collect Payment
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Cleared</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Process Payment</h2>
                    {selectedInvoice && (
                        <p className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                            Collecting for <strong className="text-gray-900">{selectedInvoice.student?.name}</strong> • {selectedInvoice.course?.name} ({selectedInvoice.billing_month})
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <InputLabel htmlFor="amount" value="Amount Received (৳) *" />
                            <TextInput id="amount" type="number" step="0.01" className="mt-1 block w-full text-lg font-mono text-emerald-600 font-bold focus:ring-emerald-500 focus:border-emerald-500" value={data.amount} onChange={(e) => setData('amount', e.target.value)} required autoFocus />
                            <InputError message={errors.amount} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="payment_date" value="Payment Date *" />
                            <TextInput id="payment_date" type="date" className="mt-1 block w-full" value={data.payment_date} onChange={(e) => setData('payment_date', e.target.value)} required />
                            <InputError message={errors.payment_date} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="method" value="Payment Method *" />
                            <select id="method" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full text-sm" value={data.method} onChange={(e) => setData('method', e.target.value)} required>
                                <option value="cash">Cash</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="bank">Bank Transfer</option>
                            </select>
                            <InputError message={errors.method} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="transaction_id" value="Transaction ID (Optional)" />
                            <TextInput id="transaction_id" type="text" className="mt-1 block w-full text-sm" value={data.transaction_id} onChange={(e) => setData('transaction_id', e.target.value)} placeholder="e.g. 5TRX982L" />
                            <InputError message={errors.transaction_id} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} disabled={processing}>Cancel</SecondaryButton>
                        <PrimaryButton className="bg-indigo-600 hover:bg-indigo-700" disabled={processing}>Confirm Payment</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
