<?php

use App\Models\Organization;
use App\Models\Package;
use App\Models\Subscription;
use App\Models\User;

test('superadmin can view the superadmin dashboard', function () {
    $superAdmin = User::factory()->create(['organization_id' => null, 'role' => 'superadmin']);

    $org = Organization::create(['name' => 'Test Org']);
    $package = Package::create(['name' => 'Basic', 'slug' => 'basic', 'max_students' => 50, 'price_bdt' => 1000, 'trial_days' => 14]);
    $org->subscriptions()->create(['package_id' => $package->id, 'status' => 'active', 'starts_at' => now()]);

    $response = $this
        ->actingAs($superAdmin)
        ->get(route('superadmin.dashboard'));

    $response->assertOk();
});

test('superadmin can view the organizations list', function () {
    $superAdmin = User::factory()->create(['organization_id' => null, 'role' => 'superadmin']);
    Organization::create(['name' => 'Test Org']);

    $response = $this
        ->actingAs($superAdmin)
        ->get(route('superadmin.organizations.index'));

    $response->assertOk();
});

test('superadmin can suspend an organization', function () {
    $superAdmin = User::factory()->create(['organization_id' => null, 'role' => 'superadmin']);
    $org = Organization::create(['name' => 'Test Org']);
    $package = Package::create(['name' => 'Basic', 'slug' => 'basic', 'max_students' => 50, 'price_bdt' => 1000, 'trial_days' => 14]);
    $subscription = $org->subscriptions()->create(['package_id' => $package->id, 'status' => 'active', 'starts_at' => now()]);

    $response = $this
        ->actingAs($superAdmin)
        ->post(route('superadmin.organizations.update-status', $org), ['status' => 'suspended']);

    $response->assertRedirect();
    $this->assertDatabaseHas('organizations', ['id' => $org->id, 'status' => 'suspended']);
    $this->assertDatabaseHas('subscriptions', ['id' => $subscription->id, 'status' => 'suspended']);
});

test('a regular user cannot access superadmin routes', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id, 'role' => 'admin']);

    $response = $this
        ->actingAs($user)
        ->get(route('superadmin.dashboard'));

    $response->assertForbidden();
});
