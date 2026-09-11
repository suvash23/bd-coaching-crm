<?php

namespace App\Http\Controllers;

use App\Http\Requests\BatchRequest;
use App\Models\Batch;
use App\Models\Course;
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

    public function store(BatchRequest $request)
    {
        $validated = $request->validated();
        $validated['organization_id'] = $request->user()->organization_id;

        Batch::create($validated);

        return redirect()->back()->with('success', 'Batch created successfully.');
    }

    public function update(BatchRequest $request, Batch $batch)
    {
        $batch->update($request->validated());

        return redirect()->back()->with('success', 'Batch updated successfully.');
    }

    public function destroy(Batch $batch)
    {
        $batch->delete();

        return redirect()->back()->with('success', 'Batch deleted successfully.');
    }
}
