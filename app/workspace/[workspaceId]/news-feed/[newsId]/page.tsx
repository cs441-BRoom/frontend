'use client';
import React, { use, useEffect, useState } from 'react';
import Navbar from '@/app/component/navbar';
import WorkspaceSideBar from '@/app/component/workspace-side-bar';
import GradientButton from '@/app/component/gradeint-button';
import { Heart } from 'lucide-react';
import CommentCard from '@/app/component/comment-card';
import TextField from '@/app/component/text-field';
import { useSearchParams } from 'next/navigation';
import axiosInstance from '@/apis/axios';
import { GetCommentResponse } from '@/types/responses/comment';
interface PostDetailPageProps {
  params: Promise<{ workspaceId: number; newsId: number }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const searchParams = useSearchParams();



  const newsId = searchParams.get('news_id');
  const title = searchParams.get('title');
  const content = searchParams.get('content');
  const commentCount = searchParams.get('comment_count');
  const likeCount = searchParams.get('like_count');
  const isLikedByUser = searchParams.get('is_liked_by_user');
  const createdBy = searchParams.get('created_by');
  const createdAt = searchParams.get('created_at');

  const [postId, setPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<GetCommentResponse['comment'][]>([]); // Store comments
  const [news, setNews] = useState({
    postId: title || 'Untitled',
    username: createdBy || 'Unknown User',
    date: createdAt || 'Unknown Date',
    content: content || 'No content available.',
    likes: parseInt(likeCount || '0'),
    commentsCount: parseInt(commentCount || '0'),
    images: [
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/350',
      'https://via.placeholder.com/400',
    ],
    liked: isLikedByUser === 'true',
  });

  // Fetch comments for a post
  const fetchComments = async (newsId: number | null) => {
    if (!newsId) return;

    try {
      const response = await axiosInstance.get<GetCommentResponse>(`/news/${newsId}/comments`);
      setComments(response.data.comment); // Set fetched comments
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Handle adding new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in!');
      return;
    }

    const commentData = {
      news_id: postId!,
      content: newComment,
    };

    try {
      await axiosInstance.post('/comments', commentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optionally, refresh the comment list after posting
      fetchComments(newsId);

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  useEffect(() => {
    if (newsId) {
      setPostId(parseInt(newsId));

      // Fetch comments when newsId is available
      fetchComments(newsId);
    }
  }, [newsId]);

  return (
    <div className="flex h-screen">
      <WorkspaceSideBar id={postId} />
      <div className="flex-1 bg-gray-50">
        <Navbar />
        <div className="p-6">
          <div className="flex-column flex">
            <div className="w-full justify-end">
              <div className="mb-3 flex items-center">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                <div className="flex-grow">
                  <div className="text-lg font-medium text-gray-800">{title}</div>
                  <div className="text-1xl text-gray-500">{news.date}</div>
                </div>
              </div>

              <p className="mb-3 text-lg text-gray-700">{news.content}</p>
              {news.images.length > 0 && (
                <div className="my-3 grid grid-cols-3 gap-2">
                  {news.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post Image ${index}`}
                      className="h-40 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              <hr className="my-2" />
              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="mr-2">
                    <div className="cursor-pointer">
                      {news.liked ? (
                        <Heart className="text-red-600" fill="red" />
                      ) : (
                        <Heart />
                      )}
                    </div>
                  </span>
                  <span>{news.likes}</span>
                </div>
                <div>
                  <span>{news.commentsCount} Comments</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-3" />
          <div className="max-h-[400px] min-h-[400px] overflow-y-auto border border-gray-300 p-3">
            {comments.map((comment, index) => (
              <CommentCard
                key={index}
                postId={comment.news_id}
                username={comment.created_by.toString()}
                date={comment.created_at}
                text={comment.content}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-row gap-1.5">
          <TextField
            placeholder="Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <GradientButton text="Send" width="w-40" onClick={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
