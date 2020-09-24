import { from, isObservable, of } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { PblDataSourceTriggerChangedEvent, DataSourceOf, PblDataSource } from '../data-source/index';
import { PblInfiniteScrollFactoryHandlers, PblInfiniteScrollDsOptions, PblInfiniteScrollTriggerChangedEvent } from './infinite-scroll-datasource.types';
import { PblInfiniteScrollDataSourceCache } from './infinite-scroll-datasource.cache';
import { INFINITE_SCROLL_DEFFERED_ROW } from './infinite-scroll-deffered-row';
import { PblInfiniteScrollDataSourceTriggerRuntime } from './infinite-scroll-datasource.trigger-runtime';

function normalizeOptions(rawOptions: PblInfiniteScrollDsOptions) {
  const options: PblInfiniteScrollDsOptions = rawOptions || {};

  options.minBlockSize = Number(options.minBlockSize);
  if (Number.isNaN(options.minBlockSize)) {
    options.minBlockSize = 0;
  }

  options.initialDataSourceSize = Number(options.initialDataSourceSize);
  if (Number.isNaN(options.initialDataSourceSize)) {
    options.initialDataSourceSize = 0;
  }

  return options;
}

class PblInfiniteScrollDSContext<T, TData = any> {

  private ds: PblDataSource<T, TData>;
  private options: PblInfiniteScrollDsOptions;

  private totalLength: number;
  private lastEvent: PblInfiniteScrollTriggerChangedEvent<TData>;
  private cache: PblInfiniteScrollDataSourceCache<T, TData>;
  private triggerRuntime: PblInfiniteScrollDataSourceTriggerRuntime<T, TData>;

  constructor(private internalHandlers: PblInfiniteScrollFactoryHandlers<T, TData>, options: PblInfiniteScrollDsOptions | undefined) {
    this.options = normalizeOptions(options);
  }

  onCreated(dataSource: PblDataSource<T, TData>): void {
    this.ds = dataSource;
    this.cache = new PblInfiniteScrollDataSourceCache<T, TData>(dataSource);
    dataSource.onRenderedDataChanged.subscribe(() => this.onRenderedDataChanged() );
    if (this.internalHandlers.onCreated) {
      this.internalHandlers.onCreated(dataSource);
    }
  }

  onTrigger(event: PblDataSourceTriggerChangedEvent<TData>): false | DataSourceOf<T> {
    if (this.triggerRuntime && this.triggerRuntime.shouldHandleTrigger(event)) {
      const onTriggerResult = this.triggerRuntime.onTrigger(event);
      if (onTriggerResult === false) {
        this.triggerRuntime = undefined;
        return false;
      } else {
        return onTriggerResult
          .pipe(finalize(() => {
            setTimeout(() => this.ds.hostGrid._cdkTable.syncRows('data', true), 50);
            this.triggerRuntime = undefined;
          }));
      }
    } else {
      const result = this.internalHandlers.onTrigger(this.lastEvent || (this.lastEvent = this.toInfiniteScrollChangeEvent(event)));
      if (!result) {
        return result;
      }
      const obs = Array.isArray(result)
        ? of(result)
        : isObservable(result)
          ? result
          : from(result)
      ;
      return obs.pipe(
        tap(values => {
          this.cache.reset(values.length - 1);
          if (values && values.length < this.options.initialDataSourceSize) {
            for (let i = values.length; i < this.options.initialDataSourceSize; i++) {
              values[i] = INFINITE_SCROLL_DEFFERED_ROW;
            }
          }
        })
      );
    }
  }

  onRenderedDataChanged() {
    if (this.triggerRuntime) {
      this.triggerRuntime.onRenderedDataChanged();
    } else {
      this.triggerRuntime = PblInfiniteScrollDataSourceTriggerRuntime.tryCreate(this.ds, this.cache, this.options, this.internalHandlers.onTrigger, this.totalLength);
    }
  }

  private toInfiniteScrollChangeEvent(event: PblDataSourceTriggerChangedEvent<TData>): PblInfiniteScrollTriggerChangedEvent<TData> {
    event.updateTotalLength = (totalLength: number) => { this.totalLength = totalLength; };

    const offset = Math.max(this.ds.renderLength, this.options.minBlockSize) - 1;
    const fromRow = this.ds.length;
    const toRow = fromRow + offset;

    (event as PblInfiniteScrollTriggerChangedEvent).direction = 1;
    (event as PblInfiniteScrollTriggerChangedEvent).fromRow = fromRow;
    (event as PblInfiniteScrollTriggerChangedEvent).offset = offset + 1;
    (event as PblInfiniteScrollTriggerChangedEvent).toRow = toRow;
    return event as PblInfiniteScrollTriggerChangedEvent<TData>;
  }
}

export function createInfiniteScrollDSContext<T, TData = any>(internalHandlers: PblInfiniteScrollFactoryHandlers<T, TData>, options: PblInfiniteScrollDsOptions | undefined) {
  const context = new PblInfiniteScrollDSContext(internalHandlers, options);

  const onCreated = (dataSource: PblDataSource<T, TData>) => context.onCreated(dataSource);
  const onTrigger = (event: PblInfiniteScrollTriggerChangedEvent<TData>): false | DataSourceOf<T> => context.onTrigger(event);

  return { onTrigger, onCreated };
}
