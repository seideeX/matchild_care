import PatientLayout from '@/Layouts/PatientLayout';
import { Head } from '@inertiajs/react';
import { Heart, BookOpen, Baby, Play, ExternalLink, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard({ maternalRecord }) {
    const [expandedArticle, setExpandedArticle] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoTutorials, setVideoTutorials] = useState([]);
    const [healthArticles, setHealthArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch educational content from database
    useEffect(() => {
        fetch(route('api.educational-content'))
            .then(res => res.json())
            .then(data => {
                // Map database videos to component format
                const videos = data.videos.map(v => ({
                    title: v.title,
                    description: v.description,
                    youtubeId: v.youtube_id,
                    duration: v.duration,
                    category: v.category
                }));
                
                // Map database articles to component format
                const articles = data.articles.map(a => ({
                    title: a.title,
                    excerpt: a.excerpt,
                    category: a.category,
                    readTime: a.read_time,
                    content: a.content,
                    url: a.url,
                    tips: a.tips || []
                }));
                
                setVideoTutorials(videos);
                setHealthArticles(articles);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching educational content:', error);
                setLoading(false);
            });
    }, []);

    const toggleArticle = (index) => {
        setExpandedArticle(expandedArticle === index ? null : index);
    };

    const openVideo = (video) => {
        setSelectedVideo(video);
    };

    const closeVideo = () => {
        setSelectedVideo(null);
    };

    return (
        <PatientLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Home
                </h2>
            }
        >
            <Head title="Patient Home" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-8">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <Heart className="h-10 w-10 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-3xl font-bold text-white mb-2">
                                        Welcome to Your Pregnancy Journey
                                    </h3>
                                    <p className="text-indigo-100 text-base">
                                        Learn, grow, and stay healthy with our educational resources and expert tips
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Video Tutorials Section */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Play className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">
                                        Video Tutorials & Guides
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                            <p className="text-gray-600">Loading videos...</p>
                                        </div>
                                    </div>
                                ) : videoTutorials.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-600">No videos available yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {videoTutorials.map((video, index) => (
                                        <div key={index} className="group bg-white rounded-xl overflow-hidden border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all">
                                            <button
                                                onClick={() => openVideo(video)}
                                                className="block w-full text-left"
                                            >
                                                {/* Video Thumbnail */}
                                                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                                                    <img 
                                                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/0.jpg`;
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                        <div className="bg-indigo-600 rounded-full p-3 group-hover:scale-110 group-hover:bg-indigo-700 transition-all shadow-lg">
                                                            <Play className="h-6 w-6 text-white fill-white" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                                                        {video.duration}
                                                    </div>
                                                    <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
                                                        {video.category}
                                                    </div>
                                                </div>
                                                
                                                {/* Video Info */}
                                                <div className="p-4 bg-gradient-to-b from-white to-indigo-50/30">
                                                    <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                        {video.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                                                        {video.description}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center text-indigo-600 text-xs font-semibold">
                                                            <span>Play Video</span>
                                                            <Play className="h-3 w-3 ml-1 fill-current" />
                                                        </div>
                                                        <a
                                                            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center text-gray-500 hover:text-indigo-600 text-xs font-medium transition-colors"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Health Articles Section */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <BookOpen className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">
                                            Helpful Articles & Resources
                                        </h3>
                                        <p className="text-xs text-indigo-100 mt-0.5">
                                            Click on any article to read more
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                            <p className="text-gray-600">Loading articles...</p>
                                        </div>
                                    </div>
                                ) : healthArticles.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-600">No articles available yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {healthArticles.map((article, index) => {
                                        const isExpanded = expandedArticle === index;
                                        return (
                                            <div key={index} className="border-2 border-indigo-100 rounded-xl overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all">
                                                <button
                                                    onClick={() => toggleArticle(index)}
                                                    className="w-full p-5 flex items-center justify-between hover:bg-indigo-50/50 transition-colors text-left"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-xs font-semibold text-white bg-indigo-600 px-3 py-1 rounded-full shadow-sm">
                                                                {article.category}
                                                            </span>
                                                            <span className="text-xs text-gray-500 font-medium">{article.readTime}</span>
                                                        </div>
                                                        <h4 className="font-bold text-gray-900 text-base mb-1">
                                                            {article.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            {article.excerpt}
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0 ml-4">
                                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                                            {isExpanded ? (
                                                                <ChevronUp className="h-5 w-5 text-indigo-600" />
                                                            ) : (
                                                                <ChevronDown className="h-5 w-5 text-indigo-600" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>

                                                {isExpanded && (
                                                    <div className="px-5 pb-5 border-t-2 border-indigo-100 bg-gradient-to-b from-indigo-50/30 to-white">
                                                        <div className="pt-5">
                                                            <p className="text-sm text-gray-700 mb-5 leading-relaxed">
                                                                {article.content}
                                                            </p>
                                                            
                                                            <div className="bg-white rounded-lg p-5 border-2 border-indigo-100 shadow-sm mb-4">
                                                                <h5 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                                                                    <div className="p-1 bg-indigo-100 rounded">
                                                                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                                                                    </div>
                                                                    Key Tips & Recommendations
                                                                </h5>
                                                                <ul className="space-y-2">
                                                                    {article.tips.map((tip, tipIndex) => (
                                                                        <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                                                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                                                            <span>{tip}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            {/* View Full Article Button */}
                                                            <a
                                                                href={article.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                                                            >
                                                                <BookOpen className="h-4 w-4" />
                                                                <span>View Full Article</span>
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeVideo}>
                    <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedVideo.title}</h3>
                                <p className="text-indigo-100 text-sm mt-1">{selectedVideo.description}</p>
                            </div>
                            <button
                                onClick={closeVideo}
                                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Video Player */}
                        <div className="aspect-video bg-black">
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                                    {selectedVideo.category}
                                </span>
                                <span className="text-sm text-gray-600">{selectedVideo.duration}</span>
                            </div>
                            <a
                                href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                            >
                                <span>Open in YouTube</span>
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </PatientLayout>
    );
}
