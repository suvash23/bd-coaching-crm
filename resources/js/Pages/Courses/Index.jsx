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

    const { data, setData, post, put, reset, errors, processing, clearErrors } = useForm({
        name: '',
        fee_type: 'monthly',
        amount: ''
    });

    const openModal = (course = null) => {
        clearErrors();
        if (course) {
            setEditingCourse(course);
            setData({
                name: course.name,
                fee_type: course.fee_type,
                amount: course.amount.toString(),
            });
        } else {
            setEditingCourse(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => reset(), 200);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCourse) {
            put(route('courses.update', editingCourse.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('courses.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (courseId) => {
        if (confirm('Are you sure you want to delete this course?')) {
            router.delete(route('courses.destroy', courseId));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Courses</h2>}
        >
            <Head title="Courses" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header & Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Manage Courses</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create and manage your educational courses and their fee structures.</p>
                        </div>
                        <PrimaryButton onClick={() => openModal()} className="shadow-sm hover:shadow transition-shadow">
                            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            New Course
                        </PrimaryButton>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-medium">Name</th>
                                        <th scope="col" className="px-6 py-4 font-medium">Fee Type</th>
                                        <th scope="col" className="px-6 py-4 font-medium">Amount (BDT)</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No courses found. Click "New Course" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        courses.map((course) => (
                                            <tr key={course.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                    {course.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                                        ${course.fee_type === 'monthly' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                                                        {course.fee_type.charAt(0).toUpperCase() + course.fee_type.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono font-medium">
                                                    ৳ {parseFloat(course.amount).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    <button onClick={() => openModal(course)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Edit</button>
                                                    <button onClick={() => handleDelete(course.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                        {editingCourse ? 'Edit Course' : 'Create New Course'}
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Course Name" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. HSC Physics 2nd Paper"
                                required
                                autoFocus
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="fee_type" value="Fee Structure" />
                            <select
                                id="fee_type"
                                className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                value={data.fee_type}
                                onChange={(e) => setData('fee_type', e.target.value)}
                                required
                            >
                                <option value="monthly">Monthly Fee</option>
                                <option value="fixed">Fixed Class / Course Fee</option>
                            </select>
                            <InputError message={errors.fee_type} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="amount" value="Amount (BDT)" />
                            <TextInput
                                id="amount"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="1000.00"
                                required
                            />
                            <InputError message={errors.amount} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <SecondaryButton onClick={closeModal} disabled={processing}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            {editingCourse ? 'Update Course' : 'Create Course'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
