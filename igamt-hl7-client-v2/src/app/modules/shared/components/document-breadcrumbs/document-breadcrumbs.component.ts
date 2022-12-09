import { BrowserScope } from './../entity-browse-dialog/entity-browse-dialog.component';
import { IDocumentLocation, DocumentLocationType } from './../../../ig/models/ig/ig-document.class';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-breadcrumbs',
  templateUrl: './document-breadcrumbs.component.html',
  styleUrls: ['./document-breadcrumbs.component.scss'],
})
export class DocumentBreadcrumbsComponent implements OnInit {

  links: Record<number, { path: string[], params: Record<string, string> }>;
  @Input()
  set locationInfo(location: IDocumentLocation[]) {
    this.location = location.sort((a, b) => a.position - b.position);
    const asMap = (this.location || []).reduce((acc, l) => {
      return {
        ...acc,
        [l.position]: l,
      }
    }, {});
    this.links = (this.location || []).reduce((acc, l) => {
      return {
        ...acc,
        [l.position]: this.getLink(asMap, l.position),
      }
    }, {});
  }

  location: IDocumentLocation[]
  constructor() { }


  getLink(locations: Record<number, IDocumentLocation>, i: number): { path: string[], params: Record<string, string> } {
    const l = locations[i];
    if (l) {
      switch (l.type) {
        case DocumentLocationType.FOLDER:
          return { path: [...this.getLink(locations, i - 1).path, 'folder', l.id], params: {} };
        case DocumentLocationType.WORKSPACE:
          return { path: ['/', 'workspace', l.id], params: {} };
        case DocumentLocationType.SCOPE:
          switch (l.id) {
            case BrowserScope.PRIVATE_IG_LIST:
              return { path: ['/', 'ig', 'list'], params: { 'type': 'USER' } };
            case BrowserScope.PUBLIC_IG_LIST:
              return { path: ['/', 'ig', 'list'], params: { 'type': 'PUBLISHED' } };
            default:
              return { path: ['/', 'ig', 'list'], params: {} };
          }
      }
    } else {
      return { path: ['/'], params: {} };
    }

  }

  ngOnInit() {
  }

}
