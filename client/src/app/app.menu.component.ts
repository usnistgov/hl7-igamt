import {Component, Input, OnInit, EventEmitter, ViewChild} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {AppComponent} from './app.component';

@Component({
  selector: 'app-menu',
  template: `
    <ul app-submenu [item]="model" root="true" class="ultima-menu ultima-main-menu clearfix" [reset]="reset"
        visible="true"></ul>
  `
})
export class AppMenuComponent implements OnInit {

  @Input() reset: boolean;

  model: any[];

  constructor(public app: AppComponent) {
  }

  ngOnInit() {
    this.model = [
      {label: 'Home', icon: 'dashboard', routerLink: ['/']},
      {
        label: 'IG Documents', icon: 'palette', badge: '6',
        items: [
          {
            label: 'Create New Document', icon: 'plus', routerLink: ['/ig-documents/create'], command: (event) => {
            this.createNewIgDocument();
          }
          },
          {
            label: 'My Documents', icon: 'brush', routerLink: ['/ig-documents/my-igs'], command: (event) => {
            this.loadScopeIgDocuments('USER');
          }
          },
          {
            label: 'Shared With Me', icon: 'brush', routerLink: ['/ig-documents/shared-igs'], command: (event) => {
            this.loadScopeIgDocuments('SHARED');
          }
          },
          {
            label: 'Pre-loaded Documents', icon: 'brush', routerLink: ['/ig-documents/preloaded-igs'], command: (event) => {
            this.loadScopeIgDocuments('PRELOADED');
          }
          },
          {
            label: 'All IG Documents', icon: 'brush', routerLink: ['/ig-documents/all'], command: (event) => {
            this.loadScopeIgDocuments('ALL');
          }
          }
        ]
      },
      {label: 'Data type Libraries', icon: 'list', routerLink: ['/datatype-libraries']},
      {label: 'Comparator', icon: 'dashboard', routerLink: ['/comparator']},
      {label: 'Documentation', icon: 'dashboard', routerLink: ['/documentation']},
      {label: 'Configuration', icon: 'dashboard', routerLink: ['/configuration']},
      {label: 'Search', icon: 'search', routerLink: ['/search']},
      {label: 'About', icon: 'info', routerLink: ['/about']}
    ];
  }

  loadScopeIgDocuments(scope) {

  }

  createNewIgDocument() {

  }
}

@Component({
  selector: '[app-submenu]',
  template: `
    <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
      <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass"
          *ngIf="child.visible === false ? false : true">
        <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" class="ripplelink"
           *ngIf="!child.routerLink"
           [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
          <i class="material-icons">{{child.icon}}</i>
          <span>{{child.label}}</span>
          <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
          <i class="material-icons submenu-icon" *ngIf="child.items">keyboard_arrow_down</i>
        </a>

        <a (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" class="ripplelink"
           *ngIf="child.routerLink"
           [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
           [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null"
           [attr.target]="child.target">
          <i class="material-icons">{{child.icon}}</i>
          <span>{{child.label}}</span>
          <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
          <i class="material-icons submenu-icon" *ngIf="child.items">keyboard_arrow_down</i>
        </a>
        <div class="layout-menu-tooltip">
          <div class="layout-menu-tooltip-arrow"></div>
          <div class="layout-menu-tooltip-text">{{child.label}}</div>
        </div>
        <ul app-submenu [item]="child" *ngIf="child.items" [visible]="isActive(i)" [reset]="reset"
            [@children]="(app.isSlim()||app.isHorizontal())&&root ? isActive(i) ? 'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
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
        height: '*'
      })),
      state('hidden', style({
        height: '0px'
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

  constructor(public app: AppComponent) {
  }

  itemClick(event: Event, item: MenuItem, index: number) {
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
      item.command({originalEvent: event, item: item});
    }

    // prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      event.preventDefault();
    }

    // hide menu
    if (!item.items) {
      if (this.app.isHorizontal() || this.app.isSlim())
        this.app.resetMenu = true;
      else
        this.app.resetMenu = false;

      this.app.overlayMenuActive = false;
      this.app.staticMenuMobileActive = false;
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }
  }

  onMouseEnter(index: number) {
    if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())) {
      this.activeIndex = index;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input()
  get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;

    if (this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
      this.activeIndex = null;
    }
  }
}
