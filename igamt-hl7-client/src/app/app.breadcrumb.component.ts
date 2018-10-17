import {Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { AppComponent } from './app.component';
import { BreadcrumbService } from './breadcrumb.service';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from 'primeng/primeng';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html'
    // changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AppBreadcrumbComponent implements OnDestroy {

    subscription: Subscription;

    items: MenuItem[];

    constructor(public breadcrumbService: BreadcrumbService,private ref: ChangeDetectorRef) {
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


}
