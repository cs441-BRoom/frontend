'use client';
import React from 'react';
import { LayoutGrid, BookText, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

interface WorkspaceSideBarProps {
  workspaceId?: string;
}

export default function NewsfeedPage({ workspaceId }: WorkspaceSideBarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: LayoutGrid,
      label: 'Newsfeed',
      href: `/workspace/${workspaceId}/news-feed`,
    },
    {
      icon: LayoutGrid,
      label: 'Task',
      href: '/main/team',
    },
  ];
  return (
    <div className='h-full w-64 border-r bg-white px-4 py-6'>
      <Link
        href='/home'
        className='flex cursor-pointer items-center gap-2 p-3 text-gray-800'
      >
        <MoveLeft size={20} />
        <h2 className='text-lg font-semibold'>Back to home</h2>
      </Link>

      <hr />
      <h2 className='mt-5 mb-3 text-xl font-semibold text-gray-800'>
        {workspaceId}
      </h2>
      <hr />
      <nav>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`mb-2 flex items-center rounded-lg p-3 transition-colors duration-200 ${
              pathname === item.href
                ? 'bg-teal-50 text-teal-600'
                : 'text-gray-600 hover:bg-gray-100'
            } `}
          >
            <item.icon size={20} className='mr-3' />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
