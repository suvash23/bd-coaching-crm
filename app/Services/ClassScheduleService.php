<?php

namespace App\Services;

use App\Models\ClassSession;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ClassScheduleService
{
    /**
     * All class sessions scheduled on a single day, earliest first.
     */
    public function forDay(Carbon $date): Collection
    {
        return ClassSession::with('batch.course')
            ->whereDate('scheduled_date', $date->toDateString())
            ->oldest('start_time')
            ->get();
    }

    /**
     * All class sessions in the Monday-Sunday week containing the given date,
     * grouped by date ('YYYY-MM-DD').
     *
     * @return array{classes: Collection, weekStart: string, weekEnd: string}
     */
    public function forWeek(Carbon $date): array
    {
        $start = $date->copy()->startOfWeek(Carbon::MONDAY);
        $end = $date->copy()->endOfWeek(Carbon::SUNDAY);

        $classes = ClassSession::with('batch.course')
            ->whereBetween('scheduled_date', [$start->toDateString(), $end->toDateString()])
            ->oldest('scheduled_date')
            ->oldest('start_time')
            ->get()
            ->groupBy('scheduled_date');

        return ['classes' => $classes, 'weekStart' => $start->toDateString(), 'weekEnd' => $end->toDateString()];
    }

    /**
     * The batch's enrolled students mapped to their attendance status for
     * this specific session (defaulting to "present" if not yet recorded).
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function attendanceRoster(ClassSession $classSession): Collection
    {
        $classSession->loadMissing(['batch.students', 'attendances.student']);

        return $classSession->batch->students->map(function ($student) use ($classSession) {
            $attendance = $classSession->attendances->firstWhere('student_id', $student->id);

            return [
                'id' => $student->id,
                'name' => $student->name,
                'student_id_number' => $student->student_id_number,
                'status' => $attendance ? $attendance->status : 'present',
                'recorded' => (bool) $attendance,
            ];
        });
    }
}
