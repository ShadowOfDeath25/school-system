<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_seat_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('seat_number_id')->constrained('seat_numbers')->cascadeOnDelete();
            $table->integer('assigned_number');
            $table->string('academic_year');
            $table->timestamps();

            $table->unique(['student_id', 'academic_year'], 'student_year_unique');
            $table->unique(['seat_number_id', 'assigned_number'], 'seat_config_number_unique');
            $table->index('academic_year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_seat_assignments');
    }
};
