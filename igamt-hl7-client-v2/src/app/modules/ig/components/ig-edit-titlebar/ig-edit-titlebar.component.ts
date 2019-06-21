import { Component, Input, OnInit } from '@angular/core';
import { IDomainInfo } from '../../../shared/models/domain-info.interface';

@Component({
  selector: 'app-ig-edit-titlebar',
  templateUrl: './ig-edit-titlebar.component.html',
  styleUrls: ['./ig-edit-titlebar.component.scss'],
})
export class IgEditTitlebarComponent implements OnInit {

  @Input() metadata: ITitleBarMetadata;

  constructor() {
  }

  ngOnInit() {
  }

}

export interface ITitleBarMetadata {
  title: string;
  domainInfo: IDomainInfo;
  creationDate: string;
  updateDate: string;
}
