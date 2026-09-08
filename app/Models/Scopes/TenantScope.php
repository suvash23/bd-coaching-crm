<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class TenantScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (! Auth::hasUser()) {
            return;
        }

        $user = Auth::user();

        // Superadmins have a global view — no tenant scope applied.
        if ($user->isSuperAdmin()) {
            return;
        }

        if ($user->organization_id) {
            $builder->where($model->getTable().'.organization_id', $user->organization_id);
        }
    }
}
