/**
 * Created by ena3 on 8/14/18.
 */
import {Injectable}  from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {EditLibraryService} from "./edit-library.service";

@Injectable()
export  class DatatypeLibraryEditResolver implements Resolve<any>{
  constructor(private editLibraryService:EditLibraryService ) {

  }

  resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{

    let libId = route.params["libId"];

    console.log("calling ig resolver");
    console.log(route);
    return this.editLibraryService.getLib(libId);



  }



}
