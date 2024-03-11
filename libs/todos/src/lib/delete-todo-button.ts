import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { lucideTrash } from '@ng-icons/lucide';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[todos-delete]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      delete: lucideTrash,
    }),
  ],
  hostDirectives: [HlmButtonDirective],
  host: {
    type: 'button',
  },
  imports: [HlmIconComponent],
  template: `<hlm-icon name="delete" size="sm" />`,
})
export class DeleteTodoButton {
  constructor() {
    const button = inject(HlmButtonDirective, { self: true });

    button.variant = 'ghost';
    button.size = 'icon';
  }
}
