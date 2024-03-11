import type { TodoDetailsDto } from '@api/dto';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { RequestStatus } from '@slg/suspense';
import { editTodoActions } from './edit-todo.actions';
import { newTodoActions } from './new-todo.actions';
import { deleteTodoActions } from './delete-todo.actions';

type EditTodo = {
  todo: TodoDetailsDto | undefined;
  loadStatus: RequestStatus;
  loadError: string | undefined;
  updateStatus: RequestStatus;
  updateError: string | undefined;
};

const initialState: EditTodo = {
  loadError: undefined,
  loadStatus: RequestStatus.Idle,
  todo: undefined,
  updateError: undefined,
  updateStatus: RequestStatus.Idle,
};

const reducer = createReducer(
  initialState,
  on(editTodoActions.load, (state, action): EditTodo => {
    if (state.todo?.id !== action.todoId) {
      return {
        ...initialState,
        loadStatus: RequestStatus.Pending,
      };
    }

    if (state.loadStatus === RequestStatus.Success) {
      return state;
    }

    return {
      ...state,
      loadStatus: RequestStatus.Pending,
      loadError: undefined,
    };
  }),
  on(editTodoActions.loadSuccess, (state, action): EditTodo => {
    return {
      ...state,
      loadStatus: RequestStatus.Success,
      todo: action.todo,
    };
  }),
  on(editTodoActions.loadError, (state, action): EditTodo => {
    return {
      ...state,
      loadError: action.error,
      loadStatus: RequestStatus.Error,
      todo: undefined,
    };
  }),
  on(deleteTodoActions.deleteSuccess, (state, action): EditTodo => {
    if (action.todoId !== state.todo?.id) {
      return state;
    }

    return initialState;
  }),
  on(editTodoActions.update, (state, action): EditTodo => {
    if (action.todo.id !== state.todo?.id) {
      return state;
    }

    return {
      ...state,
      updateError: undefined,
      updateStatus: RequestStatus.Pending,
    };
  }),
  on(editTodoActions.updateSuccess, (state, action): EditTodo => {
    if (action.todo.id !== state.todo?.id) {
      return state;
    }

    return {
      ...state,
      updateStatus: RequestStatus.Success,
      todo: action.todo,
    };
  }),
  on(editTodoActions.updateError, (state, action): EditTodo => {
    if (action.todo.id !== state.todo?.id) {
      return state;
    }

    return {
      ...state,
      updateStatus: RequestStatus.Error,
      updateError: action.error,
    };
  }),
  on(newTodoActions.editAfterCreation, (state, action): EditTodo => {
    return {
      ...initialState,
      todo: action.todo,
      loadStatus: RequestStatus.Success,
    };
  }),
);

export const editTodoFeature = createFeature({
  name: 'editTodo',
  reducer,
  extraSelectors(baseSelectors) {
    const selectIsUpdating = createSelector(
      baseSelectors.selectUpdateStatus,
      (status) => status === RequestStatus.Pending,
    );

    return {
      selectIsUpdating,
    };
  },
});
