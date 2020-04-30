import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  AddDocument,
  AddDocumentSuccess, DeleteDocument,
  DocumentationActionTypes, UpdateDocumentationList,
} from '../../../../root-store/documentation/documentation.actions';
import { RxjsStoreHelperService } from '../../../dam-framework/services/rxjs-store-helper.service';
import { DocumentationType, IDocumentation } from '../../models/documentation.interface';

@Component({
  selector: 'app-documentation-side-bar',
  templateUrl: './documentation-side-bar.component.html',
  styleUrls: ['./documentation-side-bar.component.css'],
})
export class DocumentationSideBarComponent implements OnInit {

  constructor(
    private store: Store<any>,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private actions: Actions) { }

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
  admin: boolean;
  @Input()
  authenticated: boolean;
  @Input()
  glossary: IDocumentation[];
  ngOnInit() {
  }

  addSection($event: any) {

    RxjsStoreHelperService.listenAndReact(this.actions, {
      [DocumentationActionTypes.AddDocumentSuccess]: {
        do: (action: AddDocumentSuccess) => {
          this.router.navigate([this.getUrlByType(action.documentation)], { relativeTo: this.activeRoute });
          return of();
        },
      },
    }).subscribe(() => {
    });
    this.store.dispatch(new AddDocument($event.documentationType, $event.index));

  }

  getUrlByType(section: IDocumentation): string {
    switch (section.type) {
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
      default:
        return '';
        break;
    }
  }
  deleteSection($event: any) {
    this.store.dispatch(new DeleteDocument($event.id, $event.list));
  }

  reorder($event: IDocumentation[]) {
    this.store.dispatch(new UpdateDocumentationList($event));
  }
}
