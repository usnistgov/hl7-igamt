import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Type } from '../../constants/type.enum';
import { IDisplayElement } from '../../models/display-element.interface';

@Component({
  selector: 'app-display-ref',
  templateUrl: './display-ref.component.html',
  styleUrls: ['./display-ref.component.css'],
})
export class DisplayRefComponent implements OnInit {
  @Input()
  element: IDisplayElement;
  @Input()
  hideDescription: boolean;
  @Input()
  documentType: Type;
  @Input()
  documentId: string;

  constructor(private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  getDocumentURL(documentType: Type) {
    if (documentType) {
      switch (this.documentType) {
        case Type.DATATYPELIBRARY:
          return '/datatype-library/';
        case Type.IGDOCUMENT:
          return '/ig/';
        default:
          return null;
      }
    }
    return null;
  }


  redirect() {
    const documentUrl = this.getDocumentURL(this.documentType);
    if (documentUrl) {
      this.router.navigate([documentUrl + this.documentId + '/' + this.element.type.toLowerCase() + '/' + this.element.id]);
    }
  }
}
