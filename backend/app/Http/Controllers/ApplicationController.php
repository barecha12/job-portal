<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'employer') {
            $applications = Application::whereHas('job.company', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->with(['job.company', 'user'])->latest()->get();

            return response()->json($applications);
        } else {
            $applications = Application::where('user_id', $user->id)
                ->with(['job.company'])
                ->latest()
                ->get();

            return response()->json($applications);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,id',
        ]);

        $user = Auth::user();
        $resume = $request->resume ?? $user->resume_path;

        if (!$resume) {
            return response()->json(['message' => 'Please upload a resume to your profile before applying.'], 422);
        }

        $existing = Application::where('user_id', $user->id)
            ->where('job_id', $request->job_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already applied for this job.'], 422);
        }

        $application = Application::create([
            'job_id' => $request->job_id,
            'user_id' => $user->id,
            'resume' => $resume,
            'status' => 'applied',
        ]);

        return response()->json($application, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $application = Application::with('job', 'user')->find($id);

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        return response()->json($application);
    }

    public function update(Request $request, string $id)
    {
        $application = Application::with('job.company')->find($id);

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        // Only employer owning the job should update status
        $user = Auth::user();
        if ($application->job->company->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized. You do not own the company hosting this job.'], 403);
        }

        $application->update($request->only('status'));

        return response()->json($application);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $application = Application::with('job.company')->find($id);

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        $user = Auth::user();

        // Only the applicant or the employer owning the job can delete/withdraw
        if ($application->user_id !== $user->id && $application->job->company->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $application->delete();

        return response()->json(['message' => 'Application deleted/withdrawn']);
    }
}