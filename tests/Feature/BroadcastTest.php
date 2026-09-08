<?php

use App\Models\Organization;
use App\Models\User;

test('authenticated user can view broadcasts page', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('broadcasts.index'));

    $response->assertOk();
});

test('user can create a broadcast message', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);

    $response = $this
        ->actingAs($user)
        ->post(route('broadcasts.store'), [
            'type' => 'sms',
            'title' => 'Important Notice',
            'message' => 'Class is canceled today.',
            'target_type' => 'all',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('broadcasts', [
        'organization_id' => $org->id,
        'type' => 'sms',
        'message' => 'Class is canceled today.',
        'status' => 'sent',
    ]);
});
