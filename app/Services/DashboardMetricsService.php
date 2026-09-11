<?php

namespace App\Services;

use App\Models\Batch;
use App\Models\ClassSession;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DashboardMetricsService
{
    /**
     * Headline KPI figures for the given day: student/batch counts, today's
     * class count, cash collected this month, outstanding dues, and this
     * month's collection rate.
     *
     * @return array<string, int|float>
     */
    public function stats(Carbon $today): array
    {
        $monthlyCollection = (float) Payment::whereBetween('payment_date', [$today->copy()->startOfMonth(), $today])->sum('amount');

        $totalDues = (float) Invoice::whereIn('status', ['unpaid', 'partial'])
            ->with('payments')
            ->get()
            ->sum(fn (Invoice $invoice) => max($invoice->amount - $invoice->discount_amount - $invoice->payments->sum('amount'), 0));

        $invoicesDueThisMonth = $this->invoicesDueIn($today);
        $invoicedThisMonth = (float) $invoicesDueThisMonth->sum(fn (Invoice $invoice) => $invoice->amount - $invoice->discount_amount);
        $collectedForThisMonth = (float) $invoicesDueThisMonth->sum(fn (Invoice $invoice) => $invoice->payments->sum('amount'));
        $collectionRate = $invoicedThisMonth > 0 ? min(100, (int) round($collectedForThisMonth / $invoicedThisMonth * 100)) : 0;

        return [
            'total_students' => Student::count(),
            'active_batches' => Batch::where('status', 'active')->count(),
            'todays_classes' => ClassSession::where('scheduled_date', $today->toDateString())->count(),
            'monthly_collection' => $monthlyCollection,
            'total_dues' => $totalDues,
            'collection_rate' => $collectionRate,
        ];
    }

    /**
     * Invoice counts grouped by payment status.
     *
     * @return array<string, int>
     */
    public function feeBreakdown(): array
    {
        return [
            'paid' => Invoice::where('status', 'paid')->count(),
            'partial' => Invoice::where('status', 'partial')->count(),
            'unpaid' => Invoice::where('status', 'unpaid')->count(),
        ];
    }

    /**
     * Billed vs. collected amounts, plus running student/batch counts, for
     * each of the last `$months` months (oldest first).
     *
     * @return list<array<string, int|float|string>>
     */
    public function collectionTrend(Carbon $today, int $months = 4): array
    {
        return collect(range($months - 1, 0))
            ->map(function (int $monthsAgo) use ($today) {
                $month = $today->copy()->subMonths($monthsAgo);
                $monthEnd = $month->copy()->endOfMonth();

                return [
                    'label' => $month->format('M'),
                    'billed' => (float) $this->invoicesDueIn($month)->sum(fn (Invoice $invoice) => $invoice->amount - $invoice->discount_amount),
                    'collected' => (float) Payment::whereYear('payment_date', $month->year)->whereMonth('payment_date', $month->month)->sum('amount'),
                    'students' => Student::where('created_at', '<=', $monthEnd)->count(),
                    'batches' => Batch::where('status', 'active')->where('created_at', '<=', $monthEnd)->count(),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * The most recently added students, with their current batch (if any).
     *
     * @return list<array<string, mixed>>
     */
    public function recentStudents(int $limit = 5): array
    {
        return Student::with('batches')
            ->latest()
            ->take($limit)
            ->get()
            ->map(fn (Student $student) => [
                'id' => $student->id,
                'student_id_number' => $student->student_id_number,
                'name' => $student->name,
                'batch' => optional($student->batches->first())->name,
                'guardian_phone' => $student->guardian_phone,
                'phone' => $student->phone,
                'status' => $student->status,
            ])
            ->all();
    }

    /**
     * Invoices "due" in a given month: recurring monthly bills (billing_month
     * matches) plus one-off fixed-fee invoices that happen to fall due that
     * month, so billed-vs-collected comparisons aren't skewed by fixed
     * invoices paid in a month they weren't billed for.
     *
     * @return Collection<int, Invoice>
     */
    private function invoicesDueIn(Carbon $month): Collection
    {
        return Invoice::where(function ($query) use ($month) {
            $query->where('billing_month', $month->format('Y-m'))
                ->orWhere(function ($fixedFee) use ($month) {
                    $fixedFee->whereNull('billing_month')
                        ->whereYear('due_date', $month->year)
                        ->whereMonth('due_date', $month->month);
                });
        })->with('payments')->get();
    }
}
