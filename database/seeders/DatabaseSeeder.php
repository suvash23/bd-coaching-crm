<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PackageSeeder::class,
            UserSeeder::class,
            CourseSeeder::class,
            BatchSeeder::class,
            StudentSeeder::class,
            ScheduleRuleSeeder::class,
            ClassSessionSeeder::class,
            AttendanceSeeder::class,
            StudentDiscountSeeder::class,
            InvoiceSeeder::class,
            PaymentSeeder::class,
            BroadcastSeeder::class,
        ]);
    }
}
