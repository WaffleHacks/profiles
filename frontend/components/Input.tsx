import React from 'react';

interface Props {
  name: string;
  label: string;
  autoComplete?: string;
  type?: string;
  help?: string;
  placeholder?: string;
  disabled?: boolean;
  value: string;
  onChange?: (v: string) => void;
}

const Input = ({
  name,
  label,
  autoComplete,
  type = 'text',
  help,
  placeholder,
  disabled,
  value,
  onChange = () => {},
}: Props): JSX.Element => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        type={type}
        name={name}
        id={name}
        className="text-gray-800 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-200 disabled:text-gray-600"
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-describedby={help ? `${name}-description` : undefined}
        disabled={disabled}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
    {help && (
      <p className="mt-2 text-sm text-gray-500" id={`${name}-description`}>
        {help}
      </p>
    )}
  </div>
);

export default Input;
