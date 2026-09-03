import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currency = (v) => '৳' + Number(v || 0).toLocaleString('en-BD', { minimumFractionDigits: 0 });
const pct = (v) => Number(v || 0).toFixed(1) + '%';

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color = 'indigo' }) => {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-700',
        emerald: 'bg-emerald-50 text-emerald-700',
        rose: 'bg-rose-50 text-rose-700',
        amber: 'bg-amber-50 text-amber-700',
        sky: 'bg-sky-50 text-sky-700',
    };
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-2xl font-black ${colors[color].split(' ')[1]}`}>{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    );
};

// ── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
            {icon}
        </div>
        <div>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
    </div>
);

// ── Bar (mini horizontal bar chart) ──────────────────────────────────────────
const Bar = ({ value, max, color = 'bg-indigo-500' }) => {
    const w = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${w}%` }} />
            </div>
            <span className="text-xs text-gray-500 w-8 text-right">{w}%</span>
        </div>
    );
};

// ── Month Bar Chart (Financial) ───────────────────────────────────────────────
const MonthlyBarChart = ({ data }) => {
    const maxBilled = Math.max(...data.map(d => Number(d.total_billed || 0)), 1);
    return (
        <div className="space-y-3">
            {data.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No billing data for this year yet.</p>
            ) : data.map(row => {
                const m = MONTHS[parseInt(row.month?.split('-')[1] || 1) - 1];
                const billed = Number(row.total_billed || 0);
                const collected = Number(row.total_collected || 0);
                const outstanding = Number(row.total_outstanding || 0);
                const collectedW = billed > 0 ? Math.round((collected / billed) * 100) : 0;
                const outstandingW = billed > 0 ? Math.round((outstanding / billed) * 100) : 0;
                return (
                    <div key={row.month} className="grid grid-cols-[40px_1fr] gap-3 items-center">
                        <span className="text-xs font-medium text-gray-500 text-right">{m}</span>
                        <div className="relative h-7 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                            <div
                                className="absolute left-0 top-0 h-full bg-emerald-400 rounded-lg transition-all"
                                style={{ width: `${collectedW}%` }}
                                title={`Collected: ${currency(collected)}`}
                            />
                            <div
                                className="absolute h-full bg-rose-300 rounded-lg transition-all"
                                style={{ left: `${collectedW}%`, width: `${outstandingW}%` }}
                                title={`Outstanding: ${currency(outstanding)}`}
                            />
                            <div className="absolute inset-0 flex items-center px-2 justify-between">
                                <span className="text-[10px] font-bold text-gray-700">{currency(billed)}</span>
                                <span className="text-[10px] text-gray-500">{row.invoice_count} inv.</span>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-emerald-400 inline-block"></span>Collected</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-rose-300 inline-block"></span>Outstanding</span>
            </div>
        </div>
    );
};

export default function Index({
    year, month,
    financialMonthly, financialTotals,
    batchAttendance, attendanceSummary,
    studentStats, studentsPerBatch, newStudentsMonthly,
}) {
    const [activeTab, setActiveTab] = useState('financial');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

    const navigate = (newYear, newMonth) => {
        router.get(route('reports.index'), { year: newYear, month: newMonth }, { preserveState: true });
    };

    const tabs = [
        { id: 'financial', label: 'Financial', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
        { id: 'attendance', label: 'Attendance', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
        { id: 'students', label: 'Students', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    ];

    const maxBatch = Math.max(...studentsPerBatch.map(b => b.active_students), 1);
    const maxAttRate = Math.max(...batchAttendance.map(b => b.attendance_rate), 1);

    // Build 12-month sparkline for new students
    const sparkline = Array.from({ length: 12 }, (_, i) => ({
        m: MONTHS[i],
        count: Number(newStudentsMonthly[i + 1]?.count || 0),
    }));
    const maxSparkline = Math.max(...sparkline.map(s => s.count), 1);

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold text-gray-800">Reports</h2>}>
            <Head title="Reports" />

            <div className="space-y-6 max-w-7xl">
                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Analytics & Reports</h3>
                        <p className="text-sm text-gray-400 mt-0.5">Insights into your coaching center's performance</p>
                    </div>
                    {/* Year / Month selector */}
                    <div className="flex items-center gap-2">
                        <select
                            value={year}
                            onChange={e => navigate(e.target.value, month)}
                            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select
                            value={month}
                            onChange={e => navigate(year, e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                        </select>
                    </div>
                </div>

                {/* ── Tab Bar ── */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1 w-fit">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                                ${activeTab === t.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* ════════════════ FINANCIAL TAB ════════════════ */}
                {activeTab === 'financial' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* KPI row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard label="Total Billed" value={currency(financialTotals.total_billed)} sub={`${financialTotals.total_invoices} invoices · ${year}`} color="indigo" />
                            <StatCard label="Collected" value={currency(financialTotals.total_collected)} sub={`${financialTotals.paid_count} paid`} color="emerald" />
                            <StatCard label="Outstanding" value={currency(financialTotals.total_outstanding)} sub={`${financialTotals.unpaid_count} unpaid`} color="rose" />
                            <StatCard
                                label="Collection Rate"
                                value={financialTotals.total_billed > 0 ? pct((financialTotals.total_collected / financialTotals.total_billed) * 100) : '0%'}
                                sub="of total billed"
                                color="sky"
                            />
                        </div>

                        {/* Monthly breakdown chart */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <SectionHeader
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                                title={`Monthly Billing Breakdown · ${year}`}
                                subtitle="Green = collected, Red = outstanding"
                            />
                            <MonthlyBarChart data={financialMonthly} />
                        </div>

                        {/* Monthly table */}
                        {financialMonthly.length > 0 && (
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                                            <th className="px-5 py-3 text-left font-medium">Month</th>
                                            <th className="px-5 py-3 text-right font-medium">Billed</th>
                                            <th className="px-5 py-3 text-right font-medium">Collected</th>
                                            <th className="px-5 py-3 text-right font-medium">Outstanding</th>
                                            <th className="px-5 py-3 text-right font-medium">Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {financialMonthly.map(row => {
                                            const billed = Number(row.total_billed || 0);
                                            const collected = Number(row.total_collected || 0);
                                            const rate = billed > 0 ? ((collected / billed) * 100).toFixed(1) : 0;
                                            const mLabel = MONTHS[parseInt(row.month?.split('-')[1] || 1) - 1] + ' ' + row.month?.split('-')[0];
                                            return (
                                                <tr key={row.month} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="px-5 py-3 font-medium text-gray-900">{mLabel}</td>
                                                    <td className="px-5 py-3 text-right text-gray-700">{currency(row.total_billed)}</td>
                                                    <td className="px-5 py-3 text-right text-emerald-600 font-medium">{currency(row.total_collected)}</td>
                                                    <td className="px-5 py-3 text-right text-rose-500">{currency(row.total_outstanding)}</td>
                                                    <td className="px-5 py-3 text-right">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${Number(rate) >= 80 ? 'bg-emerald-100 text-emerald-700' : Number(rate) >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                                            {rate}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════════ ATTENDANCE TAB ═══════════════ */}
                {activeTab === 'attendance' && (
                    <div className="space-y-6">
                        {/* Summary KPIs */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard label="Sessions Held" value={attendanceSummary.sessions} sub={`${MONTHS[month - 1]} ${year}`} color="indigo" />
                            <StatCard label="Present" value={attendanceSummary.present} color="emerald" />
                            <StatCard label="Absent" value={attendanceSummary.absent} color="rose" />
                            <StatCard
                                label="Avg. Rate"
                                value={attendanceSummary.present + attendanceSummary.absent > 0
                                    ? pct((attendanceSummary.present / (attendanceSummary.present + attendanceSummary.absent)) * 100)
                                    : '—'}
                                sub="present / total marks"
                                color="sky"
                            />
                        </div>

                        {/* Per-batch breakdown */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <SectionHeader
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                title={`Attendance by Batch · ${MONTHS[month - 1]} ${year}`}
                                subtitle="Based on marked attendance records"
                            />
                            {batchAttendance.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-10">No attendance data found for this period.</p>
                            ) : (
                                <div className="space-y-4">
                                    {batchAttendance.map((b, i) => (
                                        <div key={i} className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-900">{b.batch_name}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{b.status}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>{b.sessions_held} sessions</span>
                                                    <span>{b.active_students} students</span>
                                                    <span className={`font-bold ${b.attendance_rate >= 75 ? 'text-emerald-600' : b.attendance_rate >= 50 ? 'text-amber-600' : 'text-rose-500'}`}>
                                                        {b.attendance_rate}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${b.attendance_rate >= 75 ? 'bg-emerald-500' : b.attendance_rate >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`}
                                                    style={{ width: `${b.attendance_rate}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ════════════════ STUDENTS TAB ════════════════ */}
                {activeTab === 'students' && (
                    <div className="space-y-6">
                        {/* KPIs */}
                        <div className="grid grid-cols-3 gap-4">
                            <StatCard label="Total Students" value={studentStats.total} color="indigo" />
                            <StatCard label="Active" value={studentStats.active} sub="currently enrolled" color="emerald" />
                            <StatCard label="Inactive" value={studentStats.inactive} color="rose" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Students per batch */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <SectionHeader
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                    title="Students per Batch"
                                    subtitle="Active enrolled count"
                                />
                                <div className="space-y-4">
                                    {studentsPerBatch.length === 0 ? (
                                        <p className="text-gray-400 text-sm text-center py-6">No batches found.</p>
                                    ) : studentsPerBatch.map((b, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-sm font-medium text-gray-800">{b.batch_name}</span>
                                                <span className="text-xs text-gray-500">{b.active_students} active / {b.total_students} total</span>
                                            </div>
                                            <Bar value={b.active_students} max={maxBatch} color="bg-indigo-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Monthly new enrolments sparkline */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <SectionHeader
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4v16m8-8H4" /></svg>}
                                    title={`New Students per Month · ${year}`}
                                    subtitle="Registration timeline"
                                />
                                <div className="flex items-end gap-1.5 h-36 mt-2">
                                    {sparkline.map((s, i) => {
                                        const h = maxSparkline > 0 ? Math.max(Math.round((s.count / maxSparkline) * 100), s.count > 0 ? 8 : 0) : 0;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                                <div className="relative w-full flex justify-center">
                                                    {s.count > 0 && (
                                                        <span className="absolute -top-5 text-[10px] text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {s.count}
                                                        </span>
                                                    )}
                                                    <div
                                                        className={`w-full rounded-t-md transition-all ${s.count > 0 ? 'bg-indigo-400 hover:bg-indigo-500' : 'bg-gray-100'}`}
                                                        style={{ height: `${h}px` }}
                                                    />
                                                </div>
                                                <span className="text-[8px] text-gray-400 font-medium">{s.m}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
