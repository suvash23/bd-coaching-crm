import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ students, batches }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const { data, setData, post, put, reset, errors, processing, clearErrors } = useForm({
        name: '',
        phone: '',
        guardian_name: '',
        guardian_phone: '',
        student_id_number: '',
        status: 'active',
        batch_ids: []
    });

    const openModal = (student = null) => {
        clearErrors();
        if (student) {
            setEditingStudent(student);
            setData({
                name: student.name,
                phone: student.phone || '',
                guardian_name: student.guardian_name || '',
                guardian_phone: student.guardian_phone || '',
                student_id_number: student.student_id_number || '',
                status: student.status,
                batch_ids: student.batches.map(b => b.id)
            });
        } else {
            setEditingStudent(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => reset(), 200);
    };

    const handleBatchSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setData('batch_ids', selectedOptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingStudent) {
            put(route('students.update', editingStudent.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('students.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (studentId) => {
        if (confirm('Are you sure you want to delete this student?')) {
            router.delete(route('students.destroy', studentId));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Students</h2>}
        >
            <Head title="Students" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header & Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Student Directory</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage enrollments, assign batches, and view contact info.</p>
                        </div>
                        <PrimaryButton onClick={() => openModal()} className="shadow-sm hover:shadow transition-shadow">
                            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            New Student
                        </PrimaryButton>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-medium">Student Data</th>
                                        <th scope="col" className="px-6 py-4 font-medium">Guardian Data</th>
                                        <th scope="col" className="px-6 py-4 font-medium">Enrolled Batches</th>
                                        <th scope="col" className="px-6 py-4 font-medium">Status</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                No students found. Click "New Student" to enroll one.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((student) => (
                                            <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                                                    <div className="text-xs mt-1 text-gray-500">{student.phone || 'No phone'}</div>
                                                    {student.student_id_number && (
                                                        <div className="text-xs font-mono mt-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded w-max">
                                                            ID: {student.student_id_number}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">{student.guardian_name || '-'}</div>
                                                    <div className="text-xs mt-1 text-gray-500">{student.guardian_phone || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {student.batches.length === 0 ? (
                                                            <span className="text-xs text-gray-400">None</span>
                                                        ) : (
                                                            student.batches.map(v => (
                                                                <span key={v.id} className="px-2 py-0.5 rounded text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                                                    {v.name}
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                                        ${student.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'}`}>
                                                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    <button onClick={() => openModal(student)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Edit</button>
                                                    <button onClick={() => handleDelete(student.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
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
                        {editingStudent ? 'Edit Student' : 'Enroll New Student'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className="md:col-span-2">
                            <InputLabel htmlFor="name" value="Student Name *" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="Student Phone" />
                            <TextInput
                                id="phone"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <InputError message={errors.phone} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="student_id_number" value="ID Number / Roll" />
                            <TextInput
                                id="student_id_number"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.student_id_number}
                                onChange={(e) => setData('student_id_number', e.target.value)}
                            />
                            <InputError message={errors.student_id_number} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="guardian_name" value="Guardian Name" />
                            <TextInput
                                id="guardian_name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.guardian_name}
                                onChange={(e) => setData('guardian_name', e.target.value)}
                            />
                            <InputError message={errors.guardian_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="guardian_phone" value="Guardian Phone" />
                            <TextInput
                                id="guardian_phone"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.guardian_phone}
                                onChange={(e) => setData('guardian_phone', e.target.value)}
                            />
                            <InputError message={errors.guardian_phone} className="mt-2" />
                        </div>

                        <div className="md:col-span-2">
                            <InputLabel htmlFor="batch_ids" value="Enroll in Batches" />
                            <p className="text-xs text-gray-500 mb-2">Hold ctrl/cmd to select multiple batches.</p>
                            <select
                                id="batch_ids"
                                multiple
                                className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full h-32"
                                value={data.batch_ids}
                                onChange={handleBatchSelection}
                            >
                                {batches.map(batch => (
                                    <option key={batch.id} value={batch.id}>
                                        {batch.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.batch_ids} className="mt-2" />
                        </div>

                        <div className="md:col-span-2">
                            <InputLabel htmlFor="status" value="Account Status" />
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

                    <div className="mt-8 flex justify-end">
                        <SecondaryButton onClick={closeModal} disabled={processing}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            {editingStudent ? 'Update Student' : 'Save Student'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
