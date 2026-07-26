<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parents', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('edu');
            $table->string('job');
            $table->string('nid')->unique();
            $table->string('phone_number')->unique();
            $table->enum('gender', ['male', 'female']);
            $table->string('relationship')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parents');
    }
};
