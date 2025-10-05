<?php

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
        Schema::create('seat_numbers', function (Blueprint $table) {
            $table->id();
            $table->string('level');
            $table->string('grade');
            $table->string('academic_year');
            $table->string('language');
            $table->integer('starts_at');
            $table->integer('ends_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seat_numbers');
    }
};
