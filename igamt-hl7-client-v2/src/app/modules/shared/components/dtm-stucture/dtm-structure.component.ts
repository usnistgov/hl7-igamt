import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { IResource } from '../../models/resource.interface';
import { IChange, ChangeType, PropertyType } from '../../models/save-change';
import {SelectItem} from 'primeng/api';

@Component({
  selector: 'app-dtm-structure',
  templateUrl: './dtm-structure.component.html',
  styleUrls: ['./dtm-structure.component.scss'],
})
export class DtmStructureComponent implements OnInit, OnDestroy {

  resource$: Observable<IResource>;
  dateTimeConstraints : any;

  usageOptions: SelectItem[];

  @Input()
  set resource(resource: IResource) {
    this.resource$ = of(resource);
    this.dateTimeConstraints = resource.dateTimeConstraints;

    if(this.dateTimeConstraints === null || this.dateTimeConstraints.dateTimeComponentDefinitions === null) {
      if(resource.name === 'DTM') {
        this.dateTimeConstraints = {
          dateTimeComponentDefinitions: [
            {position: 1, name: "Year", format: "YYYY", usage: "R"},
            {position: 2, name: "Month", format: "MM", usage: "O"},
            {position: 3, name: "Day", format: "DD", usage: "O"},
            {position: 4, name: "Hour", format: "hh", usage: "O"},
            {position: 5, name: "Minute", format: "mm", usage: "O"},
            {position: 6, name: "Second", format: "ss", usage: "O"},
            {position: 7, name: "1/10 second", format: "s...", usage: "O"},
            {position: 8, name: "1/100 second", format: ".s..", usage: "O"},
            {position: 9, name: "1/1000 second", format: "..s.", usage: "O"},
            {position: 10, name: "1/10000 second", format: "...s", usage: "O"},
            {position: 11, name: "Time Zone", format: "+/-ZZZZ", usage: "O", trueUsage: null}
          ]
        };
      } else if(resource.name === 'DT') {
        this.dateTimeConstraints = {
          dateTimeComponentDefinitions: [
            {position: 1, name: "Year", usage: "R", trueUsage: null},
            {position: 2, name: "Month", usage: "O", trueUsage: null},
            {position: 3, name: "Day", usage: "C", trueUsage: "O"},
            {position: 11, name: "Time Zone", usage: "O", trueUsage: null}
          ]
        };
      }  else if(resource.name === 'TM') {
        this.dateTimeConstraints = {
          dateTimeComponentDefinitions: [
            {position: 1, name: "Hour", usage: "C", trueUsage: "O"},
            {position: 2, name: "Minute", usage: "C", trueUsage: "O"},
            {position: 3, name: "Second", usage: "C", trueUsage: "O"},
            {position: 4, name: "1/10 second", usage: "C", trueUsage: "O"},
            {position: 5, name: "1/100 second", usage: "C", trueUsage: "O"},
            {position: 6, name: "1/1000 second", usage: "C", trueUsage: "O"},
            {position: 10, name: "1/10000 second", usage: "C", trueUsage: "O"}
          ]
        };
      }
    }
  }

  @Output()
  changes: EventEmitter<IChange>;
  changes$: Observable<IChange>;

  constructor() {
    this.changes = new EventEmitter<IChange>();
    this.changes$ = this.changes.asObservable();

    this.usageOptions = [
      {label:'R', value: 'R'},
      {label:'RE', value: 'RE'},
      {label:'O', value: 'O'},
      {label:'X', value: 'X'}
    ];
  }

  close(s: Subscription) {
    if (s && !s.closed) {
      s.unsubscribe();
    }
  }

  makeX(position:number) {
    this.dateTimeConstraints.dateTimeComponentDefinitions.forEach(item => {
      if(item.position > position && item.position !== 11) {
        item.usage = 'X';
      }
    });
  }

  makeR(position:number) {
    this.dateTimeConstraints.dateTimeComponentDefinitions.forEach(item => {
      if(item.position < position && item.position !== 11) {
        item.usage = 'R';
      }
    });
  }

  makeRE(position:number) {
    this.dateTimeConstraints.dateTimeComponentDefinitions.forEach(item => {
      if(item.position < position && item.position !== 11) {
        if(item.usage !== 'R') {
          item.usage = 'RE';
        }
      }
      if(item.position > position && item.position !== 11) {
        if(item.usage === 'R') {
          item.usage = 'RE';
        }
      }
    });
  }

  makeO(position:number) {
    this.dateTimeConstraints.dateTimeComponentDefinitions.forEach(item => {
      if(item.position < position && item.position !== 11) {
        if(item.usage !== 'R') {
          item.usage = 'RE';
        }
      }
      if(item.position > position && item.position !== 11) {
        if(item.usage === 'R' || item.usage === 'RE') {
          item.usage = 'O';
        }
      }
    });
  }


  simpleFormatter() {
    return '' +
        '<ul>' +
        '<li>YYYY[MM[DD[hh[mm[ss[.s[s[s[s]]]]]]]]]</li>' +
        '<li>Element \'DTM\' value SHALL follow the Date/Time pattern \'YYYY[MM[DD[hh[mm[ss[.s[s[s[s]]]]]]]]]\'.</li>' +
        '<li>^(\\d{4}|\\d{6}|\\d{8}|\\d{10}|\\d{12}|\\d{14}|\\d{14}\.\\d|\\d{14}\.\\d{2}|\\d{14}\.\\d{3}|\\d{14}\.\\d{4})$</li>' +
        '</ul>' ;
  }

  getPrevious(position:number){
    if(position === 2) return 'Year';
    if(position === 3) return 'Month';
    if(position === 4) return 'Day';
    if(position === 5) return 'Hour';
    if(position === 6) return 'Minute';
    if(position === 7) return 'Second';
    if(position === 8) return '1/10 second';
    if(position === 9) return '1/100 second';
    if(position === 10) return '1/1000 second';
  }

  timeZoneUsageChange(event: any, location:string, target:any): void {
    this.changes.emit({
      location: 'DTM',
      propertyType: PropertyType.DTMSTRUC,
      propertyValue: this.dateTimeConstraints.dateTimeComponentDefinitions,
      oldPropertyValue: null,
      position: null,
      changeType: ChangeType.UPDATE
    });
  }

  usageChange(event: any, location:string, target:any): void {
    if(event.value === 'X') {
      this.makeX(target.position);
    }

    if(event.value === 'R') {
      this.makeR(target.position);
    }

    if(event.value === 'RE') {
      this.makeRE(target.position);
    }

    if(event.value === 'O') {
      this.makeO(target.position);
    }

    this.changes.emit({
      location: 'DTM',
      propertyType: PropertyType.DTMSTRUC,
      propertyValue: this.dateTimeConstraints.dateTimeComponentDefinitions,
      oldPropertyValue: null,
      position: null,
      changeType: ChangeType.UPDATE
    });
  }

  ngOnDestroy() {
  }

  ngOnInit() {
  }
}
