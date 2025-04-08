import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { isObservable, Observable, of } from 'rxjs';
import { catchError, flatMap, map, take } from 'rxjs/operators';
import { ElementNamingService, IPathInfo } from 'src/app/modules/shared/services/element-naming.service';
import { IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { ICoConstraintBindingContext, ICoConstraintBindingSegment } from '../../../shared/models/co-constraint.interface';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IProfileComponentContext } from 'src/app/modules/shared/models/profile.component';

export interface IExpansionPanelView {
  [key: string]: boolean;
}

export interface IContextCoConstraint {
  resolved: boolean;
  issue?: string;
  pathInfo?: IPathInfo;
  name?: string;
}

@Component({
  selector: 'app-context-co-constraint-binding',
  templateUrl: './context-co-constraint-binding.component.html',
  styleUrls: ['./context-co-constraint-binding.component.scss'],
})
export class ContextCoConstraintBindingComponent implements OnInit, OnChanges {

  @Input()
  viewOnly: boolean;
  @Input()
  delta: boolean;
  @Input()
  derived: boolean;
  @Input()
  bindings: ICoConstraintBindingContext[];
  @Input()
  structure: IHL7v2TreeNode[];
  @Input()
  segments: IDisplayElement[];
  @Input()
  datatypes: IDisplayElement[];
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  documentRef: IDocumentRef;
  @Input()
  set conformanceProfile(cp: IConformanceProfile | Observable<IConformanceProfile>) {
    this._conformanceProfile = isObservable(cp) ? cp : of(cp);
  }
  @Input()
  profileComponentContext?: IProfileComponentContext;
  @Input()
  transformer?: (nodes: IHL7v2TreeNode[]) => Observable<IHL7v2TreeNode[]>;
  @Input()
  referenceChangeMap: Record<string, string> = {};
  _conformanceProfile: Observable<IConformanceProfile>;
  get conformanceProfile() {
    return this._conformanceProfile;
  }
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
  elementInfoMap: Record<string, Observable<IContextCoConstraint>> = {};

  constructor(
    private elementNamingService: ElementNamingService,
    private repository: StoreResourceRepositoryService,
  ) {
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

  getContext(binding: ICoConstraintBindingContext): Observable<IContextCoConstraint> {
    return (this.conformanceProfile as Observable<IConformanceProfile>).pipe(
      flatMap((conformanceProfile) => {
        return this.elementNamingService.getPathInfoFromPath(conformanceProfile, this.repository, binding.context.path, {
          referenceChange: this.referenceChangeMap,
        }).pipe(
          take(1),
          map((pathInfo) => {
            const name = this.elementNamingService.getStringNameFromPathInfo(pathInfo);
            const nodeInfo = this.elementNamingService.getLeaf(pathInfo);
            return {
              resolved: true,
              name,
              pathInfo: nodeInfo,
            };
          }),
        );
      }),
      catchError((err) => {
        return of({
          resolved: false,
          issue: err && err.message ? err.message : 'Could not load binding context',
        });
      }),
    );
  }

  getElementInfo(binding: ICoConstraintBindingContext): Observable<IContextCoConstraint> {
    this.elementInfoMap[binding.context.pathId] = this.getContext(binding);
    return this.elementInfoMap[binding.context.pathId];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.bindings) {
      this.bindings.forEach((element) => {
        this.elementInfoMap[element.context.pathId] = this.getContext(element);
      });
    }
  }

  ngOnInit() { }

}
