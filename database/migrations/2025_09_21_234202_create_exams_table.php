<?php

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
            $table->foreignIdFor(Subject::class)->constrained()->cascadeOnDelete();
            $table->string('academic_year');
            $table->string('grade');
            $table->string('level');
            $table->string('name');
            $table->date('date');
            $table->string('type');
            $table->string('language');
            $table->date('duration_in_hours');
            $table->decimal('max_mark');
            $table->decimal('min_mark');
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
