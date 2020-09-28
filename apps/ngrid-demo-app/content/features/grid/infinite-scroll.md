---
title: Infinite Scroll
path: features/grid/infinite-scroll
parent: features/grid
ordinal: 5
---
# Infinite Scroll

Infinite scrolling provides the feeling of an infinite grid where the user scroll and scrolls until no more data is available but the
data is loaded in incremental steps, every time the grid is scrolling to the end a new dataset is fetched from the server.

We've covered the 2 datasource modes and how we can use them, let's recap:

1. **Client Mode** 
The entire dataset is provided once. Sorting, pagination and filtering are done on the client without calling an external source.

2. **Server Mode**
The dataset is provided from the server in chunks. Sorting, pagination and filtering are done on the server.

**Infinite scrolling** is not a mode per-se as it can work with both modes above but it is actually used when working with the server.  

**Infinite scrolling** is an alternative to **pagination**, instead of the user having to click on a button/link to navigate between the next/pervious chunk of the dataset
with **Infinite scrolling** the next/pervious chunk is loaded automatically based on the user's scroll position.

## Infinite scrolling VS Virtual scrolling

Infinite scrolling & Virtual scrolling are often mis-understood:

- **Virtual scroll** enable the display of large datasets in the grid
- **Infinite scroll** enable seamless lazy loading of additional data rows into the grid  

Usually you will use both together, especially when using infinite scroll to add row (as opposed to replacing rows)

## Creating Infinite Scroll

For a simple experience it is relatively simple to create an infinite scrolling experience using the common grid API:

<div pbl-example-view="pbl-infinite-scroll-example"></div>

This should give you an idea what's going on and what is the logic.  
The basic idea does not change and from here it's just adding fancy stuff like caching, min/max, data normalization etc...
and creating a consistent developer experience when working with infinite scrolling.

## Infinite Scroll Data Source

**nGrid** comes with a built-in infinite scroll datasource that simplifies the logic and makes it simple
to define, mange and update infinite scroll grids.

To create an infinite scroll datasource we use `createInfiniteScrollDS()`.

`createInfiniteScrollDS` is similar to `createDS` with the exception of the trigger handler which is more rich
with data required to manage the lifecycle of an infinite scroll grid.

```typescript
 createInfiniteScrollDS<Person>()
    .onTrigger(event => {
      if (event.isInitial) { // first call to populate, not due to scrolling...
        return [];
      } else { // call's coming from user scrolling, more data rows needed
        return [];
      }
    })
    .create();
```

<div pbl-example-view="pbl-infinite-scroll-data-source-example"></div>

### Handling `onTrigger` Events

The event handler has the following additional properties:

```typescript
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
}
```

In addition, there is an optional infinite scroll options object you can define which controls the behavior of the infinite scroll.

