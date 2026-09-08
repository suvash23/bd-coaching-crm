<?php

namespace App\Models;

use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ScopedBy([TenantScope::class])]
class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function batches()
    {
        return $this->belongsToMany(Batch::class)
            ->withPivot('join_date', 'status')
            ->withTimestamps();
    }

    public function discounts()
    {
        return $this->hasMany(StudentDiscount::class);
    }
}
