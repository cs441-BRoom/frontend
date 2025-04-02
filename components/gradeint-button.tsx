import React from 'react';

interface GradientButtonProps {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  width?: string;
  height?: string;
  type?: 'button' | 'submit' | 'reset';  // รองรับ type ของปุ่ม
  text: string;
  disabled?: boolean;
}

export default function GradientButton({
                                         onClick,
                                         height = 'h-10',
                                         width = 'w-full',
                                         type = 'button',  // ค่าเริ่มต้นเป็น 'button'
                                         disabled,
                                         text,
                                       }: GradientButtonProps) {
  return (
    <button
      type={type}  // ใช้ type ที่ระบุใน props
      className={`${width} ${height} flex cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-[#2596be] via-[#1c9e56] to-[#3fa191]`}
      onClick={onClick}  // การจัดการ click ตามประเภทปุ่ม
      disabled={disabled}  // ปิดการใช้งานปุ่มถ้า disabled
    >
      <span className='font-thin text-white'>{text}</span>
    </button>
  );
}
