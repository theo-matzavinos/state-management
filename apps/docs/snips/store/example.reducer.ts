import { createReducer, on } from '@ngrx/store';

export type ExampleState = {
  value: string;
  isExample: boolean;
};

const initialState: ExampleState = {
  value: '',
  isExample: false,
};

const reducer = createReducer(
  initialState,
  // handle action that always causes update
  on(
    exampleActions.valueChanged,
    (state, action): ExampleState => ({
      ...state,
      value: action.value,
    }),
  ),
  // handle action that conditionally causes update
  on(exampleActions.reset, (state): ExampleState => {
    if (state.isExample) {
      // no update to state - return current
      return state;
    }

    return {
      ...state,
      value: '',
    };
  }),
  // handle multiple actions
  on(
    sidenavActions.logout,
    authActions.tokenExpired,
    (): ExampleState => initialState,
  ),
);
