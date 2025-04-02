'use client';

import { Heart } from 'lucide-react';
import React, { useState } from 'react';
import { News } from '@/types/news';
import Modal from '@/components/modal';

interface NewsProps {
  news: News;
  onClick?: (newsId: number) => void;
  onLikeClick: (newsId: number) => void;
  isDetailView?: boolean;
}

export default function NewsCard({ news, onClick, onLikeClick, isDetailView = false }: NewsProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
  return (
    <div
      className={`rounded-lg bg-white p-4 shadow-md ${onClick ? 'cursor-pointer' : ''} ${
        isDetailView ? 'w-full' : 'mx-auto w-[60.8%]'
      }`}
      onClick={() => onClick && onClick(news.news_id)}
    >
      <div className="mb-3 flex items-center">
        <div className="mr-3 h-8 w-8 rounded-full bg-gray-300"></div>
        <div className="flex-grow">
          <div className="text-sm font-medium text-gray-800">Created by {news.created_by}</div>
          <div className="text-xs text-gray-500">{news.created_at}</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800">{news.title}</h3>
      <p className="mb-3 text-sm text-gray-700">{news.content}</p>

      {/* Display images if available - with click handler */}
      {news.files && news.files.length > 0 && (
        <div className="mb-4">
          <div className={`flex overflow-x-auto gap-4 py-2 ${isDetailView ? '' : ''}`}>
            {news.files.map((file, index) => (
              <div
                key={index}
                className={`flex-shrink-0 ${
                  isDetailView ? 'h-72 w-auto' : 'h-40 w-40'
                } cursor-zoom-in`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(`data:${file.mime_type};base64,${file.base64}`);
                }}
              >
                <img
                  src={`data:${file.mime_type};base64,${file.base64}`}
                  alt={`Image ${index + 1}`}
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}


            {/* Image Modal */}
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
        {selectedImage && (
          <div className="p-4 flex justify-center items-center h-full">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        )}
      </Modal>



      <hr className="my-2" />
      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <div
            className="cursor-pointer flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onLikeClick(news.news_id);
            }}
          >
            {news.is_liked_by_user ? (
              <Heart className="text-sm text-red-600" />
            ) : (
              <Heart />
            )}
            <span className="mt-1">{news.like_count}</span>
          </div>
        </div>
        <div>
          <span>{news.comments_count} Comments</span>
        </div>
      </div>
    </div>
  );
}
