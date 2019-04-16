import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ig-error',
  templateUrl: 'lib-error.component.html',
  styleUrls: ['lib-error.component.css']
})
export class LibErrorComponent implements OnInit {
  error:any;
  constructor(private sp: ActivatedRoute) {

    this.sp.data.map(data =>data.error).subscribe(x=>{
      this.error=x;
    });
  }

  ngOnInit() {
  }

}
