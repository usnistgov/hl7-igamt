import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/primeng';
import { AppComponent } from './app.component';
import {Router} from "@angular/router";

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
      {label: 'Home', icon: 'dashboard', routerLink: ['/']},
      {
        label: 'IG Documents', icon: 'palette',
        items: [
          {
            label: 'Create New Document', icon: 'plus', routerLink: ['/ig-documents/create'], command: (event) => {
          }
          },
          {
            label: 'My Documents', icon: 'brush', routerLink: ['/ig-documents/my-igs'], command: (event) => {
          }
          },
          {
            label: 'Shared With Me', icon: 'brush', routerLink: ['/ig-documents/shared-igs'], command: (event) => {
          }
          },
          {
            label: 'Pre-loaded Documents', icon: 'brush', routerLink: ['/ig-documents/preloaded-igs'], command: (event) => {
          }
          },
          {
            label: 'All IG Documents', icon: 'brush', routerLink: ['/ig-documents/all'], command: (event) => {
          }
          }
        ]
      },

      {
        label: 'Data Type Libraries', icon: 'palette',
        items: [
          {
            label: 'Create Library', icon: 'plus', routerLink: ['/datatype-libraries/create'], command: (event) => {
          }
          },
          {
            label: 'My Libraries', icon: 'brush'   , command: (event) => {

            this.router.navigate(['datatype-libraries/list'],{  queryParams: {libType: 'USER'}});

          }
          },
          {
            label: 'Published Standard Libraries', icon: 'brush' , command: (event) => {
            this.router.navigate(['datatype-libraries/list'],{  queryParams: {libType: 'PUBLISHED'}});

          }
          },
          {
            label: 'Datatype Evolutions', icon: 'brush', routerLink: ['datatype-libraries/evolution'], command: (event) => {
          }
          }
        ]
      },
      {label: 'Comparator', icon: 'dashboard', routerLink: ['/comparator']},
      {label: 'Documentation', icon: 'dashboard', routerLink: ['/documentation']},
      {label: 'Configuration', icon: 'dashboard', routerLink: ['/configuration']},
      {label: 'Search', icon: 'search', routerLink: ['/search']},
      {label: 'About', icon: 'info', routerLink: ['/about']}
    ];
  }

}

@Component({
    /* tslint:disable:component-selector */
    selector: '[app-submenu]',
    /* tslint:enable:component-selector */
    template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass" *ngIf="child.visible === false ? false : true">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)"
                   *ngIf="!child.routerLink" [ngClass]="child.styleClass"
                   [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i [ngClass]="child.icon"></i>
                    <span>{{child.label}}</span>
                    <i class="fa fa-fw fa-angle-down layout-menuitem-toggler" *ngIf="child.items"></i>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                </a>

                <a (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" *ngIf="child.routerLink"
                    [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
                    [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i [ngClass]="child.icon"></i>
                    <span>{{child.label}}</span>
                    <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                </a>
                <div class="layout-menu-tooltip">
                  <div class="layout-menu-tooltip-arrow"></div>
                  <div class="layout-menu-tooltip-text">{{child.label}}</div>
                </div>
                <ul app-submenu [item]="child" *ngIf="child.items" [visible]="isActive(i)" [reset]="reset"
                    [@children]="(app.isSlim()||app.isHorizontal())&&root ? isActive(i) ?
                    'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
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

    constructor(public app: AppComponent) { }

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
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

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
