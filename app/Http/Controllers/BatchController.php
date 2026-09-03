<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchController extends Controller
{
    public function index()
    {
        $batches = Batch::with('course', 'scheduleRules')->latest()->get();
        // Get all courses from the organization for the creation dropdown
        $courses = Course::latest()->get(['id', 'name']);

        return Inertia::render('Batches/Index', [
            'batches' => $batches,
            'courses' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1|max:1000',
            'status' => 'required|in:active,inactive',
        ]);

        $validated['organization_id'] = $request->user()->organization_id;

        Batch::create($validated);

        return redirect()->back()->with('success', 'Batch created successfully.');
    }

    public function update(Request $request, Batch $batch)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1|max:1000',
            'status' => 'required|in:active,inactive',
        ]);

        $batch->update($validated);

        return redirect()->back()->with('success', 'Batch updated successfully.');
    }

    public function destroy(Batch $batch)
    {
        $batch->delete();

        return redirect()->back()->with('success', 'Batch deleted successfully.');
    }
}
