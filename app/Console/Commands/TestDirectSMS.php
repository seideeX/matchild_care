<?php

namespace App\Console\Commands;

use App\Services\SmsService;
use Illuminate\Console\Command;

class TestDirectSMS extends Command
{
    protected $signature = 'sms:test-direct {phone} {message?}';
    protected $description = 'Test SMS sending directly to a phone number';

    public function handle()
    {
        $phone = $this->argument('phone');
        $message = $this->argument('message') ?? 'Test message from Maternal Care System at ' . now()->format('Y-m-d H:i:s');

        $this->info('Sending SMS...');
        $this->info("Phone: {$phone}");
        $this->info("Message: {$message}");
        $this->newLine();

        try {
            $smsService = new SmsService();
            $result = $smsService->send($phone, $message);

            if ($result) {
                $this->info('✅ SMS sent successfully!');
                $this->info('Check storage/logs/laravel.log for details');
                return Command::SUCCESS;
            } else {
                $this->error('❌ SMS sending failed!');
                $this->error('Check storage/logs/laravel.log for error details');
                return Command::FAILURE;
            }
        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            $this->error('Trace: ' . $e->getTraceAsString());
            return Command::FAILURE;
        }
    }
}
