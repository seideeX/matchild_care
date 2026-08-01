# Educational Content Management System

## Overview
Admin interface to manage educational videos and articles shown on patient dashboard.

## Status
✅ Backend Complete:
- Controllers: `EducationalContentController.php`
- Models: `EducationalVideo.php`, `EducationalArticle.php`
- Migrations: Created tables and seeded 6 videos + 6 articles
- Routes: All CRUD routes registered

## Database Structure

### Educational Videos Table
- `id` - Primary key
- `title` - Video title
- `description` - Brief description
- `youtube_id` - YouTube video ID
- `duration` - Video duration (e.g., "8:45")
- `category` - Category name
- `order` - Display order
- `is_active` - Active/inactive status
- `timestamps` - Created/updated dates

### Educational Articles Table
- `id` - Primary key
- `title` - Article title
- `excerpt` - Short preview text
- `content` - Full article content
- `category` - Category name
- `read_time` - Estimated read time (e.g., "5 min read")
- `url` - Reference URL (optional)
- `tips` - JSON array of health tips
- `order` - Display order
- `is_active` - Active/inactive status
- `timestamps` - Created/updated dates

## Routes

### Admin Routes (Requires Auth)
- `GET /educational-content` - Main management page
- `POST /educational-content/videos` - Create video
- `PUT /educational-content/videos/{video}` - Update video
- `DELETE /educational-content/videos/{video}` - Delete video
- `POST /educational-content/articles` - Create article
- `PUT /educational-content/articles/{article}` - Update article
- `DELETE /educational-content/articles/{article}` - Delete article

### API Route (For Patient Dashboard)
- `GET /api/educational-content` - Get active content (returns JSON)

## Initial Content Seeded

### Videos (6 total)
1. Pregnancy Nutrition Guide
2. Prenatal Care Basics
3. Safe Pregnancy Exercises
4. Labor and Delivery Guide
5. Postpartum Recovery
6. Breastfeeding Tips

### Articles (6 total)
1. Understanding Morning Sickness
2. Choosing the Right Prenatal Vitamin
3. Managing Pregnancy Back Pain
4. Preparing Your Birth Plan
5. Understanding Ultrasounds
6. Bonding with Your Baby Before Birth

## Frontend Implementation

### Admin Page Location
`resources/js/Pages/Admin/EducationalContent.jsx`

### Features Needed
1. **Tabs**: Switch between Videos and Articles
2. **Video Management**:
   - Add new video (YouTube ID, title, description, category, duration, order)
   - Edit existing video
   - Delete video
   - Toggle active/inactive
   - Preview thumbnail
3. **Article Management**:
   - Add new article (title, excerpt, content, category, read time, URL, tips array)
   - Edit existing article
   - Delete article
   - Toggle active/inactive
   - Manage multiple tips (add/remove)
4. **Design**: Modern, gradient colors, user-friendly for midwives

## Next Steps

1. ✅ Create the React component `EducationalContent.jsx`
2. ✅ Run migrations
3. ⏳ Build frontend assets: `npm run build`
4. ⏳ Test admin interface at `/educational-content`
5. ⏳ Update patient dashboard to fetch from API instead of hardcoded data

## Commands to Run

```bash
# Already run:
php artisan migrate
php artisan ziggy:generate

# Need to run:
npm run build

# Clear caches if needed:
php artisan optimize:clear
```

## Testing

1. Login as admin/health worker
2. Navigate to `/educational-content`
3. Test creating, editing, deleting videos and articles
4. Toggle active/inactive status
5. Verify patient dashboard shows database content

## File Dependencies

- Controller: `app/Http/Controllers/EducationalContentController.php`
- Models: `app/Models/EducationalVideo.php`, `app/Models/EducationalArticle.php`
- Routes: `routes/web.php` (educational-content routes added)
- Frontend: `resources/js/Pages/Admin/EducationalContent.jsx` (needs completion)
- Patient Dashboard: `resources/js/Pages/Patient/Dashboard.jsx` (needs update to use API)
