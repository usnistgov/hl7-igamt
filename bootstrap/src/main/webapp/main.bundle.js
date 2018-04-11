webpackJsonp(["main"],{

/***/ "../../../../../src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./configuration/configuration.module": [
		"../../../../../src/app/configuration/configuration.module.ts",
		"configuration.module"
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
		"igdocument-create.module"
	],
	"./igdocument-edit/igdocument-edit.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.module.ts",
		"igdocument-edit.module",
		"common"
	],
	"./igdocument-list/igdocument-list.module": [
		"../../../../../src/app/igdocuments/igdocument-list/igdocument-list.module.ts",
		"igdocument-list.module"
	],
	"./igdocuments/igdocument.module": [
		"../../../../../src/app/igdocuments/igdocument.module.ts",
		"igdocument.module"
	],
	"./search/search.module": [
		"../../../../../src/app/search/search.module.ts",
		"search.module"
	],
	"./segment-definition/segment-definition.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-definition.module.ts",
		"segment-definition.module",
		"common"
	],
	"./segment-edit/segment-edit.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.module.ts",
		"common",
		"segment-edit.module"
	],
	"./segment-metadata/segment-metadata.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata.module.ts",
		"segment-metadata.module"
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

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"layout-wrapper\" (click)=\"onLayoutClick()\"\n     [ngClass]=\"{'layout-horizontal': isHorizontal(),\n                 'layout-overlay': isOverlay(),\n                 'layout-static': isStatic(),\n                 'layout-slim':isSlim(),\n                 'layout-static-inactive': staticMenuDesktopInactive,\n                 'layout-mobile-active': staticMenuMobileActive,\n                 'layout-overlay-active':overlayMenuActive}\">\n\n    <app-topbar></app-topbar>\n    <div class=\"layout-menu-container\" (click)=\"onMenuClick($event)\">\n        <p-scrollPanel #layoutMenuScroller [style]=\"{height: '100%'}\">\n            <div class=\"layout-menu-content\">\n                <div class=\"layout-menu-title\">MENU</div>\n                <app-menu [reset]=\"resetMenu\"></app-menu>\n                <div class=\"layout-menu-footer\">\n                    <div class=\"layout-menu-footer-title\">TASKS</div>\n\n                    <div class=\"layout-menu-footer-content\">\n                        <p-progressBar [value]=\"50\" [showValue]=\"false\"></p-progressBar>\n                        Today\n\n                        <p-progressBar [value]=\"80\" [showValue]=\"false\"></p-progressBar>\n                        Overall\n                    </div>\n                </div>\n            </div>\n        </p-scrollPanel>\n    </div>\n\n    <div class=\"layout-content\">\n\n\n        <div class=\"layout-content-container\">\n          <router-outlet></router-outlet>\n        </div>\n\n        <app-footer></app-footer>\n        <div class=\"layout-mask\" *ngIf=\"staticMenuMobileActive\"></div>\n    </div>\n</div>\n"

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
    function AppComponent() {
        this.darkTheme = false;
        //menuMode = 'static';
        this.menuMode = 'horizontal';
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
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('layoutMenuScroller'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_primeng_primeng__["ScrollPanel"])
    ], AppComponent.prototype, "layoutMenuScrollerViewChild", void 0);
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__("../../../../../src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../src/app/app.component.scss")]
        })
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
            template: "\n      <div class=\"layout-footer\">\n        <div class=\"clearfix\">\n          <span class=\"footer-text-left\">PrimeNG Apollo</span>\n          <span class=\"footer-text-right\">All Rights Reserved</span>\n        </div>\n      </div>\n    "
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
            template: "\n        <ul app-submenu [item]=\"model\" root=\"true\" class=\"layout-menu\" [reset]=\"reset\" visible=\"true\"></ul>\n    "
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__service_datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__service_valueSets_valueSets_service__ = __webpack_require__("../../../../../src/app/service/valueSets/valueSets.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__app_routes__ = __webpack_require__("../../../../../src/app/app.routes.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__app_topbar_component__ = __webpack_require__("../../../../../src/app/app.topbar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__app_footer_component__ = __webpack_require__("../../../../../src/app/app.footer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__service_profilecomponents_profilecomponents_service__ = __webpack_require__("../../../../../src/app/service/profilecomponents/profilecomponents.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__login_auth_service__ = __webpack_require__("../../../../../src/app/login/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__login_auth_guard_service__ = __webpack_require__("../../../../../src/app/login/auth-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__requestInterceptor__ = __webpack_require__("../../../../../src/app/requestInterceptor.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__service_userService_user_service__ = __webpack_require__("../../../../../src/app/service/userService/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__home_home_component__ = __webpack_require__("../../../../../src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__about_about_component__ = __webpack_require__("../../../../../src/app/about/about.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__common_404_404_component__ = __webpack_require__("../../../../../src/app/common/404/404.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__login_login_component__ = __webpack_require__("../../../../../src/app/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__register_register_component__ = __webpack_require__("../../../../../src/app/register/register.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




































































































var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_10__angular_platform_browser__["BrowserModule"],
                __WEBPACK_IMPORTED_MODULE_11__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_19__app_routes__["a" /* AppRoutes */],
                __WEBPACK_IMPORTED_MODULE_27__angular_common_http__["c" /* HttpClientModule */],
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
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["TreeModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_primeng__["TreeTableModule"],
                __WEBPACK_IMPORTED_MODULE_13__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_11__angular_forms__["ReactiveFormsModule"],
                __WEBPACK_IMPORTED_MODULE_2_ngx_bootstrap__["a" /* AlertModule */].forRoot()
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_9__app_menu_component__["a" /* AppMenuComponent */],
                __WEBPACK_IMPORTED_MODULE_9__app_menu_component__["b" /* AppSubMenuComponent */],
                __WEBPACK_IMPORTED_MODULE_20__app_topbar_component__["a" /* AppTopBarComponent */],
                __WEBPACK_IMPORTED_MODULE_21__app_footer_component__["a" /* AppFooterComponent */],
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_30__home_home_component__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_31__about_about_component__["a" /* AboutComponent */],
                __WEBPACK_IMPORTED_MODULE_14__documentation_documentation_component__["a" /* DocumentationComponent */],
                __WEBPACK_IMPORTED_MODULE_9__app_menu_component__["a" /* AppMenuComponent */],
                __WEBPACK_IMPORTED_MODULE_20__app_topbar_component__["a" /* AppTopBarComponent */],
                __WEBPACK_IMPORTED_MODULE_21__app_footer_component__["a" /* AppFooterComponent */],
                __WEBPACK_IMPORTED_MODULE_32__common_404_404_component__["a" /* NotFoundComponent */],
                __WEBPACK_IMPORTED_MODULE_33__login_login_component__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_34__register_register_component__["a" /* RegisterComponent */],
                __WEBPACK_IMPORTED_MODULE_14__documentation_documentation_component__["a" /* DocumentationComponent */]
            ], providers: [
                { provide: __WEBPACK_IMPORTED_MODULE_13__angular_common__["LocationStrategy"], useClass: __WEBPACK_IMPORTED_MODULE_13__angular_common__["HashLocationStrategy"] },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_27__angular_common_http__["a" /* HTTP_INTERCEPTORS */],
                    useClass: __WEBPACK_IMPORTED_MODULE_28__requestInterceptor__["a" /* TokenInterceptor */],
                    multi: true
                },
                __WEBPACK_IMPORTED_MODULE_15__service_workspace_workspace_service__["b" /* WorkspaceService */],
                __WEBPACK_IMPORTED_MODULE_22__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */],
                __WEBPACK_IMPORTED_MODULE_16__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */],
                __WEBPACK_IMPORTED_MODULE_17__service_datatypes_datatypes_service__["a" /* DatatypesService */],
                __WEBPACK_IMPORTED_MODULE_18__service_valueSets_valueSets_service__["a" /* ValueSetsService */],
                __WEBPACK_IMPORTED_MODULE_23__service_segments_segments_service__["a" /* SegmentsService */],
                __WEBPACK_IMPORTED_MODULE_24__service_profilecomponents_profilecomponents_service__["a" /* ProfileComponentsService */],
                __WEBPACK_IMPORTED_MODULE_25__login_auth_service__["a" /* AuthService */],
                __WEBPACK_IMPORTED_MODULE_26__login_auth_guard_service__["a" /* AuthGuard */],
                __WEBPACK_IMPORTED_MODULE_29__service_userService_user_service__["a" /* UserService */]
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

module.exports = "<div class=\"topbar clearfix\">\n\n    <img class=\"logo\" alt=\"apollo-layout\" src=\"assets/layout/images/apollo_logo.png\" />\n    <a id=\"menu-button\" href=\"#\" (click)=\"app.onMenuButtonClick($event)\">\n        <i class=\"fa fa-align-left\"></i>\n    </a>\n\n    <a href=\"#\" class=\"profile\" (click)=\"app.onTopbarMenuButtonClick($event)\">\n        <span class=\"username\">Sarah Miller</span>\n        <img src=\"assets/layout/images/avatar/avatar.png\" alt=\"apollo-layout\" />\n        <i class=\"fa fa-angle-down\"></i>\n    </a>\n\n    <!--<span class=\"topbar-search\">-->\n        <!--<input type=\"text\" pInputText placeholder=\"Search\"/>-->\n        <!--<span class=\"fa fa-search\"></span>-->\n    <!--</span>-->\n\n    <!--<span class=\"topbar-themeswitcher\">-->\n        <!--<p-inputSwitch [(ngModel)]=\"app.darkTheme\" (onChange)=\"themeChange($event)\"></p-inputSwitch>-->\n    <!--</span>-->\n\n    <ul class=\"topbar-menu fadeInDown\" [ngClass]=\"{'topbar-menu-visible': app.topbarMenuActive}\">\n        <li #profile [ngClass]=\"{'menuitem-active':app.activeTopbarItem === profile}\" (click)=\"app.onTopbarItemClick($event, profile)\">\n            <a href=\"#\">\n                <i class=\"topbar-icon fa fa-fw fa-user\"></i>\n                <span class=\"topbar-item-name\">Profile</span>\n            </a>\n            <ul>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                        <i class=\"fa fa-fw fa-user\"></i>\n                        <span>Profile</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                        <i class=\"fa fa-fw fa-user-secret\"></i>\n                        <span>Privacy</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                        <i class=\"fa fa-fw fa-cog\"></i>\n                        <span>Settings</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-sign-out\"></i>\n                      <span>Logout</span>\n                    </a>\n                </li>\n            </ul>\n        </li>\n        <li #settings [ngClass]=\"{'menuitem-active':app.activeTopbarItem === settings}\" (click)=\"app.onTopbarItemClick($event, settings)\">\n            <a href=\"#\">\n                <i class=\"topbar-icon fa fa-fw fa-cog\"></i>\n                <span class=\"topbar-item-name\">Settings</span>\n            </a>\n            <ul>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-paint-brush\"></i>\n                      <span>Change Theme</span>\n                      <span class=\"topbar-badge\">1</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-star-o\"></i>\n                      <span>Favorites</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                        <i class=\"fa fa-fw fa-lock\"></i>\n                        <span>Lock Screen</span>\n                        <span class=\"topbar-badge\">3</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-picture-o\"></i>\n                      <span>Wallpaper</span>\n                    </a>\n                </li>\n          </ul>\n        </li>\n        <li #messages [ngClass]=\"{'menuitem-active':app.activeTopbarItem === messages}\" (click)=\"app.onTopbarItemClick($event, messages)\">\n            <a href=\"#\">\n                <i class=\"topbar-icon fa fa-fw fa-envelope-o\"></i>\n                <span class=\"topbar-item-name\">Messages</span>\n                <span class=\"topbar-badge\">5</span>\n            </a>\n            <ul>\n                <li role=\"menuitem\">\n                  <a href=\"#\" class=\"topbar-message\">\n                    <img src=\"assets/layout/images/avatar/avatar1.png\" alt=\"avatar1\" style=\"width: 35px;\"/>\n                    <span>Give me a call</span>\n                  </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\" class=\"topbar-message\">\n                      <img src=\"assets/layout/images/avatar/avatar2.png\" alt=\"avatar2\" style=\"width: 35px;\"/>\n                      <span>Reports attached</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\" class=\"topbar-message\">\n                      <img src=\"assets/layout/images/avatar/avatar3.png\" alt=\"avatar3\" style=\"width: 35px;\"/>\n                      <span>About your invoice</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\" class=\"topbar-message\">\n                      <img src=\"assets/layout/images/avatar/avatar2.png\" alt=\"avatar2\" style=\"width: 35px;\"/>\n                      <span>Meeting today</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\" class=\"topbar-message\">\n                      <img src=\"assets/layout/images/avatar/avatar4.png\" alt=\"avatar4\" style=\"width: 35px;\"/>\n                      <span>Out of office</span>\n                    </a>\n                </li>\n            </ul>\n        </li>\n        <li #notifications [ngClass]=\"{'menuitem-active':app.activeTopbarItem === notifications}\" (click)=\"app.onTopbarItemClick($event, notifications)\">\n            <a href=\"#\">\n                <i class=\"topbar-icon fa fa-fw fa-bell-o\"></i>\n                <span class=\"topbar-item-name\">Notifications</span>\n                <span class=\"topbar-badge\">2</span>\n            </a>\n            <ul>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-tasks\"></i>\n                      <span>Pending tasks</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-calendar-check-o\"></i>\n                      <span>Meeting today</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-download\"></i>\n                      <span>Download</span>\n                    </a>\n                </li>\n                <li role=\"menuitem\">\n                    <a href=\"#\">\n                      <i class=\"fa fa-fw fa-plane\"></i>\n                      <span>Book flight</span>\n                    </a>\n                </li>\n            </ul>\n        </li>\n    </ul>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/app.topbar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppTopBarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
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
    function AppTopBarComponent(app) {
        this.app = app;
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
    AppTopBarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-topbar',
            template: __webpack_require__("../../../../../src/app/app.topbar.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__app_component__["a" /* AppComponent */]])
    ], AppTopBarComponent);
    return AppTopBarComponent;
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DocumentationComponent = (function () {
    function DocumentationComponent(indexedDbService) {
        this.indexedDbService = indexedDbService;
    }
    DocumentationComponent.prototype.ngOnInit = function () {
    };
    DocumentationComponent.prototype.getDatatype = function (datatypeId) {
        this.indexedDbService.getDatatype(datatypeId, function (datatype) {
            // console.log('datatype 579654555455fa34e848dcf7: ' + datatype.label);
            this.datatype = datatype;
        }.bind(this));
        this.indexedDbService.getDatatypeMetadata(datatypeId, function (datatypeMetadata) {
            // console.log('datatype 579654555455fa34e848dcf7: ' + datatype.label);
            this.datatypeMetadata = datatypeMetadata;
        }.bind(this));
    };
    DocumentationComponent.prototype.saveDatatype = function (datatype) {
        this.indexedDbService.saveDatatype(datatype);
    };
    DocumentationComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/documentation/documentation.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */]])
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_of__ = __webpack_require__("../../../../rxjs/_esm5/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_do__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/do.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_delay__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/delay.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs__);
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
        this.isLoggedIn = new __WEBPACK_IMPORTED_MODULE_5_rxjs__["BehaviorSubject"](false);
    }
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        console.log(username);
        // const httpOptions = {
        //   headers: new HttpHeaders({
        //     'Content-Type':  'application/json'
        //   }),
        // {observe:'response'}
        // };
        this.http.post('/login', { username: username, password: password }, { observe: 'response' }).subscribe(function (data) {
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
    AuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__angular_common_http__["b" /* HttpClient */]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "../../../../../src/app/login/login.component.html":
/***/ (function(module, exports) {

module.exports = "<!--<div fxLayout=\"row\"  fxLayoutAlign=\"center\">-->\n\n<!--<div fxFlex=\"50\" class=\"card container-fluid\" >-->\n  <!--<h4 class=\"card-title\"> Sign in </h4>-->\n      <!--<form name=\"form\" #f=\"ngForm\" novalidate>-->\n        <!--<div class=\"form-group\" [ngClass]=\"{ 'has-error': f.submitted && !username.valid }\">-->\n          <!--<input type=\"text\" class=\"form-control\" name=\"username\" [(ngModel)]=\"username\" required placeholder=\"username\" />-->\n          <!--<div *ngIf=\"f.submitted && !username.valid\" class=\"help-block\">Username is required</div>-->\n        <!--</div>-->\n        <!--<div class=\"form-group\" [ngClass]=\"{ 'has-error': f.submitted && !password.valid }\">-->\n          <!--<input type=\"password\" class=\"form-control\" name=\"password\" [(ngModel)]=\"password\" required placeholder=\"password\" />-->\n          <!--<div *ngIf=\"f.submitted && !password.valid\" class=\"help-block\">Password is required</div>-->\n        <!--</div>-->\n        <!--<div class=\"form-group\">-->\n          <!--<button [disabled]=\"loading\" class=\"btn btn-primary\" (click)=\"login()\">Login</button>-->\n          <!--<a [routerLink]=\"['/register']\" class=\"btn btn-link\">Register</a>-->\n        <!--</div>-->\n      <!--</form>-->\n<!--</div>-->\n<!--</div>-->\n\n<div class=\"body-container\">\n  <div class=\"ui-g\">\n    <div class=\"ui-g-12\">\n      <div class=\"login-wrapper\">\n        <div class=\"card\">\n          <h3 class=\"title\">Sign In</h3>\n          <form name=\"form\" #f=\"ngForm\" novalidate>\n\n          <div class=\"ui-g ui-fluid\">\n            <div class=\"ui-g-12\">\n              <input type=\"text\" autocomplete=\"off\" placeholder=\"Username\" name=\"username\" [(ngModel)]=\"username\" class=\"ui-inputtext ui-widget\" required/>\n            </div>\n            <div class=\"ui-g-12\">\n              <input type=\"password\" autocomplete=\"off\" placeholder=\"Password\"  name=\"password\" class=\"ui-inputtext ui-widget\"  [(ngModel)]=\"password\" required />\n            </div>\n            <div class=\"ui-g-6\">\n              <button type=\"button\" class=\"ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only blue-btn\" (click)=\"login()\" [disabled]=\"!f.valid\">\n                                  <span class=\"ui-button-text ui-c\">\n                                    <img src=\"../assets/layout/images/check.svg\" alt=\"login\" style=\"height: 13px;width: 16px;float: left;margin-top: 3px\">\n                                    Login\n                                  </span>\n              </button>\n            </div>\n            <div class=\"ui-g-6 password-container\">\n              <a [routerLink]=\"['/register']\">New User?</a>\n            </div>\n          </div>\n          </form>\n        </div>\n\n      </div>\n    </div>\n  </div>\n</div>\n"

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
        request = request.clone({});
        return next.handle(request);
    };
    TokenInterceptor = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], TokenInterceptor);
    return TokenInterceptor;
}());



/***/ }),

/***/ "../../../../../src/app/service/datatypes/datatypes.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
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
    function DatatypesService(http) {
        this.http = http;
    }
    DatatypesService.prototype.getDatatypes = function (libId, callback) {
        this.http.get('api/datatype-library/' + libId + '/datatypes').map(function (res) { return res.json(); }).subscribe(function (data) {
            callback(data);
        });
    };
    DatatypesService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], DatatypesService);
    return DatatypesService;
}());



/***/ }),

/***/ "../../../../../src/app/service/general-configuration/general-configuration.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GeneralConfigurationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
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
    function GeneralConfigurationService(http) {
        this.http = http;
        //TODO GETTING USAGES FROM API
        this._usages = [{ label: 'R', value: 'R' }, { label: 'RE', value: 'RE' }, { label: 'C', value: 'C' }, { label: 'X', value: 'O' }];
        this._valueSetAllowedDTs = ["ID", "IS", "CE", "CF", "CWE", "CNE", "CSU", "HD"];
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
    GeneralConfigurationService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], GeneralConfigurationService);
    return GeneralConfigurationService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/indexed-db.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IndexedDbService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__objects_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/objects-database.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__valueSets_valueSets_service__ = __webpack_require__("../../../../../src/app/service/valueSets/valueSets.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__profilecomponents_profilecomponents_service__ = __webpack_require__("../../../../../src/app/service/profilecomponents/profilecomponents.service.ts");
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
    function IndexedDbService(datatypesService, valueSetsService, segmentsService, profileComponentsService) {
        this.datatypesService = datatypesService;
        this.valueSetsService = valueSetsService;
        this.segmentsService = segmentsService;
        this.profileComponentsService = profileComponentsService;
        this.objectsDatabase = new __WEBPACK_IMPORTED_MODULE_1__objects_database__["a" /* ObjectsDatabase */]('ObjectsDatabase');
        this.changedObjectsDatabase = new __WEBPACK_IMPORTED_MODULE_1__objects_database__["a" /* ObjectsDatabase */]('ChangedObjectsDatabase');
    }
    IndexedDbService.prototype.init = function (ig) {
        var _this = this;
        this.objectsDatabase.transaction('rw', this.objectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.objectsDatabase.datatypes.clear().then(this.injectDatatypes(ig.profile.datatypeLibrary.id));
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.changedObjectsDatabase.datatypes.clear();
                return [2 /*return*/];
            });
        }); });
        // valueSets
        this.objectsDatabase.transaction('rw', this.objectsDatabase.valueSets, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.objectsDatabase.valueSets.clear().then(this.injectValueSets(ig.profile.tableLibrary.id));
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.valueSets, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.changedObjectsDatabase.valueSets.clear();
                return [2 /*return*/];
            });
        }); });
        // segments
        this.objectsDatabase.transaction('rw', this.objectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.objectsDatabase.segments.clear().then(this.injectSegments(ig.profile.segmentLibrary.id));
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.changedObjectsDatabase.segments.clear();
                return [2 /*return*/];
            });
        }); });
        // sections
        this.objectsDatabase.transaction('rw', this.objectsDatabase.sections, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.sections, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
        // profileComponents
        this.objectsDatabase.transaction('rw', this.objectsDatabase.profileComponents, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.objectsDatabase.profileComponents.clear().then(this.injectProfileComponents(ig.profile.profileComponentLibrary.id));
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.profileComponents, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
        // profiles
        this.objectsDatabase.transaction('rw', this.objectsDatabase.profiles, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.profiles, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
    };
    /*
    .filter(function (fullDatatype) {
          const metadataDatatype = {
            'label': fullDatatype.label,
            'hl7Version': fullDatatype.hl7Version
          }
          return metadataDatatype;
        });
     */
    IndexedDbService.prototype.getDatatype = function (id, callback) {
        var _this = this;
        var datatype;
        this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedObjectsDatabase.datatypes.get(id)];
                    case 1:
                        datatype = _a.sent();
                        if (datatype != null) {
                            callback(datatype.object);
                        }
                        else {
                            this.objectsDatabase.transaction('r', this.objectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.objectsDatabase.datatypes.get(id)];
                                        case 1:
                                            datatype = _a.sent();
                                            callback(datatype.object);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    IndexedDbService.prototype.getValueSet = function (id, callback) {
        var _this = this;
        var valueSet;
        this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valueSets, function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedObjectsDatabase.valueSets.get(id)];
                    case 1:
                        valueSet = _a.sent();
                        if (valueSet != null) {
                            callback(valueSet.object);
                        }
                        else {
                            this.objectsDatabase.transaction('r', this.objectsDatabase.valueSets, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.objectsDatabase.valueSets.get(id)];
                                        case 1:
                                            valueSet = _a.sent();
                                            callback(valueSet.object);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    IndexedDbService.prototype.getSegment = function (id, callback) {
        var _this = this;
        var segment;
        this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedObjectsDatabase.segments.get(id)];
                    case 1:
                        segment = _a.sent();
                        if (segment != null) {
                            callback(segment.object);
                        }
                        else {
                            this.objectsDatabase.transaction('r', this.objectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.objectsDatabase.segments.get(id)];
                                        case 1:
                                            segment = _a.sent();
                                            callback(segment.object);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    IndexedDbService.prototype.getDatatypeMetadata = function (id, callback) {
        this.getDatatype(id, function (datatype) {
            var metadataDatatype = {
                'id': datatype.id,
                'name': datatype.name,
                'ext': datatype.ext,
                'label': datatype.label,
                'scope': datatype.scope,
                'publicationVersion': datatype.publicationVersion,
                'hl7Version': datatype.hl7Version,
                'hl7Versions': datatype.hl7Versions,
                'numberOfComponents': datatype.components.length,
                'type': datatype.type
            };
            callback(metadataDatatype);
        });
    };
    IndexedDbService.prototype.getSegmentMetadata = function (id, callback) {
        this.getSegment(id, function (segment) {
            var metadataSegment = {
                'id': segment.id,
                'name': segment.name,
                'scope': segment.scope,
                'hl7Version': segment.hl7Version,
                'numberOfFields': segment.fields.length,
                'type': segment.type
            };
            callback(metadataSegment);
        });
    };
    IndexedDbService.prototype.getValueSetMetadata = function (id, callback) {
        this.getValueSet(id, function (valueSet) {
            var metadataValueSet = {
                'id': valueSet.id,
                'bindingIdentifier': valueSet.bindingIdentifier,
                'scope': valueSet.scope,
                'hl7Version': valueSet.hl7Version,
                'type': valueSet.type
            };
            callback(metadataValueSet);
        });
    };
    IndexedDbService.prototype.injectDatatypes = function (libId) {
        this.datatypesService.getDatatypes(libId, this.populateDatatypes.bind(this));
    };
    IndexedDbService.prototype.injectValueSets = function (libID) {
        this.valueSetsService.getValueSets(libID, this.populateValueSets.bind(this));
    };
    IndexedDbService.prototype.injectSegments = function (libId) {
        this.segmentsService.getSegments(libId, this.populateSegments.bind(this));
    };
    IndexedDbService.prototype.injectProfileComponents = function (libID) {
        this.profileComponentsService.getProfileComponents(libID, this.populateProfileComponents.bind(this));
    };
    IndexedDbService.prototype.populateDatatypes = function (datatypes) {
        var _this = this;
        datatypes.forEach(function (datatype) {
            _this.objectsDatabase.transaction('rw', _this.objectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.objectsDatabase.datatypes.put({
                                'id': datatype.id,
                                'object': datatype
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    ;
    IndexedDbService.prototype.populateValueSets = function (valueSets) {
        var _this = this;
        valueSets.forEach(function (valueSet) {
            _this.objectsDatabase.transaction('rw', _this.objectsDatabase.valueSets, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.objectsDatabase.valueSets.put({
                                'id': valueSet.id,
                                'object': valueSet
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    ;
    IndexedDbService.prototype.populateSegments = function (segments) {
        var _this = this;
        segments.forEach(function (segment) {
            _this.objectsDatabase.transaction('rw', _this.objectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.objectsDatabase.segments.put({
                                'id': segment.id,
                                'object': segment
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    ;
    IndexedDbService.prototype.populateProfileComponents = function (profileComponents) {
        var _this = this;
        profileComponents.forEach(function (pc) {
            _this.objectsDatabase.transaction('rw', _this.objectsDatabase.profileComponents, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.objectsDatabase.profileComponents.put({
                                'id': pc.id,
                                'object': pc
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    ;
    IndexedDbService.prototype.saveDatatype = function (datatype) {
        var _this = this;
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedObjectsDatabase.datatypes.put({
                            'id': datatype.id,
                            'object': datatype
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    IndexedDbService.prototype.saveSegment = function (segment) {
        var _this = this;
        console.log(segment);
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedObjectsDatabase.segments.put({
                            'id': segment.id,
                            'object': segment
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    IndexedDbService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__datatypes_datatypes_service__["a" /* DatatypesService */], __WEBPACK_IMPORTED_MODULE_3__valueSets_valueSets_service__["a" /* ValueSetsService */], __WEBPACK_IMPORTED_MODULE_4__segments_segments_service__["a" /* SegmentsService */], __WEBPACK_IMPORTED_MODULE_5__profilecomponents_profilecomponents_service__["a" /* ProfileComponentsService */]])
    ], IndexedDbService);
    return IndexedDbService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/objects-database.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ObjectsDatabase; });
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

/*
export interface IDatatype {
  id?: string;
  datatype?: object;
}
export interface IValueSet {
  id?: string;
  valueSet?: object;
}
export interface ISegment {
  id?: string;
  segment?: object;
}
export interface ISection {
  id?: string;
  section?: object;
}
export interface IProfileComponent {
  id?: string;
  profileComponent?: object;
}
export interface IProfile {
  id?: string;
  profile?: object;
}
*/
var ObjectsDatabase = (function (_super) {
    __extends(ObjectsDatabase, _super);
    function ObjectsDatabase(name) {
        var _this = _super.call(this, name) || this;
        _this.version(1).stores({
            datatypes: '++id,object',
            segments: '++id,object',
            sections: '++id,object',
            profileComponents: '++id,object',
            profiles: '++id,object',
            valueSets: '++id,object'
        });
        return _this;
    }
    return ObjectsDatabase;
}(__WEBPACK_IMPORTED_MODULE_0_dexie__["a" /* default */]));



/***/ }),

/***/ "../../../../../src/app/service/profilecomponents/profilecomponents.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponentsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ProfileComponentsService = (function () {
    function ProfileComponentsService(http) {
        this.http = http;
    }
    ProfileComponentsService.prototype.getProfileComponents = function (libId, callback) {
        this.http.get('api/profilecomponent-library/' + libId + '/profilecomponents').map(function (res) { return res.json(); }).subscribe(function (data) {
            callback(data);
        });
    };
    ProfileComponentsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], ProfileComponentsService);
    return ProfileComponentsService;
}());



/***/ }),

/***/ "../../../../../src/app/service/segments/segments.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
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
    function SegmentsService(http) {
        this.http = http;
    }
    SegmentsService.prototype.getSegments = function (libId, callback) {
        this.http.get('api/segment-library/' + libId + '/segments').map(function (res) { return res.json(); }).subscribe(function (data) {
            callback(data);
        });
    };
    SegmentsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
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
        return this.http.get('/api/users');
    };
    UserService.prototype.getById = function (id) {
        return this.http.get('/api/users/' + id);
    };
    UserService.prototype.create = function (user) {
        return this.http.post('/register', user, { observe: 'response' });
    };
    UserService.prototype.update = function (user) {
        return this.http.put('/api/users/' + user.id, user);
    };
    UserService.prototype.delete = function (id) {
        return this.http.delete('/api/users/' + id);
    };
    UserService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "../../../../../src/app/service/valueSets/valueSets.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValueSetsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ValueSetsService = (function () {
    function ValueSetsService(http) {
        this.http = http;
    }
    ValueSetsService.prototype.getValueSets = function (libId, callback) {
        this.http.get('api/table-library/' + libId + '/tables').map(function (res) { return res.json(); }).subscribe(function (data) {
            callback(data);
        });
    };
    ValueSetsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], ValueSetsService);
    return ValueSetsService;
}());



/***/ }),

/***/ "../../../../../src/app/service/workspace/workspace.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Entity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return WorkspaceService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm5/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5__ = __webpack_require__("../../../../ts-md5/dist/md5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5__);
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
    function WorkspaceService(http) {
        this.http = http;
        this.map = {};
    }
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
        this.currentHash = __WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5__["Md5"].hashStr(str);
        if (this.map[key]) {
            this.map[key].next(obj);
        }
        else {
            var elm = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](obj);
            this.map[key] = elm;
        }
    };
    WorkspaceService.prototype.getPreviousHash = function () {
        console.log(this.currentHash);
        return this.currentHash;
    };
    WorkspaceService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
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