<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_secret_assignments', function (Blueprint $table) {
            $table->index('secret_number_id', 'secret_number_id_index');
            $table->dropUnique('secret_config_number_unique');
            $table->unique(['assigned_number', 'academic_year'], 'secret_number_academic_year_unique');
        });
    }

    public function down(): void
    {
        Schema::table('student_secret_assignments', function (Blueprint $table) {
            $table->dropUnique('secret_number_academic_year_unique');
            $table->unique(['secret_number_id', 'assigned_number'], 'secret_config_number_unique');
            $table->dropIndex('secret_number_id_index');
        });
    }
};
