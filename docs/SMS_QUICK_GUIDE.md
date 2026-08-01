# SMS Notification - Quick Guide

## 🚀 Quick Start

### Send SMS in 3 Steps
1. **Go to Dashboard** → Click "Send SMS" in Quick Actions
2. **Select Template** → Choose patient → Fill variables
3. **Preview & Send** → Click "Send SMS"

---

## 📋 Common Tasks

### Send Single SMS
```
1. SMS Notifications page
2. Single mode
3. Choose template
4. Select patient
5. Fill custom fields
6. Send
```

### Send Bulk SMS
```
1. SMS Notifications page
2. Bulk mode
3. Choose template
4. Check multiple patients
5. Fill custom fields
6. Send to X Patients
```

### Create Template
```
1. SMS → Manage Templates
2. New Template button
3. Fill: Name, Label, Template, Description
4. Use {variables} for dynamic content
5. Create Template
```

### View Logs
```
1. SMS → View Logs
2. See all sent messages
3. Export CSV if needed
```

---

## 🎯 Quick Access URLs

| Feature | URL |
|---------|-----|
| SMS Dashboard | `/sms` |
| Templates | `/sms/templates` |
| Logs | `/sms/logs` |

---

## 📝 Template Variables

### Auto-Filled
- `{patient_name}` - Patient full name
- `{username}` - Login username
- `{sender_name}` - "Matcare"
- `{login_url}` - System URL

### Custom (You Fill)
- `{appointment_date}`
- `{appointment_time}`
- `{visit_number}`
- `{next_visit_date}`
- `{custom_message}`
- Any `{variable_you_define}`

---

## ✅ Quick Checks

### Before Sending
- [ ] Patient has phone number?
- [ ] Template selected?
- [ ] All variables filled?
- [ ] Message previewed?
- [ ] Correct patients selected?

### If SMS Fails
1. Check SMS Logs for error
2. Verify phone number format (09XXXXXXXXX)
3. Check SMS credits
4. Review Laravel logs

---

## 🎨 Template Examples

### Appointment Reminder
```
REMINDER: Hi {patient_name}, you have a prenatal checkup on {appointment_date} at {appointment_time}. Please bring your health records. - {sender_name}
```

### Custom Message
```
Hi {patient_name}, {custom_message} - {sender_name}
```

### Visit Completed
```
VISIT COMPLETED: Hi {patient_name}, your visit #{visit_number} has been recorded. Next visit: {next_visit_date}. For questions, contact your health center. - {sender_name}
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Patient not in list | Add phone number to maternal record |
| SMS not sending | Check SMS config in .env |
| Variables not replacing | Verify spelling: `{patient_name}` |
| No templates shown | Activate templates in template manager |
| Bulk send failing | Check each patient has valid phone |

---

## 💡 Pro Tips

1. **Preview First** - Always check the preview before sending
2. **Test Single** - Send to one patient before bulk
3. **Keep Short** - Under 160 characters is best
4. **Use Templates** - Don't type the same message twice
5. **Check Logs** - Monitor delivery status regularly
6. **Export Logs** - Keep records for auditing

---

## 🎓 Training Checklist

- [ ] Can send single SMS
- [ ] Can send bulk SMS
- [ ] Can create template
- [ ] Can edit template
- [ ] Can view logs
- [ ] Can export logs
- [ ] Know how to troubleshoot

---

## 📞 Quick Reference

**Default Sender Name:** Matcare  
**Phone Format:** 09XXXXXXXXX  
**Character Limit:** 160 recommended  
**SMS Provider:** Semaphore (configurable)

---

**Need help?** Check `/docs/SMS_NOTIFICATION_FEATURE.md` for full documentation
