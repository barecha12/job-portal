<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Job;
use App\Models\Application;
use App\Models\Company;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = Auth::user();

        if ($user->role === 'employer') {
            // Stats for Employer
            $totalJobs = Job::whereHas('company', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->count();

            // Total applications for all jobs posted by this employer
            $totalApplications = Application::whereHas('job.company', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->count();

            $recentApplications = Application::whereHas('job.company', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->with('job', 'user')->latest()->take(10)->get();

            $totalCompanies = Company::where('user_id', $user->id)->count();

            return response()->json([
                'role' => 'employer',
                'stats' => [
                    ['label' => 'Total Jobs Posted', 'value' => $totalJobs],
                    ['label' => 'Total Applications Received', 'value' => $totalApplications],
                    ['label' => 'Total Companies', 'value' => $totalCompanies],
                ],
                'recent_activity' => $recentApplications
            ]);

        } else {
            // Stats for Seeker
            $totalApplied = Application::where('user_id', $user->id)->count();
            $acceptedApplications = Application::where('user_id', $user->id)->where('status', 'accepted')->count();

            $recentApplications = Application::where('user_id', $user->id)
                ->with('job.company')
                ->latest()
                ->take(10)
                ->get();

            $totalCompanies = Company::count();

            return response()->json([
                'role' => 'seeker',
                'stats' => [
                    ['label' => 'Jobs Applied', 'value' => $totalApplied],
                    ['label' => 'Accepted Applications', 'value' => $acceptedApplications],
                    ['label' => 'Total Companies', 'value' => $totalCompanies],
                ],
                'recent_activity' => $recentApplications
            ]);
        }
    }
}
