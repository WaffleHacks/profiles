import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

// From https://github.com/auth0/auth0-react/blob/88f82318a1dbe1372dd1653aec5bd609ccd8a301/src/utils.tsx#L3-L9
const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]/;
const ERROR_RE = /[?&]error=[^&]/;

const hasAuthParams = (searchParams = window.location.search): boolean =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) && STATE_RE.test(searchParams);

export const useToken = (): string | undefined => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    (async () => {
      if (isLoading || hasAuthParams()) return;
      else if (!isAuthenticated) await loginWithRedirect();

      const t = await getAccessTokenSilently({
        audience: 'https://id.wafflehacks.org',
        scope: 'profile:read profile:edit',
      });
      setToken(t);
    })();
  }, [isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect]);

  return token;
};
