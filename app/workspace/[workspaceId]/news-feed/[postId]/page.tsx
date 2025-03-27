'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/component/navbar';
import WorkspaceSideBar from '@/app/component/workspace-side-bar';
import GradientButton from '@/app/component/gradeint-button';
import { Heart } from 'lucide-react';
import CommentCard from '@/app/component/comment-card';
import TextField from '@/app/component/text-field';

interface PostDetailPageProps {
  params: Promise<{ workspaceId: string; postId: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const [postId, setPostId] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [post, setPost] = useState({
    postId: '1',
    username: 'JohnDoe',
    date: 'Mar 27, 2025',
    content: 'This is a post about workspace collaboration.',
    likes: 123,
    commentsCount: 12,
    images: [
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/350',
      'https://via.placeholder.com/400',
    ],
    liked: false,
  });

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        postId: postId!,
        username: 'CurrentUser',
        date: new Date().toLocaleDateString(),
        text: newComment,
      };

      setComments((prevComments) => [...prevComments, newCommentObj]);
      setNewComment('');
    }
  };

  const [comments, setComments] = useState([
    {
      postId: '1',
      username: 'JohnDoe',
      date: 'Mar 27, 2025',
      text: 'This is a comment on the post about workspace collaboration.',
    },
    {
      postId: '1',
      username: 'JaneSmith',
      date: 'Mar 26, 2025',
      text: 'I agree with this post. Team collaboration is important!',
    },
  ]);

  const handleNewComment = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleLike = () => {
    setPost((prevPost) => ({
      ...prevPost,
      liked: !prevPost.liked,
      likes: prevPost.liked ? prevPost.likes - 1 : prevPost.likes + 1,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      setPostId(resolvedParams.postId);
      setWorkspaceId(resolvedParams.workspaceId);

      console.log('workspaceId ' + workspaceId);
      console.log('workspaceId ' + postId);
    };

    fetchData();
  }, [params]);

  if (!postId) {
    return <div>Loading...</div>;
  }

  if (!workspaceId) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex h-screen'>
      <WorkspaceSideBar workspaceId={workspaceId} />
      <div className='flex-1 bg-gray-50'>
        <Navbar />
        <div className='p-6'>
          <div className='flex-column flex'>
            <div className='w-full justify-end'>
              <div className='mb-3 flex items-center'>
                <div className='mr-3 h-10 w-10 rounded-full bg-gray-300'></div>
                <div className='flex-grow'>
                  <div className='text-lg font-medium text-gray-800'>
                    {postId}
                  </div>
                  <div className='text-1xl text-gray-500'>{post.date}</div>
                </div>
              </div>

              <p className='mb-3 text-lg text-gray-700'>{post.content}</p>
              {post.images.length > 0 && (
                <div className='my-3 grid grid-cols-3 gap-2'>
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post Image ${index}`}
                      className='h-40 w-full rounded-lg object-cover'
                    />
                  ))}
                </div>
              )}

              <hr className='my-2' />
              <div className='mt-3 flex items-center justify-between text-sm text-gray-500'>
                <div className='flex items-center'>
                  <span className='mr-2'>
                    <div className='cursor-pointer' onClick={handleLike}>
                      {post.liked ? (
                        <Heart className='text-red-600' fill='red' />
                      ) : (
                        <Heart />
                      )}
                    </div>
                  </span>
                  <span>{post.likes}</span>
                </div>
                <div>
                  <span>{post.commentsCount} Comments</span>
                </div>
              </div>
            </div>
          </div>

          <hr className='my-3' />
          <div className='max-h-[400px] min-h-[400px] overflow-y-auto border border-gray-300 p-3'>
            {comments.map((comment, index) => (
              <CommentCard
                key={index}
                postId={comment.postId}
                username={comment.username}
                date={comment.date}
                text={comment.text}
              />
            ))}
          </div>
        </div>
        <div className='flex flex-row gap-1.5'>
          <TextField
            placeholder='Comment'
            value={newComment}
            onChange={handleNewComment}
          />
          <GradientButton text='send' width='w-40' onClick={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
