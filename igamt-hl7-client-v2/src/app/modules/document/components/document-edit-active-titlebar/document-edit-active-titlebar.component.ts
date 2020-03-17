import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { IWorkspaceActive } from '../../../shared/models/editor.class';

@Component({
  selector: 'app-document-edit-active-titlebar',
  templateUrl: './document-edit-active-titlebar.component.html',
  styleUrls: ['./document-edit-active-titlebar.component.scss'],
})
export class DocumentEditActiveTitlebarComponent implements OnInit {

  @Input() active: IWorkspaceActive;
  @Input() controls: TemplateRef<any>;
  @Input() header: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
