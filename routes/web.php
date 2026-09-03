<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/organization', [\App\Http\Controllers\OrganizationSettingsController::class, 'update'])->name('organization.update');

    Route::resource('courses', \App\Http\Controllers\CourseController::class)->except(['create', 'show', 'edit']);
    Route::resource('batches', \App\Http\Controllers\BatchController::class)->except(['create', 'show', 'edit']);
    Route::post('/batches/{batch}/schedule-rules', [\App\Http\Controllers\ScheduleRuleController::class, 'store'])->name('batches.schedule-rules.store');
    Route::delete('/batches/{batch}/schedule-rules/{scheduleRule}', [\App\Http\Controllers\ScheduleRuleController::class, 'destroy'])->name('batches.schedule-rules.destroy');
    Route::resource('students', \App\Http\Controllers\StudentController::class)->except(['create', 'show', 'edit']);

    // Class Sessions and Attendance
    Route::post('/classes/generate', [\App\Http\Controllers\ClassSessionController::class, 'generate'])->name('classes.generate');
    Route::get('/classes', [\App\Http\Controllers\ClassSessionController::class, 'index'])->name('classes.index');
    Route::get('/classes/{classSession}', [\App\Http\Controllers\ClassSessionController::class, 'show'])->name('classes.show');
    Route::put('/classes/{classSession}/attendance', [\App\Http\Controllers\AttendanceController::class, 'update'])->name('classes.attendance.update');

    // Financials
    Route::get('/invoices', [\App\Http\Controllers\InvoiceController::class, 'index'])->name('invoices.index');
    Route::post('/invoices/{invoice}/payments', [\App\Http\Controllers\PaymentController::class, 'store'])->name('invoices.payments.store');
    Route::get('/payments/{payment}/receipt', [\App\Http\Controllers\PaymentController::class, 'show'])->name('payments.receipt');
    // Reports
    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');

    // Broadcasts
    Route::get('/broadcasts', [\App\Http\Controllers\BroadcastController::class, 'index'])->name('broadcasts.index');
    Route::post('/broadcasts', [\App\Http\Controllers\BroadcastController::class, 'store'])->name('broadcasts.store');
});

require __DIR__ . '/auth.php';
