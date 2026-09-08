<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminOrganizationController extends Controller
{
    public function index()
    {
        $organizations = Organization::with(['activeSubscription.package'])
            ->withCount('students')
            ->orderBy('created_at', 'desc')
            ->paginate(15) // Use pagination for the dedicated list
            ->through(function ($org) {
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

        return Inertia::render('Superadmin/Organizations/Index', [
            'organizations' => $organizations,
        ]);
    }

    public function updateStatus(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,suspended',
        ]);

        $organization->update(['status' => $validated['status']]);

        if ($validated['status'] === 'suspended' && $organization->activeSubscription) {
            $organization->activeSubscription->update(['status' => 'suspended']);
        }

        return redirect()->back()->with('success', 'Organization status updated successfully.');
    }
}
