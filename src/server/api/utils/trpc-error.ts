import { TRPCError } from '@trpc/server';
import type { TRPC_ERROR_CODE_KEY } from '@trpc/server/unstable-core-do-not-import';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { ApiValidationError } from '@/server/errors/api-validation.error';
/**
 * get a TRPCError based on the provided error and code.
 * @param error - The error object or message.
 * @param code - The error code. Defaults to 'INTERNAL_SERVER_ERROR'.
 * @throws TRPCError - Throws a TRPCError with the specified code and message.
 */
export const getTRPCError = (
  error: unknown,
  code: TRPC_ERROR_CODE_KEY = 'INTERNAL_SERVER_ERROR'
) => {
  if (typeof error === 'string') {
    return new TRPCError({
      code,
      message: error,
    });
  }

  if (error instanceof ApiValidationError) {
    return new TRPCError({
      code: error.statusCode === 1000 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR',
      message: error.message,
      cause: error,
    });
  }

  if (error instanceof ZodError) {
    const validationError = fromZodError(error);
    return new TRPCError({
      code: 'PARSE_ERROR',
      message: validationError.message,
      cause: error,
    });
  }

  if (error instanceof TRPCError) return error;

  if (error instanceof Error) {
    return new TRPCError({
      code,
      message: error.message,
      cause: error.cause,
    });
  }

  return new TRPCError({
    code,
    message: 'An unknown error occurred',
  });
};
