<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed sample organizations and users.
     *
     * Two organizations are created so multi-tenant isolation can be tested:
     * a user in Acme should never see data belonging to Sunrise, and vice versa.
     */
    public function run(): void
    {
        User::withoutGlobalScopes()->forceDelete();
        Organization::withoutGlobalScopes()->forceDelete();

        $acme = Organization::create([
            'name' => 'Acme Coaching Center',
            'short_code' => 'ACME',
            'phone' => '01700000000',
            'email' => 'contact@acmecoaching.com',
            'address' => 'Dhanmondi, Dhaka, Bangladesh',
            'timezone' => 'Asia/Dhaka',
        ]);

        $sunrise = Organization::create([
            'name' => 'Sunrise Tutorial Home',
            'short_code' => 'SUNR',
            'phone' => '01800000000',
            'email' => 'contact@sunrisetutorial.com',
            'address' => 'Panchlaish, Chattogram, Bangladesh',
            'timezone' => 'Asia/Dhaka',
        ]);

        if (class_exists(Package::class)) {
            $basic = Package::where('slug', 'basic')->first();
            $unlimited = Package::where('slug', 'unlimited')->first();

            if ($basic) {
                $acme->subscriptions()->create(['package_id' => $basic->id, 'status' => 'active', 'starts_at' => now(), 'expires_at' => now()->addYear()]);
            }
            if ($unlimited) {
                $sunrise->subscriptions()->create(['package_id' => $unlimited->id, 'status' => 'active', 'starts_at' => now()]);
            }
        }

        $users = [
            ['organization_id' => null, 'name' => 'Super Admin', 'email' => 'superadmin@bdcoachingcrm.com', 'role' => 'superadmin'],
            ['organization_id' => $acme->id, 'name' => 'Initial Admin', 'email' => 'admin@bdcoachingcrm.com', 'role' => 'admin'],
            ['organization_id' => $acme->id, 'name' => 'Demo Teacher', 'email' => 'teacher@bdcoachingcrm.com', 'role' => 'teacher'],
            ['organization_id' => $acme->id, 'name' => 'Farzana Akter', 'email' => 'farzana.akter@acmecoaching.com', 'role' => 'teacher'],
            ['organization_id' => $acme->id, 'name' => 'Rashedul Islam', 'email' => 'rashedul.islam@acmecoaching.com', 'role' => 'teacher'],
            ['organization_id' => $sunrise->id, 'name' => 'Nusrat Jahan', 'email' => 'admin@sunrisetutorial.com', 'role' => 'admin'],
            ['organization_id' => $sunrise->id, 'name' => 'Kamrul Hasan', 'email' => 'kamrul.hasan@sunrisetutorial.com', 'role' => 'teacher'],
        ];

        foreach ($users as $user) {
            User::withoutGlobalScopes()->create([
                'organization_id' => $user['organization_id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('Pa$$w0rd'),
                'role' => $user['role'],
                'email_verified_at' => now(),
            ]);
        }

        $this->command->info('Sample organizations and users seeded (password for all: "Pa$$w0rd").');
        $this->command->table(
            ['Organization', 'Name', 'Email', 'Role'],
            collect($users)->map(fn (array $user) => [
                $user['organization_id'] ? ($user['organization_id'] === $acme->id ? $acme->name : $sunrise->name) : '--- Global ---',
                $user['name'],
                $user['email'],
                $user['role'],
            ])->all()
        );
    }
}
