<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\Package;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Subscription>
 */
class SubscriptionFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'package_id' => Package::factory(),
            'status' => 'active',
            'starts_at' => now(),
            'expires_at' => null,
            'trial_ends_at' => null,
        ];
    }

    /** A subscription that is in the trial period. */
    public function onTrial(): static
    {
        return $this->state([
            'status' => 'trial',
            'trial_ends_at' => now()->addDays(14),
        ]);
    }

    /** A subscription that has expired. */
    public function expired(): static
    {
        return $this->state([
            'status' => 'expired',
            'expires_at' => now()->subDay(),
        ]);
    }
}
