<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'status',
        'domain',
        'short_code',
        'logo_path',
        'phone',
        'email',
        'address',
        'timezone',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * The most recent subscription that is still trial or active.
     */
    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)
            ->whereIn('status', ['trial', 'active'])
            ->latestOfMany();
    }

    /** Total number of non-deleted students for this organization. */
    public function activeStudentCount(): int
    {
        return $this->students()->count();
    }

    /**
     * Whether the organization is allowed to enroll one more student
     * given their current subscription package limit.
     */
    public function canAddStudent(): bool
    {
        $subscription = $this->activeSubscription;

        if (! $subscription) {
            return false; // No active subscription — block enrollment
        }

        $maxStudents = $subscription->package->max_students;

        if (is_null($maxStudents)) {
            return true; // Unlimited plan
        }

        return $this->activeStudentCount() < $maxStudents;
    }
}
