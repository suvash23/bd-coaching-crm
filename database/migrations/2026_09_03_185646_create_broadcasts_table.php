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
        Schema::create('broadcasts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('type')->default('system'); // 'sms', 'system', 'email'
            $table->string('title')->nullable(); // For email or system
            $table->text('message');
            $table->string('status')->default('sent'); // pending, sent, failed
            $table->integer('recipients_count')->default(0);
            $table->json('target_filters')->nullable(); // Who received it
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('broadcasts');
    }
};
