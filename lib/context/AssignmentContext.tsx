import { Assignment } from '@/types/assignment';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AssingmentContextType {
  selectedAssignment: Assignment | null;
  setSelectedAssignment: (assignment: Assignment) => void;
}

const AssignmentContext = createContext<AssingmentContextType | undefined>(
  undefined
);

export const AssignmentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  return (
    <AssignmentContext.Provider
      value={{ selectedAssignment, setSelectedAssignment }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignment = (): AssingmentContextType => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error('useAssignment must be used within a AssignmentProvider');
  }
  return context;
};
