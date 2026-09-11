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

    public function plan()
    {
        $user = auth()->user();
        $organization = $user->organization;

        // Get the organization's current active subscription
        $currentSubscription = $organization->activeSubscription;
        $currentPackage = null;
        $currentPlanName = null;

        if ($currentSubscription) {
            $currentPackage = $currentSubscription->package;
            $currentPlanName = $currentPackage?->name;
        }

        // Get all available packages
        $packages = Package::orderBy('price_bdt', 'asc')->get()->map(function ($pkg) {
            return [
                'id' => $pkg->id,
                'name' => $pkg->name,
                'slug' => $pkg->slug,
                'price' => $pkg->price_bdt,
                'max_students' => $pkg->max_students,
                'trial_days' => $pkg->trial_days,
                'is_active' => $pkg->is_active,
            ];
        });

        return Inertia::render('Coaching/Plan/Index', [
            'currentPackage' => $currentPackage,
            'currentPlanName' => $currentPlanName,
            'packages' => $packages,
            'user' => $user,
        ]);
    }
}
