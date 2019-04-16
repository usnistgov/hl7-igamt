import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-conflength-delta-col',
  templateUrl: './conflength-delta-col.component.html',
  styleUrls: ['./conflength-delta-col.component.css']
})
export class ConflengthDeltaColComponent implements OnInit {

  @Input() leaf: any;
  @Input() confLength: any;

  constructor() { }

  ngOnInit() {
  }

}
