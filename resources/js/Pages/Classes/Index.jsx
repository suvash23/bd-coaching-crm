import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ classes, currentDate }) {
    const [dateProp, setDateProp] = useState(currentDate);

    const handleDateChange = (e) => {
        setDateProp(e.target.value);
        router.get(route('classes.index'), { date: e.target.value }, { preserveState: true });
    };

    const formatTime = (timeStr) => {
        const [hour, min] = timeStr.split(':');
        const h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedH = h % 12 || 12;
        return `${formattedH}:${min} ${ampm}`;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Daily Schedule</h2>}
        >
            <Head title="Class Schedule" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header & Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Schedule for {new Date(dateProp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select a class session below to mark attendance.</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <TextInput
                                type="date"
                                value={dateProp}
                                onChange={handleDateChange}
                                className="block"
                            />
                        </div>
                    </div>

                    {/* Classes List */}
                    <div className="space-y-4">
                        {classes.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500 shadow-sm border border-gray-200 dark:border-gray-700">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-lg">No classes scheduled for this date.</p>
                                <p className="text-sm mt-1">Ensure your batches have schedule rules configured.</p>
                            </div>
                        ) : (
                            classes.map((session) => (
                                <div key={session.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider
                                                ${session.status === 'completed' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' :
                                                    session.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                                {session.status}
                                            </span>
                                            <span className="text-sm font-medium text-gray-500">
                                                {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {session.batch?.name || 'Unknown Batch'}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                            {session.batch?.course?.name || 'No Course'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-750 px-6 py-4 sm:p-6 flex flex-col justify-center sm:border-l border-t sm:border-t-0 border-gray-200 dark:border-gray-700">
                                        <Link href={route('classes.show', session.id)}>
                                            <PrimaryButton className="w-full sm:w-auto flex justify-center">
                                                {session.status === 'completed' ? 'View Attendance' : 'Mark Attendance'}
                                            </PrimaryButton>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
