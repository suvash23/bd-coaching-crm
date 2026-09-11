<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentDiscountRequest;
use App\Models\Student;
use App\Models\StudentDiscount;

class StudentDiscountController extends Controller
{
    public function store(StudentDiscountRequest $request, Student $student)
    {
        $validated = $request->validated();

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
