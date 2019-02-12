import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-datatype-delta-col',
  templateUrl: './datatype-delta-col.component.html',
  styleUrls: ['./datatype-delta-col.component.css']
})
export class DatatypeDeltaColComponent implements OnInit {

  @Input() datatypeLabel: any;

  constructor() { }

  ngOnInit() {
    // console.log(this.datatypeLabel[]);
  }

}
