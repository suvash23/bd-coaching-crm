<?php

use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('guest is redirected to login when accessing teachers', function () {
    $this->get(route('teachers.index'))->assertRedirect(route('login'));
});

test('admin can view the teachers page', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $admin = User::factory()->create(['organization_id' => $org->id, 'role' => 'admin']);

    $this->actingAs($admin)
        ->get(route('teachers.index'))
        ->assertOk();
});

test('non-admin user is forbidden from managing teachers', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $teacher = User::factory()->create(['organization_id' => $org->id, 'role' => 'teacher']);

    $this->actingAs($teacher)->get(route('teachers.index'))->assertForbidden();

    $this->actingAs($teacher)
        ->post(route('teachers.store'), [
            'name' => 'Sneaky Teacher',
            'email' => 'sneaky@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertForbidden();

    $this->assertDatabaseMissing('users', ['email' => 'sneaky@example.com']);
});

test('admin can add a teacher to their organization', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $admin = User::factory()->create(['organization_id' => $org->id, 'role' => 'admin']);

    $this->actingAs($admin)
        ->post(route('teachers.store'), [
            'name' => 'New Teacher',
            'email' => 'newteacher@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertRedirect();

    $teacher = User::where('email', 'newteacher@example.com')->first();

    $this->assertNotNull($teacher);
    $this->assertSame('teacher', $teacher->role);
    $this->assertSame($org->id, $teacher->organization_id);
    $this->assertNotNull($teacher->email_verified_at);
    $this->assertTrue(Hash::check('password', $teacher->password));
});

test('teacher creation requires valid inputs', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $admin = User::factory()->create(['organization_id' => $org->id, 'role' => 'admin']);

    $this->actingAs($admin)
        ->post(route('teachers.store'), [
            'name' => '',
            'email' => 'not-an-email',
            'password' => 'short',
            'password_confirmation' => 'no-match',
        ])
        ->assertSessionHasErrors(['name', 'email', 'password']);

    $this->assertDatabaseMissing('users', ['email' => 'not-an-email']);
});

test('admin can update a teacher', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $admin = User::factory()->create(['organization_id' => $org->id, 'role' => 'admin']);
    $teacher = User::factory()->create([
        'organization_id' => $org->id,
        'role' => 'teacher',
        'email' => 'teacher@example.com',
        'email_verified_at' => now(),
        'password' => Hash::make('password'),
    ]);

    $this->actingAs($admin)
        ->put(route('teachers.update', $teacher), [
            'name' => 'Updated Teacher',
            'email' => 'updated@example.com',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('users', [
        'id' => $teacher->id,
        'name' => 'Updated Teacher',
        'email' => 'updated@example.com',
    ]);
});

test('admin can update a teachers password', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $admin = User::factory()->create(['organization_id' => $org->id, 'role' => 'admin']);
    $teacher = User::factory()->create([
        'organization_id' => $org->id,
        'role' => 'teacher',
        'email' => 'teacher@example.com',
        'email_verified_at' => now(),
        'password' => Hash::make('password'),
    ]);

    $this->actingAs($admin)
        ->put(route('teachers.update', $teacher), [
            'name' => $teacher->name,
            'email' => $teacher->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertRedirect();

    $teacher->refresh();
    $this->assertTrue(Hash::check('new-password', $teacher->password));
});

test('admin can remove a teacher', function () {
    $org = Organization::create(['name' => 'Test Org']);
    $admin = User::factory()->create(['organization_id' => $org->id, 'role' => 'admin']);
    $teacher = User::factory()->create([
        'organization_id' => $org->id,
        'role' => 'teacher',
        'email' => 'teacher@example.com',
        'email_verified_at' => now(),
        'password' => Hash::make('password'),
    ]);

    $this->actingAs($admin)
        ->delete(route('teachers.destroy', $teacher))
        ->assertRedirect();

    $this->assertSoftDeleted('users', ['id' => $teacher->id]);
});

test('admin cannot modify a teacher from another organization (IDOR)', function () {
    $orgA = Organization::create(['name' => 'Org A']);
    $orgB = Organization::create(['name' => 'Org B']);
    $adminA = User::factory()->create(['organization_id' => $orgA->id, 'role' => 'admin']);
    $teacherB = User::factory()->create([
        'organization_id' => $orgB->id,
        'role' => 'teacher',
        'email' => 'b-teacher@example.com',
        'email_verified_at' => now(),
        'password' => Hash::make('password'),
    ]);

    $this->actingAs($adminA)
        ->put(route('teachers.update', $teacherB), [
            'name' => 'Hacked Name',
            'email' => $teacherB->email,
        ])
        ->assertForbidden();

    $this->assertDatabaseMissing('users', ['id' => $teacherB->id, 'name' => 'Hacked Name']);
});

test('admin cannot remove a teacher from another organization (IDOR)', function () {
    $orgA = Organization::create(['name' => 'Org A']);
    $orgB = Organization::create(['name' => 'Org B']);
    $adminA = User::factory()->create(['organization_id' => $orgA->id, 'role' => 'admin']);
    $teacherB = User::factory()->create([
        'organization_id' => $orgB->id,
        'role' => 'teacher',
        'email' => 'b-teacher@example.com',
        'email_verified_at' => now(),
        'password' => Hash::make('password'),
    ]);

    $this->actingAs($adminA)
        ->delete(route('teachers.destroy', $teacherB))
        ->assertForbidden();

    $this->assertDatabaseHas('users', ['id' => $teacherB->id, 'deleted_at' => null]);
});

test('admin only sees teachers within their own organization', function () {
    $orgA = Organization::create(['name' => 'Org A']);
    $orgB = Organization::create(['name' => 'Org B']);
    $adminA = User::factory()->create(['organization_id' => $orgA->id, 'role' => 'admin']);
    $teacherA = User::factory()->create([
        'organization_id' => $orgA->id,
        'role' => 'teacher',
        'email' => 'teacher-a@example.com',
        'email_verified_at' => now(),
        'password' => Hash::make('password'),
    ]);
    User::factory()->create([
        'organization_id' => $orgB->id,
        'role' => 'teacher',
        'email' => 'teacher-b@example.com',
        'email_verified_at' => now(),
        'password' => Hash::make('password'),
    ]);

    $response = $this->actingAs($adminA)->get(route('teachers.index'));

    $response->assertOk()
        ->assertSee($teacherA->email)
        ->assertDontSee('teacher-b@example.com');
});
