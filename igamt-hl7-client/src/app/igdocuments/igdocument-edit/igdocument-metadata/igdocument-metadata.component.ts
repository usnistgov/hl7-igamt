import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './igdocument-metadata.component.html'
})

export class IgDocumentMetadataComponent implements OnInit {
  constructor(private sp: ActivatedRoute, private  router : Router) { }

  metaData:any;
  ngOnInit() {
    this.sp.data.map(data =>data.metadata).subscribe(x=>{
      this.metaData= x;
      console.log(this.metaData);



    });
  }
}
