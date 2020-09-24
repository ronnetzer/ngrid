import { PblDataSourceTriggerChangedEvent, DataSourceOf, PblDataSource } from '../data-source/index';

export interface PblInfiniteScrollFactoryHandlers<T, TData = any> {
  onTrigger: (event: PblDataSourceTriggerChangedEvent<TData>) => (false | DataSourceOf<T>);
  onCreated?: (dataSource: PblDataSource<T, TData>) => void;
}

export interface PblInfiniteScrollDsOptions {
  /**
   * The minimum block size to calculate.
   * @default 0 (no minimum)
   */
  minBlockSize?: number;

  initialDataSourceSize?: number;
}

export interface PblInfiniteScrollTriggerChangedEvent<T = any> extends PblDataSourceTriggerChangedEvent<T> {
  /**
   * When true, indicates that the event has originated from an infinite scrolling logic.
   * The is a need to add more rows.
   *
   * Note that events can come from multiple sources, for example: changing a datasource or calling `DataSource.refresh()`
   */
  isInfiniteScroll?: boolean;

  /** The starting row index of the items to fetch */
  fromRow: number;
  /** The ending row index of the items to fetch */
  toRow: number;
  /** The total amount of new items to fetch */
  offset: number;

  direction: -1 | 1;
}
