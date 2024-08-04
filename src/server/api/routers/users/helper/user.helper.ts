import argon2 from 'argon2';

export const hashPassword = async (password: string) => {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    throw new Error('Failed to hash password.', {
      cause: err,
    });
  }
};

export const verifyPassword = async (hash: string, password: string) => {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    throw new Error('Failed to verify password.', {
      cause: err,
    });
  }
};
