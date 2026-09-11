<?php

namespace App\Models;

use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Model;

#[ScopedBy([TenantScope::class])]
class Broadcast extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'target_filters' => 'array',
        'sent_at' => 'datetime',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
