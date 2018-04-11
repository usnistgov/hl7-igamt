webpackJsonp(["common"],{

/***/ "../../../../../src/app/common/badge/display-badge.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".label-sub-component {\n  background-color: rgba(0, 0, 0, 0.91);\n}\n\n.label-datatype {\n  background-color: rgba(30, 24, 242, 0.91);\n}\n\n.label-segment {\n  background-color: #0f44f2;\n}\n\n.label-field {\n  background-color: #f24a08;\n}\n\n.label-component {\n  background-color: #f2c60d;\n}\n\n.label-dynamicCase {\n  background-color: #ff43d8;\n}\n\n.label-gray {\n  background-color: gray;\n}\n\n.label-ig {\n  background-color: purple;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/badge/display-badge.component.html":
/***/ (function(module, exports) {

module.exports = "<span *ngIf=\"type === 'field'\" class=\"label label-icon label-field\">F</span>\n<span *ngIf=\"type === 'component'\" class=\"label label-icon label-component\">C</span>\n<span *ngIf=\"type === 'subcomponent'\" class=\"label label-icon label-sub-component\">S</span>\n<span *ngIf=\"type === 'segment'\" class=\"label label-icon label-segment\">S</span>\n<span *ngIf=\"type === 'datatype'\" class=\"label label-icon label-datatype\">D</span>\n<span *ngIf=\"type === 'document'\" class=\"label label-icon label-ig\">IG</span>\n"

/***/ }),

/***/ "../../../../../src/app/common/badge/display-badge.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DisplayBadgeComponent; });
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
 * Created by hnt5 on 10/26/17.
 */

var DisplayBadgeComponent = (function () {
    function DisplayBadgeComponent() {
    }
    DisplayBadgeComponent.prototype.ngOnInit = function () { };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], DisplayBadgeComponent.prototype, "type", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], DisplayBadgeComponent.prototype, "size", void 0);
    DisplayBadgeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'display-badge',
            template: __webpack_require__("../../../../../src/app/common/badge/display-badge.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/badge/display-badge.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DisplayBadgeComponent);
    return DisplayBadgeComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/entity-header/entity-header.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".h-bar {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f2f5f6+0,e3eaed+37,c8d7dc+100;Grey+3D+%234 */\n  background: #f2f5f6; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n  background: -webkit-gradient(linear, left top, left bottom, from(#f2f5f6),color-stop(37%, #e3eaed),to(#c8d7dc));\n  background: linear-gradient(to bottom, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f5f6', endColorstr='#c8d7dc',GradientType=0 ); /* IE6-9 */\n\n\n  padding-bottom: 10px;\n  padding-top   : 10px;\n  padding-left: 15px;\n  width: 100%;\n  font-size : 22px;\n}\n\n.label-green {\n  background-color: #26905e;\n}\n\n.label-blue {\n  background-color: #7ca7e6;\n}\n\n.label-user {\n  background-color: #e68650;\n}\n\n.text-small {\n  font-size : 13px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/entity-header/entity-header.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"h-bar\">\n  <display-badge [type]=\"_elm.type\"></display-badge> {{header()}}\n  <span class=\"text-small label label-green\">\n    <i class=\"fa fa-calendar\" aria-hidden=\"true\"></i>\n    {{_elm.dateUpdated | date : 'short'}}\n  </span>\n  <span *ngIf=\"_elm.type != 'document'\" class=\"text-small label label-blue\">\n    <i class=\"fa fa-code-fork\" aria-hidden=\"true\"></i>\n    HL7 v{{_elm.hl7Version }}\n  </span>\n  <span *ngIf=\"_elm.type == 'document'\" class=\"text-small label label-user\">\n    <i class=\"fa fa-user\" aria-hidden=\"true\"></i>\n    <!--{{_elm.owner.username }}-->\n  </span>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/common/entity-header/entity-header.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EntityHeaderComponent; });
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
 * Created by hnt5 on 10/30/17.
 */

var EntityHeaderComponent = (function () {
    function EntityHeaderComponent() {
    }
    Object.defineProperty(EntityHeaderComponent.prototype, "elm", {
        set: function (e) {
            this._elm = e;
        },
        enumerable: true,
        configurable: true
    });
    EntityHeaderComponent.prototype.header = function () {
        switch (this._elm.type) {
            case 'segment':
                return this._elm.label;
            case 'document':
                return this._elm.metaData.title;
        }
        return 'ndef';
    };
    EntityHeaderComponent.prototype.ngOnInit = function () { };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], EntityHeaderComponent.prototype, "elm", null);
    EntityHeaderComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'entity-header',
            template: __webpack_require__("../../../../../src/app/common/entity-header/entity-header.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/entity-header/entity-header.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], EntityHeaderComponent);
    return EntityHeaderComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/label/display-label.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".label-USE {\n  background-color: green;\n  font-weight: 400;\n}\n\n.label-HL7 {\n  background-color: #f4867e;\n  font-weight: 400;\n}\n\n.label-PRL {\n  background: cornflowerblue;\n  font-weight: 400;\n}\n\n.label-PVS {\n  background: #ed0bea;\n  font-weight: 400;\n}\n\n.label-MASTER {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ff7400+0,ff7400+100;Orange+Flat */\n  background: #ff7400; /* Old browsers */\n  /* FF3.6-15 */\n  /* Chrome10-25,Safari5.1-6 */\n  background: -webkit-gradient(linear, left top, left bottom, from(#ff7400), to(#ff7400));\n  background: linear-gradient(to bottom, #ff7400 0%, #ff7400 100%);\n  /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ff7400',\n  endColorstr='#ff7400', GradientType=0); /* IE6-9 */\n  font-weight: 400;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/label/display-label.component.html":
/***/ (function(module, exports) {

module.exports = "<div (click)=\"goTo()\"><span  *ngIf=\"getScopeLabel()\" class=\"badge\"  [ngClass]=\"{'label-HL7' : getScopeLabel()==='HL7', 'label-USE': getScopeLabel()==='USR','label-MASTER':getScopeLabel()==='MAS','label-PRL':getScopeLabel()==='PRL','label-PVS':getScopeLabel()==='PVS'}\">\n\n  {{getScopeLabel()}} {{getVersion()}}</span> {{getElementLabel()}}</div>\n"

/***/ }),

/***/ "../../../../../src/app/common/label/display-label.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DisplayLabelComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_switchMap__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/switchMap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
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
 * Created by hnt5 on 10/26/17.
 */




var DisplayLabelComponent = (function () {
    function DisplayLabelComponent(_ws, route, router) {
        this._ws = _ws;
        this.route = route;
        this.router = router;
    }
    DisplayLabelComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._ws.getCurrent(__WEBPACK_IMPORTED_MODULE_3__service_workspace_workspace_service__["a" /* Entity */].IG).subscribe(function (data) { _this._ig = data; });
    };
    Object.defineProperty(DisplayLabelComponent.prototype, "elm", {
        get: function () {
            return this._elm;
        },
        set: function (obj) {
            this._elm = obj;
        },
        enumerable: true,
        configurable: true
    });
    DisplayLabelComponent.prototype.getScopeLabel = function () {
        if (this.elm && this.elm.scope) {
            if (this.elm.scope === 'HL7STANDARD') {
                return 'HL7';
            }
            else if (this.elm.scope === 'USER') {
                return 'USR';
            }
            else if (this.elm.scope === 'MASTER') {
                return 'MAS';
            }
            else if (this.elm.scope === 'PRELOADED') {
                return 'PRL';
            }
            else if (this.elm.scope === 'PHINVADS') {
                return 'PVS';
            }
            else {
                return null;
            }
        }
    };
    DisplayLabelComponent.prototype.getElementLabel = function () {
        var type = this.elm.type;
        if (type) {
            if (type === 'segment') {
                return this.getSegmentLabel(this.elm);
            }
            else if (type = 'datatype') {
                return this.getDatatypeLabel(this.elm);
            }
            else if (type === 'table') {
                console.log("Called");
                return this.getTableLabel(this.elm);
            }
            else if (type === 'message') {
                return this.getMessageLabel(this.elm);
            }
            else if (type === 'profilecomponent') {
                return this.getProfileComponentsLabel(this.elm);
            }
            else if (type === 'compositeprofile') {
                return this.getCompositeProfileLabel(this.elm);
            }
        }
    };
    DisplayLabelComponent.prototype.getVersion = function () {
        return this.elm.hl7Version ? this.elm.hl7Version : '';
    };
    ;
    DisplayLabelComponent.prototype.getSegmentLabel = function (elm) {
        if (!elm.ext || elm.ext == '') {
            return elm.name + "-" + elm.description;
        }
        else {
            return elm.name + "_" + elm.ext + elm.description;
        }
    };
    ;
    DisplayLabelComponent.prototype.getDatatypeLabel = function (elm) {
        if (!elm.ext || elm.ext == '') {
            return elm.name + "-" + elm.description;
        }
        else {
            return elm.name + "_" + elm.ext + elm.description;
        }
    };
    ;
    DisplayLabelComponent.prototype.getTableLabel = function (elm) {
        return elm.bindingIdentifier + "-" + elm.name;
    };
    ;
    DisplayLabelComponent.prototype.getMessageLabel = function (elm) {
        return elm.name + "-" + elm.description;
    };
    ;
    DisplayLabelComponent.prototype.getProfileComponentsLabel = function (elm) {
        return elm.name + "-" + elm.description;
    };
    ;
    DisplayLabelComponent.prototype.getCompositeProfileLabel = function (elm) {
        return elm.name + "-" + elm.description;
    };
    ;
    DisplayLabelComponent.prototype.goTo = function () {
        var _this = this;
        var type = this.elm.type;
        var IgdocumentId = this._ig.id;
        this.route.queryParams
            .subscribe(function (params) {
            console.log(params); // {order: "popular"}
            var link = "/ig-documents/igdocuments-edit/" + IgdocumentId + "/" + _this.elm.type + "/" + _this.elm.id;
            _this.router.navigate([link], params); // add the parameters to the end
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DisplayLabelComponent.prototype, "elm", null);
    DisplayLabelComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'display-label',
            template: __webpack_require__("../../../../../src/app/common/label/display-label.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/label/display-label.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__service_workspace_workspace_service__["b" /* WorkspaceService */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], DisplayLabelComponent);
    return DisplayLabelComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/datatype-name.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DtFlavorPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by hnt5 on 10/16/17.
 */

var DtFlavorPipe = (function () {
    function DtFlavorPipe() {
    }
    DtFlavorPipe.prototype.transform = function (list, base) {
        if (list && base) {
            return list.filter(function (node) { return node.label.startsWith(base); });
        }
        return [];
    };
    DtFlavorPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({ name: 'dtFlavor' })
    ], DtFlavorPipe);
    return DtFlavorPipe;
}());



/***/ }),

/***/ "../../../../../src/app/utils/utils.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UtilsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_badge_display_badge_component__ = __webpack_require__("../../../../../src/app/common/badge/display-badge.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__igdocuments_igdocument_edit_segment_edit_segment_definition_coconstraint_table_datatype_name_pipe__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/datatype-name.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_entity_header_entity_header_component__ = __webpack_require__("../../../../../src/app/common/entity-header/entity-header.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_label_display_label_component__ = __webpack_require__("../../../../../src/app/common/label/display-label.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_primeng_primeng__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by hnt5 on 10/30/17.
 */








var UtilsModule = (function () {
    function UtilsModule() {
    }
    UtilsModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_3__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_6__angular_router__["RouterModule"],
                __WEBPACK_IMPORTED_MODULE_7_primeng_primeng__["ButtonModule"]
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_1__common_badge_display_badge_component__["a" /* DisplayBadgeComponent */], __WEBPACK_IMPORTED_MODULE_4__common_entity_header_entity_header_component__["a" /* EntityHeaderComponent */], __WEBPACK_IMPORTED_MODULE_2__igdocuments_igdocument_edit_segment_edit_segment_definition_coconstraint_table_datatype_name_pipe__["a" /* DtFlavorPipe */], __WEBPACK_IMPORTED_MODULE_5__common_label_display_label_component__["a" /* DisplayLabelComponent */]],
            exports: [__WEBPACK_IMPORTED_MODULE_1__common_badge_display_badge_component__["a" /* DisplayBadgeComponent */], __WEBPACK_IMPORTED_MODULE_4__common_entity_header_entity_header_component__["a" /* EntityHeaderComponent */], __WEBPACK_IMPORTED_MODULE_2__igdocuments_igdocument_edit_segment_edit_segment_definition_coconstraint_table_datatype_name_pipe__["a" /* DtFlavorPipe */], __WEBPACK_IMPORTED_MODULE_5__common_label_display_label_component__["a" /* DisplayLabelComponent */]]
        })
    ], UtilsModule);
    return UtilsModule;
}());



/***/ }),

/***/ "../../../../rxjs/_esm5/add/operator/switchMap.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__("../../../../rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_switchMap__ = __webpack_require__("../../../../rxjs/_esm5/operator/switchMap.js");
/** PURE_IMPORTS_START .._.._Observable,.._.._operator_switchMap PURE_IMPORTS_END */


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.switchMap = __WEBPACK_IMPORTED_MODULE_1__operator_switchMap__["a" /* switchMap */];
//# sourceMappingURL=switchMap.js.map 


/***/ }),

/***/ "../../../../rxjs/_esm5/operator/switchMap.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = switchMap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__operators_switchMap__ = __webpack_require__("../../../../rxjs/_esm5/operators/switchMap.js");
/** PURE_IMPORTS_START .._operators_switchMap PURE_IMPORTS_END */

/* tslint:enable:max-line-length */
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable, emitting values only from the most recently projected Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link switch}.</span>
 *
 * <img src="./img/switchMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. Each time it observes one of these
 * inner Observables, the output Observable begins emitting the items emitted by
 * that inner Observable. When a new inner Observable is emitted, `switchMap`
 * stops emitting items from the earlier-emitted inner Observable and begins
 * emitting items from the new one. It continues to behave like this for
 * subsequent inner Observables.
 *
 * @example <caption>Rerun an interval Observable on every click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.switchMap((ev) => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link mergeMap}
 * @see {@link switch}
 * @see {@link switchMapTo}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and taking only the values from the most recently
 * projected inner Observable.
 * @method switchMap
 * @owner Observable
 */
function switchMap(project, resultSelector) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__operators_switchMap__["a" /* switchMap */])(project, resultSelector)(this);
}
//# sourceMappingURL=switchMap.js.map 


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/switchMap.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = switchMap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/* tslint:enable:max-line-length */
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable, emitting values only from the most recently projected Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link switch}.</span>
 *
 * <img src="./img/switchMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. Each time it observes one of these
 * inner Observables, the output Observable begins emitting the items emitted by
 * that inner Observable. When a new inner Observable is emitted, `switchMap`
 * stops emitting items from the earlier-emitted inner Observable and begins
 * emitting items from the new one. It continues to behave like this for
 * subsequent inner Observables.
 *
 * @example <caption>Rerun an interval Observable on every click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.switchMap((ev) => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link mergeMap}
 * @see {@link switch}
 * @see {@link switchMapTo}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and taking only the values from the most recently
 * projected inner Observable.
 * @method switchMap
 * @owner Observable
 */
function switchMap(project, resultSelector) {
    return function switchMapOperatorFunction(source) {
        return source.lift(new SwitchMapOperator(project, resultSelector));
    };
}
var SwitchMapOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SwitchMapOperator(project, resultSelector) {
        this.project = project;
        this.resultSelector = resultSelector;
    }
    SwitchMapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SwitchMapSubscriber(subscriber, this.project, this.resultSelector));
    };
    return SwitchMapOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchMapSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SwitchMapSubscriber, _super);
    function SwitchMapSubscriber(destination, project, resultSelector) {
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.index = 0;
    }
    SwitchMapSubscriber.prototype._next = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (error) {
            this.destination.error(error);
            return;
        }
        this._innerSub(result, value, index);
    };
    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
        var innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        this.add(this.innerSubscription = Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, result, value, index));
    };
    SwitchMapSubscriber.prototype._complete = function () {
        var innerSubscription = this.innerSubscription;
        if (!innerSubscription || innerSubscription.closed) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapSubscriber.prototype._unsubscribe = function () {
        this.innerSubscription = null;
    };
    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._tryNotifyNext(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            this.destination.next(innerValue);
        }
    };
    SwitchMapSubscriber.prototype._tryNotifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
        var result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return SwitchMapSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=switchMap.js.map 


/***/ })

});
//# sourceMappingURL=common.chunk.js.map