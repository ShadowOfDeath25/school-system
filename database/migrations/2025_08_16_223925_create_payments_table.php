<?php

use App\Models\Student;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('academic_year');
            $table->string("type");
            $table->decimal('value', 10, 2);
            $table->date('date');
            $table->foreignIdFor(Student::class)->constrained()->cascadeOnDelete();
            $table->string('level');
            $table->index(['student_id','academic_year','level','type']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
