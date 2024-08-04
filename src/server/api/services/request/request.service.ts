import type { z } from 'zod';

import { getBaseUrl } from '@/utils/helpers';

import { request, type RequestOptions } from './request.helper';

export class RequestService {
  readonly baseUrl: string | URL;

  readonly headers: Map<string, string> = new Map();

  constructor(baseUrl: string | URL, headers?: Record<string, string>) {
    this.baseUrl = baseUrl;
    this.headers.set('Content-Type', 'application/json');
    this.setHeaders(headers);
  }

  setHeaders(headers: Record<string, string> | undefined) {
    if (!headers) return;
    Object.keys(headers).forEach(key => {
      const value = headers[key];
      if (value) {
        this.headers.set(key, value);
      }
    });
  }

  getHeaders() {
    return Object.fromEntries(this.headers.entries());
  }

  setAuthToken(token: string) {
    this.headers.set('Authorization', `Bearer ${token}`);
  }

  fetch<TSchema extends z.ZodTypeAny>(path: string | URL, options: RequestOptions<TSchema>) {
    const url = new URL(path, this.baseUrl);

    const { headers, ...restOptions } = options;
    if (headers) {
      this.setHeaders(headers);
    }
    return request(url, {
      headers: Object.fromEntries(this.headers.entries()),
      ...restOptions,
    });
  }

  get<TSchema extends z.ZodTypeAny>(path: string, options: RequestOptions<TSchema>) {
    return this.fetch(path, { ...options, method: 'GET' });
  }

  post<TSchema extends z.ZodTypeAny>(
    path: string,
    options: RequestOptions<TSchema> & { data?: Record<string, unknown> | Array<unknown> }
  ) {
    return this.fetch(path, {
      ...options,
      method: 'POST',
      body: options.body || JSON.stringify(options.data),
    });
  }

  put<TSchema extends z.ZodTypeAny>(
    path: string,
    options: RequestOptions<TSchema> & { data?: Record<string, unknown> | Array<unknown> }
  ) {
    return this.fetch(path, {
      ...options,
      method: 'PUT',
      body: options.body || JSON.stringify(options.data),
    });
  }

  patch<TSchema extends z.ZodTypeAny>(
    path: string,
    options: RequestOptions<TSchema> & { data?: Record<string, unknown> | Array<unknown> }
  ) {
    return this.fetch(path, {
      ...options,
      method: 'PATCH',
      body: options.body || JSON.stringify(options.data),
    });
  }

  delete<TSchema extends z.ZodTypeAny>(path: string, options: RequestOptions<TSchema>) {
    return this.fetch(path, { ...options, method: 'DELETE' });
  }
}

export const createRequestInstance = (baseUrl: string | URL, headers?: Record<string, string>) => {
  return new RequestService(baseUrl, headers);
};

export const requestService = new RequestService(getBaseUrl());
