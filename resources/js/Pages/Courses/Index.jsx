import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ courses }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const { data, setData, post, put, reset, errors, processing, clearErrors } = useForm({ name: '', fee_type: 'monthly', amount: '' });

    const openModal = (course = null) => {
        clearErrors();
        if (course) { setEditingCourse(course); setData({ name: course.name, fee_type: course.fee_type, amount: course.amount.toString() }); }
        else { setEditingCourse(null); reset(); }
        setIsModalOpen(true);
    };
    const closeModal = () => { setIsModalOpen(false); setTimeout(() => reset(), 200); };
    const handleSubmit = (e) => {
        e.preventDefault();
        editingCourse ? put(route('courses.update', editingCourse.id), { onSuccess: closeModal }) : post(route('courses.store'), { onSuccess: closeModal });
    };
    const handleDelete = (id) => { if (confirm('Delete this course?')) router.delete(route('courses.destroy', id)); };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold text-gray-800">Courses</h2>}>
            <Head title="Courses" />
            <div className="max-w-5xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Manage Courses</h3>
                        <p className="text-sm text-gray-400 mt-1">Create and manage your educational courses and fee structures.</p>
                    </div>
                    <PrimaryButton onClick={() => openModal()}>
                        <svg className="w-4 h-4 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        New Course
                    </PrimaryButton>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Fee Type</th>
                                    <th className="px-6 py-4 font-medium">Amount (BDT)</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">No courses yet. Click "New Course" to create one.</td></tr>
                                ) : courses.map(course => (
                                    <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{course.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${course.fee_type === 'monthly' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                                {course.fee_type.charAt(0).toUpperCase() + course.fee_type.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-semibold text-gray-700">৳ {parseFloat(course.amount).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right space-x-4">
                                            <button onClick={() => openModal(course)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Edit</button>
                                            <button onClick={() => handleDelete(course.id)} className="text-sm font-medium text-rose-500 hover:text-rose-700">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Course Name" />
                            <TextInput id="name" type="text" className="mt-1 block w-full" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. HSC Physics 2nd Paper" required autoFocus />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="fee_type" value="Fee Structure" />
                            <select id="fee_type" value={data.fee_type} onChange={e => setData('fee_type', e.target.value)} required
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full text-sm">
                                <option value="monthly">Monthly Fee</option>
                                <option value="fixed">Fixed Class / Course Fee</option>
                            </select>
                            <InputError message={errors.fee_type} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="amount" value="Amount (BDT)" />
                            <TextInput id="amount" type="number" step="0.01" className="mt-1 block w-full" value={data.amount} onChange={e => setData('amount', e.target.value)} placeholder="1000.00" required />
                            <InputError message={errors.amount} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} disabled={processing}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing}>{editingCourse ? 'Update Course' : 'Create Course'}</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
