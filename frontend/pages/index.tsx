import { useAuth0 } from '@auth0/auth0-react';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { Profile, get, update } from '../components/api';
import { useToken } from '../components/auth';
import Header from '../components/Header';
import Loading from '../components/Loading';
import UpdatableField from '../components/UpdatableField';

const Index: NextPage = () => {
  const { user, isLoading } = useAuth0();
  const token = useToken();
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    (async () => {
      if (!token || isLoading) return;

      const p = await get(token);
      setProfile(p);
    })();
  }, [isLoading, token]);

  const onSave = (token: string, key: string) => async (value: string) => await update(token, { [key]: value });

  if (isLoading || !profile || !token) return <Loading />;

  return (
    <>
      <Header title="Your profile" logo={user?.picture} />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.email}</dd>
            </div>
            <UpdatableField
              name="first"
              label="First name"
              value={profile.firstName}
              onSave={onSave(token, 'firstName')}
            />
            <UpdatableField name="last" label="Last name" value={profile.lastName} onSave={onSave(token, 'lastName')} />
          </dl>
          <button
            type="button"
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => window.history.back()}
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default Index;
