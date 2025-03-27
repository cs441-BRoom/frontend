'use client';

import GradientButton from '@/app/component/gradeint-button';
import PasswordTextField from '@/app/component/password-field';
import TextField from '@/app/component/text-field';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axiosInstance from '@/apis/axios';
import { LoginResponse } from '@/types/responses/auth';
import { LoginRequest } from '@/types/requests/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  
  const handleLogin = async () => {
    setLoading(true); 
    setError(''); 

    const loginData: LoginRequest = { username, password };

    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', loginData);

      
      console.log(response.data.message);
      console.log(response.data.user);
      console.log(response.data.token);

      
      localStorage.setItem('token', response.data.token);

      
      router.push('/workspace');
    } catch (err: any) {
      
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false); 
    }
  };

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className='flex h-64 min-h-screen w-full items-center justify-center bg-gradient-to-r from-[#2596be] via-[#1c9e56] to-[#1c9e56]'>
      <div className='flex h-[54%] w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-lg'>
        <p className='mb-5 text-center text-6xl font-normal text-[#363636]'>
          BRoom
        </p>
        <p className='mb-5 text-center text-2xl font-normal text-[#363636]'>
          Welcome to BRoom
        </p>
        <hr className='mb-4' />
        {error && <p className="text-red-500 text-center">{error}</p>} {/* แสดงข้อผิดพลาด */}
        <TextField placeholder='Username' onChange={handleUsername}></TextField>
        <PasswordTextField
          placeholder='Password'
          onChange={handlePassword}
        ></PasswordTextField>

        <GradientButton
          text={loading ? 'Signing in...' : 'Sign in'} 
          onClick={handleLogin}
          disabled={loading} 
        ></GradientButton>

        <div className='flex flex-row gap-4'>
          <p className='mb-5 text-center text-lg font-normal text-[#363636]'>
            You don’t have an account ?
          </p>
          <a
            href='/auth/register'
            className='ext-lg cursor-pointer text-center font-normal text-[#1c9e56]'
          >
            Create account.
          </a>
        </div>
      </div>
    </div>
  );
}