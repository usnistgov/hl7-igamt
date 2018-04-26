/**
 * Created by ena3 on 12/5/17.
 */
import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {WorkspaceService, Entity} from "../../../service/workspace/workspace.service";
import {Http} from "@angular/http";

@Injectable()
export class DatatypeGuard implements CanActivate {

  constructor(private _ws : WorkspaceService,
              private $http : Http){};

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let obs = this.$http.get('api/datatypes/'+route.params['id']).map(res => res.json()).subscribe(data => {
        // let ig = this._ws.getCurrent(Entity.IG);
        // for(let datatype of ig.profile.datatypeLibrary.children){
        //   if(datatype.id === data.id){
        //     this._ws.setCurrent(Entity.DATATYPE, data);
        //     obs.unsubscribe();
        //     resolve(true);
        //   }
        // }
        // obs.unsubscribe();
        // resolve(false);
      });
    });
  }

}
