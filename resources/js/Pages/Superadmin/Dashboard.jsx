import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';

function StatCard({ label, value, icon, iconBg, iconColor }) {
    return (
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-md">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBg} ${iconColor}`}>
                {icon}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm font-medium text-gray-400">{label}</div>
        </div>
    );
}

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

export default function SuperAdminDashboard({ organizations, stats }) {
    const toggleStatus = (org) => {
        const newStatus = org.status === 'active' ? 'suspended' : 'active';
        if (confirm(`Are you sure you want to mark ${org.name} as ${newStatus}?`)) {
            router.post(route('superadmin.organizations.update-status', org.id), { status: newStatus });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold text-white">Superadmin Headquarters</h2>}>
            <Head title="Superadmin Dashboard" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Overview</h1>
                        <p className="text-gray-400 mt-1">Manage global SaaS tenants, subscriptions, and platform health.</p>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Total Organizations"
                        value={stats.total_organizations}
                        iconBg="bg-blue-500/20" iconColor="text-blue-400"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                    />
                    <StatCard
                        label="Active Tenants"
                        value={stats.active_organizations}
                        iconBg="bg-emerald-500/20" iconColor="text-emerald-400"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <StatCard
                        label="Total Students"
                        value={stats.total_students_platform}
                        iconBg="bg-indigo-500/20" iconColor="text-indigo-400"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    />
                    <StatCard
                        label="Active Subscriptions"
                        value={stats.active_subscriptions}
                        iconBg="bg-amber-500/20" iconColor="text-amber-400"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                    />
                </div>

                {/* Organizations Table */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-700 bg-gray-800/50">
                        <h3 className="text-lg font-bold text-white">Organizations Database</h3>
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
                                {organizations.map((org) => (
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
                                {organizations.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">No organizations found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
