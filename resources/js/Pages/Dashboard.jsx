import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const money = (value) => `৳${Number(value || 0).toLocaleString()}`;

function Sparkline({ points, color }) {
    if (!points || points.length < 2) return null;

    const max = Math.max(...points, 1);
    const min = Math.min(...points, 0);
    const range = max - min || 1;
    const step = 100 / (points.length - 1);

    const coords = points.map((value, i) => [i * step, 32 - ((value - min) / range) * 28 - 2]);
    const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
    const area = `${line} L100,32 L0,32 Z`;

    return (
        <svg viewBox="0 0 100 32" className="w-full h-8" preserveAspectRatio="none">
            <path d={area} fill={color} opacity="0.12" />
            <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function StatCard({ label, value, trend, icon, iconBg, iconColor, lineColor }) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
                    {icon}
                </div>
                <div className="w-24">
                    <Sparkline points={trend} color={lineColor} />
                </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
        </div>
    );
}

function Gauge({ percent, size = 200 }) {
    const clamped = Math.max(0, Math.min(100, percent));

    return (
        <svg viewBox="0 0 200 110" className="w-full" style={{ maxWidth: size }}>
            <path d="M10,100 A90,90 0 0,1 190,100" fill="none" stroke="#EEF0FF" strokeWidth="18" strokeLinecap="round" pathLength="100" />
            <path
                d="M10,100 A90,90 0 0,1 190,100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="18"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray={`${clamped} 100`}
            />
            <defs>
                <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
            </defs>
        </svg>
    );
}

function CollectionBarChart({ trend }) {
    const maxVal = Math.max(...trend.flatMap((t) => [t.billed, t.collected]), 1);
    const highlightIndex = trend.reduce(
        (best, t, i) => (t.collected > trend[best].collected ? i : best),
        0
    );

    return (
        <div className="flex items-end justify-between gap-4 h-44 px-1 mt-12">
            {trend.map((t, i) => {
                const billedH = Math.max((t.billed / maxVal) * 140, 3);
                const collectedH = Math.max((t.collected / maxVal) * 140, 3);
                const pct = t.billed > 0 ? Math.round((t.collected / t.billed) * 100) : 0;

                return (
                    <div key={t.label} className="relative flex-1 flex flex-col items-center">
                        {i === highlightIndex && t.collected > 0 && (
                            <div className="absolute -top-14 bg-gray-900 text-white text-[11px] rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
                                <div className="font-semibold">{money(t.collected)}</div>
                                <div className="text-emerald-300">+{pct}% collected</div>
                                <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                            </div>
                        )}
                        <div className="flex items-end gap-1 h-36">
                            <div className="w-3 rounded-t-md bg-indigo-100" style={{ height: `${billedH}px` }} title={`Billed ${money(t.billed)}`} />
                            <div
                                className={`w-3 rounded-t-md ${i === highlightIndex ? 'bg-indigo-600' : 'bg-indigo-400'}`}
                                style={{ height: `${collectedH}px` }}
                                title={`Collected ${money(t.collected)}`}
                            />
                        </div>
                        <div className="text-xs text-gray-400 mt-2">{t.label}</div>
                    </div>
                );
            })}
        </div>
    );
}

function StatusPill({ status }) {
    const styles = {
        active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        inactive: 'bg-gray-100 text-gray-600 ring-gray-200',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ring-1 ${styles[status] ?? styles.inactive}`}>
            {status}
        </span>
    );
}

export default function Dashboard({ stats = {}, feeBreakdown = {}, collectionTrend = [], recentStudents = [] }) {
    const user = usePage().props.auth.user;
    const today = new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Dhaka' });

    const totalInvoices = (feeBreakdown.paid ?? 0) + (feeBreakdown.partial ?? 0) + (feeBreakdown.unpaid ?? 0);
    const paidPct = totalInvoices ? Math.round(((feeBreakdown.paid ?? 0) / totalInvoices) * 100) : 0;
    const partialPct = totalInvoices ? Math.round(((feeBreakdown.partial ?? 0) / totalInvoices) * 100) : 0;
    const unpaidPct = totalInvoices ? Math.max(100 - paidPct - partialPct, 0) : 0;

    const studentsSeries = collectionTrend.map((t) => t.students);
    const batchesSeries = collectionTrend.map((t) => t.batches);
    const collectedSeries = collectionTrend.map((t) => t.collected);
    const outstandingSeries = collectionTrend.map((t) => Math.max(t.billed - t.collected, 0));

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Hero */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-8 overflow-hidden shadow-lg shadow-indigo-200 flex flex-col md:flex-row items-center gap-8">
                    <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="absolute right-24 bottom-0 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Hi, {user.name.split(' ')[0]} 👋</h1>
                        <p className="text-indigo-100 text-lg font-medium">What's happening at your coaching center today?</p>
                        <p className="text-indigo-200 text-sm mt-2">{today}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href={route('students.index')} className="px-4 py-2 rounded-xl bg-white text-indigo-700 font-medium text-sm hover:bg-indigo-50 transition-colors shadow-sm">
                                Manage Students
                            </Link>
                            <Link href={route('classes.index')} className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors">
                                Today's Classes
                            </Link>
                        </div>
                    </div>

                    <div className="relative hidden md:flex w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-sm items-center justify-center flex-shrink-0">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Students" value={stats.total_students ?? 0}
                        trend={studentsSeries.length ? studentsSeries : [0, 0, 0, 0]}
                        iconBg="bg-indigo-50" iconColor="text-indigo-600" lineColor="#4F46E5"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
                    />
                    <StatCard
                        label="Active Batches" value={stats.active_batches ?? 0}
                        trend={batchesSeries.length ? batchesSeries : [0, 0, 0, 0]}
                        iconBg="bg-emerald-50" iconColor="text-emerald-600" lineColor="#10B981"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
                    />
                    <StatCard
                        label="Monthly Collection" value={money(stats.monthly_collection)}
                        trend={collectedSeries.length ? collectedSeries : [0, 0, 0, 0]}
                        iconBg="bg-blue-50" iconColor="text-blue-600" lineColor="#2563EB"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                    />
                    <StatCard
                        label="Total Dues" value={money(stats.total_dues)}
                        trend={outstandingSeries.length ? outstandingSeries : [0, 0, 0, 0]}
                        iconBg="bg-rose-50" iconColor="text-rose-600" lineColor="#E11D48"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                    />
                </div>

                {/* Fee breakdown / Collection rate / Trend */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Fee Status Overview */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-gray-900">Fee Status Overview</h3>
                            <Link href={route('invoices.index')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">See Details</Link>
                        </div>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{totalInvoices}</div>
                                <div className="text-xs text-gray-400">Total Invoices</div>
                            </div>
                        </div>

                        <div className="h-2.5 rounded-full overflow-hidden bg-gray-100 flex mb-5">
                            <div className="bg-emerald-500 h-full" style={{ width: `${paidPct}%` }} />
                            <div className="bg-amber-400 h-full" style={{ width: `${partialPct}%` }} />
                            <div className="bg-rose-400 h-full" style={{ width: `${unpaidPct}%` }} />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Paid Invoices</span>
                                <span className="font-semibold text-gray-900">{feeBreakdown.paid ?? 0}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />Partial Payments</span>
                                <span className="font-semibold text-gray-900">{feeBreakdown.partial ?? 0}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" />Unpaid / Overdue</span>
                                <span className="font-semibold text-gray-900">{feeBreakdown.unpaid ?? 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Collection Rate Gauge */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-gray-900">Collection Rate</h3>
                            <Link href={route('reports.index')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">See Details</Link>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.collection_rate ?? 0}%</div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center -mt-2">
                            <Gauge percent={stats.collection_rate ?? 0} />
                            <div className="text-center -mt-6">
                                <div className="text-3xl font-bold text-gray-900">{stats.collection_rate ?? 0}%</div>
                                <div className="text-sm text-gray-400">This Month</div>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
                            <span className="font-semibold text-gray-700">Outstanding — </span>
                            {money(stats.total_dues)} is still due across {(feeBreakdown.partial ?? 0) + (feeBreakdown.unpaid ?? 0)} open invoice(s).
                        </p>
                    </div>

                    {/* Collection Trend */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-gray-900">Monthly Collection</h3>
                            <div className="flex items-center gap-3 text-[11px] text-gray-400">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-100" />Billed</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" />Collected</span>
                            </div>
                        </div>

                        {collectionTrend.length > 0 ? (
                            <CollectionBarChart trend={collectionTrend} />
                        ) : (
                            <div className="h-44 flex items-center justify-center text-sm text-gray-400">No billing data yet</div>
                        )}
                    </div>
                </div>

                {/* Recent Students */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between p-6 pb-4">
                        <h3 className="font-semibold text-gray-900">Recent Students</h3>
                        <Link href={route('students.index')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View All</Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-y border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Student ID</th>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Batch</th>
                                    <th className="px-6 py-3 font-medium">Guardian Phone</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentStudents.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No students yet.</td></tr>
                                ) : (
                                    recentStudents.map((student) => {
                                        const initials = student.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                                        return (
                                            <tr key={student.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{student.student_id_number ?? `#${String(student.id).padStart(4, '0')}`}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                            {initials}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{student.batch ?? '—'}</td>
                                                <td className="px-6 py-4 text-gray-600">{student.guardian_phone ?? student.phone ?? '—'}</td>
                                                <td className="px-6 py-4"><StatusPill status={student.status} /></td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
