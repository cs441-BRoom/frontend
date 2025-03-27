'use client'
import { useEffect, useState } from 'react';
import LoginPage from './auth/login/page';
import { useRouter } from 'next/navigation';
import HomePage from '@/app/home/page';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/auth/login');
    }
  }, [router]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <HomePage/>;
}
