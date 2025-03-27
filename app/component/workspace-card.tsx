'use client';
import React from 'react';
import { Users } from 'lucide-react';

interface WorkspaceCardProps {
  id: string;
  title: string;
  date: string;
  description: string;
  numberOfPeople: int;
  onClick: (title: string) => void;
}

export default function WorkspaceCard({
  id,
  title,
  date,
  description,
  numberOfPeople,
  onClick,
}: WorkspaceCardProps) {
  return (
    <div
      className='rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg'
      onClick={() => onClick(id)}
    >
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex flex-col'>
          <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
          <span className='text-sm text-gray-500'>{date}</span>
        </div>

        <button className='text-gray-500 hover:text-gray-700'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
          </svg>
        </button>
      </div>
      <p className='mb-4 h-15 text-gray-600'>{description}</p>
      <div className='flex items-center justify-between'>
        <div className='items-right flex text-gray-500'>
          <Users size={24} className='text-gray-600' />
          <span className='text-right'>{numberOfPeople} members</span>
        </div>
      </div>
    </div>
  );
}
