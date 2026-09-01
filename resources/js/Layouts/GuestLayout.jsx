import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-950 flex overflow-hidden relative">
            {/* Background glow */}
            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none"></div>

            {/* Left Panel — Branding */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-16 border-r border-white/5 relative">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Coaching<span className="text-indigo-400">CRM</span></span>
                </Link>

                <div>
                    <blockquote className="text-3xl font-bold text-white leading-snug mb-6">
                        "The smartest way to run your academy."
                    </blockquote>
                    <div className="flex items-center gap-6 text-sm">
                        {[['Students', '100+'], ['Batches', 'Multi-Batch'], ['Collection', 'Digital']].map(([label, val]) => (
                            <div key={label}>
                                <div className="text-2xl font-bold text-indigo-400">{val}</div>
                                <div className="text-slate-500">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-slate-600 text-sm">© 2026 CoachingCRM. All rights reserved.</p>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">Coaching<span className="text-indigo-400">CRM</span></span>
                    </Link>
                    {children}
                </div>
            </div>
        </div>
    );
}
