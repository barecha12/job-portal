<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Job::query()->with('company');

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('category')) {
            $query->where('category', 'like', '%' . $request->category . '%');
        }

        return $query->latest()->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'company_id' => 'required|exists:companies,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'salary' => 'nullable|string',
            'type' => 'required|string',
            'category' => 'nullable|string',
            'requirements' => 'nullable|string',
            'deadline' => 'nullable|date',
        ]);

        $user = Auth::user();
        $company = \App\Models\Company::find($request->company_id);

        if ($company->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized. You do not own this company.'], 403);
        }

        $job = Job::create($request->all());

        return response()->json($job, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $job = Job::with('company', 'applications')->find($id);

        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        return response()->json($job);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $job = Job::with('company')->find($id);

        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        $user = Auth::user();
        if ($job->company->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized. You do not own the company for this job.'], 403);
        }

        $job->update($request->all());

        return response()->json($job);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $job = Job::with('company')->find($id);

        if (!$job) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        $user = Auth::user();
        if ($job->company->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized. You do not own the company for this job.'], 403);
        }

        $job->delete();

        return response()->json(['message' => 'Job deleted']);
    }
}