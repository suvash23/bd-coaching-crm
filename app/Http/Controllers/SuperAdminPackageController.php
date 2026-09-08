<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Inertia\Inertia;

class SuperAdminPackageController extends Controller
{
    public function index()
    {
        $packages = Package::orderBy('price_bdt', 'asc')->get()->map(function ($pkg) {
            return [
                'id' => $pkg->id,
                'name' => $pkg->name,
                'slug' => $pkg->slug,
                'price' => $pkg->price_bdt,
                'max_students' => $pkg->max_students,
                'trial_days' => $pkg->trial_days,
            ];
        });

        return Inertia::render('Superadmin/Packages/Index', [
            'packages' => $packages,
        ]);
    }
}
