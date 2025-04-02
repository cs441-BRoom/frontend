'use client';

import { Heart } from 'lucide-react';
import React from 'react';
import { News } from '@/types/news';

interface NewsProps {
  news: News;
  onClick: (newsId: number) => void;
  onLikeClick: (newsId: number) => void;
}

export default function NewsCard({ news, onClick, onLikeClick }: NewsProps) {
  return (
    <div
      className="mx-auto w-[50%] rounded-lg bg-white p-4 shadow-md"
      onClick={() => onClick(news.news_id)}
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
