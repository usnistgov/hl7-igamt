import {Component, Input} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WorkspaceService, Entity} from "../../service/workspace/workspace.service";
import {Http} from "@angular/http";
import {MenuItem} from "primeng/components/common/menuitem";
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";

@Component({
    templateUrl: './igdocument-edit.component.html',
    styleUrls : ['./igdocument-edit.component.css']
})
export class IgDocumentEditComponent {

  items: any[];
  menui: any[];
  _ig : any;


  constructor(private route : ActivatedRoute,
              private _ws   : WorkspaceService,
              private $http : Http,
              private dbService: IndexedDbService){
    this.ig = this._ws.getCurrent(Entity.IG).subscribe(data => {this.ig=data

      this.dbService.init(this._ig);
    });
  };

  @Input() set ig(doc){
    this._ig = doc;


  }

  ngOnInit(){


    this.items = [
      {
        label : "Close",
        icon  : "fa-times"
      },
      {
        label : "Verify",
        icon  : "fa-check"
      },
      {
        label : "Share",
        icon  : "fa-share-alt"
      },
      {
        label : "Usage Filter",
        model : [
          { label : "All Usages" },
          { label : "RE / C / O" }
        ]
      },
      {
        label : "Export",
        icon  : "fa-download"
      },
      {
        label : "Connect To GVT",
        icon  : "fa-paper-plane"
      }
    ];

    this.menui = [
      { label : "All Usages" },
      { label : "RE / C / O" }
    ];

  }
}
