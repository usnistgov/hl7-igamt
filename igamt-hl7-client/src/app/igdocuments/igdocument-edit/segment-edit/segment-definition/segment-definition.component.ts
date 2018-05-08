import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector : 'segment-definition',
  templateUrl: './segment-definition.component.html'
})
export class SegmentDefinitionComponent {

  segmentDefTabs : any[];

  constructor(private route : ActivatedRoute){}

  ngOnInit(){
  }
}
