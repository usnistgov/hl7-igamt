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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__my_igs_my_igs_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/my-igs/my-igs.resolver.ts");
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
                                    { path: 'my-igs', component: __WEBPACK_IMPORTED_MODULE_3__my_igs_my_igs_component__["a" /* MyIgsComponent */],
                                        resolve: {
                                            myIgs: __WEBPACK_IMPORTED_MODULE_7__my_igs_my_igs_resolver__["a" /* MyIGsresolver */]
                                        }
                                    },
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__igdocument_list_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/igdocument-list.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__igdocument_list_my_igs_my_igs_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/my-igs/my-igs.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_primeng_dataview__ = __webpack_require__("../../../../primeng/dataview.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_primeng_dataview___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_primeng_dataview__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_primeng_dropdown__ = __webpack_require__("../../../../primeng/dropdown.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_primeng_dropdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_primeng_dropdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_primeng_inputtext__ = __webpack_require__("../../../../primeng/inputtext.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_primeng_inputtext___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_primeng_inputtext__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_primeng_button__ = __webpack_require__("../../../../primeng/button.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_primeng_button___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_primeng_button__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











// import { MatButtonModule } from '@angular/material';
// import {MatListModule} from '@angular/material/list';
//
// import {MatIconModule} from '@angular/material/icon';







var IgDocumentListModule = (function () {
    function IgDocumentListModule() {
    }
    IgDocumentListModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_15_primeng_button__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_7__igdocument_list_routing_module__["a" /* IgDocumentListRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_8_primeng_primeng__["TabMenuModule"],
                __WEBPACK_IMPORTED_MODULE_8_primeng_primeng__["OrderListModule"], __WEBPACK_IMPORTED_MODULE_8_primeng_primeng__["PickListModule"],
                __WEBPACK_IMPORTED_MODULE_13_primeng_dropdown__["DropdownModule"],
                __WEBPACK_IMPORTED_MODULE_9__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_14_primeng_inputtext__["InputTextModule"],
                // MatButtonModule,MatListModule,MatIconModule
                __WEBPACK_IMPORTED_MODULE_12_primeng_dataview__["DataViewModule"]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__igdocument_list_component__["a" /* IgDocumentListComponent */], __WEBPACK_IMPORTED_MODULE_3__my_igs_my_igs_component__["a" /* MyIgsComponent */], __WEBPACK_IMPORTED_MODULE_4__preloaded_igs_preloaded_igs_component__["a" /* PreloadedIgsComponent */], __WEBPACK_IMPORTED_MODULE_5__shared_igs_shared_igs_component__["a" /* SharedIgsComponent */], __WEBPACK_IMPORTED_MODULE_6__all_igs_all_igs_component__["a" /* AllIgsComponent */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_10__igdocument_list_service__["a" /* IgListService */], __WEBPACK_IMPORTED_MODULE_11__igdocument_list_my_igs_my_igs_resolver__["a" /* MyIGsresolver */]]
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
    IgListService.prototype.getMyIGs = function () {
        return this.http.get("api/igdocuments");
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

module.exports = "<div class=\"list-ig\" >\n\n\n  <p-dataView [value]=\"igs\" [paginator]=\"true\"  paginatorPosition=\"both\" [rows]=\"8\" [sortField]=\"sortField\" [sortOrder]=\"sortOrder\" [filterBy]=\"'title,subtitle,username'\" #dv >\n    <p-header>\n\n      <p-dropdown [options]=\"sortOptions\" [(ngModel)]=\"sortKey\" placeholder=\"Sort By\"\n                  (onChange)=\"onSortChange($event)\" [autoWidth]=\"false\" [style]=\"{'min-width':'15em','vertical-align' : 'top',    'margin-bottom': '-60px !important' }\"></p-dropdown>\n\n      <input type=\"search\" pInputText placeholder=\"Filter\" (keyup)=\"dv.filter($event.target.value)\" style=\"float: right\" >\n\n    </p-header>\n  <ng-template let-ig pTemplate=\"listItem\">\n\n    <div class=\"ui-g\" class=\"ig-list-border\">\n      <div class=\"ui-g ui-g-9 ui-g-nopad\">\n        <div class=\"ig-list-image-container\">\n          <img *ngIf=\"ig.coverpage!=null\"src={{ig.coverpage}}  class=\"ig-list-image\">\n          <img *ngIf=\"ig.coverpage==null\"  src=\"assets/layout/images/404.png\"  class=\"ig-list-image\" >\n        </div>\n        <div class=\"ui-g-11\">\n          <div>\n            <span class=\"ig-list-title\" (click)=\"open(ig,false)\">{{ig.title}} </span>\n\n          </div>\n          <span *ngIf=\"ig.dateUpdated\" class=\"ig-list-date\">\n            <i class=\"fa fa-calendar\"></i> Date Updated:{{ig.dateUpdated|date }}\n          </span>\n          <span *ngIf=\"ig.username\" class=\"ig-list-user\">\n            ,<i class=\"fa fa-user\"></i> Author:  {{ig.username}},\n          </span>\n          <span class=\"ig-list-date\">\n\n            <a (click)=\"toggleMoreInfo(ig.id)\" style=\"text-decoration: underline; cursor: pointer\"> More details...</a>\n\n          </span>\n\n\n\n          <div  *ngIf=\"moreInfoMap[ig.id.id]==true\">\n            <div>\n              <span class=\"ig-list-more-info-title\"> Conformane Profiles:</span>\n              <span class=\"badge ig-list-cp-badge\" *ngFor=\"let cp of ig.conformanceProfiles\"> {{cp}}</span>\n            </div>\n\n          </div>\n\n        </div>\n\n      </div>\n      <div class=\"ui-g-3\">\n        <div style=\"float: right\">\n        <p-button styleClass=\"indigo-btn\" (click)=\"open(ig,false)\" label=\"Edit\" icon=\"fa fa-pencil\" iconPos=\"left\"></p-button>\n        <p-button styleClass=\"ui-button-secondary\" (click)=\"open(ig,true)\" label=\"Read\" icon=\"fa fa-eye\" iconPos=\"left\"></p-button>\n        <p-button styleClass=\"purple-btn\" label=\"Copy\" icon=\"fa fa-copy\" iconPos=\"left\"></p-button>\n        <p-button styleClass=\"red-btn\"  label=\"Delete\" icon=\"fa fa-remove\" iconPos=\"left\"></p-button>\n        </div>\n      </div>\n    </div>\n\n  </ng-template>\n\n</p-dataView>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/my-igs/my-igs.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyIgsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
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
    function MyIgsComponent(activeRoute, router) {
        var _this = this;
        this.activeRoute = activeRoute;
        this.router = router;
        this.moreInfoMap = {};
        this.activeRoute.data.map(function (data) { return data.myIgs; }).subscribe(function (x) {
            _this.igs = x;
            _this.sortOptions = [
                { label: 'Newest First', value: '!dateUpdated' },
                { label: 'Oldest First', value: 'dateUpdated' },
                { label: 'Title', value: 'title' }
            ];
        });
    }
    MyIgsComponent.prototype.ngOnInit = function () {
        // this.igs=[{"title":"testing","position":0,"coverpage":null,"subtitle":null,"dateUpdated":1498143086873,"id":{"id":"58a7197c84ae67528dafbb8e","version":1},"confrmanceProfiles":null,"username":"wakili"},{"title":"MESSAGING GUIDE FOR SYNDROMIC SURVEILLANCE: EMERGENCY  DEPARTMENT, URGENT CARE, INPATIENT, AND AMBULATORY CARE SETTINGS- Copy- Copy- Copy","position":0,"coverpage":"https://hl7v2.igamt.nist.gov/igamt/api/uploaded_files/file?name=8c88df56-e1bd-4790-bfe2-d08413885691.png","subtitle":"ADT MESSAGES A01, A03, A04, and A08, with Optional ORU^R01 Message Notation for Laboratory Data  ~  Release 2.2 w/ ERRATUM Content and NIST Clarification Content","dateUpdated":1517325828397,"id":{"id":"5a708e0484ae8dd4a7ea94a2","version":1},"confrmanceProfiles":null,"username":null},{"title":"scscss","position":0,"coverpage":null,"subtitle":null,"dateUpdated":1507643726880,"id":{"id":"5879129784ae09eee0fb6bd1","version":1},"confrmanceProfiles":null,"username":null},{"title":"Mock- Copysss","position":0,"coverpage":null,"subtitle":"mock","dateUpdated":1520615985553,"id":{"id":"5a564a8084aee590a9f35fb7","version":1},"confrmanceProfiles":null,"username":null},{"title":"test","position":0,"coverpage":null,"subtitle":null,"dateUpdated":1506522413787,"id":{"id":"587e3a3b84aee2edcf835b6b","version":1},"confrmanceProfiles":null,"username":null},{"title":"Mock","position":0,"coverpage":null,"subtitle":"mock","dateUpdated":1517516698985,"id":{"id":"5a203e2984ae98b394159cb2","version":1},"confrmanceProfiles":null,"username":null},{"title":"cccsscs","position":0,"coverpage":null,"subtitle":"scscsc","dateUpdated":1514923736721,"id":{"id":"5a43c0e084ae939e4e90a719","version":1},"confrmanceProfiles":null,"username":null},{"title":"IMPLEMENTATION GUIDE FOR SYNDROMIC SURVEILLANCE- Copy","position":0,"coverpage":"https://hl7v2.igamt.nist.gov/igamt/api/uploaded_files/file?name=8c88df56-e1bd-4790-bfe2-d08413885691.png","subtitle":"Release 0.94","dateUpdated":1517425486319,"id":{"id":"5a720db684ae06ddc1f45343","version":1},"confrmanceProfiles":null,"username":null},{"title":"AAAAAAAAAAA","position":0,"coverpage":null,"subtitle":"bbbb","dateUpdated":1521480964808,"id":{"id":"5aaff12884ae5da45060ff35","version":1},"confrmanceProfiles":null,"username":null},{"title":"VXU V04 Implementation Guide","position":0,"coverpage":null,"subtitle":"NIST","dateUpdated":1513740856855,"id":{"id":"5810bd7884ae36ea378a59eb","version":1},"confrmanceProfiles":null,"username":null},{"title":"qwswsw","position":0,"coverpage":null,"subtitle":"wwsw","dateUpdated":1514923740715,"id":{"id":"5a468d0284ae939e4ea18456","version":1},"confrmanceProfiles":null,"username":null},{"title":"scscss- Copy","position":0,"coverpage":null,"subtitle":null,"dateUpdated":1507652558864,"id":{"id":"59949a9884ae63028106d148","version":1},"confrmanceProfiles":null,"username":null},{"title":"IZ Profiles- Copy","position":0,"coverpage":null,"subtitle":"","dateUpdated":1508853393329,"id":{"id":"59949aad84ae63028106f4fe","version":1},"confrmanceProfiles":null,"username":null},{"title":"TEST- Copy","position":0,"coverpage":null,"subtitle":"TT","dateUpdated":1519321275778,"id":{"id":"5a8f00bb84aecfd8dba5a7d3","version":1},"confrmanceProfiles":null,"username":null},{"title":"IZ Profiles- Copy","position":0,"coverpage":null,"subtitle":"","dateUpdated":1511801827997,"id":{"id":"5994a93b84aee1277f13e1d9","version":1},"confrmanceProfiles":null,"username":null},{"title":"IZ Profiles- Copy","position":0,"coverpage":null,"subtitle":"","dateUpdated":1519161135991,"id":{"id":"58f4f26484ae24658e5f2ec3","version":1},"confrmanceProfiles":null,"username":null},{"title":"ORU","position":0,"coverpage":null,"subtitle":"eeee","dateUpdated":1502903224966,"id":{"id":"596e33fa84ae537cf9eb43c6","version":1},"confrmanceProfiles":null,"username":null},{"title":"IZ Profiles","position":0,"coverpage":null,"subtitle":"","dateUpdated":1484333770696,"id":{"id":"58791a8984aec62b5508dd5e","version":1},"confrmanceProfiles":null,"username":null},{"title":"IMPLEMENTATION GUIDE FOR SYNDROMIC SURVEILLANCE- Copy","position":0,"coverpage":"https://hl7v2.igamt.nist.gov/igamt/api/uploaded_files/file?name=8c88df56-e1bd-4790-bfe2-d08413885691.png","subtitle":"Release 0.94","dateUpdated":1517514151332,"id":{"id":"5a72030184ae06ddc1f06b62","version":1},"confrmanceProfiles":null,"username":null},{"title":"demo","position":0,"coverpage":null,"subtitle":null,"dateUpdated":1507649912955,"id":{"id":"58791a6d84aec62b5508b0a6","version":1},"confrmanceProfiles":null,"username":null},{"title":"aaaaaaaaa","position":0,"coverpage":null,"subtitle":"aaa","dateUpdated":1514923722833,"id":{"id":"5a4a7e5484aef4028b57959d","version":1},"confrmanceProfiles":null,"username":null},{"title":"AAAAAAAAAAA- Copy","position":0,"coverpage":null,"subtitle":"bbbb","dateUpdated":1522850119074,"id":{"id":"5ac4d94784aec2a1d3db961e","version":1},"confrmanceProfiles":null,"username":null},{"title":"aaaaa","position":0,"coverpage":null,"subtitle":"aaaaaaaaa","dateUpdated":1515086057000,"id":{"id":"5a4bd7ff84aef4028b66ce45","version":1},"confrmanceProfiles":null,"username":null},{"title":"LOI IG- Copy","position":0,"coverpage":null,"subtitle":"Default Sub Title","dateUpdated":1511275443730,"id":{"id":"59a4399784aeb5e8b4ac2563","version":1},"confrmanceProfiles":null,"username":null},{"title":"aaaaaaaa","position":0,"coverpage":null,"subtitle":"aaaa","dateUpdated":1517258233444,"id":{"id":"5a4be73184aef4028b6a1d4e","version":1},"confrmanceProfiles":null,"username":null},{"title":"TEEEEEEST","position":0,"coverpage":null,"subtitle":"NAAAAA","dateUpdated":1518037471741,"id":{"id":"5a4bc85a84aef4028b6106dc","version":1},"confrmanceProfiles":null,"username":null}];
    };
    MyIgsComponent.prototype.open = function (ig, readnly) {
        this.router.navigate(['/ig/' + ig.id.id], { queryParams: { readOnly: "true" } });
    };
    MyIgsComponent.prototype.onSortChange = function (event) {
        console.log(event);
        var value = event.value;
        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        }
        else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    };
    MyIgsComponent.prototype.toggleMoreInfo = function (id) {
        if (this.moreInfoMap[id.id]) {
            this.moreInfoMap[id.id] = !this.moreInfoMap[id.id];
        }
        else {
            this.moreInfoMap[id.id] = true;
        }
        console.log(this.moreInfoMap);
    };
    MyIgsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-list/my-igs/my-igs.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], MyIgsComponent);
    return MyIgsComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-list/my-igs/my-igs.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyIGsresolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/**
 * Created by ena3 on 4/16/18.
 */
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


var MyIGsresolver = (function () {
    function MyIGsresolver(http) {
        this.http = http;
    }
    MyIGsresolver.prototype.resolve = function (route, rstate) {
        return this.http.get("api/igdocuments");
    };
    MyIGsresolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]])
    ], MyIGsresolver);
    return MyIGsresolver;
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



/***/ }),

/***/ "../../../../primeng/components/dataview/dataview.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/esm5/core.js");
var common_1 = __webpack_require__("../../../common/esm5/common.js");
var objectutils_1 = __webpack_require__("../../../../primeng/components/utils/objectutils.js");
var shared_1 = __webpack_require__("../../../../primeng/components/common/shared.js");
var paginator_1 = __webpack_require__("../../../../primeng/components/paginator/paginator.js");
var DataView = /** @class */ (function () {
    function DataView(el, objectUtils) {
        this.el = el;
        this.objectUtils = objectUtils;
        this.layout = 'list';
        this.pageLinks = 5;
        this.paginatorPosition = 'bottom';
        this.alwaysShowPaginator = true;
        this.emptyMessage = 'No records found';
        this.onLazyLoad = new core_1.EventEmitter();
        this.trackBy = function (index, item) { return item; };
        this.onPage = new core_1.EventEmitter();
        this.onSort = new core_1.EventEmitter();
        this.first = 0;
        this._sortOrder = 1;
    }
    DataView.prototype.ngOnInit = function () {
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        this.initialized = true;
    };
    Object.defineProperty(DataView.prototype, "sortField", {
        get: function () {
            return this._sortField;
        },
        set: function (val) {
            this._sortField = val;
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy || this.initialized) {
                this.sort();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataView.prototype, "sortOrder", {
        get: function () {
            return this._sortOrder;
        },
        set: function (val) {
            this._sortOrder = val;
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy || this.initialized) {
                this.sort();
            }
        },
        enumerable: true,
        configurable: true
    });
    DataView.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.templates.forEach(function (item) {
            switch (item.getType()) {
                case 'listItem':
                    _this.listItemTemplate = item.template;
                    break;
                case 'gridItem':
                    _this.gridItemTemplate = item.template;
                    break;
            }
        });
        this.updateItemTemplate();
    };
    DataView.prototype.updateItemTemplate = function () {
        switch (this.layout) {
            case 'list':
                this.itemTemplate = this.listItemTemplate;
                break;
            case 'grid':
                this.itemTemplate = this.gridItemTemplate;
                break;
        }
    };
    Object.defineProperty(DataView.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (val) {
            this._value = val;
            this.updateTotalRecords();
        },
        enumerable: true,
        configurable: true
    });
    DataView.prototype.changeLayout = function (layout) {
        this.layout = layout;
        this.updateItemTemplate();
    };
    DataView.prototype.updateTotalRecords = function () {
        this.totalRecords = this.lazy ? this.totalRecords : (this._value ? this._value.length : 0);
    };
    DataView.prototype.paginate = function (event) {
        this.first = event.first;
        this.rows = event.rows;
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        this.onPage.emit({
            first: this.first,
            rows: this.rows
        });
    };
    DataView.prototype.sort = function () {
        var _this = this;
        this.first = 0;
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        else if (this.value) {
            this.value.sort(function (data1, data2) {
                var value1 = _this.objectUtils.resolveFieldData(data1, _this.sortField);
                var value2 = _this.objectUtils.resolveFieldData(data2, _this.sortField);
                var result = null;
                if (value1 == null && value2 != null)
                    result = -1;
                else if (value1 != null && value2 == null)
                    result = 1;
                else if (value1 == null && value2 == null)
                    result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string')
                    result = value1.localeCompare(value2);
                else
                    result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
                return (_this.sortOrder * result);
            });
        }
        this.onSort.emit({
            sortField: this.sortField,
            sortOrder: this.sortOrder
        });
    };
    DataView.prototype.isEmpty = function () {
        var data = this.filteredValue || this.value;
        return data == null || data.length == 0;
    };
    DataView.prototype.createLazyLoadMetadata = function () {
        return {
            first: this.first,
            rows: this.rows
        };
    };
    DataView.prototype.getBlockableElement = function () {
        return this.el.nativeElement.children[0];
    };
    DataView.prototype.filter = function (value) {
        if (this.value && this.value.length) {
            var searchFields = this.filterBy.split(',');
            this.filteredValue = this.objectUtils.filter(this.value, searchFields, value);
            if (this.filteredValue.length === this.value.length) {
                this.filteredValue = null;
            }
            if (this.paginator) {
                this.totalRecords = this.filteredValue ? this.filteredValue.length : this.value ? this.value.length : 0;
            }
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataView.prototype, "layout", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataView.prototype, "paginator", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], DataView.prototype, "rows", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], DataView.prototype, "totalRecords", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], DataView.prototype, "pageLinks", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], DataView.prototype, "rowsPerPageOptions", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataView.prototype, "paginatorPosition", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataView.prototype, "alwaysShowPaginator", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DataView.prototype, "paginatorDropdownAppendTo", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DataView.prototype, "lazy", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataView.prototype, "emptyMessage", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], DataView.prototype, "onLazyLoad", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DataView.prototype, "style", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataView.prototype, "styleClass", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Function)
    ], DataView.prototype, "trackBy", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataView.prototype, "filterBy", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], DataView.prototype, "onPage", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], DataView.prototype, "onSort", void 0);
    __decorate([
        core_1.ContentChild(shared_1.Header),
        __metadata("design:type", Object)
    ], DataView.prototype, "header", void 0);
    __decorate([
        core_1.ContentChild(shared_1.Footer),
        __metadata("design:type", Object)
    ], DataView.prototype, "footer", void 0);
    __decorate([
        core_1.ContentChildren(shared_1.PrimeTemplate),
        __metadata("design:type", core_1.QueryList)
    ], DataView.prototype, "templates", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], DataView.prototype, "sortField", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], DataView.prototype, "sortOrder", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], DataView.prototype, "value", null);
    DataView = __decorate([
        core_1.Component({
            selector: 'p-dataView',
            template: "\n        <div [ngClass]=\"{'ui-dataview ui-widget': true, 'ui-dataview-list': (layout === 'list'), 'ui-dataview-grid': (layout === 'grid')}\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <div class=\"ui-dataview-header ui-widget-header ui-corner-top\">\n                <ng-content select=\"p-header\"></ng-content>\n            </div>\n            <p-paginator [rows]=\"rows\" [first]=\"first\" [totalRecords]=\"totalRecords\" [pageLinkSize]=\"pageLinks\" [alwaysShow]=\"alwaysShowPaginator\"\n                (onPageChange)=\"paginate($event)\" styleClass=\"ui-paginator-top\" [rowsPerPageOptions]=\"rowsPerPageOptions\" *ngIf=\"paginator && (paginatorPosition === 'top' || paginatorPosition =='both')\"\n                [dropdownAppendTo]=\"paginatorDropdownAppendTo\"></p-paginator>\n            <div class=\"ui-dataview-content ui-widget-content\">\n                <div class=\"ui-g\">\n                    <ng-template ngFor let-rowData let-rowIndex=\"index\" [ngForOf]=\"paginator ? ((filteredValue||value) | slice:(lazy ? 0 : first):((lazy ? 0 : first) + rows)) : (filteredValue||value)\" [ngForTrackBy]=\"trackBy\">\n                        <ng-container *ngTemplateOutlet=\"itemTemplate; context: {$implicit: rowData, rowIndex: rowIndex}\"></ng-container>\n                    </ng-template>\n                    <div *ngIf=\"isEmpty()\" class=\"ui-widget-content ui-g-12\">{{emptyMessage}}</div>\n                </div>\n            </div>\n            <p-paginator [rows]=\"rows\" [first]=\"first\" [totalRecords]=\"totalRecords\" [pageLinkSize]=\"pageLinks\" [alwaysShow]=\"alwaysShowPaginator\"\n                (onPageChange)=\"paginate($event)\" styleClass=\"ui-paginator-bottom\" [rowsPerPageOptions]=\"rowsPerPageOptions\" *ngIf=\"paginator && (paginatorPosition === 'bottom' || paginatorPosition =='both')\"\n                [dropdownAppendTo]=\"paginatorDropdownAppendTo\"></p-paginator>\n            <div class=\"ui-dataview-footer ui-widget-header ui-corner-bottom\" *ngIf=\"footer\">\n                <ng-content select=\"p-footer\"></ng-content>\n            </div>\n        </div>\n    ",
            providers: [objectutils_1.ObjectUtils]
        }),
        __metadata("design:paramtypes", [core_1.ElementRef, objectutils_1.ObjectUtils])
    ], DataView);
    return DataView;
}());
exports.DataView = DataView;
var DataViewLayoutOptions = /** @class */ (function () {
    function DataViewLayoutOptions(dv) {
        this.dv = dv;
    }
    DataViewLayoutOptions.prototype.changeLayout = function (event, layout) {
        this.dv.changeLayout(layout);
        event.preventDefault();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DataViewLayoutOptions.prototype, "style", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DataViewLayoutOptions.prototype, "styleClass", void 0);
    DataViewLayoutOptions = __decorate([
        core_1.Component({
            selector: 'p-dataViewLayoutOptions',
            template: "\n        <div [ngClass]=\"'ui-dataview-layout-options ui-selectbutton ui-buttonset'\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <a href=\"#\" class=\"ui-button ui-button-icon-only ui-state-default\" (click)=\"changeLayout($event, 'list')\"\n                [ngClass]=\"{'ui-state-active': dv.layout === 'list'}\">\n                <i class=\"fa fa-bars ui-button-icon-left\"></i>\n                <span class=\"ui-button-text ui-clickable\">ui-btn</span>\n            </a><a href=\"#\" class=\"ui-button ui-button-icon-only ui-state-default\" (click)=\"changeLayout($event, 'grid')\"\n                [ngClass]=\"{'ui-state-active': dv.layout === 'grid'}\">\n                <i class=\"fa fa-th-large ui-button-icon-left\"></i>\n                <span class=\"ui-button-text ui-clickable\">ui-btn</span>\n            </a>\n        </div>\n    "
        }),
        __metadata("design:paramtypes", [DataView])
    ], DataViewLayoutOptions);
    return DataViewLayoutOptions;
}());
exports.DataViewLayoutOptions = DataViewLayoutOptions;
var DataViewModule = /** @class */ (function () {
    function DataViewModule() {
    }
    DataViewModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, shared_1.SharedModule, paginator_1.PaginatorModule],
            exports: [DataView, shared_1.SharedModule, DataViewLayoutOptions],
            declarations: [DataView, DataViewLayoutOptions]
        })
    ], DataViewModule);
    return DataViewModule;
}());
exports.DataViewModule = DataViewModule;
//# sourceMappingURL=dataview.js.map

/***/ }),

/***/ "../../../../primeng/dataview.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/dataview/dataview.js"));

/***/ }),

/***/ "../../../../primeng/inputtext.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/inputtext/inputtext.js"));

/***/ })

});
//# sourceMappingURL=igdocument-list.module.chunk.js.map