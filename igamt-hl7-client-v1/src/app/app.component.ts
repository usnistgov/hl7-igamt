import {
  Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import {ScrollPanel} from 'primeng/primeng';
import {HttpClient} from "@angular/common/http";
import {WorkspaceService} from "./service/workspace/workspace.service";
import {NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Router} from "@angular/router";
import {ProgressHandlerService} from "./service/progress-handler.service";
import {Message} from 'primeng/api';
import {ClientErrorHandlerService} from "./utils/client-error-handler.service";
import {RoutingStateService} from "./url/routing-state.service";
import {ChangeDetectorRef} from '@angular/core'
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    options = {};
    routerLoading: boolean = false;
    httpLoading: boolean = false;
    showError=false;

    darkTheme = false;
    event:any;


    msgs: Message[] = [];
    error:any;

  //menuMode = 'static';
    menuMode = 'horizontal';

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    layoutMenuScroller: HTMLDivElement;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    resetMenu: boolean;

    menuHoverActive: boolean;


    @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ScrollPanel;

    ngAfterViewInit() {

      console.log("Show Error");

          setTimeout(() => {this.layoutMenuScrollerViewChild.moveBar(); }, 0);

    }

    show(){
      console.log("called");
      this.showError=this.showError||true;
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.resetMenu = true;
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.topbarMenuActive = false;

        if (this.isOverlay()) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }
        if (this.isDesktop()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        } else {
            this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }

        //event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;

        if (!this.isHorizontal()) {
            setTimeout(() => {this.layoutMenuScrollerViewChild.moveBar(); }, 500);
        }
    }


    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }
        event.preventDefault();
    }

    isHorizontal() {
        return this.menuMode === 'horizontal';
    }

    isSlim() {
        return this.menuMode === 'slim';
    }

    isOverlay() {
        return this.menuMode === 'overlay';
    }

    isStatic() {
        return this.menuMode === 'static';
    }

    isMobile() {
        return window.innerWidth < 1025;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isTablet() {
      const width = window.innerWidth;
      return width <= 1024 && width > 640;
    }

    hideOverlayMenu() {
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }


    changeTheme(theme) {
        const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
        themeLink.href = 'assets/theme/theme-' + theme + '.css';
        const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');
        layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';

        if (theme.indexOf('dark') !== -1) {
          this.darkTheme = true;
        } else {
          this.darkTheme = false;
        }
    }


    constructor(private http : HttpClient, private ws :  WorkspaceService,private router: Router , private progress:ProgressHandlerService, private clientErrorHandlerService: ClientErrorHandlerService, private routingStateService:RoutingStateService,private ref: ChangeDetectorRef ){
      //



      http.get("api/config").subscribe(data=>{


        this.ws.setAppConstant(data);
      });


      router.events.subscribe(event => {
        this.checkRouterEvent(event);

      });





      progress.getHttpStatus().subscribe( x =>{
        console.log("HTTP LOADING");


          this.httpLoading=x;



        //


      });


    }

    ngOnInit(){

     }

    checkRouterEvent(event): void {
      console.log(event);
     if (event instanceof NavigationStart) {
        console.log("Navigation Start");
        this.routerLoading = true;

    }
    if (event instanceof NavigationEnd ||
      event instanceof NavigationCancel ) {
      this.routerLoading = false;
      this.progress.clear();
    }
    else if(event instanceof NavigationError){
      this.routerLoading = false;
    }else{
      console.log(event);
    }
  }

  print(obj){
    console.log(obj);
  }
  }
