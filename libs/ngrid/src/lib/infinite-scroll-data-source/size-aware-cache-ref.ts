type StartOrEnd = -1 | 1;

export class SizeAwareCacheRef {

  get size(): number { return this.end - this.start + 1; }
  get empty() { return this.size === 0; }

  private maxSize = 0;
  private lastAdd: StartOrEnd | undefined;

  constructor(public end: number = -1, public start: number = 0) { }

  clone() {
    const cloned = new SizeAwareCacheRef(this.end, this.start);
    cloned.maxSize = this.maxSize;
    cloned.lastAdd = this.lastAdd;
    return cloned;
  }

  /**
   * Set the new max size for this cache.
   * @returns When new max size is bigger the old & current size violates the new max size, return the number of items trimmed from the cache
   * with positive value if trimmed from end, negative value if trimmed from start. Otherwise returns 0.
   */
  setMaxSize(maxSize: number, trimHint?: StartOrEnd) {
    this.maxSize = Math.max(0, maxSize);
    return this.alignBoundary(trimHint || this.lastAdd || 1);
  }

  /**
   *
   * @returns When the size of the added items plug size of current cached items is bigger them maximum size return
   * the number of items trimmed from the cache with positive value if trimmed from end, negative value if trimmed from start.
   * Otherwise returns 0.
   */
  add(len: number): number {
    if (this.empty) {
      if (len < 0) {
        throw new Error('Must be a positive number when cache is empty.');
      }
      this.end = len - 1;
      return this.alignBoundary(1);
    } else if (len < 0) {
      this.start -= Math.min(this.start + len, 0) - len;
      return this.alignBoundary(-(this.lastAdd = -1) as any);
    } else if (len > 0) {
      this.end += len;
      return this.alignBoundary(-(this.lastAdd = 1) as any);
    }
  }

  clear() {
    this.lastAdd = undefined;
    this.start = 0;
    this.end = -1;
  }

  private oversize() {
    return this.maxSize ? Math.max(this.size - this.maxSize, 0) : 0;
  }

  /**
   * Align the cache to fix max size.
   * @returns the number of items trimmed from the cache with positive value if trimmed from end, negative value if trimmed from start.
  */
  private alignBoundary(trimFrom: StartOrEnd): number {
    const oversize = this.oversize();
    if (oversize) {
      if (trimFrom === 1) {
        this.end -= oversize;
      } else {
        this.start += oversize;
        return -oversize;
      }
    }
    return oversize;
  }
}
