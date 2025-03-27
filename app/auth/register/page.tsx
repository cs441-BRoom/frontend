'use client';
import GradientButton from '@/app/component/gradeint-button';
import PasswordTextField from '@/app/component/password-field';
import TextField from '@/app/component/text-field';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastname] = useState('');
  const [confirmPassword, setComfirmPassword] = useState('');

  const router = useRouter();

  const handleRegister = () => {
    console.log(username + ' ' + password);
    router.push('/auth/login');
  };

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastname(event.target.value);
  };

  const handleConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setComfirmPassword(event.target.value);
  };

  return (
    <div className='flex h-64 min-h-screen w-full items-center justify-center bg-gradient-to-r from-[#2596be] via-[#1c9e56] to-[#1c9e56]'>
      <div className='flex h-[72%] w-full max-w-md flex-col gap-6 rounded-xl bg-white p-8 shadow-lg'>
        <p className='mb-5 text-center text-6xl font-normal text-[#363636]'>
          BRoom
        </p>
        <p className='mb-5 text-center text-2xl font-normal text-[#363636]'>
          Register
        </p>
        <hr className='mb-4' />
        <TextField placeholder='First name' onChange={handleFirstName} />
        <TextField placeholder='Last name' onChange={handleLastName} />
        <TextField placeholder='Username' onChange={handleUsername} />
        <PasswordTextField placeholder='Password' onChange={handlePassword} />
        <PasswordTextField
          placeholder='Confirm Password'
          onChange={handleConfirmPassword}
        />
        <GradientButton text='Register' onClick={handleRegister} />
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
