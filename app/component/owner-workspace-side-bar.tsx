'use client';
import React from 'react';
import { LayoutGrid, BookText, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface OwnerWorkspaceSideBarProps {
  workspaceId: number;
  title: string;
  invite_code: string;
}

export default function OwnerWorkspaceSideBar({
  workspaceId,
  title,
  invite_code,
}: OwnerWorkspaceSideBarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: LayoutGrid,
      label: 'Newsfeed',
      href: `/my-workspace/${workspaceId}/news-feed`,
    },
    {
      icon: BookText,
      label: 'Task',
      href: `/my-workspace/${workspaceId}/my-task`,
    },
  ];
  return (
    <div className='h-full w-64 border-r bg-white px-4 py-6'>
      <Link
        href='/workspace'
        className='flex cursor-pointer items-center gap-2 p-3 text-gray-800'
      >
        <MoveLeft size={20} />
        <h2 className='text-lg font-semibold'>Back to home</h2>
      </Link>

      <hr />
      <h2 className='mt-5 mb-3 text-xl font-semibold text-gray-800'>
        {title}
      </h2>
      <h2 className='mt-5 mb-3 text-sm font-semibold text-gray-800'>
        Invide code : {invite_code}
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
