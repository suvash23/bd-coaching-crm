<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\ClassSession;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function update(Request $request, ClassSession $classSession)
    {
        $validated = $request->validate([
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,absent,late,excused',
        ]);

        foreach ($validated['attendances'] as $data) {
            Attendance::updateOrCreate(
                [
                    'class_session_id' => $classSession->id,
                    'student_id' => $data['student_id']
                ],
                [
                    'status' => $data['status']
                ]
            );
        }

        // Mark the class as completed
        $classSession->update(['status' => 'completed']);

        return redirect()->route('classes.index')->with('success', 'Attendance recorded successfully!');
    }
}
