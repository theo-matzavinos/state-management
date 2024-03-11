export function createReducer<State>(
  initialState: State,
  ...ons: On<State>[]
): Reducer<State> {}

export function on<State>(
  ...creators: ActionCreator[],
  reducer: (state: State, action: Action) => State,
): On<State>;
