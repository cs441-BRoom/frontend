'use client';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { getNewsByWorkspaceId, likeNews, unlikeNews, createNewsWithFiles } from '@/lib/apis/api';
import { News } from '@/types/news';
import NewsCard from '@/components/NewsCard';
import { Image, XIcon } from 'lucide-react';
import GradientButton from '@/components/gradeint-button';
import Modal from '@/components/modal';

interface NewsfeedPageProps {
  params: Promise<{ workspace_id: string }>;
}

export default function NewsFeedPage({ params }: NewsfeedPageProps) {
  const unwrappedParams = use(params);
  const workspaceId = Number(unwrappedParams.workspace_id);
  const [news, setNews] = useState<News[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const loadNews = async () => {
    try {
      const data = await getNewsByWorkspaceId(workspaceId);
      // Filter out invalid items (undefined, null)
      const validNews = data.filter((item) => item !== undefined && item !== null);
      setNews(validNews); // Set only valid news items
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    loadNews();
  }, [workspaceId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      // Limit to maximum 3 images total
      const totalFiles = files.length + selectedFiles.length;
      if (totalFiles > 3) {
        alert('You can only upload up to 3 images.');
        return;
      }
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setFiles((prev) => [...prev, ...selectedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (!title || !description) {
      alert('Title and Description are required!');
      return;
    }

    try {
      setIsUploading(true);

      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('workspace_id', workspaceId.toString());
      formData.append('title', title);
      formData.append('content', description);

      // Append each file to the FormData
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      // Send request to create news with files
      await createNewsWithFiles(formData);

      // Clear form
      setTitle('');
      setDescription('');
      setFiles([]);

      // Revoke all object URLs to avoid memory leaks
      previews.forEach(URL.revokeObjectURL);
      setPreviews([]);

      // Close modal
      setIsModalOpen(false);

      // Reload all news to get the fresh data including images
      await loadNews();
    } catch (error) {
      console.error('Error creating news:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleLike = async (news_id: number) => {
    setNews((prevNews) =>
      prevNews.map((item) =>
        item.news_id === news_id
          ? {
              ...item,
              is_liked_by_user: true,
              like_count: String(Number(item.like_count || 0) + 1),
            }
          : item
      )
    );
    try {
      await likeNews(news_id);
    } catch (error) {
      console.error('Error liking news:', error);
      setNews((prevNews) =>
        prevNews.map((item) =>
          item.news_id === news_id
            ? {
                ...item,
                is_liked_by_user: false,
                like_count: String(Math.max(Number(item.like_count || 1) - 1, 0)),
              }
            : item
        )
      );
    }
  };

  const handleUnlike = async (news_id: number) => {
    setNews((prevNews) =>
      prevNews.map((item) =>
        item.news_id === news_id
          ? {
              ...item,
              is_liked_by_user: false,
              like_count: String(Math.max(Number(item.like_count || 1) - 1, 0)),
            }
          : item
      )
    );
    try {
      await unlikeNews(news_id);
    } catch (error) {
      console.error('Error unliking news:', error);
      setNews((prevNews) =>
        prevNews.map((item) =>
          item.news_id === news_id
            ? {
                ...item,
                is_liked_by_user: true,
                like_count: String(Number(item.like_count || 0) + 1),
              }
            : item
        )
      );
    }
  };

  const closeModal = () => {
    setTitle('');
    setDescription('');

    // Revoke all object URLs to avoid memory leaks
    previews.forEach(URL.revokeObjectURL);
    setFiles([]);
    setPreviews([]);

    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex flex-row justify-end">
            <GradientButton text="Post" width="w-40" onClick={openModal} />
          </div>
          <div className="flex flex-col gap-6">
            {news && news.length > 0 ? (
              news.map((item) => {
                if (!item) {
                  console.error('Invalid news item:', item);
                  return null;
                }
                return (
                  <NewsCard
                    key={item.news_id}
                    news={item}
                    onClick={(news_id) => router.push(`/workspace/${workspaceId}/newsfeed/${news_id}`)}
                    onLikeClick={() =>
                      item.is_liked_by_user ? handleUnlike(item.news_id) : handleLike(item.news_id)
                    }
                  />
                );
              })
            ) : (
              <p>No news available.</p>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex w-full items-center justify-between text-gray-800">
          <h2 className="flex-grow text-center text-2xl text-gray-800">Create Post</h2>
        </div>
        <input
          type="text"
          placeholder="Title"
          className="mb-2 w-full p-2 text-gray-800 border border-gray-300 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="mb-4 h-32 w-full resize-none p-2 text-gray-800 border border-gray-300 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-1 right-1 rounded-full bg-gray-700 p-1 text-xs text-white"
              >
                <XIcon size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex cursor-pointer flex-row gap-2 text-gray-600 items-center">
          <Image size={20} />
          <label htmlFor="file-upload" className={`cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
            Upload your image
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-gray-800">{files.length}/3</p>
        </div>
        <div className="mt-4">
          <GradientButton
            text={isUploading ? "Posting..." : "Post"}
            onClick={handleUpload}
            disabled={isUploading}
          />
        </div>
      </Modal>
    </div>
  );
}