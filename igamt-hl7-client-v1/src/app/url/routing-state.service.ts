import { Injectable } from '@angular/core';
import {Router, NavigationEnd} from "@angular/router";
import { filter } from 'rxjs/operator/filter';
@Injectable()
export class RoutingStateService {
  private history = [];

  constructor(
    private router: Router
  ) {
    this.loadRouting();
  }

  public loadRouting(): void {
    this.router.events.filter((event) => event instanceof NavigationEnd)
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });

  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/';
  }

}
