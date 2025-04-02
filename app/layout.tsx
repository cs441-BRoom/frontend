'use client';

import {ReactNode} from 'react';
import {AuthProvider, useAuth} from '@/lib/context/AuthContext';
import './globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

// app/layout.tsx
export default function RootLayout({children}: RootLayoutProps) {
  const {loading} = useAuth();

  // ถ้ากำลังโหลดข้อมูลหรือเช็คการล็อกอิน
  if (!loading) {
    return (
      <html lang="en">
      <body>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Loading...</p>
      </div>
      </body>
      </html>
    );
  }


  return (
    <html lang="en">
    <body>
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        <main className="flex-1">{
          children
        }</main>
      </AuthProvider>
    </div>
    </body>
    </html>
  );
}

