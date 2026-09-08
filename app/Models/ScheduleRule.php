<?php

namespace App\Models;

use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ScopedBy([TenantScope::class])]
class ScheduleRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'batch_id',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
}
