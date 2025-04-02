'use client';
import React, { use, useEffect, useState } from 'react';
import Navbar from '@/app/component/navbar';
import GradientButton from '@/app/component/gradeint-button';
import NewsComponent from '@/app/component/news';
import { useRouter, useSearchParams } from 'next/navigation';
import Modal from '@/app/component/modal';
import { Image, XIcon } from 'lucide-react';
import { IndexResponse, NewsStoreResponse } from '@/types/responses/news';
import axiosInstance from '@/apis/axios';
import { NewsStoreRequest } from '@/types/requests/news';
import WorkspaceSideBar from '@/app/component/workspace-side-bar';
import { StoreRespond } from '@/types/responses/workspace';

interface NewsfeedPageProps {
  params: Promise<{ workspaceId: number }>;
}

export default function NewsfeedPage({ params }: NewsfeedPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();

  const joinCode = searchParams.get('join_code');
  const titleWorkspace = searchParams.get('name');

  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [news, setNews] = useState<IndexResponse['news']>([]); // Store news items
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const router = useRouter();

  // Fetch news from the API
  const fetchNews = async (workspaceId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await axiosInstance.get<IndexResponse>(`/workspaces/${workspaceId}/news`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNews(response.data.news); // Set the fetched news
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      setWorkspaceId(resolvedParams.workspaceId);
    };

    fetchData();
  }, [params]);

  useEffect(() => {
    if (workspaceId) {
      fetchNews(workspaceId); // Fetch news when workspaceId is set
    }
  }, [workspaceId]);

  if (!workspaceId) {
    return <div>Loading...</div>;
  }

  const handleNewsClick = (news: IndexResponse['news']) => {
    const {
      news_id,
      workspace_id,
      title,
      content,
      comment_count,
      like_count,
      is_liked_by_user,
      created_by,
      created_at,
    } = news;

    // สร้าง query parameters ทั้งหมด
    router.push(`/my-workspace/${workspace_id}/news-feed/${news_id}?news_id=${news_id}&workspace_id=${workspace_id}&title=${title}&content=${content}&comment_count=${comment_count}&like_count=${like_count}&is_liked_by_user=${is_liked_by_user}&created_by=${created_by}&created_at=${created_at}`);
  };

  const handleLikeClick = (newsId: number) => {
    setNews((prevNews) =>
      prevNews.map((newsItem) =>
        newsItem.news_id === newsId
          ? {
            ...newsItem,
            is_liked_by_user: newsItem.is_liked_by_user === '1' ? '0' : '1',
            like_count: newsItem.is_liked_by_user === '1' ? (parseInt(newsItem.like_count) - 1).toString() : (parseInt(newsItem.like_count) + 1).toString(),
          }
          : newsItem,
      ),
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      if (selectedFiles.length + images.length > 3) {
        alert('You can only upload up to 3 images.');
        return;
      }

      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

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

  // Handle the upload of news post
  const handleUpload = async () => {
    if (!content || !title) {
      alert('Title and Content cannot be empty!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in!');
      return;
    }

    const newsData: NewsStoreRequest = {
      workspace_id: workspaceId!,
      title,
      content,
    };

    try {
      const response = await axiosInstance.post<NewsStoreResponse>('/news', newsData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle('');
      setContent('');

      // Add the newly created news to the state
      setNews((prevNews) => [response.data.news, ...prevNews]);
      alert('Post uploaded successfully!');

      setIsModalOpen(false); // Close modal after post is successful

    } catch (error) {
      console.error('Error uploading news:', error);
      alert('Failed to upload the post. Please try again.');
    }
  };

  return (
    <div className="flex h-screen">
      <WorkspaceSideBar workspaceId={workspaceId} invite_code="1234" title={titleWorkspace} />
      <div className="flex-1 bg-gray-50">
        <Navbar />
        <div className="p-6">
          <div className="flex flex-row justify-end">
            <GradientButton
              text="Post"
              width="w-40"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div className="flex flex-col">
            <hr className="my-4" />
            <div className="flex flex-col gap-6">
              {news.map((newsItem, index) => (
                <NewsComponent
                  key={index}
                  id={newsItem.news_id}
                  username={newsItem.created_by.toString()}
                  date={newsItem.created_at}
                  content={newsItem.content}
                  likes={parseInt(newsItem.like_count)}
                  comments={parseInt(newsItem.comments_count)}
                  liked={newsItem.is_liked_by_user === '1'}
                  onClick={() => handleNewsClick(newsItem)}
                  onLikeClick={handleLikeClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex w-full items-center justify-between text-gray-800">
          <h2 className="flex-grow text-center text-2xl text-gray-800">
            Create News Post
          </h2>
        </div>

        <div className="flex h-full w-full flex-col gap-4">
          <hr className="my-4" />
          <input
            type="text"
            placeholder="Title ..."
            className="mb-4 p-2 text-gray-800"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content ..."
            className="mb-4 h-32 w-full resize-none p-2 text-gray-800"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="mt-4 grid grid-cols-3 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative h-24 w-24">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 rounded-full p-1 text-xs text-white"
                >
                  <XIcon />
                </button>
              </div>
            ))}
          </div>

          <div className="flex cursor-pointer flex-row gap-2 text-gray-600">
            <Image />
            <label htmlFor="file-upload" className="cursor-pointer">
              Upload your image
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />

            <p className="text-gray-800">{images.length}/3</p>
          </div>
          <GradientButton text="Post" onClick={handleUpload} />
        </div>
      </Modal>
    </div>
  );
}
