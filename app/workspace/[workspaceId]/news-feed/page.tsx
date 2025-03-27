'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/component/navbar';
import WorkspaceSideBar from '@/app/component/workspace-side-bar';
import GradientButton from '@/app/component/gradeint-button';
import NewsComponent from '@/app/component/news';
import { useRouter } from 'next/navigation';
import Modal from '@/app/component/modal';
import { Image, XIcon } from 'lucide-react';

interface NewsfeedPageProps {
  params: Promise<{ id: number }>;
}

export default function NewsfeedPage({ params }: NewsfeedPageProps) {
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [newses, setNewses] = useState([
    {
      id: 1,
      username: 'JohnDoe',
      date: 'Mar 27, 2025',
      content: 'This is a post about workspace collaboration.',
      likes: 120,
      comments: 45,
      liked: true,
    },
    {
      id: 2,
      username: 'JaneSmith',
      date: 'Mar 26, 2025',
      content: 'Here is another post about team productivity.',
      likes: 95,
      comments: 32,
      liked: false,
    },
    {
      id: 3,
      username: 'AliceJohnson',
      date: 'Mar 25, 2025',
      content: 'Excited about the new workspace features!',
      likes: 150,
      comments: 67,
      liked: false,
    },
    {
      id: 4,
      username: 'BobMartin',
      date: 'Mar 24, 2025',
      content:
        'Just finished a big project with the team. Great work, everyone!',
      likes: 80,
      comments: 12,
      liked: false,
    },
  ]);

  const handleLikeClick = (newsId: number) => {
    setNewses((prevPosts) =>
      prevPosts.map((news) =>
        news.id === newsId
          ? {
              ...news,
              liked: !news.liked,
              likes: news.liked ? news.likes - 1 : news.likes + 1,
            }
          : news
      )
    );
  };

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      setWorkspaceId(resolvedParams.id);
      console.log('workspace ' + workspaceId);
    };

    fetchData();
  }, [params]);

  if (!workspaceId) {
    return <div>Loading...</div>;
  }

  const handlePostClick = (newsId: number) => {
    router.push(`/workspace/${workspaceId}/news-feed/${newsId}`);
    console.log(newsId);
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
      <WorkspaceSideBar id={workspaceId} />
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
              {newses.map((news, index) => (
                <NewsComponent
                  key={index}
                  id={news.id}
                  username={news.username}
                  date={news.date}
                  content={news.content}
                  likes={news.likes}
                  comments={news.comments}
                  liked={news.liked}
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
