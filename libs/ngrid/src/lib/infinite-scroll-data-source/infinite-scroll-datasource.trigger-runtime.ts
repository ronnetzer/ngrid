import { from, isObservable, of, Observable } from 'rxjs';
import { map, switchMap, take, tap, finalize, debounceTime, filter } from 'rxjs/operators';
import { PblDataSourceTriggerChangedEvent, DataSourceOf, PblDataSource } from '../data-source/index';
import { PblInfiniteScrollDataSourceCache } from './infinite-scroll-datasource.cache';
import { PblInfiniteScrollFactoryHandlers, PblInfiniteScrollDsOptions, PblInfiniteScrollTriggerChangedEvent } from './infinite-scroll-datasource.types';
import { INFINITE_SCROLL_DEFFERED_ROW } from './infinite-scroll-deffered-row';

export interface PblInfiniteScrollDataSourceTriggerRuntimeContext<T, TData = any> {
  ds: PblDataSource<T, TData>;
  cache: PblInfiniteScrollDataSourceCache<T, TData>;
  options: PblInfiniteScrollDsOptions;
  totalLength: number;
}

export class PblInfiniteScrollDataSourceTriggerRuntime<T, TData = any> {

  static tryCreate<T, TData = any>(context: PblInfiniteScrollDataSourceTriggerRuntimeContext<T, TData>,
                                   onTrigger: (event: PblDataSourceTriggerChangedEvent<TData>) => (false | DataSourceOf<T>)): PblInfiniteScrollDataSourceTriggerRuntime<T, TData> | undefined {

    if (context.totalLength && context.ds.renderStart > context.totalLength) {
      return;
    }

    const { ds, cache, totalLength } = context;
    const renderEnd = ds.renderStart + ds.renderLength;
    const newBlock = cache.matchNewBlock(ds.renderStart, totalLength ? Math.min(renderEnd, totalLength) : renderEnd);

    if (!!newBlock) {
      return new PblInfiniteScrollDataSourceTriggerRuntime<T, TData>(context, onTrigger);
    }
  }

  private get ds(): PblDataSource<T, TData> { return this.context.ds; }
  private get cache(): PblInfiniteScrollDataSourceCache<T, TData> { return this.context.cache; }
  private get options(): PblInfiniteScrollDsOptions { return this.context.options; }

  private constructor(private context: PblInfiniteScrollDataSourceTriggerRuntimeContext<T, TData>,
                      private onTriggerCb: (event: PblDataSourceTriggerChangedEvent<TData>) => (false | DataSourceOf<T>)) {
    setTimeout(() => this.ds.refresh(this as any), 16);
  }

  shouldHandleTrigger(event: PblDataSourceTriggerChangedEvent<TData>): boolean {
    return event.data.changed && event.data.curr === this as any;
  }

  onRenderedDataChanged(): void {
  }

  onTrigger(event: PblInfiniteScrollTriggerChangedEvent<TData>, cacheReplace: boolean): false | Observable<T[]> {

    const result = this.onTriggerCb(event);
    if (result === false) {
      return result;
    }

    const obs = Array.isArray(result)
      ? of(result)
      : isObservable(result)
        ? result
        : from(result)
    ;

    return obs.pipe(
      map( values => this.updateCache(event, values, cacheReplace) ),
    );
  }

  private updateCache(event: PblInfiniteScrollTriggerChangedEvent<TData>, values: T[], replace: boolean) {

    if (this.cache.cached.empty) {
      return values;
    } else {
      const { fromRow, toRow } = event;
      if (replace) {
        for (let i = this.cache.cached.start, len = this.cache.cached.end; i <= len; i++) {
          this.ds.source[i] = INFINITE_SCROLL_DEFFERED_ROW;
        }
        this.cache.set(event);
      } else {
        const trim = this.cache.update(event);
        if (trim) {
          if (event.direction === -1) {
            const end = this.cache.cached.end;
            for (let i = 1; i <= trim; i++) {
              this.ds.source[end + i] = INFINITE_SCROLL_DEFFERED_ROW;
            }
          } else if (event.direction === 1) {
            const start = this.cache.cached.start;
            for (let i = -1; i >= trim; i--) {
              this.ds.source[start + i] = INFINITE_SCROLL_DEFFERED_ROW;
            }
          }
        }
      }

      for (let i = 0, len = values.length; i < len; i++) {
        this.ds.source[i + fromRow] = values[i];
      }

      return this.ds.source;
    }
  }

  /**
   * Return the infinite scroll change event interface from an existing event and additional metadata.
   * Will return undefined when the event and metadata are invalid, currently only occur when there is a total length
   * limit and the start (fromRow) is after that limit.
   */
  public static createInfiniteScrollChangeEvent<T, TData = any>(event: PblDataSourceTriggerChangedEvent<TData>,
                                                                context: PblInfiniteScrollDataSourceTriggerRuntimeContext<T, TData>,
                                                                direction: -1 | 0 | 1,
                                                                start: number,
                                                                end: number): PblInfiniteScrollTriggerChangedEvent<TData> | undefined {
    let offset = Math.max(context.ds.renderLength, context.options.minBlockSize);
    let fromRow: number;
    let toRow: number;
    switch (direction) {
      case -1:
        fromRow = Math.max(0, end - (offset - 1));
        toRow = end;
        break;
      case 0:
          direction = 1;
      case 1:
          fromRow = start;
          toRow = start + offset - 1;
          break;
    }

    const totalLength = context.totalLength || 0;
    if (totalLength) {
      if (toRow >= totalLength) {
        if (fromRow >= totalLength) {
          return undefined;
        }
        toRow = totalLength - 1;
        offset = (toRow - fromRow) + 1;
      }
      if (direction === 1 && toRow === totalLength - 1) {
        (event as PblInfiniteScrollTriggerChangedEvent).isLastBlock = true;
      }
    }

    (event as PblInfiniteScrollTriggerChangedEvent).isInfiniteScroll = true;

    (event as PblInfiniteScrollTriggerChangedEvent).totalLength = totalLength;
    (event as PblInfiniteScrollTriggerChangedEvent).direction = direction;
    (event as PblInfiniteScrollTriggerChangedEvent).fromRow = fromRow;
    (event as PblInfiniteScrollTriggerChangedEvent).offset = offset;
    (event as PblInfiniteScrollTriggerChangedEvent).toRow = toRow;

    return event as PblInfiniteScrollTriggerChangedEvent<TData>;
  }
}
