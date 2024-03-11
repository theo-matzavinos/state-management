export function createSelector<State, Result>(
  projector: (state: State) => Result
): Selector;

export function createSelector<...SelectorResults, Result>(
  ...inputSelectors: Selector[],
  projector: (...inputs: SelectorResults) => Result
): Selector;
