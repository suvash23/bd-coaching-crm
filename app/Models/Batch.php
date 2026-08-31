<?php

namespace App\Models;

use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([TenantScope::class])]
class Batch extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'course_id',
        'name',
        'capacity',
        'status',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
