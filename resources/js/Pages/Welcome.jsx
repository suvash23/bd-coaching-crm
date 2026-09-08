import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Welcome({ auth, packages }) {
    const money = (value) => `৳${Number(value || 0).toLocaleString()}`;

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden relative">
            <Head title="Welcome | Next-Gen Coaching CRM" />

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-slate-950">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none"></div>
            </div>

            {/* Navbar */}
            <nav className="w-full relative z-10 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="w-10 h-10 rounded-xl shadow-lg shadow-indigo-500/20" />
                        <span className="text-xl font-bold tracking-tight text-white">Coaching<span className="text-indigo-400">CRM</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-500/30">
                                Open Dashboard
                            </Link>
                        ) : (
                            <>
                                <a href="#pricing" className="px-4 py-2 text-slate-300 hover:text-white transition-colors font-medium hidden sm:inline-block">Pricing</a>
                                <Link href={route('login')} className="px-4 py-2 text-slate-300 hover:text-white transition-colors font-medium">Log in</Link>
                                <Link href={route('register')} className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all backdrop-blur-sm">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium mb-8 backdrop-blur-sm shadow-xl shadow-black/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    The New Standard in EdTech CRM
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
                    Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Coaching Center</span><br />With Zero Chaos
                </h1>

                <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
                    A premium CRM designed specifically for academies. Automate class schedules, track real-time attendance, and handle fee collections gracefully without the administrative headache.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                    <Link href={auth.user ? route('dashboard') : route('register')} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-lg transition-all shadow-xl shadow-indigo-500/25 hover:-translate-y-1">
                        Start for Free Today
                    </Link>
                    <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-bold text-lg transition-all backdrop-blur-sm hover:-translate-y-1 group">
                        Explore Features <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </a>
                </div>
            </main>

            {/* Features Preview */}
            <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5 mt-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-md hover:border-indigo-500/50 transition-colors group shadow-2xl shadow-black/40">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-indigo-500/10">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Student Hub</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Organize students into batches with absolute ease. Access instant overviews of enrollments, academic status, and detailed contact traces securely isolated to your organization.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-md hover:border-emerald-500/50 transition-colors group shadow-2xl shadow-black/40">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-emerald-500/10">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Smart Scheduling</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Set up rules once, and let the robust engine generate daily class sessions dynamically. Includes an incredibly fast, frictionless quick-mark attendance UI.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-md hover:border-sky-500/50 transition-colors group shadow-2xl shadow-black/40">
                        <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-sky-500/10">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Financial Ledger</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Never miss a payment again. Auto-generate monthly recurring fees, seamlessly track partial balances, and issue beautiful pristine printable receipts instantly.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5 mt-12 bg-slate-950/30">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-slate-400 max-w-xl mx-auto">Start for free and scale as your coaching center grows. No hidden fees or surprise charges.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages && packages.map((pkg) => {
                        const isPopular = pkg.slug === 'pro';
                        return (
                            <div
                                key={pkg.id}
                                className={`relative bg-slate-900 rounded-3xl border flex flex-col p-8 shadow-2xl transition-transform hover:-translate-y-2 ${isPopular ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-indigo-500/20' : 'border-slate-800'
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
                                    <h3 className="text-xl font-bold text-white mb-1 capitalize">{pkg.name}</h3>
                                    <div className="text-slate-400 text-sm">
                                        {pkg.max_students === null ? 'Unlimited students' : `Up to ${pkg.max_students} students`}
                                    </div>
                                </div>

                                <div className="mb-8 flex items-baseline text-white">
                                    <span className="text-4xl font-extrabold tracking-tight">{money(pkg.price)}</span>
                                    <span className="ml-1 text-sm font-medium text-slate-500">/mo</span>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-start text-sm text-slate-300">
                                        <svg className="h-5 w-5 text-emerald-400 shrink-0 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Unlimited Batches & Courses</span>
                                    </li>
                                    <li className="flex items-start text-sm text-slate-300">
                                        <svg className="h-5 w-5 text-emerald-400 shrink-0 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Full CRM Features</span>
                                    </li>
                                    <li className="flex items-start text-sm text-slate-300">
                                        <svg className="h-5 w-5 text-emerald-400 shrink-0 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{pkg.trial_days} days free trial</span>
                                    </li>
                                </ul>

                                <Link
                                    href={route('register')}
                                    className={`w-full text-center py-3 rounded-xl text-sm font-semibold transition-all shadow-lg ${isPopular
                                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
                                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                        }`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-10 mt-12 text-center bg-slate-950/80">
                <p className="text-slate-500 text-sm">
                    &copy; 2026 Coaching CRM. Built with Laravel 11, React, & Inertia.
                </p>
            </footer>
        </div>
    );
}
