import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { format } from 'date-fns';

export default function Index({ broadcasts, batches, totalStudents }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        type: 'system',
        title: '',
        message: '',
        target_type: 'all',
        batch_ids: [],
    });

    const openModal = () => { clearErrors(); reset(); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setTimeout(() => reset(), 200); };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('broadcasts.store'), { onSuccess: closeModal });
    };

    const toggleBatch = (id) => {
        setData('batch_ids', data.batch_ids.includes(id)
            ? data.batch_ids.filter(b => b !== id)
            : [...data.batch_ids, id]);
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'sms': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
            case 'email': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
            default: return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;
        }
    };

    const estimatedRecipients = data.target_type === 'all' ? totalStudents : '— (Calculated at delivery)';

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold text-gray-800">Broadcasts</h2>}>
            <Head title="Broadcasts" />

            <div className="space-y-6 max-w-6xl">
                {/* Header */}
                <div className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white p-6 rounded-2xl border border-indigo-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Announcements</h3>
                        <p className="text-sm text-gray-500 mt-1">Send SMS, Email, or Dashboard notices to your students.</p>
                    </div>
                    <button onClick={openModal} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        New Broadcast
                    </button>
                </div>

                {/* Broadcasts List */}
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    {broadcasts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                            </div>
                            <p className="text-gray-500 font-medium">No previous broadcasts.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {broadcasts.map(b => (
                                <div key={b.id} className="p-5 flex gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 flex-shrink-0 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                                        {getIconForType(b.type)}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-bold text-gray-900 border-b border-transparent inline-block">
                                                {b.title || <span className="text-gray-400 capitalize">{b.type} Message</span>}
                                            </h4>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                                {format(new Date(b.sent_at), 'MMM d, h:mm a')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2 truncate max-w-2xl">{b.message}</p>
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${b.type === 'sms' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                {b.type.toUpperCase()}
                                            </span>
                                            <span className="text-gray-500 flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                {b.recipients_count} delivered
                                            </span>
                                            <span className="text-gray-500 capitalize flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                Target: {b.target_filters?.target_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">Create Broadcast</h2>
                        <p className="text-sm text-gray-500 mt-1">Send a message to your students.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {['system', 'sms', 'email'].map(t => (
                            <button key={t} type="button" onClick={() => setData('type', t)}
                                className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${data.type === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                {getIconForType(t)}
                                <span className="text-xs font-semibold uppercase">{t}</span>
                            </button>
                        ))}
                    </div>
                    <InputError message={errors.type} className="-mt-4" />

                    {(data.type === 'system' || data.type === 'email') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject / Title</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                placeholder="E.g. Important class update" className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            <InputError message={errors.title} className="mt-1" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea value={data.message} onChange={e => setData('message', e.target.value)} rows="5"
                            placeholder="Write your message here..." className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none font-sans" />
                        <div className="flex justify-between items-center mt-1">
                            <InputError message={errors.message} />
                            {data.type === 'sms' && (
                                <span className={`text-[10px] font-bold ${data.message.length > 160 ? 'text-amber-600' : 'text-gray-400'}`}>
                                    {data.message.length} chars ({(Math.floor(data.message.length / 160) + 1)} SMS)
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Audience</label>
                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" checked={data.target_type === 'all'} onChange={() => setData('target_type', 'all')} className="text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                                <span className="text-sm text-gray-700 font-medium">All Active Students</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" checked={data.target_type === 'batches'} onChange={() => { setData('target_type', 'batches'); setData('batch_ids', []); }} className="text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                                <span className="text-sm text-gray-700 font-medium">Specific Batches</span>
                            </label>
                        </div>

                        {data.target_type === 'batches' && (
                            <div className="flex flex-wrap gap-2 mt-3 p-3 bg-white border border-gray-200 rounded-lg">
                                {batches.length === 0 ? <p className="text-xs text-gray-400 w-full text-center">No active batches available.</p> : batches.map(b => (
                                    <button key={b.id} type="button" onClick={() => toggleBatch(b.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${data.batch_ids.includes(b.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                                        {b.name}
                                    </button>
                                ))}
                            </div>
                        )}
                        <InputError message={errors.batch_ids} className="mt-1" />

                        <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Estimated recipients: <span className="font-bold text-gray-700">{estimatedRecipients}</span>
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing || (data.target_type === 'batches' && data.batch_ids.length === 0)} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 border border-transparent text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            Send Broadcast
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
