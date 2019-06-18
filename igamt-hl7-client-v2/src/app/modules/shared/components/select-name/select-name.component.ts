import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Scope} from '../../constants/scope.enum';
import {IAddingInfo} from '../../models/adding-info';
import {IDisplayElement} from '../../models/display-element.interface';

@Component({
  selector: 'app-select-name',
  templateUrl: './select-name.component.html',
  styleUrls: ['./select-name.component.css'],
})
export class SelectNameComponent implements OnInit {

  @ViewChild(NgForm) form;

  constructor() { }
  @Input()
  element: IDisplayElement;
  @Input()
  existing: IDisplayElement[];
  @Input()
  targetScope: Scope;
  @Output()
  flavor: EventEmitter<IAddingInfo> = new EventEmitter<IAddingInfo>();

  ngOnInit() {
  }
  emitData() {
    console.log(this.element);
    this.flavor.emit({
      originalId: this.element.id,
      id: null,
      name: this.element.fixedName,
      type: this.element.type,
      domainInfo: { ...this.element.domainInfo, scope: this.targetScope },
      ext: this.element.variableName,
      flavor: true,
    });
  }
  isValid() {
    return this.form.valid;
  }
}
