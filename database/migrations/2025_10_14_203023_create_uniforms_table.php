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
        Schema::create('uniforms', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string("size");
            $table->string('academic_year');
            $table->unsignedInteger('imported_quantity');
            $table->unsignedInteger('available_quantity');
            $table->string("piece");
            $table->decimal('buy_price', 8, 2);
            $table->decimal('sell_price', 8, 2);
            $table->index(['academic_year', 'type']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uniforms');
    }
};
