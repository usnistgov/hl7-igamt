import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ISegment } from 'src/app/modules/shared/models/segment.interface';
import { selectedSegment } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { ICCHeaders } from '../../model/coconstraints.model';

@Component({
  selector: 'app-coconstraints-editor',
  templateUrl: './coconstraints-editor.component.html',
  styleUrls: ['./coconstraints-editor.component.scss'],
})
export class CoconstraintsEditorComponent implements OnInit {

  segment: Observable<ISegment>;

  constructor(
    public repository: StoreResourceRepositoryService,
    private store: Store<any>) {
    this.segment = store.select(selectedSegment);
  }

  sales: any[];
  coconstraints: any[];
  headers: ICCHeaders;

  selected($event) {
    console.log($event);
  }

  ngOnInit() {

    this.headers = {
      selectors: [],
      data: [],
      user: [],
    };
    this.sales = [
      { brand: 'Apple', lastYearSale: '51%', thisYearSale: '40%', lastYearProfit: '$54,406.00', thisYearProfit: '$43,342' },
      { brand: 'Samsung', lastYearSale: '83%', thisYearSale: '96%', lastYearProfit: '$423,132', thisYearProfit: '$312,122' },
      { brand: 'Microsoft', lastYearSale: '38%', thisYearSale: '5%', lastYearProfit: '$12,321', thisYearProfit: '$8,500' },
      { brand: 'Philips', lastYearSale: '49%', thisYearSale: '22%', lastYearProfit: '$745,232', thisYearProfit: '$650,323,' },
      { brand: 'Song', lastYearSale: '17%', thisYearSale: '79%', lastYearProfit: '$643,242', thisYearProfit: '500,332' },
      { brand: 'LG', lastYearSale: '52%', thisYearSale: ' 65%', lastYearProfit: '$421,132', thisYearProfit: '$150,005' },
      { brand: 'Sharp', lastYearSale: '82%', thisYearSale: '12%', lastYearProfit: '$131,211', thisYearProfit: '$100,214' },
      { brand: 'Panasonic', lastYearSale: '44%', thisYearSale: '45%', lastYearProfit: '$66,442', thisYearProfit: '$53,322' },
      { brand: 'HTC', lastYearSale: '90%', thisYearSale: '56%', lastYearProfit: '$765,442', thisYearProfit: '$296,232' },
      { brand: 'Toshiba', lastYearSale: '75%', thisYearSale: '54%', lastYearProfit: '$21,212', thisYearProfit: '$12,533' },
    ];

    this.coconstraints = [];
  }

}
