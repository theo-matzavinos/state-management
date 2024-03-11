import { createFeature, createReducer, on } from '@ngrx/store';
import type { TodoDonenessDto } from '@api/dto';
import { RequestStatus } from '@slg/suspense';
import { todoDonenessActions } from './todo-doneness.actions';

type TodoDoneness = {
  values: TodoDonenessDto[];
  status: RequestStatus;
  error: string | undefined;
};

const todosListInitialState: TodoDoneness = {
  status: RequestStatus.Idle,
  values: [],
  error: undefined,
};

const reducer = createReducer(
  todosListInitialState,
  on(todoDonenessActions.load, (state): TodoDoneness => {
    if (state.status === RequestStatus.Success) {
      return state;
    }

    return {
      ...state,
      error: undefined,
      status: RequestStatus.Pending,
      values: [],
    };
  }),
  on(todoDonenessActions.loadSuccess, (state, action): TodoDoneness => {
    return {
      ...state,
      status: RequestStatus.Success,
      values: action.values,
    };
  }),
  on(todoDonenessActions.loadError, (state, action): TodoDoneness => {
    return {
      ...state,
      status: RequestStatus.Error,
      error: action.error,
      values: [],
    };
  }),
);

export const todoDonenessFeature = createFeature({
  name: 'todoDoneness',
  reducer,
});
