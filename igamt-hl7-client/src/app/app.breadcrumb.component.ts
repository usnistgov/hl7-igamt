import { Component, OnDestroy } from '@angular/core';
import { AppComponent } from './app.component';
import { BreadcrumbService } from './breadcrumb.service';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from 'primeng/primeng';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html'
})
export class AppBreadcrumbComponent implements OnDestroy {

    subscription: Subscription;

    items: MenuItem[];

    constructor(public breadcrumbService: BreadcrumbService) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
            this.items = response;
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
