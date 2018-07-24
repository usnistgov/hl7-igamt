/**
 * Created by ena3 on 7/19/18.
 */
import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {IgErrorService} from "./ig-error.service";
/**
 * Created by ena3 on 7/19/18.
 */
@Injectable()
export  class IgErrorResolver implements Resolve<any> {
  constructor(private errorService:IgErrorService) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {

    return Observable.of(this.errorService.getError());


  }
}
