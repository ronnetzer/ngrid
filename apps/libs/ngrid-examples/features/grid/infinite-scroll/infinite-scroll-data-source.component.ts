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
      { prop: 'name', width: '100px', editable: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date', width: '25%' },
    )
    .build();

  ds = createInfiniteScrollDS<Person>()
    .withInfiniteScrollOptions({
      minBlockSize: 100,
      initialDataSourceSize: 500,
    })
    .onTrigger(event => {
      if (!event.isInfiniteScroll) {
        event.updateTotalLength(1000); // Assume we got a pagination object saying we have 1000 items
        return this.datasource.getPeople(0, 100);
      } else {
        this.loading = true;
        const total = event.fromRow + event.offset;

        if (event.isLastBlock && event.totalLength < 1000) {
          event.updateTotalLength(Math.min(this.ds.length + total * 2, 1000));
        }

        return this.datasource.getPeople(500 + Math.random() * 1000, total)
          .then( people => {
            this.loading = false;
            return people.slice(event.fromRow, total); });
      }
    })
    .create();

  constructor(private datasource: DemoDataSource) { }
}
