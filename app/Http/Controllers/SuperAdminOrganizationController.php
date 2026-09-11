<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Services\SuperAdminMetricsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminOrganizationController extends Controller
{
    public function __construct(private SuperAdminMetricsService $metrics) {}

    public function index()
    {
        $organizations = Organization::with(['activeSubscription.package'])
            ->withCount('students')
            ->orderBy('created_at', 'desc')
            ->paginate(15) // Use pagination for the dedicated list
            ->through(fn (Organization $organization) => $this->metrics->summarizeOrganization($organization));

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
