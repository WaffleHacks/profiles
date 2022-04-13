import { RefreshIcon } from '@heroicons/react/outline';
import React from 'react';

const Loading = (): JSX.Element => (
  <div className="h-screen flex">
    <div className="m-auto">
      <RefreshIcon className="w-16 h-16 rounded-full animate-spin" />
    </div>
  </div>
);

export default Loading;
