import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

function StatusPill({ status }) {
    const styles = {
        active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        suspended: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
        trial: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
        expired: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
}

const money = (value) => `৳${Number(value || 0).toLocaleString()}`;

export default function CoachingList({ organizations, packages }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isExtendOpen, setIsExtendOpen] = useState(false);
    const [isChangePackageOpen, setIsChangePackageOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);

    const createForm = useForm({
        name: '', email: '', phone: '', short_code: '',
        admin_name: '', admin_email: '', admin_password: ''
    });

    const editForm = useForm({
        name: '', email: '', phone: '', short_code: ''
    });

    const extendForm = useForm({ days: 14 });
    const changePackageForm = useForm({ package_id: '' });

    const openEdit = (org) => {
        setSelectedOrg(org);
        editForm.setData({
            name: org.name, email: org.email, phone: org.phone || '', short_code: org.short_code
        });
        setIsEditOpen(true);
    };

    const openExtend = (org) => {
        setSelectedOrg(org);
        extendForm.setData({ days: 14 });
        setIsExtendOpen(true);
    };

    const openChangePackage = (org) => {
        setSelectedOrg(org);
        changePackageForm.setData({ package_id: org.subscription?.package_id || '' });
        setIsChangePackageOpen(true);
    };

    const toggleStatus = (org) => {
        const newStatus = org.status === 'active' ? 'suspended' : 'active';
        if (confirm(`Are you sure you want to mark ${org.name} as ${newStatus}?`)) {
            router.post(route('superadmin.organizations.update-status', org.id), { status: newStatus });
        }
    };

    const deleteOrg = (org) => {
        if (confirm(`WARNING: Are you sure you want to delete ${org.name}? This will soft-delete the organization.`)) {
            router.delete(route('superadmin.organizations.destroy', org.id));
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('superadmin.organizations.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            }
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editForm.put(route('superadmin.organizations.update', selectedOrg.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                setSelectedOrg(null);
            }
        });
    };

    const handleExtend = (e) => {
        e.preventDefault();
        extendForm.post(route('superadmin.organizations.extend-trial', selectedOrg.id), {
            onSuccess: () => {
                setIsExtendOpen(false);
                extendForm.reset();
                setSelectedOrg(null);
            }
        });
    };

    const handleChangePackage = (e) => {
        e.preventDefault();
        changePackageForm.post(route('superadmin.organizations.change-package', selectedOrg.id), {
            onSuccess: () => {
                setIsChangePackageOpen(false);
                changePackageForm.reset();
                setSelectedOrg(null);
            }
        });
    };

    const handleImpersonate = (org) => {
        if (confirm(`Are you sure you want to log in as an administrator for ${org.name}?`)) {
            router.post(route('superadmin.organizations.impersonate', org.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold text-gray-800">Coaching List</h2>}>
            <Head title="Coaching List" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Coaching Centers</h1>
                        <p className="text-gray-500 mt-1">Manage global SaaS tenants, subscriptions, and platform health.</p>
                    </div>
                    <PrimaryButton onClick={() => setIsCreateOpen(true)}>
                        + Add Coaching Center
                    </PrimaryButton>
                </div>

                {/* Organizations Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">All Organizations</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-y border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Tenant</th>
                                    <th className="px-6 py-3 font-medium">Joined At</th>
                                    <th className="px-6 py-3 font-medium">Students</th>
                                    <th className="px-6 py-3 font-medium">Revenue</th>
                                    <th className="px-6 py-3 font-medium">Subscription & Plan</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {organizations.data.map((org) => (
                                    <tr key={org.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{org.name}</div>
                                            <div className="text-gray-400 text-xs mt-0.5 font-mono">{org.domain || org.short_code}</div>
                                            <div className="mt-1.5"><StatusPill status={org.status} /></div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{new Date(org.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 font-semibold">{org.student_count || 0}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 font-semibold">{money(org.total_revenue)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {org.subscription ? (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-indigo-700 font-bold uppercase text-xs tracking-wider border border-indigo-200 bg-indigo-50 px-2 py-0.5 rounded">
                                                            {org.subscription.package_name || 'Unknown'}
                                                        </span>
                                                        <StatusPill status={org.subscription.status} />
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {org.subscription.status === 'trial'
                                                            ? `Will Expire in ${org.subscription.trial_days_remaining} days`
                                                            : (org.subscription.expires_at ? `Renews: ${org.subscription.expires_at}` : 'Active (No Expiry)')}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">No active plan</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleImpersonate(org)}
                                                className="text-xs font-semibold px-2 py-1.5 rounded-lg border text-emerald-700 border-emerald-300 hover:bg-emerald-50 transition-colors"
                                                title="Login As Tenant Admin"
                                            >
                                                Login As
                                            </button>
                                            <button
                                                onClick={() => openChangePackage(org)}
                                                className="text-xs font-semibold px-2 py-1.5 rounded-lg border text-purple-600 border-purple-200 hover:bg-purple-50 transition-colors"
                                                title="Change Package"
                                            >
                                                Package
                                            </button>
                                            <button
                                                onClick={() => openExtend(org)}
                                                className="text-xs font-semibold px-2 py-1.5 rounded-lg border text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition-colors"
                                                title="Extend Trial"
                                            >
                                                Extend
                                            </button>
                                            <button
                                                onClick={() => openEdit(org)}
                                                className="text-xs font-semibold px-2 py-1.5 rounded-lg border text-blue-600 border-blue-200 hover:bg-blue-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(org)}
                                                className={`text-xs font-semibold px-2 py-1.5 rounded-lg border transition-colors ${org.status === 'active'
                                                    ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                                                    : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                                                    }`}
                                            >
                                                {org.status === 'active' ? 'Suspend' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => deleteOrg(org)}
                                                className="text-xs font-semibold px-2 py-1.5 rounded-lg border text-red-600 border-red-200 hover:bg-red-50 transition-colors"
                                            >
                                                Delete
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
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center">
                            <div className="flex flex-wrap gap-1">
                                {organizations.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-indigo-600 text-white font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            <Modal show={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
                <form onSubmit={handleCreate} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Add Coaching Center</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="name" value="Organization Name" />
                            <TextInput id="name" value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={createForm.errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="short_code" value="Short Code" />
                            <TextInput id="short_code" value={createForm.data.short_code} onChange={e => createForm.setData('short_code', e.target.value.toUpperCase())} className="mt-1 block w-full" maxLength={10} required />
                            <InputError message={createForm.errors.short_code} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" value="Org Email" />
                            <TextInput id="email" type="email" value={createForm.data.email} onChange={e => createForm.setData('email', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={createForm.errors.email} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="phone" value="Org Phone" />
                            <TextInput id="phone" value={createForm.data.phone} onChange={e => createForm.setData('phone', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={createForm.errors.phone} className="mt-2" />
                        </div>
                    </div>

                    <h3 className="text-md font-bold text-gray-800 mt-6 mb-2">Initial Admin User</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="admin_name" value="Admin Name" />
                            <TextInput id="admin_name" value={createForm.data.admin_name} onChange={e => createForm.setData('admin_name', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={createForm.errors.admin_name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="admin_email" value="Admin Email" />
                            <TextInput id="admin_email" type="email" value={createForm.data.admin_email} onChange={e => createForm.setData('admin_email', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={createForm.errors.admin_email} className="mt-2" />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="admin_password" value="Admin Password" />
                            <TextInput id="admin_password" type="password" value={createForm.data.admin_password} onChange={e => createForm.setData('admin_password', e.target.value)} className="mt-1 block w-full" required minLength={8} />
                            <InputError message={createForm.errors.admin_password} className="mt-2" />
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCreateOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={createForm.processing}>Create Organization</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={isEditOpen} onClose={() => setIsEditOpen(false)}>
                <form onSubmit={handleEdit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Coaching Center</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="edit_name" value="Organization Name" />
                            <TextInput id="edit_name" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={editForm.errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="edit_short_code" value="Short Code" />
                            <TextInput id="edit_short_code" value={editForm.data.short_code} onChange={e => editForm.setData('short_code', e.target.value.toUpperCase())} className="mt-1 block w-full" maxLength={10} required />
                            <InputError message={editForm.errors.short_code} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="edit_email" value="Email" />
                            <TextInput id="edit_email" type="email" value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={editForm.errors.email} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="edit_phone" value="Phone" />
                            <TextInput id="edit_phone" value={editForm.data.phone} onChange={e => editForm.setData('phone', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={editForm.errors.phone} className="mt-2" />
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsEditOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={editForm.processing}>Save Changes</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Extend Trial Modal */}
            <Modal show={isExtendOpen} onClose={() => setIsExtendOpen(false)}>
                <form onSubmit={handleExtend} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Extend Trial</h2>
                    <p className="text-sm text-gray-600 mb-4">Extend the free trial for {selectedOrg?.name}.</p>
                    
                    <div>
                        <InputLabel htmlFor="days" value="Days to Add" />
                        <TextInput id="days" type="number" min="1" value={extendForm.data.days} onChange={e => extendForm.setData('days', e.target.value)} className="mt-1 block w-full" required />
                        <InputError message={extendForm.errors.days} className="mt-2" />
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsExtendOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={extendForm.processing}>Extend Trial</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Change Package Modal */}
            <Modal show={isChangePackageOpen} onClose={() => setIsChangePackageOpen(false)}>
                <form onSubmit={handleChangePackage} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Change Package</h2>
                    <p className="text-sm text-gray-500 mb-5">
                        Assign a new subscription package to <span className="font-semibold text-gray-800">{selectedOrg?.name}</span>.
                    </p>

                    <div className="space-y-3">
                        {packages?.map((pkg) => (
                            <label
                                key={pkg.id}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                                    String(changePackageForm.data.package_id) === String(pkg.id)
                                        ? 'border-indigo-400 bg-indigo-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="package_id"
                                    value={pkg.id}
                                    checked={String(changePackageForm.data.package_id) === String(pkg.id)}
                                    onChange={() => changePackageForm.setData('package_id', pkg.id)}
                                    className="text-indigo-600"
                                />
                                <span className="font-medium text-gray-800 capitalize">{pkg.name}</span>
                            </label>
                        ))}
                        <InputError message={changePackageForm.errors.package_id} className="mt-1" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsChangePackageOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={changePackageForm.processing || !changePackageForm.data.package_id}>
                            Assign Package
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
