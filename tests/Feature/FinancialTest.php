<?php

use App\Models\Course;
use App\Models\Invoice;
use App\Models\Organization;
use App\Models\Payment;
use App\Models\Student;
use App\Models\User;

test('authenticated user can view invoices index', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('invoices.index'));

    $response->assertOk();
});

test('user can log a payment for an invoice', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $student = Student::create(['organization_id' => $org->id, 'name' => 'Paying Student', 'status' => 'active']);
    $course = Course::create(['organization_id' => $org->id, 'name' => 'Math', 'fee_type' => 'monthly', 'amount' => 2000]);
    $invoice = Invoice::create([
        'organization_id' => $org->id,
        'student_id' => $student->id,
        'course_id' => $course->id,
        'invoice_number' => 'INV-001',
        'billing_month' => '2026-09',
        'amount' => 2000,
        'due_date' => now()->addDays(5)->toDateString(),
        'status' => 'unpaid',
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('invoices.payments.store', $invoice), [
            'amount' => 2000,
            'method' => 'bkash',
            'transaction_id' => 'TRX123456',
            'payment_date' => now()->toDateString(),
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('payments', [
        'invoice_id' => $invoice->id,
        'amount' => 2000,
        'method' => 'bkash',
        'transaction_id' => 'TRX123456',
    ]);
    $this->assertDatabaseHas('invoices', [
        'id' => $invoice->id,
        'status' => 'paid',
    ]);
});

test('user can view payment receipt', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $user = User::factory()->create(['organization_id' => $org->id]);
    $student = Student::create(['organization_id' => $org->id, 'name' => 'Paying Student', 'status' => 'active']);
    $course = Course::create(['organization_id' => $org->id, 'name' => 'Math', 'fee_type' => 'monthly', 'amount' => 2000]);
    $invoice = Invoice::create([
        'organization_id' => $org->id,
        'student_id' => $student->id,
        'course_id' => $course->id,
        'invoice_number' => 'INV-002',
        'billing_month' => '2026-09',
        'amount' => 2000,
        'due_date' => now()->addDays(5)->toDateString(),
        'status' => 'paid',
    ]);
    $payment = Payment::create([
        'organization_id' => $org->id,
        'invoice_id' => $invoice->id,
        'processed_by' => $user->id,
        'amount' => 2000,
        'method' => 'cash',
        'payment_date' => now()->toDateString(),
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('payments.receipt', $payment));

    $response->assertOk();
});
