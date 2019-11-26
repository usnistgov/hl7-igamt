import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { IResource } from '../../models/resource.interface';
import { IChange, ChangeType, PropertyType } from '../../models/save-change';
import {SelectItem} from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dtm-structure',
  templateUrl: './dtm-structure.component.html',
  styleUrls: ['./dtm-structure.component.scss'],
})
export class DtmStructureComponent implements OnInit, OnDestroy {

  resource$: Observable<IResource>;
  dateTimeConstraints : any;

  usageOptions: SelectItem[];

  regexList: any;
  dtName: string;

  @Input()
  viewOnly: boolean;

  @Input()
  set resource(resource: IResource) {
    this.regexList = null;
    this.resource$ = of(resource);
    this.dateTimeConstraints = resource.dateTimeConstraints;



    if(this.viewOnly || !this.dateTimeConstraints || !this.dateTimeConstraints.dateTimeComponentDefinitions) {
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
            {position: 11, name: "Time Zone", format: "+/-ZZZZ", usage: "O"}
          ]
        };
      } else if(resource.name === 'DT') {
        this.dateTimeConstraints = {
          dateTimeComponentDefinitions: [
            {position: 1, name: "Year", format: "YYYY", usage: "R"},
            {position: 2, name: "Month", format: "MM", usage: "O"},
            {position: 3, name: "Day", format: "DD", usage: "O"},
          ]
        };
      }  else if(resource.name === 'TM') {
        this.dateTimeConstraints = {
          dateTimeComponentDefinitions: [
            {position: 1, name: "Hour", format: "hh", usage: "R"},
            {position: 2, name: "Minute", format: "mm", usage: "O"},
            {position: 3, name: "Second", format: "ss", usage: "O"},
            {position: 4, name: "1/10 second", format: "s...", usage: "O"},
            {position: 5, name: "1/100 second", format: ".s..", usage: "O"},
            {position: 6, name: "1/1000 second", format: "..s.", usage: "O"},
            {position: 7, name: "1/10000 second", format: "...s", usage: "O"},
            {position: 11, name: "Time Zone", format: "+/-ZZZZ", usage: "O"}
          ]
        };
      }
    }
    this.dtName = resource.name;
    this.loadRegexDataAndUpdateAssertion();
  }

  @Output()
  changes: EventEmitter<IChange>;
  changes$: Observable<IChange>;

  constructor(private http : HttpClient) {
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

  loadRegexDataAndUpdateAssertion() {
    if(!this.regexList) {
      this.http.get('assets/' + this.dtName + ' regex list.csv', {responseType: 'text'})
          .subscribe(data => {
            this.regexList = {};
            for (const line of data.split(/[\r\n]+/)){

              let lineSplits = line.split(',');
              let key = lineSplits[0] + '-' + lineSplits[1] + '-' + lineSplits[2];

              this.regexList[key] = {
                format : lineSplits[3],
                errorMessage : lineSplits[4],
                regex : lineSplits[5]
              };
            }

            this.updateAssertion();
          });
    } else {
      this.updateAssertion();
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
        if(item.usage !== 'R' && item.usage !== 'RE') {
          item.usage = 'O';
        }
      }
      if(item.position > position && item.position !== 11) {
        if(item.usage === 'R' || item.usage === 'RE') {
          item.usage = 'O';
        }
      }
    });
  }


  updateAssertion() {
    if(this.regexList) {
      let countR = 0;
      let countX = 0;
      let timeZoneUsage = null;
      this.dateTimeConstraints.dateTimeComponentDefinitions.forEach(item => {
        if(item.usage === 'R' && item.position !== 11) countR++;
        if(item.usage === 'X' && item.position !== 11) countX++;
        if(item.position === 11) timeZoneUsage = item.usage;
      });

      if(!timeZoneUsage) timeZoneUsage = 'X';
      if(timeZoneUsage !== 'R' && timeZoneUsage !== 'X') timeZoneUsage = 'REO';


      let key = countR + '-' + countX + '-' + timeZoneUsage;


      if(this.regexList[key]) {
        this.dateTimeConstraints.simplePattern = this.regexList[key].format;
        this.dateTimeConstraints.errorMessage = this.regexList[key].errorMessage;
        this.dateTimeConstraints.regex = this.regexList[key].regex;
      }
    }
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
    this.loadRegexDataAndUpdateAssertion();
    this.updateChanges();
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

    this.loadRegexDataAndUpdateAssertion();
    this.updateChanges();
  }

  updateChanges(){
    this.changes.emit({
      location: this.dtName ,
      propertyType: PropertyType.DTMSTRUC,
      propertyValue: this.dateTimeConstraints,
      oldPropertyValue: null,
      position: null,
      changeType: ChangeType.UPDATE
    });

  }

  ngOnDestroy() {
  }

  ngOnInit() {
  }

  getLogSize() {
    if(this.dtName === 'DTM') return 300;
    if(this.dtName === 'DT') return 100;
    if(this.dtName === 'TM') return 200;
  }
}
