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
   * The total length currently defined
   */
  totalLength: number;

  /**
   * When true, indicates that the event has originated from an infinite scrolling logic.
   * The is a need to add more rows.
   *
   * Note that events can come from multiple sources, for example: changing a datasource or calling `DataSource.refresh()`
   */
  isInfiniteScroll?: boolean;

  /**
   * When true, indicates that the fetching is done for the last block / page in the datasource.
   * It means that the this trigger event will fetch the items located at the end of the data source.
   *
   * This situation depends on the block size and `PblInfiniteScrollDsOptions.minBlockSize` definition and
   * the fact that a datasource size is defined either through `PblInfiniteScrollDsOptions.initialDataSourceSize` or
   * dynamically through `PblDataSourceTriggerChangedEvent.updateTotalLength()`.
   *
   * You can use this flag to detect this scenario and extend / enlarge the datasource total size if needed.
   *
   * > Note that, on top of all of the above, this will only fire when `direction` is 1.
   */
  isLastBlock?: boolean;

  /** The starting row index of the items to fetch */
  fromRow: number;
  /** The ending row index of the items to fetch */
  toRow: number;
  /** The total amount of new items to fetch */
  offset: number;
  /**
   * The direction of scrolling.
   * Where 1 means scrolling down and -1 means scrolling up.
   */
  direction: -1 | 1;
}
