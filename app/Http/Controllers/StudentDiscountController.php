<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentDiscount;
use Illuminate\Http\Request;

class StudentDiscountController extends Controller
{
    public function store(Request $request, Student $student)
    {
        $validated = $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $student->discounts()->create([
            'organization_id' => $student->organization_id,
            'course_id' => $validated['course_id'],
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Discount added successfully.');
    }

    public function destroy(Student $student, StudentDiscount $discount)
    {
        $discount->delete();

        return redirect()->back()->with('success', 'Discount removed successfully.');
    }
}
