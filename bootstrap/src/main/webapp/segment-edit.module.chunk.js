webpackJsonp(["segment-edit.module"],{

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-can-desactivate.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CanDeactivateGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__("../../../../rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
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
 * Created by ena3 on 12/11/17.
 */




var CanDeactivateGuard = (function () {
    function CanDeactivateGuard(_ws, db) {
        this._ws = _ws;
        this.db = db;
    }
    ;
    CanDeactivateGuard.prototype.canDeactivate = function (component, route, state) {
        console.log("Calling Desactivate");
        if (component.hash() !== this._ws.getPreviousHash()) {
            console.log("saving");
            this.db.saveSegment(component._segment);
            console.log("saving");
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["a" /* Observable */].of(true);
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["a" /* Observable */].of(true);
        }
    };
    CanDeactivateGuard = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__["b" /* WorkspaceService */],
            __WEBPACK_IMPORTED_MODULE_3__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */]])
    ], CanDeactivateGuard);
    return CanDeactivateGuard;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__segment_edit_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__segment_edit_guard__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__segment_can_desactivate_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-can-desactivate.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by hnt5 on 10/23/17.
 */





var SegmentEditRoutingModule = (function () {
    function SegmentEditRoutingModule() {
    }
    SegmentEditRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_router__["RouterModule"].forChild([
                    {
                        path: ':id',
                        component: __WEBPACK_IMPORTED_MODULE_2__segment_edit_component__["a" /* SegmentEditComponent */],
                        canActivate: [__WEBPACK_IMPORTED_MODULE_3__segment_edit_guard__["a" /* SegmentGuard */]],
                        canDeactivate: [__WEBPACK_IMPORTED_MODULE_4__segment_can_desactivate_service__["a" /* CanDeactivateGuard */]],
                        children: [
                            {
                                path: 'definition',
                                loadChildren: './segment-definition/segment-definition.module#SegmentDefinitionModule'
                            },
                            {
                                path: 'metadata',
                                loadChildren: './segment-metadata/segment-metadata.module#SegmentMetadataModule'
                            }
                        ]
                    }
                ])
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_router__["RouterModule"]
            ]
        })
    ], SegmentEditRoutingModule);
    return SegmentEditRoutingModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".sg-bar {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f2f5f6+0,e3eaed+37,c8d7dc+100;Grey+3D+%234 */\n  background: #f2f5f6; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n  background: linear-gradient(to bottom, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f5f6', endColorstr='#c8d7dc',GradientType=0 ); /* IE6-9 */\n\n\n  padding-bottom: 10px;\n  padding-top   : 10px;\n  font-size : 24px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.component.html":
/***/ (function(module, exports) {

module.exports = "<entity-header [elm]=\"_segment\"></entity-header>\n<div style=\"padding: 10px;\">\n  <p-tabMenu [model]=\"segmentEditTabs\"></p-tabMenu>\n  <router-outlet></router-outlet>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5__ = __webpack_require__("../../../../ts-md5/dist/md5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
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
 * Created by hnt5 on 10/23/17.
 */





var SegmentEditComponent = (function () {
    function SegmentEditComponent(_ws, route, router) {
        var _this = this;
        this._ws = _ws;
        this.route = route;
        this.router = router;
        _ws.getCurrent(__WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__["a" /* Entity */].SEGMENT).subscribe(function (data) { return _this.segment = data; });
    }
    Object.defineProperty(SegmentEditComponent.prototype, "segment", {
        set: function (segment) {
            this._segment = segment;
        },
        enumerable: true,
        configurable: true
    });
    ;
    SegmentEditComponent.prototype.ngOnInit = function () {
        this.segmentEditTabs = [
            { label: 'Metadata', icon: 'fa-info-circle', routerLink: './metadata' },
            { label: 'Definition', icon: 'fa-table', routerLink: './definition' },
            { label: 'Delta', icon: 'fa-table', routerLink: './delta' },
            { label: 'Cross-Reference', icon: 'fa-link', routerLink: './crossref' }
        ];
    };
    SegmentEditComponent.prototype.ngOnDestroy = function () {
    };
    SegmentEditComponent.prototype.hash = function () {
        var str = JSON.stringify(this._segment);
        console.log("Calling Hash ");
        console.log(__WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5__["Md5"].hashStr(str));
        return __WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5__["Md5"].hashStr(str);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], SegmentEditComponent.prototype, "segment", null);
    SegmentEditComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'segment-edit',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__["b" /* WorkspaceService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], SegmentEditComponent);
    return SegmentEditComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.guard.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
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



var SegmentGuard = (function () {
    function SegmentGuard(_ws, db) {
        this._ws = _ws;
        this.db = db;
    }
    ;
    SegmentGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.getSegment(route.params['id'], function (data) {
                this._ws.setCurrent(__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["a" /* Entity */].SEGMENT, data);
                resolve(true);
            }.bind(_this));
        });
    };
    SegmentGuard = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["b" /* WorkspaceService */],
            __WEBPACK_IMPORTED_MODULE_2__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */]])
    ], SegmentGuard);
    return SegmentGuard;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SegmentEditModule", function() { return SegmentEditModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__segment_edit_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__segment_edit_routing_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_components_tabmenu_tabmenu__ = __webpack_require__("../../../../primeng/components/tabmenu/tabmenu.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_components_tabmenu_tabmenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_primeng_components_tabmenu_tabmenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_components_dialog_dialog__ = __webpack_require__("../../../../primeng/components/dialog/dialog.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_components_dialog_dialog___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_primeng_components_dialog_dialog__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_components_dropdown_dropdown__ = __webpack_require__("../../../../primeng/components/dropdown/dropdown.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_components_dropdown_dropdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_primeng_components_dropdown_dropdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__segment_edit_guard__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_utils_module__ = __webpack_require__("../../../../../src/app/utils/utils.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__segment_can_desactivate_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-can-desactivate.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by hnt5 on 10/23/17.
 */











var SegmentEditModule = (function () {
    function SegmentEditModule() {
    }
    SegmentEditModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_5__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_4_primeng_components_tabmenu_tabmenu__["TabMenuModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_components_dialog_dialog__["DialogModule"],
                __WEBPACK_IMPORTED_MODULE_7_primeng_components_dropdown_dropdown__["DropdownModule"],
                __WEBPACK_IMPORTED_MODULE_3__segment_edit_routing_module__["a" /* SegmentEditRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_9__utils_utils_module__["a" /* UtilsModule */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_8__segment_edit_guard__["a" /* SegmentGuard */], __WEBPACK_IMPORTED_MODULE_10__segment_can_desactivate_service__["a" /* CanDeactivateGuard */]],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__segment_edit_component__["a" /* SegmentEditComponent */]
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["CUSTOM_ELEMENTS_SCHEMA"]]
        })
    ], SegmentEditModule);
    return SegmentEditModule;
}());



/***/ })

});
//# sourceMappingURL=segment-edit.module.chunk.js.map