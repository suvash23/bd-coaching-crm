<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * One set of courses per organization, mixing monthly (recurring fee)
     * and fixed (one-off fee) course types.
     */
    public function run(): void
    {
        Course::withoutGlobalScopes()->forceDelete();

        $courses = [
            ['name' => 'HSC Physics', 'fee_type' => 'monthly', 'amount' => 1500],
            ['name' => 'SSC Higher Math', 'fee_type' => 'monthly', 'amount' => 1200],
            ['name' => 'Spoken English', 'fee_type' => 'fixed', 'amount' => 3000],
            ['name' => 'Admission Crash Course', 'fee_type' => 'fixed', 'amount' => 5000],
        ];

        foreach (Organization::withoutGlobalScopes()->get() as $organization) {
            foreach ($courses as $course) {
                Course::withoutGlobalScopes()->create($course + ['organization_id' => $organization->id]);
            }
        }

        $this->command->info('Courses seeded.');
    }
}
