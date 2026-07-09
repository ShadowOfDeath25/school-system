<?php

use App\Models\Classroom;
use App\Models\PromotionBatch;
use App\Models\Student;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotion_batch_students', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(PromotionBatch::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Student::class)->constrained()->cascadeOnDelete();
            $table->integer('from_grade');
            $table->integer('to_grade')->nullable();
            $table->foreignIdFor(Classroom::class, 'from_classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();
            $table->foreignIdFor(Classroom::class, 'to_classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();
            $table->string('decision');
            $table->boolean('second_round_passed')->nullable();
            $table->boolean('rolled_back')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_batch_students');
    }
};
