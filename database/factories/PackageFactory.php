<?php

namespace Database\Factories;

use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Package>
 */
class PackageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Pro',
            'slug' => 'pro',
            'max_students' => 500,
            'price_bdt' => 1200,
            'trial_days' => 0,
            'is_active' => true,
        ];
    }

    /** A free trial package limited to 50 students. */
    public function freeTrial(): static
    {
        return $this->state([
            'name' => 'Free Trial',
            'slug' => 'free-trial',
            'max_students' => 50,
            'price_bdt' => 0,
            'trial_days' => 14,
        ]);
    }

    /** A basic package limited to 200 students. */
    public function basic(): static
    {
        return $this->state([
            'name' => 'Basic',
            'slug' => 'basic',
            'max_students' => 200,
            'price_bdt' => 500,
            'trial_days' => 0,
        ]);
    }

    /** A premium package with unlimited students. */
    public function unlimited(): static
    {
        return $this->state([
            'name' => 'Premium',
            'slug' => 'premium',
            'max_students' => null,
            'price_bdt' => 2500,
            'trial_days' => 0,
        ]);
    }
}
