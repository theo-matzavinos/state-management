import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { lucidePlus } from '@ng-icons/lucide';
import { RouterLink } from '@angular/router';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'a[slg-new]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      create: lucidePlus,
    }),
  ],
  hostDirectives: [
    HlmButtonDirective,
    { directive: RouterLink, inputs: ['routerLink:route'] },
  ],
  host: {
    class: 'gap-1',
  },
  imports: [HlmIconComponent],
  template: `<hlm-icon name="create" size="sm" /> New`,
})
export class NewLink {
  constructor() {
    inject(RouterLink, { self: true }).routerLink = ['new'];
  }
}
