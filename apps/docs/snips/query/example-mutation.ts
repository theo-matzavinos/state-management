import { effect } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';

const exampleMutation = injectMutation(() => ({
  mutationFn: (item: { id: number }) => Promise.resolve({ something: true }),
  onSuccess: (data, variables) => {
    if (data.something) {
      console.log({ id: variables.id });
    }
  },
  onError: (error, variables) => {
    console.error(variables.id, error);
  },
}));

exampleMutation.mutate({ id: 123 });

effect(() => {
  console.log(exampleMutation.status());
  console.log(exampleMutation.data()?.something);
});
