import { Component, OnInit } from '@angular/core';
import {IgListService} from "../igdocument-list.service";
import {Router, ActivatedRoute} from "@angular/router";
import {SelectItem} from "primeng/components/common/selectitem";
import {HttpClient} from "@angular/common/http";

@Component({
  templateUrl: './my-igs.component.html'
})

export class MyIgsComponent implements OnInit {

  igs :any
  sortOptions: SelectItem[];

  sortKey: string;

  sortField: string;
  moreInfoMap={};

  sortOrder: number;

  constructor(public activeRoute: ActivatedRoute,public  router:Router, public http:HttpClient) {
    this.activeRoute.data.map(data =>data.myIgs).subscribe(x=>{
      this.igs=x;
      this.sortOptions = [
        {label: 'Newest First', value: '!dateUpdated'},
        {label: 'Oldest First', value: 'dateUpdated'},
        {label: 'Title', value: 'title'}
      ];


    });



  }


  ngOnInit() {
   // this.igs=[{"title":"testing","position":0,"coverpage":null,"subtitle":null,"dateUpdated":1498143086873,"id":{"id":"58a7197c84ae67528dafbb8e","version":1},"confrmanceProfiles":null,"username":"wakili"},{"title":"MESSAGING GUIDE FOR SYNDROMIC SURVEILLANCE: EMERGENCY  DEPARTMENT, URGENT CARE, INPATIENT, AND AMBULATORY CARE SETTINGS- Copy- Copy- Copy","position":0,"coverpage":"https://hl7v2.igamt.nist.gov/igamt/api/uploaded_files/file?name=8c88df56-e1bd-4790-bfe2-d08413885691.png","subtitle":"ADT MESSAGES A01, A03, A04, and A08, with Optional ORU^R01 Message Notation for Laboratory Data  ~  Release 2.2 w/ ERRATUM Content and NIST Clarification Content","dateUpdated":1517325828397,"id":{"id":"5a708e0484ae8dd4a7ea94a2","version":1},"confrmanceProfiles":null,"username":null},{"title":"scscss","position":0,"coverpage":null,"subtitle":null,"dateUpdated":1507643726880,"id":{"id":"5879129784ae09eee0fb6bd1","version":1},"confrmanceProfiles":null,"username":null},{"title":"Mock- Copysss","position":0,"coverpage":null,"subtitle":"mock","dateUpdated":1520615985553,"id":{"id":"5a564a8084aee590a9f35fb7","version":1},"confrmanceProfiles":null,"username":null},{"title":"test","position":0,"coverpage":null,"subtitle":null,"dateUpdated":1506522413787,"id":{"id":"587e3a3b84aee2edcf835b6b","version":1},"confrmanceProfiles":null,"username":null},{"title":"Mock","position":0,"coverpage":null,"subtitle":"mock","dateUpdated":1517516698985,"id":{"id":"5a203e2984ae98b394159cb2","version":1},"confrmanceProfiles":null,"username":null},{"title":"cccsscs","position":0,"coverpage":null,"subtitle":"scscsc","dateUpdated":1514923736721,"id":{"id":"5a43c0e084ae939e4e90a719","version":1},"confrmanceProfiles":null,"username":null},{"title":"IMPLEMENTATION GUIDE FOR SYNDROMIC SURVEILLANCE- Copy","position":0,"coverpage":"https://hl7v2.igamt.nist.gov/igamt/api/uploaded_files/file?name=8c88df56-e1bd-4790-bfe2-d08413885691.png","subtitle":"Release 0.94","dateUpdated":1517425486319,"id":{"id":"5a720db684ae06ddc1f45343","version":1},"confrmanceProfiles":null,"username":null},{"title":"AAAAAAAAAAA","position":0,"coverpage":null,"subtitle":"bbbb","dateUpdated":1521480964808,"id":{"id":"5aaff12884ae5da45060ff35","version":1},"confrmanceProfiles":null,"username":null},{"title":"VXU V04 Implementation Guide","position":0,"coverpage":null,"subtitle":"NIST","dateUpdated":1513740856855,"id":{"id":"5810bd7884ae36ea378a59eb","version":1},"confrmanceProfiles":null,"username":null},{"title":"qwswsw","position":0,"coverpage":null,"subtitle":"wwsw","dateUpdated":1514923740715,"id":{"id":"5a468d0284ae939e4ea18456","version":1},"confrmanceProfiles":null,"username":null},{"title":"scscss- Copy","position":0,"coverpage":null,"subtitle":null,"dateUpdated":1507652558864,"id":{"id":"59949a9884ae63028106d148","version":1},"confrmanceProfiles":null,"username":null},{"title":"IZ Profiles- Copy","position":0,"coverpage":null,"subtitle":"","dateUpdated":1508853393329,"id":{"id":"59949aad84ae63028106f4fe","version":1},"confrmanceProfiles":null,"username":null},{"title":"TEST- Copy","position":0,"coverpage":null,"subtitle":"TT","dateUpdated":1519321275778,"id":{"id":"5a8f00bb84aecfd8dba5a7d3","version":1},"confrmanceProfiles":null,"username":null},{"title":"IZ Profiles- Copy","position":0,"coverpage":null,"subtitle":"","dateUpdated":1511801827997,"id":{"id":"5994a93b84aee1277f13e1d9","version":1},"confrmanceProfiles":null,"username":null},{"title":"IZ Profiles- Copy","position":0,"coverpage":null,"subtitle":"","dateUpdated":1519161135991,"id":{"id":"58f4f26484ae24658e5f2ec3","version":1},"confrmanceProfiles":null,"username":null},{"title":"ORU","position":0,"coverpage":null,"subtitle":"eeee","dateUpdated":1502903224966,"id":{"id":"596e33fa84ae537cf9eb43c6","version":1},"confrmanceProfiles":null,"username":null},{"title":"IZ Profiles","position":0,"coverpage":null,"subtitle":"","dateUpdated":1484333770696,"id":{"id":"58791a8984aec62b5508dd5e","version":1},"confrmanceProfiles":null,"username":null},{"title":"IMPLEMENTATION GUIDE FOR SYNDROMIC SURVEILLANCE- Copy","position":0,"coverpage":"https://hl7v2.igamt.nist.gov/igamt/api/uploaded_files/file?name=8c88df56-e1bd-4790-bfe2-d08413885691.png","subtitle":"Release 0.94","dateUpdated":1517514151332,"id":{"id":"5a72030184ae06ddc1f06b62","version":1},"confrmanceProfiles":null,"username":null},{"title":"demo","position":0,"coverpage":null,"subtitle":null,"dateUpdated":1507649912955,"id":{"id":"58791a6d84aec62b5508b0a6","version":1},"confrmanceProfiles":null,"username":null},{"title":"aaaaaaaaa","position":0,"coverpage":null,"subtitle":"aaa","dateUpdated":1514923722833,"id":{"id":"5a4a7e5484aef4028b57959d","version":1},"confrmanceProfiles":null,"username":null},{"title":"AAAAAAAAAAA- Copy","position":0,"coverpage":null,"subtitle":"bbbb","dateUpdated":1522850119074,"id":{"id":"5ac4d94784aec2a1d3db961e","version":1},"confrmanceProfiles":null,"username":null},{"title":"aaaaa","position":0,"coverpage":null,"subtitle":"aaaaaaaaa","dateUpdated":1515086057000,"id":{"id":"5a4bd7ff84aef4028b66ce45","version":1},"confrmanceProfiles":null,"username":null},{"title":"LOI IG- Copy","position":0,"coverpage":null,"subtitle":"Default Sub Title","dateUpdated":1511275443730,"id":{"id":"59a4399784aeb5e8b4ac2563","version":1},"confrmanceProfiles":null,"username":null},{"title":"aaaaaaaa","position":0,"coverpage":null,"subtitle":"aaaa","dateUpdated":1517258233444,"id":{"id":"5a4be73184aef4028b6a1d4e","version":1},"confrmanceProfiles":null,"username":null},{"title":"TEEEEEEST","position":0,"coverpage":null,"subtitle":"NAAAAA","dateUpdated":1518037471741,"id":{"id":"5a4bc85a84aef4028b6106dc","version":1},"confrmanceProfiles":null,"username":null}];


  }

  open(ig,readnly){
    this.router.navigate(['/ig/'+ig.id.id]);
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
    if(this.moreInfoMap[id.id]){
      this.moreInfoMap[id.id]=!this.moreInfoMap[id.id];
    }else{
      this.moreInfoMap[id.id]=true;
    }
    console.log(this.moreInfoMap);

  }

  copy(id){
    this.http.get<any>("/api/igdocuments/"+id+"/clone").toPromise().then(

      x => {
        console.log(x);

        this.router.navigate(['/ig/'+x.id],{ queryParams: { readOnly: "true" } });

      }, error =>{

        console.log(error);

      });
  };

}
