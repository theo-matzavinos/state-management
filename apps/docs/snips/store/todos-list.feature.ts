import type { TodoListItemDto } from '@api/dto';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { RequestStatus } from '@slg/suspense';
import { todosListActions } from './todos-list.actions';
import { editTodoActions } from './edit-todo.actions';
import { newTodoActions } from './new-todo.actions';
import { deleteTodoActions } from './delete-todo.actions';

type TodosList = {
  page: number;
  pageSize: number;
  count: number;
  todos: TodoListItemDto[];
  status: RequestStatus;
  fetchStatus: RequestStatus;
  error: string | undefined;
};

const initialState: TodosList = {
  page: 0,
  pageSize: 10,
  count: 0,
  error: undefined,
  fetchStatus: RequestStatus.Idle,
  status: RequestStatus.Idle,
  todos: [],
};

const reducer = createReducer(
  initialState,
  on(todosListActions.load, (state, action): TodosList => {
    if (
      state.page !== action.page ||
      state.pageSize !== action.page ||
      state.status !== RequestStatus.Success
    ) {
      return {
        ...state,
        page: action.page,
        pageSize: action.pageSize,
        error: undefined,
        fetchStatus: RequestStatus.Pending,
        status: RequestStatus.Pending,
        todos: [],
      };
    }

    return {
      ...state,
      fetchStatus: RequestStatus.Pending,
    };
  }),
  on(todosListActions.loadSuccess, (state, action): TodosList => {
    return {
      ...state,
      count: action.count,
      fetchStatus: RequestStatus.Success,
      status: RequestStatus.Success,
      todos: action.todos,
    };
  }),
  on(todosListActions.loadError, (state, action): TodosList => {
    return {
      ...state,
      count: 0,
      fetchStatus: RequestStatus.Error,
      status: RequestStatus.Error,
      todos: [],
      error: action.error,
    };
  }),
  on(deleteTodoActions.deleteSuccess, (state, action): TodosList => {
    return {
      ...state,
      todos: state.todos.filter((todo) => todo.id !== action.todoId),
      count: state.count - 1,
    };
  }),
  on(editTodoActions.updateSuccess, (state, action): TodosList => {
    if (!state.todos.some((todo) => todo.id === action.todo.id)) {
      return state;
    }

    const { description, ...updated } = action.todo;

    return {
      ...state,
      todos: state.todos.map((todo) =>
        todo.id !== action.todo.id ? todo : updated,
      ),
    };
  }),
  on(newTodoActions.createSuccess, (state, action): TodosList => {
    return {
      ...state,
      // we can do this but it's an invalid state most of the time
      // todos: [...state.todos, action.todo],
      count: state.count + 1,
    };
  }),
);

export const todosListFeature = createFeature({
  name: 'todosList',
  reducer,
  extraSelectors(baseSelectors) {
    const selectQueryParams = createSelector(
      baseSelectors.selectPage,
      baseSelectors.selectPageSize,
      (page, pageSize) => ({ page, pageSize }),
    );
    const selectIsFetching = createSelector(
      baseSelectors.selectFetchStatus,
      (status) => status === RequestStatus.Pending,
    );

    return {
      selectQueryParams,
      selectIsFetching,
    };
  },
});
