import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-workspace-edit-title-bar',
  templateUrl: './workspace-edit-title-bar.component.html',
  styleUrls: ['./workspace-edit-title-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceEditTitleBarComponent implements OnInit {

  @Input() metadata: IWorkspaceTitleMetadata;

  constructor() {
  }

  ngOnInit() {
  }

}


export interface IWorkspaceTitleMetadata {
  title: string;
  creationDate: string;
  updateDate: string;

}
