<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::latest()->get();

        return Inertia::render('Courses/Index', [
            'courses' => $courses
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fee_type' => 'required|in:monthly,fixed',
            'amount' => 'required|numeric|min:0',
        ]);

        $validated['organization_id'] = $request->user()->organization_id;

        Course::create($validated);

        return redirect()->back()->with('success', 'Course created successfully.');
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fee_type' => 'required|in:monthly,fixed',
            'amount' => 'required|numeric|min:0',
        ]);

        $course->update($validated);

        return redirect()->back()->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->back()->with('success', 'Course deleted successfully.');
    }
}
