import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Attendance({ classSession, students }) {
    // Local state to track selections before saving
    const [attendanceData, setAttendanceData] = useState(
        students.reduce((acc, student) => {
            acc[student.id] = student.status;
            return acc;
        }, {})
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleStatusUpdate = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        const payload = Object.entries(attendanceData).map(([student_id, status]) => ({
            student_id: parseInt(student_id),
            status
        }));

        router.put(route('classes.attendance.update', classSession.id), {
            attendances: payload
        }, {
            onFinish: () => setIsSaving(false)
        });
    };

    const getStatusClasses = (currentStatus, targetStatus) => {
        const base = "flex-1 py-2 text-sm font-medium rounded-md transition-colors border";
        if (currentStatus === targetStatus) {
            switch (targetStatus) {
                case 'present': return `${base} bg-emerald-600 text-white border-emerald-600 dark:border-emerald-500`;
                case 'absent': return `${base} bg-rose-600 text-white border-rose-600 dark:border-rose-500`;
                case 'late': return `${base} bg-amber-500 text-white border-amber-500 dark:border-amber-400`;
                case 'excused': return `${base} bg-blue-500 text-white border-blue-500 dark:border-blue-400`;
                default: return base;
            }
        }
        return `${base} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link href={route('classes.index')} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        &larr; Back
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Mark Attendance
                    </h2>
                </div>
            }
        >
            <Head title={`Attendance - ${classSession.batch?.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Info Card */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {classSession.batch?.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {classSession.batch?.course?.name}
                            </p>
                            <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400 space-x-4">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    {new Date(classSession.scheduled_date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    {classSession.start_time.slice(0, 5)} - {classSession.end_time.slice(0, 5)}
                                </span>
                            </div>
                        </div>
                        <div className="w-full md:w-auto">
                            <PrimaryButton onClick={handleSave} disabled={isSaving} className="w-full md:w-auto justify-center py-3 px-6 text-base">
                                {isSaving ? 'Saving...' : 'Save Attendance Record'}
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Roster */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                        {students.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                No students are currently enrolled in this batch.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {students.map(student => (
                                    <div key={student.id} className="p-4 sm:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">

                                        <div className="mb-4 lg:mb-0">
                                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                                {student.name}
                                            </h4>
                                            {student.student_id_number && (
                                                <span className="text-sm text-gray-500 font-mono">ID: {student.student_id_number}</span>
                                            )}
                                        </div>

                                        <div className="flex w-full lg:w-auto space-x-2">
                                            <button
                                                onClick={() => handleStatusUpdate(student.id, 'present')}
                                                className={getStatusClasses(attendanceData[student.id], 'present')}
                                            >
                                                Present
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(student.id, 'late')}
                                                className={getStatusClasses(attendanceData[student.id], 'late')}
                                            >
                                                Late
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(student.id, 'excused')}
                                                className={getStatusClasses(attendanceData[student.id], 'excused')}
                                            >
                                                Excused
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(student.id, 'absent')}
                                                className={getStatusClasses(attendanceData[student.id], 'absent')}
                                            >
                                                Absent
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
