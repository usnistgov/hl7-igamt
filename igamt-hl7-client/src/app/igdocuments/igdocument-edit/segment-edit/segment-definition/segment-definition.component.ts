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
    this.segmentDefTabs = [
      {label: 'Pre-text', routerLink:'./pre'},
      {label: 'Structure', routerLink:'./structure'},
      {label: 'Post-text', routerLink:'./post'},
      {label: 'Conf. Statements', routerLink:'./confstatements'},
      {label: 'Predicates', routerLink:'./predicates'},
      {label: 'Co-constraints', routerLink : './coconstraints'}
    ];
  }
}
