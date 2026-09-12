<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Package;
use App\Models\User;
use App\Services\SuperAdminMetricsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
            'packages' => Package::orderBy('price_bdt')->get(['id', 'name', 'slug']),
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'short_code' => 'required|string|max:10|unique:organizations',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|unique:users,email',
            'admin_password' => 'required|string|min:8',
        ]);

        $organization = Organization::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'short_code' => strtoupper($validated['short_code']),
            'status' => 'active',
        ]);

        User::create([
            'organization_id' => $organization->id,
            'name' => $validated['admin_name'],
            'email' => $validated['admin_email'],
            'password' => Hash::make($validated['admin_password']),
            'role' => 'admin',
        ]);

        /** @var Package|null $freeTrialPackage */
        $freeTrialPackage = Package::where('slug', 'free-trial')->first();
        if ($freeTrialPackage) {
            $organization->subscriptions()->create([
                'package_id' => $freeTrialPackage->id,
                'status' => 'trial',
                'starts_at' => now(),
                'trial_ends_at' => now()->addDays($freeTrialPackage->trial_days),
            ]);
        }

        return redirect()->back()->with('success', 'Organization and admin user created successfully.');
    }

    public function update(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'short_code' => 'required|string|max:10|unique:organizations,short_code,'.$organization->id,
        ]);

        $organization->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'short_code' => strtoupper($validated['short_code']),
        ]);

        return redirect()->back()->with('success', 'Organization updated successfully.');
    }

    public function destroy(Organization $organization)
    {
        $organization->delete();

        return redirect()->back()->with('success', 'Organization deleted successfully.');
    }

    public function extendTrial(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'days' => 'required|integer|min:1',
        ]);

        $days = (int) $validated['days'];
        $subscription = $organization->activeSubscription;

        if ($subscription) {
            $subscription->update([
                'trial_ends_at' => ($subscription->trial_ends_at ?? now())->addDays($days),
            ]);
        } else {
            $freeTrialPackage = Package::where('slug', 'free-trial')->first();
            if ($freeTrialPackage) {
                $organization->subscriptions()->create([
                    'package_id' => $freeTrialPackage->id,
                    'status' => 'trial',
                    'starts_at' => now(),
                    'trial_ends_at' => now()->addDays($days),
                ]);
            }
        }

        return redirect()->back()->with('success', 'Trial extended successfully.');
    }

    public function changePackage(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
        ]);

        $package = Package::findOrFail($validated['package_id']);

        $subscription = $organization->activeSubscription;

        if ($subscription) {
            $subscription->update([
                'package_id' => $package->id,
                'status' => $package->trial_days > 0 ? 'trial' : 'active',
                'trial_ends_at' => $package->trial_days > 0 ? now()->addDays($package->trial_days) : null,
                'expires_at' => $package->trial_days > 0 ? null : now()->addYear(),
            ]);
        } else {
            $organization->subscriptions()->create([
                'package_id' => $package->id,
                'status' => $package->trial_days > 0 ? 'trial' : 'active',
                'starts_at' => now(),
                'trial_ends_at' => $package->trial_days > 0 ? now()->addDays($package->trial_days) : null,
                'expires_at' => $package->trial_days > 0 ? null : now()->addYear(),
            ]);
        }

        return redirect()->back()->with('success', "Package changed to {$package->name} successfully.");
    }

    public function impersonate(Request $request, Organization $organization)
    {
        $admin = User::where('organization_id', $organization->id)->where('role', 'admin')->first();
        
        if (!$admin) {
            return redirect()->back()->with('error', 'No admin user found for this organization.');
        }

        $request->session()->put('impersonated_by', auth()->id());
        
        auth()->login($admin);

        return redirect()->route('dashboard');
    }
}
