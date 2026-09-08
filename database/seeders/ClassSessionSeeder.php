<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\ClassSession;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ClassSessionSeeder extends Seeder
{
    private const TOPICS = [
        'Chapter Review', 'Problem Solving Session', 'Mock Test', 'Doubt Clearing Class', 'New Chapter Introduction',
    ];

    /**
     * Instantiates discrete class_sessions from each batch's schedule rules,
     * spanning the last 4 weeks (marked completed/cancelled) through the next week (scheduled).
     */
    public function run(): void
    {
        ClassSession::withoutGlobalScopes()->forceDelete();

        foreach (Batch::withoutGlobalScopes()->with('scheduleRules')->where('status', 'active')->get() as $batch) {
            if ($batch->scheduleRules->isEmpty()) {
                continue;
            }

            $teachers = User::withoutGlobalScopes()
                ->where('organization_id', $batch->organization_id)
                ->where('role', 'teacher')
                ->pluck('id');

            $rulesByDay = $batch->scheduleRules->keyBy('day_of_week');

            for ($date = Carbon::today()->subWeeks(4); $date->lte(Carbon::today()->addWeek()); $date->addDay()) {
                $rule = $rulesByDay->get($date->format('l'));

                if (! $rule) {
                    continue;
                }

                $isPast = $date->lt(Carbon::today());
                $status = 'scheduled';
                if ($isPast) {
                    $status = random_int(1, 20) === 1 ? 'cancelled' : 'completed';
                }

                ClassSession::withoutGlobalScopes()->create([
                    'organization_id' => $batch->organization_id,
                    'batch_id' => $batch->id,
                    'teacher_id' => $teachers->isNotEmpty() ? $teachers->random() : null,
                    'scheduled_date' => $date->toDateString(),
                    'start_time' => $rule->start_time,
                    'end_time' => $rule->end_time,
                    'status' => $status,
                    'topic' => $status === 'cancelled' ? null : self::TOPICS[array_rand(self::TOPICS)],
                ]);
            }
        }

        $this->command->info('Class sessions seeded.');
    }
}
