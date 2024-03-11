import { Directive } from '@angular/core';

@Directive({
  selector: 'menu[slgToolbar]',
  standalone: true,
  host: {
    class: 'flex gap-2 border border-border p-2 rounded-t-md',
  },
})
export class Toolbar {}
