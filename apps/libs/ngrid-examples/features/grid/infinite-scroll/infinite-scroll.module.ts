import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { InfiniteScrollExample } from './infinite-scroll.component';
import { InfiniteScrollDataSourceExample } from './infinite-scroll-data-source.component';

@NgModule({
  declarations: [ InfiniteScrollExample, InfiniteScrollDataSourceExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    MatProgressBarModule,
    PblNgridModule,
  ],
  exports: [ InfiniteScrollExample, InfiniteScrollDataSourceExample ],
  entryComponents: [InfiniteScrollDataSourceExample],
})
@BindNgModule(InfiniteScrollExample, InfiniteScrollDataSourceExample)
export class InfiniteScrollExampleModule { }
