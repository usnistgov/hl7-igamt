webpackJsonp(["main"],{

/***/ "../../../../../src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./configuration/configuration.module": [
		"../../../../../src/app/configuration/configuration.module.ts",
		"configuration.module"
	],
	"./conformanceprofile-edit/conformanceprofile-edit.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-edit.module.ts",
		"common",
		"conformanceprofile-edit.module"
	],
	"./datatype-edit/datatype-edit.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-edit.module.ts",
		"common"
	],
	"./datatype-library/datatype-library.module": [
		"../../../../../src/app/datatype-library/datatype-library.module.ts",
		"datatype-library.module"
	],
	"./delta/delta.module": [
		"../../../../../src/app/delta/delta.module.ts",
		"delta.module"
	],
	"./igdocument-create/igdocument-create.module": [
		"../../../../../src/app/igdocuments/igdocument-create/igdocument-create.module.ts",
		"common",
		"igdocument-create.module"
	],
	"./igdocument-list/igdocument-list.module": [
		"../../../../../src/app/igdocuments/igdocument-list/igdocument-list.module.ts",
		"common",
		"igdocument-list.module"
	],
	"./igdocuments/igdocument-edit/igdocument-edit.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.module.ts",
		"igdocument-edit.module",
		"common"
	],
	"./igdocuments/igdocument.module": [
		"../../../../../src/app/igdocuments/igdocument.module.ts",
		"igdocument.module"
	],
	"./search/search.module": [
		"../../../../../src/app/search/search.module.ts",
		"search.module"
	],
	"./segment-edit/segment-edit.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.module.ts",
		"common"
	],
	"./shared-elements/shared-elements.module": [
		"../../../../../src/app/shared-elements/shared-elements.module.ts",
		"shared-elements.module"
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "../../../../../src/$$_lazy_route_resource lazy recursive";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "../../../../../src/app/about/about.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"layout-content-full\">\n  <div>\n This is ABOUT page\n  </div>\n</div>"

/***/ }),

/***/ "../../../../../src/app/about/about.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AboutComponent = (function () {
    function AboutComponent() {
    }
    AboutComponent.prototype.ngOnInit = function () {
    };
    AboutComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/about/about.component.html")
        }),
        __metadata("design:paramtypes", [])
    ], AboutComponent);
    return AboutComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.breadcrumb.component.html":
/***/ (function(module, exports) {

module.exports = "<!--<div class=\"layout-breadcrumb\">-->\n    <!--<ul>-->\n        <!--<li>-->\n            <!--<a routerLink=\"\">-->\n                <!--<i class=\"fa fa-home\"></i>-->\n            <!--</a>-->\n        <!--</li>-->\n        <!--<li>/</li>-->\n        <!--<ng-template ngFor let-item let-last=\"last\" [ngForOf]=\"items\">-->\n            <!--<li>-->\n                <!--<a [routerLink]=\"item.routerLink\" *ngIf=\"item.routerLink\">{{item.label}}</a>-->\n                <!--<ng-container *ngIf=\"!item.routerLink\">{{item.label}}</ng-container>-->\n            <!--</li>-->\n            <!--<li *ngIf=\"!last\">/</li>-->\n        <!--</ng-template>-->\n    <!--</ul>-->\n\n    <!--<div class=\"layout-breadcrumb-options\">-->\n        <!--<a routerLink=\"/\" title=\"Backup\">-->\n          <!--<i class=\"fa fa-cloud-upload\"></i>-->\n        <!--</a>-->\n        <!--<a routerLink=\"/\" title=\"Bookmark\">-->\n          <!--<i class=\"fa fa-bookmark\"></i>-->\n        <!--</a>-->\n        <!--<a routerLink=\"/\" title=\"Logout\">-->\n          <!--<i class=\"fa fa-sign-out\"></i>-->\n        <!--</a>-->\n    <!--</div>-->\n<!--</div>-->\n\n<p-breadcrumb [model]=\"items\"  [home]=\"{icon: 'fa fa-home'}\"></p-breadcrumb>\n"

/***/ }),

/***/ "../../../../../src/app/app.breadcrumb.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppBreadcrumbComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__breadcrumb_service__ = __webpack_require__("../../../../../src/app/breadcrumb.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppBreadcrumbComponent = (function () {
    function AppBreadcrumbComponent(breadcrumbService) {
        var _this = this;
        this.breadcrumbService = breadcrumbService;
        this.subscription = breadcrumbService.itemsHandler.subscribe(function (response) {
            _this.items = response;
        });
    }
    AppBreadcrumbComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    AppBreadcrumbComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-breadcrumb',
            template: __webpack_require__("../../../../../src/app/app.breadcrumb.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__breadcrumb_service__["a" /* BreadcrumbService */]])
    ], AppBreadcrumbComponent);
    return AppBreadcrumbComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"layout-wrapper\" (click)=\"onLayoutClick()\"\n     [ngClass]=\"{'layout-horizontal': isHorizontal(),\n                 'layout-overlay': isOverlay(),\n                 'layout-static': isStatic(),\n                 'layout-slim':isSlim(),\n                 'layout-static-inactive': staticMenuDesktopInactive,\n                 'layout-mobile-active': staticMenuMobileActive,\n                 'layout-overlay-active':overlayMenuActive}\">\n\n    <app-topbar></app-topbar>\n    <div class=\"layout-menu-container\" (click)=\"onMenuClick($event)\">\n        <p-scrollPanel #layoutMenuScroller [style]=\"{height: '100%'}\">\n            <div class=\"layout-menu-content\">\n                <div class=\"layout-menu-title\">MENU</div>\n                <app-menu [reset]=\"resetMenu\"></app-menu>\n                <div class=\"layout-menu-footer\">\n                    <div class=\"layout-menu-footer-title\">TASKS</div>\n\n                    <div class=\"layout-menu-footer-content\">\n                        <p-progressBar [value]=\"50\" [showValue]=\"false\"></p-progressBar>\n                        Today\n\n                        <p-progressBar [value]=\"80\" [showValue]=\"false\"></p-progressBar>\n                        Overall\n                    </div>\n                </div>\n            </div>\n        </p-scrollPanel>\n    </div>\n\n    <div class=\"layout-content\">\n      <!--<tree-root [nodes]=\"nodes\" [options]=\"options\"></tree-root>-->\n\n        <div class=\"layout-content-container\">\n          <!--<div class=\"loader\" *ngIf=\"loading\">-->\n          <!--<div>-->\n          <!--<span></span>-->\n          <!--<span></span>-->\n          <!--<span></span>-->\n          <!--</div>-->\n          <!--</div>-->\n         <!--<div *ngIf=\"!loading\">-->\n            <router-outlet></router-outlet>\n          </div>\n        <!--</div>-->\n\n        <app-footer></app-footer>\n        <div class=\"layout-mask\" *ngIf=\"staticMenuMobileActive\"></div>\n    </div>\n</div>\n\n"

/***/ }),

/***/ "../../../../../src/app/app.component.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AppComponent = (function () {
    function AppComponent(http, ws, router) {
        var _this = this;
        this.http = http;
        this.ws = ws;
        this.router = router;
        this.options = {};
        this.loading = true;
        this.nodes = [
            {
                id: 1,
                name: 'root1',
                children: [
                    { id: 2, name: 'child1' },
                    { id: 3, name: 'child2' }
                ]
            },
            {
                id: 4,
                name: 'root2',
                children: [
                    { id: 5, name: 'child2.1' },
                    {
                        id: 6,
                        name: 'child2.2',
                        children: [
                            { id: 7, name: 'subsub' }
                        ]
                    }
                ]
            }
        ];
        this.darkTheme = false;
        //menuMode = 'static';
        this.menuMode = 'horizontal';
        http.get("api/config").subscribe(function (data) {
            _this.ws.setAppConstant(data);
        });
        router.events.subscribe(function (event) {
            _this.checkRouterEvent(event);
        });
    }
    AppComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () { _this.layoutMenuScrollerViewChild.moveBar(); }, 100);
    };
    AppComponent.prototype.onLayoutClick = function () {
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
    };
    AppComponent.prototype.onMenuButtonClick = function (event) {
        this.menuClick = true;
        this.topbarMenuActive = false;
        if (this.isOverlay()) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }
        if (this.isDesktop()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        }
        else {
            this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }
        event.preventDefault();
    };
    AppComponent.prototype.onMenuClick = function ($event) {
        var _this = this;
        this.menuClick = true;
        this.resetMenu = false;
        if (!this.isHorizontal()) {
            setTimeout(function () { _this.layoutMenuScrollerViewChild.moveBar(); }, 500);
        }
    };
    AppComponent.prototype.onTopbarMenuButtonClick = function (event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;
        this.hideOverlayMenu();
        event.preventDefault();
    };
    AppComponent.prototype.onTopbarItemClick = function (event, item) {
        this.topbarItemClick = true;
        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        }
        else {
            this.activeTopbarItem = item;
        }
        event.preventDefault();
    };
    AppComponent.prototype.isHorizontal = function () {
        return this.menuMode === 'horizontal';
    };
    AppComponent.prototype.isSlim = function () {
        return this.menuMode === 'slim';
    };
    AppComponent.prototype.isOverlay = function () {
        return this.menuMode === 'overlay';
    };
    AppComponent.prototype.isStatic = function () {
        return this.menuMode === 'static';
    };
    AppComponent.prototype.isMobile = function () {
        return window.innerWidth < 1025;
    };
    AppComponent.prototype.isDesktop = function () {
        return window.innerWidth > 1024;
    };
    AppComponent.prototype.isTablet = function () {
        var width = window.innerWidth;
        return width <= 1024 && width > 640;
    };
    AppComponent.prototype.hideOverlayMenu = function () {
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    };
    AppComponent.prototype.changeTheme = function (theme) {
        var themeLink = document.getElementById('theme-css');
        themeLink.href = 'assets/theme/theme-' + theme + '.css';
        var layoutLink = document.getElementById('layout-css');
        layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
        if (theme.indexOf('dark') !== -1) {
            this.darkTheme = true;
        }
        else {
            this.darkTheme = false;
        }
    };
    AppComponent.prototype.checkRouterEvent = function (event) {
        if (event instanceof __WEBPACK_IMPORTED_MODULE_4__angular_router__["NavigationStart"]) {
            console.log("Navigation Start");
            console.log(event);
            this.loading = true;
        }
        if (event instanceof __WEBPACK_IMPORTED_MODULE_4__angular_router__["NavigationEnd"] ||
            event instanceof __WEBPACK_IMPORTED_MODULE_4__angular_router__["NavigationCancel"] ||
            event instanceof __WEBPACK_IMPORTED_MODULE_4__angular_router__["NavigationError"]) {
            this.loading = false;
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('layoutMenuScroller'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_primeng_primeng__["ScrollPanel"])
    ], AppComponent.prototype, "layoutMenuScrollerViewChild", void 0);
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__("../../../../../src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../src/app/app.component.scss")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__service_workspace_workspace_service__["a" /* WorkspaceService */], __WEBPACK_IMPORTED_MODULE_4__angular_router__["Router"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.footer.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppFooterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppFooterComponent = (function () {
    function AppFooterComponent() {
    }
    AppFooterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-footer',
            template: ""
        })
    ], AppFooterComponent);
    return AppFooterComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.menu.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppMenuComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return AppSubMenuComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__("../../../animations/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppMenuComponent = (function () {
    function AppMenuComponent(app) {
        this.app = app;
    }
    AppMenuComponent.prototype.ngOnInit = function () {
        this.model = [
            { label: 'Home', icon: 'dashboard', routerLink: ['/'] },
            {
                label: 'IG Documents', icon: 'palette', badge: '6',
                items: [
                    {
                        label: 'Create New Document', icon: 'plus', routerLink: ['/ig-documents/create'], command: function (event) {
                        }
                    },
                    {
                        label: 'My Documents', icon: 'brush', routerLink: ['/ig-documents/my-igs'], command: function (event) {
                        }
                    },
                    {
                        label: 'Shared With Me', icon: 'brush', routerLink: ['/ig-documents/shared-igs'], command: function (event) {
                        }
                    },
                    {
                        label: 'Pre-loaded Documents', icon: 'brush', routerLink: ['/ig-documents/preloaded-igs'], command: function (event) {
                        }
                    },
                    {
                        label: 'All IG Documents', icon: 'brush', routerLink: ['/ig-documents/all'], command: function (event) {
                        }
                    }
                ]
            },
            { label: 'Data type Libraries', icon: 'list', routerLink: ['/datatype-libraries'] },
            { label: 'Comparator', icon: 'dashboard', routerLink: ['/comparator'] },
            { label: 'Documentation', icon: 'dashboard', routerLink: ['/documentation'] },
            { label: 'Configuration', icon: 'dashboard', routerLink: ['/configuration'] },
            { label: 'Search', icon: 'search', routerLink: ['/search'] },
            { label: 'About', icon: 'info', routerLink: ['/about'] }
        ];
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], AppMenuComponent.prototype, "reset", void 0);
    AppMenuComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-menu',
            template: "\n        <ul app-submenu [item]=\"model\" root=\"true\" class=\"layout-menu\" [reset]=\"reset\" visible=\"true\"></ul> \n    "
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]])
    ], AppMenuComponent);
    return AppMenuComponent;
}());

var AppSubMenuComponent = (function () {
    function AppSubMenuComponent(app) {
        this.app = app;
    }
    AppSubMenuComponent.prototype.itemClick = function (event, item, index) {
        var _this = this;
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
            setTimeout(function () {
                _this.app.layoutMenuScrollerViewChild.moveBar();
            }, 450);
            event.preventDefault();
        }
        // hide menu
        if (!item.items) {
            if (this.app.isHorizontal() || this.app.isSlim()) {
                this.app.resetMenu = true;
            }
            else {
                this.app.resetMenu = false;
            }
            this.app.overlayMenuActive = false;
            this.app.staticMenuMobileActive = false;
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
    };
    AppSubMenuComponent.prototype.onMouseEnter = function (index) {
        if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())
            && !this.app.isMobile() && !this.app.isTablet()) {
            this.activeIndex = index;
        }
    };
    AppSubMenuComponent.prototype.isActive = function (index) {
        return this.activeIndex === index;
    };
    Object.defineProperty(AppSubMenuComponent.prototype, "reset", {
        get: function () {
            return this._reset;
        },
        set: function (val) {
            this._reset = val;
            if (this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
                this.activeIndex = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], AppSubMenuComponent.prototype, "item", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], AppSubMenuComponent.prototype, "root", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], AppSubMenuComponent.prototype, "visible", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], AppSubMenuComponent.prototype, "reset", null);
    AppSubMenuComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            /* tslint:disable:component-selector */
            selector: '[app-submenu]',
            /* tslint:enable:component-selector */
            template: "\n        <ng-template ngFor let-child let-i=\"index\" [ngForOf]=\"(root ? item : item.items)\">\n            <li [ngClass]=\"{'active-menuitem': isActive(i)}\" [class]=\"child.badgeStyleClass\" *ngIf=\"child.visible === false ? false : true\">\n                <a [href]=\"child.url||'#'\" (click)=\"itemClick($event,child,i)\" (mouseenter)=\"onMouseEnter(i)\"\n                   *ngIf=\"!child.routerLink\" [ngClass]=\"child.styleClass\"\n                   [attr.tabindex]=\"!visible ? '-1' : null\" [attr.target]=\"child.target\">\n                    <i [ngClass]=\"child.icon\"></i>\n                    <span>{{child.label}}</span>\n                    <i class=\"fa fa-fw fa-angle-down layout-menuitem-toggler\" *ngIf=\"child.items\"></i>\n                    <span class=\"menuitem-badge\" *ngIf=\"child.badge\">{{child.badge}}</span>\n                </a>\n\n                <a (click)=\"itemClick($event,child,i)\" (mouseenter)=\"onMouseEnter(i)\" *ngIf=\"child.routerLink\"\n                    [routerLink]=\"child.routerLink\" routerLinkActive=\"active-menuitem-routerlink\"\n                    [routerLinkActiveOptions]=\"{exact: true}\" [attr.tabindex]=\"!visible ? '-1' : null\" [attr.target]=\"child.target\">\n                    <i [ngClass]=\"child.icon\"></i>\n                    <span>{{child.label}}</span>\n                    <i class=\"fa fa-fw fa-angle-down\" *ngIf=\"child.items\"></i>\n                    <span class=\"menuitem-badge\" *ngIf=\"child.badge\">{{child.badge}}</span>\n                </a>\n                <div class=\"layout-menu-tooltip\">\n                  <div class=\"layout-menu-tooltip-arrow\"></div>\n                  <div class=\"layout-menu-tooltip-text\">{{child.label}}</div>\n                </div>\n                <ul app-submenu [item]=\"child\" *ngIf=\"child.items\" [visible]=\"isActive(i)\" [reset]=\"reset\"\n                    [@children]=\"(app.isSlim()||app.isHorizontal())&&root ? isActive(i) ?\n                    'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'\"></ul>\n            </li>\n        </ng-template>\n    ",
            animations: [
                Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["trigger"])('children', [
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])('hiddenAnimated', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                        height: '0px'
                    })),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])('visibleAnimated', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                        height: '*'
                    })),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])('visible', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                        height: '*',
                        'z-index': 100
                    })),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["state"])('hidden', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["style"])({
                        height: '0px',
                        'z-index': '*'
                    })),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])('visibleAnimated => hiddenAnimated', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["transition"])('hiddenAnimated => visibleAnimated', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["animate"])('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
                ])
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]])
    ], AppSubMenuComponent);
    return AppSubMenuComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_toPromise__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ngx_bootstrap__ = __webpack_require__("../../../../ngx-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_scrollpanel__ = __webpack_require__("../../../../primeng/scrollpanel.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_scrollpanel___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_primeng_scrollpanel__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_primeng_table__ = __webpack_require__("../../../../primeng/table.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_primeng_table___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_primeng_table__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_keyfilter__ = __webpack_require__("../../../../primeng/keyfilter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_keyfilter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_primeng_keyfilter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_message__ = __webpack_require__("../../../../primeng/message.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_message___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_primeng_message__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__app_menu_component__ = __webpack_require__("../../../../../src/app/app.menu.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__angular_platform_browser_animations__ = __webpack_require__("../../../platform-browser/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__documentation_documentation_component__ = __webpack_require__("../../../../../src/app/documentation/documentation.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__service_ig_document_ig_document_service__ = __webpack_require__("../../../../../src/app/service/ig-document/ig-document.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__service_indexed_db_conformance_profiles_conformance_profiles_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/conformance-profiles/conformance-profiles-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__service_indexed_db_segments_segments_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/segments/segments-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__service_indexed_db_datatypes_datatypes_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/datatypes/datatypes-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__service_indexed_db_valuesets_valuesets_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/valuesets/valuesets-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__app_routes__ = __webpack_require__("../../../../../src/app/app.routes.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__app_topbar_component__ = __webpack_require__("../../../../../src/app/app.topbar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__app_footer_component__ = __webpack_require__("../../../../../src/app/app.footer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__service_datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__service_conformance_profiles_conformance_profiles_service__ = __webpack_require__("../../../../../src/app/service/conformance-profiles/conformance-profiles.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__login_auth_service__ = __webpack_require__("../../../../../src/app/login/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__login_auth_guard_service__ = __webpack_require__("../../../../../src/app/login/auth-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__requestInterceptor__ = __webpack_require__("../../../../../src/app/requestInterceptor.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__service_userService_user_service__ = __webpack_require__("../../../../../src/app/service/userService/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__home_home_component__ = __webpack_require__("../../../../../src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__about_about_component__ = __webpack_require__("../../../../../src/app/about/about.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__common_404_404_component__ = __webpack_require__("../../../../../src/app/common/404/404.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__login_login_component__ = __webpack_require__("../../../../../src/app/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__register_register_component__ = __webpack_require__("../../../../../src/app/register/register.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39_angular_tree_component__ = __webpack_require__("../../../../angular-tree-component/dist/angular-tree-component.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__app_breadcrumb_component__ = __webpack_require__("../../../../../src/app/app.breadcrumb.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__breadcrumb_service__ = __webpack_require__("../../../../../src/app/breadcrumb.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__service_indexed_db_conformance_profiles_conformance_profiles_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/conformance-profiles/conformance-profiles-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__service_indexed_db_toc_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/toc-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__service_indexed_db_composite_profiles_composite_profiles_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/composite-profiles/composite-profiles-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__service_indexed_db_datatypes_datatypes_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/datatypes/datatypes-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__service_indexed_db_segments_segments_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/segments/segments-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__service_indexed_db_valuesets_valuesets_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/valuesets/valuesets-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__service_indexed_db_profile_components_profile_components_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/profile-components/profile-components-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__service_constraints_constraints_service__ = __webpack_require__("../../../../../src/app/service/constraints/constraints.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__service_sections_sections_service__ = __webpack_require__("../../../../../src/app/service/sections/sections.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__service_indexed_db_sections_sections_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/sections/sections-indexed-db.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






































































// import { TreeModule } from 'primeng/primeng';






















// import {ProfileComponentsService} from "./service/profilecomponents/profilecomponents.service";
























var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_10__angular_platform_browser__["BrowserModule"],
                __WEBPACK_IMPORTED_MODULE_39_angular_tree_component__["c" /* TreeModule */],
                __WEBPACK_IMPORTED_MODULE_11__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_22__app_routes__["a" /* AppRoutes */],
                __WEBPACK_IMPORTED_MODULE_31__angular_common_http__["c" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_12__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["AccordionModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["AutoCompleteModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["BreadcrumbModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["CalendarModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["CarouselModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["ChartModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["CheckboxModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["ChipsModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["CodeHighlighterModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["ConfirmDialogModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["ColorPickerModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["SharedModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["ContextMenuModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["DataGridModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["DataListModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["DataScrollerModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["DataTableModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["DialogModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["DragDropModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["DropdownModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["EditorModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["FieldsetModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["FileUploadModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["GalleriaModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_keyfilter__["KeyFilterModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["GMapModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["GrowlModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["InputMaskModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["InputSwitchModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["InputTextModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["InputTextareaModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["LightboxModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["ListboxModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["MegaMenuModule"],
                __WEBPACK_IMPORTED_MODULE_7_primeng_message__["MessageModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["MenuModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["MenubarModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["MessagesModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["MultiSelectModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["OrderListModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["OrganizationChartModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["OverlayPanelModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["PaginatorModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["PanelModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["PanelMenuModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["PasswordModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["PickListModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["ProgressBarModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["RadioButtonModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["RatingModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["ScheduleModule"],
                __WEBPACK_IMPORTED_MODULE_4_primeng_scrollpanel__["ScrollPanelModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["SelectButtonModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["SlideMenuModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["SliderModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["SpinnerModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["SplitButtonModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["StepsModule"],
                __WEBPACK_IMPORTED_MODULE_5_primeng_table__["TableModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["TabMenuModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["TabViewModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["TerminalModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["TieredMenuModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["ToggleButtonModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["ToolbarModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["TooltipModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["TreeTableModule"],
                __WEBPACK_IMPORTED_MODULE_13__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_11__angular_forms__["ReactiveFormsModule"],
                __WEBPACK_IMPORTED_MODULE_2_ngx_bootstrap__["a" /* AlertModule */].forRoot()
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_9__app_menu_component__["a" /* AppMenuComponent */],
                __WEBPACK_IMPORTED_MODULE_9__app_menu_component__["b" /* AppSubMenuComponent */],
                __WEBPACK_IMPORTED_MODULE_23__app_topbar_component__["a" /* AppTopBarComponent */],
                __WEBPACK_IMPORTED_MODULE_24__app_footer_component__["a" /* AppFooterComponent */],
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_34__home_home_component__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_35__about_about_component__["a" /* AboutComponent */],
                __WEBPACK_IMPORTED_MODULE_14__documentation_documentation_component__["a" /* DocumentationComponent */],
                __WEBPACK_IMPORTED_MODULE_9__app_menu_component__["a" /* AppMenuComponent */],
                __WEBPACK_IMPORTED_MODULE_23__app_topbar_component__["a" /* AppTopBarComponent */],
                __WEBPACK_IMPORTED_MODULE_24__app_footer_component__["a" /* AppFooterComponent */],
                __WEBPACK_IMPORTED_MODULE_36__common_404_404_component__["a" /* NotFoundComponent */],
                __WEBPACK_IMPORTED_MODULE_37__login_login_component__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_38__register_register_component__["a" /* RegisterComponent */],
                __WEBPACK_IMPORTED_MODULE_14__documentation_documentation_component__["a" /* DocumentationComponent */],
                __WEBPACK_IMPORTED_MODULE_40__app_breadcrumb_component__["a" /* AppBreadcrumbComponent */]
            ], providers: [
                { provide: __WEBPACK_IMPORTED_MODULE_13__angular_common__["LocationStrategy"], useClass: __WEBPACK_IMPORTED_MODULE_13__angular_common__["HashLocationStrategy"] },
                // { provide: APP_BASE_HREF, useValue: window['_app_base'] || '/' },
                // {
                //   provide: APP_BASE_HREF,
                //   useValue: '<%= APP_BASE %>'
                // },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_31__angular_common_http__["a" /* HTTP_INTERCEPTORS */],
                    useClass: __WEBPACK_IMPORTED_MODULE_32__requestInterceptor__["a" /* TokenInterceptor */],
                    multi: true
                },
                __WEBPACK_IMPORTED_MODULE_15__service_workspace_workspace_service__["a" /* WorkspaceService */],
                __WEBPACK_IMPORTED_MODULE_25__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */],
                __WEBPACK_IMPORTED_MODULE_16__service_ig_document_ig_document_service__["a" /* IgDocumentService */],
                __WEBPACK_IMPORTED_MODULE_17__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */],
                __WEBPACK_IMPORTED_MODULE_18__service_indexed_db_conformance_profiles_conformance_profiles_indexed_db_service__["a" /* ConformanceProfilesIndexedDbService */],
                __WEBPACK_IMPORTED_MODULE_19__service_indexed_db_segments_segments_indexed_db_service__["a" /* SegmentsIndexedDbService */],
                __WEBPACK_IMPORTED_MODULE_20__service_indexed_db_datatypes_datatypes_indexed_db_service__["a" /* DatatypesIndexedDbService */],
                __WEBPACK_IMPORTED_MODULE_21__service_indexed_db_valuesets_valuesets_indexed_db_service__["a" /* ValuesetsIndexedDbService */],
                __WEBPACK_IMPORTED_MODULE_51__service_indexed_db_sections_sections_indexed_db_service__["a" /* SectionsIndexedDbService */],
                __WEBPACK_IMPORTED_MODULE_48__service_indexed_db_profile_components_profile_components_toc_service__["a" /* ProfileComponentsTocService */],
                __WEBPACK_IMPORTED_MODULE_43__service_indexed_db_toc_db_service__["a" /* TocDbService */],
                __WEBPACK_IMPORTED_MODULE_45__service_indexed_db_datatypes_datatypes_toc_service__["a" /* DatatypesTocService */],
                __WEBPACK_IMPORTED_MODULE_46__service_indexed_db_segments_segments_toc_service__["a" /* SegmentsTocService */],
                __WEBPACK_IMPORTED_MODULE_47__service_indexed_db_valuesets_valuesets_toc_service__["a" /* ValuesetsTocService */],
                __WEBPACK_IMPORTED_MODULE_27__service_datatypes_datatypes_service__["a" /* DatatypesService */],
                __WEBPACK_IMPORTED_MODULE_28__service_conformance_profiles_conformance_profiles_service__["a" /* ConformanceProfilesService */],
                __WEBPACK_IMPORTED_MODULE_42__service_indexed_db_conformance_profiles_conformance_profiles_toc_service__["a" /* ConformanceProfilesTocService */],
                __WEBPACK_IMPORTED_MODULE_44__service_indexed_db_composite_profiles_composite_profiles_toc_service__["a" /* CompositeProfilesTocService */],
                __WEBPACK_IMPORTED_MODULE_26__service_segments_segments_service__["a" /* SegmentsService */],
                __WEBPACK_IMPORTED_MODULE_50__service_sections_sections_service__["a" /* SectionsService */],
                __WEBPACK_IMPORTED_MODULE_29__login_auth_service__["a" /* AuthService */],
                __WEBPACK_IMPORTED_MODULE_30__login_auth_guard_service__["a" /* AuthGuard */],
                __WEBPACK_IMPORTED_MODULE_33__service_userService_user_service__["a" /* UserService */],
                __WEBPACK_IMPORTED_MODULE_41__breadcrumb_service__["a" /* BreadcrumbService */],
                __WEBPACK_IMPORTED_MODULE_49__service_constraints_constraints_service__["a" /* ConstraintsService */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "../../../../../src/app/app.routes.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export routes */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutes; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_home_component__ = __webpack_require__("../../../../../src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__about_about_component__ = __webpack_require__("../../../../../src/app/about/about.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__documentation_documentation_component__ = __webpack_require__("../../../../../src/app/documentation/documentation.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_404_404_component__ = __webpack_require__("../../../../../src/app/common/404/404.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login_component__ = __webpack_require__("../../../../../src/app/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__register_register_component__ = __webpack_require__("../../../../../src/app/register/register.component.ts");







var routes = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_1__home_home_component__["a" /* HomeComponent */] },
    { path: 'ig-documents', loadChildren: './igdocuments/igdocument.module#IgDocumentModule' },
    { path: 'ig', loadChildren: './igdocuments/igdocument-edit/igdocument-edit.module#IgDocumentEditModule' },
    { path: 'datatype-libraries', loadChildren: './datatype-library/datatype-library.module#DatatypeLibraryModule' },
    { path: 'shared-data', loadChildren: './shared-elements/shared-elements.module#SharedElementsModule' },
    { path: 'comparator', loadChildren: './delta/delta.module#DeltaModule' },
    { path: 'configuration', loadChildren: './configuration/configuration.module#ConfigurationModule' },
    { path: 'search', loadChildren: './search/search.module#SearchModule' },
    { path: 'about', component: __WEBPACK_IMPORTED_MODULE_2__about_about_component__["a" /* AboutComponent */] },
    { path: 'documentation', component: __WEBPACK_IMPORTED_MODULE_3__documentation_documentation_component__["a" /* DocumentationComponent */] },
    { path: '', component: __WEBPACK_IMPORTED_MODULE_3__documentation_documentation_component__["a" /* DocumentationComponent */] },
    { path: 'login', component: __WEBPACK_IMPORTED_MODULE_5__login_login_component__["a" /* LoginComponent */] },
    { path: 'register', component: __WEBPACK_IMPORTED_MODULE_6__register_register_component__["a" /* RegisterComponent */] },
    { path: '**', component: __WEBPACK_IMPORTED_MODULE_4__common_404_404_component__["a" /* NotFoundComponent */] }
];
var AppRoutes = __WEBPACK_IMPORTED_MODULE_0__angular_router__["RouterModule"].forRoot(routes);


/***/ }),

/***/ "../../../../../src/app/app.topbar.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"topbar clearfix\">\n\n    <!--<img class=\"logo\" alt=\"apollo-layout\" src=\"assets/layout/images/apollo_logo.png\" />-->\n  <span style=\"color:#F3C60D; font-size: 24px; font-weight: 900\">IGAMT </span>\n\n\n    <a id=\"menu-button\" href=\"#\" (click)=\"app.onMenuButtonClick($event)\">\n        <i class=\"fa fa-align-left\"></i>\n    </a>\n\n    <a href=\"#\" class=\"profile\" (click)=\"app.onTopbarMenuButtonClick($event)\">\n        <span class=\"username\">{{getUsername()}} </span>\n        <img src=\"assets/layout/images/avatar/avatar1.png\" alt=\"apollo-layout\" />\n        <i class=\"fa fa-angle-down\"></i>\n    </a>\n\n    <!--<span class=\"topbar-search\">-->\n        <!--<input type=\"text\" pInputText placeholder=\"Search\"/>-->\n        <!--<span class=\"fa fa-search\"></span>-->\n    <!--</span>-->\n\n    <!--<span class=\"topbar-themeswitcher\">-->\n        <!--<p-inputSwitch [(ngModel)]=\"app.darkTheme\" (onChange)=\"themeChange($event)\"></p-inputSwitch>-->\n    <!--</span>-->\n\n    <ul class=\"topbar-menu fadeInDown\" [ngClass]=\"{'topbar-menu-visible': app.topbarMenuActive}\">\n        <li #profile [ngClass]=\"{'menuitem-active':app.activeTopbarItem === profile}\" (click)=\"app.onTopbarItemClick($event, profile)\">\n            <a href=\"#\">\n                <i class=\"topbar-icon fa fa-fw fa-user\"></i>\n                <span class=\"topbar-item-name\">Profile</span>\n            </a>\n            <ul>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                        <i class=\"fa fa-fw fa-user\"></i>\n                        <span>Profile</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                        <i class=\"fa fa-fw fa-user-secret\"></i>\n                        <span>Privacy</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                        <i class=\"fa fa-fw fa-cog\"></i>\n                        <span>Settings</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-sign-out\"></i>\n                      <span>Logout</span>\n                    </a>\n                </li>\n            </ul>\n        </li>\n        <li #settings [ngClass]=\"{'menuitem-active':app.activeTopbarItem === settings}\" (click)=\"app.onTopbarItemClick($event, settings)\">\n            <a href=\"#\">\n                <i class=\"topbar-icon fa fa-fw fa-cog\"></i>\n                <span class=\"topbar-item-name\">Settings</span>\n            </a>\n            <ul>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-paint-brush\"></i>\n                      <span>Change Theme</span>\n                      <span class=\"topbar-badge\">1</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-star-o\"></i>\n                      <span>Favorites</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                        <i class=\"fa fa-fw fa-lock\"></i>\n                        <span>Lock Screen</span>\n                        <span class=\"topbar-badge\">3</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-picture-o\"></i>\n                      <span>Wallpaper</span>\n                    </a>\n                </li>\n          </ul>\n        </li>\n        <li #messages [ngClass]=\"{'menuitem-active':app.activeTopbarItem === messages}\" (click)=\"app.onTopbarItemClick($event, messages)\">\n            <a href=\"#\">\n                <i class=\"topbar-icon fa fa-fw fa-envelope-o\"></i>\n                <span class=\"topbar-item-name\">Messages</span>\n                <span class=\"topbar-badge\">5</span>\n            </a>\n            <ul>\n                <li role=\"menuitem\">\n                  <a href=\"#\" class=\"topbar-message\">\n                    <img src=\"assets/layout/images/avatar/avatar1.png\" alt=\"avatar1\" style=\"width: 35px;\"/>\n                    <span>Give me a call</span>\n                  </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\" class=\"topbar-message\">\n                      <img src=\"assets/layout/images/avatar/avatar2.png\" alt=\"avatar2\" style=\"width: 35px;\"/>\n                      <span>Reports attached</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\" class=\"topbar-message\">\n                      <img src=\"assets/layout/images/avatar/avatar3.png\" alt=\"avatar3\" style=\"width: 35px;\"/>\n                      <span>About your invoice</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\" class=\"topbar-message\">\n                      <img src=\"assets/layout/images/avatar/avatar2.png\" alt=\"avatar2\" style=\"width: 35px;\"/>\n                      <span>Meeting today</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\" class=\"topbar-message\">\n                      <img src=\"assets/layout/images/avatar/avatar4.png\" alt=\"avatar4\" style=\"width: 35px;\"/>\n                      <span>Out of office</span>\n                    </a>\n                </li>\n            </ul>\n        </li>\n        <li #notifications [ngClass]=\"{'menuitem-active':app.activeTopbarItem === notifications}\" (click)=\"app.onTopbarItemClick($event, notifications)\">\n            <a href=\"#\">\n                <i class=\"topbar-icon fa fa-fw fa-bell-o\"></i>\n                <span class=\"topbar-item-name\">Notifications</span>\n                <span class=\"topbar-badge\">2</span>\n            </a>\n            <ul>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-tasks\"></i>\n                      <span>Pending tasks</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-calendar-check-o\"></i>\n                      <span>Meeting today</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-download\"></i>\n                      <span>Download</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-plane\"></i>\n                      <span>Book flight</span>\n                    </a>\n                </li>\n            </ul>\n        </li>\n    </ul>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/app.topbar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppTopBarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_auth_service__ = __webpack_require__("../../../../../src/app/login/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppTopBarComponent = (function () {
    function AppTopBarComponent(app, auth) {
        this.app = app;
        this.auth = auth;
        this.username = "Guest";
        this.username = this.auth.getcurrentUser();
    }
    AppTopBarComponent.prototype.themeChange = function (e) {
        var themeLink = document.getElementById('theme-css');
        var href = themeLink.href;
        var themeFile = href.substring(href.lastIndexOf('/') + 1, href.lastIndexOf('.'));
        var themeTokens = themeFile.split('-');
        var themeName = themeTokens[1];
        var themeMode = themeTokens[2];
        var newThemeMode = (themeMode === 'dark') ? 'light' : 'dark';
        this.app.changeTheme(themeName + '-' + newThemeMode);
    };
    AppTopBarComponent.prototype.getUsername = function () {
        return this.username;
    };
    AppTopBarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-topbar',
            template: __webpack_require__("../../../../../src/app/app.topbar.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__app_component__["a" /* AppComponent */], __WEBPACK_IMPORTED_MODULE_2__login_auth_service__["a" /* AuthService */]])
    ], AppTopBarComponent);
    return AppTopBarComponent;
}());



/***/ }),

/***/ "../../../../../src/app/breadcrumb.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BreadcrumbService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var BreadcrumbService = (function () {
    function BreadcrumbService() {
        this.itemsSource = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this.itemsHandler = this.itemsSource.asObservable();
    }
    BreadcrumbService.prototype.setItems = function (items) {
        this.itemsSource.next(items);
    };
    BreadcrumbService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], BreadcrumbService);
    return BreadcrumbService;
}());



/***/ }),

/***/ "../../../../../src/app/common/404/404.component.html":
/***/ (function(module, exports) {

module.exports = "<strong>404</strong> PAGE NOT FOUND\n"

/***/ }),

/***/ "../../../../../src/app/common/404/404.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotFoundComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * Created by hnt5 on 10/25/17.
 */
var NotFoundComponent = (function () {
    function NotFoundComponent() {
    }
    NotFoundComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/common/404/404.component.html")
        })
    ], NotFoundComponent);
    return NotFoundComponent;
}());



/***/ }),

/***/ "../../../../../src/app/documentation/documentation.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"layout-content-full\">\n  <!--<div>-->\n <!--This is Documentation page-->\n  <!--</div>-->\n  <!--<div>-->\n    <!--<button (click)=\"getDatatype('579654555455fa34e848dcf7')\">Load datatype</button>-->\n    <!--label: <input type=text [value]=\"this.datatype.label\" (input)=\"this.datatype.label = $event.target.value\" (change)=\"saveDatatype(this.datatype)\"/>-->\n    <!--<br/>-->\n    <!--Datatype metadata:-->\n    <!--<pre>-->\n      <!--{{this.datatypeMetadata | json}}-->\n    <!--</pre>-->\n    <!--Full datatype:-->\n    <!--<pre>-->\n      <!--{{this.datatype | json}}-->\n    <!--</pre>-->\n  <!--</div>-->\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/documentation/documentation.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DocumentationComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

//import { IndexedDbService } from '../service/indexed-db/indexed-db.service';
var DocumentationComponent = (function () {
    function DocumentationComponent() {
    }
    // constructor(private indexedDbService: IndexedDbService) {
    // }
    DocumentationComponent.prototype.ngOnInit = function () {
    };
    DocumentationComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/documentation/documentation.component.html")
        })
    ], DocumentationComponent);
    return DocumentationComponent;
}());



/***/ }),

/***/ "../../../../../src/app/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "\n      <h1> Welcome to the Implementation Guide Authoring and\n        Management Tool (IGAMT)</h1>\n\n      <div class=\"ui-g-12\">\n        <div class=\"card\">\n          <h3>\n            Note to Testers\n          </h3>\n          <p style=\"text-align:justify\">IGAMT is a tool used to create HL7 v2.x implementation guides that contain one or more conformance profiles. The tool provides capabilities to create both narrative text (akin to a word processing program) and messaging requirements in a structured environment. IGAMT contains a model of all the message events for every version of the HL7 v2 standard. Users begin by selecting the version of the HL7 v2 standard and the message events they want to include and refine (constrain) in their implementation guide.\n          </p>\n          <p style=\"color:red; font-weight: bold;text-align:justify\">\n            IGAMT is a work-in-progress and is in a constant state of change. Many core features exist and IGAMT has been used to create complete Implementation Guides in pilot projects. However, be aware that new features may not be completely functionality and some existing features will change. Also, we are currently working on integration with the NIST validation tool. If you have issues, please contact us or join the IGAMT Google Group to post questions.\n          </p>\n        </div>\n      </div>\n      <div class=\"ui-g-6\">\n        <div class=\"card\">\n          <h3>\n            Have a Question?\n          </h3>\n          <p style=\"text-align: justify;\">A Google Group <a class=\"point\"\n                                                            ng-href=\"https://groups.google.com/forum/#!forum/nist-igamt\"\n                                                            target=\"_blank\">NIST-IGAMT</a>\n            has been established for discussion/questions about the tool. No\n            membership is required. A Google account is required for posting.\n          </p>\n          <ul>\n            <li>Site: <a class=\"point\" target=\"_blank\"\n                         ng-href=\"https://groups.google.com/forum/#!forum/nist-igamt\">https://groups.google.com/forum/#!forum/nist-igamt</a>\n            </li>\n            <li>Email: nist-igamt@googlegroups.com</li>\n          </ul>\n        </div>\n      </div>\n      <div class=\"ui-g-6\">\n        <div class=\"card\">\n          <h3>\n            Supported Browsers\n          </h3>\n          <p style=\"text-align: justify\">The following browsers are currently supported:</p>\n          <ul>\n            <li>Chrome <span style=\"color:red\">(Recommended)</span></li>\n            <li>Firefox <span style=\"color:red\"></span></li>\n            <li>Safari</li>\n          </ul>\n        </div>\n      </div>\n\n\n\n"

/***/ }),

/***/ "../../../../../src/app/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var HomeComponent = (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    HomeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/home/home.component.html")
        })
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "../../../../../src/app/login/auth-guard.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__("../../../../../src/app/login/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by ena3 on 12/20/17.
 */



var AuthGuard = (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.checkLogin = function (url) {
        if (this.authService.isLoggedIn.getValue()) {
            return true;
        }
        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;
        // Navigate to the login page with extras
        this.router.navigate(['/login']);
        return false;
    };
    AuthGuard = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "../../../../../src/app/login/auth.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jwt_decode__ = __webpack_require__("../../../../jwt-decode/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jwt_decode___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jwt_decode__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__ = __webpack_require__("../../../../rxjs/_esm5/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_do__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/do.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_delay__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/delay.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by ena3 on 12/20/17.
 */







var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        //isLoggedIn = false;
        this.isLoggedIn = new __WEBPACK_IMPORTED_MODULE_6_rxjs__["BehaviorSubject"](false);
    }
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        console.log(username);
        this.http.post('api/login', { username: username, password: password }, { observe: 'response' }).subscribe(function (data) {
            console.log(data);
            var token = data.headers.get('Authorization');
            console.log(token);
            localStorage.setItem('currentUser', token);
            _this.isLoggedIn.next(true);
            console.log(_this.redirectUrl);
        }, function (error) {
            _this.isLoggedIn.next(false);
        });
        return this.isLoggedIn;
    };
    AuthService.prototype.logout = function () {
        localStorage.removeItem('currentUser');
        this.isLoggedIn.next(false);
    };
    AuthService.prototype.getcurrentUser = function () {
        var token = localStorage.getItem('currentUser');
        var tokenInfo = this.getDecodedAccessToken(token);
        if (tokenInfo) {
            return tokenInfo.sub;
        }
        else {
            return "Guest";
        }
    };
    AuthService.prototype.getDecodedAccessToken = function (token) {
        try {
            return __WEBPACK_IMPORTED_MODULE_1_jwt_decode__(token);
        }
        catch (Error) {
            return null;
        }
    };
    AuthService.prototype.isAdmin = function () {
        var token = localStorage.getItem('currentUser');
        var tokenInfo = this.getDecodedAccessToken(token);
    };
    AuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__angular_common_http__["b" /* HttpClient */]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "../../../../../src/app/login/login.component.html":
/***/ (function(module, exports) {

module.exports = "<!--<div fxLayout=\"row\"  fxLayoutAlign=\"center\">-->\n\n<!--<div fxFlex=\"50\" class=\"card container-fluid\" >-->\n  <!--<h4 class=\"card-title\"> Sign in </h4>-->\n      <!--<form name=\"form\" #f=\"ngForm\" novalidate>-->\n        <!--<div class=\"form-group\" [ngClass]=\"{ 'has-error': f.submitted && !username.valid }\">-->\n          <!--<input type=\"text\" class=\"form-control\" name=\"username\" [(ngModel)]=\"username\" required placeholder=\"username\" />-->\n          <!--<div *ngIf=\"f.submitted && !username.valid\" class=\"help-block\">Username is required</div>-->\n        <!--</div>-->\n        <!--<div class=\"form-group\" [ngClass]=\"{ 'has-error': f.submitted && !password.valid }\">-->\n          <!--<input type=\"password\" class=\"form-control\" name=\"password\" [(ngModel)]=\"password\" required placeholder=\"password\" />-->\n          <!--<div *ngIf=\"f.submitted && !password.valid\" class=\"help-block\">Password is required</div>-->\n        <!--</div>-->\n        <!--<div class=\"form-group\">-->\n          <!--<button [disabled]=\"loading\" class=\"btn btn-primary\" (click)=\"login()\">Login</button>-->\n          <!--<a [routerLink]=\"['/register']\" class=\"btn btn-link\">Register</a>-->\n        <!--</div>-->\n      <!--</form>-->\n<!--</div>-->\n<!--</div>-->\n\n<div class=\"body-container\">\n  <div class=\"ui-g\">\n    <div class=\"ui-g-12\">\n      <div class=\"login-wrapper\">\n        <div class=\"card\">\n          <h3 class=\"title\">Sign In</h3>\n          <form name=\"form\" #f=\"ngForm\" novalidate>\n\n          <div class=\"ui-g ui-fluid\">\n            <div class=\"ui-g-12\">\n              <input type=\"text\" autocomplete=\"off\" placeholder=\"Username\" name=\"username\" [(ngModel)]=\"username\" class=\"ui-inputtext ui-widget\" required/>\n            </div>\n            <div class=\"ui-g-12\">\n              <input type=\"password\" autocomplete=\"off\" placeholder=\"Password\"  name=\"password\" class=\"ui-inputtext ui-widget\"  [(ngModel)]=\"password\" required />\n            </div>\n            <div class=\"ui-g-6\">\n              <button type=\"button\" class=\"ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only blue-btn\" (click)=\"login()\" [disabled]=\"!f.valid\">\n                                  <span class=\"ui-button-text ui-c\">\n                                    <img src=\"assets/layout/images/check.svg\" alt=\"login\" style=\"height: 13px;width: 16px;float: left;margin-top: 3px\">\n                                    Login\n                                  </span>\n              </button>\n            </div>\n            <div class=\"ui-g-6 password-container\">\n              <a [routerLink]=\"['/register']\">New User?</a>\n            </div>\n          </div>\n          </form>\n        </div>\n\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/login/login.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__("../../../../../src/app/login/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm5/platform-browser.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LoginComponent = (function () {
    function LoginComponent(authService, router, sanitizer, hostElement) {
        this.authService = authService;
        this.router = router;
        this.sanitizer = sanitizer;
        this.hostElement = hostElement;
    }
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.authService.login(this.username, this.password).subscribe(function (x) {
            if (x == true) {
                console.log("test");
                console.log(_this.authService.redirectUrl);
                var redirect = _this.authService.redirectUrl;
                // Redirect the user
                _this.router.navigate([redirect]);
            }
            else {
                _this.router.navigate(["/"]);
            }
        });
    };
    LoginComponent.prototype.logout = function () {
        this.authService.logout(); //?
    };
    LoginComponent.prototype.register = function () {
        this.router.navigate(["/register"]);
    };
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-login',
            template: __webpack_require__("../../../../../src/app/login/login.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["DomSanitizer"], __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "../../../../../src/app/register/register.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/register/register.component.html":
/***/ (function(module, exports) {

module.exports = "  <div class=\"card\">\n    <h4 class=\"card-title\"> Sign up </h4>\n  <form [formGroup]=\"registrationForm\" novalidate>\n\n\n    <div class=\"ui-g\" style=\"margin-top:30px\">\n\n      <input name=\"fullname\" id=\"fullname\" placeholder=\"Full Name\" formControlName=\"fullname\" [(ngModel)]=\"model.fullname\"  pInputText required class=\"ui-g-9\">\n\n        <p-message severity=\"error\" text=\"Name is required\" *ngIf=\"fullname.invalid && (fullname.dirty || fullname.touched)\"></p-message>\n    </div>\n\n    <div class=\"ui-g\" style=\"margin-top:30px\">\n\n      <input name=\"username\" id=\"username\" pInputText placeholder=\"Username\"\n             formControlName=\"username\" required [(ngModel)]=\"model.username\" class=\"ui-g-9\">\n\n      <div *ngIf=\"username.invalid && (username.dirty || username.touched)\">\n        <p-message severity=\"error\" text=\"username is required\" *ngIf=\"username.errors.required\"></p-message>\n\n      </div>\n    </div>\n\n    <div class=\"ui-g\" style=\"margin-top:30px\">\n\n      <input name=\"email\" id=\"email\" pInputText placeholder=\"E-mail\"\n             formControlName=\"email\" required [(ngModel)]=\"model.email\" class=\"ui-g-9\">\n\n      <div *ngIf=\"email.invalid && (email.dirty || email.touched)\">\n\n        <p-message severity=\"error\" text=\" Email is required\" *ngIf=\"email.errors.required\">\n        </p-message>\n        <p-message severity=\"error\" text=\"Please enter a valid e-mail\" *ngIf=\"email.errors.email&&!email.errors.required\"></p-message>\n\n      </div>\n    </div>\n\n    <div class=\"ui-g\" style=\"margin-top:30px\">\n\n      <input name=\"password\" id=\"password\"  type=\"password\" placeholder=\"password\"\n             formControlName=\"password\" required [(ngModel)]=\"model.password\" class=\"ui-g-9\">\n\n      <div *ngIf=\"password.invalid && (password.dirty || password.touched)\">\n\n        <p-message *ngIf=\"password.errors.required\" severity=\"error\" text=\"Password is required\">\n        </p-message>\n        <p-message *ngIf=\"password.errors.minlength\" severity=\"error\" text=\"Password is to Short\">\n        </p-message>\n\n\n      </div>\n    </div>\n\n    <div class=\"ui-g\" style=\"margin-top:30px\">\n\n      <input name=\"confirmPasswordForm\" id=\"confirmPasswordForm\" [(ngModel)]=\"confirmPassword\" formControlName=\"confirmPasswordForm\" placeholder=\"Confirm Password\" required  pInputText class=\"ui-g-9\">\n\n\n      <div *ngIf=\"confirmPasswordForm.invalid && (confirmPasswordForm.dirty || confirmPasswordForm.touched)\">\n        <p-message severity=\"error\" text=\"Passwords do not match\">\n        </p-message>\n\n\n      </div>\n    </div>\n\n\n\n\n\n\n    <div class=\"ui-g-6\" style=\"margin-top:30px\">\n\n      <button pButton style=\"margin-bottom:10px\" class=\"blue-btn\" (click)=\"register()\" label=\"Register\" [disabled]=\"!registrationForm.valid\"></button>\n      <a [routerLink]=\"['/login']\" class=\"btn btn-link\">Cancel</a>\n    </div>\n  </form>\n\n\n\n\n\n\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/register/register.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_userService_user_service__ = __webpack_require__("../../../../../src/app/service/userService/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var RegisterComponent = (function () {
    function RegisterComponent(router, userService) {
        this.router = router;
        this.userService = userService;
        this.model = {};
        this.loading = false;
        this.registrationForm = new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormGroup"]({
            'fullname': new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormControl"](this.model.fullname, [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required]),
            'email': new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormControl"](this.model.email, [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].email, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required]),
            'username': new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormControl"](this.model.username, [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].minLength(4)]),
            'password': new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormControl"](this.model.password, [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].minLength(8)]),
            'confirmPasswordForm': new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormControl"](this.confirmPassword, [this.passwordValidator(this.model.password)])
        });
    }
    Object.defineProperty(RegisterComponent.prototype, "fullname", {
        get: function () {
            return this.registrationForm.get('fullname');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterComponent.prototype, "email", {
        get: function () {
            return this.registrationForm.get('email');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterComponent.prototype, "confirmPasswordForm", {
        get: function () {
            return this.registrationForm.get('confirmPasswordForm');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterComponent.prototype, "username", {
        get: function () {
            return this.registrationForm.get('username');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterComponent.prototype, "password", {
        get: function () {
            return this.registrationForm.get('password');
        },
        enumerable: true,
        configurable: true
    });
    RegisterComponent.prototype.register = function () {
        var _this = this;
        console.log(this.registrationForm);
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(function (data) {
            console.log("success");
            _this.router.navigate(['/login']);
        }, function (error) {
            console.log("error");
            _this.loading = false;
        });
    };
    RegisterComponent.prototype.passwordValidator = function (obj) {
        var _this = this;
        return function (control) {
            return _this.confirmPassword !== _this.model.password ? { 'NotMAtch': { value: control.value } } : null;
        };
    };
    RegisterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-register',
            template: __webpack_require__("../../../../../src/app/register/register.component.html"),
            styles: [__webpack_require__("../../../../../src/app/register/register.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"],
            __WEBPACK_IMPORTED_MODULE_2__service_userService_user_service__["a" /* UserService */]])
    ], RegisterComponent);
    return RegisterComponent;
}());



/***/ }),

/***/ "../../../../../src/app/requestInterceptor.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TokenInterceptor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by ena3 on 3/1/18.
 */

var TokenInterceptor = (function () {
    function TokenInterceptor() {
    }
    TokenInterceptor.prototype.intercept = function (request, next) {
        console.log("here");
        if (localStorage.getItem('currentUser')) {
            request = request.clone({
                setHeaders: {
                    Authorization: localStorage.getItem('currentUser')
                }
            });
        }
        return next.handle(request);
    };
    TokenInterceptor = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], TokenInterceptor);
    return TokenInterceptor;
}());



/***/ }),

/***/ "../../../../../src/app/service/conformance-profiles/conformance-profiles.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceProfilesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_conformance_profiles_conformance_profiles_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/conformance-profiles/conformance-profiles-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/objects-database.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ConformanceProfilesService = (function () {
    function ConformanceProfilesService(http, conformanceProfilesIndexedDbService) {
        this.http = http;
        this.conformanceProfilesIndexedDbService = conformanceProfilesIndexedDbService;
    }
    ConformanceProfilesService.prototype.getConformanceProfileMetadata = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.conformanceProfilesIndexedDbService.getConformanceProfileMetadata(id).then(function (metadata) {
                resolve(metadata);
            }).catch(function () {
                _this.http.get('api/conformanceprofiles/' + id + '/metadata').subscribe(function (serverConformanceProfileMetadata) {
                    resolve(serverConformanceProfileMetadata);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    ConformanceProfilesService.prototype.getConformanceProfileStructure = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.conformanceProfilesIndexedDbService.getConformanceProfileStructure(id).then(function (structure) {
                resolve(structure);
            }).catch(function () {
                _this.http.get('api/conformanceprofiles/' + id + '/structure').subscribe(function (serverConformanceProfileStructure) {
                    resolve(serverConformanceProfileStructure);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    ConformanceProfilesService.prototype.getConformanceProfileCrossReference = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.conformanceProfilesIndexedDbService.getConformanceProfileCrossReference(id).then(function (crossReference) {
                resolve(crossReference);
            }).catch(function () {
                _this.http.get('api/conformanceprofiles/' + id + '/crossReference').subscribe(function (serverConformanceProfileCrossReference) {
                    resolve(serverConformanceProfileCrossReference);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    ConformanceProfilesService.prototype.getConformanceProfilePostDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.conformanceProfilesIndexedDbService.getConformanceProfilePostDef(id).then(function (postDef) {
                resolve(postDef);
            }).catch(function () {
                _this.http.get('api/conformanceprofiles/' + id + '/postDef').subscribe(function (serverConformanceProfilePostDef) {
                    resolve(serverConformanceProfilePostDef);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    ConformanceProfilesService.prototype.getConformanceProfilePreDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.conformanceProfilesIndexedDbService.getConformanceProfilePreDef(id).then(function (preDef) {
                resolve(preDef);
            }).catch(function () {
                _this.http.get('api/conformanceprofiles/' + id + '/preDef').subscribe(function (serverConformanceProfilePreDef) {
                    resolve(serverConformanceProfilePreDef);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    ConformanceProfilesService.prototype.getConformanceProfileConformanceStatements = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.conformanceProfilesIndexedDbService.getConformanceProfileConformanceStatements(id).then(function (conformanceStatement) {
                resolve(conformanceStatement);
            }).catch(function () {
                _this.http.get('api/conformanceprofiles/' + id + '/conformanceStatement').subscribe(function (serverConformanceProfileConformanceStatement) {
                    resolve(serverConformanceProfileConformanceStatement);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    ConformanceProfilesService.prototype.saveConformanceProfileMetadata = function (id, metadata) {
        var conformanceProfile = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        conformanceProfile.id = id;
        conformanceProfile.metadata = metadata;
        return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
    };
    ConformanceProfilesService.prototype.saveConformanceProfileStructure = function (id, structure) {
        var conformanceProfile = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        conformanceProfile.id = id;
        conformanceProfile.structure = structure;
        return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
    };
    ConformanceProfilesService.prototype.saveConformanceProfilePreDef = function (id, preDef) {
        var conformanceProfile = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        conformanceProfile.id = id;
        conformanceProfile.preDef = preDef;
        return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
    };
    ConformanceProfilesService.prototype.saveConformanceProfilePostDef = function (id, postDef) {
        var conformanceProfile = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        conformanceProfile.id = id;
        conformanceProfile.postDef = postDef;
        return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
    };
    ConformanceProfilesService.prototype.saveConformanceProfileCrossReferences = function (id, crossReference) {
        var conformanceProfile = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        conformanceProfile.id = id;
        conformanceProfile.crossReference = crossReference;
        return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
    };
    ConformanceProfilesService.prototype.saveConformanceProfileConformanceStatements = function (id, conformanceStatements) {
        var conformanceProfile = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        conformanceProfile.id = id;
        conformanceProfile.conformanceStatements = conformanceStatements;
        return this.conformanceProfilesIndexedDbService.saveConformanceProfile(conformanceProfile);
    };
    ConformanceProfilesService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__indexed_db_conformance_profiles_conformance_profiles_indexed_db_service__["a" /* ConformanceProfilesIndexedDbService */]])
    ], ConformanceProfilesService);
    return ConformanceProfilesService;
}());



/***/ }),

/***/ "../../../../../src/app/service/constraints/constraints.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConstraintsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ConstraintsService = (function () {
    function ConstraintsService(configService) {
        this.configService = configService;
    }
    ConstraintsService.prototype.generateDescriptionForSimpleAssertion = function (assertion, idMap) {
        if (assertion.mode === 'SIMPLE') {
            var subject = void 0, verb = void 0, complementKey = void 0;
            if (assertion.subject && assertion.subject.path) {
                subject = this.parsePath(assertion.subject.path, idMap, null, null, '-');
            }
            if (assertion.verbKey) {
                verb = assertion.verbKey;
            }
            if (assertion.complement) {
                complementKey = assertion.complement.complementKey;
            }
            if (subject && verb && complementKey) {
                if (complementKey === 'SAMEVALUE') {
                    var casesensitive = void 0;
                    var value = void 0;
                    casesensitive = assertion.complement.casesensitive;
                    value = assertion.complement.value;
                    if (value) {
                        assertion.description = subject + ' ' + verb + ' contain the constant value \'' + value + '\'' + ((casesensitive) ? '(case-sensitive).' : '(case-insensitive)');
                    }
                }
                else if (complementKey === 'LISTVALUE') {
                    var values = void 0;
                    values = assertion.complement.values;
                    if (values && values.length > 0) {
                        assertion.description = subject + ' ' + verb + ' contain one of the values ' + this.parseValues(values, null, 0, null);
                    }
                }
                else if (complementKey === 'PRESENCE') {
                    assertion.description = subject + ' ' + verb + ' presence';
                }
                else if (complementKey === 'COMPARENODE') {
                    //The content of LOCATION 1 (DESCRIPTION) SHALL be identical to the content of LOCATION 2 (DESCRIPTION).
                    var operator = void 0, otherLocation = void 0;
                    var path = void 0;
                    operator = assertion.complement.operator;
                    path = assertion.complement.path;
                    if (path)
                        otherLocation = this.parsePath(path, idMap, null, null, '-');
                    if (operator && otherLocation) {
                        assertion.description = 'The content of ' + subject + ' ' + verb + ' ' + this.configService.getOperatorLable(operator) + ' ' + otherLocation;
                    }
                }
                else if (complementKey === 'COMPAREVALUE') {
                    var operator = void 0, value = void 0;
                    operator = assertion.complement.operator;
                    value = assertion.complement.value;
                    if (operator && value) {
                        assertion.description = 'The content of ' + subject + ' ' + verb + ' ' + this.configService.getOperatorLable(operator) + ' \'' + value + '\'';
                    }
                }
                else if (complementKey === 'FORMATTED') {
                    var type = void 0, regexPattern = void 0;
                    regexPattern = assertion.complement.regexPattern;
                    type = assertion.complement.type;
                    if (type) {
                        assertion.description = 'The content of ' + subject + ' ' + verb + ' ' + this.configService.getFormattedType(type);
                    }
                }
            }
        }
        else if (assertion.mode === 'COMPLEX') {
            if (assertion.complexAssertionType) {
                if (assertion.complexAssertionType === 'ANDOR') {
                    var operator = void 0, result = void 0;
                    var assertions = void 0;
                    var isReady = true;
                    operator = assertion.operator;
                    assertions = assertion.assertions;
                    if (operator && assertions && assertions.length > 1) {
                        for (var _i = 0, assertions_1 = assertions; _i < assertions_1.length; _i++) {
                            var childAssertion = assertions_1[_i];
                            this.generateDescriptionForSimpleAssertion(childAssertion, idMap);
                            if (!childAssertion.description)
                                isReady = false;
                            if (result) {
                                result = result + ' ' + operator + ' {' + childAssertion.description + '}';
                            }
                            else {
                                result = '{' + childAssertion.description + '}';
                            }
                        }
                    }
                    if (result)
                        result = result;
                    if (isReady && result) {
                        assertion.description = result;
                    }
                }
                else if (assertion.complexAssertionType === 'NOT') {
                    var result = void 0;
                    var child = void 0;
                    var isReady = true;
                    child = assertion.child;
                    if (assertion) {
                        this.generateDescriptionForSimpleAssertion(child, idMap);
                        if (!child.description)
                            isReady = false;
                        result = 'NOT{' + child.description + '}';
                    }
                    if (isReady && result) {
                        assertion.description = result;
                    }
                }
                else if (assertion.complexAssertionType === 'IFTHEN') {
                    var result = void 0;
                    var ifAssertion = void 0, thenAssertion = void 0;
                    var isReady = true;
                    ifAssertion = assertion.ifAssertion;
                    thenAssertion = assertion.thenAssertion;
                    if (ifAssertion && thenAssertion) {
                        this.generateDescriptionForSimpleAssertion(ifAssertion, idMap);
                        this.generateDescriptionForSimpleAssertion(thenAssertion, idMap);
                        if (!ifAssertion.description)
                            isReady = false;
                        if (!thenAssertion.description)
                            isReady = false;
                        result = 'IF {' + ifAssertion.description + '}, then {' + thenAssertion.description + '}';
                    }
                    if (isReady && result) {
                        assertion.description = result;
                    }
                }
            }
        }
    };
    ConstraintsService.prototype.parsePath = function (path, idMap, result, idPath, separator) {
        if (result) {
            idPath = idPath + '-' + path.elementId;
            result = result + separator + idMap[idPath].position + ((path.instanceParameter && path.instanceParameter === '1') ? '' : '[' + path.instanceParameter + ']');
            if (path.child)
                result = this.parsePath(path.child, idMap, result, idPath, '.');
            else
                result = result + '(' + idMap[idPath].name + ')';
        }
        else {
            idPath = path.elementId;
            result = idMap[path.elementId].name;
            if (path.child)
                result = this.parsePath(path.child, idMap, result, idPath, separator);
            else
                result = result + '(' + idMap[idPath].name + ')';
        }
        return result;
    };
    ConstraintsService.prototype.parseValues = function (values, result, index, separator) {
        if (result) {
            result = result + separator + '\'' + values[index] + '\'';
        }
        else {
            result = '\'' + values[index] + '\'';
        }
        index = index + 1;
        if (values.length - 1 > index) {
            result = this.parseValues(values, result, index, ', ');
        }
        else if (values.length - 1 === index) {
            result = this.parseValues(values, result, index, ' or ');
        }
        return result;
    };
    ConstraintsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */]])
    ], ConstraintsService);
    return ConstraintsService;
}());



/***/ }),

/***/ "../../../../../src/app/service/datatypes/datatypes.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_datatypes_datatypes_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/datatypes/datatypes-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/objects-database.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DatatypesService = (function () {
    function DatatypesService(http, datatypesIndexedDbService) {
        this.http = http;
        this.datatypesIndexedDbService = datatypesIndexedDbService;
    }
    DatatypesService.prototype.getDatatypeMetadata = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.datatypesIndexedDbService.getDatatypeMetadata(id).then(function (metadata) {
                resolve(metadata);
            }).catch(function () {
                _this.http.get('api/datatypes/' + id + '/metadata').subscribe(function (serverDatatypeMetadata) {
                    resolve(serverDatatypeMetadata);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    DatatypesService.prototype.getDatatypeStructure = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.datatypesIndexedDbService.getDatatypeStructure(id).then(function (structure) {
                resolve(structure);
            }).catch(function () {
                _this.http.get('api/datatypes/' + id + '/structure').subscribe(function (serverDatatypeStructure) {
                    resolve(serverDatatypeStructure);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    DatatypesService.prototype.getDatatypeCrossReference = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.datatypesIndexedDbService.getDatatypeCrossReference(id).then(function (crossReference) {
                resolve(crossReference);
            }).catch(function () {
                _this.http.get('api/datatypes/' + id + '/crossReference').subscribe(function (serverDatatypeCrossReference) {
                    resolve(serverDatatypeCrossReference);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    DatatypesService.prototype.getDatatypePostDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.datatypesIndexedDbService.getDatatypePostDef(id).then(function (postDef) {
                resolve(postDef);
            }).catch(function () {
                _this.http.get('api/datatypes/' + id + '/postdef').subscribe(function (serverDatatypePostDef) {
                    resolve(serverDatatypePostDef);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    DatatypesService.prototype.getDatatypePreDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.datatypesIndexedDbService.getDatatypePreDef(id).then(function (preDef) {
                resolve(preDef);
            }).catch(function () {
                _this.http.get('api/datatypes/' + id + '/predef').subscribe(function (serverDatatypePreDef) {
                    resolve(serverDatatypePreDef);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    DatatypesService.prototype.getDatatypeConformanceStatements = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.datatypesIndexedDbService.getDatatypeConformanceStatements(id).then(function (conformanceStatement) {
                resolve(conformanceStatement);
            }).catch(function () {
                _this.http.get('api/datatypes/' + id + '/conformancestatement').subscribe(function (serverDatatypeConformanceStatement) {
                    resolve(serverDatatypeConformanceStatement);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    DatatypesService.prototype.saveDatatypeMetadata = function (id, metadata) {
        var datatype = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        datatype.id = id;
        datatype.metadata = metadata;
        return this.datatypesIndexedDbService.saveDatatype(datatype);
    };
    DatatypesService.prototype.saveDatatypeStructure = function (id, structure) {
        var datatype = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        datatype.id = id;
        datatype.structure = structure;
        return this.datatypesIndexedDbService.saveDatatype(datatype);
    };
    DatatypesService.prototype.saveDatatypePreDef = function (id, preDef) {
        var datatype = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        datatype.id = id;
        datatype.preDef = preDef;
        return this.datatypesIndexedDbService.saveDatatype(datatype);
    };
    DatatypesService.prototype.saveDatatypePostDef = function (id, postDef) {
        var datatype = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        datatype.id = id;
        datatype.postDef = postDef;
        return this.datatypesIndexedDbService.saveDatatype(datatype);
    };
    DatatypesService.prototype.saveDatatypeCrossReferences = function (id, crossReference) {
        var datatype = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        datatype.id = id;
        datatype.crossReference = crossReference;
        return this.datatypesIndexedDbService.saveDatatype(datatype);
    };
    DatatypesService.prototype.saveDatatypeConformanceStatements = function (id, conformanceStatements) {
        var datatype = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        datatype.id = id;
        datatype.conformanceStatements = conformanceStatements;
        return this.datatypesIndexedDbService.saveDatatype(datatype);
    };
    DatatypesService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__indexed_db_datatypes_datatypes_indexed_db_service__["a" /* DatatypesIndexedDbService */]])
    ], DatatypesService);
    return DatatypesService;
}());



/***/ }),

/***/ "../../../../../src/app/service/general-configuration/general-configuration.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GeneralConfigurationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by hnt5 on 11/2/17.
 */

var GeneralConfigurationService = (function () {
    function GeneralConfigurationService() {
        this._constraintTypes = [
            { label: 'Predefined', value: 'PREDEFINED', icon: 'fa fa-fw fa-spinner', disabled: true },
            { label: 'Predefined Patterns', value: 'PREDEFINEDPATTERNS', icon: 'fa fa-fw fa-spinner', disabled: true },
            { label: 'Assertion Builder', value: 'ASSERTION', icon: 'fa fa-fw fa-file-code-o' },
            { label: 'Free Text', value: 'FREE', icon: 'fa fa-fw fa-file-text-o' }
        ];
        this._complexAssertionTypes = [
            { label: 'IFTHEN', value: 'IFTHEN' },
            { label: 'AND/OR', value: 'ANDOR' },
            { label: 'NOT', value: 'NOT' }
        ];
        this._simpleAssertionTypes = [
            {
                label: 'Value',
                items: [
                    { label: 'Simple Value', value: 'SAMEVALUE' },
                    { label: 'List of Value', value: 'LISTVALUE' },
                    { label: 'Formatted Value', value: 'FORMATTED' },
                    { label: 'Presence', value: 'PRESENCE' }
                ]
            },
            {
                label: 'Comparison',
                items: [
                    { label: 'Compare with other Node', value: 'COMPARENODE' },
                    { label: 'Compare with value', value: 'COMPAREVALUE' }
                ]
            }
        ];
        this._assertionModes = [
            // {label: 'Select Assertion Type', value: null},
            { label: 'Simple Assertion', value: 'SIMPLE' },
            { label: 'Complex Assertion', value: 'COMPLEX' }
        ];
        this._partialComplexAssertionTypes = [
            { label: 'AND/OR', value: 'ANDOR' },
            { label: 'NOT', value: 'NOT' }
        ];
        this._simpleConstraintVerbs = [{ label: 'SHALL', value: 'SHALL' }, { label: 'SHALL NOT', value: 'SHALL NOT' }];
        this._ifConstraintVerbs = [{ label: 'is', value: 'IS' }, { label: 'is NOT', value: 'is NOT' }];
        this._formatTypes = [{ label: 'be ISO format', value: 'iso' }, { label: 'be positive', value: 'positive' }, { label: 'be negative', value: 'negative' }, { label: 'be numeric', value: 'numeric' }, { label: 'be alphanumeric', value: 'alphanumeric' }, { label: 'be regrex', value: 'regrex' }];
        this._operators = [{ label: 'be identical to the content of', value: 'equal' }, { label: 'be greater to the value of', value: 'greater' }, { label: 'be less to the value of', value: 'less' }, { label: 'be same or greater to the value of', value: 'equalorgreater' }, { label: 'be same or less to the value of', value: 'equalorless' }, { label: 'be different to the value of', value: 'notequal' }];
        this._usages = [{ label: 'R', value: 'R' }, { label: 'RE', value: 'RE' }, { label: 'C', value: 'C' }, { label: 'X', value: 'O' }];
        this._cUsages = [{ label: '', value: null }, { label: 'R', value: 'R' }, { label: 'RE', value: 'RE' }, { label: 'X', value: 'O' }];
        this._valuesetStrengthOptions = [{ label: 'Select Strength', value: null }, { label: 'R', value: 'R' }, { label: 'S', value: 'S' }, { label: 'U', value: 'U' }];
        this._valueSetAllowedDTs = ["ID", "IS", "CE", "CF", "CWE", "CNE", "CSU", "HD"];
        this._codedElementDTs = ["CE", "CF", "CWE", "CNE", "CSU"];
        this._singleValueSetDTs = ["ID", "IS", "ST", "NM", "HD"];
        this._valueSetAllowedFields = [
            {
                "segmentName": "PID",
                "location": 23,
                "type": "FIELD"
            }
        ];
        this._valueSetAllowedComponents =
            [
                {
                    "dtName": "CNS",
                    "location": 7
                },
                {
                    "dtName": "CSU",
                    "location": 11
                },
                {
                    "dtName": "XON",
                    "location": 10
                },
                {
                    "dtName": "CSU",
                    "location": 2
                },
                {
                    "dtName": "LA2",
                    "location": 12
                },
                {
                    "dtName": "OSD",
                    "location": 4
                },
                {
                    "dtName": "AD",
                    "location": 4
                },
                {
                    "dtName": "LA2",
                    "location": 11
                },
                {
                    "dtName": "XAD",
                    "location": 4
                },
                {
                    "dtName": "AD",
                    "location": 5
                },
                {
                    "dtName": "XAD",
                    "location": 3
                },
                {
                    "dtName": "XON",
                    "location": 3
                },
                {
                    "dtName": "AD",
                    "location": 3
                },
                {
                    "dtName": "CSU",
                    "location": 14
                },
                {
                    "dtName": "LA2",
                    "location": 13
                },
                {
                    "dtName": "OSD",
                    "location": 2
                },
                {
                    "dtName": "XAD",
                    "location": 5
                },
                {
                    "dtName": "CSU",
                    "location": 5
                }
            ];
    }
    Object.defineProperty(GeneralConfigurationService.prototype, "usages", {
        get: function () {
            return this._usages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeneralConfigurationService.prototype, "valueSetAllowedDTs", {
        get: function () {
            return this._valueSetAllowedDTs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeneralConfigurationService.prototype, "valueSetAllowedComponents", {
        get: function () {
            return this._valueSetAllowedComponents;
        },
        enumerable: true,
        configurable: true
    });
    GeneralConfigurationService.prototype.isValueSetAllow = function (dtName, position, parrentDT, SegmentName, type) {
        if (this._valueSetAllowedDTs.includes(dtName))
            return true;
        if (this._valueSetAllowedFields.includes({
            "segmentName": SegmentName,
            "location": position,
            "type": type
        }))
            return true;
        if (this._valueSetAllowedComponents.includes({
            "dtName": parrentDT,
            "location": position
        }))
            return true;
        return false;
    };
    GeneralConfigurationService.prototype.isMultipleValuseSetAllowed = function (dtName) {
        if (this._singleValueSetDTs.includes(dtName))
            return false;
        return true;
    };
    GeneralConfigurationService.prototype.getValuesetLocations = function (dtName, version) {
        if (this._codedElementDTs.includes(dtName)) {
            if (['2.1', '2.2', '2.3', '2.3.1', '2.4', '2.5', '2.5.1', '2.6'].includes(version))
                return [{ label: 'Select Location', value: null }, { label: '1', value: [1] }, { label: '4', value: [4] }, { label: '1 or 4', value: [1, 4] }];
            if (['2.7', '2.7.1', '2.8', '2.8.1', '2.8.2'].includes(version))
                return [{ label: 'Select Location', value: null }, { label: '1', value: [1] }, { label: '4', value: [4] }, { label: '1 or 4', value: [1, 4] }, { label: '1 or 4 or 10', value: [1, 4, 10] }];
        }
        return null;
    };
    GeneralConfigurationService.prototype.getOperatorLable = function (operator) {
        if (operator) {
            for (var _i = 0, _a = this._operators; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.value === operator)
                    return entry.label;
            }
        }
        return null;
    };
    GeneralConfigurationService.prototype.getFormattedType = function (type) {
        if (type) {
            for (var _i = 0, _a = this._formatTypes; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.value === type)
                    return entry.label;
            }
        }
        return null;
    };
    GeneralConfigurationService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], GeneralConfigurationService);
    return GeneralConfigurationService;
}());



/***/ }),

/***/ "../../../../../src/app/service/ig-document/ig-document.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var IgDocumentService = (function () {
    function IgDocumentService(http) {
        this.http = http;
    }
    IgDocumentService.prototype.save = function (changedObjects) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post('api/igdocuments/' + changedObjects.igDocumentId + '/save', changedObjects).subscribe(function (result) {
                console.log('IG Document successfully saved ' + result);
                resolve();
            }, function (error) {
                reject();
            });
        });
    };
    IgDocumentService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]])
    ], IgDocumentService);
    return IgDocumentService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/composite-profiles/composite-profiles-toc.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CompositeProfilesTocService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db-utils.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var CompositeProfilesTocService = (function () {
    function CompositeProfilesTocService(indexeddbService) {
        this.indexeddbService = indexeddbService;
    }
    CompositeProfilesTocService.prototype.getCompositeProfile = function (id, callback) {
        var _this = this;
        var compositeProfile;
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.compositeProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.compositeProfiles.get(id)];
                        case 1:
                            compositeProfile = _a.sent();
                            callback(compositeProfile);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        else {
            callback(null);
        }
    };
    CompositeProfilesTocService.prototype.saveCompositeProfile = function (compositeProfile) {
        var _this = this;
        console.log(compositeProfile);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.compositeProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                var savedCompositeProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.compositeProfiles.get(compositeProfile.id)];
                        case 1:
                            savedCompositeProfile = _a.sent();
                            this.doSave(compositeProfile, savedCompositeProfile);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    CompositeProfilesTocService.prototype.doSave = function (compositeProfile, savedCompositeProfile) {
        var _this = this;
        savedCompositeProfile = __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__["a" /* default */].populateIObject(compositeProfile, savedCompositeProfile);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.compositeProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.compositeProfiles.put(savedCompositeProfile)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    CompositeProfilesTocService.prototype.bulkAdd = function (compositeProfiles) {
        if (this.indexeddbService.tocDataBase != null) {
            return this.indexeddbService.tocDataBase.compositeProfiles.bulkPut(compositeProfiles);
        }
    };
    CompositeProfilesTocService.prototype.bulkAddNewCompositeProfiles = function (compositeProfiles) {
        if (this.indexeddbService.addedObjectsDatabase != null) {
            return this.indexeddbService.addedObjectsDatabase.compositeProfiles.bulkPut(compositeProfiles);
        }
    };
    CompositeProfilesTocService.prototype.removeCompositeProfile = function (compositeProfileNode) {
        var _this = this;
        this.indexeddbService.removedObjectsDatabase.compositeProfiles.put(compositeProfileNode).then(function () {
            _this.removeFromToc(compositeProfileNode);
        }, function () {
            console.log('Unable to remove node from TOC');
        });
    };
    CompositeProfilesTocService.prototype.removeFromToc = function (compositeProfileNode) {
        this.indexeddbService.tocDataBase.compositeProfiles.where('id').equals(compositeProfileNode.id).delete();
    };
    CompositeProfilesTocService.prototype.addCompositeProfile = function (compositeProfileNode) {
        this.indexeddbService.addedObjectsDatabase.compositeProfiles.put(compositeProfileNode).then(function () { }, function () {
            console.log('Unable to add node from TOC');
        });
    };
    CompositeProfilesTocService.prototype.getAll = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var promises = [];
            promises.push(_this.getAllFromToc());
            promises.push(_this.getAllFromAdded());
            Promise.all(promises).then(function (results) {
                var allNodes = new Array();
                var tocNodes = results[0];
                var addedNodes = results[1];
                if (tocNodes != null) {
                    allNodes.push(tocNodes);
                }
                if (addedNodes != null) {
                    allNodes.push(addedNodes);
                }
                resolve(allNodes);
            });
        });
        return promise;
    };
    CompositeProfilesTocService.prototype.getAllFromToc = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.tocDataBase.transaction('rw', _this.indexeddbService.tocDataBase.compositeProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                var compositeProfiles;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.compositeProfiles.toArray()];
                        case 1:
                            compositeProfiles = _a.sent();
                            resolve(compositeProfiles);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    CompositeProfilesTocService.prototype.getAllFromAdded = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.addedObjectsDatabase.transaction('rw', _this.indexeddbService.addedObjectsDatabase.compositeProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                var compositeProfiles;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.addedObjectsDatabase.compositeProfiles.toArray()];
                        case 1:
                            compositeProfiles = _a.sent();
                            resolve(compositeProfiles);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    CompositeProfilesTocService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__indexed_db_service__["a" /* IndexedDbService */]])
    ], CompositeProfilesTocService);
    return CompositeProfilesTocService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/conformance-profiles/conformance-profiles-indexed-db.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceProfilesIndexedDbService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db-utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/node-database.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var ConformanceProfilesIndexedDbService = (function () {
    function ConformanceProfilesIndexedDbService(indexeddbService) {
        this.indexeddbService = indexeddbService;
    }
    ConformanceProfilesIndexedDbService.prototype.getConformanceProfile = function (id) {
        var _this = this;
        var conformanceProfile;
        var promise = new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.transaction('r', _this.indexeddbService.changedObjectsDatabase.conformanceProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.indexeddbService.changedObjectsDatabase.conformanceProfiles.get(id)];
                            case 1:
                                conformanceProfile = _a.sent();
                                resolve(conformanceProfile);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    ConformanceProfilesIndexedDbService.prototype.getConformanceProfileMetadata = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getConformanceProfile(id).then(function (conformanceProfile) {
                resolve(conformanceProfile.metadata);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ConformanceProfilesIndexedDbService.prototype.getAllMetaData = function () {
        var _this = this;
        var conformanceProfiles;
        var promise = new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.transaction('r', _this.indexeddbService.changedObjectsDatabase.conformanceProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.indexeddbService.changedObjectsDatabase.conformanceProfiles.filter(function (conformanceProfile) {
                                    return conformanceProfile.metadata;
                                }).toArray()];
                            case 1:
                                conformanceProfiles = _a.sent();
                                resolve(conformanceProfiles);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    ConformanceProfilesIndexedDbService.prototype.getConformanceProfileStructure = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getConformanceProfile(id).then(function (conformanceProfile) {
                resolve(conformanceProfile.structure);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ConformanceProfilesIndexedDbService.prototype.getConformanceProfileCrossReference = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getConformanceProfile(id).then(function (conformanceProfile) {
                resolve(conformanceProfile.crossReference);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ConformanceProfilesIndexedDbService.prototype.getConformanceProfilePostDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getConformanceProfile(id).then(function (conformanceProfile) {
                resolve(conformanceProfile.postDef);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ConformanceProfilesIndexedDbService.prototype.getConformanceProfilePreDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getConformanceProfile(id).then(function (conformanceProfile) {
                resolve(conformanceProfile.preDef);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ConformanceProfilesIndexedDbService.prototype.getConformanceProfileConformanceStatements = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getConformanceProfile(id).then(function (conformanceProfile) {
                resolve(conformanceProfile.conformanceStatements);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ConformanceProfilesIndexedDbService.prototype.saveConformanceProfile = function (conformanceProfile) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getConformanceProfile(conformanceProfile.id).then(function (existingConformanceProfile) {
                _this.doSave(conformanceProfile, existingConformanceProfile);
            });
        });
        return promise;
    };
    ConformanceProfilesIndexedDbService.prototype.saveConformanceProfileStructureToNodeDatabase = function (id, conformanceProfileStructure) {
        var _this = this;
        if (this.indexeddbService.nodeDatabase != null) {
            this.indexeddbService.nodeDatabase.transaction('rw', this.indexeddbService.nodeDatabase.conformanceProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                var conformanceProfileNode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            conformanceProfileNode = new __WEBPACK_IMPORTED_MODULE_3__node_database__["a" /* Node */]();
                            conformanceProfileNode.id = id;
                            conformanceProfileNode.structure = conformanceProfileStructure;
                            return [4 /*yield*/, this.indexeddbService.nodeDatabase.conformanceProfiles.put(conformanceProfileNode)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    ConformanceProfilesIndexedDbService.prototype.doSave = function (conformanceProfile, savedConformanceProfile) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            savedConformanceProfile = __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__["a" /* default */].populateIObject(conformanceProfile, savedConformanceProfile);
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.conformanceProfiles.put(savedConformanceProfile).then(function () {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    ConformanceProfilesIndexedDbService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__indexed_db_service__["a" /* IndexedDbService */]])
    ], ConformanceProfilesIndexedDbService);
    return ConformanceProfilesIndexedDbService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/conformance-profiles/conformance-profiles-toc.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceProfilesTocService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db-utils.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var ConformanceProfilesTocService = (function () {
    function ConformanceProfilesTocService(indexeddbService) {
        this.indexeddbService = indexeddbService;
    }
    ConformanceProfilesTocService.prototype.getConformanceProfile = function (id, callback) {
        var _this = this;
        var conformanceProfile;
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.conformanceProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.conformanceProfiles.get(id)];
                        case 1:
                            conformanceProfile = _a.sent();
                            callback(conformanceProfile);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        else {
            callback(null);
        }
    };
    ConformanceProfilesTocService.prototype.saveConformanceProfile = function (conformanceProfile) {
        var _this = this;
        console.log(conformanceProfile);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.conformanceProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                var savedConformanceProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.conformanceProfiles.get(conformanceProfile.id)];
                        case 1:
                            savedConformanceProfile = _a.sent();
                            this.doSave(conformanceProfile, savedConformanceProfile);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    ConformanceProfilesTocService.prototype.doSave = function (conformanceProfile, savedConformanceProfile) {
        var _this = this;
        savedConformanceProfile = __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__["a" /* default */].populateIObject(conformanceProfile, savedConformanceProfile);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.conformanceProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.conformanceProfiles.put(savedConformanceProfile)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    ConformanceProfilesTocService.prototype.bulkAdd = function (conformanceProfiles) {
        if (this.indexeddbService.tocDataBase != null) {
            return this.indexeddbService.tocDataBase.conformanceProfiles.bulkPut(conformanceProfiles);
        }
    };
    ConformanceProfilesTocService.prototype.bulkAddNewConformanceProfiles = function (conformanceProfiles) {
        if (this.indexeddbService.addedObjectsDatabase != null) {
            return this.indexeddbService.addedObjectsDatabase.conformanceProfiles.bulkPut(conformanceProfiles);
        }
    };
    ConformanceProfilesTocService.prototype.removeConformanceProfile = function (conformanceProfileNode) {
        var _this = this;
        this.indexeddbService.removedObjectsDatabase.conformanceProfiles.put(conformanceProfileNode).then(function () {
            _this.removeFromToc(conformanceProfileNode);
        }, function () {
            console.log('Unable to remove node from TOC');
        });
    };
    ConformanceProfilesTocService.prototype.removeFromToc = function (conformanceProfileNode) {
        this.indexeddbService.tocDataBase.conformanceProfiles.where('id').equals(conformanceProfileNode.id).delete();
    };
    ConformanceProfilesTocService.prototype.addConformanceProfile = function (conformanceProfileNode) {
        this.indexeddbService.addedObjectsDatabase.conformanceProfiles.put(conformanceProfileNode).then(function () { }, function () {
            console.log('Unable to add node from TOC');
        });
    };
    ConformanceProfilesTocService.prototype.getAll = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var promises = [];
            promises.push(_this.getAllFromToc());
            promises.push(_this.getAllFromAdded());
            Promise.all(promises).then(function (results) {
                var allNodes = new Array();
                var tocNodes = results[0];
                var addedNodes = results[1];
                if (tocNodes != null) {
                    allNodes.push(tocNodes);
                }
                if (addedNodes != null) {
                    allNodes.push(addedNodes);
                }
                resolve(allNodes);
            });
        });
        return promise;
    };
    ConformanceProfilesTocService.prototype.getAllFromToc = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.tocDataBase.transaction('rw', _this.indexeddbService.tocDataBase.conformanceProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                var conformanceProfiles;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.conformanceProfiles.toArray()];
                        case 1:
                            conformanceProfiles = _a.sent();
                            resolve(conformanceProfiles);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    ConformanceProfilesTocService.prototype.getAllFromAdded = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.addedObjectsDatabase.transaction('rw', _this.indexeddbService.addedObjectsDatabase.conformanceProfiles, function () { return __awaiter(_this, void 0, void 0, function () {
                var conformanceProfiles;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.addedObjectsDatabase.conformanceProfiles.toArray()];
                        case 1:
                            conformanceProfiles = _a.sent();
                            resolve(conformanceProfiles);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    ConformanceProfilesTocService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__indexed_db_service__["a" /* IndexedDbService */]])
    ], ConformanceProfilesTocService);
    return ConformanceProfilesTocService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/datatypes/datatypes-indexed-db.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypesIndexedDbService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db-utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/node-database.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var DatatypesIndexedDbService = (function () {
    function DatatypesIndexedDbService(indexeddbService) {
        this.indexeddbService = indexeddbService;
    }
    DatatypesIndexedDbService.prototype.getDatatype = function (id) {
        var _this = this;
        var datatype;
        var promise = new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.transaction('r', _this.indexeddbService.changedObjectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.indexeddbService.changedObjectsDatabase.datatypes.get(id)];
                            case 1:
                                datatype = _a.sent();
                                resolve(datatype);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    DatatypesIndexedDbService.prototype.getDatatypeMetadata = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getDatatype(id).then(function (datatype) {
                resolve(datatype.metadata);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    DatatypesIndexedDbService.prototype.getAllMetaData = function () {
        var _this = this;
        var datatypes;
        var promise = new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.transaction('r', _this.indexeddbService.changedObjectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.indexeddbService.changedObjectsDatabase.datatypes.filter(function (datatype) {
                                    return datatype.metadata;
                                }).toArray()];
                            case 1:
                                datatypes = _a.sent();
                                resolve(datatypes);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    DatatypesIndexedDbService.prototype.getDatatypeStructure = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getDatatype(id).then(function (datatype) {
                resolve(datatype.structure);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    DatatypesIndexedDbService.prototype.getDatatypeCrossReference = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getDatatype(id).then(function (datatype) {
                resolve(datatype.crossReference);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    DatatypesIndexedDbService.prototype.getDatatypePostDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getDatatype(id).then(function (datatype) {
                resolve(datatype.postDef);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    DatatypesIndexedDbService.prototype.getDatatypePreDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getDatatype(id).then(function (datatype) {
                resolve(datatype.preDef);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    DatatypesIndexedDbService.prototype.getDatatypeConformanceStatements = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getDatatype(id).then(function (datatype) {
                resolve(datatype.conformanceStatements);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    DatatypesIndexedDbService.prototype.saveDatatype = function (datatype) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getDatatype(datatype.id).then(function (existingDatatype) {
                _this.doSave(datatype, existingDatatype);
            });
        });
        return promise;
    };
    DatatypesIndexedDbService.prototype.saveDatatypeStructureToNodeDatabase = function (id, datatypeStructure) {
        var _this = this;
        if (this.indexeddbService.nodeDatabase != null) {
            this.indexeddbService.nodeDatabase.transaction('rw', this.indexeddbService.nodeDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                var datatypeNode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            datatypeNode = new __WEBPACK_IMPORTED_MODULE_3__node_database__["a" /* Node */]();
                            datatypeNode.id = id;
                            datatypeNode.structure = datatypeStructure;
                            return [4 /*yield*/, this.indexeddbService.nodeDatabase.datatypes.put(datatypeNode)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    DatatypesIndexedDbService.prototype.doSave = function (datatype, savedDatatype) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            savedDatatype = __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__["a" /* default */].populateIObject(datatype, savedDatatype);
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.datatypes.put(savedDatatype).then(function () {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    DatatypesIndexedDbService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__indexed_db_service__["a" /* IndexedDbService */]])
    ], DatatypesIndexedDbService);
    return DatatypesIndexedDbService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/datatypes/datatypes-toc.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypesTocService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db-utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var DatatypesTocService = (function () {
    function DatatypesTocService(indexeddbService) {
        this.indexeddbService = indexeddbService;
    }
    DatatypesTocService.prototype.getDatatype = function (id, callback) {
        var _this = this;
        var datatype;
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.datatypes.get(id)];
                        case 1:
                            datatype = _a.sent();
                            callback(datatype);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        else {
            callback(null);
        }
    };
    DatatypesTocService.prototype.saveDatatype = function (datatype) {
        var _this = this;
        console.log(datatype);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                var savedDatatype;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.datatypes.get(datatype.id)];
                        case 1:
                            savedDatatype = _a.sent();
                            this.doSave(datatype, savedDatatype);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    DatatypesTocService.prototype.doSave = function (datatype, savedDatatype) {
        var _this = this;
        savedDatatype = __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__["a" /* default */].populateIObject(datatype, savedDatatype);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.datatypes.put(savedDatatype)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    DatatypesTocService.prototype.bulkAdd = function (datatypes) {
        if (this.indexeddbService.tocDataBase != null) {
            return this.indexeddbService.tocDataBase.datatypes.bulkPut(datatypes);
        }
    };
    DatatypesTocService.prototype.removeDatatype = function (datatypeNode) {
        var _this = this;
        this.indexeddbService.removedObjectsDatabase.datatypes.put(datatypeNode).then(function () {
            _this.removeFromToc(datatypeNode);
        }, function () {
            console.log('Unable to remove node from TOC');
        });
    };
    DatatypesTocService.prototype.removeFromToc = function (datatypeNode) {
        this.indexeddbService.tocDataBase.datatypes.where('id').equals(datatypeNode.id).delete();
    };
    DatatypesTocService.prototype.addDatatype = function (datatypeNode) {
        this.indexeddbService.addedObjectsDatabase.datatypes.put(datatypeNode).then(function () { }, function () {
            console.log('Unable to add node from TOC');
        });
    };
    DatatypesTocService.prototype.bulkAddNewDatatypes = function (datatypes) {
        if (this.indexeddbService.addedObjectsDatabase != null) {
            return this.indexeddbService.addedObjectsDatabase.datatypes.bulkPut(datatypes);
        }
    };
    DatatypesTocService.prototype.getAll = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var promises = [];
            promises.push(_this.getAllFromToc());
            promises.push(_this.getAllFromAdded());
            Promise.all(promises).then(function (results) {
                var allNodes = [];
                var tocNodes = results[0];
                var addedNodes = results[1];
                if (tocNodes != null) {
                    allNodes = __WEBPACK_IMPORTED_MODULE_3_lodash__["union"](allNodes, tocNodes);
                }
                if (addedNodes != null) {
                    allNodes = __WEBPACK_IMPORTED_MODULE_3_lodash__["union"](allNodes, addedNodes);
                }
                allNodes = __WEBPACK_IMPORTED_MODULE_3_lodash__["sortBy"](allNodes, function (data) {
                    return data.data.label;
                });
                resolve(allNodes);
            });
        });
        return promise;
    };
    DatatypesTocService.prototype.getAllFromToc = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.tocDataBase.transaction('rw', _this.indexeddbService.tocDataBase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                var datatypes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.datatypes.toArray()];
                        case 1:
                            datatypes = _a.sent();
                            resolve(datatypes);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    DatatypesTocService.prototype.getAllFromAdded = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.addedObjectsDatabase.transaction('rw', _this.indexeddbService.addedObjectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                var datatypes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.addedObjectsDatabase.datatypes.toArray()];
                        case 1:
                            datatypes = _a.sent();
                            resolve(datatypes);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    DatatypesTocService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__indexed_db_service__["a" /* IndexedDbService */]])
    ], DatatypesTocService);
    return DatatypesTocService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/ig-document-info-database.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return IgDocumentInfoDatabase; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_dexie__ = __webpack_require__("../../../../dexie/dist/dexie.es.js");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var IgDocumentInfo = (function () {
    function IgDocumentInfo(id) {
        this.id = id;
    }
    return IgDocumentInfo;
}());

var IgDocumentInfoDatabase = (function (_super) {
    __extends(IgDocumentInfoDatabase, _super);
    function IgDocumentInfoDatabase() {
        var _this = _super.call(this, 'IgDocumentInfoDatabase') || this;
        _this.version(1).stores({
            igDocument: '&id'
        });
        return _this;
    }
    return IgDocumentInfoDatabase;
}(__WEBPACK_IMPORTED_MODULE_0_dexie__["a" /* default */]));



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/indexed-db-utils.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__objects_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/objects-database.ts");

var IndexedDbUtils = (function () {
    function IndexedDbUtils() {
    }
    IndexedDbUtils.populateIObject = function (objectSource, objectTarget) {
        if (objectTarget == null) {
            objectTarget = new __WEBPACK_IMPORTED_MODULE_0__objects_database__["a" /* IObject */]();
            objectTarget.id = objectSource.id;
        }
        if (objectSource != null) {
            if (objectSource.metadata != null) {
                objectTarget.metadata = objectSource.metadata;
            }
            if (objectSource.crossReference != null) {
                objectTarget.crossReference = objectSource.crossReference;
            }
            if (objectSource.structure != null) {
                objectTarget.structure = objectSource.structure;
            }
            if (objectSource.preDef != null) {
                objectTarget.preDef = objectSource.preDef;
            }
            if (objectSource.postDef != null) {
                objectTarget.postDef = objectSource.postDef;
            }
            if (objectSource.conformanceStatements != null) {
                objectTarget.conformanceStatements = objectSource.conformanceStatements;
            }
        }
        return objectTarget;
    };
    return IndexedDbUtils;
}());
/* harmony default export */ __webpack_exports__["a"] = (IndexedDbUtils);


/***/ }),

/***/ "../../../../../src/app/service/indexed-db/indexed-db.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IndexedDbService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__objects_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/objects-database.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_dexie__ = __webpack_require__("../../../../dexie/dist/dexie.es.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ig_document_ig_document_service__ = __webpack_require__("../../../../../src/app/service/ig-document/ig-document.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__node_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/node-database.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__toc_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/toc-database.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ig_document_info_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/ig-document-info-database.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







var IndexedDbService = (function () {
    function IndexedDbService(igDocumentService) {
        this.igDocumentService = igDocumentService;
        this.igDocumentInfoDataBase = new __WEBPACK_IMPORTED_MODULE_6__ig_document_info_database__["b" /* IgDocumentInfoDatabase */]();
        this.changedObjectsDatabase = new __WEBPACK_IMPORTED_MODULE_1__objects_database__["b" /* ObjectsDatabase */]('ChangedObjectsDatabase');
        this.removedObjectsDatabase = new __WEBPACK_IMPORTED_MODULE_5__toc_database__["a" /* TocDatabase */]('RemovedObjectsDatabase');
        this.createdObjectsDatabase = new __WEBPACK_IMPORTED_MODULE_5__toc_database__["a" /* TocDatabase */]('CreatedObjectsDatabase');
        this.addedObjectsDatabase = new __WEBPACK_IMPORTED_MODULE_5__toc_database__["a" /* TocDatabase */]('AddedObjectsDatabase');
        this.nodeDatabase = new __WEBPACK_IMPORTED_MODULE_4__node_database__["b" /* NodeDatabase */]('NodeDatabase');
        this.tocDataBase = new __WEBPACK_IMPORTED_MODULE_5__toc_database__["a" /* TocDatabase */]('TocDataBase');
    }
    IndexedDbService.prototype.initializeDatabase = function (igDocumentId) {
        var _this = this;
        this.igDocumentInfoDataBase = new __WEBPACK_IMPORTED_MODULE_6__ig_document_info_database__["b" /* IgDocumentInfoDatabase */]();
        var promises = [];
        promises.push(new Promise(function (resolve, reject) {
            __WEBPACK_IMPORTED_MODULE_2_dexie__["a" /* default */].delete('IgDocumentInfoDatabase').then(function () {
                console.log('IgDocumentInfoDatabase successfully deleted');
            }).catch(function (err) {
                console.error('Could not delete IgDocumentInfoDatabase');
            }).finally(function () {
                _this.igDocumentInfoDataBase = new __WEBPACK_IMPORTED_MODULE_6__ig_document_info_database__["b" /* IgDocumentInfoDatabase */]();
                _this.igDocumentInfoDataBase.igDocument.put(new __WEBPACK_IMPORTED_MODULE_6__ig_document_info_database__["a" /* IgDocumentInfo */](igDocumentId)).then(function () {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            });
        }));
        promises.push(new Promise(function (resolve, reject) {
            __WEBPACK_IMPORTED_MODULE_2_dexie__["a" /* default */].delete('ChangedObjectsDatabase').then(function () {
                console.log('ChangedObjectsDatabase successfully deleted');
            }).catch(function (err) {
                console.error('Could not delete ChangedObjectsDatabase');
            }).finally(function () {
                _this.changedObjectsDatabase = new __WEBPACK_IMPORTED_MODULE_1__objects_database__["b" /* ObjectsDatabase */]('ChangedObjectsDatabase');
                resolve();
            });
        }));
        promises.push(new Promise(function (resolve, reject) {
            __WEBPACK_IMPORTED_MODULE_2_dexie__["a" /* default */].delete('RemovedObjectsDatabase').then(function () {
                console.log('RemovedObjectsDatabase successfully deleted');
            }).catch(function (err) {
                console.error('Could not delete RemovedObjectsDatabase');
            }).finally(function () {
                _this.removedObjectsDatabase = new __WEBPACK_IMPORTED_MODULE_5__toc_database__["a" /* TocDatabase */]('RemovedObjectsDatabase');
                resolve();
            });
        }));
        promises.push(new Promise(function (resolve, reject) {
            __WEBPACK_IMPORTED_MODULE_2_dexie__["a" /* default */].delete('CreatedObjectsDatabase').then(function () {
                console.log('CreatedObjectsDatabase successfully deleted');
            }).catch(function (err) {
                console.error('Could not delete CreatedObjectsDatabase');
            }).finally(function () {
                _this.createdObjectsDatabase = new __WEBPACK_IMPORTED_MODULE_5__toc_database__["a" /* TocDatabase */]('CreatedObjectsDatabase');
                resolve();
            });
        }));
        promises.push(new Promise(function (resolve, reject) {
            __WEBPACK_IMPORTED_MODULE_2_dexie__["a" /* default */].delete('AddedObjectsDatabase').then(function () {
                console.log('AddedObjectsDatabase successfully deleted');
            }).catch(function (err) {
                console.error('Could not delete AddedObjectsDatabase');
            }).finally(function () {
                _this.addedObjectsDatabase = new __WEBPACK_IMPORTED_MODULE_5__toc_database__["a" /* TocDatabase */]('AddedObjectsDatabase');
                resolve();
            });
        }));
        promises.push(new Promise(function (resolve, reject) {
            __WEBPACK_IMPORTED_MODULE_2_dexie__["a" /* default */].delete('NodeDatabase').then(function () {
                console.log('NodeDatabase successfully deleted');
            }).catch(function (err) {
                console.error('Could not delete NodeDatabase');
            }).finally(function () {
                _this.nodeDatabase = new __WEBPACK_IMPORTED_MODULE_4__node_database__["b" /* NodeDatabase */]('NodeDatabase');
                resolve();
            });
        }));
        promises.push(new Promise(function (resolve, reject) {
            __WEBPACK_IMPORTED_MODULE_2_dexie__["a" /* default */].delete('tocDataBase').then(function () {
                console.log('tocDataBase successfully deleted');
            }).catch(function (err) {
                console.error('Could not delete NodeDatabase');
            }).finally(function () {
                _this.tocDataBase = new __WEBPACK_IMPORTED_MODULE_5__toc_database__["a" /* TocDatabase */]('TocDataBase');
                resolve();
            });
        }));
        return Promise.all(promises);
    };
    IndexedDbService.prototype.getIgDocument = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.igDocumentInfoDataBase.igDocument.toArray().then(function (collection) {
                if (collection != null && collection.length >= 1) {
                    resolve(collection[0]);
                }
                else {
                    reject();
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    IndexedDbService.prototype.updateIgDocument = function (id, nodes) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.igDocumentInfoDataBase.igDocument.update(id, { toc: nodes }).then(function (x) {
                console.log(x);
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    IndexedDbService.prototype.initIg = function (ig) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.igDocumentInfoDataBase.igDocument.put(ig).then(function (x) {
                console.log("Putting IG ");
                console.log(x);
                resolve(ig);
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    IndexedDbService.prototype.getIgDocumentId = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.igDocumentInfoDataBase.igDocument.toArray().then(function (collection) {
                if (collection != null && collection.length >= 1) {
                    resolve(collection[0].id);
                }
                else {
                    reject();
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    IndexedDbService.prototype.persistChanges = function () {
        var _this = this;
        var changedObjects = new ChangedObjects(this.igDocumentId);
        var promises = [];
        promises.push(new Promise(function (resolve, reject) {
            console.log('Loading changed segments');
            _this.changedObjectsDatabase.transaction('rw', _this.changedObjectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = changedObjects;
                            return [4 /*yield*/, this.changedObjectsDatabase.segments.toArray()];
                        case 1:
                            _a.segments = _b.sent();
                            console.log('Changed segments successfully loaded');
                            resolve();
                            return [2 /*return*/];
                    }
                });
            }); });
        }));
        promises.push(new Promise(function (resolve, reject) {
            console.log('Loading changed datatypes');
            _this.changedObjectsDatabase.transaction('rw', _this.changedObjectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = changedObjects;
                            return [4 /*yield*/, this.changedObjectsDatabase.datatypes.toArray()];
                        case 1:
                            _a.datatypes = _b.sent();
                            console.log('Changed datatypes successfully loaded');
                            resolve();
                            return [2 /*return*/];
                    }
                });
            }); });
        }));
        promises.push(new Promise(function (resolve, reject) {
            console.log('Loading changed valuesets');
            _this.changedObjectsDatabase.transaction('rw', _this.changedObjectsDatabase.valuesets, function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = changedObjects;
                            return [4 /*yield*/, this.changedObjectsDatabase.valuesets.toArray()];
                        case 1:
                            _a.valuesets = _b.sent();
                            console.log('Changed valuesets successfully loaded');
                            resolve();
                            return [2 /*return*/];
                    }
                });
            }); });
        }));
        var doPersist = this.doPersist;
        var igDocumentService = this.igDocumentService;
        return new Promise(function (resolve, reject) {
            Promise.all(promises).then(function () {
                console.log('Persisting all changed objects (' + changedObjects.segments.length + ' segments, '
                    + changedObjects.datatypes.length + ' datatypes, ' + changedObjects.valuesets.length + ' valuesets).');
                doPersist(changedObjects, igDocumentService).then(function () {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            });
        });
    };
    IndexedDbService.prototype.doPersist = function (changedObjects, igDocumentService) {
        console.log(JSON.stringify(changedObjects));
        return igDocumentService.save(changedObjects);
    };
    IndexedDbService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__ig_document_ig_document_service__["a" /* IgDocumentService */]])
    ], IndexedDbService);
    return IndexedDbService;
}());

var ChangedObjects = (function () {
    function ChangedObjects(igDocumentId) {
        this.igDocumentId = igDocumentId;
    }
    return ChangedObjects;
}());


/***/ }),

/***/ "../../../../../src/app/service/indexed-db/node-database.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Node; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return NodeDatabase; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_dexie__ = __webpack_require__("../../../../dexie/dist/dexie.es.js");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Node = (function () {
    function Node() {
    }
    return Node;
}());

var NodeDatabase = (function (_super) {
    __extends(NodeDatabase, _super);
    function NodeDatabase(name) {
        var _this = _super.call(this, name) || this;
        _this.version(1).stores({
            datatypes: '&id',
            segments: '&id'
        });
        return _this;
    }
    return NodeDatabase;
}(__WEBPACK_IMPORTED_MODULE_0_dexie__["a" /* default */]));



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/objects-database.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IObject; });
/* unused harmony export dndObject */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Section; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ObjectsDatabase; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_dexie__ = __webpack_require__("../../../../dexie/dist/dexie.es.js");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var IObject = (function () {
    function IObject() {
    }
    return IObject;
}());

var dndObject = (function () {
    function dndObject() {
    }
    return dndObject;
}());

var Section = (function () {
    function Section() {
    }
    return Section;
}());

var ObjectsDatabase = (function (_super) {
    __extends(ObjectsDatabase, _super);
    function ObjectsDatabase(name) {
        var _this = _super.call(this, name) || this;
        _this.version(1).stores({
            datatypes: '&id',
            segments: '&id',
            sections: '&id,changeType',
            profileComponents: '&id',
            conformanceProfiles: '&id',
            compositeProfiles: '&id',
            valuesets: '&id'
        });
        return _this;
    }
    return ObjectsDatabase;
}(__WEBPACK_IMPORTED_MODULE_0_dexie__["a" /* default */]));



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/profile-components/profile-components-toc.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponentsTocService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db-utils.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var ProfileComponentsTocService = (function () {
    function ProfileComponentsTocService(indexeddbService) {
        this.indexeddbService = indexeddbService;
    }
    ProfileComponentsTocService.prototype.getProfileComponent = function (id, callback) {
        var _this = this;
        var profileComponent;
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.profileComponents, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.profileComponents.get(id)];
                        case 1:
                            profileComponent = _a.sent();
                            callback(profileComponent);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        else {
            callback(null);
        }
    };
    ProfileComponentsTocService.prototype.saveProfileComponent = function (profileComponent) {
        var _this = this;
        console.log(profileComponent);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.profileComponents, function () { return __awaiter(_this, void 0, void 0, function () {
                var savedProfileComponent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.profileComponents.get(profileComponent.id)];
                        case 1:
                            savedProfileComponent = _a.sent();
                            this.doSave(profileComponent, savedProfileComponent);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    ProfileComponentsTocService.prototype.doSave = function (profileComponent, savedProfileComponent) {
        var _this = this;
        savedProfileComponent = __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__["a" /* default */].populateIObject(profileComponent, savedProfileComponent);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.profileComponents, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.profileComponents.put(savedProfileComponent)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    ProfileComponentsTocService.prototype.bulkAdd = function (profileComponents) {
        if (this.indexeddbService.tocDataBase != null) {
            return this.indexeddbService.tocDataBase.profileComponents.bulkPut(profileComponents);
        }
    };
    ProfileComponentsTocService.prototype.bulkAddNewProfileComponents = function (profileComponents) {
        if (this.indexeddbService.addedObjectsDatabase != null) {
            return this.indexeddbService.addedObjectsDatabase.profileComponents.bulkPut(profileComponents);
        }
    };
    ProfileComponentsTocService.prototype.removeProfileComponent = function (profileComponentNode) {
        var _this = this;
        this.indexeddbService.removedObjectsDatabase.profileComponents.put(profileComponentNode).then(function () {
            _this.removeFromToc(profileComponentNode);
        }, function () {
            console.log('Unable to remove node from TOC');
        });
    };
    ProfileComponentsTocService.prototype.removeFromToc = function (profileComponentNode) {
        this.indexeddbService.tocDataBase.profileComponents.where('id').equals(profileComponentNode.id).delete();
    };
    ProfileComponentsTocService.prototype.addProfileComponent = function (profileComponentNode) {
        this.indexeddbService.addedObjectsDatabase.profileComponents.put(profileComponentNode).then(function () { }, function () {
            console.log('Unable to add node from TOC');
        });
    };
    ProfileComponentsTocService.prototype.getAll = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var promises = [];
            promises.push(_this.getAllFromToc());
            promises.push(_this.getAllFromAdded());
            Promise.all(promises).then(function (results) {
                var allNodes = new Array();
                var tocNodes = results[0];
                var addedNodes = results[1];
                if (tocNodes != null) {
                    allNodes.push(tocNodes);
                }
                if (addedNodes != null) {
                    allNodes.push(addedNodes);
                }
                resolve(allNodes);
            });
        });
        return promise;
    };
    ProfileComponentsTocService.prototype.getAllFromToc = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.tocDataBase.transaction('rw', _this.indexeddbService.tocDataBase.profileComponents, function () { return __awaiter(_this, void 0, void 0, function () {
                var profileComponents;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.profileComponents.toArray()];
                        case 1:
                            profileComponents = _a.sent();
                            resolve(profileComponents);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    ProfileComponentsTocService.prototype.getAllFromAdded = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.addedObjectsDatabase.transaction('rw', _this.indexeddbService.addedObjectsDatabase.profileComponents, function () { return __awaiter(_this, void 0, void 0, function () {
                var profileComponents;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.addedObjectsDatabase.profileComponents.toArray()];
                        case 1:
                            profileComponents = _a.sent();
                            resolve(profileComponents);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    ProfileComponentsTocService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__indexed_db_service__["a" /* IndexedDbService */]])
    ], ProfileComponentsTocService);
    return ProfileComponentsTocService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/sections/sections-indexed-db.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SectionsIndexedDbService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__objects_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/objects-database.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var SectionsIndexedDbService = (function () {
    function SectionsIndexedDbService(indexeddbService) {
        this.indexeddbService = indexeddbService;
    }
    SectionsIndexedDbService.prototype.getSection = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.transaction('r', _this.indexeddbService.changedObjectsDatabase.sections, function () { return __awaiter(_this, void 0, void 0, function () {
                    var section;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.indexeddbService.changedObjectsDatabase.sections.get(id)];
                            case 1:
                                section = _a.sent();
                                if (section != null) {
                                    resolve(section);
                                }
                                else {
                                    reject();
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                reject();
            }
        });
    };
    SectionsIndexedDbService.prototype.saveSection = function (section) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.sections.put(section).then(function () {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                reject();
            }
        });
    };
    SectionsIndexedDbService.prototype.getByChangeType = function (type) {
        return this.indexeddbService.changedObjectsDatabase.sections.where('changeType').equals(type).toArray();
    };
    SectionsIndexedDbService.prototype.updateDnD = function (id, section, dnd) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.sections.update(id, { dnd: dnd }).then(function (res) {
                    if (res) {
                        resolve();
                    }
                    else {
                        _this.saveNew(id, section, dnd, resolve, reject);
                    }
                }).catch(function (error) {
                    _this.saveNew(id, section, dnd, resolve, reject);
                });
            }
            else {
                reject();
            }
        });
    };
    SectionsIndexedDbService.prototype.updateContent = function (id, section, dnd) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.sections.update(id, { section: section }).then(function (res) {
                    if (res) {
                        resolve();
                    }
                    else {
                        _this.saveNew(id, section, dnd, resolve, reject);
                    }
                }).catch(function (error) {
                    _this.saveNew(id, section, dnd, resolve, reject);
                });
            }
            else {
                reject();
            }
        });
    };
    SectionsIndexedDbService.prototype.getAll = function () {
        return this.indexeddbService.changedObjectsDatabase.sections.toArray();
    };
    SectionsIndexedDbService.prototype.saveNew = function (id, section, dnd, resolve, reject) {
        var s = new __WEBPACK_IMPORTED_MODULE_2__objects_database__["c" /* Section */]();
        s.section = section;
        s.dnd = dnd;
        s.id = id;
        this.indexeddbService.changedObjectsDatabase.sections.put(s).then(function () {
            resolve();
        }).catch(function (error) {
            reject(error);
        });
    };
    SectionsIndexedDbService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__indexed_db_service__["a" /* IndexedDbService */]])
    ], SectionsIndexedDbService);
    return SectionsIndexedDbService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/segments/segments-indexed-db.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentsIndexedDbService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db-utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/node-database.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var SegmentsIndexedDbService = (function () {
    function SegmentsIndexedDbService(indexeddbService) {
        this.indexeddbService = indexeddbService;
    }
    SegmentsIndexedDbService.prototype.getSegment = function (id) {
        var _this = this;
        var segment;
        var promise = new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.transaction('r', _this.indexeddbService.changedObjectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.indexeddbService.changedObjectsDatabase.segments.get(id)];
                            case 1:
                                segment = _a.sent();
                                resolve(segment);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    SegmentsIndexedDbService.prototype.getAllMetaData = function () {
        var _this = this;
        var segments;
        var promise = new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.transaction('r', _this.indexeddbService.changedObjectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.indexeddbService.changedObjectsDatabase.segments.filter(function (segment) {
                                    return segment.metadata;
                                }).toArray()];
                            case 1:
                                segments = _a.sent();
                                resolve(segments);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    SegmentsIndexedDbService.prototype.getSegmentMetadata = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getSegment(id).then(function (segment) {
                if (segment.metadata) {
                    resolve(segment.metadata);
                }
                else {
                    reject();
                }
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    SegmentsIndexedDbService.prototype.getMetadataByListOfIds = function (ids) {
        var promises = [];
        for (var i = 0; i < ids.length; i++) {
            promises.push(this.getSegmentMetadata(ids[i]));
        }
        console.log(promises);
        return Promise.all(promises);
    };
    SegmentsIndexedDbService.prototype.getSegmentStructure = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getSegment(id).then(function (segment) {
                if (segment.structure)
                    resolve(segment.structure);
                else
                    reject();
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    SegmentsIndexedDbService.prototype.getSegmentCrossReference = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getSegment(id).then(function (segment) {
                if (segment.crossReference)
                    resolve(segment.crossReference);
                else
                    reject();
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    SegmentsIndexedDbService.prototype.getSegmentPostDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getSegment(id).then(function (segment) {
                if (segment.postDef)
                    resolve(segment.postDef);
                else
                    reject();
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    SegmentsIndexedDbService.prototype.getSegmentPreDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getSegment(id).then(function (segment) {
                if (segment.preDef)
                    resolve(segment.preDef);
                else
                    reject();
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    SegmentsIndexedDbService.prototype.getSegmentConformanceStatements = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getSegment(id).then(function (segment) {
                if (segment.conformanceStatements)
                    resolve(segment.conformanceStatements);
                else
                    reject();
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    SegmentsIndexedDbService.prototype.saveSegment = function (segment) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getSegment(segment.id).then(function (existingSegment) {
                console.log("existing segment");
                _this.doSave(segment, existingSegment).then(function () { resolve(); }).catch(function (error) { reject(""); });
            }).catch(function (error) {
                _this.indexeddbService.changedObjectsDatabase.segments.put(segment).then(function () {
                    resolve();
                }).catch(function (error) {
                    reject("");
                });
            });
        });
        return promise;
    };
    SegmentsIndexedDbService.prototype.saveSegmentStructureToNodeDatabase = function (id, segmentStructure) {
        var _this = this;
        if (this.indexeddbService.nodeDatabase != null) {
            this.indexeddbService.nodeDatabase.transaction('rw', this.indexeddbService.nodeDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                var segmentNode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            segmentNode = new __WEBPACK_IMPORTED_MODULE_3__node_database__["a" /* Node */]();
                            segmentNode.id = id;
                            segmentNode.structure = segmentStructure;
                            return [4 /*yield*/, this.indexeddbService.nodeDatabase.segments.put(segmentNode)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    SegmentsIndexedDbService.prototype.doSave = function (segment, savedSegment) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            savedSegment = __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__["a" /* default */].populateIObject(segment, savedSegment);
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.segments.put(savedSegment).then(function () {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    SegmentsIndexedDbService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__indexed_db_service__["a" /* IndexedDbService */]])
    ], SegmentsIndexedDbService);
    return SegmentsIndexedDbService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/segments/segments-toc.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentsTocService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db-utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var SegmentsTocService = (function () {
    function SegmentsTocService(indexeddbService) {
        this.indexeddbService = indexeddbService;
    }
    SegmentsTocService.prototype.getSegment = function (id, callback) {
        var _this = this;
        var segment;
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.segments.get(id)];
                        case 1:
                            segment = _a.sent();
                            callback(segment);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        else {
            callback(null);
        }
    };
    SegmentsTocService.prototype.saveSegment = function (segment) {
        var _this = this;
        console.log(segment);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                var savedSegment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.segments.get(segment.id)];
                        case 1:
                            savedSegment = _a.sent();
                            this.doSave(segment, savedSegment);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    SegmentsTocService.prototype.doSave = function (segment, savedSegment) {
        var _this = this;
        savedSegment = __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__["a" /* default */].populateIObject(segment, savedSegment);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.segments.put(savedSegment)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    SegmentsTocService.prototype.bulkAdd = function (segments) {
        if (this.indexeddbService.tocDataBase != null) {
            return this.indexeddbService.tocDataBase.segments.bulkPut(segments);
        }
    };
    SegmentsTocService.prototype.bulkAddNewSegments = function (segments) {
        if (this.indexeddbService.addedObjectsDatabase != null) {
            return this.indexeddbService.addedObjectsDatabase.segments.bulkPut(segments);
        }
    };
    SegmentsTocService.prototype.removeSegment = function (segmentNode) {
        var _this = this;
        this.indexeddbService.removedObjectsDatabase.segments.put(segmentNode).then(function () {
            _this.removeFromToc(segmentNode);
        }, function () {
            console.log('Unable to remove node from TOC');
        });
    };
    SegmentsTocService.prototype.removeFromToc = function (segmentNode) {
        this.indexeddbService.tocDataBase.segments.where('id').equals(segmentNode.id).delete();
    };
    SegmentsTocService.prototype.addSegment = function (segmentNode) {
        this.indexeddbService.addedObjectsDatabase.segments.put(segmentNode).then(function () { }, function () {
            console.log('Unable to add node from TOC');
        });
    };
    SegmentsTocService.prototype.getAll = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var promises = [];
            promises.push(_this.getAllFromToc());
            promises.push(_this.getAllFromAdded());
            Promise.all(promises).then(function (results) {
                var allNodes = [];
                var tocNodes = results[0];
                var addedNodes = results[1];
                if (tocNodes != null) {
                    allNodes = __WEBPACK_IMPORTED_MODULE_3_lodash__["union"](allNodes, tocNodes);
                }
                if (addedNodes != null) {
                    allNodes = __WEBPACK_IMPORTED_MODULE_3_lodash__["union"](allNodes, addedNodes);
                }
                allNodes = __WEBPACK_IMPORTED_MODULE_3_lodash__["sortBy"](allNodes, function (data) {
                    return data.data.label;
                });
                resolve(allNodes);
            });
        });
        return promise;
    };
    SegmentsTocService.prototype.getAllFromToc = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.tocDataBase.transaction('rw', _this.indexeddbService.tocDataBase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                var segments;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.segments.toArray()];
                        case 1:
                            segments = _a.sent();
                            resolve(segments);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    SegmentsTocService.prototype.getAllFromAdded = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.addedObjectsDatabase.transaction('rw', _this.indexeddbService.addedObjectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                var segments;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.addedObjectsDatabase.segments.toArray()];
                        case 1:
                            segments = _a.sent();
                            resolve(segments);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    SegmentsTocService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__indexed_db_service__["a" /* IndexedDbService */]])
    ], SegmentsTocService);
    return SegmentsTocService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/toc-database.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export TocNode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TocDatabase; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_dexie__ = __webpack_require__("../../../../dexie/dist/dexie.es.js");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Created by ena3 on 5/7/18.
 */

var TocNode = (function () {
    function TocNode() {
    }
    return TocNode;
}());

var TocDatabase = (function (_super) {
    __extends(TocDatabase, _super);
    function TocDatabase(name) {
        var _this = _super.call(this, name) || this;
        _this.version(1).stores({
            datatypes: '&id',
            segments: '&id',
            valuesets: '&id',
            conformanceProfiles: '&id',
            compositeProfiles: '&id',
            profileComponents: '&id',
        });
        return _this;
    }
    return TocDatabase;
}(__WEBPACK_IMPORTED_MODULE_0_dexie__["a" /* default */]));



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/toc-db.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TocDbService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__composite_profiles_composite_profiles_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/composite-profiles/composite-profiles-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__conformance_profiles_conformance_profiles_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/conformance-profiles/conformance-profiles-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__datatypes_datatypes_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/datatypes/datatypes-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__profile_components_profile_components_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/profile-components/profile-components-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__segments_segments_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/segments/segments-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__valuesets_valuesets_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/valuesets/valuesets-toc.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var TocDbService = (function () {
    function TocDbService(compositeProfilesTocService, conformanceProfilesTocService, datatypesTocService, profileComponentsTocService, segmentsTocService, valuesetsTocService) {
        this.compositeProfilesTocService = compositeProfilesTocService;
        this.conformanceProfilesTocService = conformanceProfilesTocService;
        this.datatypesTocService = datatypesTocService;
        this.profileComponentsTocService = profileComponentsTocService;
        this.segmentsTocService = segmentsTocService;
        this.valuesetsTocService = valuesetsTocService;
    }
    TocDbService.prototype.bulkAddToc = function (valuesets, datatypes, segments, conformanceProfiles, profileComponents, compositeProfiles) {
        var promises = [];
        if (datatypes != null) {
            promises.push(this.datatypesTocService.bulkAdd(datatypes));
        }
        if (segments != null) {
            promises.push(this.segmentsTocService.bulkAdd(segments));
        }
        if (conformanceProfiles != null) {
            promises.push(this.conformanceProfilesTocService.bulkAdd(conformanceProfiles));
        }
        if (profileComponents != null) {
            promises.push(this.profileComponentsTocService.bulkAdd(profileComponents));
        }
        if (compositeProfiles != null) {
            promises.push(this.compositeProfilesTocService.bulkAdd(compositeProfiles));
        }
        if (valuesets != null) {
            promises.push(this.valuesetsTocService.bulkAdd(valuesets));
        }
        return Promise.all(promises);
    };
    TocDbService.prototype.bulkAddTocNewElements = function (valuesets, datatypes, segments, conformanceProfiles, profileComponents, compositeProfiles) {
        var promises = [];
        if (datatypes != null) {
            promises.push(this.datatypesTocService.bulkAddNewDatatypes(datatypes));
        }
        if (segments != null) {
            promises.push(this.segmentsTocService.bulkAddNewSegments(segments));
        }
        if (conformanceProfiles != null) {
            promises.push(this.conformanceProfilesTocService.bulkAddNewConformanceProfiles(conformanceProfiles));
        }
        if (profileComponents != null) {
            promises.push(this.profileComponentsTocService.bulkAddNewProfileComponents(profileComponents));
        }
        if (compositeProfiles != null) {
            promises.push(this.compositeProfilesTocService.bulkAddNewCompositeProfiles(compositeProfiles));
        }
        if (valuesets != null) {
            promises.push(this.valuesetsTocService.bulkAddNewValuesets(valuesets));
        }
        return Promise.all(promises);
    };
    TocDbService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__composite_profiles_composite_profiles_toc_service__["a" /* CompositeProfilesTocService */],
            __WEBPACK_IMPORTED_MODULE_2__conformance_profiles_conformance_profiles_toc_service__["a" /* ConformanceProfilesTocService */],
            __WEBPACK_IMPORTED_MODULE_3__datatypes_datatypes_toc_service__["a" /* DatatypesTocService */],
            __WEBPACK_IMPORTED_MODULE_4__profile_components_profile_components_toc_service__["a" /* ProfileComponentsTocService */],
            __WEBPACK_IMPORTED_MODULE_5__segments_segments_toc_service__["a" /* SegmentsTocService */],
            __WEBPACK_IMPORTED_MODULE_6__valuesets_valuesets_toc_service__["a" /* ValuesetsTocService */]])
    ], TocDbService);
    return TocDbService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/valuesets/valuesets-indexed-db.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValuesetsIndexedDbService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db-utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/node-database.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var ValuesetsIndexedDbService = (function () {
    function ValuesetsIndexedDbService(indexeddbService) {
        this.indexeddbService = indexeddbService;
    }
    ValuesetsIndexedDbService.prototype.getValueset = function (id) {
        var _this = this;
        var valueset;
        var promise = new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.transaction('r', _this.indexeddbService.changedObjectsDatabase.valuesets, function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.indexeddbService.changedObjectsDatabase.valuesets.get(id)];
                            case 1:
                                valueset = _a.sent();
                                resolve(valueset);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    ValuesetsIndexedDbService.prototype.getAllMetaData = function () {
        var _this = this;
        var valuesets;
        var promise = new Promise(function (resolve, reject) {
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.transaction('r', _this.indexeddbService.changedObjectsDatabase.valuesets, function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.indexeddbService.changedObjectsDatabase.valuesets.filter(function (valueset) {
                                    return valueset.metadata;
                                }).toArray()];
                            case 1:
                                valuesets = _a.sent();
                                resolve(valuesets);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    ValuesetsIndexedDbService.prototype.getValuesetMetadata = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getValueset(id).then(function (valueset) {
                resolve(valueset.metadata);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ValuesetsIndexedDbService.prototype.getMetadataByListOfIds = function (ids) {
        var promises = [];
        for (var i = 0; i < ids.length; i++) {
            promises.push(this.getValuesetMetadata(ids[i]));
        }
        return Promise.all(promises);
    };
    ValuesetsIndexedDbService.prototype.getValuesetStructure = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getValueset(id).then(function (valueset) {
                resolve(valueset.structure);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ValuesetsIndexedDbService.prototype.getValuesetCrossReference = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getValueset(id).then(function (valueset) {
                resolve(valueset.crossReference);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ValuesetsIndexedDbService.prototype.getValuesetPostDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getValueset(id).then(function (valueset) {
                resolve(valueset.postDef);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ValuesetsIndexedDbService.prototype.getValuesetPreDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getValueset(id).then(function (valueset) {
                resolve(valueset.preDef);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ValuesetsIndexedDbService.prototype.getValuesetConformanceStatements = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getValueset(id).then(function (valueset) {
                resolve(valueset.conformanceStatements);
            }).catch(function () {
                reject();
            });
        });
        return promise;
    };
    ValuesetsIndexedDbService.prototype.saveValueset = function (valueset) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.getValueset(valueset.id).then(function (existingValueset) {
                _this.doSave(valueset, existingValueset);
            });
        });
        return promise;
    };
    ValuesetsIndexedDbService.prototype.saveValuesetStructureToNodeDatabase = function (id, valuesetStructure) {
        var _this = this;
        if (this.indexeddbService.nodeDatabase != null) {
            this.indexeddbService.nodeDatabase.transaction('rw', this.indexeddbService.nodeDatabase.valuesets, function () { return __awaiter(_this, void 0, void 0, function () {
                var valuesetNode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            valuesetNode = new __WEBPACK_IMPORTED_MODULE_3__node_database__["a" /* Node */]();
                            valuesetNode.id = id;
                            valuesetNode.structure = valuesetStructure;
                            return [4 /*yield*/, this.indexeddbService.nodeDatabase.valuesets.put(valuesetNode)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    ValuesetsIndexedDbService.prototype.doSave = function (valueset, savedValueset) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            savedValueset = __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__["a" /* default */].populateIObject(valueset, savedValueset);
            if (_this.indexeddbService.changedObjectsDatabase != null) {
                _this.indexeddbService.changedObjectsDatabase.valuesets.put(savedValueset).then(function () {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                reject();
            }
        });
        return promise;
    };
    ValuesetsIndexedDbService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__indexed_db_service__["a" /* IndexedDbService */]])
    ], ValuesetsIndexedDbService);
    return ValuesetsIndexedDbService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/valuesets/valuesets-toc.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValuesetsTocService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db-utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var ValuesetsTocService = (function () {
    function ValuesetsTocService(indexeddbService) {
        this.indexeddbService = indexeddbService;
    }
    ValuesetsTocService.prototype.getValueset = function (id, callback) {
        var _this = this;
        var valueset;
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.valuesets, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.valuesets.get(id)];
                        case 1:
                            valueset = _a.sent();
                            callback(valueset);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        else {
            callback(null);
        }
    };
    ValuesetsTocService.prototype.saveValueset = function (valueset) {
        var _this = this;
        console.log(valueset);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.valuesets, function () { return __awaiter(_this, void 0, void 0, function () {
                var savedValueset;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.valuesets.get(valueset.id)];
                        case 1:
                            savedValueset = _a.sent();
                            this.doSave(valueset, savedValueset);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    ValuesetsTocService.prototype.doSave = function (valueset, savedValueset) {
        var _this = this;
        savedValueset = __WEBPACK_IMPORTED_MODULE_2__indexed_db_utils__["a" /* default */].populateIObject(valueset, savedValueset);
        if (this.indexeddbService.tocDataBase != null) {
            this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.valuesets, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.valuesets.put(savedValueset)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    ValuesetsTocService.prototype.bulkAdd = function (valuesets) {
        if (this.indexeddbService.tocDataBase != null) {
            return this.indexeddbService.tocDataBase.valuesets.bulkPut(valuesets);
        }
    };
    ValuesetsTocService.prototype.bulkAddNewValuesets = function (valuesets) {
        if (this.indexeddbService.addedObjectsDatabase != null) {
            return this.indexeddbService.addedObjectsDatabase.valuesets.bulkPut(valuesets);
        }
    };
    ValuesetsTocService.prototype.removeValueset = function (valuesetNode) {
        var _this = this;
        this.indexeddbService.removedObjectsDatabase.valuesets.put(valuesetNode).then(function () {
            _this.removeFromToc(valuesetNode);
        }, function () {
            console.log('Unable to remove node from TOC');
        });
    };
    ValuesetsTocService.prototype.removeFromToc = function (valuesetNode) {
        this.indexeddbService.tocDataBase.valuesets.where('id').equals(valuesetNode.id).delete();
    };
    ValuesetsTocService.prototype.addValueset = function (valuesetNode) {
        this.indexeddbService.addedObjectsDatabase.valuesets.put(valuesetNode).then(function () { }, function () {
            console.log('Unable to add node from TOC');
        });
    };
    ValuesetsTocService.prototype.getAll = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var promises = [];
            promises.push(_this.getAllFromToc());
            promises.push(_this.getAllFromAdded());
            Promise.all(promises).then(function (results) {
                var allNodes = [];
                var tocNodes = results[0];
                var addedNodes = results[1];
                if (tocNodes != null) {
                    allNodes = __WEBPACK_IMPORTED_MODULE_3_lodash__["union"](allNodes, tocNodes);
                }
                if (addedNodes != null) {
                    allNodes = __WEBPACK_IMPORTED_MODULE_3_lodash__["union"](allNodes, addedNodes);
                }
                allNodes = __WEBPACK_IMPORTED_MODULE_3_lodash__["sortBy"](allNodes, function (data) {
                    return data.data.label;
                });
                resolve(allNodes);
            });
        });
        return promise;
    };
    ValuesetsTocService.prototype.getAllFromToc = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.tocDataBase.transaction('rw', _this.indexeddbService.tocDataBase.valuesets, function () { return __awaiter(_this, void 0, void 0, function () {
                var valuesets;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.tocDataBase.valuesets.toArray()];
                        case 1:
                            valuesets = _a.sent();
                            resolve(valuesets);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    ValuesetsTocService.prototype.getAllFromAdded = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.indexeddbService.addedObjectsDatabase.transaction('rw', _this.indexeddbService.addedObjectsDatabase.valuesets, function () { return __awaiter(_this, void 0, void 0, function () {
                var valuesets;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.indexeddbService.addedObjectsDatabase.valuesets.toArray()];
                        case 1:
                            valuesets = _a.sent();
                            resolve(valuesets);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return promise;
    };
    ValuesetsTocService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__indexed_db_service__["a" /* IndexedDbService */]])
    ], ValuesetsTocService);
    return ValuesetsTocService;
}());



/***/ }),

/***/ "../../../../../src/app/service/sections/sections.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SectionsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_sections_sections_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/sections/sections-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SectionsService = (function () {
    function SectionsService(http, indexedDbService, sectionsIndexedDbService) {
        this.http = http;
        this.indexedDbService = indexedDbService;
        this.sectionsIndexedDbService = sectionsIndexedDbService;
    }
    SectionsService.prototype.getSection = function (sectionId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.sectionsIndexedDbService.getSection(sectionId).then(function (section) {
                console.log("section");
                console.log(section);
                resolve(section.section);
            }).catch(function () {
                _this.indexedDbService.getIgDocumentId().then(function (igDocumentId) {
                    _this.http.get('api/igdocuments/' + igDocumentId + '/section/' + sectionId).subscribe(function (serverSection) {
                        resolve(serverSection);
                    }, function (error) {
                        reject(error);
                    });
                }).catch(function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    SectionsService.prototype.saveSection = function (section) {
        return this.sectionsIndexedDbService.saveSection(section);
    };
    SectionsService.prototype.getAllSections = function (section) {
        return this.sectionsIndexedDbService.getAll();
    };
    SectionsService.prototype.updateContent = function (id, section, dnd) {
        return this.sectionsIndexedDbService.updateContent(id, section, dnd);
    };
    SectionsService.prototype.updateDnD = function (id, section, dnd) {
        return this.sectionsIndexedDbService.updateDnD(id, section, dnd);
    };
    SectionsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__indexed_db_indexed_db_service__["a" /* IndexedDbService */],
            __WEBPACK_IMPORTED_MODULE_2__indexed_db_sections_sections_indexed_db_service__["a" /* SectionsIndexedDbService */]])
    ], SectionsService);
    return SectionsService;
}());



/***/ }),

/***/ "../../../../../src/app/service/segments/segments.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexed_db_segments_segments_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/segments/segments-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/objects-database.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SegmentsService = (function () {
    function SegmentsService(http, segmentsIndexedDbService) {
        this.http = http;
        this.segmentsIndexedDbService = segmentsIndexedDbService;
    }
    SegmentsService.prototype.getSegmentMetadata = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.segmentsIndexedDbService.getSegmentMetadata(id).then(function (metadata) {
                resolve(metadata);
            }).catch(function () {
                _this.http.get('api/segments/' + id + '/metadata').subscribe(function (serverSegmentMetadata) {
                    resolve(serverSegmentMetadata);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    SegmentsService.prototype.getSegmentStructure = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.segmentsIndexedDbService.getSegmentStructure(id).then(function (structure) {
                resolve(structure);
            }).catch(function () {
                _this.http.get('api/segments/' + id + '/structure').subscribe(function (serverSegmentStructure) {
                    resolve(serverSegmentStructure);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    SegmentsService.prototype.getSegmentCrossReference = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.segmentsIndexedDbService.getSegmentCrossReference(id).then(function (crossReference) {
                resolve(crossReference);
            }).catch(function () {
                _this.http.get('api/segments/' + id + '/crossReference').subscribe(function (serverSegmentCrossReference) {
                    resolve(serverSegmentCrossReference);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    SegmentsService.prototype.getSegmentPostDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.segmentsIndexedDbService.getSegmentPostDef(id).then(function (postDef) {
                resolve(postDef);
            }).catch(function () {
                _this.http.get('api/segments/' + id + '/postdef').subscribe(function (serverSegmentPostDef) {
                    resolve(serverSegmentPostDef);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    SegmentsService.prototype.getSegmentPreDef = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.segmentsIndexedDbService.getSegmentPreDef(id).then(function (preDef) {
                resolve(preDef);
            }).catch(function () {
                _this.http.get('api/segments/' + id + '/predef').subscribe(function (serverSegmentPreDef) {
                    resolve(serverSegmentPreDef);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    SegmentsService.prototype.getSegmentConformanceStatements = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.segmentsIndexedDbService.getSegmentConformanceStatements(id).then(function (conformanceStatement) {
                resolve(conformanceStatement);
            }).catch(function () {
                _this.http.get('api/segments/' + id + '/conformancestatement').subscribe(function (serverSegmentConformanceStatement) {
                    resolve(serverSegmentConformanceStatement);
                }, function (error) {
                    reject(error);
                });
            });
        });
        return promise;
    };
    SegmentsService.prototype.saveSegmentMetadata = function (id, metadata) {
        var segment = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        segment.id = id;
        segment.metadata = metadata;
        return this.segmentsIndexedDbService.saveSegment(segment);
    };
    SegmentsService.prototype.saveSegmentStructure = function (id, structure) {
        var segment = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        segment.id = id;
        segment.structure = structure;
        return this.segmentsIndexedDbService.saveSegment(segment);
    };
    SegmentsService.prototype.saveSegmentPreDef = function (id, preDef) {
        var segment = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        segment.id = id;
        segment.preDef = preDef;
        return this.segmentsIndexedDbService.saveSegment(segment);
    };
    SegmentsService.prototype.saveSegmentPostDef = function (id, postDef) {
        var segment = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        segment.id = id;
        segment.postDef = postDef;
        return this.segmentsIndexedDbService.saveSegment(segment);
    };
    SegmentsService.prototype.saveSegmentCrossReferences = function (id, crossReference) {
        var segment = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        segment.id = id;
        segment.crossReference = crossReference;
        return this.segmentsIndexedDbService.saveSegment(segment);
    };
    SegmentsService.prototype.saveSegmentConformanceStatements = function (id, conformanceStatements) {
        var segment = new __WEBPACK_IMPORTED_MODULE_3__indexed_db_objects_database__["a" /* IObject */]();
        segment.id = id;
        segment.conformanceStatements = conformanceStatements;
        return this.segmentsIndexedDbService.saveSegment(segment);
    };
    SegmentsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__indexed_db_segments_segments_indexed_db_service__["a" /* SegmentsIndexedDbService */]])
    ], SegmentsService);
    return SegmentsService;
}());



/***/ }),

/***/ "../../../../../src/app/service/userService/user.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by ena3 on 3/5/18.
 */


var UserService = (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.getAll = function () {
        return this.http.get('api/users');
    };
    UserService.prototype.getById = function (id) {
        return this.http.get('api/users/' + id);
    };
    UserService.prototype.create = function (user) {
        return this.http.post('api/register', user, { observe: 'response' });
    };
    UserService.prototype.update = function (user) {
        return this.http.put('api/users/' + user.id, user);
    };
    UserService.prototype.delete = function (id) {
        return this.http.delete('api/users/' + id);
    };
    UserService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "../../../../../src/app/service/workspace/workspace.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Entity */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkspaceService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm5/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ts_md5_dist_md5__ = __webpack_require__("../../../../ts-md5/dist/md5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ts_md5_dist_md5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ts_md5_dist_md5__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Created by hnt5 on 10/25/17.
 */

var Entity = (function () {
    function Entity() {
    }
    Entity.IG = "IG";
    Entity.SEGMENT = "SEGMENT";
    Entity.DATATYPE = "DATATYPE";
    Entity.CURRENTNODE = "CurrentNode";
    return Entity;
}());

var WorkspaceService = (function () {
    function WorkspaceService() {
        this.map = {};
    }
    WorkspaceService.prototype.setAppConstant = function (obj) {
        this.appConstant = obj;
    };
    WorkspaceService.prototype.getAppConstant = function () {
        return this.appConstant;
    };
    WorkspaceService.prototype.getCurrent = function (key) {
        return this.map[key];
    };
    WorkspaceService.prototype.getAppInfo = function () {
        return this.appInfo;
    };
    WorkspaceService.prototype.setAppInfo = function (info) {
        this.appInfo = info;
    };
    WorkspaceService.prototype.setCurrent = function (key, obj) {
        var str = JSON.stringify(obj);
        this.currentHash = __WEBPACK_IMPORTED_MODULE_2_ts_md5_dist_md5__["Md5"].hashStr(str);
        if (this.map[key]) {
            this.map[key].next(obj);
        }
        else {
            var elm = new __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](obj);
            this.map[key] = elm;
        }
    };
    WorkspaceService.prototype.getPreviousHash = function () {
        console.log(this.currentHash);
        return this.currentHash;
    };
    WorkspaceService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], WorkspaceService);
    return WorkspaceService;
}());



/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map