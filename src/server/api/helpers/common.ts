/**
 * Generates a random token of the specified length.
 * @param length The length of the token to generate. Defaults to 30.
 * @returns A random token.
 */
export const generateRandomToken = (length: number = 30) => {
  return crypto.getRandomValues(new Uint8Array(length)).toString();
};
