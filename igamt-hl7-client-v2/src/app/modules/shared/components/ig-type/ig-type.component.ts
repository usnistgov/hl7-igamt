import { Component, Input, OnInit } from '@angular/core';
import { Status } from '../../models/abstract-domain.interface';
import { IgDocumentStatusInfo } from './../../../ig/models/ig/ig-document.class';

@Component({
  selector: 'app-ig-type',
  templateUrl: './ig-type.component.html',
  styleUrls: ['./ig-type.component.scss'],
})
export class IgTypeComponent implements OnInit {

  @Input()
  info: IgDocumentStatusInfo;

  constructor() { }

  ngOnInit() {
  }

}
