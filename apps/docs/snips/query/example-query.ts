import { effect, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';

const itemId = signal(NaN);

function getItem(id: number) {
  return Promise.resolve({ id });
}

const exampleQuery = injectQuery(() => ({
  queryKey: ['example', 'query', itemId()] as const,
  queryFn: ({ queryKey }) => getItem(queryKey[2]),
  enabled: !isNaN(itemId()),
}));

effect(() => {
  console.log(exampleQuery.status());
  console.log(exampleQuery.data()?.id);
});
