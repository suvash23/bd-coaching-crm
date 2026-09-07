import React from 'react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import { useForm, router } from '@inertiajs/react';

export default function DiscountModal({ show, onClose, student, courses }) {
    const { data, setData, post, reset, errors, processing } = useForm({
        course_id: '',
        discount_type: 'fixed',
        discount_value: '',
        start_date: '',
        end_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('students.discounts.store', student.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleDelete = (discount) => {
        if (confirm('Delete this discount?')) {
            router.delete(route('students.discounts.destroy', [student.id, discount.id]), {
                preserveScroll: true,
            });
        }
    };

    if (!student) return null;

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Manage Discounts</h2>
                <p className="text-sm text-gray-500 mb-6">For {student.name}</p>

                {/* Existing Discounts */}
                {student.discounts && student.discounts.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Active Discounts</h3>
                        <div className="space-y-3">
                            {student.discounts.map(d => (
                                <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {d.discount_type === 'percentage' ? `${d.discount_value}%` : `৳${d.discount_value}`} Off
                                            {d.course_id ? (
                                                <span className="text-gray-500 font-normal ml-2">({d.course?.name})</span>
                                            ) : (
                                                <span className="text-gray-500 font-normal ml-2">(All Courses)</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            From {d.start_date} {d.end_date ? `to ${d.end_date}` : 'onwards'}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(d)} className="text-rose-500 hover:text-rose-700 p-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add New Discount Form */}
                <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Add New Discount</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Course (Optional)</label>
                            <select value={data.course_id} onChange={e => setData('course_id', e.target.value)}
                                className="w-full px-3 py-2 border rounded-xl text-sm border-gray-300 focus:ring-indigo-500">
                                <option value="">-- Apply to All Courses --</option>
                                {courses?.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.course_id} className="mt-1" />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                <select value={data.discount_type} onChange={e => setData('discount_type', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl text-sm border-gray-300 focus:ring-indigo-500">
                                    <option value="fixed">Fixed Amount (৳)</option>
                                    <option value="percentage">Percentage (%)</option>
                                </select>
                                <InputError message={errors.discount_type} className="mt-1" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                <input type="number" min="0" step="0.01" value={data.discount_value} required placeholder="50.00"
                                    onChange={e => setData('discount_value', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl text-sm border-gray-300 focus:ring-indigo-500" />
                                <InputError message={errors.discount_value} className="mt-1" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input type="date" value={data.start_date} required
                                    onChange={e => setData('start_date', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl text-sm border-gray-300 focus:ring-indigo-500" />
                                <InputError message={errors.start_date} className="mt-1" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                                <input type="date" value={data.end_date}
                                    onChange={e => setData('end_date', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl text-sm border-gray-300 focus:ring-indigo-500" />
                                <InputError message={errors.end_date} className="mt-1" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-sm">Cancel</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 disabled:opacity-60">
                            Add Discount
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
