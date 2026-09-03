import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Attendance({ classSession, students }) {
    const [attendanceData, setAttendanceData] = useState(
        students.reduce((acc, student) => {
            acc[student.id] = student.status;
            return acc;
        }, {})
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleStatusUpdate = (studentId, status) => {
        setAttendanceData(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = () => {
        setIsSaving(true);
        const payload = Object.entries(attendanceData).map(([student_id, status]) => ({
            student_id: parseInt(student_id), status
        }));
        router.put(route('classes.attendance.update', classSession.id), { attendances: payload }, { onFinish: () => setIsSaving(false) });
    };

    const getStatusClasses = (currentStatus, targetStatus) => {
        const base = "flex-1 py-2 text-sm font-semibold rounded-lg transition-all border shadow-sm";
        if (currentStatus === targetStatus) {
            switch (targetStatus) {
                case 'present': return `${base} bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20`;
                case 'absent': return `${base} bg-rose-500 text-white border-rose-600 shadow-rose-500/20`;
                case 'late': return `${base} bg-amber-500 text-white border-amber-600 shadow-amber-500/20`;
                case 'excused': return `${base} bg-indigo-500 text-white border-indigo-600 shadow-indigo-500/20`;
                default: return base;
            }
        }
        return `${base} bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900`;
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center space-x-4">
                <Link href={route('classes.index')} className="text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors">
                    &larr; Back to Schedule
                </Link>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Mark Attendance</h2>
            </div>
        }>
            <Head title={`Attendance - ${classSession.batch?.name}`} />

            <div className="max-w-5xl py-6 space-y-6">
                {/* Info Card */}
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {classSession.batch?.name}
                        </h3>
                        <p className="text-gray-500 font-medium mt-1">
                            {classSession.batch?.course?.name}
                        </p>
                        <div className="flex items-center mt-4 text-sm text-gray-600 space-x-6 font-semibold bg-gray-50 inline-flex px-4 py-2 rounded-xl">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {new Date(classSession.scheduled_date).toLocaleDateString('en-BD', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {classSession.start_time.slice(0, 5)} - {classSession.end_time.slice(0, 5)}
                            </span>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <PrimaryButton onClick={handleSave} disabled={isSaving} className="w-full md:w-auto justify-center py-3 px-8 text-base shadow-lg shadow-indigo-500/20">
                            {isSaving ? 'Saving...' : 'Save Attendance Record'}
                        </PrimaryButton>
                    </div>
                </div>

                {/* Roster */}
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    {students.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg>
                            </div>
                            <p className="text-gray-900 font-medium">No students enrolled</p>
                            <p className="text-gray-500 text-sm mt-1">Enroll students into this batch first.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {students.map(student => (
                                <div key={student.id} className="p-4 sm:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center hover:bg-gray-50 transition-colors">
                                    <div className="mb-4 lg:mb-0 flex gap-4 items-center">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                            {student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900">{student.name}</h4>
                                            {student.student_id_number && (
                                                <span className="text-xs text-gray-500 font-mono font-medium">#{student.student_id_number}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex w-full lg:w-[400px] gap-2 lg:gap-3">
                                        <button onClick={() => handleStatusUpdate(student.id, 'present')} className={getStatusClasses(attendanceData[student.id], 'present')}>P</button>
                                        <button onClick={() => handleStatusUpdate(student.id, 'late')} className={getStatusClasses(attendanceData[student.id], 'late')}>L</button>
                                        <button onClick={() => handleStatusUpdate(student.id, 'excused')} className={getStatusClasses(attendanceData[student.id], 'excused')}>E</button>
                                        <button onClick={() => handleStatusUpdate(student.id, 'absent')} className={getStatusClasses(attendanceData[student.id], 'absent')}>A</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
