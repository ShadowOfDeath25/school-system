<?php

use App\Models\Classroom;
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
            $table->enum('religion', ['مسلم', "مسيحي"]);
            $table->string("note")->nullable();
            $table->foreignIdFor(Classroom::class)->nullable()->constrained()->nullOnDelete();
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
