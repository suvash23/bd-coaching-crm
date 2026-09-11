<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use App\Models\Invoice;
use App\Models\Payment;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function store(PaymentRequest $request, Invoice $invoice)
    {
        $validated = $request->validated();
        $validated['organization_id'] = $request->user()->organization_id;
        $validated['invoice_id'] = $invoice->id;
        $validated['processed_by'] = $request->user()->id;

        Payment::create($validated);

        // Recalculate invoice status based on partial or full payment
        $totalPaid = $invoice->payments()->sum('amount');
        if ($totalPaid >= $invoice->amount) {
            $invoice->update(['status' => 'paid']);
        } elseif ($totalPaid > 0) {
            $invoice->update(['status' => 'partial']);
        }

        return redirect()->back()->with('success', 'Payment logged successfully.');
    }

    public function show(Payment $payment)
    {
        $payment->load(['invoice.student', 'invoice.course', 'processor', 'organization']);

        return Inertia::render('Financials/Receipt', [
            'payment' => $payment,
        ]);
    }
}
