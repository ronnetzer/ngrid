import { from, isObservable, Observable, of } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { PblDataSourceTriggerChangedEvent, DataSourceOf, PblDataSource, SKIP_SOURCE_CHANGING_EVENT } from '../data-source/index';
import { PblInfiniteScrollFactoryHandlers, PblInfiniteScrollDsOptions, PblInfiniteScrollTriggerChangedEvent } from './infinite-scroll-datasource.types';
import { PblInfiniteScrollDataSourceCache } from './infinite-scroll-datasource.cache';
import { INFINITE_SCROLL_DEFFERED_ROW } from './infinite-scroll-deffered-row';
import { PblInfiniteScrollDataSourceTriggerRuntime, PblInfiniteScrollDataSourceTriggerRuntimeContext } from './infinite-scroll-datasource.trigger-runtime';
import { normalizeOptions } from './utils';

class UpdatePlaceholder<T> {
  public returnSelf: boolean;
  constructor (public result: false | Observable<T[]>, public event?: PblInfiniteScrollTriggerChangedEvent<any>) { }

  shouldUpdate(ds: PblDataSource<T>) {
    return this.event.totalLength > this.event.toRow && ds.source[ds.source.length - 1] !== INFINITE_SCROLL_DEFFERED_ROW;
  }

  updatePlaceholders(ds: PblDataSource<T>, minBlockSize: number) {
    const len = Math.min(ds.source.length + minBlockSize - 1, this.event.totalLength);
    for (let i = ds.source.length; i < len; i++) {
      ds.source[i] = INFINITE_SCROLL_DEFFERED_ROW;
    }
  }
}

class PblInfiniteScrollDSContext<T, TData = any> implements PblInfiniteScrollDataSourceTriggerRuntimeContext<T, TData> {

  public ds: PblDataSource<T, TData>;
  public options: PblInfiniteScrollDsOptions;
  public totalLength: number;
  public cache: PblInfiniteScrollDataSourceCache<T, TData>;

  private lastEvent: PblInfiniteScrollTriggerChangedEvent<TData>;
  private triggerRuntime: PblInfiniteScrollDataSourceTriggerRuntime<T, TData>;

  private updatePlaceholder: UpdatePlaceholder<T>;

  constructor(private internalHandlers: PblInfiniteScrollFactoryHandlers<T, TData>, options: PblInfiniteScrollDsOptions | undefined) {
    this.options = normalizeOptions(options);
    if (this.options.initialDataSourceSize > 0) {
      this.totalLength = this.options.initialDataSourceSize;
    }
  }

  onCreated(dataSource: PblDataSource<T, TData>): void {
    this.ds = dataSource;
    this.cache = new PblInfiniteScrollDataSourceCache<T, TData>(dataSource);
    dataSource.onRenderedDataChanged.subscribe(() => this.onRenderedDataChanged() );
    if (this.internalHandlers.onCreated) {
      this.internalHandlers.onCreated(dataSource);
    }
  }

  onTrigger(rawEvent: PblDataSourceTriggerChangedEvent<TData>): false | DataSourceOf<T> {
    rawEvent[SKIP_SOURCE_CHANGING_EVENT] = true;
    if (this.updatePlaceholder) {
      const updatePlaceholder = this.updatePlaceholder;
      this.updatePlaceholder = undefined;
      if (rawEvent.data.changed && (rawEvent.data.curr as any) === updatePlaceholder && updatePlaceholder.result !== false) {
        return updatePlaceholder.result
          .pipe(finalize(() => {
            setTimeout(() => this.ds.hostGrid._cdkTable.syncRows('data', true), 16);
            this.triggerRuntime = undefined;
          }));
      }
    }
    if (rawEvent.data.changed && rawEvent.data.curr instanceof UpdatePlaceholder) {
      if (rawEvent.data.curr.returnSelf) {
        return of(this.ds.source)
          .pipe(finalize(() => {
            setTimeout(() => this.ds.hostGrid._cdkTable.syncRows('data', true), 0);
          }));
      } else {
        return false;
      }
    }

    if (this.triggerRuntime && this.triggerRuntime.shouldHandleTrigger(rawEvent)) {
      if (this.ds.hostGrid.viewport.isScrolling) {
        this.xyz(rawEvent);
        return false;
      }

      let update = this.invokeRuntimeOnTrigger(rawEvent);
      if (update.result === false) {
        this.triggerRuntime = undefined;
        return false;
      } else {
        if (update.shouldUpdate(this.ds)) {
          for (let i = this.ds.source.length, len = Math.min(this.ds.source.length + this.options.minBlockSize - 1, update.event.totalLength); i < len; i++) {
            this.ds.source[i] = INFINITE_SCROLL_DEFFERED_ROW;
          }
          this.updatePlaceholder = update;
          return of(this.ds.source)
            .pipe(finalize(() => {
              setTimeout(() => this.ds.hostGrid._cdkTable.syncRows('data', true) , 16);
              this.triggerRuntime = undefined;
              this.ds.refresh(this.updatePlaceholder as any);
            }));
        } else {
          return update.result
            .pipe(finalize(() => {
              setTimeout(() => this.ds.hostGrid._cdkTable.syncRows('data', true) , 16);
              this.triggerRuntime = undefined;
            }));
        }
      }
    } else {
      rawEvent[SKIP_SOURCE_CHANGING_EVENT] = false;
      const result = this.internalHandlers.onTrigger(this.lastEvent || (this.lastEvent = this.createChangeEvent(rawEvent)));
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
      this.triggerRuntime = PblInfiniteScrollDataSourceTriggerRuntime.tryCreate(this, this.internalHandlers.onTrigger);
    }
  }

  private xyz(rawEvent: PblDataSourceTriggerChangedEvent<TData>) {
    const { event } = this.tryGetInfiniteEvent(rawEvent);
    if (event !== false) {
      const uph = new UpdatePlaceholder(false, event);
      if (uph.shouldUpdate(this.ds)) {
        uph.updatePlaceholders(this.ds, this.options.minBlockSize);
      }
      uph.returnSelf = true;
      this.ds.refresh(uph as any);
    }
    setTimeout(() => {
      const update = this.invokeRuntimeOnTrigger(rawEvent);
      if (update.result === false) {
        update.result = of(this.ds.source);
      }
      this.updatePlaceholder = update;
      this.ds.refresh(this.updatePlaceholder as any);
    }, 16);
  }

  private invokeRuntimeOnTrigger(rawEvent: PblDataSourceTriggerChangedEvent<TData>) {
    const { newBlock, event } = this.tryGetInfiniteEvent(rawEvent);
    if (event === false) {
      return new UpdatePlaceholder<T>(false);
    } else {
      const result = this.triggerRuntime.onTrigger(event, newBlock[0] === 0);
      return new UpdatePlaceholder<T>(result, event);
    }
  }

  private tryGetInfiniteEvent(rawEvent: PblDataSourceTriggerChangedEvent<TData>) {
    const renderEnd = this.ds.renderStart + this.ds.renderLength;
    const newBlock = this.cache.matchNewBlock(this.ds.renderStart, this.totalLength ? Math.min(renderEnd, this.totalLength) : renderEnd);
    if (!newBlock) {
      return { newBlock, event: false as const };
    }

    let event = this.createChangeEvent(rawEvent, newBlock);
    if (!event) {
      return { newBlock, event: false as const };
    }

    event.updateTotalLength = (totalLength: number) => { this.totalLength = totalLength; };
    return { newBlock, event };
  }

  private createChangeEvent(event: PblDataSourceTriggerChangedEvent<TData>, blockMatchResult?: ReturnType<PblInfiniteScrollDataSourceCache<T>['matchNewBlock']>): PblInfiniteScrollTriggerChangedEvent<TData> {
    event.updateTotalLength = (totalLength: number) => { this.totalLength = totalLength; };
    (event as PblInfiniteScrollTriggerChangedEvent).setMinBlockSize = value => this.options.minBlockSize = value;

    if (blockMatchResult) {
      return PblInfiniteScrollDataSourceTriggerRuntime.createInfiniteScrollChangeEvent(event, this, ...blockMatchResult);
    } else {
      const offset = Math.max(this.ds.renderLength, this.options.minBlockSize) - 1;
      const fromRow = this.ds.length;
      const toRow = fromRow + offset;

      (event as PblInfiniteScrollTriggerChangedEvent).totalLength = this.totalLength || 0;
      (event as PblInfiniteScrollTriggerChangedEvent).direction = 1;
      (event as PblInfiniteScrollTriggerChangedEvent).fromRow = fromRow;
      (event as PblInfiniteScrollTriggerChangedEvent).offset = offset + 1;
      (event as PblInfiniteScrollTriggerChangedEvent).toRow = toRow;
    }

    return event as PblInfiniteScrollTriggerChangedEvent<TData>;
  }
}

export function createInfiniteScrollDSContext<T, TData = any>(internalHandlers: PblInfiniteScrollFactoryHandlers<T, TData>, options: PblInfiniteScrollDsOptions | undefined) {
  const context = new PblInfiniteScrollDSContext(internalHandlers, options);

  const onCreated = (dataSource: PblDataSource<T, TData>) => context.onCreated(dataSource);
  const onTrigger = (event: PblInfiniteScrollTriggerChangedEvent<TData>): false | DataSourceOf<T> => context.onTrigger(event);

  return { onTrigger, onCreated };
}
