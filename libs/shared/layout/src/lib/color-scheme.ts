import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  RendererFactory2,
  effect,
  inject,
  signal,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorScheme {
  private _colorScheme = injectColorScheme();

  colorScheme = this._colorScheme.asReadonly();

  toggleDarkMode(): void {
    const newTheme =
      localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    this._colorScheme.set(newTheme);
  }
}

function injectColorScheme() {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const colorScheme = signal<'light' | 'dark'>(
      (localStorage.getItem('theme') as 'light' | 'dark' | null) ?? 'light',
    );
    const renderer = inject(RendererFactory2).createRenderer(null, null);
    const document = inject(DOCUMENT);

    effect(() => {
      if (colorScheme() === 'dark') {
        renderer.addClass(document.documentElement, 'dark');
      } else {
        if (document.documentElement.className.includes('dark')) {
          renderer.removeClass(document.documentElement, 'dark');
        }
      }
    });

    return colorScheme;
  }

  return signal<'light' | 'dark'>('light');
}
