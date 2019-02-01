import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {PrimeDialogAdapter} from '../prime-ng-adapters/prime-dialog-adapter';
import * as __ from 'lodash';



@Component({
  selector: 'app-cs-dialog',
  templateUrl: './cs-dialog.component.html',
  styleUrls: ['./cs-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CSDialogComponent extends PrimeDialogAdapter implements OnInit {
  backUp:any;
  cs:any;

  constructor(private sanitizer: DomSanitizer) {
    super();
    super.hook(this);
  }

  onDialogOpen() {
    if (!this.cs) {
      this.initPattern();
    }

    this.backUp = __.cloneDeep(this.cs);
  }

  reset() {
    this.cs = __.cloneDeep(this.backUp);
  }

  cancel() {
    this.dismissWithNoData();
  }

  finish() {
    this.dismissWithData(this.cs);
    this.cs = null;
  }

  initPattern() {
    this.cs = {};
  }

  ngOnInit() {

  }
}


