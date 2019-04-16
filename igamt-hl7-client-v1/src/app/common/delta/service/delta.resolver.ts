import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {DeltaService, DiffType, EntityDelta} from './delta.service';
import {TocService} from '../../../igdocuments/igdocument-edit/service/toc.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {TreeNode} from 'primeng/api';
import {GeneralConfigurationService} from '../../../service/general-configuration/general-configuration.service';

@Injectable()
export  class DeltaResolver implements Resolve<EntityDelta> {

  constructor(private service: DeltaService, private toc: TocService, private configService: GeneralConfigurationService) {}

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<EntityDelta> {
    const params = this.getType(route);
    if (params) {
      const entityId: string = route.params[params[1]];
      return this.service.delta(<DiffType> params[0], this.toc.sourceIg, entityId).pipe(
        map((entityDelta: EntityDelta) => {
          this.expand(entityDelta.delta.structure);
          entityDelta.delta.structure = this.filterUnchanged(entityDelta.delta.structure);
          entityDelta.delta.structure = this.configService.arraySortByPosition(entityDelta.delta.structure, (item) => {
            return item['_.deltakey']['data.position'];
          });
          return entityDelta;
        })
      );
    }
  }

  expand(tree: TreeNode[]) {
    for (const node of tree) {
      if (node.children) {
        node.expanded = true;
        this.expand(node.children);
      }
    }
  }

  filterUnchanged(tree: TreeNode[]) {
    const filtered = tree.filter( node => {
      return node['_.operation'] !== 'UNCHANGED';
    });
    for (const node of filtered) {
      if (node.children) {
        node.children = this.filterUnchanged(node.children);
      }
    }
    return filtered;
  }

  getType(route: ActivatedRouteSnapshot): string[] {
    const allowed = ['segment', 'datatype', 'conformanceprofile'];
    let path = '';
    for (const step of route.pathFromRoot) {
      for (const url of step.url) {
        console.log(url.path);
        if (allowed.includes(url.path)) {
          path = url.path;
        }
      }
    }

    switch (path) {
      case 'segment' :
        return ['SEGMENT', 'segmentId'];
      case 'datatype' :
        return ['DATATYPE', 'datatypeId'];
      case 'conformanceprofile' :
        return ['CONFORMANCEPROFILE', 'conformanceprofileId'];
      default:
        return undefined;
    }
  }

}

