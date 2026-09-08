<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\StudentDiscount;
use Illuminate\Database\Seeder;

class StudentDiscountSeeder extends Seeder
{
    /**
     * A minority of active students get a standing discount (sibling/scholarship
     * style), applicable to all their courses (course_id left null).
     */
    public function run(): void
    {
        StudentDiscount::withoutGlobalScopes()->forceDelete();

        $students = Student::withoutGlobalScopes()->where('status', 'active')->get();

        foreach ($students as $i => $student) {
            if ($i % 5 !== 0) {
                continue;
            }

            $isPercentage = $i % 10 === 0;

            StudentDiscount::withoutGlobalScopes()->create([
                'organization_id' => $student->organization_id,
                'student_id' => $student->id,
                'course_id' => null,
                'discount_type' => $isPercentage ? 'percentage' : 'fixed',
                'discount_value' => $isPercentage ? 10 : 200,
                'start_date' => now()->subMonths(3),
                'end_date' => null,
            ]);
        }

        $this->command->info('Student discounts seeded.');
    }
}
