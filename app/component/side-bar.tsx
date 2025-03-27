'use client';
import React from 'react';
import { LayoutGrid, BookText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarCustom() {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: LayoutGrid,
      label: 'Workspace',
      href: '/home',
    },
    {
      icon: LayoutGrid,
      label: 'My Workspace',
      href: '/my-workspace',
    },
  ];
  return (
    <div className='h-full w-64 border-r bg-white px-4 py-6'>
      <h2 className='mb-6 text-xl font-semibold text-gray-800'>Menu</h2>
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
