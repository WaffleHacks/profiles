import React, { useEffect, useState } from 'react';

interface Props {
  name: string;
  label: string;
  value: string;
  onSave?: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
}

const UpdatableField = ({
  name,
  label,
  value: initialValue,
  onSave = () => {},
  autoComplete,
  placeholder,
}: Props): JSX.Element => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [value, setValue] = useState(initialValue);

  // If the passed value changes, update it
  useEffect(() => setValue(initialValue), [initialValue]);

  const onToggleUpdate = () => {
    if (isUpdating) onSave(value);
    setIsUpdating(!isUpdating);
  };

  const onCancel = () => {
    setValue(initialValue);
    setIsUpdating(false);
  };

  return (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        <span className="flex-grow">
          {!isUpdating && value}
          {isUpdating && (
            <input
              type="text"
              name={name}
              className="text-gray-800 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-200 disabled:text-gray-600"
              value={value}
              required
              autoComplete={autoComplete}
              placeholder={placeholder}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </span>
        <span className="ml-4 flex-shrink-0">
          {isUpdating && (
            <>
              <button
                type="button"
                className="mr-3 bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={onCancel}
              >
                Cancel
              </button>
              <span className="text-gray-500 font-bold mr-3" aria-hidden="true">
                |
              </span>
            </>
          )}
          <button
            type="button"
            onClick={onToggleUpdate}
            className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isUpdating ? 'Save' : 'Update'}
          </button>
        </span>
      </dd>
    </div>
  );
};

export default UpdatableField;
