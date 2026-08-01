<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $templates = [
            [
                'name' => 'credentials',
                'label' => 'Account Credentials',
                'template' => 'ACCOUNT CREATED: Hi {patient_name}! Your login: Username: {username}, Password: {password}. Login at: {login_url} - {sender_name}',
                'description' => 'Sent when a new patient account is created',
                'variables' => json_encode(['patient_name', 'username', 'password', 'login_url', 'sender_name']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'appointment_reminder',
                'label' => 'Appointment Reminder',
                'template' => 'REMINDER: Hi {patient_name}, you have a prenatal checkup on {appointment_date} at {appointment_time}. Please bring your health records. - {sender_name}',
                'description' => 'Appointment reminder notification',
                'variables' => json_encode(['patient_name', 'appointment_date', 'appointment_time', 'sender_name']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'visit_completed',
                'label' => 'Visit Completed',
                'template' => 'VISIT COMPLETED: Hi {patient_name}, your visit #{visit_number} has been recorded. Next visit: {next_visit_date}. For questions, contact your health center. - {sender_name}',
                'description' => 'Notification after a prenatal visit',
                'variables' => json_encode(['patient_name', 'visit_number', 'next_visit_date', 'sender_name']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'custom_message',
                'label' => 'Custom Message',
                'template' => 'Hi {patient_name}, {custom_message} - {sender_name}',
                'description' => 'General custom message template',
                'variables' => json_encode(['patient_name', 'custom_message', 'sender_name']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'immunization_reminder',
                'label' => 'Immunization Reminder',
                'template' => 'IMMUNIZATION: Hi {patient_name}, your child {child_name} is due for {vaccine_name} on {scheduled_date}. Please visit your health center. - {sender_name}',
                'description' => 'Child immunization reminder',
                'variables' => json_encode(['patient_name', 'child_name', 'vaccine_name', 'scheduled_date', 'sender_name']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('sms_templates')->insert($templates);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('sms_templates')->truncate();
    }
};
