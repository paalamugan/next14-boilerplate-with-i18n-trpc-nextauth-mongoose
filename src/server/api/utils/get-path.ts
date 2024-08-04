import type { GetParamsFromPath } from '@/types/generic';

export const getPathUrl = <T extends string>(
  path: T,
  ...[params]: GetParamsFromPath<T> extends undefined ? [] : [GetParamsFromPath<T>]
) => {
  if (!params) return path;
  return Object.entries(params).reduce(
    (finalPath, [find, replace]) =>
      finalPath.replace(`:${find}`, typeof replace === 'string' ? replace : '') as T,
    path
  );
};
