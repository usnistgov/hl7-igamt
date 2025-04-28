import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { IHL7v2TreeNode } from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { IProfileComponentContext, IProfileComponentItem } from '../../shared/models/profile.component';
import { IResource } from '../../shared/models/resource.interface';
import { AResourceRepositoryService } from '../../shared/services/resource-repository.service';
import { IItemLocation, IProfileComponentChange } from '../components/profile-component-structure-tree/profile-component-structure-tree.component';
import { IHL7v2TreeProfileComponentNode, ProfileComponentService } from './profile-component.service';

export class ProfileComponentItemList {
  public items$: BehaviorSubject<IProfileComponentItem[]>;
  public context$: BehaviorSubject<IProfileComponentContext>;
  public nodes$: BehaviorSubject<IHL7v2TreeNode[]>;
  public unresolved$: BehaviorSubject<IProfileComponentItem[]>;
  public change$: Subject<IProfileComponentContext>;
  public itemList$: Observable<IHL7v2TreeProfileComponentNode[]>;

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
    this.unresolved$ = new BehaviorSubject([]);
    this.change$ = new Subject();

    this.itemList$ = combineLatest(
      this.context$,
    ).pipe(
      mergeMap(([currentContext]) => {
        return this.updateTree(currentContext, this.nodes$.getValue()).pipe(
          mergeMap((updatedNodes) => {
            return this.ppService.getHL7V2ProfileComponentItemNode(
              resource,
              repository,
              this.nodes$.getValue(),
              currentContext,
            ).pipe(
              map((result) => {
                this.unresolved$.next(result.notfound);
                this.nodes$.next(updatedNodes);
                this.unresolved$.next(result.notfound);
                return result.nodes;
              }),
            );
          }),
        );
      }),
    );
  }

  private updateTree(context: IProfileComponentContext, nodeList: IHL7v2TreeNode[]): Observable<IHL7v2TreeNode[]> {
    const transformer = this.ppService.getProfileComponentItemTransformer(context);
    const recursiveTransform = (nodes: IHL7v2TreeNode[]): Observable<IHL7v2TreeNode[]> => {
      const nodes$ = nodes.map((node) => {
        if (node.children && node.children.length > 0) {
          return recursiveTransform(node.children).pipe(
            map((children) => {
              node.children = children;
              return node;
            }),
          );
        } else {
          return of(node);
        }
      });
      return combineLatest(nodes$).pipe(
        take(1),
        mergeMap((nodesWithChildrenProcessed) => {
          return transformer(nodesWithChildrenProcessed);
        }),
      );
    };
    return recursiveTransform(nodeList).pipe(
      take(1),
    );
  }

  getContextValue(): IProfileComponentContext {
    return _.cloneDeep(this.context$.getValue());
  }

  getItemsValue(): IProfileComponentItem[] {
    return _.cloneDeep(this.context$.getValue().profileComponentItems);
  }

  applyPropertyChange(change: IProfileComponentChange) {
    this.ppService.applyChange(change, this.context$.getValue());
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
