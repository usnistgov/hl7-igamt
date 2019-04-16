import {Component, OnInit, Input} from '@angular/core';
import {Types} from "../constants/types";

@Component({
  selector: 'element-label',
  templateUrl: './element-label.component.html',
  styleUrls: ['./element-label.component.css']
})
export class ElementLabelComponent implements OnInit {

  constructor() {

  }

  @Input()
  type :Types;

  @Input()
  label :string;

  @Input()
  domainInfo:any;

  @Input()
  documentId :string;

  @Input()
  documentType :string;

  @Input()
  description :string;


  @Input()
  redirect  :boolean;
  ngOnInit() {

  }
  goTo(){

  }

}
