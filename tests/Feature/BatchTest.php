<?php

use App\Models\Batch;
use App\Models\Course;
use App\Models\Organization;
use App\Models\ScheduleRule;
use App\Models\User;

test('authenticated user can view batches page', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('batches.index'));

    $response->assertOk();
});

test('user can create a batch', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $course = Course::create([
        'organization_id' => $org->id,
        'name' => 'Math 101',
        'fee_type' => 'monthly',
        'amount' => 1500,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('batches.store'), [
            'course_id' => $course->id,
            'name' => 'Morning Batch A',
            'capacity' => 30,
            'status' => 'active',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('batches', [
        'name' => 'Morning Batch A',
        'course_id' => $course->id,
        'capacity' => 30,
        'status' => 'active',
        'organization_id' => $org->id,
    ]);
});

test('user can update a batch', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $course = Course::create([
        'organization_id' => $org->id,
        'name' => 'Math 101',
        'fee_type' => 'monthly',
        'amount' => 1500,
    ]);
    $batch = Batch::create([
        'organization_id' => $org->id,
        'course_id' => $course->id,
        'name' => 'Batch B',
        'capacity' => 20,
        'status' => 'active',
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('batches.update', $batch), [
            'course_id' => $course->id,
            'name' => 'Batch B Updated',
            'capacity' => 25,
            'status' => 'inactive',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('batches', [
        'id' => $batch->id,
        'name' => 'Batch B Updated',
        'status' => 'inactive',
    ]);
});

test('user can delete a batch', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $course = Course::create([
        'organization_id' => $org->id,
        'name' => 'Math 101',
        'fee_type' => 'monthly',
        'amount' => 1500,
    ]);
    $batch = Batch::create([
        'organization_id' => $org->id,
        'course_id' => $course->id,
        'name' => 'Batch to Delete',
        'capacity' => 10,
        'status' => 'active',
    ]);

    $response = $this
        ->actingAs($user)
        ->delete(route('batches.destroy', $batch));

    $response->assertRedirect();
    $this->assertSoftDeleted('batches', [
        'id' => $batch->id,
    ]);
});

test('user can add and delete schedule rules for a batch', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $course = Course::create([
        'organization_id' => $org->id,
        'name' => 'Math 101',
        'fee_type' => 'monthly',
        'amount' => 1500,
    ]);
    $batch = Batch::create([
        'organization_id' => $org->id,
        'course_id' => $course->id,
        'name' => 'Scheduled Batch',
        'capacity' => 20,
        'status' => 'active',
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('batches.schedule-rules.store', $batch), [
            'day_of_week' => 'Monday',
            'start_time' => '09:00',
            'end_time' => '10:30',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('schedule_rules', [
        'batch_id' => $batch->id,
        'day_of_week' => 'Monday',
        'start_time' => '09:00',
        'end_time' => '10:30',
    ]);

    $rule = ScheduleRule::where('batch_id', $batch->id)->first();

    $deleteResponse = $this
        ->actingAs($user)
        ->delete(route('batches.schedule-rules.destroy', [$batch, $rule]));

    $deleteResponse->assertRedirect();
    $this->assertDatabaseMissing('schedule_rules', [
        'id' => $rule->id,
    ]);
});
