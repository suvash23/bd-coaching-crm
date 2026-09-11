import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { money } from '@/utils'; // assuming this utility exists, or inline the formatting

export default function CoachingPlan({ currentPackage, currentPlanName, packages, user }) {
    const money = (value) => `৳${Number(value || 0).toLocaleString()}`;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    // Check if user can upgrade/downgrade based on current subscription
    const hasCurrentPlan = !!currentPackage;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold text-white">Coaching Plan</h2>}>
            <Head title="Coaching Plan" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Current Plan Section */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
                    <div className="flex items-start gap-4">
                        {hasCurrentPlan && (
                            <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14m10 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14m10 0h-2m-2 0h-2m-2 0h-2" />
                                </svg>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white">
                                {hasCurrentPlan ? `Current Plan: ${currentPlanName}` : 'No Active Plan'}
                            </h3>
                            {hasCurrentPlan && (
                                <p className="text-sm text-gray-400 mt-1">
                                    {currentPackage?.isUnlimited() ? 'Unlimited students' : `Up to ${currentPackage?.max_students} students`}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Available Packages Section */}
                {!hasCurrentPlan && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Select a Plan</h3>
                        <p className="text-gray-400 mb-6">Choose a pricing tier to get started.</p>
                    </div>
                )}

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages.map((pkg) => {
                        const isSelected = hasCurrentPlan ? pkg.slug === currentPackage.slug : false;
                        const isPopular = pkg.slug === 'pro';

                        return (
                            <div
                                key={pkg.id}
                                className={`relative bg-gray-800 rounded-2xl border flex flex-col p-6 shadow-xl transition-transform hover:-translate-y-1 ${isPopular ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-700'}
                                    ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50' : ''}
                                `}
                            >
                                {isPopular && (
                                    <div className="absolute top-0 right-6 -translate-y-1/2">
                                        <span className="bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-white mb-1 capitalize">{pkg.name}</h3>
                                    <div className="text-gray-400 text-sm">
                                        {pkg.max_students === null ? 'Unlimited students' : `Up to ${pkg.max_students} students`}
                                    </div>
                                </div>

                                <div className="mb-6 flex items-baseline text-white">
                                    <span className="text-3xl font-extrabold tracking-tight">{money(pkg.price)}</span>
                                    <span className="ml-1 text-sm font-medium text-gray-500">/mo</span>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-start text-sm text-gray-300">
                                        <svg className="h-5 w-5 text-emerald-400 shrink-0 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Unlimited Batches & Courses</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-300">
                                        <svg className="h-5 w-5 text-emerald-400 shrink-0 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Full CRM Features</span>
                                    </li>
                                    <li className="flex items-start text-sm text-gray-300">
                                        <svg className="h-5 w-5 text-emerald-400 shrink-0 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{pkg.trial_days} days free trial</span>
                                    </li>
                                </ul>

                                {hasCurrentPlan ? (
                                    <p className="text-xs text-gray-500 mb-4">
                                        You are currently on: {currentPlanName}
                                    </p>
                                ) : (
                                    <button
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${isSelected
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-600'
                                                : 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-600'}
                                            }`}
                                    >
                                        Select Plan
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Selection Modal */}
                {hasCurrentPlan && (
                    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <div className="p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Change Plan</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Select a new plan for your coaching center. Your current plan is <strong className="text-gray-900">{currentPlanName}</strong>.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {packages.map((pkg) => {
                                    const isCurrent = pkg.slug === currentPackage.slug;
                                    return (
                                        <div key={pkg.id} className={`
                                            p-4 rounded-xl border ${isCurrent ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-gray-600 text-gray-300 hover:text-gray-200'}
                                            cursor-pointer transition-colors
                                        `} onClick={() => setSelectedPackage(pkg)}>
                                            <div className="text-white font-medium capitalize">{pkg.name}</div>
                                            <div className="text-xs text-gray-300">{pkg.max_students === null ? 'Unlimited students' : `Up to ${pkg.max_students} students`}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <SecondaryButton onClick={() => setIsModalOpen(false)}>Cancel</SecondaryButton>
                                <PrimaryButton 
                                    onClick={() => {
                                        // TODO: Implement plan change logic
                                        // This would typically involve creating/updating a subscription
                                        setIsModalOpen(false);
                                        router.visit(route('plan'));
                                    }}
                                >
                                    Update Plan
                                </PrimaryButton>
                            </div>
                        </div>
                    </Modal>
                )}

                {(!hasCurrentPlan && selectedPackage) && (
                    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <div className="p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Confirm Plan Selection</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                You are about to select the <strong>{selectedPackage.name}</strong> plan for ৳{Number(selectedPackage.price).toLocaleString()}/mo.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {packages.map((pkg) => {
                                    if (pkg.id === selectedPackage.id) return null;
                                    return (
                                        <div key={pkg.id} className="p-3 rounded border cursor-pointer hover:bg-gray-700">
                                            <div className="text-sm text-gray-400 capitalize">{pkg.name}</div>
                                            <div className="text-xs text-gray-500">৳{Number(pkg.price).toLocaleString()}/mo</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <SecondaryButton onClick={() => setSelectedPackage(null)}>Cancel</SecondaryButton>
                                <PrimaryButton
                                    onClick={() => {
                                        // TODO: Implement plan purchase logic
                                        // This would create a new subscription for the organization
                                        setIsModalOpen(false);
                                        setSelectedPackage(null);
                                        router.visit(route('plan'));
                                    }}
                                >
                                    Purchase Plan
                                </PrimaryButton>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </AuthenticatedLayout>
    );
}