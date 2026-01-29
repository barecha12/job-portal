<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Company::with('user')->paginate(10);
    }

    public function myCompanies()
    {
        return Company::where('user_id', Auth::id())->with('user')->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'logo' => 'nullable|string',
        ]);

        $company = Company::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'description' => $request->description,
            'website' => $request->website,
            'logo' => $request->logo,
        ]);

        return response()->json($company, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $company = Company::with('jobs')->find($id);

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        return response()->json($company);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        if ($company->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $company->update($request->all());

        return response()->json($company);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        if ($company->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $company->delete();

        return response()->json(['message' => 'Company deleted']);
    }
}