<?php

use App\Models\Batch;
use App\Models\ClassSession;
use App\Models\Course;
use App\Models\Invoice;
use App\Models\Organization;
use App\Models\Student;
use App\Models\User;

test('user can view the reports page with financial and attendance data', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $course = Course::create(['organization_id' => $org->id, 'name' => 'Physics', 'fee_type' => 'monthly', 'amount' => 1000]);
    $batch = Batch::create(['organization_id' => $org->id, 'course_id' => $course->id, 'name' => 'Batch A', 'capacity' => 20, 'status' => 'active']);
    $student = Student::create(['organization_id' => $org->id, 'name' => 'Student A', 'status' => 'active']);
    $student->batches()->attach($batch->id, ['join_date' => now(), 'status' => 'active']);

    Invoice::create([
        'organization_id' => $org->id,
        'student_id' => $student->id,
        'course_id' => $course->id,
        'billing_month' => now()->format('Y-m'),
        'amount' => 1000,
        'status' => 'paid',
        'due_date' => now(),
    ]);

    ClassSession::create([
        'organization_id' => $org->id,
        'batch_id' => $batch->id,
        'scheduled_date' => now()->toDateString(),
        'start_time' => '10:00',
        'end_time' => '11:00',
        'status' => 'completed',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('reports.index'));

    $response->assertOk();
});
