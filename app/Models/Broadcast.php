<?php

namespace App\Models;

use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([TenantScope::class])]
class Broadcast extends Model
{
    protected $fillable = [
        'organization_id',
        'type',
        'title',
        'message',
        'status',
        'recipients_count',
        'target_filters',
        'sent_at'
    ];

    protected $casts = [
        'target_filters' => 'array',
        'sent_at' => 'datetime'
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
