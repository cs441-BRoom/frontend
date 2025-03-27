'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/component/navbar';
import WorkspaceSideBar from '@/app/component/workspace-side-bar';
import GradientButton from '@/app/component/gradeint-button';
import PostComponent from '@/app/component/post';
import { useRouter } from 'next/navigation';
import Modal from '@/app/component/modal';
import { Image, XIcon } from 'lucide-react';

interface NewsfeedPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default function NewsfeedPage({ params }: NewsfeedPageProps) {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [posts, setPosts] = useState([
    {
      id: 'abc123',
      username: 'JohnDoe',
      date: 'Mar 27, 2025',
      content: 'This is a post about workspace collaboration.',
      likes: 120,
      comments: 45,
      liked: true,
    },
    {
      id: 'abc456',
      username: 'JaneSmith',
      date: 'Mar 26, 2025',
      content: 'Here is another post about team productivity.',
      likes: 95,
      comments: 32,
      liked: false,
    },
    {
      id: '789',
      username: 'AliceJohnson',
      date: 'Mar 25, 2025',
      content: 'Excited about the new workspace features!',
      likes: 150,
      comments: 67,
      liked: false,
    },
    {
      id: 'abc11112',
      username: 'BobMartin',
      date: 'Mar 24, 2025',
      content:
        'Just finished a big project with the team. Great work, everyone!',
      likes: 80,
      comments: 12,
      liked: false,
    },
  ]);

  const handleLikeClick = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      setWorkspaceId(resolvedParams.workspaceId);
      console.log('workspace ' + workspaceId);
    };

    fetchData();
  }, [params]);

  if (!workspaceId) {
    return <div>Loading...</div>;
  }

  const handlePostClick = (postId: string) => {
    router.push(`/workspace/${workspaceId}/news-feed/${postId}`);
    console.log(postId);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      if (selectedFiles.length + images.length > 3) {
        alert('You can only upload up to 3 images.');
        return;
      }

      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setImages((prev) => [...prev, ...selectedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  function closeModal() {
    setIsModalOpen(false);
  }

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      if (selectedFiles.length + files.length > 3) {
        alert('You can only upload up to 3 files.');
        return;
      }

      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  return (
    <div className='flex h-screen'>
      <WorkspaceSideBar workspaceId={workspaceId} />
      <div className='flex-1 bg-gray-50'>
        <Navbar />
        <div className='p-6'>
          <div className='flex flex-row justify-end'>
            <GradientButton
              text='Post'
              width='w-40'
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div className='flex flex-col'>
            <hr className='my-4' />
            <div className='flex flex-col gap-6'>
              {posts.map((post, index) => (
                <PostComponent
                  key={index}
                  id={post.id}
                  username={post.username}
                  date={post.date}
                  content={post.content}
                  likes={post.likes}
                  comments={post.comments}
                  liked={post.liked}
                  onClick={handlePostClick}
                  onLikeClick={handleLikeClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className='flex w-full items-center justify-between text-gray-800'>
          <h2 className='flex-grow text-center text-2xl text-gray-800'>
            Create workspace
          </h2>
        </div>

        <div className='flex h-full w-full flex-col gap-4'>
          <hr className='my-4' />
          <div className='mb-3 flex items-center'>
            <div className='mr-3 h-10 w-10 rounded-full bg-gray-300'></div>
            <div className='flex-grow'>
              <div className='text-lg font-medium text-gray-800'>Username</div>
              <div className='text-1xl text-gray-500'>Mar 27, 2025</div>
            </div>
          </div>
          <hr />
          <textarea
            placeholder='Content ...'
            className='mb-4 h-32 w-full resize-none p-2 text-gray-800'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className='mt-4 grid grid-cols-3 gap-2'>
            {previews.map((preview, index) => (
              <div key={index} className='relative h-24 w-24'>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className='h-full w-full rounded-lg object-cover'
                />
                <button
                  onClick={() => removeImage(index)}
                  className='absolute top-1 right-1 rounded-full p-1 text-xs text-white'
                >
                  <XIcon />
                </button>
              </div>
            ))}
          </div>

          <div className='flex cursor-pointer flex-row gap-2 text-gray-600'>
            <Image />
            <label htmlFor='file-upload' className='cursor-pointer'>
              Upload your image
            </label>
            <input
              id='file-upload'
              type='file'
              className='hidden'
              onChange={handleFileChange}
            />

            <p className='text-gray-800'>{images.length}/3</p>
          </div>
          <GradientButton text='Post' onClick={handleUpload} />
        </div>
      </Modal>
    </div>
  );
}
