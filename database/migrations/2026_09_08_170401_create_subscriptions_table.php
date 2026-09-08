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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->foreignId('package_id')->constrained('packages');
            $table->enum('status', ['trial', 'active', 'expired', 'suspended'])->default('trial');
            $table->timestamp('starts_at');
            $table->timestamp('expires_at')->nullable();     // null = no expiry (ongoing)
            $table->timestamp('trial_ends_at')->nullable();  // only set for trial subscriptions
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
