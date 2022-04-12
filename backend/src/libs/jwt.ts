import { decode, verify } from 'jsonwebtoken';
import type { JwtPayload, VerifyOptions } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

const ISSUER = process.env.JWT_ISSUER;
const HS256_SIGNING_TOKEN = process.env.JWT_HS256_SIGNING_TOKEN;
const RS256_SIGNING_JWKS_URI = process.env.JWT_RS256_SIGNING_JWKS_URI;

const jwks = new JwksClient({ cache: true, jwksUri: RS256_SIGNING_JWKS_URI, timeout: 5000 });
const options: VerifyOptions = {
  audience: 'https://id.wafflehacks.org',
  issuer: ISSUER,
  complete: false,
};

export interface StaticProfile {
  id: string;
  email: string;
}

const tokenFromHeader = (header: string): string => {
  if (!header) throw new Error('Unauthorized');

  const [type, token] = header.split(' ');
  if (type.toLowerCase() !== 'bearer') throw new Error('Unauthorized');

  return token;
};

export const staticProfile = (header: string): StaticProfile => {
  const token = tokenFromHeader(header);
  const payload = decode(token, { json: true });
  return {
    id: payload.sub,
    email: payload.email,
  };
};

export const validate = async (header: string): Promise<string> => {
  const token = tokenFromHeader(header);
  const decoded = decode(token, { complete: true });

  let verified;
  switch (decoded.header.alg) {
    case 'HS256':
      verified = verify(token, HS256_SIGNING_TOKEN, options);
      return (verified as JwtPayload).sub;

    case 'RS256':
      const signingKey = await jwks.getSigningKey(decoded.header.kid);
      verified = verify(token, signingKey.getPublicKey(), options);
      return (verified as JwtPayload).sub;

    default:
      throw new Error('unsupported signature');
  }
};
