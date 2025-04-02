'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { News } from '@/types/news';
import { Comment } from '@/types/comment';
import { getNewsById, getCommentsByNewsId, createComment, likeNews, unlikeNews } from '@/lib/apis/api';
import NewsCard from '@/components/NewsCard';
import { Heart, MessageSquare, Send } from 'lucide-react';
import GradientButton from '@/components/gradeint-button';
import TextField from '@/components/text-field';

interface NewsDetailPageProps {
  params: Promise<{ workspace_id: string, news_id: string }>;
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const unwrappedParams = use(params);
  const workspaceId = Number(unwrappedParams.workspace_id);
  const newsId = Number(unwrappedParams.news_id);
  const router = useRouter();

  const [news, setNews] = useState<News | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsFetchingComments(true);
        const [newsData, commentsData] = await Promise.all([
          getNewsById(newsId, workspaceId),
          getCommentsByNewsId(newsId),
        ]);
        setNews(newsData);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
        setIsFetchingComments(false);
      }
    };

    fetchData();
  }, [newsId, workspaceId]);

  // Sort comments by time (oldest first)
  const sortedComments = [...comments].sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Auto-scroll to bottom when new comment is added
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleLike = async () => {
    if (!news) return;

    const originalNews = { ...news };
    try {
      setNews({
        ...news,
        is_liked_by_user: true,
        like_count: String(Number(news.like_count || 0) + 1),
      });
      await likeNews(news.news_id);
    } catch (error) {
      console.error('Error liking news:', error);
      setNews(originalNews);
    }
  };

  const handleUnlike = async () => {
    if (!news) return;

    const originalNews = { ...news };
    try {
      setNews({
        ...news,
        is_liked_by_user: false,
        like_count: String(Math.max(Number(news.like_count || 1) - 1)),
      });
      await unlikeNews(news.news_id);
    } catch (error) {
      console.error('Error unliking news:', error);
      setNews(originalNews);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !news) return;

    try {
      setIsCommenting(true);
      const comment = await createComment(news.news_id, newComment);
      setComments(prev => [...prev, comment]);
      setNewComment('');

      setNews(prev => prev ? {
        ...prev,
        comments_count: String(Number(prev.comments_count || 0) + 1),
      } : null);
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full border-4 border-t-4 border-emerald-600 w-16 h-16"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">News not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:text-blue-700 flex items-center gap-1"
      >
        ← Back to news feed
      </button>

      {/* News Card */}
      <div className="mb-8">
        <NewsCard
          news={news}
          onClick={() => {}}
          onLikeClick={() => news.is_liked_by_user ? handleUnlike() : handleLike()}
          isDetailView={true}
        />
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Comments ({sortedComments.length})</h2>

        {/* Comments List with Scroll */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin mb-6">
          {isFetchingComments ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full border-2 border-t-2 border-emerald-600 w-6 h-6"></div>
            </div>
          ) : sortedComments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No comments yet</p>
          ) : (
            sortedComments.map(comment => (
              <div key={comment.comment_id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">User {comment.created_by}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-800">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit}>
          <div className="flex gap-2">
            <TextField
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isCommenting}
              width="flex-1"
              height="h-12"
            />
            <GradientButton
              type="submit"
              width="w-12"
              height="h-12"
              disabled={!newComment.trim() || isCommenting}
            >
              {isCommenting ? (
                <div className="animate-spin rounded-full border-2 border-t-2 border-white w-5 h-5"></div>
              ) : (
                <Send size={20} className="text-white" />
              )}
            </GradientButton>
          </div>
        </form>
      </div>
    </div>
  );
}