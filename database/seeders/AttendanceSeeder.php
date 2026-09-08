<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\ClassSession;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Marks every actively-enrolled student of a batch as present/absent/late/excused
     * for each of that batch's completed class sessions, weighted mostly "present".
     */
    public function run(): void
    {
        Attendance::query()->delete();

        $weightedStatuses = array_merge(
            array_fill(0, 8, 'present'),
            array_fill(0, 2, 'absent'),
            array_fill(0, 1, 'late'),
            array_fill(0, 1, 'excused'),
        );

        $sessions = ClassSession::withoutGlobalScopes()
            ->with('batch.students')
            ->where('status', 'completed')
            ->get();

        foreach ($sessions as $session) {
            $activeStudents = $session->batch->students->filter(
                fn ($student) => $student->pivot->status === 'active'
            );

            foreach ($activeStudents as $student) {
                Attendance::create([
                    'class_session_id' => $session->id,
                    'student_id' => $student->id,
                    'status' => $weightedStatuses[array_rand($weightedStatuses)],
                ]);
            }
        }

        $this->command->info('Attendance seeded.');
    }
}
