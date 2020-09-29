import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createInfiniteScrollDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-infinite-scroll-data-source-example',
  templateUrl: './infinite-scroll-data-source.component.html',
  styleUrls: ['./infinite-scroll-data-source.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-infinite-scroll-data-source-example', { title: 'Infinite Scroll Data Source' })
export class InfiniteScrollDataSourceExample {
  loading = false;

  columns = columnFactory()
    .table(
      { prop: 'id', width: '100px' },
      { prop: 'name', width: '100px' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date', width: '25%' },
    )
    .build();

  ds = createInfiniteScrollDS<Person>()
    .withInfiniteScrollOptions({
      minBlockSize: 100,
      initialDataSourceSize: 100,
    })
    .onTrigger(event => {
      if (!event.isInfiniteScroll) {
        event.updateTotalLength(200);
        return this.datasource.getPeople(0, 100);
      } else {
        console.log(`GET: FROM [${event.fromRow}] - OFFSET [${event.offset}] - TO [${event.toRow}]`);
        this.loading = true;
        const total = event.fromRow + event.offset;
        if (event.isLastBlock && event.totalLength < 1000) {
          event.updateTotalLength(Math.min(this.ds.length + total * 2, 1000));
        }

        return this.datasource.getPeople(500 + Math.random() * 1000, total)
          .then( people => {
            this.loading = false;
            console.log(`GOT: FROM [${event.fromRow}] - TO [${total}]`);
            return people.slice(event.fromRow, total); });
      }
    })
    .create();

  constructor(private datasource: DemoDataSource) { }
}
