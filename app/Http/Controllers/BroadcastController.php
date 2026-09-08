<?php

namespace App\Http\Controllers;

use App\Http\Requests\BroadcastRequest;
use App\Models\Batch;
use App\Models\Broadcast;
use App\Models\Student;
use Inertia\Inertia;

class BroadcastController extends Controller
{
    public function index()
    {
        $broadcasts = Broadcast::latest()->get();
        $batches = Batch::where('status', 'active')->get(['id', 'name']);
        $totalStudents = Student::where('status', 'active')->count();

        return Inertia::render('Broadcasts/Index', [
            'broadcasts' => $broadcasts,
            'batches' => $batches,
            'totalStudents' => $totalStudents,
        ]);
    }

    public function store(BroadcastRequest $request)
    {
        $validated = $request->validated();

        // Calculate recipients
        if ($validated['target_type'] === 'all') {
            $studentQuery = Student::where('status', 'active');
        } else {
            $studentQuery = Student::where('status', 'active')
                ->whereHas('batches', function ($q) use ($validated) {
                    $q->whereIn('batches.id', $validated['batch_ids']);
                });
        }

        $recipientsCount = $studentQuery->count();

        // In a real application, you would queue a Job here to send the SMS/Email
        // For this MVP, we just record the broadcast and mark it as sent

        Broadcast::create([
            'organization_id' => $request->user()->organization_id,
            'type' => $validated['type'],
            'title' => $validated['title'] ?? ($validated['type'] === 'sms' ? null : 'New Broadcast'),
            'message' => $validated['message'],
            'status' => 'sent',
            'recipients_count' => $recipientsCount,
            'target_filters' => [
                'target_type' => $validated['target_type'],
                'batch_ids' => $validated['batch_ids'] ?? [],
            ],
            'sent_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Broadcast sent successfully to '.$recipientsCount.' recipients.');
    }
}
