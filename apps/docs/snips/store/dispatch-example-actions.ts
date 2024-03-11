import { Store } from '@ngrx/store';
import { examplePageActions } from './example.actions';

@Component({})
export class ExampleComponent {
  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(examplePageActions.opened());
  }

  paginationChanged(page: number, pageSize: number) {
    this.store.dispatch(
      examplePageActions.paginationChanged({
        page,
        pageSize,
      }),
    );
  }
}
