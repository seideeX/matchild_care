<?php

namespace App\Http\Controllers;

use App\Models\SmsLog;
use App\Models\SmsTemplate;
use App\Models\User;
use App\Models\MaternalRecord;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SmsNotificationController extends Controller
{
    protected $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    /**
     * Display SMS notification dashboard
     */
    public function index()
    {
        $templates = SmsTemplate::where('is_active', true)->get();
        $patients = User::where('role', 'patient')
            ->select('id', 'name', 'email', 'username')
            ->with(['maternalRecord:id,user_id,first_name,last_name,phone_number'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->username,
                    'contact_number' => $user->maternalRecord->phone_number ?? null,
                    'full_name' => $user->maternalRecord 
                        ? $user->maternalRecord->first_name . ' ' . $user->maternalRecord->last_name 
                        : $user->name,
                ];
            });

        $recentLogs = SmsLog::with(['user:id,name', 'sentBy:id,name'])
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();

        return Inertia::render('Admin/SmsNotifications', [
            'templates' => $templates,
            'patients' => $patients,
            'recentLogs' => $recentLogs,
        ]);
    }

    /**
     * Send SMS to single patient
     */
    public function sendToPatient(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:users,id',
            'template_id' => 'required|exists:sms_templates,id',
            'custom_data' => 'nullable|array',
        ]);

        $user = User::with('maternalRecord')->findOrFail($request->patient_id);
        $template = SmsTemplate::findOrFail($request->template_id);

        // Get phone number
        $phoneNumber = $user->maternalRecord->phone_number ?? null;

        if (!$phoneNumber) {
            return back()->with('error', 'Patient does not have a contact number.');
        }

        // Prepare template data
        $data = array_merge([
            'patient_name' => $user->maternalRecord 
                ? $user->maternalRecord->first_name . ' ' . $user->maternalRecord->last_name 
                : $user->name,
            'username' => $user->username,
            'sender_name' => config('services.sms.sender_name', 'Matcare'),
            'login_url' => config('app.url'),
        ], $request->custom_data ?? []);

        // Render message
        $message = $template->render($data);

        // Create log entry
        $log = SmsLog::create([
            'user_id' => $user->id,
            'sent_by' => auth()->id(),
            'phone_number' => $phoneNumber,
            'message' => $message,
            'template_name' => $template->name,
            'status' => 'pending',
        ]);

        // Send SMS
        try {
            $result = $this->smsService->send($phoneNumber, $message);
            
            $log->update([
                'status' => $result ? 'sent' : 'failed',
                'error_message' => $result ? null : 'SMS service returned false',
            ]);

            return back()->with('success', $result 
                ? 'SMS sent successfully to ' . $data['patient_name'] 
                : 'Failed to send SMS. Check logs for details.');
        } catch (\Exception $e) {
            $log->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to send SMS: ' . $e->getMessage());
        }
    }

    /**
     * Send SMS to multiple patients
     */
    public function sendBulk(Request $request)
    {
        $request->validate([
            'patient_ids' => 'required|array',
            'patient_ids.*' => 'exists:users,id',
            'template_id' => 'required|exists:sms_templates,id',
            'custom_data' => 'nullable|array',
        ]);

        $template = SmsTemplate::findOrFail($request->template_id);
        $users = User::with('maternalRecord')->whereIn('id', $request->patient_ids)->get();

        $results = [
            'success' => 0,
            'failed' => 0,
            'no_phone' => 0,
        ];

        foreach ($users as $user) {
            $phoneNumber = $user->maternalRecord->phone_number ?? null;

            if (!$phoneNumber) {
                $results['no_phone']++;
                continue;
            }

            // Prepare template data
            $data = array_merge([
                'patient_name' => $user->maternalRecord 
                    ? $user->maternalRecord->first_name . ' ' . $user->maternalRecord->last_name 
                    : $user->name,
                'username' => $user->username,
                'sender_name' => config('services.sms.sender_name', 'Matcare'),
                'login_url' => config('app.url'),
            ], $request->custom_data ?? []);

            // Render message
            $message = $template->render($data);

            // Create log entry
            $log = SmsLog::create([
                'user_id' => $user->id,
                'sent_by' => auth()->id(),
                'phone_number' => $phoneNumber,
                'message' => $message,
                'template_name' => $template->name,
                'status' => 'pending',
            ]);

            // Send SMS
            try {
                $result = $this->smsService->send($phoneNumber, $message);
                
                $log->update([
                    'status' => $result ? 'sent' : 'failed',
                    'error_message' => $result ? null : 'SMS service returned false',
                ]);

                if ($result) {
                    $results['success']++;
                } else {
                    $results['failed']++;
                }
            } catch (\Exception $e) {
                $log->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                ]);
                $results['failed']++;
            }
        }

        $message = "SMS Results - Success: {$results['success']}, Failed: {$results['failed']}, No Phone: {$results['no_phone']}";
        return back()->with('success', $message);
    }

    /**
     * Display templates management
     */
    public function templates()
    {
        $templates = SmsTemplate::all();
        return Inertia::render('Admin/SmsTemplates', [
            'templates' => $templates,
        ]);
    }

    /**
     * Update template
     */
    public function updateTemplate(Request $request, SmsTemplate $template)
    {
        $request->validate([
            'template' => 'required|string',
            'label' => 'required|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $template->update($request->only(['template', 'label', 'description', 'is_active']));

        return back()->with('success', 'Template updated successfully.');
    }

    /**
     * Create new template
     */
    public function createTemplate(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:sms_templates,name',
            'label' => 'required|string',
            'template' => 'required|string',
            'description' => 'nullable|string',
            'variables' => 'nullable|array',
        ]);

        SmsTemplate::create($request->all());

        return back()->with('success', 'Template created successfully.');
    }

    /**
     * View SMS logs
     */
    public function logs()
    {
        $logs = SmsLog::with(['user:id,name', 'sentBy:id,name'])
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return Inertia::render('Admin/SmsLogs', [
            'logs' => $logs,
        ]);
    }
}
