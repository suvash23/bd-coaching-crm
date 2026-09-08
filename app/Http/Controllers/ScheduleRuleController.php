<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScheduleRuleRequest;
use App\Models\Batch;
use App\Models\ScheduleRule;

class ScheduleRuleController extends Controller
{
    public function store(ScheduleRuleRequest $request, Batch $batch)
    {
        $validated = $request->validated();

        // Prevent duplicate rules for the same day+time slot
        $exists = $batch->scheduleRules()
            ->where('day_of_week', $validated['day_of_week'])
            ->where('start_time', $validated['start_time'])
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors([
                'day_of_week' => 'A schedule rule for this day and start time already exists.',
            ]);
        }

        $batch->scheduleRules()->create([
            'organization_id' => $request->user()->organization_id,
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);

        return redirect()->back()->with('success', 'Schedule rule added.');
    }

    public function destroy(Batch $batch, ScheduleRule $scheduleRule)
    {
        // Ensure rule belongs to this batch
        abort_if($scheduleRule->batch_id !== $batch->id, 403);

        $scheduleRule->delete();

        return redirect()->back()->with('success', 'Schedule rule removed.');
    }
}
