import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface FloatingLabelInputProps {
  id: string;
  label: string;
  name: `contact.${string}`;
  register: UseFormRegister<any>;
  placeholder: string;
  errors: any;
  errorKey: string;
  t: (key: string) => string;
  type?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  label,
  name,
  register,
  placeholder,
  errors,
  errorKey,
  t,
  type = 'text',
}) => {
  const fieldError = errors?.contact?.[name.split('.')[1]]?.message;

  return (
    <div className="mb-4 relative">
      <input
        {...register(name)}
        id={id}
        type={type}
        placeholder={placeholder}
        aria-required="true"
        aria-describedby={`${id}-desc`}
        className="peer w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#333]"
      />
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-900 absolute left-[2%] top-[-22%] z-10 bg-white px-2 opacity-0 peer-focus:opacity-100 transition-opacity duration-200"
      >
        {label}
      </label>
      {fieldError && <p className="text-red-600">{t(errorKey)}</p>}
    </div>
  );
};


interface FloatingLabelInputBookingProps {
  id: string;
  label: string;
  name: string; // e.g. 'booking.companyname'
  register: UseFormRegister<any>;
  placeholder: string;
  errors: FieldErrors;
  errorMessage?: string;
  type?: string;
}

const FloatingLabelInputBooking: React.FC<FloatingLabelInputBookingProps> = ({
  id,
  label,
  name,
  register,
  placeholder,
  errors,
  errorMessage,
  type = 'text',
}) => {
  const [parentKey, childKey] = name.split('.');

  const parentError = errors[parentKey as keyof typeof errors];
const fieldError =
  typeof parentError === 'object' && parentError && childKey in parentError
    ? (parentError as Record<string, any>)[childKey]?.message
    : undefined;


  return (
    <div className="mb-4 relative">
      <input
        {...register(name)}
        id={id}
        type={type}
        placeholder={placeholder}
        aria-required="true"
        aria-describedby={`${id}-desc`}
        className="peer w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#333]"
      />
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-900 absolute left-[2%] top-[-22%] z-10 bg-white px-2 opacity-0 peer-focus:opacity-100 transition-opacity duration-200"
      >
        {label}
      </label>
      {fieldError && (
        <p className="text-sm text-red-600 mt-1">{errorMessage ?? fieldError}</p>
      )}
    </div>
  );
};


interface RadioCardGroupProps {
  name: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  ariaRequired: boolean;
}

const RadioCardGroupBooking: React.FC<RadioCardGroupProps> = ({
  name,
  options,
  selected,
  onChange,
  ariaRequired = false,
}) => {
  return (
    <div role="radiogroup" aria-required={ariaRequired}>
      {options.map((option) => (
        <label
          key={option}
          className={`block cursor-pointer border rounded px-4 py-2 mb-2 ${
            selected === option ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={selected === option}
            onChange={() => onChange(option)}
            className="hidden"
          />
          <span className="text-sm font-medium">{option}</span>
        </label>
      ))}
    </div>
  );
};



export {FloatingLabelInput,FloatingLabelInputBooking,RadioCardGroupBooking};
