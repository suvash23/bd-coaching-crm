<?php

namespace Database\Seeders;

use App\Models\Broadcast;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class BroadcastSeeder extends Seeder
{
    /**
     * A few historical broadcasts per organization: fee reminder SMS blasts,
     * a system announcement, and one still-pending send.
     */
    public function run(): void
    {
        Broadcast::withoutGlobalScopes()->delete();

        foreach (Organization::withoutGlobalScopes()->get() as $organization) {
            Broadcast::withoutGlobalScopes()->create([
                'organization_id' => $organization->id,
                'type' => 'sms',
                'title' => null,
                'message' => 'Reminder: Your monthly fee is due by the end of this month. Please pay at your earliest convenience.',
                'status' => 'sent',
                'recipients_count' => 12,
                'target_filters' => ['status' => 'unpaid'],
                'sent_at' => now()->subDays(5),
            ]);

            Broadcast::withoutGlobalScopes()->create([
                'organization_id' => $organization->id,
                'type' => 'system',
                'title' => 'Holiday Notice',
                'message' => 'All classes will remain closed this Friday for the national holiday. Regular schedule resumes next week.',
                'status' => 'sent',
                'recipients_count' => 20,
                'target_filters' => null,
                'sent_at' => now()->subDays(10),
            ]);

            Broadcast::withoutGlobalScopes()->create([
                'organization_id' => $organization->id,
                'type' => 'sms',
                'title' => null,
                'message' => 'New batch admissions are now open. Contact the office to enroll before seats fill up.',
                'status' => 'pending',
                'recipients_count' => 0,
                'target_filters' => ['status' => 'active'],
                'sent_at' => null,
            ]);
        }

        $this->command->info('Broadcasts seeded.');
    }
}
