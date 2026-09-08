<?php

namespace App\Http\Controllers;

use App\Services\ReportMetricsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __construct(private ReportMetricsService $metrics) {}

    public function index(Request $request): Response
    {
        $year = (int) $request->query('year', now()->year);
        $month = (int) $request->query('month', now()->month);

        $financial = $this->metrics->financialSummary($year);
        $attendance = $this->metrics->attendanceSummary($year, $month);
        $students = $this->metrics->studentSummary($year);

        return Inertia::render('Reports/Index', [
            'year' => $year,
            'month' => $month,
            'financialMonthly' => $financial['monthly'],
            'financialTotals' => $financial['totals'],
            'batchAttendance' => $attendance['byBatch'],
            'attendanceSummary' => $attendance['overall'],
            'studentStats' => $students['stats'],
            'studentsPerBatch' => $students['perBatch'],
            'newStudentsMonthly' => $students['newMonthly'],
        ]);
    }
}
