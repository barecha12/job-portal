<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function landingPageStats()
    {
        $activeJobsCount = Job::count();
        $companiesCount = Company::count();
        $candidatesCount = User::where('role', 'seeker')->count();

        // Get top categories based on job counts
        // If there are no categories set, this will be empty, which is fine
        $categories = Job::select('category', DB::raw('count(*) as count'))
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->limit(8)
            ->get();

        return response()->json([
            'stats' => [
                'activeJobs' => $activeJobsCount,
                'companies' => $companiesCount,
                'candidates' => $candidatesCount,
            ],
            'categories' => $categories
        ]);
    }
}
