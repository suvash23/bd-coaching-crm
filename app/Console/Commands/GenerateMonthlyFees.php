<?php

namespace App\Console\Commands;

use App\Models\Batch;
use App\Models\Course;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateMonthlyFees extends Command
{
    protected $signature = 'fees:generate-monthly';
    protected $description = 'Generate monthly invoices for active students enrolled in monthly-fee courses.';

    public function handle()
    {
        // Format: YYYY-MM
        $billingMonth = Carbon::now()->format('Y-m');

        // Example logic: due by the 10th of the current month
        $dueDate = Carbon::now()->startOfMonth()->addDays(9)->toDateString();

        $this->info("Generating fees for {$billingMonth}...");

        // Only target courses that are monthly
        $courses = Course::withoutGlobalScopes()->where('fee_type', 'monthly')->get();
        $generatedCount = 0;

        foreach ($courses as $course) {
            // Find all active batches for this course and their active students
            $batches = Batch::withoutGlobalScopes()
                ->where('course_id', $course->id)
                ->where('status', 'active')
                ->with([
                    'students' => function ($query) {
                        // We only want to bill active students
                        $query->where('students.status', 'active');
                    }
                ])
                ->get();

            foreach ($batches as $batch) {
                foreach ($batch->students as $student) {

                    // Check if an invoice already exists for this exact Student, Course, and Month
                    $exists = Invoice::withoutGlobalScopes()
                        ->where('student_id', $student->id)
                        ->where('course_id', $course->id)
                        ->where('billing_month', $billingMonth)
                        ->exists();

                    if (!$exists) {
                        Invoice::withoutGlobalScopes()->create([
                            'organization_id' => $course->organization_id,
                            'student_id' => $student->id,
                            'course_id' => $course->id,
                            'billing_month' => $billingMonth,
                            'amount' => $course->amount,
                            'status' => 'unpaid',
                            'due_date' => $dueDate,
                        ]);
                        $generatedCount++;
                    }
                }
            }
        }

        $this->info("Successfully generated {$generatedCount} new invoices for {$billingMonth}.");
    }
}
