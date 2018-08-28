/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";
import * as _ from 'lodash';
import {Types} from "../../common/constants/types";
import {IgDocumentInfo} from "../../service/indexed-db/ig-document-info-database";
import {TocService} from "./service/toc.service";
import {HttpErrorResponse} from "@angular/common/http";
import {IgDocumentService} from "./ig-document.service";

@Injectable()
export  class IgdocumentEditResolver implements Resolve<any>{
  constructor(private igDocumentService:IgDocumentService ) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{

    let igId = route.params["igId"];

    console.log("calling ig resolver");
    console.log(route);
    return this.igDocumentService.getIg(igId);



  }



}



