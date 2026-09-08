<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\Organization;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StudentSeeder extends Seeder
{
    private const NAMES = [
        'Tanvir Ahmed', 'Sadia Islam', 'Rafiul Karim', 'Mehjabin Chowdhury', 'Arif Hossain',
        'Nusrat Jahan', 'Shakil Rahman', 'Taslima Akter', 'Imran Hasan', 'Farhana Yasmin',
        'Rakibul Islam', 'Shirin Sultana', 'Mahmudul Hasan', 'Jannatul Ferdous', 'Sabbir Ahmed',
        'Nazia Haque', 'Ashraful Alam', 'Rumana Akter', 'Zahidul Islam', 'Ismat Ara',
    ];

    /**
     * Students per organization, each enrolled into one or two of their
     * organization's active batches (batch_student pivot).
     */
    public function run(): void
    {
        Student::withoutGlobalScopes()->forceDelete();

        foreach (Organization::withoutGlobalScopes()->get() as $organization) {
            $activeBatches = Batch::withoutGlobalScopes()
                ->where('organization_id', $organization->id)
                ->where('status', 'active')
                ->get();

            foreach (self::NAMES as $i => $name) {
                $status = $i % 9 === 0 ? 'inactive' : 'active';

                $student = Student::withoutGlobalScopes()->create([
                    'organization_id' => $organization->id,
                    'name' => $name,
                    'phone' => '01' . random_int(3, 9) . random_int(10000000, 99999999),
                    'email' => Str::slug($name) . '@example.com',
                    'guardian_name' => 'Guardian of ' . $name,
                    'guardian_phone' => '01' . random_int(3, 9) . random_int(10000000, 99999999),
                    'guardian_email' => Str::slug($name) . '.guardian@example.com',
                    'student_id_number' => strtoupper($organization->short_code ?? 'ORG') . '-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                    'status' => $status,
                ]);

                if ($status === 'active' && $activeBatches->isNotEmpty()) {
                    // Most students sit in one batch; every 5th also joins a second (if available).
                    $enrollIn = $i % 5 === 0 && $activeBatches->count() > 1
                        ? $activeBatches->random(2)
                        : collect([$activeBatches->random()]);

                    foreach ($enrollIn as $batch) {
                        $student->batches()->attach($batch->id, [
                            'join_date' => now()->subMonths(random_int(1, 4)),
                            'status' => 'active',
                        ]);
                    }
                }
            }
        }

        $this->command->info('Students and batch enrollments seeded.');
    }
}
