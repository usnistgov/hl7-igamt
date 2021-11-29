import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ErrorService} from "./error.service";
/**
 * Created by ena3 on 7/19/18.
 */
@Injectable()
export  class ErrorResolver implements Resolve<any> {
  constructor(private errorService:ErrorService) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {

    return Observable.of(this.errorService.getError());


  }
}
