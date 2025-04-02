'use client';

import { BookText, LayoutGrid } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import GradientButton from '@/components/gradeint-button';
import { useState, useEffect } from 'react';
import { Workspace } from '@/types/workspace';
import { fetchWorkspaceById } from '@/lib/apis/api'; // Import ฟังก์ชัน API

export default function WorkspaceSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspace(); // ใช้ context

  // ดึง workspace_id จาก URL เช่น /workspace/123/newsfeed → workspace_id = 123
  const workspaceId = pathname.split('/')[2]; // ดึงค่าจาก segment ที่ 2
  const [isLoading, setIsLoading] = useState(true); // ✅ เพิ่ม state เช็คการโหลดข้อมูล
  useEffect(() => {
    if (!selectedWorkspace) {
      fetchWorkspaceById(Number(workspaceId))
        .then((workspace: Workspace) => {
          setSelectedWorkspace(workspace);
          setIsLoading(false); // ✅ หยุดโหลดเมื่อได้ workspace
        })
        .catch(() => {
          setIsLoading(false);
          router.replace('/workspace'); // ✅ Redirect เฉพาะถ้าโหลดไม่สำเร็จ
        });
    } else {
      setIsLoading(false); // ✅ หยุดโหลดถ้ามี workspace แล้ว
    }
  }, [workspaceId, selectedWorkspace, setSelectedWorkspace, router]);


  const [activeItem, setActiveItem] = useState<string>('newsfeed');

  useEffect(() => {
    const active = searchParams.get('section') || 'newsfeed';
    setActiveItem(active);
  }, [searchParams]);

  const handleGoBack = () => {
    router.push('/workspace');
  };

  const handleNavigation = (item: { id: string; href: string }) => {
    setActiveItem(item.id);
    router.push(`${item.href}?section=${item.id}`);
  };

  const menuItems = [
    {
      id: 'newsfeed',
      icon: LayoutGrid,
      label: 'NewsFeed',
      href: selectedWorkspace ? `/workspace/${selectedWorkspace.workspace_id}/newsfeed` : '#',
    },
    {
      icon: BookText,
      id: 'assignments',
      label: 'Assignments',
      href: selectedWorkspace ? `/workspace/${selectedWorkspace.workspace_id}/assignments` : '#',
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-white px-4 py-6">
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

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`mb-2 flex w-full items-center gap-3 rounded-lg p-3 transition-colors duration-200 ${
                activeItem === item.id ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1">{/* Content here */}</div>
    </div>
  );
}
