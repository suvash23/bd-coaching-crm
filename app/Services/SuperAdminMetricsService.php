<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\Student;
use App\Models\Subscription;

class SuperAdminMetricsService
{
    /**
     * Platform-wide counts shown on the superadmin dashboard.
     *
     * @return array<string, int>
     */
    public function platformStats(): array
    {
        return [
            'total_organizations' => Organization::count(),
            'active_organizations' => Organization::where('status', 'active')->count(),
            'total_students_platform' => Student::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'trial_subscriptions' => Subscription::where('status', 'trial')->count(),
        ];
    }

    /**
     * The organization summary shape shared by the superadmin dashboard's
     * recent-organizations list and the dedicated organizations index page.
     *
     * @return array<string, mixed>
     */
    public function summarizeOrganization(Organization $organization): array
    {
        return [
            'id' => $organization->id,
            'name' => $organization->name,
            'domain' => $organization->domain,
            'status' => $organization->status,
            'created_at' => $organization->created_at->format('Y-m-d'),
            'student_count' => $organization->students_count,
            'subscription' => $organization->activeSubscription ? [
                'status' => $organization->activeSubscription->status,
                'package_name' => $organization->activeSubscription->package->name,
                'trial_ends_at' => $organization->activeSubscription->trial_ends_at?->format('Y-m-d'),
                'expires_at' => $organization->activeSubscription->expires_at?->format('Y-m-d'),
                'max_students' => $organization->activeSubscription->package->max_students,
            ] : null,
        ];
    }
}
