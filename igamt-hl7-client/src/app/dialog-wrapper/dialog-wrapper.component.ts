import {Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {ProgressHandlerService} from "../service/progress-handler.service";
import {Router, NavigationEnd} from "@angular/router";
import {RoutingStateService} from "../url/routing-state.service";
import * as StackTrace from 'stacktrace-js';
import {ReportService} from "./report.service";

@Component({
  selector: 'dialog-wrapper',
  templateUrl: './dialog-wrapper.component.html',
  styleUrls: ['./dialog-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class DialogWrapperComponent implements OnInit, AfterViewInit {
  private previousUrl: string;
  private currentUrl: string;
  private reported=false;
  constructor(private  progress: ProgressHandlerService, private ref: ChangeDetectorRef,private router: Router,private errorReporter:ReportService) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        this.reported=false;
      };
    });

  }

  message="";
  reportError : boolean = false;
  stack="";
  error:Error;



  ngOnInit() {
    console.log(this.reportError);
  }


  ngAfterViewInit() {

    this.progress.getReportableError().subscribe(

      x=>{
        if(x){
          this.reportError=true;
        }else{
          this.reportError=false;
        }
        this.error=x;
        //this.parseError(x);
        this.ref.detectChanges();
      }
    );
  }

  previous(){
    this.redirect(this.previousUrl);
  }

  goToHome(){
    this.reportError=false;
    this.error=null;
    setTimeout(() => {this.progress.setReportableError(null); }, 100);
    this.router.navigate(['/']);
  }

  redirect(url){
   let urlWithoutParams="";
    var index= url.indexOf('?');
    if(index>0){
      urlWithoutParams= url.substring(0,index);
    }
    else{
      urlWithoutParams=url;
    }
    setTimeout(() => {this.progress.setReportableError(null); }, 100);

    this.router.navigate([urlWithoutParams]);
  }


  stringifyError(error:Error){
    return JSON.stringify(error);
  }

  sendError(error:Error) {



    const message = error.message ? error.message : error.toString();

    // get the stack trace, lets grab the last 10 stacks only
    StackTrace.fromError(error).then(stackframes => {
        const stackString = stackframes
          .splice(0, 20)
          .map(function (sf) {
            return sf.toString();
          }).join('\n');
        this.message=message;
        this.stack=stackString;

        console.log("Sending error");
        this.errorReporter.reportError({message:message, stack:this.stack,url:this.currentUrl,username:""}).subscribe(x=>{
          this.reported=true;
          setTimeout(() => {this.progress.setReportableError(null); }, 100);
        });
        }
    );
  }

  parseAndSend(error:Error){
    setTimeout(() => {this.sendError(this.error); }, 100);

  }





  }
