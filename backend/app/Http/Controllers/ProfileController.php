<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'title' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'portfolio_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'skills' => 'nullable|string',
            'department' => 'nullable|string|max:255',
            'education' => 'nullable|string',
            'experience' => 'nullable|string',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($request->hasFile('resume')) {
            $path = $request->file('resume')->store('resumes', 'public');
            $data['resume_path'] = $path;
        }

        $user->update($data);

        return response()->json([
            'user' => $user,
            'message' => 'Profile updated successfully'
        ]);
    }
}
