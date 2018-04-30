import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './igdocument-metadata.component.html'
})

export class IgDocumentMetadataComponent implements OnInit {
  constructor(private sp: ActivatedRoute, private  router : Router) { }

  metadata:any;
  ngOnInit() {
    this.sp.data.map(data =>data.metadata).subscribe(x=>{
      this.metadata= x;
      console.log(this.metadata);



    });
  }
}
