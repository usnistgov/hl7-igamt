import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { ICoConstraintBindingContext, ICoConstraintBindingSegment } from '../../../shared/models/co-constraint.interface';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';

export interface IExpansionPanelView {
  [key: string]: boolean;
}

@Component({
  selector: 'app-context-co-constraint-binding',
  templateUrl: './context-co-constraint-binding.component.html',
  styleUrls: ['./context-co-constraint-binding.component.scss'],
})
export class ContextCoConstraintBindingComponent implements OnInit {

  @Input()
  viewOnly: boolean;
  @Input()
  delta: boolean;
  @Input()
  derived: boolean;
  @Input()
  bindings: ICoConstraintBindingContext[];
  @Input()
  segments: IDisplayElement[];
  @Input()
  datatypes: IDisplayElement[];
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  documentRef: IDocumentRef;
  @Input()
  conformanceProfile: IConformanceProfile;
  @Input()
  set open(id: string) {
    this.openPanel(id);
  }
  @Output()
  deleteContextBindingEvent: EventEmitter<{
    contexts: ICoConstraintBindingContext[],
    context: ICoConstraintBindingContext,
    contextId: string,
    i: number,
  }>;
  @Output()
  deleteSegmentBindingEvent: EventEmitter<{
    segments: ICoConstraintBindingSegment[],
    segment: ICoConstraintBindingSegment,
    contextId: string,
    i: number,
  }>;
  @Output()
  formValidEvent: EventEmitter<{
    path: string,
    validity: boolean,
  }>;
  @Output()
  segmentBindingChangeEvent: EventEmitter<{
    contextId: string,
    value: ICoConstraintBindingSegment,
  }>;

  expansionPanelView: IExpansionPanelView;

  constructor() {
    this.expansionPanelView = {};
    this.deleteContextBindingEvent = new EventEmitter();
    this.deleteSegmentBindingEvent = new EventEmitter();
    this.formValidEvent = new EventEmitter();
    this.segmentBindingChangeEvent = new EventEmitter();
  }

  segmentBindingChange(contextId: string, value: ICoConstraintBindingSegment) {
    this.segmentBindingChangeEvent.emit({
      contextId,
      value,
    });
  }

  formValid(path: string, validity: boolean) {
    this.formValidEvent.emit({
      path,
      validity,
    });
  }

  deleteContextBinding(contexts: ICoConstraintBindingContext[], context: ICoConstraintBindingContext, contextId: string, i: number) {
    this.deleteContextBindingEvent.emit({
      contexts,
      context,
      contextId,
      i,
    });
  }

  deleteSegmentBinding(segments: ICoConstraintBindingSegment[], segment: ICoConstraintBindingSegment, contextId: string, i: number) {
    this.deleteSegmentBindingEvent.emit({
      segments,
      segment,
      contextId,
      i,
    });
  }

  openPanel(id: string) {
    for (const key of Object.keys(this.expansionPanelView)) {
      this.expansionPanelView[key] = false;
    }
    this.expansionPanelView[id] = true;
  }

  togglePanel(id: string) {
    if (this.expansionPanelView[id]) {
      this.expansionPanelView[id] = false;
    } else {
      this.openPanel(id);
    }
  }

  ngOnInit() {
  }

}
