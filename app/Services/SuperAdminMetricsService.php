<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\Package;
use App\Models\Payment;
use App\Models\Student;
use App\Models\Subscription;
use App\Models\TenantPayment;
use Illuminate\Support\Facades\DB;

class SuperAdminMetricsService
{
    /**
     * Platform-wide counts shown on the superadmin dashboard.
     *
     * @return array<string, int>
     */
    public function platformStats(): array
    {
        $currentMrr = Subscription::where('status', 'active')
            ->join('packages', 'subscriptions.package_id', '=', 'packages.id')
            ->sum('packages.price_bdt');

        return [
            'total_organizations' => Organization::count(),
            'active_organizations' => Organization::where('status', 'active')->count(),
            'total_students_platform' => Student::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'trial_subscriptions' => Subscription::where('status', 'trial')->count(),
            'current_mrr' => (int) $currentMrr,
        ];
    }

    /**
     * Get historical SaaS revenue data for the last 6 months.
     *
     * @return array
     */
    public function historicalRevenue(): array
    {
        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();

        $data = TenantPayment::where('paid_at', '>=', $sixMonthsAgo)
            ->where('status', 'paid')
            ->select(
                DB::raw("DATE_TRUNC('month', paid_at) as month_date"),
                DB::raw('SUM(amount) as revenue')
            )
            ->groupBy('month_date')
            ->orderBy('month_date')
            ->get();

        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i)->startOfMonth();
            $label = $month->format('M Y');
            $row = $data->firstWhere('month_date', $month->format('Y-m-d 00:00:00'));
            $chartData[] = [
                'name' => $label,
                'revenue' => $row ? (int) $row->revenue : 0,
            ];
        }

        return $chartData;
    }

    /**
     * The organization summary shape shared by the superadmin dashboard's
     * recent-organizations list and the dedicated organizations index page.
     *
     * @return array<string, mixed>
     */
    public function summarizeOrganization(Organization $organization): array
    {
        $subscriptionData = null;
        if ($organization->activeSubscription) {
            $subscriptionData = [
                'status' => $organization->activeSubscription->status,
                'package_name' => $organization->activeSubscription->package->name,
                'trial_ends_at' => $organization->activeSubscription->trial_ends_at?->format('Y-m-d'),
                'trial_days_remaining' => $organization->activeSubscription->trial_ends_at ? max(0, (int) now()->diffInDays($organization->activeSubscription->trial_ends_at, false)) : 0,
                'expires_at' => $organization->activeSubscription->expires_at?->format('Y-m-d'),
                'max_students' => $organization->activeSubscription->package->max_students,
            ];
        } else {
            $freeTrialPackage = Package::where('slug', 'free-trial')->first();
            if ($freeTrialPackage) {
                $daysUsed = (int) now()->diffInDays($organization->created_at);
                $remaining = max(0, $freeTrialPackage->trial_days - $daysUsed);
                $subscriptionData = [
                    'status' => 'trial',
                    'package_name' => $freeTrialPackage->name,
                    'trial_ends_at' => $organization->created_at->copy()->addDays($freeTrialPackage->trial_days)->format('Y-m-d'),
                    'trial_days_remaining' => $remaining,
                    'expires_at' => null,
                    'max_students' => $freeTrialPackage->max_students,
                ];
            }
        }

        return [
            'id' => $organization->id,
            'name' => $organization->name,
            'domain' => $organization->domain,
            'status' => $organization->status,
            'created_at' => $organization->created_at->format('Y-m-d'),
            'student_count' => $organization->students_count,
            'total_revenue' => Payment::withoutGlobalScopes()
                ->where('organization_id', $organization->id)
                ->whereNull('deleted_at')
                ->sum('amount'),
            'subscription' => $subscriptionData,
        ];
    }
}
