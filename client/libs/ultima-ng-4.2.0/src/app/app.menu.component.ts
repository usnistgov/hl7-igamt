import {Component,Input,OnInit,EventEmitter,ViewChild} from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {AppComponent} from './app.component';

@Component({
    selector: 'app-menu',
    template: `
        <ul app-submenu [item]="model" root="true" class="ultima-menu ultima-main-menu clearfix" [reset]="reset" visible="true"></ul>
    `
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: any[];

    constructor(public app: AppComponent) {}
    
    ngOnInit() {
        this.model = [
            {label: 'Dashboard', icon: 'dashboard', routerLink: ['/']},
            {
                label: 'Themes', icon: 'palette', badge: '6',
                items: [
                    {label: 'Indigo - Pink', icon: 'brush', command: (event) => {this.changeTheme('indigo')}},
                    {label: 'Brown - Green', icon: 'brush', command: (event) => {this.changeTheme('brown')}},
                    {label: 'Blue - Amber', icon: 'brush', command: (event) => {this.changeTheme('blue')}},
                    {label: 'Blue Grey - Green', icon: 'brush', command: (event) => {this.changeTheme('blue-grey')}},
                    {label: 'Dark - Blue', icon: 'brush', command: (event) => {this.changeTheme('dark-blue')}},
                    {label: 'Dark - Green', icon: 'brush', command: (event) => {this.changeTheme('dark-green')}},
                    {label: 'Green - Yellow', icon: 'brush', command: (event) => {this.changeTheme('green')}},
                    {label: 'Purple - Cyan', icon: 'brush', command: (event) => {this.changeTheme('purple-cyan')}},
                    {label: 'Purple - Amber', icon: 'brush', command: (event) => {this.changeTheme('purple-amber')}},
                    {label: 'Teal - Lime', icon: 'brush', command: (event) => {this.changeTheme('teal')}},
                    {label: 'Cyan - Amber', icon: 'brush', command: (event) => {this.changeTheme('cyan')}},
                    {label: 'Grey - Deep Orange', icon: 'brush', command: (event) => {this.changeTheme('grey')}}
                ]
            },
            {
                label: 'Customization', icon: 'settings_application',
                items: [
                    {label: 'Compact Size', icon: 'fiber_manual_record', command: () => this.app.layoutCompact = true},
                    {label: 'Material Size', icon: 'fiber_smart_record',  command: () => this.app.layoutCompact = false},
                    {label: 'Static Menu', icon: 'menu',  command: () => this.app.changeToStaticMenu()},
                    {label: 'Overlay Menu', icon: 'exit_to_app',  command: () => this.app.changeToOverlayMenu()},
                    {label: 'Slim Menu', icon: 'more_vert',  command: () => this.app.changeToSlimMenu()},
                    {label: 'Horizontal Menu', icon: 'border_horizontal',  command: () => this.app.changeToHorizontalMenu()},
                    {label: 'Light Menu', icon: 'label_outline',  command: () => this.app.darkMenu = false},
                    {label: 'Dark Menu', icon: 'label',  command: () => this.app.darkMenu = true},
                    {label: 'Inline Profile', icon: 'contacts',  command: () => this.app.profileMode = 'inline'},
                    {label: 'Top Profile', icon: 'person_pin',  command: () => this.app.profileMode = 'top'},
                ]
            },
            {
                label: 'Components', icon: 'list', badge: '2', badgeStyleClass: 'teal-badge',
                items: [
                    {label: 'Sample Page', icon: 'desktop_mac', routerLink: ['/sample']},
                    {label: 'Forms', icon: 'input', routerLink: ['/forms']},
                    {label: 'Data', icon: 'grid_on', routerLink: ['/data']},
                    {label: 'Panels', icon: 'content_paste', routerLink: ['/panels']},
                    {label: 'Overlays', icon: 'content_copy', routerLink: ['/overlays']},
                    {label: 'Menus', icon: 'menu', routerLink: ['/menus']},
                    {label: 'Messages', icon: 'message', routerLink: ['/messages']},
                    {label: 'Charts', icon: 'insert_chart', routerLink: ['/charts']},
                    {label: 'File', icon: 'attach_file', routerLink: ['/file']},
                    {label: 'Misc', icon: 'toys', routerLink: ['/misc']}
                ]
            },
            {
                label: 'Template Pages', icon: 'get_app',
                items: [
                    {label: 'Empty Page', icon: 'hourglass_empty', routerLink: ['/empty']},
                    {label: 'Landing Page', icon: 'flight_land', url: 'assets/pages/landing.html', target: '_blank'},
                    {label: 'Login Page', icon: 'verified_user', url: 'assets/pages/login.html', target: '_blank'},
                    {label: 'Error Page', icon: 'error', url: 'assets/pages/error.html', target: '_blank'},
                    {label: '404 Page', icon: 'error_outline', url: 'assets/pages/404.html', target: '_blank'},
                    {label: 'Access Denied Page', icon: 'security', url: 'assets/pages/access.html', target: '_blank'}
                ]
            },
            {
                label: 'Menu Hierarchy', icon: 'menu',
                items: [
                    {
                        label: 'Submenu 1', icon: 'subject',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'subject',
                                items: [
                                    {label: 'Submenu 1.1.1', icon: 'subject'},
                                    {label: 'Submenu 1.1.2', icon: 'subject'},
                                    {label: 'Submenu 1.1.3', icon: 'subject'},
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'subject',
                                items: [
                                    {label: 'Submenu 1.2.1', icon: 'subject'},
                                    {label: 'Submenu 1.2.2', icon: 'subject'}
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'subject',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'subject',
                                items: [
                                    {label: 'Submenu 2.1.1', icon: 'subject'},
                                    {label: 'Submenu 2.1.2', icon: 'subject'},
                                    {label: 'Submenu 2.1.3', icon: 'subject'},
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'subject',
                                items: [
                                    {label: 'Submenu 2.2.1', icon: 'subject'},
                                    {label: 'Submenu 2.2.2', icon: 'subject'}
                                ]
                            },
                        ]
                    }
                ]
            },
            {label: 'Utils', icon: 'build', routerLink: ['/utils']},
            {label: 'Documentation', icon: 'find_in_page', routerLink: ['/documentation']}
        ];
    }

    changeTheme(theme) {
        let themeLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('theme-css');
        let layoutLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('layout-css');
        
        themeLink.href = 'assets/theme/theme-' + theme +'.css';
        layoutLink.href = 'assets/layout/css/layout-' + theme +'.css';
    }
}

@Component({
    selector: '[app-submenu]',
    template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass" *ngIf="child.visible === false ? false : true">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" class="ripplelink" *ngIf="!child.routerLink" 
                    [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i class="material-icons">{{child.icon}}</i>
                    <span>{{child.label}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="material-icons submenu-icon" *ngIf="child.items">keyboard_arrow_down</i>
                </a>

                <a (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" class="ripplelink" *ngIf="child.routerLink"
                    [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink" [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
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
export class AppSubMenu {

    @Input() item: MenuItem;
    
    @Input() root: boolean;
    
    @Input() visible: boolean;

    _reset: boolean;
        
    activeIndex: number;

    constructor(public app: AppComponent) {}
        
    itemClick(event: Event, item: MenuItem, index: number) {        
        if(this.root) {
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
        
        //avoid processing disabled items
        if(item.disabled) {
            event.preventDefault();
            return true;
        }
        
        //activate current item and deactivate active sibling if any
        this.activeIndex = (this.activeIndex === index) ? null : index;
                
        //execute command
        if(item.command) {
            item.command({originalEvent: event, item: item});
        }

        //prevent hash change
        if(item.items || (!item.url && !item.routerLink)) {
            event.preventDefault();
        }
        
        //hide menu
        if(!item.items) {
            if(this.app.isHorizontal() || this.app.isSlim())
                this.app.resetMenu = true;
            else
                this.app.resetMenu = false;
                
            this.app.overlayMenuActive = false;
            this.app.staticMenuMobileActive = false;
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
    }
    
    onMouseEnter(index: number) {
        if(this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())) {
            this.activeIndex = index;
        }
    }
    
    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val:boolean) {
        this._reset = val;

        if(this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
            this.activeIndex = null;
        }
    }
}