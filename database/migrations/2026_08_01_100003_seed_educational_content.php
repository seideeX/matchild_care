<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\EducationalVideo;
use App\Models\EducationalArticle;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Seed Videos
        $videos = [
            [
                'title' => 'Pregnancy Nutrition Guide',
                'description' => 'Essential nutrition and healthy eating during pregnancy',
                'youtube_id' => 'wo2YBlroRRw',
                'duration' => '8:45',
                'category' => 'Nutrition',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Prenatal Care Basics',
                'description' => 'What to expect during prenatal checkups',
                'youtube_id' => 'wt9-6VWbfHI',
                'duration' => '10:15',
                'category' => 'Prenatal Care',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Safe Pregnancy Exercises',
                'description' => 'Safe exercises and stretches for pregnant women',
                'youtube_id' => '4BOTvaRaDjI',
                'duration' => '12:30',
                'category' => 'Exercise',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Labor and Delivery Guide',
                'description' => 'Preparing for labor, delivery, and what to expect',
                'youtube_id' => 'j7YucfJuziU',
                'duration' => '15:20',
                'category' => 'Labor',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'Postpartum Recovery',
                'description' => 'Taking care of yourself after giving birth',
                'youtube_id' => 'EeRzmP84H_I',
                'duration' => '11:40',
                'category' => 'Postpartum',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'title' => 'Breastfeeding Tips',
                'description' => 'Getting started with breastfeeding your newborn',
                'youtube_id' => 'a8pTFnVZFQs',
                'duration' => '14:25',
                'category' => 'Breastfeeding',
                'order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($videos as $video) {
            EducationalVideo::create($video);
        }

        // Seed Articles
        $articles = [
            [
                'title' => 'Understanding Morning Sickness',
                'excerpt' => 'Learn about causes, symptoms, and effective remedies for morning sickness during early pregnancy.',
                'content' => 'Morning sickness, also called nausea and vomiting of pregnancy (NVP), affects up to 80% of pregnant women. Despite its name, it can occur at any time of day. It typically begins around week 6 and improves by week 12-14 of pregnancy.',
                'category' => 'First Trimester',
                'read_time' => '5 min read',
                'url' => 'https://www.acog.org/womens-health/faqs/morning-sickness-nausea-and-vomiting-of-pregnancy',
                'tips' => [
                    'Eat small, frequent meals throughout the day (5-6 meals)',
                    'Keep crackers by your bedside and eat a few before getting up',
                    'Avoid strong smells and trigger foods',
                    'Try ginger tea, ginger ale, or ginger candies',
                    'Stay hydrated - sip water, clear fluids, or ice chips',
                    'Get plenty of rest and avoid fatigue',
                    'Try vitamin B6 supplements (consult your doctor first)',
                    'Consider acupressure wristbands',
                    'Contact your doctor if you can\'t keep anything down'
                ],
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Choosing the Right Prenatal Vitamin',
                'excerpt' => 'A comprehensive guide to selecting prenatal vitamins with the right nutrients for you and your baby.',
                'content' => 'Prenatal vitamins are specially formulated multivitamins that provide extra nutrients needed during pregnancy. They help fill nutritional gaps and support your baby\'s development.',
                'category' => 'Nutrition',
                'read_time' => '7 min read',
                'url' => 'https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy',
                'tips' => [
                    'Look for 400-800 mcg of folic acid (prevents neural tube defects)',
                    'Ensure 27 mg of iron (prevents anemia)',
                    'Check for 1000 mg of calcium (bone development)',
                    'Include 200-300 mg of DHA (brain development)',
                    'Verify vitamin D content (600 IU recommended)',
                    'Consider chewable or gummy options if pills are difficult',
                    'Take with food to reduce nausea',
                    'Avoid megadoses - more isn\'t always better',
                    'Consult your doctor about your specific needs'
                ],
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Managing Pregnancy Back Pain',
                'excerpt' => 'Safe and effective strategies to relieve and prevent back pain during pregnancy.',
                'content' => 'Back pain affects about 50-70% of pregnant women. It\'s caused by weight gain, posture changes, hormone effects on ligaments, and stress. Most back pain occurs in the lower back and can range from mild to severe.',
                'category' => 'Comfort',
                'read_time' => '6 min read',
                'url' => 'https://www.acog.org/womens-health/faqs/back-pain-during-pregnancy',
                'tips' => [
                    'Practice good posture - stand straight, shoulders back',
                    'Wear low-heeled (not flat) supportive shoes',
                    'Use a pregnancy support belt for your belly',
                    'Sleep on your left side with pillow between knees',
                    'Do prenatal yoga and gentle stretching exercises',
                    'Apply heat or cold packs to painful areas',
                    'Get prenatal massage from a certified therapist',
                    'Avoid heavy lifting and twisting movements',
                    'Consider physical therapy if pain is severe'
                ],
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Preparing Your Birth Plan',
                'excerpt' => 'Step-by-step guide to creating a personalized birth plan that reflects your preferences.',
                'content' => 'A birth plan is a document that communicates your preferences for labor and delivery to your healthcare team. While flexibility is important (things may change), having a plan helps you think through your options and express your wishes.',
                'category' => 'Labor Prep',
                'read_time' => '10 min read',
                'url' => 'https://www.marchofdimes.org/find-support/topics/pregnancy/making-birth-plan',
                'tips' => [
                    'Research pain management options (epidural, natural methods)',
                    'Decide who you want present during labor',
                    'Consider your preferences for labor positions and movement',
                    'Think about interventions (induction, episiotomy)',
                    'Plan for immediate postpartum (skin-to-skin, breastfeeding)',
                    'Discuss newborn procedures (vitamin K, eye ointment)',
                    'Keep it concise (1-2 pages is ideal)',
                    'Review with your healthcare provider in advance',
                    'Stay flexible - safety is the priority'
                ],
                'order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'Understanding Ultrasounds',
                'excerpt' => 'What to expect during pregnancy ultrasounds and how to interpret the results.',
                'content' => 'Ultrasounds use sound waves to create images of your baby in the womb. They\'re safe, painless, and provide valuable information about your baby\'s development, due date, and overall health.',
                'category' => 'Medical Tests',
                'read_time' => '8 min read',
                'url' => 'https://www.acog.org/womens-health/faqs/ultrasound-exams',
                'tips' => [
                    'First ultrasound (6-9 weeks): Confirms pregnancy and heartbeat',
                    'Dating ultrasound (8-12 weeks): Determines due date accurately',
                    'Anatomy scan (18-22 weeks): Checks baby\'s organs and growth',
                    'Drink water before early ultrasounds (helps imaging)',
                    'Ask questions during the scan',
                    'Request printed photos if you\'d like keepsakes',
                    'Bring your partner or support person',
                    'Understand normal variations vs. concerns',
                    'Follow up on any abnormal findings promptly'
                ],
                'order' => 5,
                'is_active' => true,
            ],
            [
                'title' => 'Bonding with Your Baby Before Birth',
                'excerpt' => 'Ways to connect with your baby before birth and establish early bonding.',
                'content' => 'Bonding with your baby can begin well before birth. Prenatal bonding helps you feel connected to your baby, reduces anxiety, and may even benefit your baby\'s development.',
                'category' => 'Emotional Health',
                'read_time' => '5 min read',
                'url' => 'https://www.healthychildren.org/English/ages-stages/prenatal/Pages/default.aspx',
                'tips' => [
                    'Talk or sing to your baby daily',
                    'Play music - baby can hear from around 18 weeks',
                    'Gently massage your belly',
                    'Respond to baby\'s movements by touching your belly',
                    'Look at ultrasound pictures together with partner',
                    'Read books or stories aloud to baby',
                    'Practice visualization and positive affirmations',
                    'Take time for quiet moments to focus on baby',
                    'Keep a pregnancy journal about your journey'
                ],
                'order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($articles as $article) {
            EducationalArticle::create($article);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        EducationalVideo::truncate();
        EducationalArticle::truncate();
    }
};
