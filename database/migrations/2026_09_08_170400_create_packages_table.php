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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');                          // e.g. Free Trial, Basic, Pro, Premium
            $table->string('slug')->unique();                // e.g. free-trial, basic, pro, premium
            $table->unsignedInteger('max_students')->nullable(); // null = unlimited
            $table->unsignedInteger('price_bdt')->default(0);   // monthly price in BDT (0 = free)
            $table->unsignedSmallInteger('trial_days')->default(0); // >0 only for trial tier
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
