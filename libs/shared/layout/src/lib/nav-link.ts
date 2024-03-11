import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'a[slg-nav-link]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: [
        'routerLink:to',
        'target',
        'queryParams',
        'fragment',
        'queryParamsHandling',
        'state',
        'info',
        'relativeTo',
        'preserveFragment',
        'skipLocationChange',
        'replaceUrl',
      ],
    },
    { directive: RouterLinkActive, inputs: ['routerLinkActiveOptions'] },
    HlmButtonDirective,
  ],
  template: `<ng-content />`,
})
export class NavLink {
  constructor() {
    inject(HlmButtonDirective, { self: true }).variant = 'ghost';

    const routerLinkActive = inject(RouterLinkActive, { self: true });

    routerLinkActive.routerLinkActive =
      'font-bold bg-accent text-accent-foreground';
    routerLinkActive.ariaCurrentWhenActive = 'page';
  }
}
