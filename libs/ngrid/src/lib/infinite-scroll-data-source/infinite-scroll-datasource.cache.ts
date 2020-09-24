import { PblDataSource } from '../data-source/index';
import { PblInfiniteScrollTriggerChangedEvent } from './infinite-scroll-datasource.types';
import { SizeAwareCacheRef } from './size-aware-cache-ref';

export class PblInfiniteScrollDataSourceCache<T, TData = any> {

  cached = new SizeAwareCacheRef();

  chunkSize: number = 50;
  maxChunks: number = 5;

  constructor(private readonly ds: PblDataSource<T, TData>) {
    this.cached.setMaxSize(this.maxChunks * this.chunkSize);
  }

  clone() {
    const cloned = new PblInfiniteScrollDataSourceCache<T, TData>(this.ds);
    cloned.chunkSize = this.chunkSize;
    cloned.maxChunks = this.maxChunks;
    cloned.cached = this.cached.clone();
    return cloned;
  }

   reset(end: number = -1) {
    if (end > 0) {
      this.cached = new SizeAwareCacheRef(end);
      this.cached.setMaxSize(this.maxChunks * this.chunkSize);
    } else {
      this.cached.clear();
    }
  }

  /**
   * Returns a tuple indicating if a block extends the current cache boundaries.
   * The returned tuple contains 3 elements:
   *
   * - [0] Where the cache is extended, where -1 is at the start and 1 is at the end
   * - [1] The start index of the new block
   * - [2] The end index of the new block
   *
   * Note that the returned block does not overlap with existing cache items, i.e. if the provided block will partially overlap
   * the cache, the overlap is trimmed.
   *
   * If there is no match, returns undefined.
   * No match can happen when:
   * - The entire block is already cached
   *
   * If the matched blocked exists without a sibling to the current cache the value a [0] will return 0
   * @param start
   * @param end
   */
  matchNewBlock(start: number, end: number): [-1 | 0 |  1, number, number] | undefined { // TODO: refactor to labeled tuple types in TS 4.0
    if (this.cached.empty) {
      return [1, start, end];
    }

    if (start < this.cached.start && end >= this.cached.start - 1) {
      return [-1, start, this.cached.start -1];
    }
    if (end > this.cached.end && start <= this.cached.end + 1) {
      return [1, this.cached.end + 1, end];
    }
    if (end < this.cached.start && start < end) {
      return [0, start, end];
    }
    if (start > this.cached.end && end > start) {
      return [0, start, end];
    }
  }

  set(event: PblInfiniteScrollTriggerChangedEvent<TData>) {
    const { fromRow, toRow } = event;
    this.cached.start = fromRow;
    this.cached.end = toRow;
  }

  update(event: PblInfiniteScrollTriggerChangedEvent<TData>) {
    const { fromRow, toRow } = event;
    if (this.cached.empty) {
      this.cached.start = fromRow;
      this.cached.end = toRow;
      return 0;
    } else {
      if (event.direction === -1) {
        const offset = this.cached.start - fromRow;
        return this.cached.add(-offset);
      } else if (event.direction === 1) {
        const offset = toRow - this.cached.end;
        return this.cached.add(offset);
      } else {
        throw new Error('Cache Error');
      }
    }
  }

}
