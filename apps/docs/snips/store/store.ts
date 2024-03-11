@Injectable()
export class Store<T = object> extends Observable<T> {
  select<K>(mapFn: (state: T) => K): Observable<K>;
  selectSignal<K>(selector: (state: T) => K): Signal<K>;
  dispatch<V extends Action = Action>(action: V): void;
}
