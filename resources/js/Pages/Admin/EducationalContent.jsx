import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { BookOpen, Video, FileText, ArrowLeft, Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { useState } from 'react';
import ConfirmationModal from '@/Components/ConfirmationModal';
import Toast from '@/Components/Toast';

export default function EducationalContent({ videos, articles }) {
    const [activeTab, setActiveTab] = useState('videos');
    const [showCreateVideo, setShowCreateVideo] = useState(false);
    const [showCreateArticle, setShowCreateArticle] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [editingArticle, setEditingArticle] = useState(null);
    
    // Confirmation modal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmTitle, setConfirmTitle] = useState('');
    
    // Toast notification state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    // Helper function to show toast
    const showNotification = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    // Helper function to show confirmation modal
    const showConfirm = (title, message, action) => {
        setConfirmTitle(title);
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setShowConfirmModal(true);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
        }
        setShowConfirmModal(false);
    };

    // Video form
    const { data: videoData, setData: setVideoData, post: postVideo, put: putVideo, processing: videoProcessing, reset: resetVideo } = useForm({
        title: '',
        description: '',
        youtube_id: '',
        duration: '',
        category: '',
        order: 0,
        is_active: true,
    });

    // Article form
    const { data: articleData, setData: setArticleData, post: postArticle, put: putArticle, processing: articleProcessing, reset: resetArticle } = useForm({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        read_time: '',
        url: '',
        tips: [''],
        order: 0,
        is_active: true,
    });

    // Video CRUD operations
    const startCreateVideo = () => {
        resetVideo();
        setShowCreateVideo(true);
    };

    const startEditVideo = (video) => {
        setVideoData({
            title: video.title,
            description: video.description,
            youtube_id: video.youtube_id,
            duration: video.duration || '',
            category: video.category,
            order: video.order,
            is_active: video.is_active,
        });
        setEditingVideo(video.id);
    };

    const handleCreateVideo = (e) => {
        e.preventDefault();
        postVideo(route('educational-content.videos.store'), {
            onSuccess: () => {
                resetVideo();
                setShowCreateVideo(false);
                showNotification('Video created successfully!', 'success');
            },
            onError: () => {
                showNotification('Failed to create video. Please try again.', 'error');
            }
        });
    };

    const handleUpdateVideo = (videoId) => {
        putVideo(route('educational-content.videos.update', videoId), {
            onSuccess: () => {
                setEditingVideo(null);
                resetVideo();
                showNotification('Video updated successfully!', 'success');
            },
            onError: () => {
                showNotification('Failed to update video. Please try again.', 'error');
            }
        });
    };

    const handleDeleteVideo = (videoId, videoTitle) => {
        showConfirm(
            'Delete Video',
            `Are you sure you want to delete "${videoTitle}"? This action cannot be undone.`,
            () => {
                router.delete(route('educational-content.videos.destroy', videoId), {
                    onSuccess: () => {
                        showNotification('Video deleted successfully!', 'success');
                    },
                    onError: () => {
                        showNotification('Failed to delete video. Please try again.', 'error');
                    }
                });
            }
        );
    };

    // Article CRUD operations
    const startCreateArticle = () => {
        resetArticle();
        setArticleData('tips', ['']);
        setShowCreateArticle(true);
    };

    const startEditArticle = (article) => {
        setArticleData({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            read_time: article.read_time || '',
            url: article.url || '',
            tips: article.tips && article.tips.length > 0 ? article.tips : [''],
            order: article.order,
            is_active: article.is_active,
        });
        setEditingArticle(article.id);
    };

    const handleCreateArticle = (e) => {
        e.preventDefault();
        const filteredTips = articleData.tips.filter(tip => tip.trim() !== '');
        postArticle(route('educational-content.articles.store'), {
            data: { ...articleData, tips: filteredTips },
            onSuccess: () => {
                resetArticle();
                setShowCreateArticle(false);
                showNotification('Article created successfully!', 'success');
            },
            onError: () => {
                showNotification('Failed to create article. Please try again.', 'error');
            }
        });
    };

    const handleUpdateArticle = (articleId) => {
        const filteredTips = articleData.tips.filter(tip => tip.trim() !== '');
        putArticle(route('educational-content.articles.update', articleId), {
            data: { ...articleData, tips: filteredTips },
            onSuccess: () => {
                setEditingArticle(null);
                resetArticle();
                showNotification('Article updated successfully!', 'success');
            },
            onError: () => {
                showNotification('Failed to update article. Please try again.', 'error');
            }
        });
    };

    const handleDeleteArticle = (articleId, articleTitle) => {
        showConfirm(
            'Delete Article',
            `Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`,
            () => {
                router.delete(route('educational-content.articles.destroy', articleId), {
                    onSuccess: () => {
                        showNotification('Article deleted successfully!', 'success');
                    },
                    onError: () => {
                        showNotification('Failed to delete article. Please try again.', 'error');
                    }
                });
            }
        );
    };

    // Tips management
    const addTip = () => {
        setArticleData('tips', [...articleData.tips, '']);
    };

    const updateTip = (index, value) => {
        const newTips = [...articleData.tips];
        newTips[index] = value;
        setArticleData('tips', newTips);
    };

    const removeTip = (index) => {
        const newTips = articleData.tips.filter((_, i) => i !== index);
        setArticleData('tips', newTips.length > 0 ? newTips : ['']);
    };

    // Extract YouTube ID from URL or return the input if it's already an ID
    const extractYoutubeId = (input) => {
        if (!input) return '';
        
        // If it's already a simple ID (no special characters except hyphens and underscores)
        if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
            return input.trim();
        }
        
        // Try to extract from various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([a-zA-Z0-9_-]{11})/
        ];
        
        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        // If no pattern matched, return the input as-is (might be a simple ID)
        return input.trim();
    };

    // Handle YouTube URL/ID input
    const handleYoutubeInput = (input) => {
        const videoId = extractYoutubeId(input);
        setVideoData('youtube_id', videoId);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            <BookOpen className="inline-block w-6 h-6 mr-2" />
                            Educational Content Management
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Manage videos and articles for patient dashboard</p>
                    </div>
   
                </div>
            }
        >
            <Head title="Educational Content" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('videos')}
                                className={`flex-1 px-6 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                                    activeTab === 'videos'
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Video className="w-5 h-5" />
                                Video Tutorials ({videos.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('articles')}
                                className={`flex-1 px-6 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                                    activeTab === 'articles'
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <FileText className="w-5 h-5" />
                                Health Articles ({articles.length})
                            </button>
                        </div>
                    </div>

                    {/* Videos Tab */}
                    {activeTab === 'videos' && (
                        <div className="space-y-4">
                            {/* Add New Video Button */}
                            {!showCreateVideo && !editingVideo && (
                                <div className="text-right mb-4">
                                    <button
                                        onClick={startCreateVideo}
                                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center gap-2 ml-auto shadow-lg"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add New Video
                                    </button>
                                </div>
                            )}

                            {/* Create Video Form */}
                            {showCreateVideo && (
                                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200 mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-green-600" />
                                        Add New Video Tutorial
                                    </h3>
                                    <form onSubmit={handleCreateVideo} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Video Title *</label>
                                                <input
                                                    type="text"
                                                    value={videoData.title}
                                                    onChange={(e) => setVideoData('title', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    placeholder="e.g., Pregnancy Nutrition Guide"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video URL or ID *</label>
                                                <input
                                                    type="text"
                                                    value={videoData.youtube_id}
                                                    onChange={(e) => handleYoutubeInput(e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    placeholder="Paste full YouTube URL or just the video ID"
                                                    required
                                                />
                                             
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                            <textarea
                                                value={videoData.description}
                                                onChange={(e) => setVideoData('description', e.target.value)}
                                                className="w-full rounded-lg border-gray-300"
                                                rows="3"
                                                placeholder="Brief description of what the video covers..."
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                                <input
                                                    type="text"
                                                    value={videoData.category}
                                                    onChange={(e) => setVideoData('category', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    placeholder="e.g., Nutrition"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                                <input
                                                    type="text"
                                                    value={videoData.duration}
                                                    onChange={(e) => setVideoData('duration', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    placeholder="e.g., 8:45"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                                                <input
                                                    type="number"
                                                    value={videoData.order}
                                                    onChange={(e) => setVideoData('order', parseInt(e.target.value) || 0)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    min="0"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={videoData.is_active}
                                                onChange={(e) => setVideoData('is_active', e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-green-600"
                                            />
                                            <label className="text-sm font-medium text-gray-700">
                                                Active (visible to patients)
                                            </label>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t">
                                            <button
                                                type="submit"
                                                disabled={videoProcessing}
                                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                Create Video
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowCreateVideo(false);
                                                    resetVideo();
                                                }}
                                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-2"
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Videos List */}
                            {videos.map(video => (
                                <div key={video.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                    {editingVideo === video.id ? (
                                        // Edit Form
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleUpdateVideo(video.id);
                                        }} className="space-y-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Edit className="w-5 h-5 text-purple-600" />
                                                Edit Video
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Title *</label>
                                                    <input
                                                        type="text"
                                                        value={videoData.title}
                                                        onChange={(e) => setVideoData('title', e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video URL or ID *</label>
                                                    <input
                                                        type="text"
                                                        value={videoData.youtube_id}
                                                        onChange={(e) => handleYoutubeInput(e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                        placeholder="Paste full YouTube URL or just the video ID"
                                                        required
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        You can paste the full YouTube URL or just the video ID
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                                <textarea
                                                    value={videoData.description}
                                                    onChange={(e) => setVideoData('description', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    rows="3"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                                    <input
                                                        type="text"
                                                        value={videoData.category}
                                                        onChange={(e) => setVideoData('category', e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                                    <input
                                                        type="text"
                                                        value={videoData.duration}
                                                        onChange={(e) => setVideoData('duration', e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                                                    <input
                                                        type="number"
                                                        value={videoData.order}
                                                        onChange={(e) => setVideoData('order', parseInt(e.target.value) || 0)}
                                                        className="w-full rounded-lg border-gray-300"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                                <input
                                                    type="checkbox"
                                                    checked={videoData.is_active}
                                                    onChange={(e) => setVideoData('is_active', e.target.checked)}
                                                    className="w-5 h-5 rounded border-gray-300 text-purple-600"
                                                />
                                                <label className="text-sm font-medium text-gray-700">
                                                    Active (visible to patients)
                                                </label>
                                            </div>

                                            <div className="flex gap-2 pt-4 border-t">
                                                <button
                                                    type="submit"
                                                    disabled={videoProcessing}
                                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Save Changes
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingVideo(null);
                                                        resetVideo();
                                                    }}
                                                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        // View Mode
                                        <div>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-900">{video.title}</h3>
                                                        {video.is_active ? (
                                                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                                                        ) : (
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Inactive</span>
                                                        )}
                                                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">{video.category}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span>YouTube ID: {video.youtube_id}</span>
                                                        {video.duration && <span>Duration: {video.duration}</span>}
                                                        <span>Order: {video.order}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <a
                                                        href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
                                                    >
                                                        <Video className="w-4 h-4" />
                                                        Watch
                                                    </a>
                                                    <button
                                                        onClick={() => startEditVideo(video)}
                                                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteVideo(video.id, video.title)}
                                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <img
                                                    src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                                    alt={video.title}
                                                    className="w-full max-w-md rounded-lg border-2 border-gray-200"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Articles Tab */}
                    {activeTab === 'articles' && (
                        <div className="space-y-4">
                            {/* Add New Article Button */}
                            {!showCreateArticle && !editingArticle && (
                                <div className="text-right mb-4">
                                    <button
                                        onClick={startCreateArticle}
                                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center gap-2 ml-auto shadow-lg"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add New Article
                                    </button>
                                </div>
                            )}

                            {/* Create Article Form */}
                            {showCreateArticle && (
                                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200 mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-green-600" />
                                        Add New Health Article
                                    </h3>
                                    <form onSubmit={handleCreateArticle} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Article Title *</label>
                                                <input
                                                    type="text"
                                                    value={articleData.title}
                                                    onChange={(e) => setArticleData('title', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    placeholder="e.g., Understanding Morning Sickness"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                                <input
                                                    type="text"
                                                    value={articleData.category}
                                                    onChange={(e) => setArticleData('category', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    placeholder="e.g., First Trimester"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Short Excerpt *</label>
                                            <textarea
                                                value={articleData.excerpt}
                                                onChange={(e) => setArticleData('excerpt', e.target.value)}
                                                className="w-full rounded-lg border-gray-300"
                                                rows="2"
                                                placeholder="Brief summary that appears in the article preview..."
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Content *</label>
                                            <textarea
                                                value={articleData.content}
                                                onChange={(e) => setArticleData('content', e.target.value)}
                                                className="w-full rounded-lg border-gray-300"
                                                rows="6"
                                                placeholder="Full article content that patients will read..."
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                                                <input
                                                    type="text"
                                                    value={articleData.read_time}
                                                    onChange={(e) => setArticleData('read_time', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    placeholder="e.g., 5 min read"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                                                <input
                                                    type="number"
                                                    value={articleData.order}
                                                    onChange={(e) => setArticleData('order', parseInt(e.target.value) || 0)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Reference URL</label>
                                                <input
                                                    type="url"
                                                    value={articleData.url}
                                                    onChange={(e) => setArticleData('url', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>

                                        {/* Tips Section */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-medium text-gray-700">Health Tips</label>
                                                <button
                                                    type="button"
                                                    onClick={addTip}
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 flex items-center gap-1"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    Add Tip
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {articleData.tips.map((tip, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={tip}
                                                            onChange={(e) => updateTip(index, e.target.value)}
                                                            className="flex-1 rounded-lg border-gray-300"
                                                            placeholder={`Tip ${index + 1}...`}
                                                        />
                                                        {articleData.tips.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTip(index)}
                                                                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={articleData.is_active}
                                                onChange={(e) => setArticleData('is_active', e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-green-600"
                                            />
                                            <label className="text-sm font-medium text-gray-700">
                                                Active (visible to patients)
                                            </label>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t">
                                            <button
                                                type="submit"
                                                disabled={articleProcessing}
                                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                Create Article
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowCreateArticle(false);
                                                    resetArticle();
                                                }}
                                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-2"
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Articles List */}
                            {articles.map(article => (
                                <div key={article.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                    {editingArticle === article.id ? (
                                        // Edit Form
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleUpdateArticle(article.id);
                                        }} className="space-y-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Edit className="w-5 h-5 text-purple-600" />
                                                Edit Article
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Article Title *</label>
                                                    <input
                                                        type="text"
                                                        value={articleData.title}
                                                        onChange={(e) => setArticleData('title', e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                                    <input
                                                        type="text"
                                                        value={articleData.category}
                                                        onChange={(e) => setArticleData('category', e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Short Excerpt *</label>
                                                <textarea
                                                    value={articleData.excerpt}
                                                    onChange={(e) => setArticleData('excerpt', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    rows="2"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Content *</label>
                                                <textarea
                                                    value={articleData.content}
                                                    onChange={(e) => setArticleData('content', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300"
                                                    rows="6"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                                                    <input
                                                        type="text"
                                                        value={articleData.read_time}
                                                        onChange={(e) => setArticleData('read_time', e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                                                    <input
                                                        type="number"
                                                        value={articleData.order}
                                                        onChange={(e) => setArticleData('order', parseInt(e.target.value) || 0)}
                                                        className="w-full rounded-lg border-gray-300"
                                                        min="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference URL</label>
                                                    <input
                                                        type="url"
                                                        value={articleData.url}
                                                        onChange={(e) => setArticleData('url', e.target.value)}
                                                        className="w-full rounded-lg border-gray-300"
                                                    />
                                                </div>
                                            </div>

                                            {/* Tips Section */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-sm font-medium text-gray-700">Health Tips</label>
                                                    <button
                                                        type="button"
                                                        onClick={addTip}
                                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 flex items-center gap-1"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        Add Tip
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {articleData.tips.map((tip, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={tip}
                                                                onChange={(e) => updateTip(index, e.target.value)}
                                                                className="flex-1 rounded-lg border-gray-300"
                                                                placeholder={`Tip ${index + 1}...`}
                                                            />
                                                            {articleData.tips.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeTip(index)}
                                                                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                                <input
                                                    type="checkbox"
                                                    checked={articleData.is_active}
                                                    onChange={(e) => setArticleData('is_active', e.target.checked)}
                                                    className="w-5 h-5 rounded border-gray-300 text-purple-600"
                                                />
                                                <label className="text-sm font-medium text-gray-700">
                                                    Active (visible to patients)
                                                </label>
                                            </div>

                                            <div className="flex gap-2 pt-4 border-t">
                                                <button
                                                    type="submit"
                                                    disabled={articleProcessing}
                                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Save Changes
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingArticle(null);
                                                        resetArticle();
                                                    }}
                                                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        // View Mode
                                        <div>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-900">{article.title}</h3>
                                                        {article.is_active ? (
                                                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                                                        ) : (
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Inactive</span>
                                                        )}
                                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">{article.category}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                                        {article.read_time && <span>📖 {article.read_time}</span>}
                                                        <span>Order: {article.order}</span>
                                                        {article.tips && <span>💡 {article.tips.length} tips</span>}
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                                        <p className="text-sm text-gray-700">{article.content}</p>
                                                    </div>
                                                    {article.tips && article.tips.length > 0 && (
                                                        <div className="bg-blue-50 rounded-lg p-4">
                                                            <p className="text-sm font-semibold text-blue-900 mb-2">Health Tips:</p>
                                                            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                                                                {article.tips.map((tip, idx) => (
                                                                    <li key={idx}>{tip}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2 ml-4">
                                                    {article.url && (
                                                        <a
                                                            href={article.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 text-sm whitespace-nowrap"
                                                        >
                                                            View Source
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => startEditArticle(article)}
                                                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteArticle(article.id, article.title)}
                                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                show={showConfirmModal}
                title={confirmTitle}
                message={confirmMessage}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirmModal(false)}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                confirmStyle="danger"
            />

            {/* Toast Notification */}
            <Toast
                show={showToast}
                message={toastMessage}
                type={toastType}
                onClose={() => setShowToast(false)}
            />
        </AuthenticatedLayout>
    );
}
