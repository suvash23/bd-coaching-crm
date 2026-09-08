<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'max_students',
        'price_bdt',
        'trial_days',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /** @return bool Whether this package is the free trial tier. */
    public function isFreeTrial(): bool
    {
        return $this->trial_days > 0;
    }

    /** @return bool Whether this package has an unlimited student count. */
    public function isUnlimited(): bool
    {
        return is_null($this->max_students);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
