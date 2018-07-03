/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";
import {TocService} from "../../service/toc.service";
import {DatatypesService} from "../datatypes.service";



@Component({
  templateUrl : './datatype-edit-metadata.component.html',
  styleUrls : ['./datatype-edit-metadata.component.css']
})
export class DatatypeEditMetadataComponent {
  currentUrl:any;
  datatypeId:any;
  datatypeMetadata:any;
  existingNames:any;

  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private datatypesService : DatatypesService,private tocService:TocService  ){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

  ngOnInit() {
    this.tocService.getDataypeNamesList().then( x=>{
      this.existingNames= x;
      console.log(this.existingNames);
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypeMetadata(this.datatypeId).then( metadata  => {
          this.datatypeMetadata = metadata;
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
