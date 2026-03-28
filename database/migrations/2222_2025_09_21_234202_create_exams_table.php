<?php

use App\Models\Grade;
use App\Models\GradeSubject;
use App\Models\Subject;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(GradeSubject::class,'grade_subject_id')->constrained()->cascadeOnDelete();
            $table->string('academic_year');
            $table->string('name');
            $table->dateTime('date');
            $table->string('type');
            $table->string('semester');
            $table->string('language');
            $table->integer('marks');
            $table->decimal('duration_in_hours');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
