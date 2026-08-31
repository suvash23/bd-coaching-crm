import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Receipt({ payment }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0">
            <Head title={`Receipt - #${payment.id}`} />

            <div className="max-w-2xl mx-auto">
                {/* Print Controls - Hidden during print */}
                <div className="mb-6 flex justify-between items-center print:hidden px-4 sm:px-0">
                    <Link href={route('invoices.index')} className="text-gray-500 hover:text-gray-700">
                        &larr; Back to Ledger
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded shadow-sm text-sm font-medium"
                    >
                        Print Receipt
                    </button>
                </div>

                {/* Receipt Paper */}
                <div className="bg-white p-8 sm:p-12 shadow-md sm:rounded-lg border border-gray-200 print:shadow-none print:border-none print:p-0">

                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                {payment.organization?.name || 'Coaching Center'}
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Official Payment Receipt</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-mono text-gray-700">
                                #{String(payment.id).padStart(5, '0')}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1 font-mono">
                                Date: {new Date(payment.payment_date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Student & Course Details */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                            <div className="text-gray-900 font-medium">{payment.invoice.student?.name}</div>
                            {payment.invoice.student?.student_id_number && (
                                <div className="text-gray-500 text-sm mt-1">ID: {payment.invoice.student.student_id_number}</div>
                            )}
                            <div className="text-gray-500 text-sm mt-1">{payment.invoice.student?.phone}</div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Service Details</h3>
                            <div className="text-gray-900">{payment.invoice.course?.name}</div>
                            <div className="text-gray-500 text-sm mt-1">Billing Period: {payment.invoice.billing_month}</div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <table className="w-full text-left mb-8">
                        <thead>
                            <tr className="border-b border-gray-200 text-sm">
                                <th className="py-2 text-gray-600 font-medium">Description</th>
                                <th className="py-2 text-right text-gray-600 font-medium">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className="py-4 text-gray-900">
                                    Course Fee
                                </td>
                                <td className="py-4 text-right text-gray-900 font-mono">
                                    ৳{parseFloat(payment.invoice.amount).toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className="py-4 text-right font-medium text-gray-600">Total Paid (This Receipt)</td>
                                <td className="py-4 text-right font-bold text-emerald-600 text-lg font-mono">
                                    ৳{parseFloat(payment.amount).toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Meta Details */}
                    <div className="bg-gray-50 p-4 rounded text-sm text-gray-600 mb-8 border border-gray-100 print:bg-transparent print:border-t print:border-b print:rounded-none">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="font-medium text-gray-900">Payment Method:</span> <span className="uppercase">{payment.method}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-900">Transaction ID:</span> {payment.transaction_id || 'N/A'}
                            </div>
                            <div>
                                <span className="font-medium text-gray-900">Processed By:</span> {payment.processor?.name || 'System'}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-gray-400 text-xs mt-12 border-t border-gray-100 pt-6">
                        Thank you for your business. For any discrepancies, please contact the administration.
                    </div>

                </div>
            </div>
        </div>
    );
}
