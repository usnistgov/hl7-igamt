import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { IWorkspaceActive } from '../../../dam-framework/models/data/workspace';

@Component({
  selector: 'app-library-edit-active-titlebar',
  templateUrl: './library-edit-active-titlebar.component.html',
  styleUrls: ['./library-edit-active-titlebar.component.scss'],
})
export class LibraryEditActiveTitlebarComponent implements OnInit {

  @Input() active: IWorkspaceActive;
  @Input() controls: TemplateRef<any>;
  @Input() header: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
