// app/workspace/layout.tsx
'use client';
import {ReactNode} from 'react';
import Sidebar from "@/components/layout/Sidebar";
import {WorkspaceProvider} from "@/lib/context/WorkspaceContext"; // Sidebar
import {usePathname} from 'next/navigation';
import Navbar from "@/components/layout/Navbar"; // นำเข้า usePathname

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export default function WorkspaceLayout({children}: WorkspaceLayoutProps) {
  const pathname = usePathname(); // ใช้เพื่อดู path ปัจจุบัน

  // ตรวจสอบว่าเป็นหน้า WorkspaceDetail หรือไม่
  const isWorkspaceDetail = pathname.includes("/workspace/");

  return (
    <div>
      <Navbar />
      <WorkspaceProvider>
        {/* ถ้าไม่ใช่หน้า WorkspaceDetail ให้แสดง Sidebar */}
        {!isWorkspaceDetail ? (
          <Sidebar>{children}</Sidebar>
        ) : (
          <div className="flex-1">{children}</div>
        )}
      </WorkspaceProvider>
    </div>
  );
}
