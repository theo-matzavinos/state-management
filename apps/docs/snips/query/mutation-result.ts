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
