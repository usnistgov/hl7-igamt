import { Component, Input, OnInit } from '@angular/core';
import { IDomainInfo } from '../../../shared/models/domain-info.interface';

@Component({
  selector: 'app-document-edit-titlebar',
  templateUrl: './document-edit-titlebar.component.html',
  styleUrls: ['./document-edit-titlebar.component.scss'],
})
export class DocumentEditTitlebarComponent implements OnInit {

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
