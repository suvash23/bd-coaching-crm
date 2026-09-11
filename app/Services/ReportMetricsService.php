<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Batch;
use App\Models\ClassSession;
use App\Models\Invoice;
use App\Models\Student;
use Illuminate\Support\Collection;

class ReportMetricsService
{
    /**
     * Monthly billed/collected/outstanding breakdown for the given year, plus totals.
     *
     * @return array{monthly: Collection, totals: array<string, int|float>}
     */
    public function financialSummary(int $year): array
    {
        $monthly = Invoice::selectRaw(
            "billing_month as month,
                 SUM(amount) as total_billed,
                 SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_collected,
                 SUM(CASE WHEN status = 'unpaid' THEN amount ELSE 0 END) as total_outstanding,
                 COUNT(*) as invoice_count"
        )
            ->where('billing_month', 'like', $year.'-%')
            ->groupBy('billing_month')
            ->orderBy('billing_month')
            ->get();

        $totals = [
            'total_billed' => Invoice::where('billing_month', 'like', $year.'-%')->sum('amount'),
            'total_collected' => Invoice::where('billing_month', 'like', $year.'-%')->where('status', 'paid')->sum('amount'),
            'total_outstanding' => Invoice::where('billing_month', 'like', $year.'-%')->where('status', 'unpaid')->sum('amount'),
            'total_invoices' => Invoice::where('billing_month', 'like', $year.'-%')->count(),
            'paid_count' => Invoice::where('billing_month', 'like', $year.'-%')->where('status', 'paid')->count(),
            'unpaid_count' => Invoice::where('billing_month', 'like', $year.'-%')->where('status', 'unpaid')->count(),
        ];

        return ['monthly' => $monthly, 'totals' => $totals];
    }

    /**
     * Per-batch attendance rate for the given month, plus platform-wide totals.
     *
     * @return array{byBatch: Collection, overall: array<string, int>}
     */
    public function attendanceSummary(int $year, int $month): array
    {
        $byBatch = Batch::with(['scheduleRules'])
            ->withCount([
                'students as active_students' => fn ($q) => $q->where('students.status', 'active'),
            ])
            ->get()
            ->map(function (Batch $batch) use ($year, $month) {
                $sessions = ClassSession::where('batch_id', $batch->id)
                    ->whereYear('scheduled_date', $year)
                    ->whereMonth('scheduled_date', $month)
                    ->count();

                $present = Attendance::whereHas(
                    'classSession',
                    fn ($q) => $q
                        ->where('batch_id', $batch->id)
                        ->whereYear('scheduled_date', $year)
                        ->whereMonth('scheduled_date', $month)
                )
                    ->where('status', 'present')
                    ->count();

                $totalPossible = $sessions * ($batch->active_students ?? 0);
                $rate = $totalPossible > 0 ? round(($present / $totalPossible) * 100, 1) : 0;

                return [
                    'batch_name' => $batch->name,
                    'status' => $batch->status,
                    'active_students' => $batch->active_students,
                    'sessions_held' => $sessions,
                    'present_count' => $present,
                    'total_possible' => $totalPossible,
                    'attendance_rate' => $rate,
                ];
            });

        $overall = [
            'sessions' => ClassSession::whereYear('scheduled_date', $year)->whereMonth('scheduled_date', $month)->count(),
            'present' => Attendance::whereHas('classSession', fn ($q) => $q
                ->whereYear('scheduled_date', $year)
                ->whereMonth('scheduled_date', $month))
                ->where('status', 'present')
                ->count(),
            'absent' => Attendance::whereHas('classSession', fn ($q) => $q
                ->whereYear('scheduled_date', $year)
                ->whereMonth('scheduled_date', $month))
                ->where('status', 'absent')
                ->count(),
        ];

        return ['byBatch' => $byBatch, 'overall' => $overall];
    }

    /**
     * Overall student counts, per-batch enrollment, and monthly signups for the given year.
     *
     * @return array{stats: array<string, int>, perBatch: Collection, newMonthly: Collection}
     */
    public function studentSummary(int $year): array
    {
        $stats = [
            'total' => Student::count(),
            'active' => Student::where('status', 'active')->count(),
            'inactive' => Student::where('status', 'inactive')->count(),
        ];

        $perBatch = Batch::withCount([
            'students as total_students',
            'students as active_students' => fn ($q) => $q->where('students.status', 'active'),
        ])
            ->orderByDesc('active_students')
            ->get()
            ->map(fn (Batch $batch) => [
                'batch_name' => $batch->name,
                'status' => $batch->status,
                'total_students' => $batch->total_students,
                'active_students' => $batch->active_students,
            ]);

        // Grouped in PHP rather than a driver-specific date-part SQL function
        // (Postgres, MySQL, and SQLite each spell "extract month" differently).
        $newMonthly = Student::whereYear('created_at', $year)
            ->get(['created_at'])
            ->groupBy(fn (Student $student) => $student->created_at->month)
            ->map(fn ($students, $month) => ['month' => $month, 'count' => $students->count()]);

        return ['stats' => $stats, 'perBatch' => $perBatch, 'newMonthly' => $newMonthly];
    }
}
