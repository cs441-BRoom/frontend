'use client';
import GradientButton from '@/app/component/gradeint-button';
import PasswordTextField from '@/app/component/password-field';
import TextField from '@/app/component/text-field';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RegisterRequest } from '@/types/requests/auth';
import axiosInstance from '@/apis/axios';
import { RegisterResponse } from '@/types/responses/auth';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    auth_type: 'local',
    password_confirmation: '',
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // 🎯 Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🎯 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log(formData);

    try {
      const response = await axiosInstance.post<RegisterResponse>(
        '/auth/register',
        formData
      );
      console.log(response.data.message);
      router.push('/auth/login');
    } catch (err: any) {
      console.log(err.response?.data || 'Failed to register.');
      setError(err.response?.data?.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    handleSubmit({
      preventDefault: () => {},
    } as React.FormEvent);
  };

  return (
    <div className='flex h-64 min-h-screen w-full items-center justify-center bg-gradient-to-r from-[#2596be] via-[#1c9e56] to-[#1c9e56]'>
      <div className='flex h-[80%] w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-lg'>
        <p className='mb-5 text-center text-6xl font-normal text-[#363636]'>
          BRoom
        </p>
        <p className='mb-5 text-center text-2xl font-normal text-[#363636]'>
          Register
        </p>
        <hr className='mb-4' />

        {/* ✅ ใช้ handleChange และ name attribute เพื่อลดโค้ดซ้ำซ้อน */}
        <TextField
          name='firstname'
          value={formData.firstname}
          placeholder='First name'
          onChange={handleChange}
        />
        <TextField
          name='lastname'
          value={formData.lastname}
          placeholder='Last name'
          onChange={handleChange}
        />
        <TextField
          name='username'
          value={formData.username}
          placeholder='Username'
          onChange={handleChange}
        />
        <TextField
          name='email'
          value={formData.email}
          type='email'
          placeholder='Email'
          onChange={handleChange}
        />
        <PasswordTextField
          name='password'
          placeholder='Password'
          value={formData.password} // แก้ไขเป็น formData.password
          onChange={handleChange}
        />
        <PasswordTextField
          name='password_confirmation'
          placeholder='Confirm Password'
          value={formData.password_confirmation} // แก้ไขเป็น formData.password_confirmation
          onChange={handleChange}
        />

        {/* 🔥 แสดง error ถ้ามี */}
        {error && <p className='text-center text-red-500'>{error}</p>}

        {/* 🔥 ปิดปุ่มระหว่างโหลด */}
        <GradientButton
          text={loading ? 'Registering...' : 'Register'}
          onClick={handleRegisterClick}
          disabled={loading}
        />
        <a
          href='/auth/login'
          className='cursor-pointer text-center text-lg font-normal text-[#1c9e56]'
        >
          Back to login
        </a>
      </div>
    </div>
  );
}
