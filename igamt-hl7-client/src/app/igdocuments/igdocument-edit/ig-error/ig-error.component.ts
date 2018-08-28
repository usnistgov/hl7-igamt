import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ig-error',
  templateUrl: './ig-error.component.html',
  styleUrls: ['./ig-error.component.css']
})
export class IgErrorComponent implements OnInit {
  error:any;
  constructor(private sp: ActivatedRoute) {

    this.sp.data.map(data =>data.error).subscribe(x=>{
      this.error=x;
    });
  }

  ngOnInit() {
  }

}
