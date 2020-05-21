import { Component, Input, OnInit } from '@angular/core';
import { IDomainInfo } from '../../../shared/models/domain-info.interface';

@Component({
  selector: 'app-library-edit-titlebar',
  templateUrl: './library-edit-titlebar.component.html',
  styleUrls: ['./library-edit-titlebar.component.scss'],
})
export class LibraryEditTitlebarComponent implements OnInit {

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
