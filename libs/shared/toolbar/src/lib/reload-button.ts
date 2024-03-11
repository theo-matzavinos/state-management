import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { lucideRefreshCw } from '@ng-icons/lucide';
import { NgClass } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[slg-reload]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      reload: lucideRefreshCw,
    }),
  ],
  hostDirectives: [HlmButtonDirective],
  host: {
    class: 'gap-1',
    type: 'button',
    '[disabled]': 'disabled()',
  },
  imports: [HlmIconComponent, NgClass],
  template: `<hlm-icon
      [ngClass]="{ 'animate-spin': disabled() }"
      name="reload"
      size="sm"
    />
    Reload`,
})
export class ReloadButton {
  disabled = input(false, { transform: booleanAttribute });

  constructor() {
    inject(HlmButtonDirective, { self: true }).variant = 'ghost';
  }
}
