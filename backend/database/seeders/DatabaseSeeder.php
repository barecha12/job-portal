<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        \App\Models\User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        // Create Employer
        $employer = \App\Models\User::factory()->create([
            'name' => 'Employer User',
            'email' => 'employer@example.com',
            'role' => 'employer',
        ]);

        // Create Seeker
        $seeker = \App\Models\User::factory()->create([
            'name' => 'Seeker User',
            'email' => 'seeker@example.com',
            'role' => 'seeker',
        ]);

        // Create Companies for Employer
        $companies = \App\Models\Company::factory(3)->create([
            'user_id' => $employer->id,
        ]);

        // Create Jobs for each Company
        foreach ($companies as $company) {
            \App\Models\Job::factory(5)->create([
                'company_id' => $company->id,
            ]);
        }

        // Create 50 random jobs
        \App\Models\Job::factory(10)->create();

        // Create dummy applications
        \App\Models\Application::factory(20)->create();
    }
}
