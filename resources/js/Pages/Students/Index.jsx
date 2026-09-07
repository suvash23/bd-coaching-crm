import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import DiscountModal from './DiscountModal';

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ student, size = 'md' }) => {
    const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-xl' };
    const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (student.photo_url) {
        return <img src={student.photo_url} alt={student.name} className={`${sizes[size]} rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm`} />;
    }
    return (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center font-bold text-white flex-shrink-0 border-2 border-white shadow-sm`}>
            {initials}
        </div>
    );
};

const StatusBadge = ({ status }) => (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold
        ${status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
        {status}
    </span>
);

const GridIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const ListIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

// ── Card view item ─────────────────────────────────────────────────────────────
const StudentCard = ({ student, onEdit, onDelete, onPrint, onDiscount }) => (
    <div className="group bg-white border border-gray-100 hover:border-indigo-200 rounded-2xl p-5 flex flex-col transition-all shadow-sm hover:shadow-md">
        <div className="flex items-start gap-4 mb-4">
            <Avatar student={student} size="lg" />
            <div className="flex-1 min-w-0 pt-1">
                <h4 className="font-semibold text-gray-900 truncate">{student.name}</h4>
                {student.student_id_number && (
                    <span className="text-xs font-mono text-gray-400">#{student.student_id_number}</span>
                )}
                <div className="mt-2">
                    <StatusBadge status={student.status} />
                </div>
            </div>
        </div>

        <div className="space-y-1.5 text-xs text-gray-500 flex-1">
            {student.phone && (
                <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {student.phone}
                </div>
            )}
            {student.guardian_name && (
                <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {student.guardian_name} <span className="text-gray-300">(Guardian)</span>
                </div>
            )}
            {student.batches.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                    {student.batches.map(b => (
                        <span key={b.id} className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs">
                            {b.name}
                        </span>
                    ))}
                </div>
            )}
        </div>

        <div className="flex gap-1 mt-4 pt-4 border-t border-gray-100 justify-center">
            <button onClick={() => onPrint(student)} title="Print ID"
                className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            </button>
            <button onClick={() => onDiscount(student)} title="Discounts"
                className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <button onClick={() => onEdit(student)} title="Edit"
                className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button onClick={() => onDelete(student)} title="Delete"
                className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
        </div>
    </div>
);

// ── List view item ─────────────────────────────────────────────────────────────
const StudentRow = ({ student, onEdit, onDelete, onPrint, onDiscount }) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-5 py-3.5">
            <div className="flex items-center gap-3">
                <Avatar student={student} size="sm" />
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{student.name}</div>
                    {student.student_id_number && (
                        <div className="text-xs font-mono text-gray-400">#{student.student_id_number}</div>
                    )}
                </div>
            </div>
        </td>
        <td className="px-5 py-3.5 text-sm text-gray-500">{student.phone || <span className="text-gray-300">—</span>}</td>
        <td className="px-5 py-3.5 text-sm text-gray-500">
            {student.guardian_name
                ? <>{student.guardian_name} {student.guardian_phone && <span className="text-gray-400 text-xs">· {student.guardian_phone}</span>}</>
                : <span className="text-gray-300">—</span>}
        </td>
        <td className="px-5 py-3.5">
            {student.batches.length > 0
                ? <div className="flex flex-wrap gap-1">
                    {student.batches.map(b => (
                        <span key={b.id} className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs">{b.name}</span>
                    ))}
                </div>
                : <span className="text-gray-300 text-sm">—</span>}
        </td>
        <td className="px-5 py-3.5">
            <StatusBadge status={student.status} />
        </td>
        <td className="px-5 py-3.5 text-right">
            <div className="flex items-center justify-end gap-2">
                <button onClick={() => onDiscount(student)} title="Discounts" className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <button onClick={() => onPrint(student)} title="Print ID" className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                </button>
                <button onClick={() => onEdit(student)} title="Edit" className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => onDelete(student)} title="Delete" className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        </td>
    </tr>
);

const EmptyState = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        </div>
        <p className="text-gray-500 font-medium">No students yet</p>
        <p className="text-gray-400 text-sm mt-1">Click "Add Student" to get started.</p>
    </div>
);

export default function Index({ students, batches, courses, filters, organization }) {
    const savedView = typeof window !== 'undefined' ? (localStorage.getItem('students_view') ?? 'card') : 'card';
    const [viewMode, setViewMode] = useState(savedView);
    const switchView = (mode) => { setViewMode(mode); localStorage.setItem('students_view', mode); };

    // Print state
    const [printingStudent, setPrintingStudent] = useState(null);
    const triggerPrint = (student) => {
        setPrintingStudent(student);
        setTimeout(() => window.print(), 150);
    };

    // Search state
    const [search, setSearch] = useState(filters?.search || '');
    let searchTimeout = null;
    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            router.get(route('students.index'), { search: val }, { preserveState: true, replace: true });
        }, 300);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [discountStudent, setDiscountStudent] = useState(null);

    const { data, setData, post, reset, errors, processing, clearErrors } = useForm({
        name: '', email: '', phone: '', guardian_name: '', guardian_email: '', guardian_phone: '',
        student_id_number: '', status: 'active', batch_ids: [], photo: null, _method: 'POST',
    });

    const openCreate = () => {
        clearErrors(); setEditingStudent(null); setPhotoPreview(null);
        setData({ name: '', email: '', phone: '', guardian_name: '', guardian_email: '', guardian_phone: '', student_id_number: '', status: 'active', batch_ids: [], photo: null, _method: 'POST' });
        setIsModalOpen(true);
    };
    const openEdit = (student) => {
        clearErrors(); setEditingStudent(student); setPhotoPreview(student.photo_url || null);
        setData({ name: student.name, email: student.email || '', phone: student.phone || '', guardian_name: student.guardian_name || '', guardian_email: student.guardian_email || '', guardian_phone: student.guardian_phone || '', student_id_number: student.student_id_number || '', status: student.status, batch_ids: student.batches.map(b => b.id), photo: null, _method: 'PUT' });
        setIsModalOpen(true);
    };
    const closeModal = () => { setIsModalOpen(false); setTimeout(() => { setEditingStudent(null); setPhotoPreview(null); reset(); }, 200); };
    const handlePhotoChange = (e) => { const f = e.target.files[0]; if (f) { setData('photo', f); setPhotoPreview(URL.createObjectURL(f)); } };
    const handleSubmit = (e) => { e.preventDefault(); post(editingStudent ? route('students.update', editingStudent.id) : route('students.store'), { forceFormData: true, onSuccess: closeModal }); };
    const handleDelete = (student) => { if (confirm(`Delete ${student.name}? This cannot be undone.`)) router.delete(route('students.destroy', student.id)); };
    const toggleBatch = (id) => setData('batch_ids', data.batch_ids.includes(id) ? data.batch_ids.filter(x => x !== id) : [...data.batch_ids, id]);

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold text-gray-800">Students</h2>}>
            <Head title="Students" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Student Roster</h3>
                        <p className="text-sm text-gray-400 mt-1">{students.length} student{students.length !== 1 ? 's' : ''} enrolled</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search by name, ID, phone..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 w-64 shadow-sm h-10"
                            />
                        </div>
                        {/* View Toggle */}
                        <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden bg-white p-0.5 gap-0.5 shadow-sm h-10">
                            <button onClick={() => switchView('card')} title="Card view"
                                className={`p-2 rounded-lg transition-all ${viewMode === 'card' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                                <GridIcon />
                            </button>
                            <button onClick={() => switchView('list')} title="List view"
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                                <ListIcon />
                            </button>
                        </div>
                        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Add Student
                        </button>
                    </div>
                </div>

                {/* Student list/cards */}
                {students.length === 0 ? <EmptyState /> : viewMode === 'card' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {students.map(s => <StudentCard key={s.id} student={s} onEdit={openEdit} onDelete={handleDelete} onPrint={() => triggerPrint(s)} onDiscount={(s) => { setDiscountStudent(s); setIsDiscountOpen(true); }} />)}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider bg-gray-50">
                                        <th className="px-5 py-3 text-left font-medium">Student</th>
                                        <th className="px-5 py-3 text-left font-medium">Phone</th>
                                        <th className="px-5 py-3 text-left font-medium">Guardian</th>
                                        <th className="px-5 py-3 text-left font-medium">Batches</th>
                                        <th className="px-5 py-3 text-left font-medium">Status</th>
                                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(s => <StudentRow key={s.id} student={s} onEdit={openEdit} onDelete={handleDelete} onPrint={() => triggerPrint(s)} onDiscount={(s) => { setDiscountStudent(s); setIsDiscountOpen(true); }} />)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Print ID Card (only visible when printing) ── */}
            {printingStudent && (
                <div className="hidden print:flex fixed inset-0 bg-white items-start justify-center z-50 pt-10">
                    <div className="w-[300px] border-2 border-gray-800 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center text-center">
                        {organization?.logo_url ? (
                            <img src={organization.logo_url} alt="Logo" className="w-16 h-16 object-contain mb-3" />
                        ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-xl mb-3 flex items-center justify-center font-bold text-gray-400 text-sm">
                                {organization?.name?.substring(0, 3).toUpperCase()}
                            </div>
                        )}
                        <h2 className="text-base font-black text-gray-900 uppercase tracking-wide leading-tight">{organization?.name}</h2>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-3 mb-4">Official Student ID</p>

                        <img
                            src={printingStudent.photo_url || ''}
                            alt={printingStudent.name}
                            className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 mb-4"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{printingStudent.name}</h3>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-gray-800 font-mono font-bold text-sm mb-3">
                            {printingStudent.student_id_number}
                        </span>

                        {printingStudent.phone && (
                            <p className="text-xs text-gray-600 font-medium mb-1">📞 {printingStudent.phone}</p>
                        )}
                        {printingStudent.batches?.length > 0 && (
                            <p className="text-xs text-gray-500">{printingStudent.batches.map(b => b.name).join(', ')}</p>
                        )}

                        <div className="absolute bottom-0 inset-x-0 h-4 bg-indigo-600"></div>
                    </div>
                </div>
            )}

            {/* ── Create / Edit Modal ── */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">{editingStudent ? 'Edit Student' : 'New Student'}</h2>
                    <div className="flex items-center gap-5 mb-6">
                        <div>
                            {photoPreview ? <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200" />
                                : <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Student Photo</label>
                            <label className="cursor-pointer px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-400 transition-colors">
                                <span>Choose image or take photo…</span>
                                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="hidden" />
                            </label>
                            <p className="text-xs text-gray-400 mt-1">JPEG, PNG or WebP. Max 2MB.</p>
                            <InputError message={errors.photo} className="mt-1" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Full Name *', key: 'name', required: true, placeholder: 'e.g. Rahim Uddin' },
                            { label: 'Student ID', key: 'student_id_number', placeholder: 'Auto-generated if blank' },
                            { label: 'Student Email', key: 'email', placeholder: 'student@example.com' },
                            { label: 'Phone', key: 'phone', placeholder: '017XXXXXXXX' },
                            { type: 'divider', title: 'Guardian Information' },
                            { label: "Guardian's Name", key: 'guardian_name', placeholder: 'Parent / Guardian' },
                            { label: "Guardian's Email", key: 'guardian_email', placeholder: 'guardian@example.com' },
                            { label: "Guardian's Phone", key: 'guardian_phone', placeholder: '017XXXXXXXX' },
                        ].map((f, i) => f.type === 'divider' ? (
                            <div key={`div-${i}`} className="sm:col-span-2 pt-4 pb-1 border-t border-gray-100 mt-2">
                                <h4 className="text-sm font-semibold text-gray-800">{f.title}</h4>
                            </div>
                        ) : (
                            <div key={f.key} className={f.key === 'name' ? 'sm:col-span-2' : ''}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                                <input type="text" value={data[f.key]} required={f.required} placeholder={f.placeholder}
                                    onChange={e => setData(f.key, e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                                <InputError message={errors[f.key]} className="mt-1" />
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    {batches.length > 0 && (
                        <div className="mt-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Batches</label>
                            <div className="flex flex-wrap gap-2">
                                {batches.map(b => (
                                    <button key={b.id} type="button" onClick={() => toggleBatch(b.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                                            ${data.batch_ids.includes(b.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:border-indigo-400'}`}>
                                        {b.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={processing} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60">
                            {processing ? 'Saving…' : (editingStudent ? 'Save Changes' : 'Create Student')}
                        </button>
                    </div>
                </form>
            </Modal>

            <DiscountModal
                show={isDiscountOpen}
                onClose={() => setIsDiscountOpen(false)}
                student={discountStudent}
                courses={courses}
            />
        </AuthenticatedLayout>
    );
}
