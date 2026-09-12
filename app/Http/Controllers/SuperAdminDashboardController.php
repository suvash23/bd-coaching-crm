<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Services\SuperAdminMetricsService;
use Inertia\Inertia;

class SuperAdminDashboardController extends Controller
{
    public function __construct(private SuperAdminMetricsService $metrics) {}

    public function index()
    {
        $organizations = Organization::with(['activeSubscription.package'])
            ->withCount('students')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(fn (Organization $organization) => $this->metrics->summarizeOrganization($organization));

        return Inertia::render('Superadmin/Dashboard', [
            'organizations' => $organizations,
            'stats'         => $this->metrics->platformStats(),
            'revenueData'   => $this->metrics->historicalRevenue(),
        ]);
    }
}
