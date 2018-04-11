/**
 * Created by ena3 on 12/11/17.
 */
import { Injectable }           from '@angular/core';
import { Observable }           from 'rxjs/Observable';
import { CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot }  from '@angular/router';
import {SegmentEditComponent} from "./segment-edit.component";

import {WorkspaceService, Entity} from "../../../service/workspace/workspace.service";
import {Http} from "@angular/http";
import {IndexedDbService} from "../../../service/indexed-db/indexed-db.service";
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<SegmentEditComponent> {


  constructor(private _ws : WorkspaceService,
              private db : IndexedDbService){};
  canDeactivate(
    component: SegmentEditComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
      console.log("Calling Desactivate");

    if(component.hash() !== this._ws.getPreviousHash()){
      console.log("saving");
      this.db.saveSegment(component._segment);
      console.log("saving");
      return Observable.of(true);

    }else{
      return Observable.of(true);
    }


  }
}
