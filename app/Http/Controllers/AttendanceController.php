<?php

namespace App\Http\Controllers;

use App\Http\Requests\AttendanceUpdateRequest;
use App\Models\Attendance;
use App\Models\ClassSession;

class AttendanceController extends Controller
{
    public function update(AttendanceUpdateRequest $request, ClassSession $classSession)
    {
        foreach ($request->validated('attendances') as $data) {
            Attendance::updateOrCreate(
                [
                    'class_session_id' => $classSession->id,
                    'student_id' => $data['student_id'],
                ],
                [
                    'status' => $data['status'],
                ]
            );
        }

        // Mark the class as completed
        $classSession->update(['status' => 'completed']);

        return redirect()->route('classes.index')->with('success', 'Attendance recorded successfully!');
    }
}
