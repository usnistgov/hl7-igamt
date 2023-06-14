import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatatypeEvolutionService} from './datatype-evolution.service';

@Component({
  selector: 'app-datatypes-evolution',
  templateUrl: './datatypes-evolution.component.html',
  styleUrls: ['./datatypes-evolution.component.css'],
})
export class DatatypesEvolutionComponent implements OnInit {

  constructor(private  ac: ActivatedRoute, private datatypeEvolutionService: DatatypeEvolutionService) { }

  classes: any;
  firstVersion: any;
  secondVersion: any;

  tableValue: any;
  selectedName: any;
  matrix: any;
  headers = [
    '#',
    '2.3.1',
    '2.4',
    '2.5',
    '2.5.1',
    '2.6',
    '2.7',
    '2.7.1',
    '2.8',
    '2.8.1',
    '2.8.2',
    '2.9'
  ];

  criterias = [
    {label: 'Name' , value: 'CPNAME'},
    {label: 'Usage' , value: 'CPUSAGE'},
    {label: 'DATATYPE' , value: 'CPDATATYPE'},
  ];

  ngOnInit() {
    console.log('calling on init ');
    this.classes = this.ac.snapshot.data['matrix'];
    console.log(this.classes);
    this.matrix = this.buildMatrix(this.classes);
  }

  buildMatrix(classes) {
    const result: any[] = [];

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < classes.length; i++) {
      const obj: any = {};
      obj['#'] = classes[i].name;

      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < classes[i].classes.length; j++) {

        // tslint:disable-next-line:prefer-for-of
        for (let v = 0; v < classes[i].classes[j].versions.length; v++) {

          obj[classes[i].classes[j].versions[v]] = classes[i].classes[j].position;

        }
      }
      result.push(obj);
    }
    console.log(result);
    return result;
  }

  compareOrSelect(name, version) {
    console.log(name);
    console.log(version);

    if (this.selectedName) {
      if (name === this.selectedName) {

        if (version === this.firstVersion || version === this.secondVersion) {
          this.firstVersion = null;
          this.selectedName = null;
          this.secondVersion = null;
        } else {
          this.secondVersion = version;
          this.tableValue = null;
          this.datatypeEvolutionService.compare(name, this.firstVersion, this.secondVersion).subscribe((x) => {
            this.tableValue = x;
          }, (error) => {

          });
        }
      } else {
        this.selectedName = name;
        this.firstVersion = version;
        this.secondVersion = null;
      }

    } else {

      this.selectedName = name;
      this.firstVersion = version;
      this.secondVersion = null;
    }

  }

  print(obj, col) {
    console.log(obj);
    console.log(col);

  }

  getStyle(index) {

    if (index === 0) {
      return {color : '#008B8B'};
    } else if (index === 1) {
      return {color: '#B8860B'};
    } else if (index === 2) {
      return {color: '#6495ED'};
    } else if (index === 3) {
      return {color: '#9932CC'};
    } else if (index === 4) {
      return {color: '#8FBC8F'};
    } else if (index === 5) {
      return {color: '#2F4F4F'};
    } else if (index === 6) {
      return {color: '#FF1493'};
    } else if (index === 7) {
      return {color: '#FFD700'};
    } else if (index === 8) {
      return {color: '#4B0082'};
    } else if (index === 9) {
      return {color: '#FFB6C1'};
    } else if (index === 10) {
      return {color: '#778899'};
    }

  }

}
