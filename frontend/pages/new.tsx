import { decode } from 'jsonwebtoken';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

import InvalidState from '../components/InvalidState';
import Loading from '../components/Loading';

/**
 * The necessary attributes to retrieve from the session token
 */
interface Profile {
  sub: string;
  email: string;
  picture: string;

  // Some of these may not be populated, so we need to figure out how to construct a partial name
  name?: string;
  family_name?: string;
  given_name?: string;
  nickname?: string;
}

const New: NextPage = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [state, setState] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>();

  // Retrieve the state and session token information for redirect
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const token = queryParams.get('session_token');
    if (token) {
      setToken(token);

      const decoded = decode(token, { complete: false, json: true });
      setProfile(decoded as Profile);
    }

    setState(queryParams.get('state'));
    setIsFirstLoad(false);
  }, []);

  // Handle loading state
  if (isFirstLoad) return <Loading />;

  // Handle invalid state
  if (state === null || token === null) return <InvalidState />;

  return <></>;
};

export default New;
