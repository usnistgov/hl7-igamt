/**
 * Created by hnt5 on 10/25/17.
 */
import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {WorkspaceService, Entity} from "../../../service/workspace/workspace.service";
import {Http} from "@angular/http";
import {IndexedDbService} from "../../../service/indexed-db/indexed-db.service";

@Injectable()
export class SegmentGuard implements CanActivate {

  constructor(private _ws : WorkspaceService,
              private db : IndexedDbService){};

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.db.getSegment(route.params['id'],function (data) {

            this._ws.setCurrent(Entity.SEGMENT, data);
            resolve(true);





      }.bind(this));
    });
  }

}


