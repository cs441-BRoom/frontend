interface TextFieldProps {
  onChange?: () => () => void;
  width?: string;
  height?: string;
  value?: string;
  placeholder: string;
}

export default function TextField({
  onChange,
  height = 'h-11',
  width = 'w-full',
  value,
  placeholder,
}: TextFieldProps) {
  return (
    <div className={`border-2 border-[#259696] ${width} ${height} rounded-lg`}>
      <input
        type='text'
        value={value}
        placeholder={placeholder}
        className='w-full border-none bg-transparent pt-2 pb-1 pl-3 text-base text-[#7e7e7e] outline-none focus:ring-0'
        onChange={onChange}
      />
    </div>
  );
}
