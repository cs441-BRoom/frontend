// lib/context/WorkspaceContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import {Workspace} from "@/types/workspace";

interface WorkspaceContextType {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// สร้าง provider เพื่อให้ component อื่นสามารถใช้ได้
export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  return (
    <WorkspaceContext.Provider value={{ selectedWorkspace, setSelectedWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

// Custom hook ใช้เพื่อดึงข้อมูลจาก Context
export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
