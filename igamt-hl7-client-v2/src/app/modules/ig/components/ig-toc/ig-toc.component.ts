import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { TREE_ACTIONS, TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { SelectItem } from 'primeng/api';
import { map, take } from 'rxjs/operators';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { IAddNewWrapper, IAddWrapper } from '../../../document/models/document/add-wrapper.class';
import { IClickInfo } from '../../../document/models/toc/click-info.interface';
import { Scope } from '../../../shared/constants/scope.enum';
import { Type } from '../../../shared/constants/type.enum';
import { ICopyResourceData } from '../../../shared/models/copy-resource-data';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { NodeHelperService } from '../../../shared/services/node-helper.service';
import { ValueSetService } from '../../../value-set/service/value-set.service';
import { IgDocument, IGroupValueSetWrapper } from '../../models/ig/ig-document.class';
import { IgService } from '../../services/ig.service';
import { IVerificationEnty } from './../../../dam-framework/models/data/workspace';
import { IContent } from './../../../shared/models/content.interface';
import { ManageProfileStructureComponent } from './../manage-profile-structure/manage-profile-structure.component';

@Component({
  selector: 'app-ig-toc',
  templateUrl: './ig-toc.component.html',
  styleUrls: ['./ig-toc.component.scss'],
})
export class IgTocComponent implements OnInit, AfterViewInit {

  optionsToDisplay: any;
  deltaOptions: SelectItem[] = [{ label: 'CHANGED', value: 'UPDATED' }, { label: 'DELETED', value: 'DELETED' }, { label: 'ADDED', value: 'ADDED' }];

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  @ViewChild('vsLib') vsLib: ElementRef;
  @ViewChild('dtLib') dtLib: ElementRef;
  @ViewChild('segLib') segLib: ElementRef;
  @ViewChild('cpLib') cpLib: ElementRef;
  @ViewChild('ccgLib') ccgLib: ElementRef;
  @ViewChild('top') top: ElementRef;
  @ViewChild('pcLib') pcLib: ElementRef;
  @ViewChild('cmppLib') cmppLib: ElementRef;
  @ViewChild('profile') profile: ElementRef;

  // TODO set type
  options;
  _nodes: TreeNode[];
  @Input()
  nodes: TreeNode[];
  @Input()
  delta: boolean;
  @Input()
  viewOnly: boolean;
  @Input()
  ig: IgDocument;

  @Input()
  verification: Dictionary<IVerificationEnty[]>;
  elementNumbers: ElmentNumbers;

  @Output()
  nodeState = new EventEmitter<IDisplayElement[]>();
  @Output()
  copy = new EventEmitter<ICopyResourceData>();
  @Output()
  delete = new EventEmitter<IDisplayElement>();
  @Output()
  deleteContext = new EventEmitter<{ child: IDisplayElement, parent: IDisplayElement }>();
  @Output()
  deleteNarrative = new EventEmitter<string>();
  @Output()
  addChildren = new EventEmitter<IAddWrapper>();
  @Output()
  addChildrenFromProvider =  new EventEmitter<string>();
  @Output()
  addCustom = new EventEmitter<IAddWrapper>();
  @Output()
  addMessages = new EventEmitter<IAddWrapper>();
  @Output()
  addChild = new EventEmitter<IAddNewWrapper>();
  @Output()
  addVSFromCSV = new EventEmitter<any>();
  @Output()
  addPcChildren = new EventEmitter<IDisplayElement>();
  @Output()
  checkUnused = new EventEmitter<{ children: IDisplayElement[], type: Type }>();

  @Output()
  manageProfileStructure = new EventEmitter<IContent[]>();
  @Output()
  addUserDataTypes = new EventEmitter<IAddWrapper>();

  @Output()
  groupValueSet = new EventEmitter<IGroupValueSetWrapper>();

  @ViewChild(TreeComponent) private tree: TreeComponent;

  // tslint:disable-next-line:cognitive-complexity
  constructor(
    private nodeHelperService: NodeHelperService,
    private valueSetService: ValueSetService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private igService: IgService,
    private store: Store<any>,
    private dialog: MatDialog,
  ) {
    this.options = {
      allowDrag: (node: TreeNode) => {
        return !(this.viewOnly) && (node.data.type === Type.TEXT ||
          node.data.type === Type.CONFORMANCEPROFILE ||
          node.data.type === Type.PROFILE || node.data.type === Type.PROFILECOMPONENT || Type.COMPOSITEPROFILE);
      },
      actionMapping: {
        mouse: {
          drop: (tree: TreeModel, node: TreeNode, $event: any, { from, to }) => {
            if (from.data.type === Type.TEXT && (!this.isOrphan(to) && to.parent.data.type === Type.TEXT || this.isOrphan(to))) {
              TREE_ACTIONS.MOVE_NODE(tree, node, $event, { from, to });
              this.update();
            } else if (from.data.type === Type.CONFORMANCEPROFILE && to.parent.data.type === Type.CONFORMANCEPROFILEREGISTRY) {
              TREE_ACTIONS.MOVE_NODE(tree, node, $event, { from, to });
              this.update();
              // tslint:disable-next-line:no-duplicated-branches
            } else if (from.data.type === Type.PROFILECOMPONENT && to.parent.data.type === Type.PROFILECOMPONENTREGISTRY) {
              TREE_ACTIONS.MOVE_NODE(tree, node, $event, { from, to });
              this.update();
              // tslint:disable-next-line:no-duplicated-branches
            } else if (from.data.type === Type.COMPOSITEPROFILE && to.parent.data.type === Type.COMPOSITEPROFILEREGISTRY) {
              TREE_ACTIONS.MOVE_NODE(tree, node, $event, { from, to });
              this.update();
            }
          },
          click: () => { },
        },
      },
    };
  }

  isOrphan(node: any) {
    return node && node.parent && !node.parent.parent;
  }

  ngOnInit() {
  }

  findInToc(profileNodeChildren: any[], type: Type): any[] {
    const node = profileNodeChildren.find((x) => x.type === type);
    if (node) {
      return (node.children || []);
    } else {
      return [];
    }
  }

  updateNumbers(): any {
    const profileNodes = this.tree.treeModel.nodes.find((x) => x.type === Type.PROFILE);
    this.elementNumbers = {};

    const datatypeNodes = this.findInToc(profileNodes.children, Type.DATATYPEREGISTRY);
    this.elementNumbers.datatypes = datatypeNodes.filter((n) => !this.tree.treeModel.hiddenNodeIds[n.id]).length;

    const segments = this.findInToc(profileNodes.children, Type.SEGMENTREGISTRY);
    this.elementNumbers.segments = segments.filter((n) => !this.tree.treeModel.hiddenNodeIds[n.id]).length;

    const valueSets = this.findInToc(profileNodes.children, Type.VALUESETREGISTRY);
    this.elementNumbers.valueSets = valueSets.filter((n) => !this.tree.treeModel.hiddenNodeIds[n.id]).length;

    const coConstraintGroup = this.findInToc(profileNodes.children, Type.COCONSTRAINTGROUPREGISTRY);
    this.elementNumbers.coConstraintGroup = coConstraintGroup.filter((n) => !this.tree.treeModel.hiddenNodeIds[n.id]).length;

    const conformanceProfiles = this.findInToc(profileNodes.children, Type.CONFORMANCEPROFILEREGISTRY);
    this.elementNumbers.conformanceProfiles = conformanceProfiles.filter((n) => !this.tree.treeModel.hiddenNodeIds[n.id]).length;

    const profileComponents = this.findInToc(profileNodes.children, Type.PROFILECOMPONENTREGISTRY);
    this.elementNumbers.profileComponents = profileComponents.filter((n) => !this.tree.treeModel.hiddenNodeIds[n.id]).length;

    const compositeProfiles = this.findInToc(profileNodes.children, Type.COMPOSITEPROFILEREGISTRY);
    this.elementNumbers.compositeProfiles = compositeProfiles.filter((n) => !this.tree.treeModel.hiddenNodeIds[n.id]).length;
  }

  addSectionToNode(node) {
    this.nodeHelperService.addNode(node);
    this.update();
  }

  addSectionToIG() {
    this.nodeHelperService.addNodeToRoot(this.tree.treeModel);
    this.update();
  }

  copySection(node) {
    const id = this.nodeHelperService.cloneNode(node);
    this.update();
    this.router.navigate(['./text', id], { relativeTo: this.activatedRoute });
  }

  deleteSection(section) {
    this.nodeHelperService.deleteSection(section.id, this.tree.treeModel);
    this.update();
    this.deleteNarrative.emit(section.id);
  }

  import(node, type: Type, scope: Scope) {
    this.addChildren.emit({ node, type, scope });
  }
  importCustom(node, type: Type, scope: Scope) {
    this.addCustom.emit({ node, type, scope });
  }
  importUserLib(node, type: Type, scope: Scope) {
    this.addUserDataTypes.emit({ node, type, scope });
  }

  importMessages(node, type: Type, scope: Scope) {
    this.addMessages.emit({ node, type, scope });
  }
  importCSV(node, type: Type, scope: Scope) {
    this.addVSFromCSV.emit({ node, type, scope });
  }

  copyResource(node: TreeNode) {
    this.copy.emit({ element: { ...node.data }, existing: node.parent.data.children });
  }

  exportDiffProfileXML(node: TreeNode) {
    this.store.select(fromIgDocumentEdit.selectIgId).pipe(
      take(1),
      map((id) => this.igService.exportProfileDiffXML(id, node.data.id)),
    )
      .subscribe();
  }

  exportCSVFileForVS(node: TreeNode) {
    this.valueSetService.exportCSVFile(node.data.id);
  }

  deleteResource(node: TreeNode) {
    this.delete.emit(node.data);
  }

  scrollTo(ref: ElementRef) {
    ref.nativeElement.scrollIntoView();
  }

  getElementUrl(elm): string {
    const type = elm.type.toLowerCase();
    return './' + type + '/' + elm.id;
  }

  scroll(type: string) {
    if (type === 'messages') {
      this.cpLib.nativeElement.scrollIntoView();
    } else if (type === 'segments') {
      this.segLib.nativeElement.scrollIntoView();
    } else if (type === 'datatypes') {
      this.dtLib.nativeElement.scrollIntoView();
    } else if (type === 'valueSets') {
      this.vsLib.nativeElement.scrollIntoView();
    } else if (type === 'coConstraintGroups') {
      this.ccgLib.nativeElement.scrollIntoView();
    } else if (type === 'profilecomponents') {
      this.pcLib.nativeElement.scrollIntoView();
    } else if (type === 'composites') {
      this.cmppLib.nativeElement.scrollIntoView();
    }
  }

  scrollById(id: string) {
    const elm = document.getElementById(id);
    if (elm) {
      elm.scrollIntoView();
    }
  }

  filter(value: string) {
    this.tree.treeModel.filterNodes((node) => {
      return this.nodeHelperService
        .getFilteringLabel(node.data.fixedName, node.data.variableName).toLowerCase()
        .startsWith(value ? value.toLowerCase() : '');
    });
  }

  filterNode(fn: (data: IDisplayElement) => boolean) {
    this.tree.treeModel.filterNodes((node) => {
      return !fn(node.data);
    });
  }

  update() {
    this.nodeState.emit(this.tree.treeModel.nodes);
  }

  getScrollContainer() {
    return document.getElementById('toc-container');
  }

  ngAfterViewInit() {
  }

  expandAll() {
    this.tree.treeModel.expandAll();
  }

  collapseAll() {
    this.tree.treeModel.collapseAll();
  }

  createNew(node: IDisplayElement, type: Type) {
    this.addChild.emit({ node, type });
  }

  filterByDelta($event: string[]) {
    this.tree.treeModel.filterNodes((node) => node.data.delta != null && $event.indexOf(node.data.delta) > -1 && node.data.Type !== Type.TEXT);
  }

  getPcElementUrl(treeNode: TreeNode) {
    let url = this.getElementUrl(treeNode.parent.data);
    if (treeNode.parent && treeNode.parent.data) {
      // tslint:disable-next-line:no-collapsible-if
      if (treeNode.data.type === Type.SEGMENTCONTEXT) {
        url = url + '/segment/' + treeNode.data.id;
      }
      if (treeNode.data.type === Type.MESSAGECONTEXT) {
        url = url + '/message/' + treeNode.data.id;
      }
    }
    return url;
  }

  addPcContexts(node) {
    this.addPcChildren.emit(node.data);
  }

  deleteOneChild(child: IDisplayElement, parent: IDisplayElement) {
    this.deleteContext.emit({ child, parent });
  }

  manageStructure(node: TreeNode) {

    const dialogRef = this.dialog.open(ManageProfileStructureComponent, {
      data: node.data.children,
    });
    dialogRef.afterClosed().subscribe(
      (answer) => {

        if (answer) {
          this.nodeHelperService.updateProfileStructure(node, answer);
          this.update();
        }
      },
    );
  }
  deleteUnused(registryNode) {
    this.checkUnused.emit({ children: registryNode.children, type: registryNode.type });
  }

  addFromProvider(providerId: string) {
    this.addChildrenFromProvider.emit(providerId);
  }

  onGroupValueSet($event: IDisplayElement[]) {
    this.groupValueSet.emit({valueSets: $event});
  }

}
export class ElmentNumbers {
  conformanceProfiles?: number;
  profileComponents?: number;
  compositeProfiles?: number;
  segments?: number;
  datatypes?: number;
  valueSets?: number;
  coConstraintGroup?: number;

}

export interface ITypedSection {
  [key: string]: IContent;
}
