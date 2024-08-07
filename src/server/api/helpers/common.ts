import crypto from 'crypto';

/**
 * Generates a random token of the specified length.
 * @param length The length of the token to generate. Defaults to 30.
 * @returns A random token.
 */
export const generateRandomToken = (length: number = 30) => {
  return crypto.getRandomValues(new Uint8Array(length)).toString();
};

/**
 * The function `getHashToken` takes a raw token as input and returns its SHA-256 hash in hexadecimal
 * format.
 * @param {string} rawToken - The `rawToken` parameter is a string that represents the input token that
 * you want to hash using the SHA-256 algorithm.
 * @returns The function `getHashToken` is returning a hashed token using the SHA-256 algorithm.
 */
export const getHashToken = (rawToken: string): string => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};
