/**
 * Created by Jungyub on 10/23/17.
 */
import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {DatatypesService} from "../../../../service/datatypes/datatypes.service";



@Component({
  templateUrl : './datatype-edit-predef.component.html',
  styleUrls : ['./datatype-edit-predef.component.css']
})
export class DatatypeEditPredefComponent {
    currentUrl:any;
    datatypeId:any;
    datatypePredef:any;

    constructor(private route: ActivatedRoute, private  router : Router, private datatypesService : DatatypesService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypePreDef(this.datatypeId).then(data  => {
            this.datatypePredef = data;
        });
    }
}
