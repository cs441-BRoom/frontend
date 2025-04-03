'use client';

import { BookText, LayoutGrid } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import GradientButton from '@/components/gradeint-button';
import { useState, useEffect } from 'react';
import { Workspace } from '@/types/workspace';
import { fetchWorkspaceById } from '@/lib/apis/api';

export default function WorkspaceSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<string>('newsfeed');

  // Extract workspaceId from URL
  const workspaceId = pathname.split('/')[2];

  useEffect(() => {
    if (!selectedWorkspace) {
      fetchWorkspaceById(Number(workspaceId))
        .then((workspace: Workspace) => {
          setSelectedWorkspace(workspace);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          router.replace('/workspace');
        });
    } else {
      setIsLoading(false);
    }
  }, [workspaceId, selectedWorkspace, setSelectedWorkspace, router]);

  // Determine active item based on current path
  useEffect(() => {
    const pathSegments = pathname.split('/');
    if (pathSegments.length >= 4) {
      const section = pathSegments[3];
      if (section === 'newsfeed' || section === 'assignments') {
        setActiveItem(section);
      } else if (section === 'assignment' && pathSegments.length > 4) {
        // Handle assignment detail pages
        setActiveItem('assignments');
      } else if (section === 'newsfeed' && pathSegments.length > 4) {
        // Handle newsfeed detail pages
        setActiveItem('newsfeed');
      }
    }
  }, [pathname]);

  const handleGoBack = () => {
    router.push('/workspace');
  };

  const handleNavigation = (item: { id: string; href: string }) => {
    setActiveItem(item.id);
    router.push(item.href);
  };

  const menuItems = [
    {
      id: 'newsfeed',
      icon: LayoutGrid,
      label: 'NewsFeed',
      href: selectedWorkspace ? `/workspace/${selectedWorkspace.workspace_id}/newsfeed` : '#',
    },
    {
      id: 'assignments',
      icon: BookText,
      label: 'Assignments',
      href: selectedWorkspace ? `/workspace/${selectedWorkspace.workspace_id}/assignments` : '#',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen w-64 items-center justify-center border-r border-gray-300 bg-white">
        <div className="animate-spin rounded-full border-4 border-t-4 border-emerald-600 w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r border-gray-300 bg-white px-4 py-6">
        {selectedWorkspace && (
          <div>
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedWorkspace.name}
              </h3>
              <GradientButton text="Back" width="w-20" height="h-8" onClick={handleGoBack} />
            </div>
            <p className="mt-2 text-gray-800">Code: {selectedWorkspace.join_code}</p>
          </div>
        )}

        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`mb-2 flex w-full items-center gap-3 rounded-lg p-3 transition-colors duration-200 ${
                activeItem === item.id ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1">{/* Content here */}</div>
    </div>
  );
}
