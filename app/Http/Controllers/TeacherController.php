<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $organization = $request->user()->organization;

        if (! $organization) {
            abort(403, 'No organization assigned to your account.');
        }

        $teachers = User::where('organization_id', $organization->id)
            ->where('role', 'teacher')
            ->latest()
            ->get()
            ->map(fn (User $user) => $this->serializeTeacher($user));

        return Inertia::render('Teachers/Index', [
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $organization = $request->user()->organization;

        if (! $organization) {
            abort(403, 'No organization assigned to your account.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $teacher = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'organization_id' => $organization->id,
            'role' => 'teacher',
        ]);

        // Admins vouch for staff accounts, so mark them as verified immediately.
        $teacher->email_verified_at = now();
        $teacher->save();

        return redirect()->back()->with('success', 'Teacher added successfully.');
    }

    public function update(Request $request, User $teacher)
    {
        $organization = $request->user()->organization;

        $this->ensureOrgTeacher($teacher, $organization);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($teacher->id)],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        $teacher->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (! empty($validated['password'])) {
            $teacher->password = Hash::make($validated['password']);
        }

        $teacher->save();

        return redirect()->back()->with('success', 'Teacher updated successfully.');
    }

    public function destroy(Request $request, User $teacher)
    {
        $organization = $request->user()->organization;

        $this->ensureOrgTeacher($teacher, $organization);

        if ($teacher->is($request->user())) {
            abort(422, 'You cannot remove your own account.');
        }

        $teacher->delete();

        return redirect()->back()->with('success', 'Teacher removed successfully.');
    }

    /**
     * Ensure the resolved user is a teacher belonging to the acting user's organization.
     */
    protected function ensureOrgTeacher(User $teacher, ?Organization $organization): void
    {
        if (! $organization || $teacher->organization_id !== (int) $organization->id || ! $teacher->isTeacher()) {
            abort(403, 'Unauthorized.');
        }
    }

    protected function serializeTeacher(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ];
    }
}
