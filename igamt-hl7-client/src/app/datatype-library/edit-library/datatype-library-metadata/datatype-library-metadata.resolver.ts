/**
 * Created by ena3 on 4/16/18.
 */

import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {IndexedDbService} from "../../../service/indexed-db/indexed-db.service";

@Injectable()
export  class LibMetaDataResolver implements Resolve<any>{



  constructor(private http: HttpClient,private router : Router,private dbService:IndexedDbService) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{

    return this.getMetaData();

  }




  getMetaData(){
    return new Promise((resolve, reject)=>{
      this.dbService.getDataTypeLibrary().then(
        x => {
            resolve(x.metadata);
        },
        error=>{
          this.router.navigate(["/404"]);

        }
      )
    })
  };


}
