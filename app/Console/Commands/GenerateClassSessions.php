<?php

namespace App\Console\Commands;

use App\Models\Batch;
use App\Models\ClassSession;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateClassSessions extends Command
{
    protected $signature = 'classes:generate {--days=14 : Number of days to generate ahead}';
    protected $description = 'Generate individual class sessions from batch schedule rules';

    public function handle()
    {
        $daysAhead = (int) $this->option('days');
        $startDate = Carbon::today();
        $endDate = Carbon::today()->addDays($daysAhead);

        $this->info("Generating class sessions from {$startDate->toDateString()} to {$endDate->toDateString()}");

        // We temporarily disable tenant scope since this is a system-wide cron command
        $batches = Batch::withoutGlobalScopes()->where('status', 'active')->get();

        $generatedCount = 0;

        foreach ($batches as $batch) {
            $schedules = $batch->scheduleRules()->withoutGlobalScopes()->get();

            if ($schedules->isEmpty()) {
                continue;
            }

            // Loop through each day in the window
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                $dayName = $date->englishDayOfWeek; // e.g., 'Monday'

                foreach ($schedules as $schedule) {
                    if (strcasecmp($schedule->day_of_week, $dayName) === 0) {
                        // Check if session already exists for this batch, date, and start time
                        $exists = ClassSession::withoutGlobalScopes()
                            ->where('batch_id', $batch->id)
                            ->where('scheduled_date', $date->toDateString())
                            ->where('start_time', $schedule->start_time)
                            ->exists();

                        if (!$exists) {
                            ClassSession::withoutGlobalScopes()->create([
                                'organization_id' => $batch->organization_id,
                                'batch_id' => $batch->id,
                                'scheduled_date' => $date->toDateString(),
                                'start_time' => $schedule->start_time,
                                'end_time' => $schedule->end_time,
                                'status' => 'scheduled',
                            ]);
                            $generatedCount++;
                        }
                    }
                }
            }
        }

        $this->info("Successfully generated {$generatedCount} new class sessions.");
    }
}
