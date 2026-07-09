<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotion_batches', function (Blueprint $table) {
            $table->id();
            $table->string('from_academic_year');
            $table->string('to_academic_year');
            $table->integer('total_students')->default(0);
            $table->integer('promoted_count')->default(0);
            $table->integer('repeated_count')->default(0);
            $table->integer('graduated_count')->default(0);
            $table->string('status')->default('pending');
            $table->foreignIdFor(User::class, 'created_by')->constrained('users');
            $table->timestamp('rolled_back_at')->nullable();
            $table->foreignIdFor(User::class, 'rolled_back_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_batches');
    }
};
