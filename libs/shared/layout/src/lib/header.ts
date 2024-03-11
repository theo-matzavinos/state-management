import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { ColorScheme } from './color-scheme';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'header[slg-header]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-primary flex gap-4 p-2',
  },
  providers: [provideIcons({ dark: lucideMoon, light: lucideSun })],
  imports: [HlmButtonDirective, HlmIconComponent],
  template: `
    <nav class="flex gap-4" aria-label="Main Menu">
      <ng-content select="a[slg-nav-link]" />
    </nav>
    <ng-content />
    <button
      class="ml-auto"
      type="button"
      hlmBtn
      variant="ghost"
      (click)="colorScheme.toggleDarkMode()"
    >
      <hlm-icon
        [name]="colorScheme.colorScheme() === 'dark' ? 'dark' : 'light'"
      />
    </button>
  `,
})
export class Header {
  protected colorScheme = inject(ColorScheme);
}
