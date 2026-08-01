# SMS Notification Feature Documentation

## Overview

The SMS Notification feature allows administrators and health workers to send direct SMS notifications to patients with customizable templates. This feature includes template management, bulk messaging, and comprehensive logging.

## Features

### 1. **Direct SMS Notifications**
- Send SMS to individual patients
- Bulk SMS to multiple patients
- Real-time message preview
- Character count tracking
- Status tracking (sent/failed/pending)

### 2. **Customizable Templates**
- Pre-defined templates for common scenarios
- Create custom templates
- Edit existing templates
- Dynamic variable insertion
- Template activation/deactivation

### 3. **SMS Logging**
- Complete history of all sent messages
- Success/failure tracking
- Error message logging
- Export logs to CSV
- Sender tracking

## Default Templates

The system comes with 5 pre-configured templates:

1. **Account Credentials** - Sent when a new patient account is created
2. **Appointment Reminder** - For upcoming prenatal checkups
3. **Visit Completed** - Confirmation after a prenatal visit
4. **Custom Message** - General purpose template
5. **Immunization Reminder** - For child vaccination reminders

## Accessing the Feature

### Quick Access from Dashboard
1. Log in as Admin or Health Worker
2. Click on **"Send SMS"** in the Quick Actions section

### Direct URL
- Navigate to: `/sms`

### Navigation Menu
- Dashboard → SMS Notifications

## How to Send SMS

### Single Patient SMS

1. **Go to SMS Notifications** (`/sms`)
2. **Select "Single" mode** (default)
3. **Choose a template** from the dropdown
4. **Select a patient** from the list (only patients with phone numbers shown)
5. **Fill in custom variables** (if required by template)
6. **Preview the message** in the blue preview box
7. **Click "Send SMS"**

### Bulk SMS

1. **Go to SMS Notifications** (`/sms`)
2. **Select "Bulk" mode**
3. **Choose a template**
4. **Select multiple patients** by checking boxes
5. **Fill in custom variables** (applied to all)
6. **Preview the message**
7. **Click "Send to X Patients"**

## Template Variables

Templates use curly braces `{variable_name}` for dynamic content:

### Auto-Populated Variables
- `{patient_name}` - Patient's full name
- `{username}` - Patient's username
- `{sender_name}` - System sender name (e.g., "Matcare")
- `{login_url}` - System login URL

### Custom Variables
You can define any custom variable in your template:
- `{appointment_date}`
- `{appointment_time}`
- `{visit_number}`
- `{next_visit_date}`
- `{custom_message}`
- `{child_name}`
- `{vaccine_name}`
- `{scheduled_date}`

## Managing Templates

### View All Templates
1. Go to **SMS Notifications**
2. Click **"Manage Templates"** button
3. URL: `/sms/templates`

### Edit a Template
1. On the Templates page, click **"Edit"** on any template
2. Modify the fields:
   - **Display Label** - Human-readable name
   - **Template Message** - The actual SMS content
   - **Description** - Usage notes
   - **Active** - Enable/disable the template
3. Click **"Save Changes"**

### Create a New Template
1. On the Templates page, click **"New Template"**
2. Fill in:
   - **Template Name** - Unique identifier (e.g., `custom_reminder`)
   - **Display Label** - User-friendly name
   - **Template Message** - Use `{variables}` for dynamic content
   - **Description** - When to use this template
3. Click **"Create Template"**

#### Template Example
```
Name: follow_up_visit
Label: Follow-up Visit Reminder
Template: Hi {patient_name}, this is a reminder for your follow-up visit on {visit_date} at {visit_time}. Please bring your health records. - {sender_name}
Description: Sent 24 hours before scheduled follow-up visits
```

## Viewing SMS Logs

### Access Logs
1. Go to **SMS Notifications**
2. Click **"View Logs"** button
3. URL: `/sms/logs`

### Log Information
Each log entry shows:
- **Date & Time** - When the SMS was sent
- **Patient** - Recipient name
- **Phone Number** - Recipient's phone
- **Template** - Which template was used
- **Message** - Full SMS content
- **Status** - Sent/Failed/Pending
- **Sent By** - Who initiated the SMS
- **Error Message** - If failed, why it failed

### Export Logs
1. On the Logs page, click **"Export CSV"**
2. CSV file downloads with all log data
3. Filename format: `sms-logs-YYYY-MM-DD.csv`

## Recent Activity Panel

The SMS Notifications page includes a **Recent Activity** sidebar showing:
- Last 20 SMS messages
- Status icons (✓ sent, ✗ failed, ⏱ pending)
- Quick overview of messaging activity

## Requirements

### Patient Requirements
- Patient must have a **phone number** in their maternal record
- Phone number column: `phone_number` in `maternal_records` table
- Phone number format: `09XXXXXXXXX` (Philippine format)

### User Requirements
- User must be authenticated
- Recommended roles: Admin or Health Worker
- Access to `/sms` routes

## Technical Details

### Database Tables

#### `sms_templates`
```
- id
- name (unique)
- label
- template (text)
- description (nullable)
- variables (json)
- is_active (boolean)
- timestamps
```

#### `sms_logs`
```
- id
- user_id (foreign key to users)
- sent_by (foreign key to users)
- phone_number
- message (text)
- template_name
- status (enum: pending/sent/failed)
- error_message (text, nullable)
- timestamps
```

### Routes

```php
Route::prefix('sms')->name('sms.')->group(function () {
    Route::get('/', 'SmsNotificationController@index')->name('index');
    Route::post('/send-to-patient', 'SmsNotificationController@sendToPatient')->name('send-to-patient');
    Route::post('/send-bulk', 'SmsNotificationController@sendBulk')->name('send-bulk');
    Route::get('/templates', 'SmsNotificationController@templates')->name('templates');
    Route::put('/templates/{template}', 'SmsNotificationController@updateTemplate')->name('update-template');
    Route::post('/templates', 'SmsNotificationController@createTemplate')->name('create-template');
    Route::get('/logs', 'SmsNotificationController@logs')->name('logs');
});
```

### Models

- **SmsTemplate** - Template management
- **SmsLog** - SMS history and logging
- **User** - Relationship: `smsLogs()`, `maternalRecord()`

### Services

- **SmsService** - Core SMS sending functionality
  - `send($phoneNumber, $message)` - Send single SMS
  - `sendBulk($phoneNumbers, $message)` - Send multiple SMS
  - Provider support: Semaphore, UniSMS, PhilSMS

## Integration with Existing Features

### Patient Registration
When a new patient is registered:
1. System automatically sends credentials SMS (if enabled)
2. Uses the `credentials` template
3. Includes username and password

### Prenatal Visits
After recording a prenatal visit:
1. Optional: Send visit completion notification
2. Uses the `visit_completed` template
3. Includes visit number and next visit date

### Manual Notifications
Health workers can send:
- Appointment reminders
- Health tips
- Custom messages
- Emergency notifications

## Best Practices

### Template Design
1. **Keep it short** - SMS has character limits (160 chars recommended)
2. **Be clear** - Use simple, direct language
3. **Include context** - Always mention what the message is about
4. **Add sender** - End with `- {sender_name}` for identification
5. **Test first** - Preview before sending to multiple patients

### Variable Usage
```
Good: Hi {patient_name}, your appointment is on {date}. - {sender_name}
Bad: {patient_name} {date} appointment
```

### Bulk Messaging
1. **Double-check selection** - Verify patient list before sending
2. **Verify template** - Ensure message makes sense for all recipients
3. **Check custom data** - Make sure variables apply to everyone
4. **Send test first** - Try with a single patient before bulk

### Error Handling
- If SMS fails, check the logs for error details
- Common issues:
  - Invalid phone number format
  - SMS service API errors
  - Network connectivity issues
  - Insufficient SMS credits

## Troubleshooting

### SMS Not Sending

**Check SMS Configuration**
```php
// .env file
SMS_ENABLED=true
SMS_PROVIDER=semaphore
SMS_API_KEY=your_api_key
SMS_ENDPOINT=https://api.semaphore.co/api/v4/messages
SMS_SENDER_NAME=Matcare
```

**Check Logs**
- Navigate to `/sms/logs`
- Look for error messages
- Check `storage/logs/laravel.log`

**Common Issues**
1. SMS disabled in config
2. Invalid API key
3. Insufficient SMS credits
4. Invalid phone number format
5. Network/SSL issues

### Patient Not in List

**Verify Phone Number**
1. Go to patient's maternal record
2. Check if `phone_number` field is filled
3. Format must be: `09XXXXXXXXX`

**Update Patient Phone**
1. Edit patient's maternal record
2. Add/update phone number in the `phone_number` field
3. Save changes
4. Patient will now appear in SMS list

### Template Variables Not Replacing

**Check Variable Names**
- Variables must match exactly: `{patient_name}` not `{Patient_Name}`
- Use underscores: `{visit_date}` not `{visit-date}`
- No spaces: `{custom_message}` not `{custom message}`

**Provide All Custom Variables**
- If template has `{appointment_date}`, fill that field
- Empty variables will show as `{appointment_date}` in message

## Security Considerations

1. **Access Control** - Only authenticated users can access
2. **Audit Trail** - All SMS logged with sender information
3. **Phone Validation** - Numbers validated before sending
4. **Rate Limiting** - Consider implementing to prevent abuse
5. **Data Privacy** - SMS logs contain sensitive information

## Future Enhancements

Potential improvements:
- [ ] Scheduled SMS (send at specific time)
- [ ] SMS templates with file attachments
- [ ] SMS analytics dashboard
- [ ] Auto-reply handling
- [ ] SMS delivery reports
- [ ] Patient groups for bulk messaging
- [ ] SMS templates with conditional logic
- [ ] Multi-language support

## Support

For issues or questions:
1. Check the logs at `/sms/logs`
2. Review this documentation
3. Check Laravel logs: `storage/logs/laravel.log`
4. Contact the development team

## Screenshots

### SMS Notification Dashboard
![SMS Dashboard](path/to/screenshot1.png)
- Template selection
- Patient selection
- Message preview
- Recent activity

### Template Management
![Template Management](path/to/screenshot2.png)
- View all templates
- Edit templates
- Create new templates

### SMS Logs
![SMS Logs](path/to/screenshot3.png)
- Complete message history
- Status tracking
- Export functionality

---

**Version:** 1.0  
**Last Updated:** August 1, 2026  
**Author:** Development Team
