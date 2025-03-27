'use client';
import { Heart} from 'lucide-react';
import React from 'react';

interface NewsProps {
  id: number;
  username: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
  onClick: (newsId: number) => void;
  onLikeClick: (newsId: number) => void;
}

export default function NewsComponent({
  id,
  username,
  date,
  content,
  likes,
  comments,
  liked,
  onClick,
  onLikeClick,
}: NewsProps) {
  return (
    <div
      className='mx-auto w-[50%] rounded-lg bg-white p-4 shadow-md'
      onClick={() => onClick(id)}
    >
      <div className='mb-3 flex items-center'>
        <div className='mr-3 h-8 w-8 rounded-full bg-gray-300'></div>
        <div className='flex-grow'>
          <div className='text-sm font-medium text-gray-800'>{username}</div>
          <div className='text-xs text-gray-500'>{date}</div>
        </div>
      </div>

      <p className='mb-3 text-sm text-gray-700'>{content}</p>

      <hr className='my-2' />
      <div className='mt-3 flex items-center justify-between text-sm text-gray-500'>
        <div className='flex items-center'>
          <span className='mr-2'>
            <span className='mr-2'>
              <div className='flex flex-row gap-2'>
                <div
                  className='cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation();
                    onLikeClick(id);
                  }}
                >
                  {liked && <Heart className='text-sm text-red-600' />}
                  {!liked && <Heart />}
                </div>
                <span className='mt-1'>{likes}</span>
              </div>
            </span>
          </span>
        </div>
        <div>
          <span>{comments} Comments</span>
        </div>
      </div>
    </div>
  );
}
