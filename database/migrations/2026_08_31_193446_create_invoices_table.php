<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();

            $table->string('billing_month')->nullable(); // e.g. "2026-09" for monthly fees
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['unpaid', 'partial', 'paid'])->default('unpaid');
            $table->date('due_date');

            $table->timestamps();
            $table->softDeletes();

            // Prevent duplicate invoicing for the same monthly course
            $table->unique(['student_id', 'course_id', 'billing_month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
