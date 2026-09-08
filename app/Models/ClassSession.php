<?php

namespace App\Models;

use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ScopedBy([TenantScope::class])]
class ClassSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'batch_id',
        'teacher_id',
        'scheduled_date',
        'start_time',
        'end_time',
        'status',
        'topic',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
