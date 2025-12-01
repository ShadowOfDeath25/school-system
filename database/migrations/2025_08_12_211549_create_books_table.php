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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string("level");
            $table->integer("imported_quantity");
            $table->integer("available_quantity")->nullable();
            $table->integer("grade");
            $table->string('semester');
            $table->string('language');
            $table->string("academic_year");
            $table->decimal("price", 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
