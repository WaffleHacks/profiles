import { RefreshIcon } from '@heroicons/react/outline';
import { decode } from 'jsonwebtoken';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { FormEvent, useEffect, useState } from 'react';

import { create } from '../components/api';
import Header from '../components/Header';

const Input = dynamic(() => import('../components/Input'));
const InvalidState = dynamic(() => import('../components/InvalidState'));
const Loading = dynamic(() => import('../components/Loading'));

const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || '';

/**
 * The necessary attributes to retrieve from the session token
 */
interface Profile {
  email: string;

  // Some of these may not be populated, so we need to figure out how to construct a partial name
  name?: string;
  family_name?: string;
  given_name?: string;
  nickname?: string;
}

const New: NextPage = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, setState] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [error, setError] = useState<string>();

  // Retrieve the state and session token information for redirect
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const token = queryParams.get('session_token');
    if (token) {
      setToken(token);

      // Extract information from their token
      const decoded = decode(token, { complete: false, json: true });
      if (decoded) {
        const profile = decoded as Profile;
        setEmail(profile.email);

        // Attempt to figure out what their names are
        if (profile.given_name && profile.family_name) {
          setFirstName(profile.given_name);
          setLastName(profile.family_name);
        } else if (profile.name) {
          const [maybeFirstName, ...maybeLastNames] = profile.name.split(' ');
          setFirstName(maybeFirstName);
          setLastName(maybeLastNames.join(' '));
        } else if (profile.nickname) setFirstName(profile.nickname);
      }
    }

    setState(queryParams.get('state'));
    setIsFirstLoad(false);
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (token === null) return;

    setIsSubmitting(true);

    // Create the user's profile
    try {
      await create(token, { email, firstName, lastName });
    } catch (e) {
      console.log(e);
      setError('An unexpected error occurred, please try again later');

      setIsSubmitting(false);
      return;
    }

    // Redirect back to Auth0 to complete sign in
    window.location.assign(`${AUTH0_DOMAIN}/continue?state=${state}`);
  };

  // Handle loading state
  if (isFirstLoad) return <Loading />;

  // Handle invalid state
  if (state === null || token === null) return <InvalidState />;

  return (
    <>
      <Header title="Complete your profile" subtitle="Please check we have your information correct" />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            <Input
              name="email"
              label="Email address"
              autoComplete="email"
              type="email"
              value={email}
              help="We'll use this email to contact you"
              disabled
            />
            <Input
              name="first"
              label="First name"
              autoComplete="given-name"
              placeholder="John"
              value={firstName}
              onChange={setFirstName}
            />
            <Input
              name="last"
              label="Last name"
              autoComplete="family-name"
              placeholder="Snow"
              value={lastName}
              onChange={setLastName}
            />

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              >
                Finish
                {isSubmitting && <RefreshIcon className="ml-2 h-5 w-5 animate-spin" />}
              </button>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default New;
