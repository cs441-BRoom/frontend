import { LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // นำเข้าฟังก์ชันนี้

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // ใช้ useSearchParams แทน

  const menuItems = [
    {
      id: 'workspace_joined',
      icon: LayoutGrid,
      label: 'Workspace',
      href: '/workspace',
      isOwner: false,
    },
    {
      id: 'my_workspace',
      icon: LayoutGrid,
      label: 'My Workspace',
      href: '/workspace',
      isOwner: true,
    },
  ];

  const [activeItem, setActiveItem] = useState<string>(menuItems[0].id);

  useEffect(() => {
    // ใช้ searchParams แทน query
    const isOwner = searchParams.get('owner') === 'true'; // เช็คว่า query มี owner=true หรือไม่
    const active = isOwner ? 'my_workspace' : 'workspace_joined'; // กำหนด activeItem
    setActiveItem(active);
  }, [searchParams]); // ฟังการเปลี่ยนแปลงของ searchParams

  const handleNavigation = (item: { id: string; href: string; isOwner: boolean }) => {
    setActiveItem(item.id);
    router.push(`${item.href}?owner=${item.isOwner ? 'true' : 'false'}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-300 bg-white px-4 py-6">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">Menu</h2>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`mb-2 flex w-full items-center gap-3 rounded-lg p-3 transition-colors duration-200 ${
                activeItem === item.id
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
