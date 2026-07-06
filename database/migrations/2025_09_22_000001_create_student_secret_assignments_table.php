<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_secret_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('secret_number_id')->constrained('secret_numbers')->cascadeOnDelete();
            $table->integer('assigned_number');
            $table->string('academic_year');
            $table->string('semester');
            $table->timestamps();

            $table->unique(['student_id', 'academic_year', 'semester'], 'student_year_semester_unique');
            $table->unique(['secret_number_id', 'assigned_number'], 'secret_config_number_unique');
            $table->index('academic_year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_secret_assignments');
    }
};
