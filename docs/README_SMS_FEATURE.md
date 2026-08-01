# 📱 SMS Notification Feature

> **Direct SMS notifications to patients with customizable templates**

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-1.0-blue)
![Laravel](https://img.shields.io/badge/Laravel-12-red)
![React](https://img.shields.io/badge/React-18-blue)

---

## 🎯 What is This?

A complete SMS notification system integrated into the Maternal & Child Care Management System that allows admins and health workers to:
- ✅ Send SMS to individual or multiple patients
- ✅ Use customizable message templates  
- ✅ Track all SMS with complete logging
- ✅ Manage and create templates
- ✅ Export SMS history

---

## 🚀 Quick Start

### 1️⃣ Access the Feature
```
Dashboard → Click "Send SMS" (purple button)
```

### 2️⃣ Send Your First SMS
1. **Select Template** → Choose "Custom Message"
2. **Select Patient** → Pick a patient with phone number
3. **Fill Message** → Enter your custom message
4. **Preview** → Check the blue preview box
5. **Send** → Click "Send SMS" button

### 3️⃣ View History
```
SMS Dashboard → Click "View Logs"
```

---

## 📚 Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **Complete Guide** | Full feature documentation | `/docs/SMS_NOTIFICATION_FEATURE.md` |
| **Quick Reference** | Quick guide & examples | `/docs/SMS_QUICK_GUIDE.md` |
| **Installation** | Setup & verification | `/SMS_INSTALLATION_CHECKLIST.md` |
| **Summary** | Implementation overview | `/SMS_FEATURE_SUMMARY.md` |

---

## ✨ Key Features

### 📤 Send SMS
- **Single Send** - One patient at a time
- **Bulk Send** - Multiple patients simultaneously
- **Live Preview** - See message before sending
- **Character Count** - Track message length

### 📝 Templates
- **5 Default Templates** included
- **Create Custom** templates
- **Edit Existing** templates
- **Dynamic Variables** - `{patient_name}`, `{appointment_date}`, etc.

### 📊 Logging
- **Complete History** of all SMS
- **Status Tracking** - Sent/Failed/Pending
- **Export to CSV** for reporting
- **Error Messages** for debugging

### 🎨 User Interface
- **Modern Design** - Clean, intuitive interface
- **Quick Actions** - Fast access from dashboard
- **Recent Activity** - Live updates sidebar
- **Responsive** - Works on all devices

---

## 🎯 Use Cases

### For Health Workers
```
✓ Send appointment reminders
✓ Notify about test results
✓ Share health tips
✓ Emergency notifications
✓ Follow-up reminders
```

### For Administrators
```
✓ Bulk announcements
✓ System updates
✓ Campaign messages
✓ Health education
✓ Appointment scheduling
```

---

## 📋 Default Templates

| Template | Usage | Variables |
|----------|-------|-----------|
| **Account Credentials** | New patient registration | `{patient_name}`, `{username}`, `{password}` |
| **Appointment Reminder** | Upcoming checkups | `{patient_name}`, `{appointment_date}`, `{appointment_time}` |
| **Visit Completed** | After prenatal visit | `{patient_name}`, `{visit_number}`, `{next_visit_date}` |
| **Custom Message** | General purpose | `{patient_name}`, `{custom_message}` |
| **Immunization Reminder** | Child vaccination | `{patient_name}`, `{child_name}`, `{vaccine_name}` |

---

## 🔗 Quick Links

### Main Pages
- **SMS Dashboard** - `/sms`
- **Templates** - `/sms/templates`
- **Logs** - `/sms/logs`

### Dashboard Access
- **Quick Action Button** - Purple "Send SMS" button
- **Direct URL** - `http://your-domain/sms`

---

## 🛠️ Technical Stack

```
Backend:
├── Laravel 12
├── PHP 8.2
├── MySQL Database
└── Semaphore SMS API

Frontend:
├── React 18
├── Inertia.js
├── Tailwind CSS
└── Lucide Icons

Features:
├── SmsTemplate Model
├── SmsLog Model
├── SmsNotificationController
└── 3 React Pages
```

---

## 💡 Example Messages

### Appointment Reminder
```
REMINDER: Hi Maria Santos, you have a prenatal 
checkup on August 15, 2026 at 9:00 AM. Please 
bring your health records. - Matcare
```

### Visit Completed
```
VISIT COMPLETED: Hi Maria Santos, your visit #3 
has been recorded. Next visit: September 15, 2026. 
For questions, contact your health center. - Matcare
```

### Custom Message
```
Hi Maria Santos, Your lab results are ready. 
Please visit the health center to collect them. 
- Matcare
```

---

## 📊 Features at a Glance

| Feature | Status |
|---------|--------|
| Single SMS | ✅ Working |
| Bulk SMS | ✅ Working |
| Templates | ✅ 5 Default |
| Custom Templates | ✅ Create/Edit |
| SMS Logging | ✅ Complete |
| Export Logs | ✅ CSV Format |
| Live Preview | ✅ Real-time |
| Status Tracking | ✅ Sent/Failed |
| Dashboard Integration | ✅ Quick Action |
| Recent Activity | ✅ Live Updates |

---

## 🎓 How to Use

### Send Single SMS
```
1. Go to SMS Dashboard
2. Click "Single" mode
3. Select template
4. Select patient
5. Fill custom fields
6. Click "Send SMS"
```

### Send Bulk SMS
```
1. Go to SMS Dashboard
2. Click "Bulk" mode
3. Select template
4. Check multiple patients
5. Fill custom fields
6. Click "Send to X Patients"
```

### Create Template
```
1. Go to SMS → Manage Templates
2. Click "New Template"
3. Fill form:
   - Name: unique_identifier
   - Label: Display Name
   - Template: Your message with {variables}
   - Description: Usage notes
4. Click "Create Template"
```

### View Logs
```
1. Go to SMS → View Logs
2. See all sent messages
3. Filter by status
4. Click "Export CSV" if needed
```

---

## 🔧 Configuration

### Environment Variables (.env)
```env
SMS_ENABLED=true
SMS_PROVIDER=semaphore
SMS_API_KEY=your_api_key_here
SMS_ENDPOINT=https://api.semaphore.co/api/v4/messages
SMS_SENDER_NAME=Matcare
```

### Database Tables
- `sms_templates` - Template storage
- `sms_logs` - SMS history

---

## 📱 Requirements

### For Sending SMS
- ✅ Valid SMS API key
- ✅ SMS credits in account
- ✅ Patient has phone number
- ✅ Phone format: `09XXXXXXXXX`

### For Users
- ✅ Authenticated user
- ✅ Admin or Health Worker role
- ✅ Access to `/sms` routes

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't access SMS page | Run `php artisan route:clear` |
| No templates | Run migrations, check database |
| Patient not showing | Add phone number to patient record |
| SMS not sending | Check .env configuration & API key |
| Variables not replacing | Verify exact spelling: `{patient_name}` |

**For more help:** Check `/docs/SMS_NOTIFICATION_FEATURE.md`

---

## 📈 Future Enhancements

Planned features:
- [ ] Scheduled SMS (send at specific time)
- [ ] SMS analytics dashboard
- [ ] Patient groups
- [ ] SMS templates with conditions
- [ ] Delivery reports
- [ ] Multi-language support
- [ ] SMS responses handling

---

## 🎉 Get Started Now!

1. **Login** to your system
2. **Click** "Send SMS" on dashboard
3. **Select** a template and patient
4. **Send** your first SMS!

**Need help?** → Check documentation in `/docs/` folder

---

## 📞 Support

- 📖 **Documentation:** `/docs/SMS_NOTIFICATION_FEATURE.md`
- 🚀 **Quick Guide:** `/docs/SMS_QUICK_GUIDE.md`
- ✅ **Checklist:** `/SMS_INSTALLATION_CHECKLIST.md`
- 📊 **Summary:** `/SMS_FEATURE_SUMMARY.md`

---

## 📝 License

Part of the Maternal & Child Care Management System  
© 2026 - All Rights Reserved

---

**Version:** 1.0  
**Last Updated:** August 1, 2026  
**Status:** ✅ Production Ready

**Made with ❤️ for better maternal and child healthcare**
