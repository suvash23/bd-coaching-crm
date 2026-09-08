import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';

function StatusPill({ status }) {
    const styles = {
        active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        suspended: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
        trial: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
        expired: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${styles[status] || 'bg-gray-700 text-gray-300'}`}>
            {status}
        </span>
    );
}

export default function CoachingList({ organizations }) {
    const toggleStatus = (org) => {
        const newStatus = org.status === 'active' ? 'suspended' : 'active';
        if (confirm(`Are you sure you want to mark ${org.name} as ${newStatus}?`)) {
            router.post(route('superadmin.organizations.update-status', org.id), { status: newStatus });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold text-white">Coaching List</h2>}>
            <Head title="Coaching List" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Coaching Centers</h1>
                        <p className="text-gray-400 mt-1">Manage global SaaS tenants, subscriptions, and platform health.</p>
                    </div>
                </div>

                {/* Organizations Table */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-700 bg-gray-800/50">
                        <h3 className="text-lg font-bold text-white">All Organizations</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Tenant</th>
                                    <th className="px-6 py-4 font-semibold">Joined At</th>
                                    <th className="px-6 py-4 font-semibold">Students</th>
                                    <th className="px-6 py-4 font-semibold">Subscription & Plan</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {organizations.data.map((org) => (
                                    <tr key={org.id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white tracking-wide">{org.name}</div>
                                            <div className="text-gray-400 text-xs mt-1 font-mono">{org.domain}</div>
                                            <div className="mt-2"><StatusPill status={org.status} /></div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 font-mono text-xs">{org.created_at}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-200 font-semibold">{org.student_count}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {org.subscription ? (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-indigo-400 font-bold uppercase text-xs tracking-wider border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded">
                                                            {org.subscription.package_name}
                                                        </span>
                                                        <StatusPill status={org.subscription.status} />
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {org.subscription.status === 'trial'
                                                            ? `Trial ends: ${org.subscription.trial_ends_at}`
                                                            : (org.subscription.expires_at ? `Renews: ${org.subscription.expires_at}` : 'Active (No Expiry)')}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 italic text-xs">No active plan</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button
                                                onClick={() => toggleStatus(org)}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${org.status === 'active'
                                                    ? 'text-rose-400 border-rose-500/30 hover:bg-rose-500/10'
                                                    : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                                                    }`}
                                            >
                                                {org.status === 'active' ? 'Suspend' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {organizations.data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">No organizations found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {organizations.links && organizations.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-center bg-gray-800/50">
                            <div className="flex flex-wrap gap-1">
                                {organizations.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-indigo-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-700'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
