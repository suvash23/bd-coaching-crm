<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\ClassSession;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Student;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $totalStudents = Student::count();
        $activeBatches = Batch::where('status', 'active')->count();
        $todaysClasses = ClassSession::where('scheduled_date', $today->toDateString())->count();

        $paidCount = Invoice::where('status', 'paid')->count();
        $partialCount = Invoice::where('status', 'partial')->count();
        $unpaidCount = Invoice::where('status', 'unpaid')->count();

        $monthlyCollection = (float) Payment::whereBetween('payment_date', [$today->copy()->startOfMonth(), $today])->sum('amount');

        $totalDues = (float) Invoice::whereIn('status', ['unpaid', 'partial'])
            ->with('payments')
            ->get()
            ->sum(fn (Invoice $invoice) => max($invoice->amount - $invoice->discount_amount - $invoice->payments->sum('amount'), 0));

        // Invoices "due" in a given month covers both recurring monthly bills (billing_month
        // matches) and one-off fixed-fee invoices that happen to fall due that month, so
        // billed-vs-collected comparisons aren't skewed by fixed invoices paid in a month
        // they weren't billed for.
        $invoicesDueIn = fn (Carbon $month) => Invoice::where(function ($query) use ($month) {
            $query->where('billing_month', $month->format('Y-m'))
                ->orWhere(function ($fixedFee) use ($month) {
                    $fixedFee->whereNull('billing_month')
                        ->whereYear('due_date', $month->year)
                        ->whereMonth('due_date', $month->month);
                });
        })->with('payments')->get();

        $invoicesDueThisMonth = $invoicesDueIn($today);
        $invoicedThisMonth = (float) $invoicesDueThisMonth->sum(fn (Invoice $invoice) => $invoice->amount - $invoice->discount_amount);
        $collectedForThisMonth = (float) $invoicesDueThisMonth->sum(fn (Invoice $invoice) => $invoice->payments->sum('amount'));
        $collectionRate = $invoicedThisMonth > 0 ? min(100, (int) round($collectedForThisMonth / $invoicedThisMonth * 100)) : 0;

        $collectionTrend = collect(range(3, 0))->map(function (int $monthsAgo) use ($today, $invoicesDueIn) {
            $month = $today->copy()->subMonths($monthsAgo);
            $monthEnd = $month->copy()->endOfMonth();

            return [
                'label' => $month->format('M'),
                'billed' => (float) $invoicesDueIn($month)->sum(fn (Invoice $invoice) => $invoice->amount - $invoice->discount_amount),
                'collected' => (float) Payment::whereYear('payment_date', $month->year)->whereMonth('payment_date', $month->month)->sum('amount'),
                'students' => Student::where('created_at', '<=', $monthEnd)->count(),
                'batches' => Batch::where('status', 'active')->where('created_at', '<=', $monthEnd)->count(),
            ];
        })->values();

        $recentStudents = Student::with('batches')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (Student $student) => [
                'id' => $student->id,
                'student_id_number' => $student->student_id_number,
                'name' => $student->name,
                'batch' => optional($student->batches->first())->name,
                'guardian_phone' => $student->guardian_phone,
                'phone' => $student->phone,
                'status' => $student->status,
            ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_students' => $totalStudents,
                'active_batches' => $activeBatches,
                'todays_classes' => $todaysClasses,
                'monthly_collection' => $monthlyCollection,
                'total_dues' => $totalDues,
                'collection_rate' => $collectionRate,
            ],
            'feeBreakdown' => [
                'paid' => $paidCount,
                'partial' => $partialCount,
                'unpaid' => $unpaidCount,
            ],
            'collectionTrend' => $collectionTrend,
            'recentStudents' => $recentStudents,
        ]);
    }
}
