<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('portfolio_url')->nullable()->after('bio');
            $table->string('github_url')->nullable()->after('portfolio_url');
            $table->string('linkedin_url')->nullable()->after('github_url');
            $table->text('skills')->nullable()->after('linkedin_url');
            $table->string('department')->nullable()->after('skills');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'portfolio_url', 'github_url', 'linkedin_url', 'skills', 'department']);
        });
    }
};
