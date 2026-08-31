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
        $date = $request->query('date', Carbon::today()->toDateString());

        $classes = ClassSession::with('batch.course')
            ->whereDate('scheduled_date', $date)
            ->oldest('start_time')
            ->get();

        return Inertia::render('Classes/Index', [
            'classes' => $classes,
            'currentDate' => $date
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
                'status' => $attendance ? $attendance->status : 'present', // assume present by default for UI friendliness
                'recorded' => $attendance ? true : false,
            ];
        });

        return Inertia::render('Classes/Attendance', [
            'classSession' => $classSession->load('batch.course'),
            'students' => $students
        ]);
    }
}
