// app/workspace/[workspace_id]/layout.tsx
'use client'

import { ReactNode } from 'react';
import WorkspaceSidebar from "@/components/layout/WorkspaceSidebar";

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export default function WorkspaceDetailLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <WorkspaceSidebar />

      {/* Content */}
      <div className="flex-1">
        {children} {/* ส่วนของ content ที่จะถูกแสดง */}
      </div>
    </div>
  );
}
