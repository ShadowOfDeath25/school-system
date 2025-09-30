<?php

use App\Models\Floor;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('language');
            $table->string('level');
            $table->string('name');
            $table->integer('grade');
            $table->integer('class_number');
            $table->integer('max_capacity');
            $table->foreignIdFor(Floor::class)->constrained()->cascadeOnDelete();
            $table->string('leader')->nullable();
            $table->string('academic_year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
