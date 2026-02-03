<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use App\Models\Setting;
use App\Models\Company;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AdminController extends Controller
{
    private function logActivity($action, $model = null, $id = null, $details = null)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'target_model' => $model,
            'target_id' => $id,
            'details' => $details,
            'ip_address' => request()->ip()
        ]);
    }

    public function getStats()
    {
        $stats = [
            'total_users' => User::count(),
            'total_jobs' => Job::count(),
            'total_applications' => Application::count(),
            'total_companies' => Company::count(),
            'pending_jobs' => Job::where('status', 'pending')->count(),
            'pending_applications' => Application::where('status', 'pending')->count(),
            'new_users_today' => User::whereDate('created_at', Carbon::today())->count(),
            'seekers' => User::where('role', 'seeker')->count(),
            'employers' => User::where('role', 'employer')->count(),
            'recent_users' => User::latest()->take(8)->get(),
            'recent_jobs' => Job::with('company')->latest()->take(5)->get(),
            'maintenance_mode' => Setting::where('key', 'maintenance_mode')->first()->value ?? 'off',
        ];

        return response()->json($stats);
    }

    public function getAnalytics()
    {
        // Monthly Growth (Last 6 Months)
        $months = collect(range(0, 5))->map(function ($i) {
            return Carbon::now()->subMonths($i)->format('M');
        })->reverse()->values();

        $userGrowth = collect(range(0, 5))->map(function ($i) {
            $date = Carbon::now()->subMonths($i);
            return User::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        })->reverse()->values();

        $jobGrowth = collect(range(0, 5))->map(function ($i) {
            $date = Carbon::now()->subMonths($i);
            return Job::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        })->reverse()->values();

        $companyGrowth = collect(range(0, 5))->map(function ($i) {
            $date = Carbon::now()->subMonths($i);
            return Company::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        })->reverse()->values();

        // Role Distribution
        $roleDistribution = [
            ['name' => 'Seekers', 'value' => User::where('role', 'seeker')->count()],
            ['name' => 'Employers', 'value' => User::where('role', 'employer')->count()],
            ['name' => 'Admins', 'value' => User::where('role', 'admin')->count()],
        ];

        // Application Status Distribution
        $appStatusDistribution = Application::select('status', DB::raw('count(*) as value'))
            ->groupBy('status')
            ->get();

        return response()->json([
            'labels' => $months,
            'user_growth' => $userGrowth,
            'job_growth' => $jobGrowth,
            'company_growth' => $companyGrowth,
            'role_distribution' => $roleDistribution,
            'app_status_distribution' => $appStatusDistribution,
        ]);
    }

    public function listUsers()
    {
        return response()->json(User::latest()->paginate(20));
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete admin user.'], 403);
        }
        $this->logActivity('delete_user', 'User', $id, "Deleted user: {$user->email}");
        $user->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function listJobs()
    {
        return response()->json(Job::with('company')->latest()->paginate(20));
    }

    public function deleteJob($id)
    {
        $job = Job::findOrFail($id);
        $this->logActivity('delete_job', 'Job', $id, "Deleted job: {$job->title}");
        $job->delete();
        return response()->json(['message' => 'Job deleted successfully.']);
    }

    public function updateJobStatus(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        $status = $request->input('status');
        $job->update(['status' => $status]);
        $this->logActivity("update_job_status_{$status}", 'Job', $id, "Changed job status to {$status}");
        return response()->json(['message' => "Job status updated to {$status}"]);
    }

    public function listCompanies()
    {
        return response()->json(Company::with('user')->withCount('jobs')->latest()->paginate(20));
    }

    public function deleteCompany($id)
    {
        $company = Company::findOrFail($id);
        $this->logActivity('delete_company', 'Company', $id, "Deleted company: {$company->name}");
        $company->delete();
        return response()->json(['message' => 'Company deleted successfully.']);
    }

    public function listApplications()
    {
        return response()->json(Application::with(['user', 'job.company'])->latest()->paginate(20));
    }

    public function deleteApplication($id)
    {
        $application = Application::findOrFail($id);
        $this->logActivity('delete_application', 'Application', $id, "Deleted application ID: {$id}");
        $application->delete();
        return response()->json(['message' => 'Application deleted successfully.']);
    }

    public function getActivityLogs()
    {
        return response()->json(ActivityLog::with('user')->latest()->paginate(50));
    }

    public function getPerformanceMetrics()
    {
        // Basic metrics
        $metrics = [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'server_os' => PHP_OS,
            'memory_usage' => round(memory_get_usage(true) / 1024 / 1024, 2) . ' MB',
            'db_connection' => config('database.default'),
        ];

        return response()->json($metrics);
    }

    public function toggleMaintenance(Request $request)
    {
        $status = $request->input('status', false);
        Setting::updateOrCreate(
            ['key' => 'maintenance_mode'],
            ['value' => $status ? 'on' : 'off']
        );
        $this->logActivity('toggle_maintenance', 'Setting', null, "Maintenance mode set to " . ($status ? 'on' : 'off'));

        return response()->json(['message' => 'Maintenance mode updated.', 'status' => $status]);
    }
}
