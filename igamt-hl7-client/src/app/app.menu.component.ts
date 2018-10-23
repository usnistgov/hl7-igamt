import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/primeng';
import { AppComponent } from './app.component';
import {Router, NavigationEnd} from "@angular/router";

@Component({
    selector: 'app-menu',
    template: `
        <ul app-submenu [item]="model" root="true" class="layout-menu" [reset]="reset" visible="true"></ul> 
    `
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: any[];

    constructor(public app: AppComponent, private router:Router) { }
  ngOnInit() {
    this.model = [
      {label: 'Home', icon: 'fa fa-home', id:'home',
        command: (event) => {
      this.router.navigate(['/'])
        }},
      {
        label: 'IG Documents', icon: 'fa fa-book', id:"ig-documents/",
        items: [
          {
            label: 'Create New Document', icon: 'fa fa-plus', routerLink: ['/ig-documents/create']
          },
          {
            label: 'My Documents', routerLink: ['/ig-documents/list'],icon: 'fa fa-user',  queryParams: {type: "USER"}
          },
          {
            label: 'Shared With Me', routerLink: ['/ig-documents/list'], icon:"fa fa-share-alt",queryParams: {type: "SHARED"}
          },
          {
            label: 'Pre-loaded Documents', routerLink: ['/ig-documents/list'], icon: 'fa fa-history', queryParams: {type: "PRELOADED"}
          },
          {
            label: 'All IG Documents', routerLink: ['/ig-documents/list'], icon: 'fa fa-list',queryParams: {type: "ALL"}
          }
        ]
      },

      {
        label: 'Data Type Libraries', icon: 'fa fa-file-text',id:"datatype-libraries/",
        items: [
          {
            label: 'Create Library', icon: 'fa fa-plus', routerLink: ['/datatype-libraries/create']
          },
          {
            label: 'My Libraries',icon: 'fa fa-list' , routerLink: ['/datatype-libraries/list'],queryParams: {libType: 'USER'}
          },
          {
            label: 'Published Standard Libraries', icon: 'fa fa-history' , routerLink: ['/datatype-libraries/list'],queryParams: {libType: 'PUBLISHED'}

          },
          {
            label: 'Data Type Evolutions', icon: 'fa fa-line-chart custom', routerLink: ['/datatype-libraries/evolution']
          }
        ]
      },
      {label: 'Comparator', icon: 'dashboard', routerLink: ['/comparator']},
      {label: 'Documentation', icon: 'fa fa-file-text', routerLink: ['/documentation']},
      {label: 'Configuration', icon: 'fa fa-cog', routerLink: ['/configuration']},
      {label: 'Search', icon: 'fa fa-search', routerLink: ['/search']},
      {label: 'About', icon: 'fa fa-info', routerLink: ['/about']}
    ];
  }

}

@Component({
    /* tslint:disable:component-selector */
    selector: '[app-submenu]',
    /* tslint:enable:component-selector */
    template:
      `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" *ngIf="child.visible === false ? false : true">
                <a (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)"
                   *ngIf="!child.routerLink"
                   [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <span [ngClass]="{'parentMenu': isActiveParent(child)}">
                    <i [ngClass]="child.icon"></i>

                    {{child.label}}
                     <i class="fa fa-fw fa-angle-down layout-menuitem-toggler" *ngIf="child.items"></i>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    </span> 
                    
            
                </a>

                <a (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" *ngIf="child.routerLink"
                    [routerLink]="child.routerLink" [queryParams]="child.queryParams" routerLinkActive="active-menuitem-routerlink"
                    [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i *ngIf="child.icon" [ngClass]="child.icon"></i>
                    <span>{{child.label}}</span>
                    <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                </a>
                <div class="layout-menu-tooltip">
                  <div class="layout-menu-tooltip-arrow"></div>
                  <div class="layout-menu-tooltip-text">{{child.label}}</div>
                </div>
                <ul app-submenu [item]="child" *ngIf="child.items" [visible]="isActive(i)" [reset]="reset"></ul>
            </li>
        </ng-template>
    `,
    animations: [
        trigger('children', [
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*',
                'z-index': 100
            })),
            state('hidden', style({
                height: '0px',
                'z-index': '*'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppSubMenuComponent {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    _reset: boolean;

    activeIndex: number;
    currentUrl:string="";

    constructor(public app: AppComponent, private router :Router) {

      router.events.subscribe(event => {
        if (event instanceof NavigationEnd ) {
          this.currentUrl=event.url;
        }
      });

    }

    isActiveParent(item) {
      if(item.id&&this.currentUrl){

        return this.currentUrl.indexOf(item.id)>-1;
      }
    }



    itemClick(event: Event, item: MenuItem, index: number)  {
        if (this.root) {
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
        // avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        // activate current item and deactivate active sibling if any
        this.activeIndex = (this.activeIndex === index) ? null : index;

        // execute command
        // if (item.command) {
        //     item.command({ originalEvent: event, item: item });
        // }

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            setTimeout(() => {
              this.app.layoutMenuScrollerViewChild.moveBar();
            }, 450);
            event.preventDefault();
        }

        // hide menu
        if (!item.items) {
            if (this.app.isHorizontal() || this.app.isSlim()) {
                this.app.resetMenu = true;
            } else {
                this.app.resetMenu = false;
            }

            this.app.overlayMenuActive = false;
            this.app.staticMenuMobileActive = false;
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
    }

    onMouseEnter(index: number) {
        if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())
          && !this.app.isMobile() && !this.app.isTablet()) {
            this.activeIndex = index;
        }
    }

    isActive(index: number): boolean {

        return this.activeIndex === index;
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val: boolean) {
        this._reset = val;

        if (this._reset && (this.app.isHorizontal() ||  this.app.isSlim())) {
            this.activeIndex = null;
        }
    }
}
