import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
    error:any;
  constructor(private sp: ActivatedRoute) {

    this.sp.data.map(data =>data.error).subscribe(x=>{
      this.error=x;
    });
  }

  ngOnInit() {
  }

}
