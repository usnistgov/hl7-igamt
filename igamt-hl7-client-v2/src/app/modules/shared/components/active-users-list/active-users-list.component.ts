import { Component, Input, OnInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { SharePermission } from './../../models/abstract-domain.interface';

export interface IActiveUser {
  username: string;
  mode: SharePermission;
  id: string;
}

@Pipe({
  name: 'firstLetter',
})
export class FirstLetterPipe implements PipeTransform {
  transform(username: string): any {
    return username[0].toUpperCase();
  }
}

@Component({
  selector: 'app-active-users-list',
  templateUrl: './active-users-list.component.html',
  styleUrls: ['./active-users-list.component.scss'],
})
export class ActiveUsersListComponent implements OnInit {

  @Input()
  users: IActiveUser[];
  @Input()
  active: string;
  colors = ['#e6f9ff', '#f8ffe6', '#ffe6e8'];

  constructor() { }

  ngOnInit() {
  }

}
