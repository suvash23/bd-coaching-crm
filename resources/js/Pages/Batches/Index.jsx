import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_ABBR = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };

const DAY_COLORS = {
    Monday: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
    Tuesday: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
    Wednesday: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    Thursday: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
    Friday: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Saturday: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    Sunday: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
};

function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h, 10);
    const suffix = hr >= 12 ? 'PM' : 'AM';
    const hr12 = hr % 12 || 12;
    return `${hr12}:${m} ${suffix}`;
}

// ── Schedule Rule inline form ─────────────────────────────────────────────────
function SchedulePanel({ batch }) {
    const { data, setData, post, reset, errors, processing, clearErrors } = useForm({
        day_of_week: 'Monday',
        start_time: '',
        end_time: '',
    });

    const handleAdd = (e) => {
        e.preventDefault();
        post(route('batches.schedule-rules.store', batch.id), {
            onSuccess: () => { reset(); clearErrors(); },
            preserveScroll: true,
        });
    };

    const handleDelete = (ruleId) => {
        router.delete(route('batches.schedule-rules.destroy', { batch: batch.id, scheduleRule: ruleId }), {
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Weekly Schedule Rules
            </h4>

            {/* Existing rules */}
            {batch.schedule_rules.length === 0 ? (
                <p className="text-sm text-gray-400 italic mb-4">No schedule rules yet. Add one below to start generating class sessions.</p>
            ) : (
                <div className="flex flex-wrap gap-2 mb-4">
                    {batch.schedule_rules.map((rule) => (
                        <div key={rule.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${DAY_COLORS[rule.day_of_week]}`}>
                            <span>{DAY_ABBR[rule.day_of_week]}</span>
                            <span className="text-gray-600 font-normal">{formatTime(rule.start_time)} – {formatTime(rule.end_time)}</span>
                            <button
                                onClick={() => handleDelete(rule.id)}
                                className="ml-1 text-gray-400 hover:text-rose-500 transition-colors"
                                title="Remove rule"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add rule form */}
            <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
                <div>
                    <InputLabel value="Day" className="text-xs text-gray-500 mb-1" />
                    <select
                        value={data.day_of_week}
                        onChange={(e) => setData('day_of_week', e.target.value)}
                        className="border-gray-300 bg-white text-gray-900 text-sm rounded-lg focus:border-indigo-500 focus:ring-indigo-500 py-1.5 pr-8 pl-3"
                    >
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <InputError message={errors.day_of_week} className="mt-1 text-xs" />
                </div>

                <div>
                    <InputLabel value="Start Time" className="text-xs text-gray-500 mb-1" />
                    <input
                        type="time"
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                        required
                        className="border-gray-300 bg-white text-gray-900 text-sm rounded-lg focus:border-indigo-500 focus:ring-indigo-500 py-1.5 px-3"
                    />
                    <InputError message={errors.start_time} className="mt-1 text-xs" />
                </div>

                <div>
                    <InputLabel value="End Time" className="text-xs text-gray-500 mb-1" />
                    <input
                        type="time"
                        value={data.end_time}
                        onChange={(e) => setData('end_time', e.target.value)}
                        required
                        className="border-gray-300 bg-white text-gray-900 text-sm rounded-lg focus:border-indigo-500 focus:ring-indigo-500 py-1.5 px-3"
                    />
                    <InputError message={errors.end_time} className="mt-1 text-xs" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-sm"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Rule
                </button>
            </form>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Index({ batches, courses }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const [expandedBatch, setExpandedBatch] = useState(null);

    const { data, setData, post, put, reset, errors, processing, clearErrors } = useForm({
        course_id: courses.length > 0 ? courses[0].id : '',
        name: '',
        capacity: 20,
        status: 'active',
    });

    const openModal = (batch = null) => {
        clearErrors();
        if (batch) {
            setEditingBatch(batch);
            setData({ course_id: batch.course_id, name: batch.name, capacity: batch.capacity, status: batch.status });
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
            put(route('batches.update', editingBatch.id), { onSuccess: () => closeModal() });
        } else {
            post(route('batches.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (batchId) => {
        if (confirm('Are you sure you want to delete this batch?')) {
            router.delete(route('batches.destroy', batchId));
        }
    };

    const toggleExpand = (batchId) => {
        setExpandedBatch(prev => prev === batchId ? null : batchId);
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Batches</h2>}>
            <Head title="Batches" />

            <div className="max-w-7xl">
                {/* Header & Actions */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Manage Batches</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Organize student batches, associate them with courses, and configure weekly schedule rules.
                        </p>
                    </div>
                    <PrimaryButton onClick={() => openModal()} className="shadow-sm">
                        <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Batch
                    </PrimaryButton>
                </div>

                {courses.length === 0 && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md">
                        <p className="text-sm text-yellow-700">
                            You don't have any courses yet. You must create a course before you can create a batch.
                        </p>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Batch Name</th>
                                    <th className="px-6 py-4 font-medium">Course</th>
                                    <th className="px-6 py-4 font-medium">Capacity</th>
                                    <th className="px-6 py-4 font-medium">Schedule Rules</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {batches.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                                            No batches found. Click "New Batch" to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    batches.map((batch) => (
                                        <React.Fragment key={batch.id}>
                                            <tr className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    {batch.name}
                                                </td>
                                                <td className="px-6 py-4">{batch.course?.name || 'Deleted Course'}</td>
                                                <td className="px-6 py-4 font-mono font-medium">{batch.capacity} Students</td>
                                                <td className="px-6 py-4">
                                                    {batch.schedule_rules.length === 0 ? (
                                                        <span className="text-xs text-gray-400 italic">None</span>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-1">
                                                            {batch.schedule_rules.slice(0, 3).map(r => (
                                                                <span key={r.id} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${DAY_COLORS[r.day_of_week]}`}>
                                                                    {DAY_ABBR[r.day_of_week]}
                                                                </span>
                                                            ))}
                                                            {batch.schedule_rules.length > 3 && (
                                                                <span className="text-xs text-gray-400">+{batch.schedule_rules.length - 3}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                                        ${batch.status === 'active'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-rose-50 text-rose-700'}`}>
                                                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    <button
                                                        onClick={() => toggleExpand(batch.id)}
                                                        className={`font-medium text-sm transition-colors ${expandedBatch === batch.id ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-600'}`}
                                                        title="Manage schedule rules"
                                                    >
                                                        <span className="flex items-center gap-1 justify-end">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            Schedule
                                                        </span>
                                                    </button>
                                                    <button onClick={() => openModal(batch)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Edit</button>
                                                    <button onClick={() => handleDelete(batch.id)} className="text-sm font-medium text-rose-500 hover:text-rose-700">Delete</button>
                                                </td>
                                            </tr>

                                            {/* Expandable Schedule Panel */}
                                            {expandedBatch === batch.id && (
                                                <tr className="border-b border-gray-100">
                                                    <td colSpan="6" className="p-0">
                                                        <SchedulePanel batch={batch} />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create / Edit Batch Modal */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">
                        {editingBatch ? 'Edit Batch' : 'Create New Batch'}
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="course_id" value="Associated Course" />
                            <select
                                id="course_id"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full text-sm"
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
                            <TextInput id="name" type="text" className="mt-1 block w-full text-sm" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Afternoon Batch - 4PM" required />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="capacity" value="Student Capacity" />
                                <TextInput id="capacity" type="number" min="1" className="mt-1 block w-full text-sm" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} required />
                                <InputError message={errors.capacity} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="status" value="Batch Status" />
                                <select id="status" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full text-sm" value={data.status} onChange={(e) => setData('status', e.target.value)} required>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} disabled={processing}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing || courses.length === 0}>
                            {editingBatch ? 'Update Batch' : 'Create Batch'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
