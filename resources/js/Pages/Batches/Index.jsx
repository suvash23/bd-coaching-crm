import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ batches, courses }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);

    const { data, setData, post, put, reset, errors, processing, clearErrors } = useForm({
        course_id: courses.length > 0 ? courses[0].id : '',
        name: '',
        capacity: 20,
        status: 'active'
    });

    const openModal = (batch = null) => {
        clearErrors();
        if (batch) {
            setEditingBatch(batch);
            setData({
                course_id: batch.course_id,
                name: batch.name,
                capacity: batch.capacity,
                status: batch.status,
            });
        } else {
            setEditingBatch(null);
            reset();
            if (courses.length > 0) setData('course_id', courses[0].id);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => reset(), 200);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBatch) {
            put(route('batches.update', editingBatch.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('batches.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (batchId) => {
        if (confirm('Are you sure you want to delete this batch?')) {
            router.delete(route('batches.destroy', batchId));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Batches</h2>}
        >
            <Head title="Batches" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header & Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Manage Batches</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Organize student batches and associate them with your courses.</p>
                        </div>
                        <PrimaryButton onClick={() => openModal()} className="shadow-sm hover:shadow transition-shadow">
                            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            New Batch
                        </PrimaryButton>
                    </div>

                    {/* Check if there are no courses */}
                    {courses.length === 0 && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 dark:bg-yellow-900/30 dark:border-yellow-600 rounded-md">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                        You don't have any courses yet. You must create a course before you can create a batch.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-medium">Batch Name</th>
                                        <th scope="col" className="px-6 py-4 font-medium">Course</th>
                                        <th scope="col" className="px-6 py-4 font-medium">Capacity</th>
                                        <th scope="col" className="px-6 py-4 font-medium">Status</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batches.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                No batches found. Click "New Batch" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        batches.map((batch) => (
                                            <tr key={batch.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                    {batch.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {batch.course?.name || 'Deleted Course'}
                                                </td>
                                                <td className="px-6 py-4 font-mono font-medium">
                                                    {batch.capacity} Students
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                                        ${batch.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'}`}>
                                                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    <button onClick={() => openModal(batch)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Edit</button>
                                                    <button onClick={() => handleDelete(batch.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
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
                        {editingBatch ? 'Edit Batch' : 'Create New Batch'}
                    </h2>

                    <div className="space-y-5">

                        <div>
                            <InputLabel htmlFor="course_id" value="Associated Course" />
                            <select
                                id="course_id"
                                className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                value={data.course_id}
                                onChange={(e) => setData('course_id', e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a course...</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.course_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="name" value="Batch Name" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Afternoon Batch - 4PM"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="capacity" value="Student Capacity" />
                                <TextInput
                                    id="capacity"
                                    type="number"
                                    min="1"
                                    className="mt-1 block w-full"
                                    value={data.capacity}
                                    onChange={(e) => setData('capacity', e.target.value)}
                                    required
                                />
                                <InputError message={errors.capacity} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Batch Status" />
                                <select
                                    id="status"
                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 flex justify-end">
                        <SecondaryButton onClick={closeModal} disabled={processing}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing || courses.length === 0}>
                            {editingBatch ? 'Update Batch' : 'Create Batch'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
