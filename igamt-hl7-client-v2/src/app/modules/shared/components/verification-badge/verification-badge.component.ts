import { IVerificationEnty } from './../../../dam-framework/models/data/workspace';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { elementStart } from '@angular/core/src/render3';
import * as _ from 'lodash';

@Component({
  selector: 'app-verification-badge',
  templateUrl: './verification-badge.component.html',
  styleUrls: ['./verification-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerificationBadgeComponent implements OnInit {

  serverity: string;
  number: number;
  style: string;
  color: string;

  elments: IVerificationEnty[];

  @Input()
  set verification(elments: IVerificationEnty[] ){
    this.elments = elments;
    this.number = elments.length;
    if(elments){
      let group = _.groupBy(elments, 'severity');
      if(group['FATAL']){
      //  this.number = group['FATAL'].length;
      this.color= 'red';
        this.style = 'fa fa fa-exclamation';
      } else if(group['ERROR']){
        //this.number = group['ERROR'].length;
        this.style = 'fa fa fa-exclamation-circle';
        this.color = 'red';
      }else if (group['WARNING']){
       // this.number = group['WARNING'].length;
        this.style = 'fa fa-exclamation-triangle';
        this.color = '#bb990c';
      }else {
        this.style = 'fa fa-check';
        this.color = 'green';
      }
    }

  }

  constructor() { }

  ngOnInit() {
  }

  print(){
    console.log(this.elments);
  }

}
