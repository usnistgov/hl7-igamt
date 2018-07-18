/**
 * Created by Jungyub on 10/23/17.
 */
import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {ValuesetsService} from "../valueSets.service";
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import { _ } from 'underscore';

@Component({
  selector : 'valueset-edit',
  templateUrl : './valueset-edit-structure.component.html',
  styleUrls : ['./valueset-edit-structure.component.css']
})
export class ValuesetEditStructureComponent {
    currentUrl:any;
    valuesetId:any;
    valuesetStructure:any;
    extensibilityOptions:any;
    stabilityOptions:any;
    contentDefinitionOptions:any;

    constructor(private route: ActivatedRoute, private  router : Router, private valuesetsService : ValuesetsService, private configService : GeneralConfigurationService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.valuesetId = this.route.snapshot.params["valuesetId"];
        this.valuesetsService.getValuesetStructure(this.valuesetId).then(data  => {
            this.valuesetStructure = data;
        });

        this.extensibilityOptions = this.configService._extensibilityOptions;
        this.stabilityOptions = this.configService._stabilityOptions;
        this.contentDefinitionOptions = this.configService._contentDefinitionOptions;
    }
}
