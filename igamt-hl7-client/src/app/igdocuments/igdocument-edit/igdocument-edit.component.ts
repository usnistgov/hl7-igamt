import {Component, Input} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WorkspaceService, Entity} from "../../service/workspace/workspace.service";
import {Http} from "@angular/http";
import {MenuItem} from "primeng/components/common/menuitem";
// import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";
import {HttpClient} from "@angular/common/http";
import {SelectItem} from "primeng/components/common/selectitem";

@Component({
    templateUrl: './igdocument-edit.component.html',
    styleUrls : ['./igdocument-edit.component.css']
})
export class IgDocumentEditComponent {

  items: any[];
  menui: any[];
  _ig : any;


  constructor(private route : ActivatedRoute,
              private http: HttpClient){

      this.route.data.map(data =>data.currentIg).subscribe(x=>{
        console.log(x);
        this._ig= x;

        localStorage.setItem("currentIg",this._ig);
        console.log(this._ig);
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
