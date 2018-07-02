/**
 * Created by Jungyub on 10/23/17.
 */
import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {ValuesetsService} from "../../../../service/valueSets/valueSets.service";



@Component({
  templateUrl : './valueset-edit-predef.component.html',
  styleUrls : ['./valueset-edit-predef.component.css']
})
export class ValuesetEditPredefComponent {
    currentUrl:any;
    valuesetId:any;
    valuesetPredef:any;

    constructor(private route: ActivatedRoute, private  router : Router, private valuesetsService : ValuesetsService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.valuesetId = this.route.snapshot.params["valuesetId"];
        this.valuesetsService.getValuesetPreDef(this.valuesetId).then(data  => {
            this.valuesetPredef = data;
        });
    }
}
