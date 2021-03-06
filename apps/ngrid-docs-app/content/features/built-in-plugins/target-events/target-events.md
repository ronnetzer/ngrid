---
title: Target Events
path: features/built-in-plugins/target-events
parent: features/built-in-plugins
ordinal: 0
---
# Target Events

The `target-events` plugin add support for mouse / keyboard event.

By default all grid have no support for such events and we can add them in several ways:

- By adding one of the `target-events` directive to `pbl-ngrid` hosts (`targetEvents` or any other click event e.g `(cellClick)`, `(rowClick)` etc...)
- By applying the plugin programmatically to a specific grid or to **ALL** grids automatically

In addition to mouse / keyboard support, `target-events` also add **focus** and **range selection** integration
using the mouse and keyboard. Focus and range selection support already exists in grid but `target-events` exposes them to the user.

## Plugin Options

This plugin provides a global configuration group under the name `targetEvents`.

I> If you're unfamiliar with global configurations and configuration groups, [read about it here](../../../features/grid/global-settings)

### Auto Enable

To automatically enable `target-events` for all grids we use the configuration service:

```typescript

@NgModule({
  imports: [ PblNgridModule, PblNgridTargetEventsModule ]
})
export class MyAppRootModule {
  constructor(config: PblNgridConfigService) {
    config.set('targetEvents', { autoEnable: true });
  }
}
```

## Focus & Range Selection

Once `target-events` is bound to a grid, focus and selection support are enable by default.

However, they will not work unless the `focusMode` of the grid is set to `cell`:

```html
<pbl-ngrid targetEvents focusMode="cell"></pbl-ngrid>
```

Or, if we auto-enabled target events globally:

```html
<pbl-ngrid focusMode="cell"></pbl-ngrid>
```

<div pbl-example-view="pbl-focus-and-range-selection-example"></div>

The plugin is used the ContextApi to support mouse & keyboard behavior, you can read more about the API and working with focus & range selection [here](../../grid/focus-and-selection).

## Events

<div pbl-example-view="pbl-target-events-example"></div>

<div pbl-example-view="pbl-enter-and-leave-events-example" containerClass="mat-elevation-z7"></div>
