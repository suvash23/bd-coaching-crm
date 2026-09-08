<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\Course;
use Illuminate\Database\Seeder;

class BatchSeeder extends Seeder
{
    /**
     * A Morning batch (always active) and an Evening batch (occasionally
     * inactive, to exercise the "inactive batch" filters in the UI) per course.
     */
    public function run(): void
    {
        Batch::withoutGlobalScopes()->forceDelete();

        foreach (Course::withoutGlobalScopes()->get() as $course) {
            Batch::withoutGlobalScopes()->create([
                'organization_id' => $course->organization_id,
                'course_id' => $course->id,
                'name' => "{$course->name} - Morning",
                'capacity' => 25,
                'status' => 'active',
            ]);

            Batch::withoutGlobalScopes()->create([
                'organization_id' => $course->organization_id,
                'course_id' => $course->id,
                'name' => "{$course->name} - Evening",
                'capacity' => 20,
                'status' => $course->id % 4 === 0 ? 'inactive' : 'active',
            ]);
        }

        $this->command->info('Batches seeded.');
    }
}
