export function injectQuery<QueryKey, Result>(
  options: () => {
    queryKey: QueryKey;
    queryFn: () => Promise<Result>;
  },
) {
  const optionsSignal = computed(options);
  const resultSignal = signal<Result>();

  effect(() => {
    const { queryKey, queryFn } = optionsSignal();
    const cachedResponse = cache.get(queryKey);

    if (!cachedResponse) {
      queryFn().then((response) => {
        cache.set(queryKey, response);
        resultSignal.set(response);
      });
    } else if (cachedResponse.isFresh) {
      resultSignal.set(cachedResponse);
    } else {
      resultSignal.set(cachedResponse);

      queryFn().then((response) => {
        cache.set(queryKey, response);
        resultSignal.set(response);
      });
    }
  });

  return resultSignal;
}
