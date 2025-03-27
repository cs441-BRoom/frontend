import React from 'react';
import { Settings, User } from 'lucide-react';

interface NavbarProps {
  username?: string;
}

export default function Navbar({ username }: NavbarProps) {
  return (
    <nav className='flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm'>
      <div className='text-2xl font-bold text-teal-500'>BRoom</div>
      <div className='flex items-center space-x-4'>
        <button className='rounded-full p-2 hover:bg-gray-100'>
          <Settings size={24} className='text-gray-600' />
        </button>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-300'>
          <User size={20} className='text-gray-600' />
        </div>
      </div>
    </nav>
  );
}
