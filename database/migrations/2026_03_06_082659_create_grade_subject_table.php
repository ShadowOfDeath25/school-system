<?php

use App\Models\Grade;
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
        Schema::create('grade_subject', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Subject::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Grade::class)->nullable()->constrained()->nullOnDelete();
            $table->float('min_marks')->unsigned();
            $table->float('max_marks')->unsigned();
            $table->boolean('added_to_total')->default(true);
            $table->boolean('added_to_report')->default(true);
            $table->string('semester');
            $table->string("language")->nullable();
            $table->unique(['subject_id', 'grade_id','language']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grade_subject');
    }
};
