import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateOrganizationForm from './Partials/UpdateOrganizationForm';

export default function Edit({ mustVerifyEmail, status, auth, organization }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800 leading-tight">Settings</h2>}>
            <Head title="Settings" />

            <div className="max-w-4xl py-6 space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Account Settings</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage your administrator profile, security preferences, and organization details.</p>
                </div>

                <div className="bg-white p-6 shadow-sm sm:rounded-2xl border border-gray-100">
                    <UpdateOrganizationForm organization={organization} className="max-w-xl" />
                </div>

                <div className="bg-white p-6 shadow-sm sm:rounded-2xl border border-gray-100">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="bg-white p-6 shadow-sm sm:rounded-2xl border border-gray-100">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                {auth.user.role === 'superadmin' && (
                    <div className="bg-white p-6 shadow-sm sm:rounded-2xl border border-gray-100">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
