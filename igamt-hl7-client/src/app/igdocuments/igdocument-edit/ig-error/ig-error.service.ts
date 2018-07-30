import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Router, ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";
import {MessageService} from "primeng/components/common/messageservice";
import {TocService} from "../service/toc.service";

@Injectable()
export class IgErrorService {
  error:any;

  constructor(private  router:Router, private ar: ActivatedRoute ,private tocService:TocService, private messageService:MessageService){


  }

  getError(){
    return this.error;
  }



  setError(error){
    this.error=error;
  }

  redirect(error){
    this.setError(error);
    console.log("TEST")
    console.log("router")
    console.log(this.router.url);
    console.log(this.ar);


    this.router.navigateByUrl("/ig/"+this.tocService.getIgId()+"/error");
  //
  }


  reloadIg(error){
    this.setError(error);

    console.log(this.router.url);
    console.log(this.ar);
    this.messageService.clear();
    this.router.navigateByUrl("/ig/"+this.tocService.getIgId());
    //
  }

  showError(error:any) {
    console.log(error);
    this.messageService.add({severity:'error', summary:error.error.error, detail:error.error.message, id:'IGERROR'});
  }





}
