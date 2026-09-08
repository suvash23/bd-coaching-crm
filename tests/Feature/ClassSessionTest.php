<?php

use App\Models\Batch;
use App\Models\ClassSession;
use App\Models\Course;
use App\Models\Organization;
use App\Models\Student;
use App\Models\User;

test('user can view class sessions list', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('classes.index'));

    $response->assertOk();
});

test('user can trigger class session generation', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('classes.generate'));

    $response->assertRedirect();
});

test('user can view attendance management page for a class session', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $course = Course::create(['organization_id' => $org->id, 'name' => 'Physics', 'fee_type' => 'fixed', 'amount' => 1000]);
    $batch = Batch::create(['organization_id' => $org->id, 'course_id' => $course->id, 'name' => 'Batch A', 'capacity' => 20, 'status' => 'active']);
    $classSession = ClassSession::create([
        'organization_id' => $org->id,
        'batch_id' => $batch->id,
        'scheduled_date' => now()->toDateString(),
        'start_time' => '10:00',
        'end_time' => '11:00',
        'status' => 'scheduled',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('classes.show', $classSession));

    $response->assertOk();
});

test('user can record attendance for a class session', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $course = Course::create(['organization_id' => $org->id, 'name' => 'Physics', 'fee_type' => 'fixed', 'amount' => 1000]);
    $batch = Batch::create(['organization_id' => $org->id, 'course_id' => $course->id, 'name' => 'Batch A', 'capacity' => 20, 'status' => 'active']);
    $student = Student::create(['organization_id' => $org->id, 'name' => 'Student A', 'status' => 'active']);
    $classSession = ClassSession::create([
        'organization_id' => $org->id,
        'batch_id' => $batch->id,
        'scheduled_date' => now()->toDateString(),
        'start_time' => '10:00',
        'end_time' => '11:00',
        'status' => 'scheduled',
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('classes.attendance.update', $classSession), [
            'attendances' => [
                [
                    'student_id' => $student->id,
                    'status' => 'present',
                ],
            ],
        ]);

    $response->assertRedirect(route('classes.index'));
    $this->assertDatabaseHas('attendances', [
        'class_session_id' => $classSession->id,
        'student_id' => $student->id,
        'status' => 'present',
    ]);
    $this->assertDatabaseHas('class_sessions', [
        'id' => $classSession->id,
        'status' => 'completed',
    ]);
});
