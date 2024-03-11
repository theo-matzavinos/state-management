import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { lucideTrash } from '@ng-icons/lucide';
import { BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[slg-delete]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      delete: lucideTrash,
    }),
  ],
  hostDirectives: [HlmButtonDirective, BrnDialogTriggerDirective],
  host: {
    class: 'gap-1',
    type: 'button',
  },
  imports: [HlmIconComponent],
  template: `<hlm-icon name="delete" size="sm" /> Delete`,
})
export class DeleteButton {
  constructor() {
    inject(HlmButtonDirective, { self: true }).variant = 'ghost';
  }
}
