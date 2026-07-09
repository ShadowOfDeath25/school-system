<?php

use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Student::class)->constrained()->cascadeOnDelete();
            $table->integer('from_grade');
            $table->integer('to_grade')->nullable();
            $table->foreignIdFor(Classroom::class, 'from_classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();
            $table->foreignIdFor(Classroom::class, 'to_classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();
            $table->string('from_academic_year');
            $table->string('to_academic_year');
            $table->string('status');
            $table->timestamp('enrolled_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_enrollments');
    }
};
