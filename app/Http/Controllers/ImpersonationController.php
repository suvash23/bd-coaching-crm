<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ImpersonationController extends Controller
{
    public function leave(Request $request)
    {
        if ($request->session()->has('impersonated_by')) {
            $superAdminId = $request->session()->get('impersonated_by');
            Auth::loginUsingId($superAdminId);
            $request->session()->forget('impersonated_by');
            return redirect()->route('superadmin.organizations.index')->with('success', 'Restored superadmin session.');
        }

        return redirect()->route('dashboard');
    }
}
