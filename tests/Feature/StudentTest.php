<?php

use App\Models\Course;
use App\Models\Organization;
use App\Models\Package;
use App\Models\Student;
use App\Models\StudentDiscount;
use App\Models\Subscription;
use App\Models\User;

test('authenticated user can view students page', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('students.index'));

    $response->assertOk();
});

test('user can create a student when under the plan limit', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $package = Package::factory()->create(['max_students' => 100]);
    Subscription::factory()->create(['organization_id' => $org->id, 'package_id' => $package->id]);
    $user = User::factory()->create(['organization_id' => $org->id]);

    $response = $this
        ->actingAs($user)
        ->post(route('students.store'), [
            'name' => 'John Doe',
            'phone' => '01711111111',
            'email' => 'john@example.com',
            'status' => 'active',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('students', [
        'name' => 'John Doe',
        'phone' => '01711111111',
        'email' => 'john@example.com',
        'organization_id' => $org->id,
    ]);
});

test('student creation is blocked when plan student limit is reached', function () {
    $org = Organization::create(['name' => 'Limit Org']);
    $package = Package::factory()->create(['max_students' => 2]);
    Subscription::factory()->create(['organization_id' => $org->id, 'package_id' => $package->id]);
    $user = User::factory()->create(['organization_id' => $org->id]);

    // Fill up the limit
    Student::factory()->count(2)->create(['organization_id' => $org->id]);

    $response = $this
        ->actingAs($user)
        ->post(route('students.store'), [
            'name' => 'Over Limit Student',
            'status' => 'active',
        ]);

    $response->assertSessionHasErrors('limit');
    $this->assertDatabaseMissing('students', ['name' => 'Over Limit Student']);
});

test('student creation is blocked when organization has no active subscription', function () {
    $org = Organization::create(['name' => 'No Sub Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);

    $response = $this
        ->actingAs($user)
        ->post(route('students.store'), [
            'name' => 'Blocked Student',
            'status' => 'active',
        ]);

    $response->assertSessionHasErrors('limit');
    $this->assertDatabaseMissing('students', ['name' => 'Blocked Student']);
});

test('user can update a student', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $student = Student::create([
        'organization_id' => $org->id,
        'name' => 'Jane Doe',
        'status' => 'active',
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('students.update', $student), [
            'name' => 'Jane Doe Updated',
            'phone' => '01822222222',
            'status' => 'inactive',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('students', [
        'id' => $student->id,
        'name' => 'Jane Doe Updated',
        'status' => 'inactive',
    ]);
});

test('user can delete a student', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $student = Student::create([
        'organization_id' => $org->id,
        'name' => 'Student to Delete',
        'status' => 'active',
    ]);

    $response = $this
        ->actingAs($user)
        ->delete(route('students.destroy', $student));

    $response->assertRedirect();
    $this->assertSoftDeleted('students', [
        'id' => $student->id,
    ]);
});

test('user can add and delete student discounts', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $student = Student::create([
        'organization_id' => $org->id,
        'name' => 'Discounted Student',
        'status' => 'active',
    ]);
    $course = Course::create([
        'organization_id' => $org->id,
        'name' => 'Math',
        'fee_type' => 'monthly',
        'amount' => 1000,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('students.discounts.store', $student), [
            'course_id' => $course->id,
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'start_date' => now()->toDateString(),
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('student_discounts', [
        'student_id' => $student->id,
        'course_id' => $course->id,
        'discount_type' => 'percentage',
        'discount_value' => 20,
    ]);

    $discount = StudentDiscount::where('student_id', $student->id)->first();

    $deleteResponse = $this
        ->actingAs($user)
        ->delete(route('students.discounts.destroy', [$student, $discount]));

    $deleteResponse->assertRedirect();
    $this->assertSoftDeleted('student_discounts', [
        'id' => $discount->id,
    ]);
});
