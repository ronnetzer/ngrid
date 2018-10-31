/* @neg-example:ex-column-1 */
/* @neg-example:ex-column-2 */
/* @neg-example:ex-column-3 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { createDS, columnFactory } from '@neg/table';

import { Person, DemoDataSource } from '@neg/demo-apps/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 200})
  .table(
    { prop: 'id', width: '40px' },
    { prop: 'name', width: '100px' },
    { prop: 'gender' },
    { prop: 'birthdate', type: 'date' },
    { prop: 'lead' },
    { prop: 'settings.avatar' },
    { prop: 'settings.background' },
    { prop: 'settings.timezone' },
    { prop: 'settings.emailFrequency' },
  )
  .header(
    { id: 'MULTI_HEADER_1', label: 'MULTI HEADER 1' },
  )
  .header(
    { id: 'MULTI_HEADER_2_1', label: 'MULTI HEADER 2: Col 1' },
    { id: 'MULTI_HEADER_2_2', label: 'MULTI HEADER 2: Col 2' },
  )
  .footer(
    { id: 'MULTI_FOOTER_1', label: 'This table is the property of Nobody & CO (LLC)' },
  )
  .build();

@Component({
  selector: 'neg-sticky-column-table-example-component',
  templateUrl: './sticky-column.component.html',
  styleUrls: ['./sticky-column.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickyColumnTableExampleComponent {

  columns1 = columnFactory().table(...COLUMNS.table).build();
  dataSource = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @neg-example:ex-column-3 */
/* @neg-example:ex-column-2 */
/* @neg-example:ex-column-1 */