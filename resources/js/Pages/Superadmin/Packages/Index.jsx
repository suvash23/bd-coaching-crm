import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Packages({ packages }) {
    const money = (value) => `৳${Number(value || 0).toLocaleString()}`;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold text-white">Packages</h2>}>
            <Head title="SaaS Packages" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">SaaS Subscription Plans</h1>
                        <p className="text-gray-400 mt-1">View the available pricing tiers and student limits.</p>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages.map((pkg) => {
                        const isPopular = pkg.slug === 'pro';
                        return (
                            <div
                                key={pkg.id}
                                className={`relative bg-gray-800 rounded-2xl border flex flex-col p-6 shadow-xl transition-transform hover:-translate-y-1 ${isPopular ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-700'
                                    }`}
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

                                <button
                                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${isPopular
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-600'
                                            : 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-600'
                                        }`}
                                >
                                    Edit Plan
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
