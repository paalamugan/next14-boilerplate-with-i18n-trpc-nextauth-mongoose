import type { z } from 'zod';
import { fromZodError, type FromZodErrorOptions } from 'zod-validation-error';

import { ApiValidationError, isApiValidationError } from '@/server/errors/api-validation.error';
import { logger } from '@/server/logger';

export type RequestOptions<T extends z.ZodTypeAny> = RequestInit & {
  responseValidation: T;
  headers?: Record<string, string>;
  onRawResponse?: (response: Response) => void;
  onSuccessRawResponse?: (data: unknown) => void;
  onErrorRawResponse?: (error: unknown) => void;
  onSuccess?: (data: z.output<T>) => void;
  onError?: (error: ApiValidationError) => void;
  zodErrorOptions?: FromZodErrorOptions;
  isJsonResponse?: boolean;
};
export type RequestResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiValidationError };

/**
 * Makes a fetch request to the specified URL with the given options.
 * @param url - The URL to make the fetch request to.
 * @param options - The options for the fetch request, including the Zod schema for parsing the response data.
 * @returns A promise that resolves to the parsed response data, or an object with success set to false and the error details if an error occurs.
 */
export const request = async <TSchema extends z.ZodTypeAny>(
  url: string | URL | Request,
  options: RequestOptions<TSchema>
): Promise<RequestResponse<z.output<TSchema>>> => {
  const {
    responseValidation,
    onRawResponse,
    onSuccessRawResponse,
    onErrorRawResponse,
    onSuccess,
    onError,
    zodErrorOptions,
    isJsonResponse = true,
    ...fetchOptions
  } = options;
  try {
    const response = await fetch(url, fetchOptions);
    onRawResponse?.(response);
    if (!response.ok) {
      const errorMessage = (await response.text()) || response.statusText;
      throw new ApiValidationError(errorMessage, response.status);
    }

    const result = isJsonResponse ? await response.json() : await response.text();
    onSuccessRawResponse?.(result);
    const parsedData = responseValidation.safeParse(result);
    if (!parsedData.success) {
      const zodError = fromZodError(parsedData.error, zodErrorOptions);
      throw new ApiValidationError(zodError.message, 1000, zodError);
    }
    onSuccess?.(parsedData.data);
    return { success: true, data: parsedData.data };
  } catch (err) {
    onErrorRawResponse?.(err);
    const apiError = isApiValidationError(err) ? err : new ApiValidationError(err);
    onError?.(apiError);
    logger.error(
      'Error making fetch request URL:',
      url,
      '\nFetchOptions: ',
      fetchOptions,
      '\nError:',
      apiError
    );
    return {
      success: false,
      error: apiError,
    };
  }
};
