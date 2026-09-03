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
}
