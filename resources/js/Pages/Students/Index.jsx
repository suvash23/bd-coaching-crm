import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';

const Avatar = ({ student, size = 'md' }) => {
    const sizes = { sm: 'w-9 h-9 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-20 h-20 text-xl' };
    const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (student.photo_url) {
        return <img src={student.photo_url} alt={student.name} className={`${sizes[size]} rounded-full object-cover flex-shrink-0 border-2 border-slate-700 ring-2 ring-slate-800`} />;
    }
    return (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center font-bold text-white flex-shrink-0 border-2 border-slate-700`}>
            {initials}
        </div>
    );
};

export default function Index({ students, batches }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, put, reset, errors, processing, clearErrors } = useForm({
        name: '', phone: '', guardian_name: '', guardian_phone: '',
        student_id_number: '', status: 'active', batch_ids: [], photo: null,
        _method: 'POST',
    });

    const openCreate = () => {
        clearErrors();
        setEditingStudent(null);
        setPhotoPreview(null);
        setData({
            name: '', phone: '', guardian_name: '', guardian_phone: '',
            student_id_number: '', status: 'active', batch_ids: [], photo: null,
            _method: 'POST',
        });
        setIsModalOpen(true);
    };

    const openEdit = (student) => {
        clearErrors();
        setEditingStudent(student);
        setPhotoPreview(student.photo_url || null);
        setData({
            name: student.name, phone: student.phone || '', guardian_name: student.guardian_name || '',
            guardian_phone: student.guardian_phone || '', student_id_number: student.student_id_number || '',
            status: student.status, batch_ids: student.batches.map(b => b.id), photo: null, _method: 'PUT',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => { setEditingStudent(null); setPhotoPreview(null); reset(); }, 200);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editingStudent ? route('students.update', editingStudent.id) : route('students.store');
        // Use post for both (with _method override for PUT)
        post(url, { forceFormData: true, onSuccess: closeModal });
    };

    const handleDelete = (student) => {
        if (confirm(`Delete ${student.name}? This cannot be undone.`)) {
            router.delete(route('students.destroy', student.id));
        }
    };

    const toggleBatch = (batchId) => {
        const ids = data.batch_ids.includes(batchId)
            ? data.batch_ids.filter(id => id !== batchId)
            : [...data.batch_ids, batchId];
        setData('batch_ids', ids);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold text-slate-100">Students</h2>}>
            <Head title="Students" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white">Student Roster</h3>
                        <p className="text-sm text-slate-500 mt-1">{students.length} students enrolled</p>
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Student
                    </button>
                </div>

                {/* Student Grid */}
                {students.length === 0 ? (
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <p className="text-slate-400 font-medium">No students yet</p>
                        <p className="text-slate-600 text-sm mt-1">Click "Add Student" to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {students.map(student => (
                            <div key={student.id} className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col transition-all hover:shadow-xl hover:shadow-black/30">
                                {/* Avatar & Name */}
                                <div className="flex items-start gap-4 mb-4">
                                    <Avatar student={student} size="lg" />
                                    <div className="flex-1 min-w-0 pt-1">
                                        <h4 className="font-semibold text-white truncate">{student.name}</h4>
                                        {student.student_id_number && (
                                            <span className="text-xs font-mono text-slate-500">#{student.student_id_number}</span>
                                        )}
                                        <div className="mt-2">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${student.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                                {student.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-1.5 text-xs text-slate-500 flex-1">
                                    {student.phone && <div className="flex items-center gap-2"><svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>{student.phone}</div>}
                                    {student.guardian_name && <div className="flex items-center gap-2"><svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>{student.guardian_name} (Guardian)</div>}
                                    {student.batches.length > 0 && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {student.batches.map(b => (
                                                <span key={b.id} className="px-2 py-0.5 rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-800/50 text-xs">{b.name}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
                                    <button onClick={() => openEdit(student)} className="flex-1 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(student)} className="flex-1 py-1.5 rounded-lg text-xs font-medium text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                        {editingStudent ? 'Edit Student' : 'New Student'}
                    </h2>

                    {/* Photo Upload */}
                    <div className="flex items-center gap-5 mb-6">
                        <div className="relative">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/50" />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-600">
                                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Student Photo</label>
                            <label className="cursor-pointer px-3 py-2 rounded-lg border border-slate-600 text-sm text-slate-400 hover:text-white hover:border-indigo-500 transition-colors">
                                <span>Choose image…</span>
                                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                            </label>
                            <p className="text-xs text-slate-500 mt-1">JPEG, PNG or WebP. Max 2MB.</p>
                            <InputError message={errors.photo} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Full Name *', key: 'name', type: 'text', required: true, placeholder: 'e.g. Rahim Uddin' },
                            { label: 'Student ID', key: 'student_id_number', type: 'text', placeholder: 'e.g. STU-001' },
                            { label: 'Phone', key: 'phone', type: 'text', placeholder: '017XXXXXXXX' },
                            { label: "Guardian's Name", key: 'guardian_name', type: 'text', placeholder: 'Parent / Guardian' },
                            { label: "Guardian's Phone", key: 'guardian_phone', type: 'text', placeholder: '017XXXXXXXX' },
                        ].map(field => (
                            <div key={field.key} className={field.key === 'name' ? 'sm:col-span-2' : ''}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{field.label}</label>
                                <input
                                    type={field.type} value={data[field.key]} required={field.required}
                                    placeholder={field.placeholder}
                                    onChange={e => setData(field.key, e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
                                />
                                <InputError message={errors[field.key]} className="mt-1" />
                            </div>
                        ))}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Status</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Batch Assignment */}
                    {batches.length > 0 && (
                        <div className="mt-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Assign to Batches</label>
                            <div className="flex flex-wrap gap-2">
                                {batches.map(batch => (
                                    <button key={batch.id} type="button" onClick={() => toggleBatch(batch.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${data.batch_ids.includes(batch.id) ? 'bg-indigo-600 text-white border-indigo-500' : 'border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-indigo-400'}`}>
                                        {batch.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                        <button type="submit" disabled={processing} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-60">
                            {processing ? 'Saving…' : (editingStudent ? 'Save Changes' : 'Create Student')}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
