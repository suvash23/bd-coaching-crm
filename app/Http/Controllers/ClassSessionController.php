<?php

namespace App\Http\Controllers;

use App\Models\ClassSession;
use App\Services\ClassScheduleService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class ClassSessionController extends Controller
{
    public function __construct(private ClassScheduleService $schedule) {}

    public function generate()
    {
        Artisan::call('classes:generate');

        return redirect()->back()->with('success', 'Today\'s missing classes have been generated successfully.');
    }

    public function index(Request $request)
    {
        $view = $request->query('view', 'day'); // 'day' or 'week'
        $anchorDate = Carbon::parse($request->query('date', Carbon::today()->toDateString()));

        if ($view === 'week') {
            $week = $this->schedule->forWeek($anchorDate);

            return Inertia::render('Classes/Index', [
                'classes' => $week['classes'],
                'currentDate' => $anchorDate->toDateString(),
                'view' => 'week',
                'weekStart' => $week['weekStart'],
                'weekEnd' => $week['weekEnd'],
            ]);
        }

        return Inertia::render('Classes/Index', [
            'classes' => $this->schedule->forDay($anchorDate),
            'currentDate' => $anchorDate->toDateString(),
            'view' => 'day',
            'weekStart' => null,
            'weekEnd' => null,
        ]);
    }

    public function show($id)
    {
        $classSession = ClassSession::findOrFail($id);

        return Inertia::render('Classes/Attendance', [
            'classSession' => $classSession->load('batch.course'),
            'students' => $this->schedule->attendanceRoster($classSession),
        ]);
    }
}
