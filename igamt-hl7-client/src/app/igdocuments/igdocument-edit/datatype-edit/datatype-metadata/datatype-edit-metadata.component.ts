/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, Input} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {DatatypesService} from "../../../../service/datatypes/datatypes.service";
import {HttpClient} from "@angular/common/http";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";



@Component({
  templateUrl : './datatype-edit-metadata.component.html',
  styleUrls : ['./datatype-edit-metadata.component.css']
})
export class DatatypeEditMetadataComponent {
  currentUrl:any;
  datatypeId:any;
  datatypeMetadata:any;

  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private datatypesService : DatatypesService){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

  ngOnInit() {
      this.datatypeId = this.route.snapshot.params["datatypeId"];
      this.datatypesService.getDatatypeMetadata(this.datatypeId, metadata  => {
        this.datatypeMetadata = metadata;
      });
  }
}
