<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganizationSettingsRequest;
use Illuminate\Support\Facades\Storage;

class OrganizationSettingsController extends Controller
{
    public function update(OrganizationSettingsRequest $request)
    {
        $organization = $request->user()->organization;
        $validated = $request->validated();

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
