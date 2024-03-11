import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { RequestStatus } from '@slg/suspense';
import { newTodoActions } from './new-todo.actions';

type NewTodo = {
  status: RequestStatus;
  error: string | undefined;
};

const initialState: NewTodo = {
  error: undefined,
  status: RequestStatus.Idle,
};

const reducer = createReducer(
  initialState,
  on(newTodoActions.create, (): NewTodo => {
    return {
      error: undefined,
      status: RequestStatus.Pending,
    };
  }),
  on(newTodoActions.createSuccess, (): NewTodo => {
    return {
      error: undefined,
      status: RequestStatus.Success,
    };
  }),
  on(newTodoActions.createError, (state, action): NewTodo => {
    return {
      error: action.error,
      status: RequestStatus.Error,
    };
  }),
);

export const newTodoFeature = createFeature({
  name: 'newTodo',
  reducer,
  extraSelectors(baseSelectors) {
    const selectIsCreating = createSelector(
      baseSelectors.selectStatus,
      (status) => status === RequestStatus.Pending,
    );

    return {
      selectIsCreating,
    };
  },
});
