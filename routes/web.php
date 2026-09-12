<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\BroadcastController;
use App\Http\Controllers\ClassSessionController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\OrganizationSettingsController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ScheduleRuleController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentDiscountController;
use App\Http\Controllers\SuperAdminDashboardController;
use App\Http\Controllers\SuperAdminOrganizationController;
use App\Http\Controllers\SuperAdminPackageController;
use App\Http\Controllers\TeacherController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\SuperAdminMiddleware;
use App\Models\Package;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $packages = Package::orderBy('price_bdt', 'asc')->get()->map(function ($pkg) {
        return [
            'id' => $pkg->id,
            'name' => $pkg->name,
            'slug' => $pkg->slug,
            'price' => $pkg->price_bdt,
            'max_students' => $pkg->max_students,
            'trial_days' => $pkg->trial_days,
        ];
    });

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'packages' => $packages,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/organization', [OrganizationSettingsController::class, 'update'])->name('organization.update');

    // Coaching Plan
    Route::get('/plan', [DashboardController::class, 'plan'])
        ->middleware('auth')
        ->name('plan');

    Route::resource('courses', CourseController::class)->except(['create', 'show', 'edit']);
    Route::resource('batches', BatchController::class)->except(['create', 'show', 'edit']);
    Route::post('/batches/{batch}/schedule-rules', [ScheduleRuleController::class, 'store'])->name('batches.schedule-rules.store');
    Route::delete('/batches/{batch}/schedule-rules/{scheduleRule}', [ScheduleRuleController::class, 'destroy'])->name('batches.schedule-rules.destroy');
    Route::resource('students', StudentController::class)->except(['create', 'show', 'edit']);
    Route::post('/students/{student}/discounts', [StudentDiscountController::class, 'store'])->name('students.discounts.store');
    Route::delete('/students/{student}/discounts/{discount}', [StudentDiscountController::class, 'destroy'])->name('students.discounts.destroy');

    // Staff (Teachers) — organization admins only
    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::resource('teachers', TeacherController::class)->except(['create', 'show', 'edit']);
    });

    // Class Sessions and Attendance
    Route::post('/classes/generate', [ClassSessionController::class, 'generate'])->name('classes.generate');
    Route::get('/classes', [ClassSessionController::class, 'index'])->name('classes.index');
    Route::get('/classes/{classSession}', [ClassSessionController::class, 'show'])->name('classes.show');
    Route::put('/classes/{classSession}/attendance', [AttendanceController::class, 'update'])->name('classes.attendance.update');

    // Financials
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::post('/invoices/{invoice}/payments', [PaymentController::class, 'store'])->name('invoices.payments.store');
    Route::get('/payments/{payment}/receipt', [PaymentController::class, 'show'])->name('payments.receipt');
    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

    // Broadcasts
    Route::get('/broadcasts', [BroadcastController::class, 'index'])->name('broadcasts.index');
    Route::post('/broadcasts', [BroadcastController::class, 'store'])->name('broadcasts.store');
    // Impersonation leave route (must be outside superadmin middleware but authenticated)
    Route::post('/impersonate/leave', [\App\Http\Controllers\ImpersonationController::class, 'leave'])->name('impersonate.leave');
});

// Superadmin Routes
Route::middleware(['auth', SuperAdminMiddleware::class])->prefix('superadmin')->name('superadmin.')->group(function () {
    Route::get('/dashboard', [SuperAdminDashboardController::class, 'index'])->name('dashboard');

    // Coaching List (Organizations)
    Route::get('/organizations', [SuperAdminOrganizationController::class, 'index'])->name('organizations.index');
    Route::post('/organizations', [SuperAdminOrganizationController::class, 'store'])->name('organizations.store');
    Route::put('/organizations/{organization}', [SuperAdminOrganizationController::class, 'update'])->name('organizations.update');
    Route::delete('/organizations/{organization}', [SuperAdminOrganizationController::class, 'destroy'])->name('organizations.destroy');
    Route::post('/organizations/{organization}/status', [SuperAdminOrganizationController::class, 'updateStatus'])->name('organizations.update-status');
    Route::post('/organizations/{organization}/extend-trial', [SuperAdminOrganizationController::class, 'extendTrial'])->name('organizations.extend-trial');
    Route::post('/organizations/{organization}/change-package', [SuperAdminOrganizationController::class, 'changePackage'])->name('organizations.change-package');
    Route::post('/organizations/{organization}/impersonate', [SuperAdminOrganizationController::class, 'impersonate'])->name('organizations.impersonate');

    // Packages
    Route::get('/packages', [SuperAdminPackageController::class, 'index'])->name('packages.index');
});

require __DIR__.'/auth.php';
