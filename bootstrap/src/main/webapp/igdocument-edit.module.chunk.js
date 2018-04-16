webpackJsonp(["igdocument-edit.module"],{

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentEditRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__igdocument_edit_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__igdocument_metadata_igdocument_metadata_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/igdocument-metadata.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__section_section_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/section/section.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__igdocument_edit_guard__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.guard.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var IgDocumentEditRoutingModule = (function () {
    function IgDocumentEditRoutingModule() {
    }
    IgDocumentEditRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"].forChild([
                    {
                        path: ':id',
                        canActivate: [__WEBPACK_IMPORTED_MODULE_5__igdocument_edit_guard__["a" /* IgDocumentGuard */]],
                        component: __WEBPACK_IMPORTED_MODULE_2__igdocument_edit_component__["a" /* IgDocumentEditComponent */],
                        children: [
                            { path: 'igdocument-metadata', component: __WEBPACK_IMPORTED_MODULE_3__igdocument_metadata_igdocument_metadata_component__["a" /* IgDocumentMetadataComponent */] },
                            { path: 'section', component: __WEBPACK_IMPORTED_MODULE_4__section_section_component__["a" /* SectionComponent */] },
                            { path: '', component: __WEBPACK_IMPORTED_MODULE_3__igdocument_metadata_igdocument_metadata_component__["a" /* IgDocumentMetadataComponent */] },
                            { path: 'segment', loadChildren: './segment-edit/segment-edit.module#SegmentEditModule' }
                            // { path: 'datatype', loadChildren: './datatype-edit/datatype-edit.module#DatatypeEditModule' }
                        ]
                    },
                ])
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"]
            ]
        })
    ], IgDocumentEditRoutingModule);
    return IgDocumentEditRoutingModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n\n.menu-c {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n  height: 100%;\n}\n\n.menu-c li {\n  float: right;\n  color: white;\n  padding: 10px;\n  margin-right: 10px;\n  font-size: 15px;\n  display: block;\n  text-align: center;\n  text-decoration: none;\n}\n\n.menu-c li:hover {\n  background-color: #00cede;\n  cursor: pointer;\n}\n\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.html":
/***/ (function(module, exports) {

module.exports = "<!--HEADER-->\n<!--<ig-header></ig-header>-->\n\n<div class=\"ui-g\" style=\"padding : 0;\">\n\n  <!--TOC-->\n  <div class=\"ui-g-3\" style=\"padding : 0;\">\n    <igamt-toc></igamt-toc>\n  </div>\n\n  <!--ROUTE-->\n  <div class=\"ui-g-9\" style=\"padding : 0;\">\n    <router-outlet></router-outlet>\n  </div>\n\n</div>\n\n\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentEditComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var IgDocumentEditComponent = (function () {
    function IgDocumentEditComponent(route, _ws, http, dbService) {
        // this.ig = this._ws.getCurrent(Entity.IG).subscribe(data => {this.ig=data
        //
        // //  this.dbService.init(this._ig);
        // });
        this.route = route;
        this._ws = _ws;
        this.http = http;
        this.dbService = dbService;
    }
    ;
    Object.defineProperty(IgDocumentEditComponent.prototype, "ig", {
        set: function (doc) {
            this._ig = doc;
        },
        enumerable: true,
        configurable: true
    });
    IgDocumentEditComponent.prototype.ngOnInit = function () {
        this.items = [
            {
                label: "Close",
                icon: "fa-times"
            },
            {
                label: "Verify",
                icon: "fa-check"
            },
            {
                label: "Share",
                icon: "fa-share-alt"
            },
            {
                label: "Usage Filter",
                model: [
                    { label: "All Usages" },
                    { label: "RE / C / O" }
                ]
            },
            {
                label: "Export",
                icon: "fa-download"
            },
            {
                label: "Connect To GVT",
                icon: "fa-paper-plane"
            }
        ];
        this.menui = [
            { label: "All Usages" },
            { label: "RE / C / O" }
        ];
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], IgDocumentEditComponent.prototype, "ig", null);
    IgDocumentEditComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__["b" /* WorkspaceService */],
            __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */]])
    ], IgDocumentEditComponent);
    return IgDocumentEditComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.guard.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
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



var IgDocumentGuard = (function () {
    function IgDocumentGuard(_ws, $http) {
        this._ws = _ws;
        this.$http = $http;
    }
    ;
    IgDocumentGuard.prototype.canActivate = function (route, state) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var obs = _this.$http.get('api/igdocuments/' + route.params['id']).map(function (res) { return res.json(); }).subscribe(function (data) {
                _this._ws.setCurrent(__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["a" /* Entity */].IG, data);
                obs.unsubscribe();
                resolve(true);
            });
        });
    };
    IgDocumentGuard = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["b" /* WorkspaceService */],
            __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */]])
    ], IgDocumentGuard);
    return IgDocumentGuard;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IgDocumentEditModule", function() { return IgDocumentEditModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__igdocument_edit_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__igdocument_metadata_igdocument_metadata_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/igdocument-metadata.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__section_section_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/section/section.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__igdocument_edit_routing_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__igdocument_edit_guard__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__toc_toc_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_primeng_components_menubar_menubar__ = __webpack_require__("../../../../primeng/components/menubar/menubar.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_primeng_components_menubar_menubar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_primeng_components_menubar_menubar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_primeng_components_tooltip_tooltip__ = __webpack_require__("../../../../primeng/components/tooltip/tooltip.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_primeng_components_tooltip_tooltip___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_primeng_components_tooltip_tooltip__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_primeng_components_tieredmenu_tieredmenu__ = __webpack_require__("../../../../primeng/components/tieredmenu/tieredmenu.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_primeng_components_tieredmenu_tieredmenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_primeng_components_tieredmenu_tieredmenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__utils_utils_module__ = __webpack_require__("../../../../../src/app/utils/utils.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__toc_toc_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/toc/toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_primeng_components_tree_tree__ = __webpack_require__("../../../../primeng/components/tree/tree.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_primeng_components_tree_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_primeng_components_tree_tree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_primeng_components_common_treedragdropservice__ = __webpack_require__("../../../../primeng/components/common/treedragdropservice.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_primeng_components_common_treedragdropservice___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_primeng_components_common_treedragdropservice__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_primeng_components_dragdrop_dragdrop__ = __webpack_require__("../../../../primeng/components/dragdrop/dragdrop.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_primeng_components_dragdrop_dragdrop___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_primeng_components_dragdrop_dragdrop__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


















var IgDocumentEditModule = (function () {
    function IgDocumentEditModule() {
    }
    IgDocumentEditModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_5__igdocument_edit_routing_module__["a" /* IgDocumentEditRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["AccordionModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["TabViewModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["GrowlModule"],
                __WEBPACK_IMPORTED_MODULE_9_primeng_components_menubar_menubar__["MenubarModule"],
                __WEBPACK_IMPORTED_MODULE_10_primeng_components_tooltip_tooltip__["TooltipModule"],
                __WEBPACK_IMPORTED_MODULE_11_primeng_components_tieredmenu_tieredmenu__["TieredMenuModule"],
                __WEBPACK_IMPORTED_MODULE_12__utils_utils_module__["a" /* UtilsModule */],
                __WEBPACK_IMPORTED_MODULE_14_primeng_components_tree_tree__["TreeModule"],
                __WEBPACK_IMPORTED_MODULE_16_primeng_components_dragdrop_dragdrop__["DragDropModule"],
                __WEBPACK_IMPORTED_MODULE_17__angular_forms__["FormsModule"]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__igdocument_edit_component__["a" /* IgDocumentEditComponent */], __WEBPACK_IMPORTED_MODULE_3__igdocument_metadata_igdocument_metadata_component__["a" /* IgDocumentMetadataComponent */], __WEBPACK_IMPORTED_MODULE_4__section_section_component__["a" /* SectionComponent */], __WEBPACK_IMPORTED_MODULE_8__toc_toc_component__["a" /* TocComponent */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__igdocument_edit_guard__["a" /* IgDocumentGuard */], __WEBPACK_IMPORTED_MODULE_13__toc_toc_service__["a" /* TocService */], __WEBPACK_IMPORTED_MODULE_15_primeng_components_common_treedragdropservice__["TreeDragDropService"]
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["CUSTOM_ELEMENTS_SCHEMA"]]
        })
    ], IgDocumentEditModule);
    return IgDocumentEditModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/igdocument-metadata.component.html":
/***/ (function(module, exports) {

module.exports = "<span class=\"feature-title\">EDIT IG Document Metadata</span>"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/igdocument-metadata.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentMetadataComponent; });
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

var IgDocumentMetadataComponent = (function () {
    function IgDocumentMetadataComponent() {
    }
    IgDocumentMetadataComponent.prototype.ngOnInit = function () {
    };
    IgDocumentMetadataComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/igdocument-metadata.component.html")
        }),
        __metadata("design:paramtypes", [])
    ], IgDocumentMetadataComponent);
    return IgDocumentMetadataComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/section/section.component.html":
/***/ (function(module, exports) {

module.exports = "<span class=\"feature-title\">EDIT Section Contents</span>"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/section/section.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SectionComponent; });
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

var SectionComponent = (function () {
    function SectionComponent() {
    }
    SectionComponent.prototype.ngOnInit = function () {
    };
    SectionComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/section/section.component.html")
        }),
        __metadata("design:paramtypes", [])
    ], SectionComponent);
    return SectionComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.ui-treenode-droppoint{\n  height: 800px !important;\n  max-height: 800px !important;\n  background-color: #00a5bb;\n\n}\nli .ui-treenode-droppoint {\n  height: 12px !important;\n  list-style-type: none;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.html":
/***/ (function(module, exports) {

module.exports = "<p-tree [value]=\"treeData\" draggableNodes=\"true\" droppableNodes=\"true\" selectionMode=\"single\" styleClass=\"toc\">\n  <ng-template let-node  pTemplate=\"default\">\n\n<div *ngIf=\"node.data\">\n    <li   *ngIf=\"node.data.type==='root'\"\n         pDroppable=\"['section', 'profile']\" >\n      <span  (click)=\"print(node)\">{{node.data.sectionTitle}}</span>\n      <!--<p-contextMenu  [target]=\"root\" appendTo=\"body\" [model]=\"rootMenu\"></p-contextMenu>-->\n\n      <!--<context-menu #basicMenu>-->\n        <!--<ng-template contextMenuItem (execute)=\"AddSection(node)\">-->\n          <!--Add Section-->\n        <!--</ng-template>-->\n      <!--</context-menu>-->\n    </li>\n\n\n    <li  *ngIf=\"node.data.type=='section'\"\n         pDraggable=\"section\" pDroppable=\"section\">\n      <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n    </li>\n\n    <li  *ngIf=\"node.data.type=='profile'\"\n         pDraggable=\"section\">\n      <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n    </li>\n\n\n    <li  *ngIf=\"node.data.type=='messages'\"\n       pDroppable=\"section\">\n        <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n    </li>\n\n\n    <li  *ngIf=\"node.data.type=='segments'\"\n       pDroppable=\"section\">\n    <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n    </li>\n\n     <li  *ngIf=\"node.data.type=='datatypelibrary'\"\n       pDroppable=\"section\">\n      <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n    </li>\n\n  <li  *ngIf=\"node.data.type=='tablelibrary'\"\n       pDroppable=\"section\">\n    <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n  </li>\n\n\n  <li  *ngIf=\"node.data.type=='compositeprofiles'\"\n       pDroppable=\"section\">\n    <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n  </li>\n  <li  *ngIf=\"node.data.type=='profilecomponents'\"\n       pDroppable=\"section\">\n    <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n  </li>\n\n  <!--<li *ngIf=\"node.data.ref\">-->\n   <!--<button (click)=\"setActualNode(node)\">Click</button>-->\n    <!--<display-label [elm]=\"node.data.ref\" ></display-label>-->\n  <!--</li>-->\n\n</div>\n  </ng-template>\n\n\n\n</p-tree>\n\n\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TocComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__toc_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/toc/toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_primeng_components_tree_tree__ = __webpack_require__("../../../../primeng/components/tree/tree.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_primeng_components_tree_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_primeng_components_tree_tree__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





// import {ContextMenuModule,MenuItem} from 'primeng/primeng';
// import {ContextMenuComponent} from "ngx-contextmenu";
var TocComponent = (function () {
    function TocComponent(_ws, tocService) {
        this._ws = _ws;
        this.tocService = tocService;
        //rootMenu: MenuItem[];
        this.items = [
            { name: 'John', otherProperty: 'Foo' },
            { name: 'Joe', otherProperty: 'Bar' }
        ];
        this.print = function (obj) {
            console.log("Printing Obj");
            console.log(obj);
        };
        this.getPath = function (node) {
            if (node.data.position) {
                if (node.parent.data.referenceType == "root") {
                    return node.data.position;
                }
                else {
                    return this.getPath(node.parent) + "." + node.data.position;
                }
            }
        };
    }
    Object.defineProperty(TocComponent.prototype, "ig", {
        set: function (ig) {
            this._ig = ig;
        },
        enumerable: true,
        configurable: true
    });
    TocComponent.prototype.ngOnInit = function () {
        var _this = this;
        var ctrl = this;
        this.ig = this._ws.getCurrent(__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["a" /* Entity */].IG).subscribe(function (data) {
            _this.ig = data;
            _this.treeData = _this.tocService.buildTreeFromIgDocument(_this._ig);
            // this.rootMenu= [{label: "add Section", command:function(event){
            //   console.log(event);
            //   var data= {position: 4, sectionTitle: "New Section", referenceId: "", referenceType: "section", sectionContent: null};
            //   var node={};
            //   node["data"]=data;
            //   ctrl.treeData[0].children.push(node);
            //
            //
            // }}];
            _this.toc.allowDrop = _this.allow;
            // this.toc.draggableNodes = true;
            // this.toc.droppableNodes = true;
            _this.toc.onNodeDrop.subscribe(function (x) {
                for (var a = 0; a < x.dragNode.parent.children.length; a++) {
                    x.dragNode.parent.children[a].data.position = a + 1;
                }
                for (var c = 0; c < x.dropNode.children.length; c++) {
                    if (x.dropNode.children[c].data) {
                        x.dropNode.children[c].data.position = c + 1;
                    }
                }
                for (var b = 0; b < x.dropNode.parent.children.length; b++) {
                    x.dropNode.parent.children[b].data.position = b + 1;
                }
            });
        });
        // this.toc.dragDropService.stopDrag = function (x) {
        //   console.log("HT");
        //   console.log(x);
        // };
    };
    TocComponent.prototype.onDragStart = function (event, node) {
        console.log(event);
        console.log("Drag Start");
    };
    ;
    TocComponent.prototype.onDragEnd = function (event, node) {
        console.log("DRAG END ");
    };
    ;
    TocComponent.prototype.onDrop = function (event) {
        console.log("Performed");
        console.log(event);
    };
    ;
    TocComponent.prototype.onDragEnter = function (event, node) {
    };
    ;
    TocComponent.prototype.onDragLeave = function (event, node) {
    };
    ;
    TocComponent.prototype.prevent = function (dragNode, dropNode, dragNodeScope) {
        console.log("Called");
        return false;
    };
    ;
    TocComponent.prototype.allow = function (dragNode, dropNode, dragNodeScope) {
        if (dragNode == dropNode) {
            return false;
        }
        if (dropNode && dropNode.parent && dropNode.parent.data) {
            if (dragNode.data.type == 'profile') {
                console.log(dropNode);
                return dropNode.parent.data.type == 'ig';
            }
            else if (dragNode.data.type == 'section') {
                return dropNode.parent.data.type == 'root' || dropNode.parent.data.type == 'section';
            }
        }
        else {
            return false;
        }
    };
    ;
    TocComponent.prototype.setActualNode = function (node) {
        this._ws.setCurrent(__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["a" /* Entity */].CURRENTNODE, node);
        // this.currentNode=node;
        // console.log(node);
        // this.currentNode.data.ref.name="test";
    };
    TocComponent.prototype.AddSection = function (parent) {
        console.log(parent);
        var data = { position: 4, sectionTitle: "New Section", referenceId: "", referenceType: "section", sectionContent: null };
        var node = {};
        node.data = data;
        parent.children.push(node);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_3_primeng_components_tree_tree__["Tree"]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3_primeng_components_tree_tree__["Tree"])
    ], TocComponent.prototype, "toc", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], TocComponent.prototype, "ig", null);
    TocComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'igamt-toc',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["b" /* WorkspaceService */], __WEBPACK_IMPORTED_MODULE_2__toc_service__["a" /* TocService */]])
    ], TocComponent);
    return TocComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/toc/toc.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TocService; });
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
 * Created by ena3 on 10/26/17.
 */


var TocService = (function () {
    function TocService(http) {
        this.http = http;
        this.buildTreeFromIgDocument = function (igdocument) {
            var treeData = [];
            igdocument["content"]["data"]["referenceType"] = "root";
            igdocument["content"]["expanded"] = true;
            igdocument["content"]["data"]["sectionTitle"] = "Table of Content";
            treeData.push(igdocument["content"]);
            return treeData;
        };
        this.convertNarratives = function (narratives) {
            var ret = [];
            for (var i = 0; i < narratives.length; i++) {
                ret.push(this.processSection(narratives[i], ""));
            }
            ;
            return ret;
        };
        this.processSection = function (section, path) {
            var ret = {};
            ret["label"] = section.sectionPosition + "." + section.sectionTitle;
            ret["data"] = { id: section.id, sectionContent: section.sectionContent, sectionTitle: section.sectionTitle, sectionPosition: section.sectionPosition, path: path + "." + section.sectionPosition, type: section.type };
            if (section.children && section.children.length > 0 && section.type !== 'message') {
                ret["children"] = [];
                for (var j = 0; j < section.children.length; j++) {
                    ret["children"].push(this.processSection(section.children[j], ret["data"].path));
                }
            }
            return ret;
        };
        this.processProfile = function (profile) {
            var ret = {};
            ret["label"] = profile.sectionPosition + "." + profile.sectionTitle;
            ret["data"] = { sectionContent: profile.sectionContent, sectionTitle: profile.sectionTitle, sectionPosition: profile.sectionPosition, type: profile.type };
            ret["children"] = [];
            ret["children"].push(this.processPcLibrary(profile.profileComponentLibrary));
            ret["children"].push(this.processMessages(profile.messages));
            ret["children"].push(this.processSegments(profile.segmentLibrary));
            ret["children"].push(this.processDatatypes(profile.datatypeLibrary));
            ret["children"].push(this.processValueSets(profile.tableLibrary));
            return ret;
        };
        this.processPcLibrary = function (lib) {
            var ret = {};
            ret["label"] = lib.sectionPosition + "." + lib.sectionTitle;
            ret["data"] = { id: lib.id, sectionContent: lib.sectionContent, sectionTitle: "Profile Components", sectionPosition: 1 };
            ret["children"] = [];
            for (var i = 0; i < lib.children.length; i++) {
                ret["children"].push(this.processLink(lib.children[i]));
            }
            ;
            return ret;
        };
        this.processMessages = function (lib) {
            var ret = [];
            ret["label"] = lib.sectionPosition + "." + lib.sectionTitle;
            ret["data"] = { id: lib.id, sectionContent: lib.sectionContent, sectionTitle: lib.sectionTitle, sectionPosition: 2 };
            ret["children"] = [];
            for (var i = 0; i < lib.children.length; i++) {
                ret["children"].push(this.processLink(lib.children[i]));
            }
            ;
            return ret;
        };
        this.processCompositeProfiles = function (lib) {
            var ret = {};
            ret["label"] = lib.sectionPosition + "." + lib.sectionTitle;
            ret["data"] = { id: lib.id, sectionContent: lib.sectionContent, sectionTitle: "Profile Components", sectionPosition: 1 };
            ret["children"] = [];
            for (var i = 0; i < lib.children.length; i++) {
                ret["children"].push(this.link(lib.children[i]));
            }
            ;
            return ret;
        };
        this.processSegments = function (lib) {
            var ret = [];
            ret["label"] = lib.sectionPosition + "." + lib.sectionTitle;
            ret["data"] = { id: lib.id, sectionContent: lib.sectionContent, sectionTitle: lib.sectionTitle, sectionPosition: 2 };
            ret["children"] = [];
            for (var i = 0; i < lib.children.length; i++) {
                ret["children"].push(this.processLink(lib.children[i]));
            }
            ;
            return ret;
        };
        this.processDatatypes = function (lib) {
            var ret = [];
            ret["label"] = lib.sectionPosition + "." + lib.sectionTitle;
            ret["data"] = { id: lib.id, sectionContent: lib.sectionContent, sectionTitle: lib.sectionTitle, sectionPosition: 2 };
            ret["children"] = [];
            for (var i = 0; i < lib.children.length; i++) {
                ret["children"].push(this.processLink(lib.children[i]));
            }
            ;
            return ret;
        };
        this.processValueSets = function (lib) {
            var ret = [];
            ret["label"] = lib.sectionPosition + "." + lib.sectionTitle;
            ret["data"] = { id: lib.id, sectionContent: lib.sectionContent, sectionTitle: lib.sectionTitle, sectionPosition: 2 };
            ret["children"] = [];
            for (var i = 0; i < lib.children.length; i++) {
                ret["children"].push(this.processLink(lib.children[i]));
            }
            ;
            return ret;
        };
        this.processLink = function (link) {
            var ret = [];
            ret["data"] = link;
            ret["data"].sectionTitle = link.name;
            return ret;
        };
    }
    TocService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], TocService);
    return TocService;
}());



/***/ })

});
//# sourceMappingURL=igdocument-edit.module.chunk.js.map