import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ teachers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);

    const { data, setData, post, put, reset, errors, processing, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const openCreate = () => {
        clearErrors();
        setEditingTeacher(null);
        reset();
        setData({ name: '', email: '', password: '', password_confirmation: '' });
        setIsModalOpen(true);
    };

    const openEdit = (teacher) => {
        clearErrors();
        setEditingTeacher(teacher);
        setData({ name: teacher.name, email: teacher.email, password: '', password_confirmation: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => { setEditingTeacher(null); reset(); }, 200);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingTeacher) {
            put(route('teachers.update', editingTeacher.id), { onSuccess: closeModal });
        } else {
            post(route('teachers.store'), { onSuccess: closeModal });
        }
    };

    const handleDelete = (teacher) => {
        if (confirm(`Remove ${teacher.name}? This will revoke their access to this coaching center.`)) {
            router.delete(route('teachers.destroy', teacher.id));
        }
    };

    const isCreate = !editingTeacher;
    const roleBadge = (role) => (role === 'superadmin' || role === 'admin'
        ? 'bg-indigo-50 text-indigo-700'
        : 'bg-emerald-50 text-emerald-700');

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold text-gray-800">Teachers</h2>}>
            <Head title="Teachers" />

            <div className="max-w-5xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Teaching Staff</h3>
                        <p className="text-sm text-gray-400 mt-1">Add and manage teachers for your coaching center.</p>
                    </div>
                    <PrimaryButton onClick={openCreate}>
                        <svg className="w-4 h-4 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Add Teacher
                    </PrimaryButton>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                                            No teachers yet. Click "Add Teacher" to invite a staff member.
                                        </td>
                                    </tr>
                                ) : teachers.map((teacher) => (
                                    <tr key={teacher.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{teacher.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{teacher.email}</td>
                                        <td className="px-6 py-4 capitalize">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge(teacher.role)}`}>
                                                {teacher.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-4">
                                            <button
                                                onClick={() => openEdit(teacher)}
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(teacher)}
                                                className="text-sm font-medium text-rose-500 hover:text-rose-700"
                                            >
                                                Remove
                                            </button>
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
                    <h2 className="text-lg font-bold text-gray-900 mb-6">
                        {isCreate ? 'Add New Teacher' : `Edit ${editingTeacher?.name}`}
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Rahim Uddin"
                                required
                                autoFocus
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="email" value="Email Address" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="teacher@example.com"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="password" value={isCreate ? 'Password' : 'New Password (leave blank to keep current)'} />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={isCreate ? 'Minimum 8 characters' : '••••••••'}
                                required={isCreate}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Re-type password"
                                required={isCreate}
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} disabled={processing}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Saving…' : isCreate ? 'Add Teacher' : 'Save Changes'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
