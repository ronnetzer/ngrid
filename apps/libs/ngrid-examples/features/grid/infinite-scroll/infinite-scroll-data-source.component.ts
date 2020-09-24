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
      initialDataSourceSize: 500,
    })
    .onTrigger(event => {
      if (!event.isInfiniteScroll) {
        event.updateTotalLength(1000);
        return this.datasource.getPeople(0, 100);
      } else {
        this.loading = true;
        console.log('GET ' + event.toRow);
        return this.datasource.getPeople(Math.random() * 1000, event.fromRow + event.offset)
          .then( people => { this.loading = false; console.log('GOT ', event.fromRow, event.offset, event.toRow); return people.slice(event.fromRow, event.fromRow + event.offset); });
      }
    })
    .create();

  constructor(private datasource: DemoDataSource) { }
}
