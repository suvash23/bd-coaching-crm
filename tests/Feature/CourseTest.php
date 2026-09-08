<?php

use App\Models\Course;
use App\Models\Organization;
use App\Models\User;

test('authenticated user can view courses page', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('courses.index'));

    $response->assertOk();
});

test('user can create a course', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);

    $response = $this
        ->actingAs($user)
        ->post(route('courses.store'), [
            'name' => 'Physics 101',
            'fee_type' => 'monthly',
            'amount' => 2000,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('courses', [
        'name' => 'Physics 101',
        'fee_type' => 'monthly',
        'amount' => 2000,
        'organization_id' => $org->id,
    ]);
});

test('course creation requires valid inputs', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('courses.store'), [
            'name' => '',
            'fee_type' => 'invalid_type',
            'amount' => -50,
        ]);

    $response->assertSessionHasErrors(['name', 'fee_type', 'amount']);
});

test('user can update a course', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $course = Course::create([
        'organization_id' => $org->id,
        'name' => 'Chemistry',
        'fee_type' => 'fixed',
        'amount' => 1500,
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('courses.update', $course), [
            'name' => 'Advanced Chemistry',
            'fee_type' => 'monthly',
            'amount' => 3000,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('courses', [
        'id' => $course->id,
        'name' => 'Advanced Chemistry',
        'fee_type' => 'monthly',
        'amount' => 3000,
    ]);
});

test('user can delete a course', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $course = Course::create([
        'organization_id' => $org->id,
        'name' => 'Biology',
        'fee_type' => 'monthly',
        'amount' => 1200,
    ]);

    $response = $this
        ->actingAs($user)
        ->delete(route('courses.destroy', $course));

    $response->assertRedirect();
    $this->assertSoftDeleted('courses', [
        'id' => $course->id,
    ]);
});
