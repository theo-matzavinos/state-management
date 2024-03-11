import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { lucidePencil } from '@ng-icons/lucide';
import { RouterLink } from '@angular/router';
import type { TodoListItemDto } from '@api/dto';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'a[todos-edit]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      edit: lucidePencil,
    }),
  ],
  hostDirectives: [HlmButtonDirective, RouterLink],
  imports: [HlmIconComponent],
  template: `<hlm-icon name="edit" size="sm" />`,
})
export class EditTodoLink {
  todo = input.required<TodoListItemDto>();

  constructor() {
    inject(HlmButtonDirective).variant = 'ghost';

    const routerLink = inject(RouterLink, { self: true });

    effect(() => {
      routerLink.routerLink = [this.todo().id];
    });
  }
}
