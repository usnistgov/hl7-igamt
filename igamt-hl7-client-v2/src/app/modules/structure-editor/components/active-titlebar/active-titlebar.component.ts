import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { IWorkspaceActive } from '../../../dam-framework/models/data/workspace';

@Component({
  selector: 'app-active-titlebar',
  templateUrl: './active-titlebar.component.html',
  styleUrls: ['./active-titlebar.component.scss'],
})
export class ActiveTitlebarComponent implements OnInit {

  @Input() active: IWorkspaceActive;
  @Input() controls: TemplateRef<any>;
  @Input() header: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
