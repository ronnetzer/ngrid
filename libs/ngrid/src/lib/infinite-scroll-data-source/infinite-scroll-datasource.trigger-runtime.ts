import { from, isObservable, of, Observable } from 'rxjs';
import { map, switchMap, take, tap, finalize, debounceTime, filter } from 'rxjs/operators';
import { PblDataSourceTriggerChangedEvent, DataSourceOf, PblDataSource } from '../data-source/index';
import { PblInfiniteScrollDataSourceCache } from './infinite-scroll-datasource.cache';
import { PblInfiniteScrollFactoryHandlers, PblInfiniteScrollDsOptions, PblInfiniteScrollTriggerChangedEvent } from './infinite-scroll-datasource.types';
import { INFINITE_SCROLL_DEFFERED_ROW } from './infinite-scroll-deffered-row';

export class PblInfiniteScrollDataSourceTriggerRuntime<T, TData = any> {

  static tryCreate<T, TData = any>(ds: PblDataSource<T, TData>,
                                   cache: PblInfiniteScrollDataSourceCache<T, TData>,
                                   options: PblInfiniteScrollDsOptions,
                                   onTrigger: (event: PblDataSourceTriggerChangedEvent<TData>) => (false | DataSourceOf<T>),
                                   totalLength: number): PblInfiniteScrollDataSourceTriggerRuntime<T, TData> | undefined {
    const renderEnd = ds.renderStart + ds.renderLength;
    const newBlock = cache.matchNewBlock(ds.renderStart, totalLength ? Math.min(renderEnd, totalLength) : renderEnd);
    if (!newBlock) {
      return;
    } else {
      return new PblInfiniteScrollDataSourceTriggerRuntime<T, TData>(ds, cache, options, onTrigger, totalLength);
    }
  }

  private constructor(private ds: PblDataSource<T, TData>,
                      private cache: PblInfiniteScrollDataSourceCache<T, TData>,
                      private options: PblInfiniteScrollDsOptions,
                      private onTriggerCb: (event: PblDataSourceTriggerChangedEvent<TData>) => (false | DataSourceOf<T>),
                      private totalLength: number) {
    setTimeout(() => this.ds.refresh(this as any), 16);
  }

  shouldHandleTrigger(event: PblDataSourceTriggerChangedEvent<TData>): boolean {
    return event.data.changed && event.data.curr === this as any;
  }

  onRenderedDataChanged(): void {
  }

  onTrigger(event: PblDataSourceTriggerChangedEvent<TData>): false | Observable<T[]> {

    const fn = () => {
      const renderEnd = this.ds.renderStart + this.ds.renderLength;
      const newBlock = this.cache.matchNewBlock(this.ds.renderStart, this.totalLength ? Math.min(renderEnd, this.totalLength) : renderEnd);
      if (!newBlock) {
        return false;
      }

      const infiniteScrollEvent = this.toInfiniteScrollChangeEvent(event, ...newBlock);

      const result = this.onTriggerCb(infiniteScrollEvent);
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
        map( values => this.updateCache(infiniteScrollEvent, values, newBlock[0] === 0) ),
      );
    }

    if (this.ds.hostGrid.viewport.isScrolling) {
      return this.ds.hostGrid.viewport.scrolling
        .pipe(
          debounceTime(100),
          filter( s => s === 0),
          take(1),
          switchMap( () => {
            const result = fn();
            return result === false ? of(this.ds.source) : result;
          })
        )
    } else {
      return fn();
    }
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

  private toInfiniteScrollChangeEvent(event: PblDataSourceTriggerChangedEvent<TData>, direction: -1 | 0 | 1, start: number, end: number): PblInfiniteScrollTriggerChangedEvent<TData> {
    event.updateTotalLength = (totalLength: number) => { this.totalLength = totalLength; };
    (event as PblInfiniteScrollTriggerChangedEvent).isInfiniteScroll = true;

    if (direction === 0) {
      direction = 1;
    }
    const offset = Math.max(this.ds.renderLength, this.options.minBlockSize) - 1;
    const fromRow = direction === 1 ? start : Math.max(0, end - offset);
    const toRow = direction === 1 ? start + offset : end;

    (event as PblInfiniteScrollTriggerChangedEvent).direction = direction;
    (event as PblInfiniteScrollTriggerChangedEvent).fromRow = fromRow;
    (event as PblInfiniteScrollTriggerChangedEvent).offset = offset + 1;
    (event as PblInfiniteScrollTriggerChangedEvent).toRow = toRow;
    return event as PblInfiniteScrollTriggerChangedEvent<TData>;
  }
}
