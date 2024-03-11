export type QueryResult<Result, Error> = {
  data: Signal<Result | undefined>;
  status: Signal<'pending' | 'success' | 'error'>;
  error: Signal<Error | undefined>;
  isPending: Signal<boolean>;
  isSuccess: Signal<boolean>;
  isError: Signal<boolean>;
  fetchStatus: Signal<'idle' | 'fetching' | 'paused'>;
  isFetching: Signal<boolean>;
  refetch: () => Promise<QueryResult<Result, Error>>;
};
