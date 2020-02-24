import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {
  AddDocumentationState,
  DeleteDocumentationState
} from '../../../../root-store/documentation/documentation.actions';
import {IDocumentation, IDocumentationWrapper} from '../../models/documentation.interface';

@Component({
  selector: 'app-documentation-side-bar',
  templateUrl: './documentation-side-bar.component.html',
  styleUrls: ['./documentation-side-bar.component.css'],
})
export class DocumentationSideBarComponent implements OnInit {

  constructor(private store: Store<any>) { }
  @Input()
  userguides: IDocumentation[];
  @Input()
  faqs: IDocumentation[];
  @Input()
  decisions: IDocumentation[];
  @Input()
  releaseNotes: IDocumentation[];
  @Input()
  userNotes: IDocumentation[];
  @Input()
  glossary: IDocumentation[];
  ngOnInit() {
  }

  addSection($event: IDocumentation) {
    this.store.dispatch(new AddDocumentationState($event));
  }

  deleteSection($event: IDocumentation) {
    this.store.dispatch(new DeleteDocumentationState($event));
  }
}
