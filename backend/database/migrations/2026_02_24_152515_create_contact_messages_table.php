<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('name');
            $blueprint->string('email');
            $blueprint->string('phone')->nullable();
            $blueprint->string('company')->nullable();
            $blueprint->text('message');
            $blueprint->string('locale')->default('ar');
            $blueprint->boolean('is_read')->default(false);
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};
