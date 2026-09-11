<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class BroadcastRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'in:sms,system,email'],
            'title' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'target_type' => ['required', 'in:all,batches'],
            'batch_ids' => ['required_if:target_type,batches', 'array'],
            'batch_ids.*' => ['exists:batches,id'],
        ];
    }
}
