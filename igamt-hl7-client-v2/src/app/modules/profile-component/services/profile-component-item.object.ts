import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { flatMap, map, take, tap } from 'rxjs/operators';
import { IHL7v2TreeNode } from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { IProfileComponentContext, IProfileComponentItem } from '../../shared/models/profile.component';
import { IResource } from '../../shared/models/resource.interface';
import { PropertyType } from '../../shared/models/save-change';
import { AResourceRepositoryService } from '../../shared/services/resource-repository.service';
import { IItemLocation, IProfileComponentChange } from '../components/profile-component-structure-tree/profile-component-structure-tree.component';
import { ProfileComponentRefChange } from './profile-component-ref-change.object';
import { IHL7v2TreeProfileComponentNode, ProfileComponentService } from './profile-component.service';

export class ProfileComponentItemList {
  public items$: BehaviorSubject<IProfileComponentItem[]>;
  public context$: BehaviorSubject<IProfileComponentContext>;
  public nodes$: BehaviorSubject<IHL7v2TreeNode[]>;
  public change$: Subject<IProfileComponentContext>;
  public itemList$: Observable<IHL7v2TreeProfileComponentNode[]>;
  public refChangeMap: ProfileComponentRefChange;

  constructor(
    context: IProfileComponentContext,
    nodes: IHL7v2TreeNode[],
    resource: IResource,
    private repository: AResourceRepositoryService,
    private ppService: ProfileComponentService,
  ) {
    this.items$ = new BehaviorSubject(context.profileComponentItems);
    this.context$ = new BehaviorSubject(context);
    this.nodes$ = new BehaviorSubject(nodes);
    this.change$ = new Subject();
    this.refChangeMap = new ProfileComponentRefChange(context.profileComponentItems);

    this.itemList$ = combineLatest(
      this.items$,
      this.refChangeMap.value$,
    ).pipe(
      flatMap(([its, rc]) => {
        return this.ppService.getHL7V2ProfileComponentItemNode(
          resource,
          repository,
          this.nodes$.getValue(),
          its,
          rc,
        ).pipe(
          tap(() => this.nodeUpdate()),
        );
      }),
    );
  }

  private nodeUpdate() {
    this.nodes$.next(this.nodes$.getValue());
  }

  getContextValue(): IProfileComponentContext {
    return _.cloneDeep(this.context$.getValue());
  }

  getItemsValue(): IProfileComponentItem[] {
    return _.cloneDeep(this.context$.getValue().profileComponentItems);
  }

  applyPropertyChange(change: IProfileComponentChange) {
    this.ppService.applyChange(change, this.context$.getValue());
    const property = change.property;
    // If it changes structure
    if (change.type === PropertyType.DATATYPE || change.type === PropertyType.SEGMENTREF) {
      (change.unset ? of(undefined) : this.ppService.getResourceRef(property, this.repository)).pipe(
        take(1),
        map((ref) => {
          this.refChangeMap.insert(change.path, ref);
        }),
      ).subscribe();
    }

    const value = this.getContextValue();
    this.context$.next(value);
    this.change$.next(value);
  }

  addItem(items: IProfileComponentItem[]) {
    const itemsList = [
      ...this.getItemsValue(),
      ...items,
    ];
    this.changeItemList(itemsList);
  }

  removeItem(location: IItemLocation) {
    this.ppService.removeBindings(location, this.context$.getValue());
    this.refChangeMap.clear(location.path);
    const itemsList = this.getItemsValue();
    const index = itemsList.findIndex((elm) => elm.path === location.path);
    if (index !== -1) {
      itemsList.splice(index, 1);
      this.changeItemList(itemsList);
    }
  }

  changeItemList(items: IProfileComponentItem[]) {
    this.context$.next({
      ...this.context$.getValue(),
      profileComponentItems: items,
    });
    this.items$.next(items);
    this.change$.next(this.getContextValue());
  }

}
