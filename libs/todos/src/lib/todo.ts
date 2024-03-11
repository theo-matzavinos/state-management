import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import type { TodoDonenessDto, TodoListItemDto } from '@api/dto';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { lucideCheck } from '@ng-icons/lucide';

@Component({
  selector: 'todos-todo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  providers: [provideIcons({ done: lucideCheck })],
  imports: [HlmIconComponent, HlmBadgeDirective],
  template: `
    {{ todo().title }}
    <div hlmBadge>
      {{ doneness()?.text }}
    </div>
  `,
})
export class Todo {
  todo = input.required<TodoListItemDto>();
  donenessValues = input.required<TodoDonenessDto[]>();

  doneness = computed(() =>
    this.donenessValues().find((v) => v.value === this.todo().doneness),
  );
}
