import {Component, OnInit} from '@angular/core';
import {SelectItem} from "primeng/components/common/selectitem";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
    templateUrl: './igdocument-list.component.html'
})
export class IgDocumentListComponent implements OnInit {
  igs :any


  sortKey: string;

  sortField: string;
  moreInfoMap={};
  sortOptions: SelectItem[]= [
  {label: 'Newest First', value: '!dateUpdated'},
  {label: 'Oldest First', value: 'dateUpdated'},
  {label: 'Title', value: 'title'}
  ];

  sortOrder: number;

  constructor(public activeRoute: ActivatedRoute,public  router:Router, public http:HttpClient) {
    this.activeRoute.data.map(data =>data.igList).subscribe(x=>{



      this.igs=x;

    });
  }
  ngOnInit() {
  }
  open(ig,readnly){
    this.router.navigate(['/ig/'+ig.id+'/metadata']);
  }

  onSortChange(event) {
    console.log(event);
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  toggleMoreInfo(id){
    if(this.moreInfoMap[id]){
      this.moreInfoMap[id]=!this.moreInfoMap[id];
    }else{
      this.moreInfoMap[id]=true;
    }
  }

  copy(id){
    this.http.get<any>("/api/igdocuments/"+id+"/clone").toPromise().then(
      x => {
        console.log(x);
        this.router.navigate(['/ig/'+x.id]);
      }, error =>{
        console.log(error);

      });
  };

}
