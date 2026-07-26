<?php

use App\Models\Student;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parent_student', function (Blueprint $table) {
            $table->foreignIdFor(Student::class)->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->constrained('parents')->cascadeOnDelete();
            $table->primary(['student_id', 'parent_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parent_student');
    }
};
