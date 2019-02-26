/**
 * Created by Jungyub Woo on 2/26/19.
 */

import {Injectable}  from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {IndexedDbService} from "../../../service/indexed-db/indexed-db.service";
import {IgDocumentService} from "../ig-document.service";

@Injectable()
export  class IgConformancestatementResolver implements Resolve<any>{

    constructor(private router : Router,private igDocumentService : IgDocumentService, private dbService : IndexedDbService) {
    }

    resolve(route: ActivatedRouteSnapshot, rstate : RouterStateSnapshot): Promise<any>{

        return this.getCS();

    }

    getCS(){
        return new Promise((resolve, reject)=>{
            this.dbService.getIgDocumentId().then(
                id => {
                    this.igDocumentService.getIGDocumentConformanceStatements(id).then(data => {
                        resolve(data);
                    }, err => {
                        console.log("WOOO");
                        console.log(err);
                        this.router.navigate(["/404"]);
                    });

                },
                error=>{

                    this.router.navigate(["/404"]);

                    //console.log("Could not find the MetaData ")

                }
            )
        })
    };
}
