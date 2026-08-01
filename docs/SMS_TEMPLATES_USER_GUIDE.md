# 📱 SMS Templates - User Guide for Midwives

## 🎯 What Are SMS Templates?

SMS templates are pre-written messages that you can use to send SMS to patients. Think of them like fill-in-the-blank letters - you just change a few words and send!

---

## 🔒 Safety Features

### ✅ What We Added to Keep You Safe:

1. **Live Preview** - See exactly how the message will look before saving
2. **Character Counter** - Shows if message is too long
3. **Warning Messages** - Clear alerts about what not to change
4. **Validation** - System checks for errors before saving
5. **Confirmation** - You must confirm before saving changes
6. **Yellow Highlights** - Automatic fields are clearly marked

---

## 🎨 Understanding the Interface

### When You Open Templates Page:

You'll see:
- **Blue Info Box** at the top - Read this first!
- **List of Templates** - All your message templates
- **Edit Button** on each template - Click to change it
- **Preview Button** - See how message will look
- **Active/Inactive Badge** - Shows if template is ON or OFF

---

## 📝 How to Edit a Template Safely

### Step 1: Click "Edit Message"
Find the template you want to change and click the purple **"Edit Message"** button.

### Step 2: Read the Yellow Warning Box
⚠️ **IMPORTANT:** At the top, you'll see a yellow box that says:
- Don't delete words in `{curly brackets}` - these are automatic!
- You can change regular words
- Preview your changes

### Step 3: Change the Template Name (Optional)
The **"Template Name"** is what you see in the list. You can change this to make it easier to understand.

**Example:**
- Old: "Appointment Reminder"
- New: "Checkup Reminder Message"

### Step 4: Edit the Message Text

**Safe to Edit:**
- ✅ Change "REMINDER" to "NOTICE"
- ✅ Add more words like "Please don't forget"
- ✅ Change "Please bring" to "Kindly bring"
- ✅ Add punctuation

**DO NOT Edit:**
- ❌ Don't remove `{patient_name}` - this puts the patient's name automatically
- ❌ Don't remove `{appointment_date}` - this puts the date automatically
- ❌ Don't remove `{sender_name}` - this puts your health center name

### Step 5: Check the Live Preview

As you type, look at the blue **"Preview"** box below. It shows:
- How the message will look to patients (using "Maria Santos" as example)
- How many characters (keep under 160 if possible)
- Green checkmark if length is good ✓
- Orange warning if message is too long ⚠️

### Step 6: Add Notes (Optional)

In the **"Notes"** box, you can write reminders for yourself:
- "Use this for first-time patients"
- "Send 1 day before appointment"
- "For urgent cases only"

### Step 7: Turn Template ON or OFF

Check the box if you want to **use this template** (ON)  
Uncheck if you want to **hide this template** (OFF)

### Step 8: Save Your Changes

1. Click the green **"Save Changes"** button
2. System will ask: "Are you sure?"
3. Click **"OK"** to confirm
4. Done! Your template is updated

---

## 🎯 Quick Examples

### Example 1: Making Message More Friendly

**Original:**
```
REMINDER: Hi {patient_name}, you have a prenatal checkup on {appointment_date}. - Matcare
```

**Your Edit (Safe):**
```
REMINDER: Hi {patient_name}, this is a friendly reminder that you have a prenatal checkup on {appointment_date}. We look forward to seeing you! - Matcare
```

**What Changed:** ✅ Added "this is a friendly reminder" and "We look forward to seeing you!"  
**What Stayed:** ✅ Kept `{patient_name}` and `{appointment_date}` intact

---

### Example 2: Adding More Details

**Original:**
```
Hi {patient_name}, your visit #{visit_number} has been recorded. Next visit: {next_visit_date}. - Matcare
```

**Your Edit (Safe):**
```
Hi {patient_name}, thank you for coming! Your visit #{visit_number} has been recorded. Your next visit is scheduled for {next_visit_date}. Please bring your health booklet. - Matcare
```

**What Changed:** ✅ Added "thank you for coming" and reminder about health booklet  
**What Stayed:** ✅ All automatic fields still in place

---

## ⚠️ Common Mistakes to Avoid

### ❌ WRONG - Deleting Automatic Fields
```
Hi Maria, you have a checkup on August 15. - Matcare
```
**Problem:** Removed `{patient_name}` and `{appointment_date}` - now it won't work for other patients!

### ✅ RIGHT - Keeping Automatic Fields
```
Hi {patient_name}, you have a checkup on {appointment_date}. - Matcare
```
**Good:** All automatic fields are still there!

---

### ❌ WRONG - Breaking the Brackets
```
Hi {patient name}, checkup on {appointment_date}. - Matcare
```
**Problem:** Space in `{patient name}` breaks it - should be `{patient_name}`

### ✅ RIGHT - Brackets Stay Together
```
Hi {patient_name}, checkup on {appointment_date}. - Matcare
```
**Good:** No spaces inside `{brackets}`

---

### ❌ WRONG - Too Long
```
Hi {patient_name}, this is a reminder about your very important prenatal checkup appointment that is scheduled for {appointment_date} at {appointment_time}. Please make sure to bring all your health records, previous test results, ultrasound images, and your health booklet. Don't forget to arrive 15 minutes early. Thank you very much! - Matcare
```
**Problem:** 350 characters - will send as 3 SMS messages (expensive!)

### ✅ RIGHT - Concise
```
REMINDER: Hi {patient_name}, your prenatal checkup is on {appointment_date} at {appointment_time}. Please bring your health records. - Matcare
```
**Good:** 145 characters - fits in 1 SMS!

---

## 🎨 Understanding the Automatic Fields

### Common Automatic Fields:

| Field | What It Does | Example |
|-------|--------------|---------|
| `{patient_name}` | Patient's full name | Maria Santos |
| `{appointment_date}` | Date of appointment | August 15, 2026 |
| `{appointment_time}` | Time of appointment | 9:00 AM |
| `{visit_number}` | Visit count | 3 |
| `{next_visit_date}` | Next scheduled visit | September 15, 2026 |
| `{sender_name}` | Your health center | Matcare |
| `{custom_message}` | Your own text | Test results ready |

**Think of these as blank spaces** that the system fills in automatically for each patient!

---

## 👁️ Using the Preview Feature

### To Preview Without Editing:

1. Find the template you want to see
2. Click the blue **"Preview"** button
3. A popup shows how the message looks
4. Example patient "Maria Santos" is used
5. Click **"Close Preview"** when done

**Use this to:** Check if a template is good before using it!

---

## 💡 Tips for Midwives

### ✅ DO:
- Read the yellow warning box every time
- Check the preview before saving
- Keep messages under 160 characters
- Use simple, clear language
- Test with one patient before sending to many
- Add helpful notes for your colleagues

### ❌ DON'T:
- Delete words in `{curly brackets}`
- Make messages too long
- Use complicated medical terms
- Forget to preview before saving
- Rush - take your time!

---

## 🆘 What If Something Goes Wrong?

### If Template Looks Broken:

1. **Click "Cancel"** (gray button)
2. **Don't click "Save Changes"**
3. **Ask your IT support** or supervisor
4. **Show them this guide**

### If You Saved by Mistake:

1. **Don't worry!** Your IT support can fix it
2. **Stop using that template** (turn it OFF)
3. **Tell your supervisor immediately**
4. **IT can restore from backup**

---

## 📞 Need Help?

### Before Making Changes:
- Read this guide fully
- Look at the preview
- Check the character count
- Make sure automatic fields are safe

### If Unsure:
- Ask a colleague who has done it before
- Show this guide to your supervisor
- Contact IT support for help
- Practice on the "Custom Message" template first

---

## ✨ Success Stories

### Good Edit Example:

**Midwife Anna's Edit:**
```
Before: Hi {patient_name}, your visit is recorded. - Matcare

After: Hi {patient_name}, thank you for your visit today! Your records are updated. See you next time! - Matcare
```

**Result:** ✅ More friendly, all automatic fields safe, good length!

---

## 🎓 Practice Exercise

Try editing the "Custom Message" template:

1. Go to Templates
2. Find "Custom Message"
3. Click "Edit Message"
4. Change the message but **keep** `{patient_name}` and `{custom_message}`
5. Check the preview
6. If it looks good, save it!
7. If not sure, click Cancel

**Remember:** The preview is your friend - use it!

---

## 📋 Quick Checklist Before Saving

- [ ] Read the yellow warning box
- [ ] All `{automatic fields}` are still there
- [ ] No spaces inside the `{brackets}`
- [ ] Message length is under 200 characters
- [ ] Preview looks correct
- [ ] Notes added (if needed)
- [ ] Sure about ON/OFF status
- [ ] Ready to click "Save"

---

## 🎉 You're Ready!

This guide protects you from breaking templates while giving you the power to make them better for your patients!

**Remember:**
- Take your time
- Use the preview
- Keep automatic fields safe
- Ask for help if unsure

**You've got this!** 💪

---

**Questions?** Ask your supervisor or IT support  
**Document Version:** 1.0 for Midwives  
**Last Updated:** August 2026
