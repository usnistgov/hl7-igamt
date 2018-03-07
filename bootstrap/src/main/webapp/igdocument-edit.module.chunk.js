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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
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
    function IgDocumentEditComponent(route, _ws, $http, dbService) {
        var _this = this;
        this.route = route;
        this._ws = _ws;
        this.$http = $http;
        this.dbService = dbService;
        this.ig = this._ws.getCurrent(__WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__["a" /* Entity */].IG).subscribe(function (data) {
            _this.ig = data;
            _this.dbService.init(_this._ig);
        });
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
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_4__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */]])
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_ngx_contextmenu__ = __webpack_require__("../../../../ngx-contextmenu/lib/index.js");
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
                __WEBPACK_IMPORTED_MODULE_17__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_18_ngx_contextmenu__["b" /* ContextMenuModule */].forRoot({
                    autoFocus: true,
                })
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

module.exports = "<p-tree [value]=\"treeData\" draggableNodes=\"true\" droppableNodes=\"true\" selectionMode=\"single\" styleClass=\"toc\">\n  <ng-template let-node  pTemplate=\"default\">\n\n<div *ngIf=\"node.data\">\n    <li   *ngIf=\"node.data.referenceType==='root'\" [contextMenu]=\"basicMenu\"\n         pDroppable=\"['section', 'profile']\" >\n      <span  (click)=\"print(node)\">{{node.data.sectionTitle}}</span>\n      <!--<p-contextMenu  [target]=\"root\" appendTo=\"body\" [model]=\"rootMenu\"></p-contextMenu>-->\n\n      <context-menu #basicMenu>\n        <ng-template contextMenuItem (execute)=\"AddSection(node)\">\n          Add Section\n        </ng-template>\n      </context-menu>\n    </li>\n\n\n    <li  *ngIf=\"node.data.referenceType=='section'\"\n         pDraggable=\"section\" pDroppable=\"section\">\n      <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n    </li>\n\n    <li  *ngIf=\"node.data.referenceType=='profile'\"\n         pDraggable=\"section\">\n      <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n    </li>\n\n\n    <li  *ngIf=\"node.data.referenceType=='messages'\"\n       pDroppable=\"section\">\n        <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n    </li>\n\n\n  <li  *ngIf=\"node.data.referenceType=='segments'\"\n       pDroppable=\"section\">\n    <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n  </li>\n\n  <li  *ngIf=\"node.data.referenceType=='datatypelibrary'\"\n       pDroppable=\"section\">\n    <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n  </li>\n\n  <li  *ngIf=\"node.data.referenceType=='tablelibrary'\"\n       pDroppable=\"section\">\n    <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n  </li>\n\n\n  <li  *ngIf=\"node.data.referenceType=='compositeprofiles'\"\n       pDroppable=\"section\">\n    <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n  </li>\n  <li  *ngIf=\"node.data.referenceType=='profilecomponents'\"\n       pDroppable=\"section\">\n    <span (click)=\"print(node)\" >{{getPath(node)+\".\"+node.data.sectionTitle}}</span>\n  </li>\n\n  <li *ngIf=\"node.data.ref\">\n   <button (click)=\"setActualNode(node)\">Click</button>\n    <display-label [elm]=\"node.data.ref\" ></display-label>\n  </li>\n\n</div>\n  </ng-template>\n\n\n\n</p-tree>\n\n\n"

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ngx_contextmenu__ = __webpack_require__("../../../../ngx-contextmenu/lib/index.js");
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
            if (dragNode.data.referenceType == 'profile') {
                console.log(dropNode);
                return dropNode.parent.data.referenceType == 'root';
            }
            else if (dragNode.data.referenceType == 'section') {
                return dropNode.parent.data.referenceType == 'root' || dropNode.parent.data.referenceType == 'section';
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
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_4_ngx_contextmenu__["a" /* ContextMenuComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4_ngx_contextmenu__["a" /* ContextMenuComponent */])
    ], TocComponent.prototype, "basicMenu", void 0);
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



/***/ }),

/***/ "../../../../ngx-contextmenu/lib/contextMenu.attach.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContextMenuAttachDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__contextMenu_component__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.component.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__contextMenu_service__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.service.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__("../../../core/esm5/core.js");



var ContextMenuAttachDirective = (function () {
    function ContextMenuAttachDirective(contextMenuService) {
        this.contextMenuService = contextMenuService;
    }
    ContextMenuAttachDirective.prototype.onContextMenu = function (event) {
        this.contextMenuService.show.next({
            contextMenu: this.contextMenu,
            event: event,
            item: this.contextMenuSubject,
        });
        event.preventDefault();
        event.stopPropagation();
    };
    ContextMenuAttachDirective.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_2__angular_core__["Directive"], args: [{
                    selector: '[contextMenu]',
                },] },
    ];
    /** @nocollapse */
    ContextMenuAttachDirective.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_1__contextMenu_service__["a" /* ContextMenuService */], },
    ]; };
    ContextMenuAttachDirective.propDecorators = {
        "contextMenuSubject": [{ type: __WEBPACK_IMPORTED_MODULE_2__angular_core__["Input"] },],
        "contextMenu": [{ type: __WEBPACK_IMPORTED_MODULE_2__angular_core__["Input"] },],
        "onContextMenu": [{ type: __WEBPACK_IMPORTED_MODULE_2__angular_core__["HostListener"], args: ['contextmenu', ['$event'],] },],
    };
    return ContextMenuAttachDirective;
}());

//# sourceMappingURL=contextMenu.attach.directive.js.map

/***/ }),

/***/ "../../../../ngx-contextmenu/lib/contextMenu.component.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContextMenuComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__contextMenu_item_directive__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.item.directive.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contextMenu_service__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.service.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__contextMenu_tokens__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.tokens.js");
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};





var ContextMenuComponent = (function () {
    function ContextMenuComponent(_contextMenuService, changeDetector, elementRef, options) {
        var _this = this;
        this._contextMenuService = _contextMenuService;
        this.changeDetector = changeDetector;
        this.elementRef = elementRef;
        this.options = options;
        this.autoFocus = false;
        this.useBootstrap4 = false;
        this.disabled = false;
        this.close = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.open = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.visibleMenuItems = [];
        this.links = [];
        this.subscription = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subscription__["a" /* Subscription */]();
        if (options) {
            this.autoFocus = options.autoFocus;
            this.useBootstrap4 = options.useBootstrap4;
        }
        this.subscription.add(_contextMenuService.show.subscribe(function (menuEvent) { return _this.onMenuEvent(menuEvent); }));
        this.subscription.add(_contextMenuService.close.subscribe(function (event) { return _this.close.emit(event); }));
    }
    ContextMenuComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    ContextMenuComponent.prototype.onMenuEvent = function (menuEvent) {
        if (this.disabled) {
            return;
        }
        var contextMenu = menuEvent.contextMenu, event = menuEvent.event, item = menuEvent.item;
        if (contextMenu && contextMenu !== this) {
            return;
        }
        this.event = event;
        this.item = item;
        this.setVisibleMenuItems();
        this._contextMenuService.openContextMenu(__assign({}, menuEvent, { menuItems: this.visibleMenuItems }));
        this.open.next(menuEvent);
    };
    ContextMenuComponent.prototype.isMenuItemVisible = function (menuItem) {
        return this.evaluateIfFunction(menuItem.visible);
    };
    ContextMenuComponent.prototype.setVisibleMenuItems = function () {
        var _this = this;
        this.visibleMenuItems = this.menuItems.filter(function (menuItem) { return _this.isMenuItemVisible(menuItem); });
    };
    ContextMenuComponent.prototype.evaluateIfFunction = function (value) {
        if (value instanceof Function) {
            return value(this.item);
        }
        return value;
    };
    ContextMenuComponent.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"], args: [{
                    encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None,
                    selector: 'context-menu',
                    styles: ["\n    .cdk-overlay-container {\n      position: fixed;\n      z-index: 1000;\n      pointer-events: none;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n    }\n    .ngx-contextmenu.cdk-overlay-pane {\n      position: absolute;\n      pointer-events: auto;\n      box-sizing: border-box;\n    }\n  "],
                    template: " ",
                },] },
    ];
    /** @nocollapse */
    ContextMenuComponent.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_3__contextMenu_service__["a" /* ContextMenuService */], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_4__contextMenu_tokens__["a" /* CONTEXT_MENU_OPTIONS */],] },] },
    ]; };
    ContextMenuComponent.propDecorators = {
        "autoFocus": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "useBootstrap4": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "disabled": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "close": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
        "open": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
        "menuItems": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_2__contextMenu_item_directive__["a" /* ContextMenuItemDirective */],] },],
        "menuElement": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"], args: ['menu',] },],
    };
    return ContextMenuComponent;
}());

//# sourceMappingURL=contextMenu.component.js.map

/***/ }),

/***/ "../../../../ngx-contextmenu/lib/contextMenu.item.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContextMenuItemDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");

var ContextMenuItemDirective = (function () {
    function ContextMenuItemDirective(template, elementRef) {
        this.template = template;
        this.elementRef = elementRef;
        this.divider = false;
        this.enabled = true;
        this.passive = false;
        this.visible = true;
        this.execute = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.isActive = false;
    }
    Object.defineProperty(ContextMenuItemDirective.prototype, "disabled", {
        get: function () {
            return this.passive ||
                this.divider ||
                !this.evaluateIfFunction(this.enabled, this.currentItem);
        },
        enumerable: true,
        configurable: true
    });
    ContextMenuItemDirective.prototype.evaluateIfFunction = function (value, item) {
        if (value instanceof Function) {
            return value(item);
        }
        return value;
    };
    ContextMenuItemDirective.prototype.setActiveStyles = function () {
        this.isActive = true;
    };
    ContextMenuItemDirective.prototype.setInactiveStyles = function () {
        this.isActive = false;
    };
    ContextMenuItemDirective.prototype.triggerExecute = function (item, $event) {
        if (!this.evaluateIfFunction(this.enabled, item)) {
            return;
        }
        this.execute.emit({ event: $event, item: item });
    };
    ContextMenuItemDirective.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    /* tslint:disable:directive-selector-type */
                    selector: '[contextMenuItem]',
                },] },
    ];
    /** @nocollapse */
    ContextMenuItemDirective.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    ]; };
    ContextMenuItemDirective.propDecorators = {
        "subMenu": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "divider": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "enabled": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "passive": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "visible": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "execute": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
    };
    return ContextMenuItemDirective;
}());

//# sourceMappingURL=contextMenu.item.directive.js.map

/***/ }),

/***/ "../../../../ngx-contextmenu/lib/contextMenu.service.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContextMenuService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_cdk_overlay__ = __webpack_require__("../../../cdk/esm5/overlay.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_cdk_portal__ = __webpack_require__("../../../cdk/esm5/portal.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__contextMenuContent_component__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenuContent.component.js");






var ContextMenuService = (function () {
    function ContextMenuService(overlay, scrollStrategy) {
        this.overlay = overlay;
        this.scrollStrategy = scrollStrategy;
        this.isDestroyingLeafMenu = false;
        this.show = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["Subject"]();
        this.triggerClose = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["Subject"]();
        this.close = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["Subject"]();
        this.overlays = [];
        this.fakeElement = {
            getBoundingClientRect: function () {
                return ({
                    bottom: 0,
                    height: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                    width: 0,
                });
            }
        };
    }
    ContextMenuService.prototype.openContextMenu = function (context) {
        var anchorElement = context.anchorElement, event = context.event, parentContextMenu = context.parentContextMenu;
        if (!parentContextMenu) {
            this.fakeElement.getBoundingClientRect = function () {
                return ({
                    bottom: event.clientY,
                    height: 0,
                    left: event.clientX,
                    right: event.clientX,
                    top: event.clientY,
                    width: 0,
                });
            };
            this.closeAllContextMenus();
            var positionStrategy = this.overlay.position().connectedTo({ nativeElement: anchorElement || this.fakeElement }, { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
                .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
                .withFallbackPosition({ originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' })
                .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'end', overlayY: 'top' })
                .withFallbackPosition({ originX: 'end', originY: 'center' }, { overlayX: 'start', overlayY: 'center' })
                .withFallbackPosition({ originX: 'start', originY: 'center' }, { overlayX: 'end', overlayY: 'center' });
            this.overlays = [this.overlay.create({
                    positionStrategy: positionStrategy,
                    panelClass: 'ngx-contextmenu',
                    scrollStrategy: this.scrollStrategy.close(),
                })];
            this.attachContextMenu(this.overlays[0], context);
        }
        else {
            var positionStrategy = this.overlay.position().connectedTo({ nativeElement: event ? event.target : anchorElement }, { originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' })
                .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'end', overlayY: 'top' })
                .withFallbackPosition({ originX: 'end', originY: 'bottom' }, { overlayX: 'start', overlayY: 'bottom' })
                .withFallbackPosition({ originX: 'start', originY: 'bottom' }, { overlayX: 'end', overlayY: 'bottom' });
            var newOverlay = this.overlay.create({
                positionStrategy: positionStrategy,
                panelClass: 'ngx-contextmenu',
                scrollStrategy: this.scrollStrategy.close(),
            });
            this.destroySubMenus(parentContextMenu);
            this.overlays = this.overlays.concat(newOverlay);
            this.attachContextMenu(newOverlay, context);
        }
    };
    ContextMenuService.prototype.attachContextMenu = function (overlay, context) {
        var _this = this;
        var event = context.event, item = context.item, menuItems = context.menuItems;
        var contextMenuContent = overlay.attach(new __WEBPACK_IMPORTED_MODULE_1__angular_cdk_portal__["d" /* ComponentPortal */](__WEBPACK_IMPORTED_MODULE_5__contextMenuContent_component__["a" /* ContextMenuContentComponent */]));
        contextMenuContent.instance.event = event;
        contextMenuContent.instance.item = item;
        contextMenuContent.instance.menuItems = menuItems;
        contextMenuContent.instance.overlay = overlay;
        contextMenuContent.instance.isLeaf = true;
        overlay.contextMenu = contextMenuContent.instance;
        var subscriptions = new __WEBPACK_IMPORTED_MODULE_4_rxjs_Subscription__["a" /* Subscription */]();
        subscriptions.add(contextMenuContent.instance.execute.asObservable()
            .subscribe(function () { return _this.closeAllContextMenus(); }));
        subscriptions.add(contextMenuContent.instance.closeAllMenus.asObservable()
            .subscribe(function () { return _this.closeAllContextMenus(); }));
        subscriptions.add(contextMenuContent.instance.closeLeafMenu.asObservable()
            .subscribe(function (closeLeafMenuEvent) { return _this.destroyLeafMenu(closeLeafMenuEvent); }));
        subscriptions.add(contextMenuContent.instance.openSubMenu.asObservable()
            .subscribe(function (subMenuEvent) {
            _this.destroySubMenus(contextMenuContent.instance);
            if (!subMenuEvent.contextMenu) {
                contextMenuContent.instance.isLeaf = true;
                return;
            }
            contextMenuContent.instance.isLeaf = false;
            _this.show.next(subMenuEvent);
        }));
        contextMenuContent.onDestroy(function () {
            menuItems.forEach(function (menuItem) { return menuItem.isActive = false; });
            subscriptions.unsubscribe();
        });
    };
    ContextMenuService.prototype.closeAllContextMenus = function () {
        if (this.overlays) {
            this.overlays.forEach(function (overlay, index) {
                overlay.detach();
                overlay.dispose();
            });
        }
        this.overlays = [];
    };
    ContextMenuService.prototype.getLastAttachedOverlay = function () {
        var overlay = this.overlays[this.overlays.length - 1];
        while (this.overlays.length > 1 && overlay && !overlay.hasAttached()) {
            overlay.detach();
            overlay.dispose();
            this.overlays = this.overlays.slice(0, -1);
            overlay = this.overlays[this.overlays.length - 1];
        }
        return overlay;
    };
    ContextMenuService.prototype.destroyLeafMenu = function (_a) {
        var _this = this;
        var exceptRootMenu = (_a === void 0 ? {} : _a).exceptRootMenu;
        if (this.isDestroyingLeafMenu) {
            return;
        }
        this.isDestroyingLeafMenu = true;
        setTimeout(function () {
            var overlay = _this.getLastAttachedOverlay();
            if (_this.overlays.length > (exceptRootMenu ? 1 : 0) && overlay) {
                overlay.detach();
                overlay.dispose();
            }
            var newLeaf = _this.getLastAttachedOverlay();
            if (newLeaf) {
                newLeaf.contextMenu.isLeaf = true;
            }
            _this.isDestroyingLeafMenu = false;
        });
    };
    ContextMenuService.prototype.destroySubMenus = function (contextMenu) {
        var overlay = contextMenu.overlay;
        var index = this.overlays.indexOf(overlay);
        this.overlays.slice(index + 1).forEach(function (subMenuOverlay) {
            subMenuOverlay.detach();
            subMenuOverlay.dispose();
        });
    };
    ContextMenuService.prototype.isLeafMenu = function (contextMenuContent) {
        var overlay = this.getLastAttachedOverlay();
        return contextMenuContent.overlay === overlay;
    };
    ContextMenuService.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_2__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    ContextMenuService.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_cdk_overlay__["b" /* Overlay */], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_cdk_overlay__["e" /* ScrollStrategyOptions */], },
    ]; };
    return ContextMenuService;
}());

//# sourceMappingURL=contextMenu.service.js.map

/***/ }),

/***/ "../../../../ngx-contextmenu/lib/contextMenu.tokens.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CONTEXT_MENU_OPTIONS; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");

var CONTEXT_MENU_OPTIONS = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["InjectionToken"]('CONTEXT_MENU_OPTIONS');
//# sourceMappingURL=contextMenu.tokens.js.map

/***/ }),

/***/ "../../../../ngx-contextmenu/lib/contextMenuContent.component.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContextMenuContentComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_cdk_overlay__ = __webpack_require__("../../../cdk/esm5/overlay.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contextMenu_tokens__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.tokens.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_cdk_a11y__ = __webpack_require__("../../../cdk/esm5/a11y.es5.js");
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};






var ARROW_LEFT_KEYCODE = 37;
var ContextMenuContentComponent = (function () {
    function ContextMenuContentComponent(changeDetector, elementRef, options, renderer) {
        this.changeDetector = changeDetector;
        this.elementRef = elementRef;
        this.options = options;
        this.renderer = renderer;
        this.menuItems = [];
        this.isLeaf = false;
        this.execute = new __WEBPACK_IMPORTED_MODULE_1__angular_core__["EventEmitter"]();
        this.openSubMenu = new __WEBPACK_IMPORTED_MODULE_1__angular_core__["EventEmitter"]();
        this.closeLeafMenu = new __WEBPACK_IMPORTED_MODULE_1__angular_core__["EventEmitter"]();
        this.closeAllMenus = new __WEBPACK_IMPORTED_MODULE_1__angular_core__["EventEmitter"]();
        this.autoFocus = false;
        this.useBootstrap4 = false;
        this.subscription = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subscription__["a" /* Subscription */]();
        if (options) {
            this.autoFocus = options.autoFocus;
            this.useBootstrap4 = options.useBootstrap4;
        }
    }
    ContextMenuContentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.menuItems.forEach(function (menuItem) {
            menuItem.currentItem = _this.item;
            _this.subscription.add(menuItem.execute.subscribe(function (event) { return _this.execute.emit(__assign({}, event, { menuItem: menuItem })); }));
        });
        var queryList = new __WEBPACK_IMPORTED_MODULE_1__angular_core__["QueryList"]();
        queryList.reset(this.menuItems);
        this._keyManager = new __WEBPACK_IMPORTED_MODULE_4__angular_cdk_a11y__["c" /* ActiveDescendantKeyManager */](queryList).withWrap();
    };
    ContextMenuContentComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.autoFocus) {
            setTimeout(function () { return _this.focus(); });
        }
        this.overlay.updatePosition();
    };
    ContextMenuContentComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    ContextMenuContentComponent.prototype.focus = function () {
        if (this.autoFocus) {
            this.menuElement.nativeElement.focus();
        }
    };
    ContextMenuContentComponent.prototype.stopEvent = function ($event) {
        $event.stopPropagation();
    };
    ContextMenuContentComponent.prototype.isMenuItemEnabled = function (menuItem) {
        return this.evaluateIfFunction(menuItem && menuItem.enabled);
    };
    ContextMenuContentComponent.prototype.isMenuItemVisible = function (menuItem) {
        return this.evaluateIfFunction(menuItem && menuItem.visible);
    };
    ContextMenuContentComponent.prototype.evaluateIfFunction = function (value) {
        if (value instanceof Function) {
            return value(this.item);
        }
        return value;
    };
    ContextMenuContentComponent.prototype.isDisabled = function (link) {
        return link.enabled && !link.enabled(this.item);
    };
    ContextMenuContentComponent.prototype.onKeyEvent = function (event) {
        if (!this.isLeaf) {
            return;
        }
        this._keyManager.onKeydown(event);
    };
    ContextMenuContentComponent.prototype.keyboardOpenSubMenu = function (event) {
        if (!this.isLeaf) {
            return;
        }
        this.cancelEvent(event);
        var menuItem = this.menuItems[this._keyManager.activeItemIndex];
        if (menuItem) {
            this.onOpenSubMenu(menuItem);
        }
    };
    ContextMenuContentComponent.prototype.keyboardMenuItemSelect = function (event) {
        if (!this.isLeaf) {
            return;
        }
        this.cancelEvent(event);
        var menuItem = this.menuItems[this._keyManager.activeItemIndex];
        if (menuItem) {
            this.onMenuItemSelect(menuItem, event);
        }
    };
    ContextMenuContentComponent.prototype.onCloseLeafMenu = function (event) {
        if (!this.isLeaf) {
            return;
        }
        this.cancelEvent(event);
        this.closeLeafMenu.emit({ exceptRootMenu: event.keyCode === ARROW_LEFT_KEYCODE });
    };
    ContextMenuContentComponent.prototype.closeMenu = function (event) {
        if (event.type === 'click' && event.button === 2) {
            return;
        }
        this.closeAllMenus.emit();
    };
    ContextMenuContentComponent.prototype.onOpenSubMenu = function (menuItem, event) {
        var anchorElementRef = this.menuItemElements.toArray()[this._keyManager.activeItemIndex];
        var anchorElement = anchorElementRef && anchorElementRef.nativeElement;
        this.openSubMenu.emit({
            anchorElement: anchorElement,
            contextMenu: menuItem.subMenu,
            event: event,
            item: this.item,
            parentContextMenu: this,
        });
    };
    ContextMenuContentComponent.prototype.onMenuItemSelect = function (menuItem, event) {
        event.preventDefault();
        event.stopPropagation();
        this.onOpenSubMenu(menuItem, event);
        if (!menuItem.subMenu) {
            menuItem.triggerExecute(this.item, event);
        }
    };
    ContextMenuContentComponent.prototype.cancelEvent = function (event) {
        if (!event) {
            return;
        }
        var target = event.target;
        if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(target.tagName) > -1 || target.isContentEditable) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
    };
    ContextMenuContentComponent.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"], args: [{
                    selector: 'context-menu-content',
                    styles: [
                        ".passive {\n       display: block;\n       padding: 3px 20px;\n       clear: both;\n       font-weight: normal;\n       line-height: @line-height-base;\n       white-space: nowrap;\n     }\n    .hasSubMenu:before {\n      content: \"\u25B6\";\n      float: right;\n    }",
                    ],
                    template: "<div class=\"dropdown open show ngx-contextmenu\" tabindex=\"0\">\n      <ul #menu class=\"dropdown-menu show\" style=\"position: static; float: none;\" tabindex=\"0\">\n        <li #li *ngFor=\"let menuItem of menuItems; let i = index\" [class.disabled]=\"!isMenuItemEnabled(menuItem)\"\n            [class.divider]=\"menuItem.divider\" [class.dropdown-divider]=\"useBootstrap4 && menuItem.divider\"\n            [class.active]=\"menuItem.isActive && isMenuItemEnabled(menuItem)\"\n            [attr.role]=\"menuItem.divider ? 'separator' : undefined\">\n          <a *ngIf=\"!menuItem.divider && !menuItem.passive\" href [class.dropdown-item]=\"useBootstrap4\"\n            [class.active]=\"menuItem.isActive && isMenuItemEnabled(menuItem)\"\n            [class.disabled]=\"useBootstrap4 && !isMenuItemEnabled(menuItem)\" [class.hasSubMenu]=\"!!menuItem.subMenu\"\n            (click)=\"onMenuItemSelect(menuItem, $event)\" (mouseenter)=\"onOpenSubMenu(menuItem, $event)\">\n            <ng-template [ngTemplateOutlet]=\"menuItem.template\" [ngTemplateOutletContext]=\"{ $implicit: item }\"></ng-template>\n          </a>\n\n          <span (click)=\"stopEvent($event)\" (contextmenu)=\"stopEvent($event)\" class=\"passive\"\n                *ngIf=\"!menuItem.divider && menuItem.passive\" [class.dropdown-item]=\"useBootstrap4\"\n                [class.disabled]=\"useBootstrap4 && !isMenuItemEnabled(menuItem)\">\n            <ng-template [ngTemplateOutlet]=\"menuItem.template\" [ngTemplateOutletContext]=\"{ $implicit: item }\"></ng-template>\n          </span>\n        </li>\n      </ul>\n    </div>\n  ",
                },] },
    ];
    /** @nocollapse */
    ContextMenuContentComponent.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ChangeDetectorRef"], },
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ElementRef"], },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_3__contextMenu_tokens__["a" /* CONTEXT_MENU_OPTIONS */],] },] },
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Renderer"], },
    ]; };
    ContextMenuContentComponent.propDecorators = {
        "menuItems": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"] },],
        "item": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"] },],
        "event": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"] },],
        "parentContextMenu": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"] },],
        "overlay": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"] },],
        "isLeaf": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"] },],
        "execute": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Output"] },],
        "openSubMenu": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Output"] },],
        "closeLeafMenu": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Output"] },],
        "closeAllMenus": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Output"] },],
        "menuElement": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ViewChild"], args: ['menu',] },],
        "menuItemElements": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ViewChildren"], args: ['li',] },],
        "onKeyEvent": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["HostListener"], args: ['window:keydown.ArrowDown', ['$event'],] }, { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["HostListener"], args: ['window:keydown.ArrowUp', ['$event'],] },],
        "keyboardOpenSubMenu": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["HostListener"], args: ['window:keydown.ArrowRight', ['$event'],] },],
        "keyboardMenuItemSelect": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["HostListener"], args: ['window:keydown.Enter', ['$event'],] }, { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["HostListener"], args: ['window:keydown.Space', ['$event'],] },],
        "onCloseLeafMenu": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["HostListener"], args: ['window:keydown.Escape', ['$event'],] }, { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["HostListener"], args: ['window:keydown.ArrowLeft', ['$event'],] },],
        "closeMenu": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["HostListener"], args: ['document:click', ['$event'],] }, { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["HostListener"], args: ['document:contextmenu', ['$event'],] },],
    };
    return ContextMenuContentComponent;
}());

//# sourceMappingURL=contextMenuContent.component.js.map

/***/ }),

/***/ "../../../../ngx-contextmenu/lib/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ngx_contextmenu__ = __webpack_require__("../../../../ngx-contextmenu/lib/ngx-contextmenu.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__ngx_contextmenu__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__contextMenu_component__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.component.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__contextMenu_component__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__contextMenu_service__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.service.js");
/* unused harmony namespace reexport */



//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../ngx-contextmenu/lib/ngx-contextmenu.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContextMenuModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_cdk_overlay__ = __webpack_require__("../../../cdk/esm5/overlay.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contextMenu_attach_directive__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.attach.directive.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__contextMenu_component__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.component.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__contextMenu_item_directive__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.item.directive.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__contextMenu_service__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.service.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__contextMenu_tokens__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.tokens.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__contextMenuContent_component__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenuContent.component.js");









var ContextMenuModule = (function () {
    function ContextMenuModule() {
    }
    ContextMenuModule.forRoot = function (options) {
        return {
            ngModule: ContextMenuModule,
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__contextMenu_service__["a" /* ContextMenuService */],
                {
                    provide: __WEBPACK_IMPORTED_MODULE_7__contextMenu_tokens__["a" /* CONTEXT_MENU_OPTIONS */],
                    useValue: options,
                },
            ],
        };
    };
    ContextMenuModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_2__angular_core__["NgModule"], args: [{
                    declarations: [
                        __WEBPACK_IMPORTED_MODULE_3__contextMenu_attach_directive__["a" /* ContextMenuAttachDirective */],
                        __WEBPACK_IMPORTED_MODULE_4__contextMenu_component__["a" /* ContextMenuComponent */],
                        __WEBPACK_IMPORTED_MODULE_8__contextMenuContent_component__["a" /* ContextMenuContentComponent */],
                        __WEBPACK_IMPORTED_MODULE_5__contextMenu_item_directive__["a" /* ContextMenuItemDirective */],
                    ],
                    entryComponents: [
                        __WEBPACK_IMPORTED_MODULE_8__contextMenuContent_component__["a" /* ContextMenuContentComponent */],
                    ],
                    exports: [
                        __WEBPACK_IMPORTED_MODULE_3__contextMenu_attach_directive__["a" /* ContextMenuAttachDirective */],
                        __WEBPACK_IMPORTED_MODULE_4__contextMenu_component__["a" /* ContextMenuComponent */],
                        __WEBPACK_IMPORTED_MODULE_5__contextMenu_item_directive__["a" /* ContextMenuItemDirective */],
                    ],
                    imports: [
                        __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                        __WEBPACK_IMPORTED_MODULE_0__angular_cdk_overlay__["d" /* OverlayModule */],
                    ],
                },] },
    ];
    /** @nocollapse */
    ContextMenuModule.ctorParameters = function () { return []; };
    return ContextMenuModule;
}());

//# sourceMappingURL=ngx-contextmenu.js.map

/***/ })

});
//# sourceMappingURL=igdocument-edit.module.chunk.js.map