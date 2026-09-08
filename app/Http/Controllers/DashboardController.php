<?php

namespace App\Http\Controllers;

use App\Services\DashboardMetricsService;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private DashboardMetricsService $metrics) {}

    public function index(): Response
    {
        $today = Carbon::today();

        return Inertia::render('Dashboard', [
            'stats' => $this->metrics->stats($today),
            'feeBreakdown' => $this->metrics->feeBreakdown(),
            'collectionTrend' => $this->metrics->collectionTrend($today),
            'recentStudents' => $this->metrics->recentStudents(),
        ]);
    }
}
