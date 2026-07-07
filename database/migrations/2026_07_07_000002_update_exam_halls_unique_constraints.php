<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exam_halls', function (Blueprint $table) {
            $table->dropUnique(['number']);
            $table->unique(['number', 'academic_year']);
            $table->unique(['classroom_id', 'academic_year']);
        });
    }

    public function down(): void
    {
        Schema::table('exam_halls', function (Blueprint $table) {
            $table->dropUnique(['classroom_id', 'academic_year']);
            $table->dropUnique(['number', 'academic_year']);
            $table->integer('number')->unique()->change();
        });
    }
};
