<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_values', function (Blueprint $table) {
            $table->id();
            $table->string('academic_year');
            $table->string("language")->nullable();
            $table->string("grade")->nullable();
            $table->string("level")->nullable();
            $table->decimal("value", 10, 2);
            $table->string('type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_values');
    }
};
