/**
 * Created by hnt5 on 10/25/17.
 */
import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {WorkspaceService, Entity} from "../../service/workspace/workspace.service";
import {Http} from "@angular/http";

@Injectable()
export class IgDocumentGuard implements CanActivate {

  constructor(private _ws : WorkspaceService,
              private $http : Http){};

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let obs = this.$http.get('api/igdocuments/'+route.params['id']).map(res => res.json()).subscribe(data => {
        this._ws.setCurrent(Entity.IG, data);
        obs.unsubscribe();
        resolve(true);
      });
    });
  }

}
