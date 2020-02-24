import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Guid} from 'guid-typescript';
import {DocumentationScope, DocumentationType, IDocumentation} from '../../models/documentation.interface';

@Component({
  selector: 'app-documentation-list',
  templateUrl: './documentation-list.component.html',
  styleUrls: ['./documentation-list.component.css'],
})
export class DocumentationListComponent implements OnInit {
  @Output()
  add: EventEmitter<IDocumentation> = new EventEmitter<IDocumentation>();
  @Output()
  delete: EventEmitter<IDocumentation> = new EventEmitter<IDocumentation>();
  constructor() {
  }

  @Input()
  list: IDocumentation[];

  @Input()
  documentationType: DocumentationType;

  ngOnInit() {
  }

  addSection() {
    this.add.emit({
      id: Guid.create().toString(),
      label: 'New Section',
      description: '',
      position: this.list.length + 1,
      type: this.documentationType,
      scope: DocumentationScope.USER,
    });
  }
  deleteSection(setion: IDocumentation) {
    this.delete.emit(setion);
  }
}
