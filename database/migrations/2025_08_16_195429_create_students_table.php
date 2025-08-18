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
        Schema::create('students', function (Blueprint $table) {
            $table->id();

            $table->string('name_in_arabic');
            $table->string('name_in_english');
            $table->date('birth_date');
            $table->string('nationality');
            $table->string('nid')->unique();
            $table->enum('gender', ['male', 'female']);
            $table->text('birth_address');
            $table->enum('language', ["لغات", 'عربي']);
            $table->string('gender');
            $table->enum('religion', ['مسلم', "مسيحي"]);
            $table->bigInteger('class_id')->unsigned();
            $table->foreign('class_id')->references('id')->on('classes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
