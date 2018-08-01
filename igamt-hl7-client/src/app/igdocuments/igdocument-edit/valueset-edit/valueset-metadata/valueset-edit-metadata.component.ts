/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {ValuesetsService} from "../valueSets.service";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";
import {TocService} from "../../service/toc.service";



@Component({
  templateUrl : './valueset-edit-metadata.component.html',
  styleUrls : ['./valueset-edit-metadata.component.css']
})
export class ValuesetEditMetadataComponent {
  currentUrl:any;
    valuesetId:any;
  valuesetMetadata:any;
  existingNames:any;

  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private valuesetsService : ValuesetsService,private tocService:TocService  ){

  }

  ngOnInit() {
    this.tocService.getValuesetBindingIdentifiersList().then( x=>{
      this.existingNames= x;
      console.log(this.existingNames);
        this.valuesetId = this.route.snapshot.params["valuesetId"];
        this.valuesetsService.getValuesetMetadata(this.valuesetId).then( metadata  => {
          this.valuesetMetadata = metadata;
        });
    },
    error=>{
     console.log("Could not load existing names") ;
    })
  }

  print(obj){
    console.log(obj);

  }



}
