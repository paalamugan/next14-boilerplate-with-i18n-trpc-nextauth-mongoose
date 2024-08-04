type GetParamsFromPathResult<TParam extends PropertyKey> = { [key in TParam]: string };

export type GetParamsFromPath<TPath extends string> =
  TPath extends `${string}:${infer TParam}/${infer TRest}`
    ? GetParamsFromPathResult<TParam> & GetParamsFromPath<TRest>
    : TPath extends `${string}:${infer TParam}`
      ? GetParamsFromPathResult<TParam>
      : {};
