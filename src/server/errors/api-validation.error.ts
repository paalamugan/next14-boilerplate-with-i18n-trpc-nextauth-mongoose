import { TRPCError } from '@trpc/server';
import { type ErrorOptions, ValidationError } from 'zod-validation-error';

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error instanceof TRPCError) return error.message;
  return 'Unknown error occurred at the server';
};

export class ApiValidationError extends ValidationError {
  statusCode: number | undefined;

  constructor(error: unknown, statusCode?: number, opts?: ErrorOptions) {
    const message = getErrorMessage(error);
    super(message, opts);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiValidationError.prototype);
  }
}
export type ApiValidationErrorType = InstanceType<typeof ApiValidationError>;

export const isApiValidationError = (err: unknown): err is ApiValidationError => {
  return err instanceof ApiValidationError && err.statusCode !== undefined;
};
