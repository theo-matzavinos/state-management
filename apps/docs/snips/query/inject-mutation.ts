export function injectQuery<Params, Result>(
  options: () => {
    mutationFn: (variables: Params) => Promise<Result>;
  } & Partial<MutationHooks>,
): MutationResult;
