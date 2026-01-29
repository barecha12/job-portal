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
        Schema::table('jobs', function (Blueprint $table) {
            $table->text('requirements')->nullable()->after('description');
            $table->date('deadline')->nullable()->after('type');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->text('education')->nullable()->after('bio');
            $table->text('experience')->nullable()->after('education');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn(['requirements', 'deadline']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['education', 'experience']);
        });
    }
};
