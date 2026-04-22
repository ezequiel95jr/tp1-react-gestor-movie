<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
Schema::create('report_votes', function (Blueprint $table) {
    $table->id();
    $table->uuid('report_id');
    $table->foreignId('user_id')->nullable();

    $table->timestamps();

    $table->unique(['report_id', 'user_id']);

    $table->foreign('report_id')
          ->references('id')
          ->on('reports')
          ->cascadeOnDelete();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_votes');
    }
};
