<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pockets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('icon')->nullable();
            $table->string('color')->default('#5CB85C');
            $table->decimal('balance', 15, 2)->default(0);
            $table->decimal('allocated', 15, 2)->default(0);
            $table->decimal('spent', 15, 2)->default(0);
            $table->boolean('is_default')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pockets');
    }
};