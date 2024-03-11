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

export type MutationResult<Params, Result, Error> = {
  data: Signal<Result | undefined>;
  status: Signal<'idle' | 'pending' | 'success' | 'error'>;
  error: Signal<Error | undefined>;
  isIdle: Signal<boolean>;
  isPending: Signal<boolean>;
  isSuccess: Signal<boolean>;
  isError: Signal<boolean>;
  mutate: (params: Params, hooks?: Partial<MutationHooks>) => void;
};
