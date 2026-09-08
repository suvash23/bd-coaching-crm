<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with(['student', 'course', 'payments.processor'])
            ->orderBy('status', 'asc')
            ->latest('due_date')
            ->get();

        return Inertia::render('Financials/Index', [
            'invoices' => $invoices,
        ]);
    }
}
