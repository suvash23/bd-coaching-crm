import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const StatCard = ({ label, value, icon, color }) => (
    <div className={`relative bg-slate-900 rounded-2xl p-6 border border-slate-800 overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${color} blur-2xl opacity-20 -mr-6 -mt-6`}></div>
        <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-20 flex items-center justify-center mb-4`}>
            {icon}
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
    </div>
);

const QuickLink = ({ href, label, description, icon }) => (
    <Link href={href} className="group flex items-start gap-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <div className="text-sm font-semibold text-white">{label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{description}</div>
        </div>
        <svg className="ml-auto w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
    </Link>
);

export default function Dashboard() {
    const today = new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Dhaka' });

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold text-slate-100">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Welcome Banner */}
                <div className="relative bg-gradient-to-r from-indigo-900/60 to-slate-900 border border-indigo-800/40 rounded-2xl p-8 overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Good morning! 👋</h1>
                    <p className="text-slate-400 text-sm">{today}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href={route('students.index')} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
                            Manage Students
                        </Link>
                        <Link href={route('classes.index')} className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors">
                            Today's Classes
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Overview</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Students"
                            value="—"
                            color="bg-indigo-500"
                            icon={<svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
                        />
                        <StatCard
                            label="Active Batches"
                            value="—"
                            color="bg-emerald-500"
                            icon={<svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
                        />
                        <StatCard
                            label="Today's Classes"
                            value="—"
                            color="bg-amber-500"
                            icon={<svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        />
                        <StatCard
                            label="Unpaid Invoices"
                            value="—"
                            color="bg-rose-500"
                            icon={<svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <QuickLink href={route('students.index')} label="Manage Students" description="Add, edit, or enroll students into batches." icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"></path></svg>} />
                        <QuickLink href={route('classes.index')} label="Class Schedule" description="View today's classes and mark attendance." icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>} />
                        <QuickLink href={route('invoices.index')} label="Fee Collection" description="Collect payments and issue official receipts." icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>} />
                        <QuickLink href={route('courses.index')} label="Courses" description="Define and manage your course catalog." icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>} />
                        <QuickLink href={route('batches.index')} label="Batches" description="Manage groups, schedules, and sessions." icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
