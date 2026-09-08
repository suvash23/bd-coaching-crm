<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    private const METHODS = ['cash', 'bkash', 'nagad', 'bank'];

    /**
     * One payment per "paid" invoice (covering the full net amount) and one
     * partial payment per "partial" invoice. "unpaid" invoices get none.
     */
    public function run(): void
    {
        Payment::withoutGlobalScopes()->forceDelete();

        $processorsByOrg = User::withoutGlobalScopes()->get()->groupBy('organization_id');

        foreach (Invoice::withoutGlobalScopes()->whereIn('status', ['paid', 'partial'])->get() as $invoice) {
            $net = (float) $invoice->amount - (float) $invoice->discount_amount;
            $amount = $invoice->status === 'paid' ? $net : round($net * fake()->randomFloat(2, 0.3, 0.7), 2);

            $processors = $processorsByOrg->get($invoice->organization_id);

            // A payment can't be recorded after today, even if the invoice isn't due until later this month.
            $dueDate = Carbon::parse($invoice->due_date);
            $latestPossible = $dueDate->lt(Carbon::today()) ? $dueDate : Carbon::today();
            $paymentDate = $latestPossible->copy()->subDays(random_int(0, 4));

            Payment::withoutGlobalScopes()->create([
                'organization_id' => $invoice->organization_id,
                'invoice_id' => $invoice->id,
                'processed_by' => $processors && $processors->isNotEmpty() ? $processors->random()->id : null,
                'amount' => $amount,
                'method' => self::METHODS[array_rand(self::METHODS)],
                'transaction_id' => strtoupper(fake()->bothify('TRX###??')),
                'payment_date' => $paymentDate,
            ]);
        }

        $this->command->info('Payments seeded.');
    }
}
