<?php

use App\Models\Grade;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grade_ages', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Grade::class)->constrained()->cascadeOnDelete();
            $table->unsignedInteger('min_years');
            $table->unsignedInteger('min_months')->default(0);
            $table->unsignedInteger('max_years')->nullable();
            $table->unsignedInteger('max_months')->nullable()->default(0);
            $table->timestamps();
            $table->unique('grade_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grade_ages');
    }
};
