<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\ScheduleRule;
use Illuminate\Database\Seeder;

class ScheduleRuleSeeder extends Seeder
{
    /**
     * Two class days a week per active batch — Morning batches meet
     * Sat/Mon/Wed, Evening batches meet Sun/Tue/Thu (BD work week: Fri is the weekend).
     */
    public function run(): void
    {
        ScheduleRule::withoutGlobalScopes()->delete();

        $morningDays = ['Saturday', 'Monday', 'Wednesday'];
        $eveningDays = ['Sunday', 'Tuesday', 'Thursday'];

        foreach (Batch::withoutGlobalScopes()->where('status', 'active')->get() as $batch) {
            $isMorning = str_contains($batch->name, 'Morning');
            $days = $isMorning ? $morningDays : $eveningDays;
            [$start, $end] = $isMorning ? ['09:00', '10:30'] : ['17:00', '18:30'];

            foreach ($days as $day) {
                ScheduleRule::withoutGlobalScopes()->create([
                    'organization_id' => $batch->organization_id,
                    'batch_id' => $batch->id,
                    'day_of_week' => $day,
                    'start_time' => $start,
                    'end_time' => $end,
                ]);
            }
        }

        $this->command->info('Schedule rules seeded.');
    }
}
