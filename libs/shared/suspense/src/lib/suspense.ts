import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmAlertImports } from '@spartan-ng/ui-alert-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { RequestStatus } from './request-status';

@Component({
  selector: 'slg-suspense',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmSpinnerComponent, HlmAlertImports],
  host: {
    class: 'flex flex-col flex-grow',
  },
  template: `
    @switch (status()) {
      @case (RequestStatus.Success) {
        <ng-content />
      }
      @case (RequestStatus.Error) {
        <div hlmAlert variant="destructive">
          <h4 hlmAlertTitle>Oh, no!</h4>
          <p hlmAlertDescription>
            {{ error() }}
          </p>
        </div>
      }
      @default {
        <hlm-spinner class="m-auto" />
      }
    }
  `,
})
export class Suspense {
  status = input.required<RequestStatus>();
  error = input<unknown>();

  protected RequestStatus = RequestStatus;
}
