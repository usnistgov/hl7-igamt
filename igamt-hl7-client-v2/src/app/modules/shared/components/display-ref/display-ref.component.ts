import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Type} from '../../constants/type.enum';
import {IDisplayElement} from '../../models/display-element.interface';

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
  constructor(private router: Router , private activeRoute: ActivatedRoute ) { }

  ngOnInit() {
  }

  redirect() {
    console.log(this.documentType);
    let documentUrl = '/ig/';
    if (this.documentType != null && this.documentType === Type.DATATYPELIBRARY ) {
      documentUrl = '/datatype-library/';
    }
    this.router.navigate([documentUrl + this.documentId + '/' + this.element.type.toLowerCase() + '/' + this.element.id]);

  }
}
