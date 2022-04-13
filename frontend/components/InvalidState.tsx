import { XIcon } from '@heroicons/react/outline';
import React from 'react';

const InvalidState = (): JSX.Element => (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Uh oh!</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Something when wrong while you were logging in. Please go back and try again.
                <br />
                <br />
                If the problem persists, please contact{' '}
                <a href="mailto:technology@wafflehacks.org" className="text-blue-500 hover:text-blue-700">
                  technology@wafflehacks.org
                </a>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default InvalidState;
