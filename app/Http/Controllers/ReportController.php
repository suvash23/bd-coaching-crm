<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Batch;
use App\Models\ClassSession;
use App\Models\Invoice;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $year = (int) $request->query('year', now()->year);
        $month = (int) $request->query('month', now()->month);

        // ── Financial Summary ──────────────────────────────────────────────────
        $financialMonthly = Invoice::selectRaw(
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

        $financialTotals = [
            'total_billed' => Invoice::where('billing_month', 'like', $year.'-%')->sum('amount'),
            'total_collected' => Invoice::where('billing_month', 'like', $year.'-%')->where('status', 'paid')->sum('amount'),
            'total_outstanding' => Invoice::where('billing_month', 'like', $year.'-%')->where('status', 'unpaid')->sum('amount'),
            'total_invoices' => Invoice::where('billing_month', 'like', $year.'-%')->count(),
            'paid_count' => Invoice::where('billing_month', 'like', $year.'-%')->where('status', 'paid')->count(),
            'unpaid_count' => Invoice::where('billing_month', 'like', $year.'-%')->where('status', 'unpaid')->count(),
        ];

        // ── Attendance Summary ─────────────────────────────────────────────────
        // Per-batch attendance rate for the selected month
        $batchAttendance = Batch::with(['scheduleRules'])
            ->withCount([
                'students as active_students' => fn ($q) => $q->where('students.status', 'active'),
            ])
            ->get()
            ->map(function ($batch) use ($year, $month) {
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

                $total_possible = $sessions * ($batch->active_students ?? 0);
                $rate = $total_possible > 0 ? round(($present / $total_possible) * 100, 1) : 0;

                return [
                    'batch_name' => $batch->name,
                    'status' => $batch->status,
                    'active_students' => $batch->active_students,
                    'sessions_held' => $sessions,
                    'present_count' => $present,
                    'total_possible' => $total_possible,
                    'attendance_rate' => $rate,
                ];
            });

        // Overall attendance
        $totalSessions = ClassSession::whereYear('scheduled_date', $year)
            ->whereMonth('scheduled_date', $month)
            ->count();

        $totalPresent = Attendance::whereHas('classSession', fn ($q) => $q
            ->whereYear('scheduled_date', $year)
            ->whereMonth('scheduled_date', $month))
            ->where('status', 'present')
            ->count();

        $totalAbsent = Attendance::whereHas('classSession', fn ($q) => $q
            ->whereYear('scheduled_date', $year)
            ->whereMonth('scheduled_date', $month))
            ->where('status', 'absent')
            ->count();

        // ── Student Summary ────────────────────────────────────────────────────
        $studentStats = [
            'total' => Student::count(),
            'active' => Student::where('status', 'active')->count(),
            'inactive' => Student::where('status', 'inactive')->count(),
        ];

        // Students per batch
        $studentsPerBatch = Batch::withCount([
            'students as total_students',
            'students as active_students' => fn ($q) => $q->where('students.status', 'active'),
        ])
            ->orderByDesc('active_students')
            ->get()
            ->map(fn ($b) => [
                'batch_name' => $b->name,
                'status' => $b->status,
                'total_students' => $b->total_students,
                'active_students' => $b->active_students,
            ]);

        // Students added per month this year
        $newStudentsMonthly = Student::selectRaw(
            'EXTRACT(MONTH FROM created_at)::int as month, COUNT(*) as count'
        )
            ->whereYear('created_at', $year)
            ->groupByRaw('EXTRACT(MONTH FROM created_at)')
            ->orderByRaw('EXTRACT(MONTH FROM created_at)')
            ->get()
            ->keyBy('month');

        return Inertia::render('Reports/Index', [
            'year' => $year,
            'month' => $month,
            'financialMonthly' => $financialMonthly,
            'financialTotals' => $financialTotals,
            'batchAttendance' => $batchAttendance,
            'attendanceSummary' => [
                'sessions' => $totalSessions,
                'present' => $totalPresent,
                'absent' => $totalAbsent,
            ],
            'studentStats' => $studentStats,
            'studentsPerBatch' => $studentsPerBatch,
            'newStudentsMonthly' => $newStudentsMonthly,
        ]);
    }
}
