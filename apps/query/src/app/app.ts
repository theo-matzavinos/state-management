import { ChangeDetectionStrategy, Component, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout, Header, NavLink } from '@slg/layout';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';

@Component({
  selector: 'query-app',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Layout, Header, NavLink, RouterOutlet, AngularQueryDevtools],
  template: `
    <slg-layout>
      <header slg-header>
        <a slg-nav-link [to]="['/']" [routerLinkActiveOptions]="{ exact: true }"
          >Home</a
        >
        <a slg-nav-link [to]="['/', 'todos']">TODOs</a>
      </header>
    </slg-layout>

    @defer (when isDev) {
      <angular-query-devtools />
    }
  `,
})
export class App {
  isDev = isDevMode();
}
