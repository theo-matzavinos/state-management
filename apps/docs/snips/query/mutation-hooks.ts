export interface MutationHooks<Params, Result, Error, Context> {
  // before request
  onMutate(variables: Params): Context;
  // request success
  onSuccess(data: Result, variables: Params, context: Context): void;
  // request error
  onError(error: Error, variables: Params, context: Context): void;
  // after request success or error
  onSettled(
    data: Result | undefined,
    error: Error | undefined,
    variables: Params,
    context: Context,
  ): void;
}
