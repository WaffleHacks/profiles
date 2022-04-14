import { decode, verify } from 'jsonwebtoken';
import type { JwtPayload, VerifyOptions } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

const REDIRECT_ISSUER = process.env.JWT_REDIRECT_ISSUER;
const REDIRECT_SIGNING_KEY = process.env.JWT_REDIRECT_SIGNING_KEY;

const USER_ISSUER = process.env.JWT_USER_ISSUER;
const USER_JWKS_URI = process.env.JWT_USER_JWKS_URI;

const jwks = new JwksClient({ cache: true, jwksUri: USER_JWKS_URI, timeout: 5000 });

export enum ProfileType {
  Session = 'session',
  User = 'user',
}

export interface Profile {
  type: ProfileType;
  id: string;
  email?: string;
}

const verifyOptions = (issuer: string): VerifyOptions => ({
  audience: 'https://id.wafflehacks.org',
  issuer,
  complete: false,
});

const tokenFromHeader = (header: string): string => {
  if (!header) throw new Error('Unauthorized');

  const [type, token] = header.split(' ');
  if (type.toLowerCase() !== 'bearer') throw new Error('Unauthorized');

  return token;
};

export const staticProfile = (header: string): Profile => {
  const token = tokenFromHeader(header);
  const payload = decode(token, { json: true });
  return {
    type: ProfileType.User,
    id: payload.sub,
    email: payload.email,
  };
};

export const validate = async (header: string): Promise<Profile> => {
  const token = tokenFromHeader(header);
  const decoded = decode(token, { complete: true });

  let verified;
  switch (decoded.header.alg) {
    case 'HS256':
      verified = verify(token, REDIRECT_SIGNING_KEY, verifyOptions(REDIRECT_ISSUER)) as JwtPayload;
      return { type: ProfileType.Session, id: verified.sub, email: verified.email };

    case 'RS256':
      const signingKey = await jwks.getSigningKey(decoded.header.kid);
      verified = verify(token, signingKey.getPublicKey(), verifyOptions(USER_ISSUER)) as JwtPayload;
      return { type: ProfileType.User, id: verified.sub };

    default:
      throw new Error('unsupported signature');
  }
};
