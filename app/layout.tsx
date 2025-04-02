'use client';

import {ReactNode} from 'react';
import {AuthProvider, useAuth} from '@/lib/context/AuthContext';
import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

interface RootLayoutProps {
  children: ReactNode;
}

// app/layout.tsx
export default function RootLayout({children}: RootLayoutProps) {
  const {loading} = useAuth();

  if (!loading) {
    return (
      <html lang="en">
      <body>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex justify-center items-center h-screen bg-white">
          <div className="animate-spin rounded-full border-4 border-t-4 border-emerald-600 w-16 h-16"></div>
        </div>
      </div>
      </body>
      </html>
    );
  }

  return (
    <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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

