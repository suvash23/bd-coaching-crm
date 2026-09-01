<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Prevent global scopes if any are running on User during creation
        User::withoutGlobalScopes()->delete();
        Organization::withoutGlobalScopes()->delete();

        // 1. Create a core Organization
        $org = Organization::create([
            'name' => 'Acme Coaching Center',
            'phone' => '01700000000',
            'email' => 'contact@acmecoaching.com',
            'address' => 'Dhaka, Bangladesh',
            'timezone' => 'Asia/Dhaka',
        ]);

        // 2. Create the Admin User
        User::withoutGlobalScopes()->create([
            'organization_id' => $org->id,
            'name' => 'Initial Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 3. Create a secondary Teacher User
        User::withoutGlobalScopes()->create([
            'organization_id' => $org->id,
            'name' => 'Demo Teacher',
            'email' => 'teacher@example.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);

        $this->command->info('Organization and Users successfully seeded!');
        $this->command->info('Admin Login: admin@example.com / password');
    }
}
