import { PblDataSourceFactory, DataSourceOf, PblDataSource } from '../data-source/index';
import { PblInfiniteScrollFactoryHandlers, PblInfiniteScrollDsOptions, PblInfiniteScrollTriggerChangedEvent } from './infinite-scroll-datasource.types';
import { createInfiniteScrollDSContext } from './infinite-scroll-datasource.context';

export class PblInfiniteScrollDSFactory<T, TData = any> extends PblDataSourceFactory<T, TData> {
  private infiniteScrollOptions: PblInfiniteScrollDsOptions;
  private internalHandlers: PblInfiniteScrollFactoryHandlers<T, TData> = {} as any;

  withInfiniteScrollOptions(options: PblInfiniteScrollDsOptions): this {
    this.infiniteScrollOptions = options;
    return this;
  }

  /**
   * Set the main trigger handler.
   * The trigger handler is the core of the datasource, responsible for returning the data collection.
   *
   * By default the handler is triggered only when the datasource is required.
   * This can happened when:
   *   - The table connected to the datasource.
   *   - A manual call to `PblDataSource.refresh()` was invoked.
   *
   * There are additional triggers (filter/sort/pagination) which occur when their values change, e.g. when
   * a filter has change or when a page in the paginator was changed.
   *
   * By default, these triggers are handled automatically, resulting in a client-side behavior for each of them.
   * For example, a client side paginator will move to the next page based on an already existing data collection (no need to fetch from the server).
   *
   * To handle additional trigger you need to explicitly set them using `setCustomTriggers`.
   */
  onTrigger(handler: (event: PblInfiniteScrollTriggerChangedEvent<TData>) => (false | DataSourceOf<T>)): this {
    this.internalHandlers.onTrigger =  handler;
    return this;
  }

  onCreated(handler: (dataSource: PblDataSource<T, TData>) => void ): this {
    this.internalHandlers.onCreated =  handler;
    return this;
  }

  create(): PblDataSource<T, TData> {
    const context = createInfiniteScrollDSContext(this.internalHandlers, this.infiniteScrollOptions);
    super.onTrigger(context.onTrigger);
    super.onCreated(context.onCreated);
    return super.create();
  }
}

export function createInfiniteScrollDS<T, TData = T[]>(): PblInfiniteScrollDSFactory<T, TData> {
  return new PblInfiniteScrollDSFactory<T, TData>();
}
