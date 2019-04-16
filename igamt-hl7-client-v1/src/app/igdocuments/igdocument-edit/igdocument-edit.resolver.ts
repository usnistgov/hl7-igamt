/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {IgDocumentService} from "./ig-document.service";

@Injectable()
export  class IgdocumentEditResolver implements Resolve<any>{
  constructor(private igDocumentService:IgDocumentService ) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{

    let igId = route.params["igId"];


    return this.igDocumentService.getIg(igId);



  }



}



