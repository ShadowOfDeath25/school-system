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
        Schema::create('secret_numbers', function (Blueprint $table) {
            $table->id();
            $table->string('grade');
            $table->string('group_number');
            $table->string('group_capacity');
            $table->string('academic_year');
            $table->string('semester');
            $table->string('language');
            $table->string('level');
            $table->string('starts_at');
            $table->string('ends_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('secret_numbers');
    }
};
