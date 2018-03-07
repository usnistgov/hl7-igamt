webpackJsonp(["segment-metadata.module"],{

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentMetaDataRouting; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__segment_metadata_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var SegmentMetaDataRouting = (function () {
    function SegmentMetaDataRouting() {
    }
    SegmentMetaDataRouting = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"].forChild([
                    {
                        path: '',
                        component: __WEBPACK_IMPORTED_MODULE_2__segment_metadata_component__["a" /* SegmentMetadataComponent */]
                    }
                ])
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"]
            ]
        })
    ], SegmentMetaDataRouting);
    return SegmentMetaDataRouting;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata.component.html":
/***/ (function(module, exports) {

module.exports = " <input type=text [(ngModel)]=\"segment.name\"/>\n\n <button (click)=\"saveSegment()\" >Save  </button>\n{{segment.name}}\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentMetadataComponent; });
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



var SegmentMetadataComponent = (function () {
    function SegmentMetadataComponent(_ws, db) {
        this._ws = _ws;
        this.db = db;
    }
    SegmentMetadataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._ws.getCurrent(__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["a" /* Entity */].SEGMENT).subscribe(function (data) { _this.segment = data; });
    };
    SegmentMetadataComponent.prototype.saveSegment = function () {
        console.log(this.segment);
        this.db.saveSegment(this.segment);
        this._ws.setCurrent(__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["a" /* Entity */].SEGMENT, this.segment);
    };
    SegmentMetadataComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-segment-metadata',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["b" /* WorkspaceService */],
            __WEBPACK_IMPORTED_MODULE_2__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */]])
    ], SegmentMetadataComponent);
    return SegmentMetadataComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SegmentMetadataModule", function() { return SegmentMetadataModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__segment_metadata_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__segment_metadata_routing_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var SegmentMetadataModule = (function () {
    function SegmentMetadataModule() {
    }
    SegmentMetadataModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"], __WEBPACK_IMPORTED_MODULE_3__segment_metadata_routing_module__["a" /* SegmentMetaDataRouting */], __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormsModule"]
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_2__segment_metadata_component__["a" /* SegmentMetadataComponent */]]
        })
    ], SegmentMetadataModule);
    return SegmentMetadataModule;
}());



/***/ })

});
//# sourceMappingURL=segment-metadata.module.chunk.js.map