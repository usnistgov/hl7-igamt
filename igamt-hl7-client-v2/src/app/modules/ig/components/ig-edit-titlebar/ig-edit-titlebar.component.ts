import { Component, Input, OnInit } from '@angular/core';
import { IDomainInfo } from '../../../shared/models/domain-info.interface';
import { IgDocumentStatusInfo } from './../../models/ig/ig-document.class';

@Component({
  selector: 'app-ig-edit-titlebar',
  templateUrl: './ig-edit-titlebar.component.html',
  styleUrls: ['./ig-edit-titlebar.component.scss'],
})
export class IgEditTitlebarComponent implements OnInit {

  @Input() metadata: ITitleBarMetadata;
  @Input() info: IgDocumentStatusInfo;

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
