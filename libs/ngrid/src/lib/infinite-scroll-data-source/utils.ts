import { PblInfiniteScrollDsOptions } from './infinite-scroll-datasource.types';

export function normalizeOptions(rawOptions: PblInfiniteScrollDsOptions) {
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
