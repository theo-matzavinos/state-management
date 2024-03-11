import type { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';

import type { TodoDetailsDto, TodosListDto } from '@api/dto';

export const apiTodosGet = (
  httpClient: HttpClient,
  queryParams?: Partial<{ page: number; pageSize: number }>,
): Observable<TodosListDto> =>
  httpClient.get<TodosListDto>(`/api/Todos`, { params: queryParams });
export const apiTodosGetPromise = (
  ...args: Parameters<typeof apiTodosGet>
): Promise<TodosListDto> => lastValueFrom(apiTodosGet(...args));
export const apiTodosPost = (
  httpClient: HttpClient,
  body: TodoDetailsDto,
): Observable<TodoDetailsDto> =>
  httpClient.post<TodoDetailsDto>(`/api/Todos`, body);
export const apiTodosPostPromise = (
  ...args: Parameters<typeof apiTodosPost>
): Promise<TodoDetailsDto> => lastValueFrom(apiTodosPost(...args));
export const apiTodosIdGet = (
  httpClient: HttpClient,
  params: { id: number },
): Observable<TodoDetailsDto> =>
  httpClient.get<TodoDetailsDto>(`/api/Todos/${params.id}`);
export const apiTodosIdGetPromise = (
  ...args: Parameters<typeof apiTodosIdGet>
): Promise<TodoDetailsDto> => lastValueFrom(apiTodosIdGet(...args));
export const apiTodosIdPut = (
  httpClient: HttpClient,
  params: { id: number },
  body: TodoDetailsDto,
): Observable<TodoDetailsDto> =>
  httpClient.put<TodoDetailsDto>(`/api/Todos/${params.id}`, body);
export const apiTodosIdPutPromise = (
  ...args: Parameters<typeof apiTodosIdPut>
): Promise<TodoDetailsDto> => lastValueFrom(apiTodosIdPut(...args));
export const apiTodosIdDelete = (
  httpClient: HttpClient,
  params: { id: number },
): Observable<void> => httpClient.delete<void>(`/api/Todos/${params.id}`);
export const apiTodosIdDeletePromise = (
  ...args: Parameters<typeof apiTodosIdDelete>
): Promise<void> => lastValueFrom(apiTodosIdDelete(...args));
