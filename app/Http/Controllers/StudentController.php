<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with('batches')->latest()->get()->map(function ($student) {
            $student->photo_url = $student->photo_path ? asset('storage/' . $student->photo_path) : null;
            return $student;
        });

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
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $validated['organization_id'] = $request->user()->organization_id;

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('students/photos', 'public');
        }

        $student = Student::create($validated);

        if (!empty($validated['batch_ids'])) {
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
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($student->photo_path) {
                Storage::disk('public')->delete($student->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('students/photos', 'public');
        }

        $student->update($validated);

        if (isset($validated['batch_ids'])) {
            $existingSync = $student->batches()->pluck('batches.id')->toArray();
            $syncData = [];
            foreach ($validated['batch_ids'] as $batch_id) {
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
        if ($student->photo_path) {
            Storage::disk('public')->delete($student->photo_path);
        }
        $student->batches()->detach();
        $student->delete();

        return redirect()->back()->with('success', 'Student deleted successfully.');
    }
}
