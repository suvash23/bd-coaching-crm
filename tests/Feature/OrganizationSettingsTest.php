<?php

use App\Models\Organization;
use App\Models\User;

test('user can update organization settings', function () {
    $org = Organization::create(['name' => 'Old Org Name', 'short_code' => 'OLD']);
    $user = User::factory()->create(['organization_id' => $org->id]);

    $response = $this
        ->actingAs($user)
        ->post(route('organization.update'), [
            'name' => 'New Coaching Academy',
            'short_code' => 'NCA',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('organizations', [
        'id' => $org->id,
        'name' => 'New Coaching Academy',
        'short_code' => 'NCA',
    ]);
});
