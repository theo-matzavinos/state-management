import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { apiTodoDonenessGetPromise } from '@api/endpoints';
import { injectQuery } from '@tanstack/angular-query-experimental';

export function injectTodoDonenessQuery() {
  const httpClient = inject(HttpClient);

  return injectQuery(() => ({
    queryKey: ['todos doneness'] as const,
    queryFn: () => apiTodoDonenessGetPromise(httpClient),
    staleTime: Infinity,
  }));
}
