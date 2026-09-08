<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\Student;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * Monthly courses get one invoice per month for the last 4 months (older
     * months skew paid, the current month skews unpaid/partial, matching a
     * realistic collection curve). Fixed-fee courses get a single invoice.
     * Any standing student discount is applied to discount_amount.
     */
    public function run(): void
    {
        Invoice::withoutGlobalScopes()->forceDelete();

        $months = collect(range(3, 0))->map(fn (int $monthsAgo) => now()->subMonths($monthsAgo))->values();

        $students = Student::withoutGlobalScopes()
            ->with(['batches.course', 'discounts'])
            ->where('status', 'active')
            ->get();

        foreach ($students as $student) {
            $courses = $student->batches->pluck('course')->filter()->unique('id');

            foreach ($courses as $course) {
                $discount = $student->discounts->first(
                    fn ($d) => is_null($d->course_id) || $d->course_id === $course->id
                );

                $discountAmount = 0;
                if ($discount) {
                    $discountAmount = $discount->discount_type === 'percentage'
                        ? round($course->amount * $discount->discount_value / 100, 2)
                        : min((float) $discount->discount_value, (float) $course->amount);
                }

                if ($course->fee_type === 'monthly') {
                    foreach ($months as $i => $month) {
                        $status = match (true) {
                            $i <= 1 => 'paid',
                            $i === 2 => fake()->randomElement(['paid', 'paid', 'partial']),
                            default => fake()->randomElement(['unpaid', 'partial', 'paid']),
                        };

                        Invoice::withoutGlobalScopes()->create([
                            'organization_id' => $student->organization_id,
                            'student_id' => $student->id,
                            'course_id' => $course->id,
                            'billing_month' => $month->format('Y-m'),
                            'amount' => $course->amount,
                            'discount_amount' => $discountAmount,
                            'status' => $status,
                            'due_date' => $month->copy()->endOfMonth(),
                        ]);
                    }
                } else {
                    Invoice::withoutGlobalScopes()->create([
                        'organization_id' => $student->organization_id,
                        'student_id' => $student->id,
                        'course_id' => $course->id,
                        'billing_month' => null,
                        'amount' => $course->amount,
                        'discount_amount' => $discountAmount,
                        'status' => fake()->randomElement(['paid', 'paid', 'unpaid']),
                        'due_date' => now()->addDays(7),
                    ]);
                }
            }
        }

        $this->command->info('Invoices seeded.');
    }
}
