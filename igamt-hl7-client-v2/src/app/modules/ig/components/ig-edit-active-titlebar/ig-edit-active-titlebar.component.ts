import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { IWorkspaceActive } from '../../../shared/models/editor.class';

@Component({
  selector: 'app-ig-edit-active-titlebar',
  templateUrl: './ig-edit-active-titlebar.component.html',
  styleUrls: ['./ig-edit-active-titlebar.component.scss'],
})
export class IgEditActiveTitlebarComponent implements OnInit {

  @Input() active: IWorkspaceActive;
  @Input() controls: TemplateRef<any>;
  @Input() header: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
