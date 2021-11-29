import {Component, Input, OnInit} from '@angular/core';
import {EntityDelta} from '../service/delta.service';
import {TocService} from '../../../igdocuments/igdocument-edit/service/toc.service';

@Component({
  selector: 'app-delta-header',
  templateUrl: './delta-header.component.html',
  styleUrls: ['./delta-header.component.css']
})
export class DeltaHeaderComponent implements OnInit {

  @Input() data: EntityDelta;
  title: string;

  constructor(private toc: TocService) {}

  ngOnInit() {
    console.log(this.data);
    this.toc.metadata.subscribe(
      next => {
        this.title = next.title;
      }
    );
  }

}
