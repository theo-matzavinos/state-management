import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'a[slg-backlink]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ back: lucideArrowLeft })],
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: ['routerLink:to'],
    },
    HlmButtonDirective,
  ],
  imports: [HlmIconComponent],
  template: `
    <hlm-icon name="back" />
    <span class="underline">Back</span>
  `,
})
export class Backlink {
  constructor() {
    inject(RouterLink, { self: true }).routerLink = ['..'];
    inject(HlmButtonDirective, { self: true }).variant = 'link';
  }
}
