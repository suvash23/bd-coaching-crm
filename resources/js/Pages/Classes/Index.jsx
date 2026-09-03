import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h, 10);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

function formatDateHeading(dateStr) {
    const [y, mo, d] = dateStr.split('-').map(Number);
    return new Date(y, mo - 1, d).toLocaleDateString('en-BD', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
}

function isToday(dateStr) {
    return dateStr === new Date().toLocaleDateString('en-CA');
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
    completed: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
    cancelled: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    scheduled: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};

// ── Session card ──────────────────────────────────────────────────────────────
function SessionCard({ session }) {
    const style = STATUS_STYLES[session.status] ?? STATUS_STYLES.scheduled;
    return (
        <div className="flex flex-col sm:flex-row items-stretch bg-white border border-gray-100 rounded-xl hover:border-indigo-100 transition-all shadow-sm hover:shadow-md group">
            {/* Left accent bar */}
            <div className={`w-full sm:w-1.5 sm:h-auto h-1.5 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none flex-shrink-0
                ${session.status === 'completed' ? 'bg-indigo-500' : session.status === 'cancelled' ? 'bg-rose-500' : 'bg-emerald-500'}`} />

            {/* Body */}
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${style}`}>
                            {session.status}
                        </span>
                        <span className="text-sm text-gray-500 font-mono font-medium">
                            {formatTime(session.start_time)} – {formatTime(session.end_time)}
                        </span>
                    </div>
                    <div className="text-base font-semibold text-gray-900 truncate">
                        {session.batch?.name || 'Unknown Batch'}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                        {session.batch?.course?.name || 'No Course'}
                    </div>
                </div>
                <Link href={route('classes.show', session.id)} className="flex-shrink-0">
                    <PrimaryButton className="text-sm whitespace-nowrap bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 ring-0 shadow-sm focus:ring-0">
                        {session.status === 'completed' ? 'View Attendance' : 'Mark Attendance'}
                    </PrimaryButton>
                </Link>
            </div>
        </div>
    );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <p className="text-gray-900 font-medium mb-1">No classes scheduled</p>
            <p className="text-gray-500 text-sm">Make sure your batches have schedule rules configured.</p>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Index({ classes, currentDate, view, weekStart, weekEnd }) {
    const navigate = (params) => router.get(route('classes.index'), params, { preserveState: true });

    const handleDateChange = (e) => navigate({ date: e.target.value, view });

    const shiftDay = (delta) => {
        const [y, mo, d] = currentDate.split('-').map(Number);
        const next = new Date(y, mo - 1, d + delta);
        navigate({ date: next.toLocaleDateString('en-CA'), view });
    };

    const shiftWeek = (delta) => {
        const [y, mo, d] = currentDate.split('-').map(Number);
        const next = new Date(y, mo - 1, d + delta * 7);
        navigate({ date: next.toLocaleDateString('en-CA'), view: 'week' });
    };

    const switchView = (newView) => navigate({ date: currentDate, view: newView });
    const dayLabel = formatDateHeading(currentDate);
    const weekDays = view === 'week' ? Object.keys(classes).sort() : [];
    const hasWeekSessions = weekDays.some(d => classes[d]?.length > 0);

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Schedule / Classes</h2>}>
            <Head title="Class Schedule" />

            <div className="max-w-4xl py-6 space-y-6">

                {/* ── Toolbar ── */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">

                    {/* Day / Week toggle */}
                    <div className="flex rounded-xl border border-gray-200 overflow-hidden p-0.5 bg-white shadow-sm gap-0.5">
                        <button onClick={() => switchView('day')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg transition-all
                                ${view === 'day' ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Day
                        </button>
                        <button onClick={() => switchView('week')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg transition-all
                                ${view === 'week' ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Week
                        </button>
                    </div>

                    {/* Date nav */}
                    <div className="flex items-center gap-2 flex-1">
                        <button onClick={() => view === 'week' ? shiftWeek(-1) : shiftDay(-1)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <input type="date" value={currentDate} onChange={handleDateChange}
                            className="border-gray-200 bg-white text-gray-900 text-sm font-medium rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-1.5" />

                        <button onClick={() => view === 'week' ? shiftWeek(1) : shiftDay(1)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>

                        <button onClick={() => navigate({ date: new Date().toLocaleDateString('en-CA'), view })}
                            className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mx-1">
                            Today
                        </button>

                        <button onClick={() => router.post(route('classes.generate'))}
                            className="px-4 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-transparent rounded-lg transition-colors ml-auto sm:ml-0 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Generate Today
                        </button>
                    </div>
                </div>

                {/* ── Heading ── */}
                {view === 'day' ? (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            {dayLabel}
                            {isToday(currentDate) && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">Today</span>
                            )}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Select a session to view details or mark attendance.</p>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Week of {formatDateHeading(weekStart)} – {formatDateHeading(weekEnd)}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">All sessions scheduled this week, grouped by day.</p>
                    </div>
                )}

                {/* ── Content ── */}
                {view === 'day' ? (
                    <div className="space-y-4">
                        {classes.length === 0 ? <EmptyState /> : classes.map(s => <SessionCard key={s.id} session={s} />)}
                    </div>
                ) : (
                    <div className="space-y-10">
                        {!hasWeekSessions ? (
                            <EmptyState />
                        ) : (
                            weekDays.map(dateStr => {
                                const daySessions = classes[dateStr] ?? [];
                                if (daySessions.length === 0) return null;
                                return (
                                    <div key={dateStr} className="relative">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0 text-center shadow-sm
                                                ${isToday(dateStr) ? 'bg-indigo-600' : 'bg-white border border-gray-100'}`}>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday(dateStr) ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                    {new Date(...dateStr.split('-').map((v, i) => i === 1 ? v - 1 : +v)).toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                                <span className={`text-xl font-bold leading-none mt-0.5 ${isToday(dateStr) ? 'text-white' : 'text-gray-900'}`}>
                                                    {parseInt(dateStr.split('-')[2], 10)}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className={`text-base font-bold ${isToday(dateStr) ? 'text-indigo-600' : 'text-gray-900'}`}>
                                                    {formatDateHeading(dateStr)}
                                                    {isToday(dateStr) && <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 tracking-wide uppercase">Today</span>}
                                                </h4>
                                                <p className="text-sm text-gray-500 font-medium">{daySessions.length} session{daySessions.length !== 1 ? 's' : ''}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4 pl-0 sm:pl-[4.5rem]">
                                            {daySessions.map(s => <SessionCard key={s.id} session={s} />)}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
