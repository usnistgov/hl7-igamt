import {Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { AppComponent } from './app.component';
import { BreadcrumbService } from './breadcrumb.service';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from 'primeng/primeng';
import {Router, NavigationEnd} from "@angular/router";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html'
    // changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AppBreadcrumbComponent implements OnDestroy {

    subscription: Subscription;

    items: MenuItem[];
    previousUrl;
    currentUrl="";
     history=[];
     index=0;
    constructor(public breadcrumbService: BreadcrumbService,private ref: ChangeDetectorRef, private  router:Router) {
      this.currentUrl = this.router.url;


      router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url;
        };
      });
      this.router.events.filter((event) => event instanceof NavigationEnd)
        .subscribe(({urlAfterRedirects}: NavigationEnd) => {
          this.history = [...this.history, urlAfterRedirects];
          this.index=this.history.length-1;
        });


      this.subscription = breadcrumbService.getItemsSource().subscribe(response => {



        this.items = response;
        //this.ref.detectChanges();

      });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    previous(){

      if(this.index>1&&this.history.length>this.index-1){
        this.index--;
        this.router.navigateByUrl(this.history[this.index]);

      }
    }

    forward(){

      if(this.index>-1&&this.history.length>this.index+1){
        this.index++;
      this.router.navigateByUrl(this.history[this.index]);

     }
    }


    getPrevious(){
      console.log(this.history);

      if(this.index>1&&this.history.length>this.index-1){
        this.router.navigateByUrl(this.history[this.index - 1]);

      }
    }


}
