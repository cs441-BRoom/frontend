import React from 'react';
import { Settings, User } from 'lucide-react';

interface CommentCardProps {
  postId: string;
  username: string;
  date: string;
  text: string;
}

export default function CommentCard({
  postId,
  username,
  date,
  text,
}: CommentCardProps) {
  return (
    <div className='w-full justify-end'>
      <div className='mb-3 flex items-center'>
        <div className='mr-3 h-8 w-8 rounded-full bg-gray-300'></div>
        <div className='flex-grow'>
          <div className='text-sm font-medium text-gray-800'>{username}</div>
          <div className='text-sm text-gray-500'>{date}</div>
        </div>
      </div>

      <p className='mb-3 ml-4 text-sm text-gray-700'>{text}</p>
      <hr className='my-2' />
    </div>
  );
}
