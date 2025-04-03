'use client';
import React, { useState } from 'react';
import { Image, LogOut, Settings, User } from 'lucide-react';
import TextField from '@/components/text-field';
import GradientButton from '@/components/gradeint-button';
import Modal from '@/components/modal';
import { useAuthActions } from '@/lib/hooks/useAuth';


export default function Navbar() {
  const { logout } = useAuthActions();

  return (
    <nav className="flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm border border-gray-300">
      <div className="text-2xl font-bold text-teal-500">BRoom</div>
      <div className="flex items-center space-x-4">
        <div
          className="cursor-pointer transform active:scale-95 transition-all hover:bg-gray-200 hover:text-teal-500"
          onClick={logout}
        >
          <LogOut className="text-gray-600" />
        </div>
      </div>
    </nav>
  );
}
