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
Schema::create('reports', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

    $table->text('description');

    $table->decimal('lat', 10, 7);
    $table->decimal('lng', 10, 7);

    $table->string('category')->nullable();
    $table->string('subtype')->nullable();

    $table->json('tags')->nullable();

    $table->enum('priority', ['low', 'medium', 'high'])->nullable();

    $table->string('summary')->nullable();

    $table->float('ai_confidence')->nullable();
    $table->boolean('ai_needs_review')->default(false);

    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
