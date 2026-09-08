<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Seed the four SaaS pricing tiers.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Free Trial',
                'slug' => 'free-trial',
                'max_students' => 50,
                'price_bdt' => 0,
                'trial_days' => 14,
                'is_active' => true,
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'max_students' => 200,
                'price_bdt' => 500,
                'trial_days' => 0,
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'max_students' => 500,
                'price_bdt' => 1200,
                'trial_days' => 0,
                'is_active' => true,
            ],
            [
                'name' => 'Premium',
                'slug' => 'premium',
                'max_students' => null,    // unlimited
                'price_bdt' => 2500,
                'trial_days' => 0,
                'is_active' => true,
            ],
        ];

        foreach ($packages as $package) {
            Package::firstOrCreate(['slug' => $package['slug']], $package);
        }
    }
}
