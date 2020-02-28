import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
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
  add: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  delete: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  reorder: EventEmitter<IDocumentation[]> = new EventEmitter<IDocumentation[]>();
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
      index: this.list.length + 1,
      documentationType: this.documentationType,
    });
  }
  getLinkByType( section: IDocumentation) {
    switch (this.documentationType) {
      case DocumentationType.FAQ:
        return './faqs/' + section.id;
        break;
      case DocumentationType.GLOSSARY:
        return './glossary/' + section.id;
        break;
        case DocumentationType.IMPLEMENTATIONDECISION:
          return './implementation-decisions/' + section.id;
          break;
          case DocumentationType.RELEASENOTE:
            return './releases-notes/' + section.id;
            break;
            case DocumentationType.USERGUIDE:
              return './users-guides/' + section.id;
              break;
              case DocumentationType.USERNOTES:
                return './users-notes/' + section.id;
                break;
      default :
        return '';
        break;
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].position = i + 1;
    }
    this.reorder.emit(this.list);
  }
  deleteDocument(doc: IDocumentation) {
    this.delete.emit({
      id: doc.id,
      list: this.list,
    });
  }
}
