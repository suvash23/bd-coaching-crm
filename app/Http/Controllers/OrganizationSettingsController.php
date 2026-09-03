<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OrganizationSettingsController extends Controller
{
    public function update(Request $request)
    {
        $organization = $request->user()->organization;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_code' => 'nullable|string|max:10',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $organization->name = $validated['name'];
        $organization->short_code = $validated['short_code'];

        if ($request->hasFile('logo')) {
            if ($organization->logo_path) {
                Storage::disk('public')->delete($organization->logo_path);
            }
            $organization->logo_path = $request->file('logo')->store('organizations/logos', 'public');
        }

        $organization->save();

        return redirect()->back()->with('success', 'Organization settings updated.');
    }
}
