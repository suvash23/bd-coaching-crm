<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'trial_ends_at' => 'datetime',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    /** @return bool Whether the subscription is currently in the trial period. */
    public function isOnTrial(): bool
    {
        return $this->status === 'trial' &&
            $this->trial_ends_at !== null &&
            $this->trial_ends_at->isFuture();
    }

    /** @return bool Whether the subscription is currently active (not expired, not suspended). */
    public function isActive(): bool
    {
        return in_array($this->status, ['trial', 'active']);
    }
}
