<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\ClassSession;
use App\Models\Invoice;
use App\Models\Student;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->toDateString();

        $stats = [
            'total_students' => Student::count(),
            'active_batches' => Batch::where('status', 'active')->count(),
            'todays_classes' => ClassSession::where('scheduled_date', $today)->count(),
            'unpaid_invoices' => Invoice::where('status', 'unpaid')->count(),
        ];

        return Inertia::render('Dashboard', ['stats' => $stats]);
    }
}
