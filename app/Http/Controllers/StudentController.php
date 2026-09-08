<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $query = Student::with(['batches', 'discounts.course'])->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', '%'.$search.'%')
                    ->orWhere('student_id_number', 'ilike', '%'.$search.'%')
                    ->orWhere('phone', 'ilike', '%'.$search.'%');
            });
        }

        $students = $query->get()->map(function ($student) {
            $student->photo_url = $student->photo_path ? asset('storage/'.$student->photo_path) : null;

            return $student;
        });

        $batches = Batch::where('status', 'active')->latest()->get(['id', 'name']);
        $courses = Course::latest()->get(['id', 'name']);

        $organization = $request->user()->organization;
        if ($organization && $organization->logo_path) {
            $organization->logo_url = asset('storage/'.$organization->logo_path);
        }

        $activeSubscription = $organization?->activeSubscription()->with('package')->first();
        $studentQuota = [
            'current' => $organization?->activeStudentCount() ?? 0,
            'max' => $activeSubscription?->package?->max_students,  // null = unlimited
            'plan' => $activeSubscription?->package?->name ?? 'No Plan',
            'can_add' => $organization?->canAddStudent() ?? false,
        ];

        return Inertia::render('Students/Index', [
            'students' => $students,
            'batches' => $batches,
            'courses' => $courses,
            'filters' => ['search' => $search],
            'organization' => $organization,
            'studentQuota' => $studentQuota,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'guardian_email' => 'nullable|email|max:255',
            'student_id_number' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'batch_ids' => 'nullable|array',
            'batch_ids.*' => 'exists:batches,id',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $organization = $request->user()->organization;

        if (! $organization->canAddStudent()) {
            $subscription = $organization->activeSubscription;
            $limit = $subscription?->package?->max_students ?? 0;
            $plan = $subscription?->package?->name ?? 'current plan';

            return redirect()->back()->withErrors([
                'limit' => "Student limit reached. Your {$plan} allows up to {$limit} students. Please upgrade your plan.",
            ]);
        }

        $validated['organization_id'] = $organization->id;

        if (empty($validated['student_id_number'])) {
            $prefix = strtoupper($organization->short_code);
            if (empty($prefix)) {
                // Auto generate prefix from org name, e.g. "BD Coaching Center" -> "BCC"
                $words = explode(' ', $organization->name);
                $prefix = '';
                foreach ($words as $w) {
                    if (ctype_alpha(substr($w, 0, 1))) {
                        $prefix .= strtoupper(substr($w, 0, 1));
                    }
                }
                $prefix = substr($prefix, 0, 4); // Max 4 letters
                if (empty($prefix)) {
                    $prefix = 'STU';
                }
            }

            // Get last student ID for this org to generate sequence
            $lastStudent = Student::withTrashed()->where('organization_id', $organization->id)
                ->where('student_id_number', 'like', $prefix.'-%')
                ->orderBy('id', 'desc')->first();

            $sequence = 1;
            if ($lastStudent) {
                $lastParts = explode('-', $lastStudent->student_id_number);
                if (count($lastParts) > 1) {
                    $sequence = (int) end($lastParts) + 1;
                }
            }

            $validated['student_id_number'] = $prefix.'-'.date('y').str_pad($sequence, 4, '0', STR_PAD_LEFT);
        }

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('students/photos', 'public');
        }

        $student = Student::create($validated);

        if (! empty($validated['batch_ids'])) {
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
            'email' => 'nullable|email|max:255',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'guardian_email' => 'nullable|email|max:255',
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
