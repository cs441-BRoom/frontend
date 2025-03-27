import React from 'react';

interface GradientButtonProps {
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  width?: string;
  height?: string;
  text: string;
  disabled?: boolean;
}

export default function GradientButton({
  onClick,
  height = 'h-10',
  width = 'w-full',
  disabled,
  text,
}: GradientButtonProps) {
  return (
    <div
      className={`${width} ${height} flex cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-[#2596be] via-[#1c9e56] to-[#3fa191]`}
      onClick={!disabled ? onClick : undefined}
    >
      <span className='font-thin text-white'>{text}</span>
    </div>
  );
}
