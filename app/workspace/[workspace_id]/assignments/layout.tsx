'use client';
import {ReactNode} from 'react';
import { AssignmentProvider } from '@/lib/context/AssignmentContext';

interface AssignmentLayoutProps {
  children: ReactNode;
}

export default function AssignmentLayout({children}: AssignmentLayoutProps) {

  return (
    <div>

      <AssignmentProvider>
        {children}
      </AssignmentProvider>
    </div>
  );
}
