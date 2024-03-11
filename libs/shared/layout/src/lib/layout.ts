import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSonnerComponent } from '@spartan-ng/ui-sonner-helm';

@Component({
  selector: 'slg-layout',
  standalone: true,
  host: {
    class: 'h-dvh w-dvw flex flex-col',
  },
  imports: [RouterOutlet, HlmSonnerComponent],
  template: `
    <ng-content select="header" />
    <main class="flex flex-grow flex-col">
      <router-outlet />
    </main>
    <hlm-sonner position="top-center" />
  `,
})
export class Layout {}
