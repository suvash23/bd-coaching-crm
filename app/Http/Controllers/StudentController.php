<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with('batches')->latest()->get();
        // Load active batches for dropdown
        $batches = Batch::where('status', 'active')->latest()->get(['id', 'name']);

        return Inertia::render('Students/Index', [
            'students' => $students,
            'batches' => $batches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'student_id_number' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'batch_ids' => 'nullable|array',
            'batch_ids.*' => 'exists:batches,id',
        ]);

        $validated['organization_id'] = $request->user()->organization_id;

        $student = Student::create($validated);

        if (!empty($validated['batch_ids'])) {
            // default to active with current date as join_date
            $syncData = [];
            foreach ($validated['batch_ids'] as $batch_id) {
                $syncData[$batch_id] = ['join_date' => now()->toDateString(), 'status' => 'active'];
            }
            $student->batches()->sync($syncData);
        }

        return redirect()->back()->with('success', 'Student created successfully.');
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'student_id_number' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'batch_ids' => 'nullable|array',
            'batch_ids.*' => 'exists:batches,id',
        ]);

        $student->update($validated);

        if (isset($validated['batch_ids'])) {
            $existingSync = $student->batches()->pluck('batches.id')->toArray();

            $syncData = [];
            foreach ($validated['batch_ids'] as $batch_id) {
                // Keep original join date if they were already in the batch
                if (in_array($batch_id, $existingSync)) {
                    $originalPivot = $student->batches()->where('batches.id', $batch_id)->first()->pivot;
                    $syncData[$batch_id] = ['join_date' => $originalPivot->join_date, 'status' => $originalPivot->status];
                } else {
                    $syncData[$batch_id] = ['join_date' => now()->toDateString(), 'status' => 'active'];
                }
            }
            $student->batches()->sync($syncData);
        } else {
            $student->batches()->sync([]);
        }

        return redirect()->back()->with('success', 'Student updated successfully.');
    }

    public function destroy(Student $student)
    {
        $student->batches()->detach();
        $student->delete();

        return redirect()->back()->with('success', 'Student deleted successfully.');
    }
}
