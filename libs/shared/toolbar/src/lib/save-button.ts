import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { lucideSave } from '@ng-icons/lucide';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[slg-save]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      save: lucideSave,
    }),
  ],
  hostDirectives: [HlmButtonDirective],
  host: {
    class: 'gap-1',
    type: 'submit',
  },
  imports: [HlmIconComponent],
  template: `<hlm-icon name="save" size="sm" /> Save`,
})
export class SaveButton {
  form = input.required<string>();
}
