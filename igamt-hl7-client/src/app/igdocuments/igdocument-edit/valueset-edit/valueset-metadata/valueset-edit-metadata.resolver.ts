/**
 * Created by ena3 on 5/18/18.
 */
/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {ValuesetsService} from "../valuesets.service";


@Injectable()
export  class ValuesetEditMetadataResolver implements Resolve<any> {
  constructor(private http: HttpClient, private valuesetsService: ValuesetsService) {

  }
  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Promise<any> {
    const valuesetId = route.params['valuesetId'];
    return this.valuesetsService.getValuesetMetadata(valuesetId);
  }
}



