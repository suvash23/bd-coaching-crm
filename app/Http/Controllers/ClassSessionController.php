<?php

namespace App\Http\Controllers;

use App\Models\ClassSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ClassSessionController extends Controller
{
    public function index(Request $request)
    {
        $view = $request->query('view', 'day'); // 'day' or 'week'
        $date = $request->query('date', Carbon::today()->toDateString());

        $anchorDate = Carbon::parse($date);

        if ($view === 'week') {
            $start = $anchorDate->copy()->startOfWeek(Carbon::MONDAY);
            $end = $anchorDate->copy()->endOfWeek(Carbon::SUNDAY);

            $classes = ClassSession::with('batch.course')
                ->whereBetween('scheduled_date', [$start->toDateString(), $end->toDateString()])
                ->oldest('scheduled_date')
                ->oldest('start_time')
                ->get()
                ->groupBy('scheduled_date'); // keyed by 'YYYY-MM-DD'

            return Inertia::render('Classes/Index', [
                'classes' => $classes,
                'currentDate' => $anchorDate->toDateString(),
                'view' => 'week',
                'weekStart' => $start->toDateString(),
                'weekEnd' => $end->toDateString(),
            ]);
        }

        // Daily view (default)
        $classes = ClassSession::with('batch.course')
            ->whereDate('scheduled_date', $anchorDate->toDateString())
            ->oldest('start_time')
            ->get();

        return Inertia::render('Classes/Index', [
            'classes' => $classes,
            'currentDate' => $anchorDate->toDateString(),
            'view' => 'day',
            'weekStart' => null,
            'weekEnd' => null,
        ]);
    }

    public function show($id)
    {
        $classSession = ClassSession::findOrFail($id);
        $classSession->load(['batch.students', 'attendances.student']);

        // Map enrolled batch students to their current attendance
        $students = $classSession->batch->students->map(function ($student) use ($classSession) {
            $attendance = $classSession->attendances->where('student_id', $student->id)->first();
            return [
                'id' => $student->id,
                'name' => $student->name,
                'student_id_number' => $student->student_id_number,
                'status' => $attendance ? $attendance->status : 'present',
                'recorded' => $attendance ? true : false,
            ];
        });

        return Inertia::render('Classes/Attendance', [
            'classSession' => $classSession->load('batch.course'),
            'students' => $students,
        ]);
    }
}
