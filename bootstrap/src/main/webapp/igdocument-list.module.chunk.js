webpackJsonp(["igdocument-list.module"],{

/***/ "../../../../../src/app/igdocuments/igdocument-list/all-igs/all-igs.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"igamt-tabContents3\">\n\n  <div class=\"content-title\">\n    <div>\n      <span class=\"feature-title\">All IG Documents List</span>\n    </div>\n  </div>\n\n  <li>\n    <a href=\"#\" [routerLink]=\"['/igDocuments']\">Select IG</a>\n  </li>\n\n</div>"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/all-igs/all-igs.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AllIgsComponent; });
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

var AllIgsComponent = (function () {
    function AllIgsComponent() {
    }
    AllIgsComponent.prototype.ngOnInit = function () {
    };
    AllIgsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/all-igs/all-igs.component.html")
        }),
        __metadata("design:paramtypes", [])
    ], AllIgsComponent);
    return AllIgsComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/igdocument-list-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentListRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__igdocument_list_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/igdocument-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__my_igs_my_igs_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/my-igs/my-igs.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__preloaded_igs_preloaded_igs_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/preloaded-igs/preloaded-igs.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_igs_shared_igs_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/shared-igs/shared-igs.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__all_igs_all_igs_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/all-igs/all-igs.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var IgDocumentListRoutingModule = (function () {
    function IgDocumentListRoutingModule() {
    }
    IgDocumentListRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"].forChild([
                    {
                        path: '',
                        component: __WEBPACK_IMPORTED_MODULE_2__igdocument_list_component__["a" /* IgDocumentListComponent */],
                        children: [
                            {
                                path: '',
                                children: [
                                    { path: 'my-igs', component: __WEBPACK_IMPORTED_MODULE_3__my_igs_my_igs_component__["a" /* MyIgsComponent */] },
                                    { path: 'preloaded-igs', component: __WEBPACK_IMPORTED_MODULE_4__preloaded_igs_preloaded_igs_component__["a" /* PreloadedIgsComponent */] },
                                    { path: 'shared-igs', component: __WEBPACK_IMPORTED_MODULE_5__shared_igs_shared_igs_component__["a" /* SharedIgsComponent */] },
                                    { path: 'all-igs', component: __WEBPACK_IMPORTED_MODULE_6__all_igs_all_igs_component__["a" /* AllIgsComponent */] },
                                    { path: '', component: __WEBPACK_IMPORTED_MODULE_3__my_igs_my_igs_component__["a" /* MyIgsComponent */] }
                                ]
                            }
                        ]
                    }
                ])
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"]
            ]
        })
    ], IgDocumentListRoutingModule);
    return IgDocumentListRoutingModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/igdocument-list.component.html":
/***/ (function(module, exports) {

module.exports = "<!--<div class=\"igamt-tabHeader2\">-->\n    <!--&lt;!&ndash;<div>&ndash;&gt;-->\n        <!--&lt;!&ndash;<p-tabMenu [model]=\"igDocumentsListTabMenu\"></p-tabMenu>&ndash;&gt;-->\n    <!--&lt;!&ndash;</div>&ndash;&gt;-->\n<!--</div>-->\n\n<router-outlet></router-outlet>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/igdocument-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentListComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var IgDocumentListComponent = (function () {
    function IgDocumentListComponent() {
    }
    IgDocumentListComponent.prototype.ngOnInit = function () {
        this.igDocumentsListTabMenu = [
            { label: 'My IG Documents', icon: 'fa-file-text-o', routerLink: './my-igs' },
            { label: 'Preloaded IG Documents', icon: 'fa-file-text-o', routerLink: './preloaded-igs' },
            { label: 'Shared IG Documents', icon: 'fa-file-text-o', routerLink: './shared-igs' },
            { label: 'All IG Documents', icon: 'fa-file-text-o', routerLink: './all-igs' }
        ];
    };
    IgDocumentListComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/igdocument-list.component.html")
        })
    ], IgDocumentListComponent);
    return IgDocumentListComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/igdocument-list.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IgDocumentListModule", function() { return IgDocumentListModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__igdocument_list_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/igdocument-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__my_igs_my_igs_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/my-igs/my-igs.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__preloaded_igs_preloaded_igs_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/preloaded-igs/preloaded-igs.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_igs_shared_igs_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/shared-igs/shared-igs.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__all_igs_all_igs_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/all-igs/all-igs.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__igdocument_list_routing_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/igdocument-list-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_material__ = __webpack_require__("../../../material/esm5/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_material_list__ = __webpack_require__("../../../material/esm5/list.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_material_icon__ = __webpack_require__("../../../material/esm5/icon.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__igdocument_list_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/igdocument-list.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















var IgDocumentListModule = (function () {
    function IgDocumentListModule() {
    }
    IgDocumentListModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_7__igdocument_list_routing_module__["a" /* IgDocumentListRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_8_primeng_primeng__["TabMenuModule"],
                __WEBPACK_IMPORTED_MODULE_8_primeng_primeng__["OrderListModule"], __WEBPACK_IMPORTED_MODULE_8_primeng_primeng__["PickListModule"],
                __WEBPACK_IMPORTED_MODULE_9__angular_material__["a" /* MatButtonModule */], __WEBPACK_IMPORTED_MODULE_10__angular_material_list__["a" /* MatListModule */], __WEBPACK_IMPORTED_MODULE_11__angular_material_icon__["a" /* MatIconModule */]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__igdocument_list_component__["a" /* IgDocumentListComponent */], __WEBPACK_IMPORTED_MODULE_3__my_igs_my_igs_component__["a" /* MyIgsComponent */], __WEBPACK_IMPORTED_MODULE_4__preloaded_igs_preloaded_igs_component__["a" /* PreloadedIgsComponent */], __WEBPACK_IMPORTED_MODULE_5__shared_igs_shared_igs_component__["a" /* SharedIgsComponent */], __WEBPACK_IMPORTED_MODULE_6__all_igs_all_igs_component__["a" /* AllIgsComponent */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_12__igdocument_list_service__["a" /* IgListService */]]
        })
    ], IgDocumentListModule);
    return IgDocumentListModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/igdocument-list.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgListService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/**
 * Created by ena3 on 12/6/17.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var IgListService = (function () {
    function IgListService(http) {
        this.http = http;
    }
    IgListService.prototype.getListByType = function (type) {
        return this.http.get('api/igdocuments/list/' + type);
    };
    IgListService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]])
    ], IgListService);
    return IgListService;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/my-igs/my-igs.component.html":
/***/ (function(module, exports) {

module.exports = "<div style=\"align:center; width:90%;\nmargin-left:200px;\nmargin-right:auto;margin-top: 30px\">\n\n<p-orderList [value]=\"igs\"  [responsive]=\"true\" header=\"User IG Document\" styleClass=\"list-ig\"\n             filter=\"filter\" filterBy=\"metaData.title\" filterPlaceholder=\"  Filter by title\" dragdrop=\"true\" dragdropScope=\"igdocument\">\n  <ng-template let-ig pTemplate=\"item\">\n    <div style=\"height: 100px;\">\n    <div routerLink=\"{{'/ig-documents/igdocuments-edit/'+ig.id}}\" [queryParams]=\"{ readOnly: false }\"><a>{{ig.metaData.title}} </a></div>\n\n    <button  style=\"float: right\" (click)=\"open(ig,false)\" class=\"btn btn-sm btn-warning\">Edit</button>\n    <button   style=\"float: right\" (click)=\"open(ig,true)\" pButton type=\"button\" class=\"btn btn-sm btn-primary\">Read</button>\n      <button pButton type=\"button\" class=\"ui-button-info\"></button>\n\n    </div>\n  </ng-template>\n</p-orderList>\n</div>\n\n\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/my-igs/my-igs.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyIgsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__igdocument_list_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/igdocument-list.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MyIgsComponent = (function () {
    function MyIgsComponent(listService, router) {
        var _this = this;
        this.listService = listService;
        this.router = router;
        listService.getListByType("USER").subscribe(function (res) {
            _this.igs = res;
        });
    }
    MyIgsComponent.prototype.ngOnInit = function () {
    };
    MyIgsComponent.prototype.open = function (ig, readnly) {
        this.router.navigate(['/ig-documents/igdocuments-edit/' + ig.id], { queryParams: { readOnly: "true" } });
    };
    MyIgsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/my-igs/my-igs.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__igdocument_list_service__["a" /* IgListService */], __WEBPACK_IMPORTED_MODULE_2__angular_router__["Router"]])
    ], MyIgsComponent);
    return MyIgsComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/preloaded-igs/preloaded-igs.component.html":
/***/ (function(module, exports) {

module.exports = "<p-orderList [value]=\"igs\" [listStyle]=\"{'height':'250px'}\" [responsive]=\"true\" header=\"IG Document\" styleClass=\"list-ig\"\n             filter=\"filter\" filterBy=\"metaData.title\" filterPlaceholder=\"Filter by title\" dragdrop=\"true\" dragdropScope=\"igdocument\">\n  <ng-template let-ig pTemplate=\"item\">\n    <div routerLink=\"{{'/ig-documents/igdocuments-edit/'+ig.id}}\"><a>{{ig.metaData.title}}</a></div>\n  </ng-template>\n</p-orderList>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/preloaded-igs/preloaded-igs.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PreloadedIgsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__igdocument_list_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/igdocument-list.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PreloadedIgsComponent = (function () {
    function PreloadedIgsComponent(listService) {
        var _this = this;
        this.listService = listService;
        listService.getListByType("PRELOADED").subscribe(function (res) {
            return _this.igs = res;
        });
    }
    PreloadedIgsComponent.prototype.ngOnInit = function () {
        // this.listService.getListByType("PRELOADED").then( res =>
        //   this.igs= res);
    };
    PreloadedIgsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/preloaded-igs/preloaded-igs.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__igdocument_list_service__["a" /* IgListService */]])
    ], PreloadedIgsComponent);
    return PreloadedIgsComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/shared-igs/shared-igs.component.html":
/***/ (function(module, exports) {

module.exports = "<p-orderList [value]=\"igs\" [listStyle]=\"{'height':'250px'}\" [responsive]=\"true\" header=\"IG Document\" styleClass=\"list-ig\"\n             filter=\"filter\" filterBy=\"metaData.title\" filterPlaceholder=\"Filter by title\" dragdrop=\"true\" dragdropScope=\"igdocument\">\n  <ng-template let-ig pTemplate=\"item\">\n    <div routerLink=\"{{'/ig-documents/igdocuments-edit/'+ig.id}}\"><a>{{ig.metaData.title}}</a></div>\n  </ng-template>\n</p-orderList>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/shared-igs/shared-igs.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SharedIgsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__igdocument_list_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/igdocument-list.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SharedIgsComponent = (function () {
    function SharedIgsComponent(listService) {
        this.listService = listService;
    }
    SharedIgsComponent.prototype.ngOnInit = function () {
        // this.listService.getListByType("SHARED").then( res =>
        //   this.igs= res);
    };
    SharedIgsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/shared-igs/shared-igs.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__igdocument_list_service__["a" /* IgListService */]])
    ], SharedIgsComponent);
    return SharedIgsComponent;
}());



/***/ })

});
//# sourceMappingURL=igdocument-list.module.chunk.js.map