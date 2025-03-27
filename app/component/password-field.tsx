interface PasswordTextFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
  height?: string;
  name?: string;
  placeholder: string;
}

export default function PasswordTextField({
  onChange,
  height = 'h-11',
  width = 'w-full',
  name,
  placeholder,
}: PasswordTextFieldProps) {
  return (
    <div className={`border-2 border-[#259696] ${width} ${height} rounded-lg`}>
      <input
        name={name}
        type='password'
        placeholder={placeholder}
        className='w-full border-none bg-transparent pt-2 pb-1 pl-3 text-base text-[#7e7e7e] outline-none focus:ring-0'
        onChange={onChange}
      />
    </div>
  );
}
