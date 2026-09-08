<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Student;
use App\Models\Subscription;
use Inertia\Inertia;

class SuperAdminDashboardController extends Controller
{
    public function index()
    {
        $organizations = Organization::with(['activeSubscription.package'])
            ->withCount('students')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($org) {
                return [
                    'id' => $org->id,
                    'name' => $org->name,
                    'domain' => $org->domain,
                    'status' => $org->status,
                    'created_at' => $org->created_at->format('Y-m-d'),
                    'student_count' => $org->students_count,
                    'subscription' => $org->activeSubscription ? [
                        'status' => $org->activeSubscription->status,
                        'package_name' => $org->activeSubscription->package->name,
                        'trial_ends_at' => $org->activeSubscription->trial_ends_at?->format('Y-m-d'),
                        'expires_at' => $org->activeSubscription->expires_at?->format('Y-m-d'),
                        'max_students' => $org->activeSubscription->package->max_students,
                    ] : null,
                ];
            });

        $stats = [
            'total_organizations' => Organization::count(),
            'active_organizations' => Organization::where('status', 'active')->count(),
            'total_students_platform' => Student::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'trial_subscriptions' => Subscription::where('status', 'trial')->count(),
        ];

        return Inertia::render('Superadmin/Dashboard', [
            'organizations' => $organizations,
            'stats' => $stats,
        ]);
    }
}
