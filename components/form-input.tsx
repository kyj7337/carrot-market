interface FormInputProps {
  type: string;
  placeholder: string;
  name: string;
  required: boolean;
  errors?: string[];
}

export default function FormInput(props: FormInputProps) {
  const { name, type, placeholder, required, errors } = props;
  return (
    <div className='flex flex-col gap-2'>
      <input
        name={name}
        className='bg-transparent rounded-md w-full h-10 ring-1 ring-neutral-200 focus:outline-none focus:ring-4 transition focus:ring-orange-500 border-none placeholder:text-neutral-400'
        type={type}
        placeholder={placeholder}
        required={required}
      />
      {errors?.map((error, idx) => (
        <span key={idx} className='text-red-400 font-medium  '>
          {error}
        </span>
      ))}
    </div>
  );
}
