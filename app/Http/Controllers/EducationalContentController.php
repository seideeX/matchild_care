<?php

namespace App\Http\Controllers;

use App\Models\EducationalVideo;
use App\Models\EducationalArticle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EducationalContentController extends Controller
{
    /**
     * Display educational content management page
     */
    public function index()
    {
        $videos = EducationalVideo::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        $articles = EducationalArticle::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/EducationalContent', [
            'videos' => $videos,
            'articles' => $articles,
        ]);
    }

    /**
     * Store a new video
     */
    public function storeVideo(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'youtube_id' => 'required|string|max:50',
            'duration' => 'nullable|string|max:20',
            'category' => 'required|string|max:100',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        EducationalVideo::create($request->all());

        return back()->with('success', 'Video added successfully.');
    }

    /**
     * Update a video
     */
    public function updateVideo(Request $request, EducationalVideo $video)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'youtube_id' => 'required|string|max:50',
            'duration' => 'nullable|string|max:20',
            'category' => 'required|string|max:100',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $video->update($request->all());

        return back()->with('success', 'Video updated successfully.');
    }

    /**
     * Delete a video
     */
    public function destroyVideo(EducationalVideo $video)
    {
        $video->delete();

        return back()->with('success', 'Video deleted successfully.');
    }

    /**
     * Store a new article
     */
    public function storeArticle(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'read_time' => 'nullable|string|max:20',
            'url' => 'nullable|url|max:500',
            'tips' => 'nullable|array',
            'tips.*' => 'string',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        EducationalArticle::create($request->all());

        return back()->with('success', 'Article added successfully.');
    }

    /**
     * Update an article
     */
    public function updateArticle(Request $request, EducationalArticle $article)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'read_time' => 'nullable|string|max:20',
            'url' => 'nullable|url|max:500',
            'tips' => 'nullable|array',
            'tips.*' => 'string',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $article->update($request->all());

        return back()->with('success', 'Article updated successfully.');
    }

    /**
     * Delete an article
     */
    public function destroyArticle(EducationalArticle $article)
    {
        $article->delete();

        return back()->with('success', 'Article deleted successfully.');
    }

    /**
     * Get active content for patient dashboard
     */
    public function getActiveContent()
    {
        $videos = EducationalVideo::active()->ordered()->get();
        $articles = EducationalArticle::active()->ordered()->get();

        return response()->json([
            'videos' => $videos,
            'articles' => $articles,
        ]);
    }
}
