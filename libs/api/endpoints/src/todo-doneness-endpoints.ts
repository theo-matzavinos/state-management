import type { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';

import type { TodoDonenessDto } from '@api/dto';

export const apiTodoDonenessGet = (
  httpClient: HttpClient,
): Observable<Array<TodoDonenessDto>> =>
  httpClient.get<Array<TodoDonenessDto>>(`/api/TodoDoneness`);
export const apiTodoDonenessGetPromise = (
  ...args: Parameters<typeof apiTodoDonenessGet>
): Promise<Array<TodoDonenessDto>> =>
  lastValueFrom(apiTodoDonenessGet(...args));
