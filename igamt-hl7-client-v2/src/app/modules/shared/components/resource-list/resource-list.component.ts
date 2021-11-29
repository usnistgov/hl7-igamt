import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Scope } from '../../constants/scope.enum';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss'],
})
export class ResourceListComponent implements OnInit {

  @Output()
  selectionChange: EventEmitter<{ version: string, scope: Scope }>;
  @Input()
  selectedVersion: string;
  @Input()
  selectedScope: Scope;
  @Input()
  hl7Versions: string[];
  @Input()
  resourceLabel: string;
  @Input()
  table: any[];
  @Input()
  filters: string[];
  @Input()
  displayScope: boolean;
  @ContentChild('display')
  display: TemplateRef<any>;
  @ContentChild('actions')
  actions: TemplateRef<any>;

  constructor() {
    this.selectionChange = new EventEmitter<{ version: string, scope: Scope }>();
  }

  selectVersion($event) {
    this.selectedVersion = $event;
    this.selectionChange.emit({
      version: $event,
      scope: this.selectedScope,
    });
  }

  selectScope($event) {
    this.selectedScope = $event;
    this.selectionChange.emit({
      version: this.selectedVersion,
      scope: $event,
    });
  }

  ngOnInit() {
  }

}
