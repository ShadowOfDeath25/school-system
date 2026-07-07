<?php

use App\Models\Classroom;
use App\Models\Floor;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exam_halls', function (Blueprint $table) {
            $table->id();
            $table->integer('capacity');
            $table->string('academic_year');
            $table->integer('number')->unique();
            $table->foreignIdFor(Classroom::class)->constrained()->cascadeOnDelete();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_halls');
    }
};
