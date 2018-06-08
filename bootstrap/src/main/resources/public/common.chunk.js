webpackJsonp(["common"],{

/***/ "../../../../../src/app/common/badge/display-badge.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".label-sub-component {\n  background-color: rgba(99, 187, 236, 0.91);\n}\n\n.label-datatype {\n  background-color: rgba(52, 242, 101, 0.91);\n}\n\n.label-segment {\n  background-color: #0f44f2;\n}\n\n.label-field {\n  background-color: #f24a08;\n}\n\n.label-component {\n  background-color: #f2c60d;\n}\n\n.label-dynamicCase {\n  background-color: #ff43d8;\n}\n\n.label-gray {\n  background-color: gray;\n}\n\n.label-ig {\n  background-color: purple;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/badge/display-badge.component.html":
/***/ (function(module, exports) {

module.exports = "<span *ngIf=\"type === 'field' || type === 'FIELD'\"  class=\"badge label-field\">F</span>\n<span *ngIf=\"type === 'component' || type === 'COMPONENT'\" class=\"badge label-component\">C</span>\n<span *ngIf=\"type === 'subcomponent' || type === 'SUBCOMPONENT'\" class=\"badge label-sub-component\">S</span>\n<span *ngIf=\"type === 'segment' || type === 'SEGMENT'\" class=\"badge label-segment\">S</span>\n<span *ngIf=\"type === 'group' || type === 'GROUP'\" class=\"badge label-group\">G</span>\n<span *ngIf=\"type === 'datatype'\" class=\"badge label-datatype\">D</span>\n<span *ngIf=\"type === 'document'\" class=\"badge label-ig\">IG</span>\n"

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

/***/ "../../../../../src/app/common/constants/types.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Types; });
/**
 * Created by ena3 on 6/5/18.
 */
var Types;
(function (Types) {
    Types["IGDOCUMENT"] = "IGDOCUMENT";
    Types["DATATYPEREGISTRY"] = "DATATYPEREGISTRY";
    Types["SEGMENTREGISTRY"] = "SEGMENTREGISTRY";
    Types["VALUESETREGISTRY"] = "VALUESETREGISTRY";
    Types["PROFILECOMPONENTREGISTRY"] = "PROFILECOMPONENTREGISTRY";
    Types["COMPOSITEPROFILEREGISTRY"] = "COMPOSITEPROFILEREGISTRY";
    Types["DATATYPE"] = "DATATYPE";
    Types["VALUESET"] = "VALUESET";
    Types["CONFORMANCEPROFILE"] = "CONFORMANCEPROFILE";
    Types["SEGMENT"] = "SEGMENT";
    Types["PROFILECOMPONENT"] = "PROFILECOMPONENT";
    Types["COMPOSITEPROFILE"] = "COMPOSITEPROFILE";
    Types["SEGMENTREF"] = "SEGMENTREF";
    Types["GROUP"] = "GROUP";
    Types["FIELD"] = "FIELD";
    Types["COMPONENT"] = "COMPONENT";
    Types["TEXT"] = "TEXT";
    Types["PROFILE"] = "PROFILE";
    Types["CONFORMANCEPROFILEREGISTRY"] = "CONFORMANCEPROFILEREGISTRY";
    Types["DISPLAY"] = "DISPLAY";
    Types["EVENT"] = "EVENT";
    Types["EVENTS"] = "EVENTS";
    Types["BINDING"] = "BINDING";
    Types["SECTION"] = "SECTION";
    Types["DYNAMICMAPPING"] = "DYNAMICMAPPING";
})(Types || (Types = {}));


/***/ }),

/***/ "../../../../../src/app/common/constraint/display-path.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".ng-valid[required], .ng-valid.required  {\n    /*border-left: 5px solid #42A948; !* green *!*/\n}\n\n.ng-invalid:not(form)  {\n    border-left: 5px solid #a94442 !important; /* red */\n}\n\ninput[type=text]{\n    border-width:0px 0px 1px 0px;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/constraint/display-path.component.html":
/***/ (function(module, exports) {

module.exports = "<span *ngIf=\"path\" [ngModelGroup]=\"groupName\">{{getDisplayName()}}<span *ngIf=\"needInstanceParameter()\">[<input id=\"{{groupName}}-instanceParameter\" name=\"{{groupName}}-instanceParameter\" required [(ngModel)]=\"path.instanceParameter\" type=\"text\" style=\"width:20px;\"/>]</span><span *ngIf=\"path.child\">.</span><span *ngIf=\"!path.child\">({{label()}})<i class=\"fa fa-pencil\" (click)=\"displayPicker = true\"></i></span><display-path *ngIf=\"path.child\" [path]=\"path.child\" [parentPath]=\"getIdPath()\" [idMap]=\"idMap\" [treeData]=\"treeData\" [pathHolder]=\"pathHolder\" [groupName]=\"groupName + '-child'\"></display-path></span>\n<span *ngIf=\"!path\">(Unselected Node)<i class=\"fa fa-pencil\" (click)=\"displayPicker = true\"></i></span>\n\n<p-dialog header=\"Select Node\" [(visible)]=\"displayPicker\">\n    <p-tree [value]=\"treeData\" selectionMode=\"single\" (onNodeSelect)=\"nodeSelect($event)\"></p-tree>\n</p-dialog>"

/***/ }),

/***/ "../../../../../src/app/common/constraint/display-path.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DisplayPathComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
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
 * Created by Jungyub on 10/26/17.
 */


var DisplayPathComponent = (function () {
    function DisplayPathComponent() {
        this.displayPicker = false;
    }
    DisplayPathComponent.prototype.ngOnInit = function () {
    };
    DisplayPathComponent.prototype.getIdPath = function () {
        if (!this.parentPath)
            return this.path.elementId;
        else
            return this.parentPath + "-" + this.path.elementId;
    };
    DisplayPathComponent.prototype.getDisplayName = function () {
        if (!this.parentPath)
            return this.idMap[this.getIdPath()].name;
        else
            return this.idMap[this.getIdPath()].position;
    };
    DisplayPathComponent.prototype.needInstanceParameter = function () {
        if (!this.parentPath) {
            return false;
        }
        else {
            if (this.idMap[this.getIdPath()].max) {
                if (this.idMap[this.getIdPath()].max !== "1") {
                    return true;
                }
                else
                    return false;
            }
            else {
                return false;
            }
        }
    };
    DisplayPathComponent.prototype.label = function () {
        if (!this.parentPath) {
            return null;
        }
        else {
            return this.idMap[this.getIdPath()].name;
        }
    };
    DisplayPathComponent.prototype.nodeSelect = function (event) {
        this.pathHolder.path = JSON.parse(JSON.stringify(event.node.data));
        this.displayPicker = false;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], DisplayPathComponent.prototype, "parentPath", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], DisplayPathComponent.prototype, "path", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], DisplayPathComponent.prototype, "idMap", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], DisplayPathComponent.prototype, "treeData", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], DisplayPathComponent.prototype, "pathHolder", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], DisplayPathComponent.prototype, "groupName", void 0);
    DisplayPathComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'display-path',
            template: __webpack_require__("../../../../../src/app/common/constraint/display-path.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/constraint/display-path.component.css")],
            viewProviders: [{ provide: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["ControlContainer"], useExisting: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["NgForm"] }]
        }),
        __metadata("design:paramtypes", [])
    ], DisplayPathComponent);
    return DisplayPathComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-andorconstraint.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".ng-valid[required], .ng-valid.required  {\n    /*border-left: 5px solid #42A948; !* green *!*/\n}\n\n.ng-invalid:not(form)  {\n    border-left: 5px solid #a94442 !important; /* red */\n}\n\ninput[type=text]{\n    border-width:0px 0px 1px 0px;\n}\n\n.circle-button {\n    background-color: #4CAF50;\n    border: none;\n    color: white;\n    padding: 0px;\n    text-align: center;\n    text-decoration: none;\n    display: inline-block;\n    font-size: 16px;\n    margin: 4px 2px;\n    border-radius: 50%;\n    width: 80px !important;\n    height: 80px !important;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-andorconstraint.component.html":
/***/ (function(module, exports) {

module.exports = "<div [ngModelGroup]=\"groupName\">\n    <div *ngFor=\"let child of constraint.assertions; let idx = index\">\n        <div class=\"ui-g ui-fluid\" *ngIf=\"idx!==0\">\n            <div class=\"ui-g-12 ui-md-5\">\n            </div>\n            <div class=\"ui-g-12 ui-md-2\">\n                <button pButton type=\"button\" label=\"{{constraint.operator}}\" class=\"green-btn circle-button\" (click)=\"changeOperator()\"></button>\n            </div>\n            <div class=\"ui-g-12 ui-md-5\">\n            </div>\n        </div>\n\n        <p-panel [toggleable]=\"true\" [ngModelGroup]=\"groupName + '-Child' + idx\">\n            <p-header>\n                [#{{idx + 1}}] Assertion <i class=\"fa fa-times\" *ngIf=\"constraint.assertions.length > 2\" (click)=\"constraint.assertions.splice(idx, 1)\"></i>\n            </p-header>\n\n            <div class=\"ui-g ui-fluid\">\n                <div class=\"ui-g-12 ui-md-2\">\n                    <label>[#{{idx + 1}}] Child Assertion Level:</label>\n                </div>\n                <div class=\"ui-g-12 ui-md-4\">\n                    <p-dropdown id=\"{{groupName}}-Child{{idx}}-mode\" name=\"{{groupName}}-Child{{idx}}-mode\" required [options]=\"assertionModes\" [(ngModel)]=\"child.mode\" (onChange)=\"makeConstraintMode(child)\"></p-dropdown>\n                </div>\n\n                <div *ngIf=\"child.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-2\">\n                    <label>Complex Type: </label>\n                </div>\n                <div *ngIf=\"child.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-4\">\n                    <p-dropdown id=\"{{groupName}}-Child{{idx}}-ComplextAssertionType\" name=\"{{groupName}}-Child{{idx}}-ComplextAssertionType\" required [options]=\"partialComplexAssertionTypes\" [(ngModel)]=\"child.complexAssertionType\" (onChange)=\"changeComplexAssertionType(child)\" placeholder=\"Select a complex type\"></p-dropdown>\n                </div>\n            </div>\n\n            <div class=\"ui-g ui-fluid\">\n                <div class=\"ui-g-12 ui-md-2\">\n                    <label>[#{{idx + 1}}] Child Assertion: </label>\n                </div>\n                <div class=\"ui-g-12 ui-md-10\">\n                    <edit-simple-constraint *ngIf=\"child.mode === 'SIMPLE'\" [constraint]=\"child\" [idMap]=\"idMap\" [treeData]=\"treeData\" [ifVerb]=\"ifVerb\" [groupName]=\"groupName + '-Child' + idx +'-simple'\"></edit-simple-constraint>\n                    <edit-complex-constraint *ngIf=\"child.mode === 'COMPLEX'\" [constraint]=\"child\" [idMap]=\"idMap\" [treeData]=\"treeData\" [limited]=\"true\" [ifVerb]=\"ifVerb\" [groupName]=\"groupName + '-Child' + idx +'-complex'\"></edit-complex-constraint>\n                </div>\n            </div>\n        </p-panel>\n\n        <div class=\"ui-g ui-fluid\" *ngIf=\"idx===constraint.assertions.length - 1\">\n            <div class=\"ui-g-12 ui-md-5\">\n            </div>\n            <div class=\"ui-g-12 ui-md-2\">\n                <button pButton type=\"button\" icon=\"fa-plus\" class=\"blue-btn circle-button\" (click)=\"addConstraint()\"></button>\n            </div>\n            <div class=\"ui-g-12 ui-md-5\">\n            </div>\n        </div>\n    </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-andorconstraint.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditAndOrConstraintComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
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
 * Created by Jungyub on 10/26/17.
 */



var EditAndOrConstraintComponent = (function () {
    function EditAndOrConstraintComponent(configService) {
        this.configService = configService;
    }
    EditAndOrConstraintComponent.prototype.ngOnInit = function () {
        this.andorOptions = [
            { label: 'AND', value: 'AND' },
            { label: 'OR', value: 'OR' }
        ];
        this.verbs = this.configService._simpleConstraintVerbs;
        this.operators = this.configService._operators;
        this.formatTypes = this.configService._formatTypes;
        this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
        this.partialComplexAssertionTypes = this.configService._partialComplexAssertionTypes;
        this.assertionModes = this.configService._assertionModes;
    };
    EditAndOrConstraintComponent.prototype.changeOperator = function () {
        if (!this.constraint.assertions) {
            this.constraint.assertions = [];
            this.constraint.operator = 'AND';
        }
        if (this.constraint.operator === 'AND')
            this.constraint.operator = 'OR';
        else if (this.constraint.operator === 'OR')
            this.constraint.operator = 'AND';
    };
    EditAndOrConstraintComponent.prototype.addConstraint = function () {
        this.constraint.assertions.push({ mode: 'SIMPLE' });
    };
    EditAndOrConstraintComponent.prototype.makeConstraintMode = function (constraint) {
        constraint.complement = undefined;
        constraint.subject = undefined;
        constraint.complexAssertionType = undefined;
        constraint.assertions = undefined;
        constraint.child = undefined;
        constraint.ifAssertion = undefined;
        constraint.thenAssertion = undefined;
        constraint.operator = undefined;
        constraint.verbKey = undefined;
    };
    EditAndOrConstraintComponent.prototype.changeComplexAssertionType = function (constraint) {
        if (constraint.complexAssertionType === 'ANDOR') {
            constraint.child = undefined;
            constraint.ifAssertion = undefined;
            constraint.thenAssertion = undefined;
            constraint.operator = 'AND';
            constraint.assertions = [];
            constraint.assertions.push({
                "mode": "SIMPLE"
            });
            constraint.assertions.push({
                "mode": "SIMPLE"
            });
        }
        else if (constraint.complexAssertionType === 'NOT') {
            constraint.assertions = undefined;
            constraint.ifAssertion = undefined;
            constraint.thenAssertion = undefined;
            constraint.child = {
                "mode": "SIMPLE"
            };
        }
        else if (constraint.complexAssertionType === 'IFTHEN') {
            constraint.assertions = undefined;
            constraint.child = undefined;
            constraint.ifAssertion = {
                "mode": "SIMPLE"
            };
            constraint.thenAssertion = {
                "mode": "SIMPLE"
            };
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditAndOrConstraintComponent.prototype, "constraint", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditAndOrConstraintComponent.prototype, "idMap", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], EditAndOrConstraintComponent.prototype, "treeData", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], EditAndOrConstraintComponent.prototype, "ifVerb", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], EditAndOrConstraintComponent.prototype, "groupName", void 0);
    EditAndOrConstraintComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'edit-andor-constraint',
            template: __webpack_require__("../../../../../src/app/common/constraint/edit-andorconstraint.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/constraint/edit-andorconstraint.component.css")],
            viewProviders: [{ provide: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["ControlContainer"], useExisting: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["NgForm"] }]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */]])
    ], EditAndOrConstraintComponent);
    return EditAndOrConstraintComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-complexconstraint.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".ng-valid[required], .ng-valid.required  {\n    /*border-left: 5px solid #42A948; !* green *!*/\n}\n\n.ng-invalid:not(form)  {\n    border-left: 5px solid #a94442 !important; /* red */\n}\n\ninput[type=text]{\n    border-width:0px 0px 1px 0px;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-complexconstraint.component.html":
/***/ (function(module, exports) {

module.exports = "<p-panel class=\"border\" header=\"Complex Assertion\" [toggleable]=\"true\" [ngModelGroup]=\"groupName\">\n    <div *ngIf=\"constraint.complexAssertionType\">\n        <edit-ifthen-constraint *ngIf=\"constraint.complexAssertionType === 'IFTHEN'\" [constraint]=\"constraint\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"groupName + '-IFTHEN'\"></edit-ifthen-constraint>\n        <edit-andor-constraint *ngIf=\"constraint.complexAssertionType === 'ANDOR'\" [constraint]=\"constraint\" [idMap]=\"idMap\" [treeData]=\"treeData\" [ifVerb]=\"ifVerb\" [groupName]=\"groupName + '-ANDOR'\"></edit-andor-constraint>\n        <edit-not-constraint *ngIf=\"constraint.complexAssertionType === 'NOT'\" [constraint]=\"constraint\" [idMap]=\"idMap\" [treeData]=\"treeData\" [ifVerb]=\"ifVerb\" [groupName]=\"groupName + '-NOT'\"></edit-not-constraint>\n    </div>\n</p-panel>"

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-complexconstraint.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditComplexConstraintComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
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
 * Created by Jungyub on 10/26/17.
 */



var EditComplexConstraintComponent = (function () {
    function EditComplexConstraintComponent(configService) {
        this.configService = configService;
    }
    EditComplexConstraintComponent.prototype.ngOnInit = function () {
        this.verbs = this.configService._simpleConstraintVerbs;
        this.operators = this.configService._operators;
        this.formatTypes = this.configService._formatTypes;
        this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
        if (this.limited) {
            this.complexAssertionTypes = this.configService._partialComplexAssertionTypes;
        }
        else {
            this.complexAssertionTypes = this.configService._complexAssertionTypes;
        }
    };
    EditComplexConstraintComponent.prototype.changeComplexAssertionType = function () {
        if (this.constraint.complexAssertionType === 'ANDOR') {
            this.constraint.child = undefined;
            this.constraint.ifAssertion = undefined;
            this.constraint.thenAssertion = undefined;
            this.constraint.operator = 'AND';
            this.constraint.assertions = [];
            this.constraint.assertions.push({
                "mode": "SIMPLE"
            });
            this.constraint.assertions.push({
                "mode": "SIMPLE"
            });
        }
        else if (this.constraint.complexAssertionType === 'NOT') {
            this.constraint.assertions = undefined;
            this.constraint.ifAssertion = undefined;
            this.constraint.thenAssertion = undefined;
            this.constraint.child = {
                "mode": "SIMPLE"
            };
        }
        else if (this.constraint.complexAssertionType === 'IFTHEN') {
            this.constraint.assertions = undefined;
            this.constraint.child = undefined;
            this.constraint.ifAssertion = {
                "mode": "SIMPLE"
            };
            this.constraint.thenAssertion = {
                "mode": "SIMPLE"
            };
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditComplexConstraintComponent.prototype, "constraint", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditComplexConstraintComponent.prototype, "idMap", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], EditComplexConstraintComponent.prototype, "treeData", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], EditComplexConstraintComponent.prototype, "limited", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], EditComplexConstraintComponent.prototype, "ifVerb", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], EditComplexConstraintComponent.prototype, "groupName", void 0);
    EditComplexConstraintComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'edit-complex-constraint',
            template: __webpack_require__("../../../../../src/app/common/constraint/edit-complexconstraint.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/constraint/edit-complexconstraint.component.css")],
            viewProviders: [{ provide: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["ControlContainer"], useExisting: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["NgForm"] }]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */]])
    ], EditComplexConstraintComponent);
    return EditComplexConstraintComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-freeconstraint.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".ng-valid[required], .ng-valid.required  {\n    /*border-left: 5px solid #42A948; !* green *!*/\n}\n\n.ng-invalid:not(form)  {\n    border-left: 5px solid #a94442 !important; /* red */\n}\n\ninput[type=text]{\n    border-width:0px 0px 1px 0px;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-freeconstraint.component.html":
/***/ (function(module, exports) {

module.exports = "<div ngModelGroup=\"freeText\">\n    <div class=\"ui-g ui-fluid\">\n        <div class=\"ui-g-12 ui-md-2\">\n            <label for=\"freetext\">Free Text: </label>\n        </div>\n        <div class=\"ui-g-12 ui-md-10\">\n            <input id=\"freetext\" name=\"freetext\" class=\"form-control\" required [(ngModel)]=\"constraint.freeText\" type=\"text\" #freetext=\"ngModel\"/>\n            <div *ngIf=\"freetext.invalid && (freetext.dirty || freetext.touched)\" class=\"alert alert-danger\">\n                <div *ngIf=\"freetext.errors.required\">\n                    Free Text is required.\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n\n"

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-freeconstraint.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditFreeConstraintComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
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
 * Created by Jungyub on 10/26/17.
 */


var EditFreeConstraintComponent = (function () {
    function EditFreeConstraintComponent() {
    }
    EditFreeConstraintComponent.prototype.ngOnInit = function () { };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditFreeConstraintComponent.prototype, "constraint", void 0);
    EditFreeConstraintComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'edit-free-constraint',
            template: __webpack_require__("../../../../../src/app/common/constraint/edit-freeconstraint.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/constraint/edit-freeconstraint.component.css")],
            viewProviders: [{ provide: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["ControlContainer"], useExisting: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["NgForm"] }]
        }),
        __metadata("design:paramtypes", [])
    ], EditFreeConstraintComponent);
    return EditFreeConstraintComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-ifthenconstraint.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".ng-valid[required], .ng-valid.required  {\n    /*border-left: 5px solid #42A948; !* green *!*/\n}\n\n.ng-invalid:not(form)  {\n    border-left: 5px solid #a94442 !important; /* red */\n}\n\ninput[type=text]{\n    border-width:0px 0px 1px 0px;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-ifthenconstraint.component.html":
/***/ (function(module, exports) {

module.exports = "<div [ngModelGroup]=\"groupName\">\n    <div class=\"ui-g ui-fluid\">\n        <div class=\"ui-g-12 ui-md-2\">\n            <label>IF Assertion Level: </label>\n        </div>\n        <div class=\"ui-g-12 ui-md-4\">\n            <p-dropdown id=\"ifAssertionMode\" name=\"ifAssertionMode\" required #ifAssertionMode=\"ngModel\" [options]=\"assertionModes\" [(ngModel)]=\"constraint.ifAssertion.mode\" (onChange)=\"makeConstraintMode(constraint.ifAssertion)\"></p-dropdown>\n        </div>\n        <div *ngIf=\"constraint.ifAssertion.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-2\">\n            <label>Complex Type: </label>\n        </div>\n        <div *ngIf=\"constraint.ifAssertion.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-4\">\n            <p-dropdown id=\"ifComplextAssertionType\" name=\"ifComplextAssertionType\" required #ifComplextAssertionType=\"ngModel\" [options]=\"limitedComplexAssertionTypes\" [(ngModel)]=\"constraint.ifAssertion.complexAssertionType\" (onChange)=\"changeComplexAssertionType(constraint.ifAssertion)\" placeholder=\"Select a complex type\"></p-dropdown>\n            <div *ngIf=\"ifComplextAssertionType.invalid && (ifComplextAssertionType.dirty || ifComplextAssertionType.touched)\" class=\"alert alert-danger\">\n                <div *ngIf=\"ifComplextAssertionType.errors.required\">\n                    Complex Type is required.\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"ui-g ui-fluid\">\n        <div class=\"ui-g-12 ui-md-2\">\n            <label>IF Assertion: </label>\n        </div>\n        <div class=\"ui-g-12 ui-md-10\">\n            <edit-simple-constraint *ngIf=\"constraint.ifAssertion.mode === 'SIMPLE'\" [constraint]=\"constraint.ifAssertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [ifVerb]=\"true\" [groupName]=\"groupName + '-ifSimple'\"></edit-simple-constraint>\n            <edit-complex-constraint *ngIf=\"constraint.ifAssertion.mode === 'COMPLEX'\" [constraint]=\"constraint.ifAssertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [limited]=\"true\" [ifVerb]=\"true\" [groupName]=\"groupName + '-ifComplex'\"></edit-complex-constraint>\n        </div>\n    </div>\n\n    <div class=\"ui-g ui-fluid\">\n        <div class=\"ui-g-12 ui-md-2\">\n            <label>THEN Assertion Level: </label>\n        </div>\n        <div class=\"ui-g-12 ui-md-4\">\n            <p-dropdown id=\"thenAssertionMode\" name=\"thenAssertionMode\" required #thenAssertionMode=\"ngModel\" [options]=\"assertionModes\" [(ngModel)]=\"constraint.thenAssertion.mode\" (onChange)=\"makeConstraintMode(constraint.thenAssertion)\"></p-dropdown>\n        </div>\n        <div *ngIf=\"constraint.thenAssertion.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-2\">\n            <label>Complex Type: </label>\n        </div>\n        <div *ngIf=\"constraint.thenAssertion.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-4\">\n            <p-dropdown id=\"thenComplextAssertionType\" name=\"thenComplextAssertionType\" required #thenComplextAssertionType=\"ngModel\" [options]=\"limitedComplexAssertionTypes\" [(ngModel)]=\"constraint.thenAssertion.complexAssertionType\" (onChange)=\"changeComplexAssertionType(constraint.thenAssertion)\" placeholder=\"Select a complex type\"></p-dropdown>\n            <div *ngIf=\"thenComplextAssertionType.invalid && (thenComplextAssertionType.dirty || thenComplextAssertionType.touched)\" class=\"alert alert-danger\">\n                <div *ngIf=\"thenComplextAssertionType.errors.required\">\n                    Complex Type is required.\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"ui-g ui-fluid\">\n        <div class=\"ui-g-12 ui-md-2\">\n            <label>THEN Assertion: </label>\n        </div>\n        <div class=\"ui-g-12 ui-md-10\">\n            <edit-simple-constraint *ngIf=\"constraint.thenAssertion.mode === 'SIMPLE'\" [constraint]=\"constraint.thenAssertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"groupName + '-thenSimple'\"></edit-simple-constraint>\n            <edit-complex-constraint *ngIf=\"constraint.thenAssertion.mode === 'COMPLEX'\" [constraint]=\"constraint.thenAssertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [limited]=\"true\" [groupName]=\"groupName + '-thenComplex'\"></edit-complex-constraint>\n        </div>\n    </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-ifthenconstraint.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditIfThenConstraintComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
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
 * Created by Jungyub on 10/26/17.
 */



var EditIfThenConstraintComponent = (function () {
    function EditIfThenConstraintComponent(configService) {
        this.configService = configService;
    }
    EditIfThenConstraintComponent.prototype.ngOnInit = function () {
        this.assertionModes = this.configService._assertionModes;
        this.andorOptions = [
            { label: 'AND', value: 'AND' },
            { label: 'OR', value: 'OR' }
        ];
        this.verbs = this.configService._simpleConstraintVerbs;
        this.operators = this.configService._operators;
        this.formatTypes = this.configService._formatTypes;
        this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
        this.partialComplexAssertionTypes = this.configService._partialComplexAssertionTypes;
        this.limitedComplexAssertionTypes = this.configService._partialComplexAssertionTypes;
    };
    EditIfThenConstraintComponent.prototype.makeConstraintMode = function (constraint) {
        constraint.complement = undefined;
        constraint.subject = undefined;
        constraint.complexAssertionType = undefined;
        constraint.assertions = undefined;
        constraint.child = undefined;
        constraint.ifAssertion = undefined;
        constraint.thenAssertion = undefined;
        constraint.operator = undefined;
        constraint.verbKey = undefined;
    };
    EditIfThenConstraintComponent.prototype.changeComplexAssertionType = function (constraint) {
        if (constraint.complexAssertionType === 'ANDOR') {
            constraint.child = undefined;
            constraint.ifAssertion = undefined;
            constraint.thenAssertion = undefined;
            constraint.operator = 'AND';
            constraint.assertions = [];
            constraint.assertions.push({
                "mode": "SIMPLE"
            });
            constraint.assertions.push({
                "mode": "SIMPLE"
            });
        }
        else if (constraint.complexAssertionType === 'NOT') {
            constraint.assertions = undefined;
            constraint.ifAssertion = undefined;
            constraint.thenAssertion = undefined;
            constraint.child = {
                "mode": "SIMPLE"
            };
        }
        else if (constraint.complexAssertionType === 'IFTHEN') {
            constraint.assertions = undefined;
            constraint.child = undefined;
            constraint.ifAssertion = {
                "mode": "SIMPLE"
            };
            constraint.thenAssertion = {
                "mode": "SIMPLE"
            };
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditIfThenConstraintComponent.prototype, "constraint", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditIfThenConstraintComponent.prototype, "idMap", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], EditIfThenConstraintComponent.prototype, "treeData", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], EditIfThenConstraintComponent.prototype, "groupName", void 0);
    EditIfThenConstraintComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'edit-ifthen-constraint',
            template: __webpack_require__("../../../../../src/app/common/constraint/edit-ifthenconstraint.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/constraint/edit-ifthenconstraint.component.css")],
            viewProviders: [{ provide: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["ControlContainer"], useExisting: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["NgForm"] }]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */]])
    ], EditIfThenConstraintComponent);
    return EditIfThenConstraintComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-notconstraint.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".ng-valid[required], .ng-valid.required  {\n    /*border-left: 5px solid #42A948; !* green *!*/\n}\n\n.ng-invalid:not(form)  {\n    border-left: 5px solid #a94442 !important; /* red */\n}\n\ninput[type=text]{\n    border-width:0px 0px 1px 0px;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-notconstraint.component.html":
/***/ (function(module, exports) {

module.exports = "<div [ngModelGroup]=\"groupName\">\n    <div class=\"ui-g ui-fluid\">\n        <div class=\"ui-g-12 ui-md-2\">\n            <label>NOT Assertion Level: </label>\n        </div>\n        <div class=\"ui-g-12 ui-md-4\">\n            <p-dropdown id=\"notChildMode\" name=\"notChildMode\" required #notChildMode=\"ngModel\" [options]=\"assertionModes\" [(ngModel)]=\"constraint.child.mode\" (onChange)=\"makeConstraintMode(constraint.child)\"></p-dropdown>\n        </div>\n        <div *ngIf=\"constraint.child.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-2\">\n            <label>Complex Type: </label>\n        </div>\n        <div *ngIf=\"constraint.child.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-4\">\n            <p-dropdown id=\"notComplextAssertionType\" name=\"notComplextAssertionType\" required [options]=\"partialComplexAssertionTypes\" [(ngModel)]=\"constraint.child.complexAssertionType\" (onChange)=\"changeComplexAssertionType(constraint.child)\" placeholder=\"Select a complex type\"></p-dropdown>\n        </div>\n    </div>\n    <div class=\"ui-g ui-fluid\">\n        <div class=\"ui-g-12 ui-md-2\">\n            <label>NOT Assertion: </label>\n        </div>\n        <div class=\"ui-g-12 ui-md-10\">\n            <edit-simple-constraint *ngIf=\"constraint.child.mode === 'SIMPLE'\" [constraint]=\"constraint.child\" [idMap]=\"idMap\" [treeData]=\"treeData\" [ifVerb]=\"ifVerb\" [groupName]=\"groupName + '-NotSimple'\"></edit-simple-constraint>\n            <edit-complex-constraint *ngIf=\"constraint.child.mode === 'COMPLEX'\" [constraint]=\"constraint.child\" [idMap]=\"idMap\" [treeData]=\"treeData\" [limited]=\"true\" [ifVerb]=\"ifVerb\" [groupName]=\"groupName + '-NotComplex'\"></edit-complex-constraint>\n        </div>\n    </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-notconstraint.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditNotConstraintComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
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
 * Created by Jungyub on 10/26/17.
 */



var EditNotConstraintComponent = (function () {
    function EditNotConstraintComponent(configService) {
        this.configService = configService;
    }
    EditNotConstraintComponent.prototype.ngOnInit = function () {
        this.andorOptions = [
            { label: 'AND', value: 'AND' },
            { label: 'OR', value: 'OR' }
        ];
        this.verbs = this.configService._simpleConstraintVerbs;
        this.operators = this.configService._operators;
        this.formatTypes = this.configService._formatTypes;
        this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
        this.partialComplexAssertionTypes = this.configService._partialComplexAssertionTypes;
        this.assertionModes = this.configService._assertionModes;
    };
    EditNotConstraintComponent.prototype.makeConstraintMode = function (constraint) {
        constraint.complement = undefined;
        constraint.subject = undefined;
        constraint.complexAssertionType = undefined;
        constraint.assertions = undefined;
        constraint.child = undefined;
        constraint.ifAssertion = undefined;
        constraint.thenAssertion = undefined;
        constraint.operator = undefined;
        constraint.verbKey = undefined;
    };
    EditNotConstraintComponent.prototype.changeComplexAssertionType = function (constraint) {
        if (constraint.complexAssertionType === 'ANDOR') {
            constraint.child = undefined;
            constraint.ifAssertion = undefined;
            constraint.thenAssertion = undefined;
            constraint.operator = 'AND';
            constraint.assertions = [];
            constraint.assertions.push({
                "mode": "SIMPLE"
            });
            constraint.assertions.push({
                "mode": "SIMPLE"
            });
        }
        else if (constraint.complexAssertionType === 'NOT') {
            constraint.assertions = undefined;
            constraint.ifAssertion = undefined;
            constraint.thenAssertion = undefined;
            constraint.child = {
                "mode": "SIMPLE"
            };
        }
        else if (constraint.complexAssertionType === 'IFTHEN') {
            constraint.assertions = undefined;
            constraint.child = undefined;
            constraint.ifAssertion = {
                "mode": "SIMPLE"
            };
            constraint.thenAssertion = {
                "mode": "SIMPLE"
            };
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditNotConstraintComponent.prototype, "constraint", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditNotConstraintComponent.prototype, "idMap", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], EditNotConstraintComponent.prototype, "treeData", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], EditNotConstraintComponent.prototype, "ifVerb", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], EditNotConstraintComponent.prototype, "groupName", void 0);
    EditNotConstraintComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'edit-not-constraint',
            template: __webpack_require__("../../../../../src/app/common/constraint/edit-notconstraint.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/constraint/edit-notconstraint.component.css")],
            viewProviders: [{ provide: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["ControlContainer"], useExisting: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["NgForm"] }]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */]])
    ], EditNotConstraintComponent);
    return EditNotConstraintComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-simpleconstraint.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".ng-valid[required], .ng-valid.required  {\n    /*border-left: 5px solid #42A948; !* green *!*/\n}\n\n.ng-invalid:not(form)  {\n    border-left: 5px solid #a94442 !important; /* red */\n}\n\ninput[type=text]{\n    border-width:0px 0px 1px 0px;\n}\n\n.ui-panel-content{\n    border-bottom: 1px solid #d8d8d8 !important;\n    border-left: 1px solid #d8d8d8 !important;\n    border-right: 1px solid #d8d8d8 !important;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-simpleconstraint.component.html":
/***/ (function(module, exports) {

module.exports = "<div [ngModelGroup]=\"groupName\">\n    <div class=\"ui-g ui-fluid\">\n        <div class=\"ui-g-12 ui-md-2\">\n            <label>Simple Assertion Type: </label>\n        </div>\n        <div class=\"ui-g-12 ui-md-10\">\n            <p-dropdown id=\"simpleAssertionType\" name=\"simpleAssertionType\" required #simpleAssertionType=\"ngModel\" [options]=\"simpleAssertionTypes\" [(ngModel)]=\"constraint.complement.complementKey\" placeholder=\"Select a type\" [group]=\"true\"></p-dropdown>\n            <div *ngIf=\"simpleAssertionType.invalid && (simpleAssertionType.dirty || simpleAssertionType.touched)\" class=\"alert alert-danger\">\n                <div *ngIf=\"simpleAssertionType.errors.required\">\n                    SimpleAssertion Type is required.\n                </div>\n            </div>\n        </div>\n    </div>\n\n\n    <div *ngIf=\"constraint.complement.complementKey\">\n        <div *ngIf=\"constraint.complement.complementKey === 'SAMEVALUE'\">\n            <div class=\"ui-g ui-fluid\">\n                <div class=\"ui-g-12 ui-md-2\">\n                    <label>Assertion: </label>\n                </div>\n                <div class=\"ui-g-12 ui-md-10\">\n                    <display-path [path]=\"constraint.subject.path\" [pathHolder]=\"constraint.subject\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"groupName+'-subject'\"></display-path> <p-dropdown id=\"verb\" name=\"verb\" required #verb=\"ngModel\" [options]=\"verbs\" [(ngModel)]=\"constraint.verbKey\" placeholder=\"Select a verb\"></p-dropdown> contain the constant value '<input id=\"value\" name=\"value\" required #value=\"ngModel\" [(ngModel)]=\"constraint.complement.value\" type=\"text\" style=\"width:100px;\"/>'  <p-checkbox id=\"casesensitive\" name=\"casesensitive\" [(ngModel)]=\"constraint.complement.casesensitive\" binary=\"true\"></p-checkbox> Case Sensitive\n                </div>\n            </div>\n        </div>\n        <div *ngIf=\"constraint.complement.complementKey === 'LISTVALUE'\">\n            <div class=\"ui-g ui-fluid\">\n                <div class=\"ui-g-12 ui-md-2\">\n                    <label>Assertion: </label>\n                </div>\n                <div class=\"ui-g-12 ui-md-10\">\n                    The value of <display-path [path]=\"constraint.subject.path\" [pathHolder]=\"constraint.subject\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"groupName+'-subject'\"></display-path> <p-dropdown id=\"verb\" name=\"verb\" required #verb=\"ngModel\" [options]=\"verbs\" [(ngModel)]=\"constraint.verbKey\" placeholder=\"Select a verb\"></p-dropdown> be one of list values: <span *ngFor=\"let listValueEntry of constraint.complement.values; let idx = index\">'<input id=\"listValue_{{idx}}\" name=\"listValue_{{idx}}\" required [(ngModel)]=\"constraint.complement.values[idx]\" type=\"text\" style=\"width:100px;border-width:0px 0px 1px 0px\"/>'</span> <button pButton type=\"button\"  class=\"blue-btn\" icon=\"fa-plus\" (click)=\"addValue()\"></button>\n                </div>\n            </div>\n        </div>\n\n        <div *ngIf=\"constraint.complement.complementKey === 'COMPARENODE'\">\n            <div class=\"ui-g ui-fluid\">\n                <div class=\"ui-g-12 ui-md-2\">\n                    <label>Assertion: </label>\n                </div>\n                <div class=\"ui-g-12 ui-md-10\">\n                    The value of <display-path [path]=\"constraint.subject.path\" [pathHolder]=\"constraint.subject\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"groupName+'-subject'\"></display-path> <p-dropdown id=\"verb\" name=\"verb\" required #verb=\"ngModel\" [options]=\"verbs\" [(ngModel)]=\"constraint.verbKey\" placeholder=\"Select a verb\"></p-dropdown> <p-dropdown id=\"operator\" name=\"operator\" required #operator=\"ngModel\" [options]=\"operators\" [(ngModel)]=\"constraint.complement.operator\" placeholder=\"Select an operator\"></p-dropdown> <display-path [path]=\"constraint.complement.path\" [pathHolder]=\"constraint.complement\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"groupName+'-other'\"></display-path>\n                </div>\n            </div>\n        </div>\n\n        <div *ngIf=\"constraint.complement.complementKey === 'COMPAREVALUE'\">\n            <div class=\"ui-g ui-fluid\">\n                <div class=\"ui-g-12 ui-md-2\">\n                    <label>Assertion: </label>\n                </div>\n                <div class=\"ui-g-12 ui-md-10\">\n                    The value of <display-path [path]=\"constraint.subject.path\" [pathHolder]=\"constraint.subject\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"groupName+'-subject'\"></display-path> <p-dropdown id=\"verb\" name=\"verb\" required #verb=\"ngModel\" [options]=\"verbs\" [(ngModel)]=\"constraint.verbKey\" placeholder=\"Select a verb\"></p-dropdown> <p-dropdown id=\"operator\" name=\"operator\" required #operator=\"ngModel\" [options]=\"operators\" [(ngModel)]=\"constraint.complement.operator\" placeholder=\"Select an operator\"></p-dropdown> <input id=\"value\" name=\"value\" required #value=\"ngModel\" [(ngModel)]=\"constraint.complement.value\" type=\"text\" style=\"width:100px;border-width:0px 0px 1px 0px\"/>\n                </div>\n            </div>\n        </div>\n        <div *ngIf=\"constraint.complement.complementKey === 'FORMATTED'\">\n            <div class=\"ui-g ui-fluid\">\n                <div class=\"ui-g-12 ui-md-2\">\n                    <label>Assertion: </label>\n                </div>\n                <div class=\"ui-g-12 ui-md-10\">\n                    The value of <display-path [path]=\"constraint.subject.path\" [pathHolder]=\"constraint.subject\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"groupName+'-subject'\"></display-path> <p-dropdown id=\"verb\" name=\"verb\" required #verb=\"ngModel\" [options]=\"verbs\" [(ngModel)]=\"constraint.verbKey\" placeholder=\"Select a verb\"></p-dropdown> <p-dropdown id=\"formatType\" name=\"formatType\" required #formatType=\"ngModel\" [options]=\"formatTypes\" [(ngModel)]=\"constraint.complement.type\" placeholder=\"Select a format type\"></p-dropdown>\n                </div>\n            </div>\n        </div>\n        <div *ngIf=\"constraint.complement.complementKey === 'PRESENCE'\">\n            <div class=\"ui-g ui-fluid\">\n                <div class=\"ui-g-12 ui-md-2\">\n                    <label>Assertion: </label>\n                </div>\n                <div class=\"ui-g-12 ui-md-10\">\n                    The value of <display-path [path]=\"constraint.subject.path\" [pathHolder]=\"constraint.subject\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"groupName+'-subject'\"></display-path> <p-dropdown id=\"verb\" name=\"verb\" required #verb=\"ngModel\" [options]=\"verbs\" [(ngModel)]=\"constraint.verbKey\" placeholder=\"Select a verb\"></p-dropdown> be presence\n                </div>\n            </div>\n        </div>\n    </div>\n\n\n</div>"

/***/ }),

/***/ "../../../../../src/app/common/constraint/edit-simpleconstraint.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditSimpleConstraintComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
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
 * Created by Jungyub on 10/26/17.
 */



var EditSimpleConstraintComponent = (function () {
    function EditSimpleConstraintComponent(configService) {
        this.configService = configService;
    }
    EditSimpleConstraintComponent.prototype.ngOnInit = function () {
        if (!this.constraint.complement)
            this.constraint.complement = {};
        if (!this.constraint.subject)
            this.constraint.subject = {};
        if (this.ifVerb) {
            this.verbs = this.configService._ifConstraintVerbs;
        }
        else {
            this.verbs = this.configService._simpleConstraintVerbs;
        }
        this.operators = this.configService._operators;
        this.formatTypes = this.configService._formatTypes;
        this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
    };
    EditSimpleConstraintComponent.prototype.addValue = function () {
        if (!this.constraint.complement.values)
            this.constraint.complement.values = [];
        this.constraint.complement.values.push('');
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditSimpleConstraintComponent.prototype, "constraint", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], EditSimpleConstraintComponent.prototype, "idMap", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], EditSimpleConstraintComponent.prototype, "treeData", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], EditSimpleConstraintComponent.prototype, "ifVerb", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], EditSimpleConstraintComponent.prototype, "groupName", void 0);
    EditSimpleConstraintComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'edit-simple-constraint',
            template: __webpack_require__("../../../../../src/app/common/constraint/edit-simpleconstraint.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/constraint/edit-simpleconstraint.component.css")],
            viewProviders: [{ provide: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["ControlContainer"], useExisting: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["NgForm"] }]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */]])
    ], EditSimpleConstraintComponent);
    return EditSimpleConstraintComponent;
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

module.exports = "<div (click)=\"goTo()\">\n\n\n\n  <span   *ngIf=\"getScopeLabel()\" class=\"badge\"  [ngClass]=\"{'label-HL7' : getScopeLabel()==='HL7', 'label-USE': getScopeLabel()==='USR','label-MASTER':getScopeLabel()==='MAS','label-PRL':getScopeLabel()==='PRL','label-PVS':getScopeLabel()==='PVS'}\">\n\n  {{getScopeLabel()}} {{getVersion()}}</span> {{getElementLabel()}}\n\n</div>\n\n"

/***/ }),

/***/ "../../../../../src/app/common/label/display-label.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DisplayLabelComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_switchMap__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/switchMap.js");
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
    function DisplayLabelComponent(route, router) {
        this.route = route;
        this.router = router;
    }
    DisplayLabelComponent.prototype.ngOnInit = function () {
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
        if (this.elm.type == 'TEXT') {
            return null;
        }
        if (this.elm.domainInfo && this.elm.domainInfo.scope) {
            var scope = this.elm.domainInfo.scope;
            if (scope === 'HL7STANDARD') {
                return 'HL7';
            }
            else if (scope === 'USER') {
                return 'USR';
            }
            else if (scope === 'MASTER') {
                return 'MAS';
            }
            else if (scope === 'PRELOADED') {
                return 'PRL';
            }
            else if (scope === 'PHINVADS') {
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
            if (type === 'SEGMENT') {
                return this.getSegmentLabel(this.elm);
            }
            else if (type = 'DATATYPE') {
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
            if (type == 'TEXT') {
                return this.elm.label;
            }
        }
        else {
            return this.elm.label;
        }
    };
    DisplayLabelComponent.prototype.getVersion = function () {
        return this.elm.domainInfo.version ? this.elm.domainInfo.version : '';
    };
    ;
    DisplayLabelComponent.prototype.getSegmentLabel = function (elm) {
        if (!elm.ext || elm.ext == '') {
            return elm.label + "-" + elm.description;
        }
        else {
            return elm.label + "_" + elm.ext + elm.description;
        }
    };
    ;
    DisplayLabelComponent.prototype.getDatatypeLabel = function (elm) {
        if (!elm.ext || elm.ext == '') {
            return elm.label + "-" + elm.description;
        }
        else {
            return elm.label + "_" + elm.ext + elm.description;
        }
    };
    ;
    DisplayLabelComponent.prototype.getTableLabel = function (elm) {
        return elm.bindingIdentifier + "-" + elm.label;
    };
    ;
    DisplayLabelComponent.prototype.getMessageLabel = function (elm) {
        return elm.label + "-" + elm.description;
    };
    ;
    DisplayLabelComponent.prototype.getProfileComponentsLabel = function (elm) {
        return elm.label + "-" + elm.description;
    };
    ;
    DisplayLabelComponent.prototype.getCompositeProfileLabel = function (elm) {
        return elm.label + "-" + elm.description;
    };
    ;
    DisplayLabelComponent.prototype.goTo = function () {
        var _this = this;
        console.log(this.elm);
        var type = this.elm.type.toLowerCase();
        var id = "";
        if (type == 'text') {
            type = "section";
            id = this.elm.id;
        }
        else {
            id = this.elm.key.id;
        }
        this.route.queryParams
            .subscribe(function (params) {
            console.log(params); // {order: "popular"}
            _this.router.navigate(["./" + type + "/" + _this.elm.key.id], { preserveQueryParams: true, relativeTo: _this.route, preserveFragment: true });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], DisplayLabelComponent.prototype, "igId", void 0);
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], DisplayLabelComponent);
    return DisplayLabelComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-comment.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".label-segment {\n  color: #0f44f2;\n}\n\n.label-field {\n  color: #f24a08;\n}\n\n.label-component {\n  color: #f2c60d;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-comment.component.html":
/***/ (function(module, exports) {

module.exports = "<span  class=\"badge\">\n<i class=\"fa fa-circle\" *ngIf=\"_from\" [ngClass]=\"{'label-segment' : _from ==='SEGMENT', 'label-component': _from ==='COMPONENT','label-field': _from==='FIELD'}\" aria-hidden=\"true\"></i>  {{_elm.dateupdated}}</span>\n\n"

/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-comment.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DisplayCommentComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_switchMap__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/switchMap.js");
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


var DisplayCommentComponent = (function () {
    function DisplayCommentComponent() {
    }
    DisplayCommentComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(DisplayCommentComponent.prototype, "elm", {
        get: function () {
            return this._elm;
        },
        set: function (obj) {
            this._elm = obj;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayCommentComponent.prototype, "from", {
        get: function () {
            return this._from;
        },
        set: function (obj) {
            this._from = obj;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DisplayCommentComponent.prototype, "elm", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DisplayCommentComponent.prototype, "from", null);
    DisplayCommentComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'display-comment',
            template: __webpack_require__("../../../../../src/app/common/tree-table-label/display-comment.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/tree-table-label/display-comment.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DisplayCommentComponent);
    return DisplayCommentComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-constantvalue.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".label-segment {\n  color: #0f44f2;\n}\n\n.label-field {\n  color: #f24a08;\n}\n\n.label-component {\n  color: #f2c60d;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-constantvalue.component.html":
/***/ (function(module, exports) {

module.exports = "<span  class=\"badge\">\n<i class=\"fa fa-circle\" *ngIf=\"_from\" [ngClass]=\"{'label-segment' : _from ==='SEGMENT', 'label-component': _from ==='COMPONENT','label-field': _from==='FIELD'}\" aria-hidden=\"true\"></i>  {{_elm}}</span>\n\n"

/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-constantvalue.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DisplayConstantValueComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_switchMap__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/switchMap.js");
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


var DisplayConstantValueComponent = (function () {
    function DisplayConstantValueComponent() {
    }
    DisplayConstantValueComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(DisplayConstantValueComponent.prototype, "elm", {
        get: function () {
            return this._elm;
        },
        set: function (obj) {
            this._elm = obj;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConstantValueComponent.prototype, "from", {
        get: function () {
            return this._from;
        },
        set: function (obj) {
            this._from = obj;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DisplayConstantValueComponent.prototype, "elm", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DisplayConstantValueComponent.prototype, "from", null);
    DisplayConstantValueComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'display-constantvalue',
            template: __webpack_require__("../../../../../src/app/common/tree-table-label/display-constantvalue.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/tree-table-label/display-constantvalue.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DisplayConstantValueComponent);
    return DisplayConstantValueComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-ref.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".label-USE {\n  background-color: green;\n  font-weight: 400;\n  color: white;\n}\n\n.label-HL7 {\n  background-color: #f4867e;\n  font-weight: 400;\n}\n\n.label-PRL {\n  background: cornflowerblue;\n  font-weight: 400;\n}\n\n.label-PVS {\n  background: #ed0bea;\n  font-weight: 400;\n}\n\n.label-MASTER {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ff7400+0,ff7400+100;Orange+Flat */\n  background: #ff7400; /* Old browsers */\n  /* FF3.6-15 */\n  /* Chrome10-25,Safari5.1-6 */\n  background: -webkit-gradient(linear, left top, left bottom, from(#ff7400), to(#ff7400));\n  background: linear-gradient(to bottom, #ff7400 0%, #ff7400 100%);\n  /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ff7400',\n  endColorstr='#ff7400', GradientType=0); /* IE6-9 */\n  font-weight: 400;\n}\n\n.version {\n  background: #f6f6f6;\n  font-weight: 400;\n  color: #00037a;\n}\n\n.label-segment {\n  color: #0f44f2;\n}\n\n.label-field {\n  color: #f24a08;\n}\n\n.label-component {\n  color: #f2c60d;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-ref.component.html":
/***/ (function(module, exports) {

module.exports = "<span  class=\"badge\"  [ngClass]=\"{'label-HL7' : getScopeLabel()==='HL7', 'label-USE': getScopeLabel()==='USR','label-MASTER':getScopeLabel()==='MAS','label-PRL':getScopeLabel()==='PRL','label-PVS':getScopeLabel()==='PVS'}\">\n<i class=\"fa fa-circle\" *ngIf=\"_from\" [ngClass]=\"{'label-segment' : _from ==='SEGMENT', 'label-component': _from ==='COMPONENT','label-field': _from==='FIELD'}\" aria-hidden=\"true\"></i>  {{getElementLabel()}} <span class=\"badge version\">{{getVersion()}}</span></span>\n\n"

/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-ref.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DisplayRefComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_switchMap__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/switchMap.js");
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



var DisplayRefComponent = (function () {
    function DisplayRefComponent(route, router) {
        this.route = route;
        this.router = router;
    }
    DisplayRefComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(DisplayRefComponent.prototype, "elm", {
        get: function () {
            return this._elm;
        },
        set: function (obj) {
            this._elm = obj;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayRefComponent.prototype, "from", {
        get: function () {
            return this._from;
        },
        set: function (obj) {
            this._from = obj;
        },
        enumerable: true,
        configurable: true
    });
    DisplayRefComponent.prototype.getScopeLabel = function () {
        if (this.elm.domainInfo && this.elm.domainInfo.scope) {
            var scope = this.elm.domainInfo.scope;
            if (scope === 'HL7STANDARD') {
                return 'HL7';
            }
            else if (scope === 'USER') {
                return 'USR';
            }
            else if (scope === 'MASTER') {
                return 'MAS';
            }
            else if (scope === 'PRELOADED') {
                return 'PRL';
            }
            else if (scope === 'PHINVADS') {
                return 'PVS';
            }
            else {
                return null;
            }
        }
        return null;
    };
    DisplayRefComponent.prototype.getElementLabel = function () {
        return this.elm.label;
    };
    DisplayRefComponent.prototype.getVersion = function () {
        return this.elm.domainInfo.version ? this.elm.domainInfo.version : '';
    };
    ;
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DisplayRefComponent.prototype, "elm", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DisplayRefComponent.prototype, "from", null);
    DisplayRefComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'display-ref',
            template: __webpack_require__("../../../../../src/app/common/tree-table-label/display-ref.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/tree-table-label/display-ref.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], DisplayRefComponent);
    return DisplayRefComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-singlecode.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".label-segment {\n  color: #0f44f2;\n}\n\n.label-field {\n  color: #f24a08;\n}\n\n.label-component {\n  color: #f2c60d;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-singlecode.component.html":
/***/ (function(module, exports) {

module.exports = "<span  class=\"badge\">\n<i class=\"fa fa-circle\" *ngIf=\"_from\" [ngClass]=\"{'label-segment' : _from ==='SEGMENT', 'label-component': _from ==='COMPONENT','label-field': _from==='FIELD'}\" aria-hidden=\"true\"></i>  {{_elm.value}} <== {{_elm.codeSystem}}</span>\n\n"

/***/ }),

/***/ "../../../../../src/app/common/tree-table-label/display-singlecode.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DisplaySingleCodeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_switchMap__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/switchMap.js");
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


var DisplaySingleCodeComponent = (function () {
    function DisplaySingleCodeComponent() {
    }
    DisplaySingleCodeComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(DisplaySingleCodeComponent.prototype, "elm", {
        get: function () {
            return this._elm;
        },
        set: function (obj) {
            this._elm = obj;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplaySingleCodeComponent.prototype, "from", {
        get: function () {
            return this._from;
        },
        set: function (obj) {
            this._from = obj;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DisplaySingleCodeComponent.prototype, "elm", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DisplaySingleCodeComponent.prototype, "from", null);
    DisplaySingleCodeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'display-singlecode',
            template: __webpack_require__("../../../../../src/app/common/tree-table-label/display-singlecode.component.html"),
            styles: [__webpack_require__("../../../../../src/app/common/tree-table-label/display-singlecode.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DisplaySingleCodeComponent);
    return DisplaySingleCodeComponent;
}());



/***/ }),

/***/ "../../../../../src/app/guards/save.guard.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SaveFormsGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_primeng_components_common_api__ = __webpack_require__("../../../../primeng/components/common/api.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_primeng_components_common_api___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_primeng_components_common_api__);
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



var SaveFormsGuard = (function () {
    function SaveFormsGuard(confirmationService) {
        this.confirmationService = confirmationService;
    }
    SaveFormsGuard.prototype.canDeactivate = function (component) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // if (!component.isValid()) {
            //   console.log("invalid form");
            //
            //   this.getDialog(component, resolve , reject);
            // }
            if (_this.compareHash(component.getBackup(), component.getCurrent())) {
                resolve(true);
            }
            else {
                component.save().then(function (x) {
                    console.log("Segment saved");
                    resolve(true);
                }, function (error) {
                    console.log("error saving");
                    reject(false);
                });
            }
        });
    };
    SaveFormsGuard.prototype.compareHash = function (obj1, obj2) {
        return __WEBPACK_IMPORTED_MODULE_2_ts_md5_dist_md5__["Md5"].hashStr(JSON.stringify(obj1)) == __WEBPACK_IMPORTED_MODULE_2_ts_md5_dist_md5__["Md5"].hashStr(JSON.stringify(obj2));
    };
    SaveFormsGuard.prototype.getDialog = function (component, resolve, reject) {
        this.confirmationService.confirm({
            message: "You have invalid Data. You cannot leave the page. Please fix you data ",
            accept: function () {
                resolve(false);
            },
            reject: function () {
                resolve(false);
            }
        });
    };
    SaveFormsGuard = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_primeng_components_common_api__["ConfirmationService"]])
    ], SaveFormsGuard);
    return SaveFormsGuard;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-conformancestatements/datatype-edit-conformancestatements.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".ng-valid[required], .ng-valid.required  {\n  /*border-left: 5px solid #42A948; !* green *!*/\n}\n\n.ng-invalid:not(form)  {\n  border-left: 5px solid #a94442 !important; /* red */\n}\n\ninput[type=text]{\n  border-width:0px 0px 1px 0px;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-conformancestatements/datatype-edit-conformancestatements.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"datatypeConformanceStatements\">\n    <h1>Conformance Statements</h1>\n    <form #csForm=\"ngForm\">\n        <p-accordion (onOpen)=\"onTabOpen($event)\">\n            <p-accordionTab header=\"List of Conformance Statements\" [(selected)]=\"listTab\">\n                <p-table [columns]=\"cols\" [value]=\"datatypeConformanceStatements.conformanceStatements\" [reorderableColumns]=\"true\" [resizableColumns]=\"true\">\n                    <ng-template pTemplate=\"header\" let-columns>\n                        <tr>\n                            <th style=\"width:3em\"></th>\n\n\n                            <th *ngFor=\"let col of columns\" pReorderableColumn [pSortableColumn]=\"col.sort\" [ngStyle]=\"col.colStyle\" pResizableColumn>\n                                {{col.header}}\n                                <p-sortIcon *ngIf=\"col.colStyle\" [field]=\"col.field\"></p-sortIcon>\n                            </th>\n\n                            <th style=\"width:15em\" pReorderableColumn>Actions</th>\n                        </tr>\n                    </ng-template>\n                    <ng-template pTemplate=\"body\" let-rowData let-columns=\"columns\" let-index=\"rowIndex\">\n                        <tr [pReorderableRow]=\"index\">\n                            <td>\n                                <i class=\"fa fa-bars\" pReorderableRowHandle></i>\n                            </td>\n                            <td *ngFor=\"let col of columns\" class=\"ui-resizable-column\">\n                                <div *ngIf=\"col.field === 'identifier'\">\n                                    {{rowData[col.field]}}\n                                </div>\n                                <div *ngIf=\"col.field === 'description'\">\n                                    <div *ngIf=\"rowData['type'] === 'FREE'\">\n                                        {{rowData['freeText']}}\n                                    </div>\n                                    <div *ngIf=\"rowData['type'] === 'ASSERTION'\">\n                                        {{rowData['assertion'].description}}\n                                    </div>\n                                </div>\n                            </td>\n                            <td>\n                                <button pButton style=\"float: right\" type=\"button\"  class=\"ui-button-warning\" icon=\"fa-times\" label=\"Delete\" (click)=\"deleteCS(rowData['identifier'])\"></button>\n                                <button pButton style=\"float: right\" type=\"button\"  class=\"ui-button-info\" icon=\"fa-pencil\" label=\"Edit\" (click)=\"selectCS(rowData)\"></button>\n                            </td>\n                        </tr>\n                    </ng-template>\n                </p-table>\n\n\n            </p-accordionTab>\n            <p-accordionTab header=\"Conformance Statement Editor\" [(selected)]=\"editorTab\">\n                <div class=\"ui-g ui-fluid\">\n                    <div class=\"ui-g-12 ui-md-2\">\n                        <label>Editor Type: </label>\n                    </div>\n                    <div class=\"ui-g-12 ui-md-10\">\n                        <p-selectButton name=\"type\" [options]=\"constraintTypes\" [(ngModel)]=\"selectedConformanceStatement.type\" (onChange)=\"changeType()\"></p-selectButton>\n                    </div>\n                </div>\n\n                <div *ngIf=\"selectedConformanceStatement.type\">\n                    <div class=\"ui-g ui-fluid\">\n                        <div class=\"ui-g-12 ui-md-2\">\n                            <label for=\"id\">ID: </label>\n                        </div>\n                        <div class=\"ui-g-12 ui-md-10\">\n                            <input id=\"id\" name=\"id\" required minlength=\"2\" [(ngModel)]=\"selectedConformanceStatement.identifier\" type=\"text\" #id=\"ngModel\" style=\"width:50%;\"/>\n                            <div *ngIf=\"id.invalid && (id.dirty || id.touched)\" class=\"alert alert-danger\">\n                                <div *ngIf=\"id.errors.required\">\n                                    Constraint Id is required.\n                                </div>\n                                <div *ngIf=\"id.errors.minlength\">\n                                    Constraint Id must be at least 2 characters long.\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n\n                <div *ngIf=\"selectedConformanceStatement.type && selectedConformanceStatement.type ==='ASSERTION'\">\n                    <div class=\"ui-g ui-fluid\">\n                        <div class=\"ui-g-12 ui-md-2\">\n                            <label>Assertion Level: </label>\n                        </div>\n                        <div class=\"ui-g-12 ui-md-10\">\n                            <p-dropdown id=\"assertionMode\" name=\"assertionMode\" required #assertionMode=\"ngModel\" [options]=\"assertionModes\" [(ngModel)]=\"selectedConformanceStatement.assertion.mode\" (onChange)=\"changeAssertionMode()\"></p-dropdown>\n                            <div *ngIf=\"assertionMode.invalid && (assertionMode.dirty || assertionMode.touched)\" class=\"alert alert-danger\">\n                                <div *ngIf=\"assertionMode.errors.required\">\n                                    Assertion Type is required.\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <edit-free-constraint *ngIf=\"selectedConformanceStatement.type === 'FREE'\" [constraint]=\"selectedConformanceStatement\"></edit-free-constraint>\n                <edit-simple-constraint *ngIf=\"selectedConformanceStatement.assertion && selectedConformanceStatement.assertion.mode === 'SIMPLE'\" [constraint]=\"selectedConformanceStatement.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'rootSimple'\"></edit-simple-constraint>\n                <edit-complex-constraint *ngIf=\"selectedConformanceStatement.assertion && selectedConformanceStatement.assertion.mode === 'COMPLEX'\" [constraint]=\"selectedConformanceStatement.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'root'\"></edit-complex-constraint>\n\n                <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-plus\" label=\"Submit\" (click)=\"submitCS()\" [disabled]=\"csForm.invalid\"></button>\n                <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-print\" label=\"Print\" (click)=\"printCS(selectedConformanceStatement)\"></button>\n            </p-accordionTab>\n        </p-accordion>\n    </form>\n</div>"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-conformancestatements/datatype-edit-conformancestatements.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypeEditConformanceStatementsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore__ = __webpack_require__("../../../../underscore/underscore.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_constraints_constraints_service__ = __webpack_require__("../../../../../src/app/service/constraints/constraints.service.ts");
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
 * Created by Jungyub on 10/23/17.
 */







var DatatypeEditConformanceStatementsComponent = (function () {
    function DatatypeEditConformanceStatementsComponent(route, router, datatypesService, configService, constraintsService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.datatypesService = datatypesService;
        this.configService = configService;
        this.constraintsService = constraintsService;
        this.constraintTypes = [];
        this.assertionModes = [];
        this.selectedConformanceStatement = {};
        this.listTab = true;
        this.editorTab = false;
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
        this.cols = [
            { field: 'identifier', header: 'ID', colStyle: { width: '20em' }, sort: 'identifier' },
            { field: 'description', header: 'Description' }
        ];
    }
    DatatypeEditConformanceStatementsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
        this.idMap = {};
        this.treeData = [];
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypeConformanceStatements(this.datatypeId).then(function (conformanceStatementData) {
            _this.datatypeConformanceStatements = conformanceStatementData;
        });
        this.datatypesService.getDatatypeStructure(this.datatypeId).then(function (dtStructure) {
            _this.idMap[_this.datatypeId] = { name: dtStructure.name };
            var rootData = { elementId: _this.datatypeId };
            for (var _i = 0, _a = dtStructure.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var childData = JSON.parse(JSON.stringify(rootData));
                childData.child = {
                    elementId: child.data.id,
                };
                if (child.data.max === '1') {
                    childData.child.instanceParameter = '1';
                }
                else if (child.data.max) {
                    childData.child.instanceParameter = '*';
                }
                else {
                    childData.child.instanceParameter = '1';
                }
                var treeNode = {
                    label: child.data.name,
                    data: childData,
                    expandedIcon: "fa-folder-open",
                    collapsedIcon: "fa-folder",
                };
                var data = {
                    id: child.data.id,
                    name: child.data.name,
                    max: child.data.max,
                    position: child.data.position,
                    usage: child.data.usage,
                    dtId: child.data.ref.id
                };
                _this.idMap[_this.datatypeId + '-' + data.id] = data;
                _this.popChild(_this.datatypeId + '-' + data.id, data.dtId, treeNode);
                _this.treeData.push(treeNode);
            }
        });
    };
    DatatypeEditConformanceStatementsComponent.prototype.popChild = function (id, dtId, parentTreeNode) {
        var _this = this;
        this.datatypesService.getDatatypeStructure(dtId).then(function (dtStructure) {
            _this.idMap[id].dtName = dtStructure.name;
            if (dtStructure.children) {
                for (var _i = 0, _a = dtStructure.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var childData = JSON.parse(JSON.stringify(parentTreeNode.data));
                    _this.makeChild(childData, child.data.id, '1');
                    var treeNode = {
                        label: child.data.name,
                        data: childData,
                        expandedIcon: "fa-folder-open",
                        collapsedIcon: "fa-folder",
                    };
                    var data = {
                        id: child.data.id,
                        name: child.data.name,
                        max: "1",
                        position: child.data.position,
                        usage: child.data.usage,
                        dtId: child.data.ref.id
                    };
                    _this.idMap[id + '-' + data.id] = data;
                    _this.popChild(id + '-' + data.id, data.dtId, treeNode);
                    if (!parentTreeNode.children)
                        parentTreeNode.children = [];
                    parentTreeNode.children.push(treeNode);
                }
            }
        });
    };
    DatatypeEditConformanceStatementsComponent.prototype.makeChild = function (data, id, para) {
        if (data.child)
            this.makeChild(data.child, id, para);
        else
            data.child = {
                elementId: id,
                instanceParameter: para
            };
    };
    DatatypeEditConformanceStatementsComponent.prototype.changeType = function () {
        if (this.selectedConformanceStatement.type == 'ASSERTION') {
            this.selectedConformanceStatement.assertion = {};
            this.selectedConformanceStatement.assertion = { mode: "SIMPLE" };
        }
        else if (this.selectedConformanceStatement.type == 'FREE') {
            this.selectedConformanceStatement.assertion = undefined;
        }
        else if (this.selectedConformanceStatement.type == 'PREDEFINEDPATTERNS') {
            this.selectedConformanceStatement.assertion = undefined;
        }
        else if (this.selectedConformanceStatement.type == 'PREDEFINED') {
            this.selectedConformanceStatement.assertion = undefined;
        }
    };
    DatatypeEditConformanceStatementsComponent.prototype.changeAssertionMode = function () {
        if (this.selectedConformanceStatement.assertion.mode == 'SIMPLE') {
            this.selectedConformanceStatement.assertion = { mode: "SIMPLE" };
        }
        else if (this.selectedConformanceStatement.assertion.mode == 'COMPLEX') {
            this.selectedConformanceStatement.assertion = { mode: "COMPLEX" };
        }
    };
    DatatypeEditConformanceStatementsComponent.prototype.submitCS = function () {
        if (this.selectedConformanceStatement.type === 'ASSERTION')
            this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedConformanceStatement.assertion, this.idMap);
        this.deleteCS(this.selectedConformanceStatement.identifier);
        this.datatypeConformanceStatements.conformanceStatements.push(this.selectedConformanceStatement);
        this.selectedConformanceStatement = {};
        this.editorTab = false;
        this.listTab = true;
    };
    DatatypeEditConformanceStatementsComponent.prototype.selectCS = function (cs) {
        this.selectedConformanceStatement = JSON.parse(JSON.stringify(cs));
        this.editorTab = true;
        this.listTab = false;
    };
    DatatypeEditConformanceStatementsComponent.prototype.deleteCS = function (identifier) {
        this.datatypeConformanceStatements.conformanceStatements = __WEBPACK_IMPORTED_MODULE_4_underscore__["_"].without(this.datatypeConformanceStatements.conformanceStatements, __WEBPACK_IMPORTED_MODULE_4_underscore__["_"].findWhere(this.datatypeConformanceStatements.conformanceStatements, { identifier: identifier }));
    };
    DatatypeEditConformanceStatementsComponent.prototype.printCS = function (cs) {
        console.log(cs);
    };
    DatatypeEditConformanceStatementsComponent.prototype.onTabOpen = function (e) {
        if (e.index === 0)
            this.selectedConformanceStatement = {};
    };
    DatatypeEditConformanceStatementsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-conformancestatements/datatype-edit-conformancestatements.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-conformancestatements/datatype-edit-conformancestatements.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"],
            __WEBPACK_IMPORTED_MODULE_3__service_datatypes_datatypes_service__["a" /* DatatypesService */],
            __WEBPACK_IMPORTED_MODULE_5__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */],
            __WEBPACK_IMPORTED_MODULE_6__service_constraints_constraints_service__["a" /* ConstraintsService */]])
    ], DatatypeEditConformanceStatementsComponent);
    return DatatypeEditConformanceStatementsComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-edit-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypeEditRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__datatype_structure_datatype_edit_structure_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-structure/datatype-edit-structure.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__datatype_conformancestatements_datatype_edit_conformancestatements_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-conformancestatements/datatype-edit-conformancestatements.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__datatype_metadata_datatype_edit_metadata_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-metadata/datatype-edit-metadata.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__datatype_predef_datatype_edit_predef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-predef/datatype-edit-predef.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__datatype_postdef_datatype_edit_postdef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-postdef/datatype-edit-postdef.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by hnt5 on 10/23/17.
 */







var DatatypeEditRoutingModule = (function () {
    function DatatypeEditRoutingModule() {
    }
    DatatypeEditRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_router__["RouterModule"].forChild([
                    {
                        path: ':datatypeId', component: __WEBPACK_IMPORTED_MODULE_2__datatype_structure_datatype_edit_structure_component__["a" /* DatatypeEditStructureComponent */],
                    },
                    {
                        path: ':datatypeId/structure', component: __WEBPACK_IMPORTED_MODULE_2__datatype_structure_datatype_edit_structure_component__["a" /* DatatypeEditStructureComponent */],
                    },
                    {
                        path: ':datatypeId/metadata', component: __WEBPACK_IMPORTED_MODULE_4__datatype_metadata_datatype_edit_metadata_component__["a" /* DatatypeEditMetadataComponent */],
                    },
                    {
                        path: ':datatypeId/preDef', component: __WEBPACK_IMPORTED_MODULE_5__datatype_predef_datatype_edit_predef_component__["a" /* DatatypeEditPredefComponent */],
                    },
                    {
                        path: ':datatypeId/postDef', component: __WEBPACK_IMPORTED_MODULE_6__datatype_postdef_datatype_edit_postdef_component__["a" /* DatatypeEditPostdefComponent */],
                    },
                    {
                        path: ':datatypeId/conformanceStatement', component: __WEBPACK_IMPORTED_MODULE_3__datatype_conformancestatements_datatype_edit_conformancestatements_component__["a" /* DatatypeEditConformanceStatementsComponent */],
                    }
                ])
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_router__["RouterModule"]
            ]
        })
    ], DatatypeEditRoutingModule);
    return DatatypeEditRoutingModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-edit.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DatatypeEditModule", function() { return DatatypeEditModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__datatype_edit_routing_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-edit-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_primeng_components_tabmenu_tabmenu__ = __webpack_require__("../../../../primeng/components/tabmenu/tabmenu.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_primeng_components_tabmenu_tabmenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_primeng_components_tabmenu_tabmenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_components_treetable_treetable__ = __webpack_require__("../../../../primeng/components/treetable/treetable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_components_treetable_treetable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_primeng_components_treetable_treetable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_components_dialog_dialog__ = __webpack_require__("../../../../primeng/components/dialog/dialog.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_components_dialog_dialog___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_primeng_components_dialog_dialog__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_components_dropdown_dropdown__ = __webpack_require__("../../../../primeng/components/dropdown/dropdown.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_components_dropdown_dropdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_primeng_components_dropdown_dropdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_utils_module__ = __webpack_require__("../../../../../src/app/utils/utils.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_primeng_button__ = __webpack_require__("../../../../primeng/button.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_primeng_button___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_primeng_button__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_primeng_accordion__ = __webpack_require__("../../../../primeng/accordion.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_primeng_accordion___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_primeng_accordion__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_primeng_selectbutton__ = __webpack_require__("../../../../primeng/selectbutton.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_primeng_selectbutton___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_primeng_selectbutton__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_primeng_table__ = __webpack_require__("../../../../primeng/table.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_primeng_table___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_primeng_table__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__datatype_structure_datatype_edit_structure_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-structure/datatype-edit-structure.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__datatype_conformancestatements_datatype_edit_conformancestatements_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-conformancestatements/datatype-edit-conformancestatements.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__datatype_metadata_datatype_edit_metadata_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-metadata/datatype-edit-metadata.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__datatype_postdef_datatype_edit_postdef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-postdef/datatype-edit-postdef.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__datatype_predef_datatype_edit_predef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-predef/datatype-edit-predef.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_angular_froala_wysiwyg__ = __webpack_require__("../../../../angular-froala-wysiwyg/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by hnt5 on 10/23/17.
 */



















var DatatypeEditModule = (function () {
    function DatatypeEditModule() {
    }
    DatatypeEditModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_5__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_3_primeng_components_tabmenu_tabmenu__["TabMenuModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_components_dialog_dialog__["DialogModule"],
                __WEBPACK_IMPORTED_MODULE_7_primeng_components_dropdown_dropdown__["DropdownModule"],
                __WEBPACK_IMPORTED_MODULE_2__datatype_edit_routing_module__["a" /* DatatypeEditRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_8__utils_utils_module__["a" /* UtilsModule */],
                __WEBPACK_IMPORTED_MODULE_4_primeng_components_treetable_treetable__["TreeTableModule"],
                __WEBPACK_IMPORTED_MODULE_9_primeng_button__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_10_primeng_accordion__["AccordionModule"],
                __WEBPACK_IMPORTED_MODULE_11_primeng_selectbutton__["SelectButtonModule"],
                __WEBPACK_IMPORTED_MODULE_12_primeng_table__["TableModule"],
                __WEBPACK_IMPORTED_MODULE_18_angular_froala_wysiwyg__["a" /* FroalaEditorModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_18_angular_froala_wysiwyg__["b" /* FroalaViewModule */].forRoot()
            ],
            providers: [],
            declarations: [__WEBPACK_IMPORTED_MODULE_13__datatype_structure_datatype_edit_structure_component__["a" /* DatatypeEditStructureComponent */], __WEBPACK_IMPORTED_MODULE_14__datatype_conformancestatements_datatype_edit_conformancestatements_component__["a" /* DatatypeEditConformanceStatementsComponent */], __WEBPACK_IMPORTED_MODULE_15__datatype_metadata_datatype_edit_metadata_component__["a" /* DatatypeEditMetadataComponent */], __WEBPACK_IMPORTED_MODULE_16__datatype_postdef_datatype_edit_postdef_component__["a" /* DatatypeEditPostdefComponent */], __WEBPACK_IMPORTED_MODULE_17__datatype_predef_datatype_edit_predef_component__["a" /* DatatypeEditPredefComponent */]],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["CUSTOM_ELEMENTS_SCHEMA"]]
        })
    ], DatatypeEditModule);
    return DatatypeEditModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-metadata/datatype-edit-metadata.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".sg-bar {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f2f5f6+0,e3eaed+37,c8d7dc+100;Grey+3D+%234 */\n  background: #f2f5f6; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n  background: -webkit-gradient(linear, left top, left bottom, from(#f2f5f6),color-stop(37%, #e3eaed),to(#c8d7dc));\n  background: linear-gradient(to bottom, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f5f6', endColorstr='#c8d7dc',GradientType=0 ); /* IE6-9 */\n\n\n  padding-bottom: 10px;\n  padding-top   : 10px;\n  font-size : 24px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-metadata/datatype-edit-metadata.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>Datatype Metadata</h2>\n<div *ngIf=\"datatypeMetadata\">\n    <form #datatypeMetadataForm=\"ngForm\">\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Name\n            </label>\n            <input name=\"name\" id=\"name\" pInputText type=\"text\" disabled class=\"ui-g-10\" #name=\"ngModel\" [(ngModel)]=\"datatypeMetadata.name\" required />\n            <div class=\"ui-g-offset-1\" *ngIf=\"name.invalid&& (name.dirty || name.touched)\">\n                <p-message severity=\"error\" text=\"Name is required\"></p-message>\n            </div>\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Flavor Name (Ext)\n            </label>\n            <input name=\"ext\" id=\"ext\" pInputText type=\"text\" class=\"ui-g-10\" #ext=\"ngModel\" [(ngModel)]=\"datatypeMetadata.ext\" required />\n            <div class=\"ui-g-offset-1\" *ngIf=\"ext.invalid && (ext.dirty || ext.touched)\">\n                <p-message severity=\"error\" text=\"Extension is required\"></p-message>\n            </div>\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Description\n            </label>\n            <input name=\"description\" id=\"description\" pInputText type=\"text\" class=\"ui-g-10\" #description=\"ngModel\" [(ngModel)]=\"datatypeMetadata.description\" />\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Author Notes\n            </label>\n            <div class=\"ui-g-10\" [froalaEditor] [(froalaModel)]=\"datatypeMetadata.authorNote\"></div>\n        </div>\n    </form>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-metadata/datatype-edit-metadata.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypeEditMetadataComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
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
/**
 * Created by Jungyub on 10/23/17.
 */





var DatatypeEditMetadataComponent = (function () {
    function DatatypeEditMetadataComponent(indexedDbService, route, router, datatypesService) {
        var _this = this;
        this.indexedDbService = indexedDbService;
        this.route = route;
        this.router = router;
        this.datatypesService = datatypesService;
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
    }
    DatatypeEditMetadataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypeMetadata(this.datatypeId).then(function (metadata) {
            _this.datatypeMetadata = metadata;
        });
    };
    DatatypeEditMetadataComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-metadata/datatype-edit-metadata.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-metadata/datatype-edit-metadata.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__service_datatypes_datatypes_service__["a" /* DatatypesService */]])
    ], DatatypeEditMetadataComponent);
    return DatatypeEditMetadataComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-postdef/datatype-edit-postdef.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".sg-bar {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f2f5f6+0,e3eaed+37,c8d7dc+100;Grey+3D+%234 */\n  background: #f2f5f6; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n  background: -webkit-gradient(linear, left top, left bottom, from(#f2f5f6),color-stop(37%, #e3eaed),to(#c8d7dc));\n  background: linear-gradient(to bottom, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f5f6', endColorstr='#c8d7dc',GradientType=0 ); /* IE6-9 */\n\n\n  padding-bottom: 10px;\n  padding-top   : 10px;\n  font-size : 24px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-postdef/datatype-edit-postdef.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>Datatype Post Definition TEXT</h2>\n<div *ngIf=\"datatypePostdef\">\n    <div class=\"ui-g input-box\">\n        <div class=\"ui-g-12\" [froalaEditor] [(froalaModel)]=\"datatypePostdef.postDef\"></div>\n    </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-postdef/datatype-edit-postdef.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypeEditPostdefComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
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
 * Created by Jungyub on 10/23/17.
 */




var DatatypeEditPostdefComponent = (function () {
    function DatatypeEditPostdefComponent(route, router, datatypesService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.datatypesService = datatypesService;
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
    }
    DatatypeEditPostdefComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypePostDef(this.datatypeId).then(function (data) {
            _this.datatypePostdef = data;
        });
    };
    DatatypeEditPostdefComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-postdef/datatype-edit-postdef.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-postdef/datatype-edit-postdef.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__service_datatypes_datatypes_service__["a" /* DatatypesService */]])
    ], DatatypeEditPostdefComponent);
    return DatatypeEditPostdefComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-predef/datatype-edit-predef.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".sg-bar {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f2f5f6+0,e3eaed+37,c8d7dc+100;Grey+3D+%234 */\n  background: #f2f5f6; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n  background: -webkit-gradient(linear, left top, left bottom, from(#f2f5f6),color-stop(37%, #e3eaed),to(#c8d7dc));\n  background: linear-gradient(to bottom, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f5f6', endColorstr='#c8d7dc',GradientType=0 ); /* IE6-9 */\n\n\n  padding-bottom: 10px;\n  padding-top   : 10px;\n  font-size : 24px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-predef/datatype-edit-predef.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>Datatype Pre Definition TEXT</h2>\n<div *ngIf=\"datatypePredef\">\n    <div class=\"ui-g input-box\">\n        <div class=\"ui-g-12\" [froalaEditor] [(froalaModel)]=\"datatypePredef.preDef\"></div>\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-predef/datatype-edit-predef.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypeEditPredefComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
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
 * Created by Jungyub on 10/23/17.
 */




var DatatypeEditPredefComponent = (function () {
    function DatatypeEditPredefComponent(route, router, datatypesService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.datatypesService = datatypesService;
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
    }
    DatatypeEditPredefComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypePreDef(this.datatypeId).then(function (data) {
            _this.datatypePredef = data;
        });
    };
    DatatypeEditPredefComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-predef/datatype-edit-predef.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-predef/datatype-edit-predef.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__service_datatypes_datatypes_service__["a" /* DatatypesService */]])
    ], DatatypeEditPredefComponent);
    return DatatypeEditPredefComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-structure/datatype-edit-structure.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".sg-bar {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f2f5f6+0,e3eaed+37,c8d7dc+100;Grey+3D+%234 */\n  background: #f2f5f6; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n  background: -webkit-gradient(linear, left top, left bottom, from(#f2f5f6),color-stop(37%, #e3eaed),to(#c8d7dc));\n  background: linear-gradient(to bottom, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f5f6', endColorstr='#c8d7dc',GradientType=0 ); /* IE6-9 */\n\n\n  padding-bottom: 10px;\n  padding-top   : 10px;\n  font-size : 24px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-structure/datatype-edit-structure.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>Datatype Structure</h2>\n\n<div *ngIf=\"datatypeStructure\">\n    <p-treeTable [value]=\"datatypeStructure.children\" tableStyleClass=\"table-condensed table-stripped table-bordered\" (onNodeExpand)=\"loadNode($event)\">\n\n        <p-column header=\"Name\" [style]=\"{'width':'350px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <display-badge [type]=\"node.data.displayData.type\"></display-badge>{{node.data.position}}. {{node.data.name}}\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Usage\" [style]=\"{'width':'190px'}\" >\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\" >\n                <div *ngIf=\"node.data.displayData.type === 'COMPONENT'\">\n                    <p-dropdown *ngIf=\"node.data.usage !== 'C'\" [options]=\"usages\" [(ngModel)]=\"node.data.usage\" appendTo=\"body\" (onChange)=\"onUsageChange(node)\" [style]=\"{'width' : '100%'}\"></p-dropdown>\n                    <div *ngIf=\"node.data.usage === 'C'\">\n                        <p-dropdown [options]=\"usages\" [(ngModel)]=\"node.data.usage\" appendTo=\"body\" (onChange)=\"onUsageChange(node)\" [style]=\"{'width' : '30%'}\"></p-dropdown>\n                        (<p-dropdown [options]=\"cUsages\" [(ngModel)]=\"node.data.displayData.datatypeBinding.predicate.trueUsage\" appendTo=\"body\" [style]=\"{'width' : '30%'}\"></p-dropdown>/\n                        <p-dropdown [options]=\"cUsages\" [(ngModel)]=\"node.data.displayData.datatypeBinding.predicate.falseUsage\" appendTo=\"body\" [style]=\"{'width' : '30%'}\"></p-dropdown>)\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.type === 'SUBCOMPONENT'\">\n                    <div *ngIf=\"node.data.usage !== 'C' || !node.data.displayData.componentDTbinding || !node.data.displayData.componentDTbinding.predicate\">{{node.data.usage}}</div>\n                    <div *ngIf=\"node.data.usage === 'C' && node.data.displayData.componentDTbinding && node.data.displayData.componentDTbinding.predicate\">C({{node.data.displayData.componentDTbinding.predicate.trueUsage}}/{{node.data.displayData.componentDTbinding.predicate.falseUsage}})</div>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Length\" [style]=\"{'width':'150px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'COMPONENT'\">\n                    <div *ngIf=\"node.data.minLength !== 'NA' && node.data.displayData.datatype.leaf\">\n                        <input [(ngModel)]=\"node.data.minLength\" type=\"number\" style=\"width:40%;border-width:0px 0px 1px 0px\"/>\n                        <input [(ngModel)]=\"node.data.maxLength\" type=\"text\" style=\"width:40%;border-width:0px 0px 1px 0px\"/>\n                        <i class=\"fa fa-times\" (click)=\"delLength(node)\" style=\"width:20%;\"></i>\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.type !== 'COMPONENT'\">\n                    [{{node.data.minLength}}..{{node.data.maxLength}}]\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Conf. Length\" [style]=\"{'width':'120px'}\" >\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'COMPONENT'\">\n                    <ng-container *ngIf=\"node.data.confLength !== 'NA' && node.data.displayData.datatype.leaf\">\n                        <input [(ngModel)]=\"node.data.confLength\" type=\"text\" style=\"width: 80%;border-width:0px 0px 1px 0px\"/>\n                        <i class=\"fa fa-times\" (click)=\"delConfLength(node)\" style=\"width:20%;\"></i>\n                    </ng-container>\n                </div>\n                <div *ngIf=\"node.data.displayData.type !== 'COMPONENT'\">\n                    {{node.data.confLength}}\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Datatype\" [style]=\"{'width':'200px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"!node.data.displayData.datatype.edit\">\n                    <display-ref [elm]=\"node.data.displayData.datatype\"></display-ref>\n                    <i class=\"fa fa-pencil\" *ngIf=\"node.data.displayData.type === 'COMPONENT'\" (click)=\"makeEditModeForDatatype(node)\"></i>\n                </div>\n                <div *ngIf=\"node.data.displayData.datatype.edit\">\n                    <p-dropdown [options]=\"node.data.displayData.datatype.dtOptions\" [(ngModel)]=\"node.data.displayData.datatype.id\" (onChange)=\"onDatatypeChange(node)\" appendTo=\"body\" [style]=\"{'width':'100%'}\">\n                        <ng-template let-option pTemplate=\"body\">\n                            <div class=\"ui-helper-clearfix\" style=\"position: relative;height: 25px;\">\n                                <display-ref *ngIf=\"option.value\" [elm]=\"getDatatypeElm(option.value)\"></display-ref>\n                                <span *ngIf=\"!option.value\" (click)=\"node.data.displayData.datatype.dtOptions = datatypeOptions\">{{option.label}}</span>\n                            </div>\n                        </ng-template>\n                    </p-dropdown>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"ValueSet\" [style]=\"{'width':valuesetColumnWidth}\">\n            <ng-template let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.valuesetAllowed && !node.data.displayData.hasSingleCode\">\n                    <div *ngIf=\"node.data.displayData.datatypeBinding\">\n                        <div *ngFor=\"let vs of node.data.displayData.datatypeBinding.valuesetBindings\">\n                            <div *ngIf=\"!vs.edit\">\n                                <display-ref [elm]=\"vs\" [from]=\"'DATATYPE'\"></display-ref>\n                                <i class=\"fa fa-pencil\" (click)=\"makeEditModeForValueSet(vs)\" style=\"width:20%;\"></i>\n                                <i class=\"fa fa-times\" (click)=\"delValueSetBinding(node.data.displayData.datatypeBinding, vs, node.data.displayData)\" style=\"width:20%;\"></i>\n                            </div>\n                            <div *ngIf=\"vs.edit\">\n                                <p-dropdown [options]=\"valuesetOptions\" [(ngModel)]=\"vs.newvalue.valuesetId\" appendTo=\"body\" [style]=\"{'width':'150px'}\" filter=\"true\">\n                                    <ng-template let-option pTemplate=\"body\">\n                                        <div class=\"ui-helper-clearfix\" style=\"position: relative;height: 25px;\">\n                                            <display-ref *ngIf=\"option.value\" [elm]=\"getValueSetElm(option.value)\"></display-ref>\n                                            <span *ngIf=\"!option.value\">{{option.label}}</span>\n                                        </div>\n                                    </ng-template>\n                                </p-dropdown>\n                                <p-dropdown [options]=\"valuesetStrengthOptions\" [(ngModel)]=\"vs.newvalue.strength\" appendTo=\"body\" [style]=\"{'width':'150px'}\">\n                                </p-dropdown>\n                                <p-dropdown *ngIf=\"node.data.displayData.valueSetLocationOptions\" [options]=\"node.data.displayData.valueSetLocationOptions\" [(ngModel)]=\"vs.newvalue.valuesetLocations\" appendTo=\"body\" [style]=\"{'width':'150px'}\">\n                                </p-dropdown>\n                                <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewValueSet(vs); node.data.displayData.hasValueSet = true;\" [disabled]=\"!vs.newvalue.valuesetId\"></button>\n                            </div>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.datatypeBinding || !node.data.displayData.datatypeBinding.valuesetBindings || node.data.displayData.datatypeBinding.valuesetBindings.length === 0) && node.data.displayData.componentDTbinding\">\n                        <div *ngFor=\"let vs of node.data.displayData.componentDTbinding.valuesetBindings\">\n                            <div *ngIf=\"!vs.edit\">\n                                <display-ref [elm]=\"vs\" [from]=\"'COMPONENT'\"></display-ref>\n                            </div>\n                        </div>\n                    </div>\n                    <i class=\"fa fa-plus\" *ngIf=\"node.data.displayData.multipleValuesetAllowed || !node.data.displayData.datatypeBinding || !node.data.displayData.datatypeBinding.valuesetBindings || node.data.displayData.datatypeBinding.valuesetBindings.length == 0\" (click)=\"addNewValueSet(node)\"></i>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Single Code\" [style]=\"{'width':'200px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.valuesetAllowed && node.data.displayData.datatype.leaf && !node.data.displayData.hasValueSet\">\n                    <div *ngIf=\"node.data.displayData.datatypeBinding\">\n                        <div *ngIf=\"node.data.displayData.datatypeBinding.externalSingleCode\">\n                            <div *ngIf=\"!node.data.displayData.datatypeBinding.externalSingleCode.edit\">\n                                <display-singlecode [elm]=\"node.data.displayData.datatypeBinding.externalSingleCode\" [from]=\"'DATATYPE'\"></display-singlecode>\n                                <i class=\"fa fa-pencil\" (click)=\"makeEditModeForSingleCode(node)\" style=\"width:20%;\"></i>\n                                <i class=\"fa fa-times\" (click)=\"deleteSingleCode(node)\" style=\"width:20%;\"></i>\n                            </div>\n                            <div *ngIf=\"node.data.displayData.datatypeBinding.externalSingleCode.edit\">\n                                <input [(ngModel)]=\"node.data.displayData.datatypeBinding.externalSingleCode.newSingleCode\" type=\"text\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n                                <input [(ngModel)]=\"node.data.displayData.datatypeBinding.externalSingleCode.newSingleCodeSystem\" type=\"text\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n                                <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewSingleCode(node); node.data.displayData.hasSingleCode = true;\" [disabled]=\"node.data.displayData.datatypeBinding.externalSingleCode.newSingleCode === '' || node.data.displayData.datatypeBinding.externalSingleCode.newSingleCodeSystem === ''\"></button>\n                            </div>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.datatypeBinding || !node.data.displayData.datatypeBinding.externalSingleCode) && node.data.displayData.componentDTbinding\">\n                        <div *ngIf=\"node.data.displayData.componentDTbinding.externalSingleCode\">\n                            <display-singlecode [elm]=\"node.data.displayData.componentDTbinding.externalSingleCode\" [from]=\"'COMPONENT'\"></display-singlecode>\n                        </div>\n                    </div>\n                    <i class=\"fa fa-plus\" *ngIf=\"!node.data.displayData.datatypeBinding || !node.data.displayData.datatypeBinding.externalSingleCode\" (click)=\"addNewSingleCode(node)\"></i>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Constant Value\" [style]=\"{'width':'200px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.datatype.leaf && !node.data.displayData.valuesetAllowed\">\n                    <div *ngIf=\"node.data.displayData.datatypeBinding\">\n                        <div *ngIf=\"!node.data.displayData.datatypeBinding.editConstantValue\">\n                            <div *ngIf=\"node.data.displayData.datatypeBinding.constantValue\">\n                                <display-constantvalue [elm]=\"node.data.displayData.datatypeBinding.constantValue\" [from]=\"'DATATYPE'\"></display-constantvalue>\n                                <i class=\"fa fa-pencil\" (click)=\"makeEditModeForConstantValue(node)\" style=\"width:20%;\"></i>\n                                <i class=\"fa fa-times\" (click)=\"deleteConstantValue(node)\" style=\"width:20%;\"></i>\n                            </div>\n                        </div>\n                        <div *ngIf=\"node.data.displayData.datatypeBinding.editConstantValue\">\n                            <input [(ngModel)]=\"node.data.displayData.datatypeBinding.newConstantValue\" type=\"text\" style=\"width:90%;border-width:0px 0px 1px 0px\"/>\n                            <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewConstantValue(node)\" [disabled]=\"node.data.displayData.datatypeBinding.newConstantValue === ''\"></button>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.datatypeBinding || !node.data.displayData.datatypeBinding.constantValue) && node.data.displayData.componentDTbinding\">\n                        <div *ngIf=\"node.data.displayData.componentDTbinding.constantValue  !== undefined && node.data.displayData.componentDTbinding.constantValue !== ''\">\n                            <display-constantvalue [elm]=\"node.data.displayData.componentDTbinding.constantValue\" [from]=\"'COMPONENT'\"></display-constantvalue>\n                        </div>\n                    </div>\n                    <div *ngIf=\"!node.data.displayData.datatypeBinding || !node.data.displayData.datatypeBinding.editConstantValue\">\n                        <i class=\"fa fa-plus\" *ngIf=\"!node.data.displayData.datatypeBinding || (node.data.displayData.datatypeBinding && !node.data.displayData.datatypeBinding.constantValue)\" (click)=\"addNewConstantValue(node)\"></i>\n                    </div>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Predicate\" [style]=\"{'width':'150px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.usage === 'C'\">\n                    <div *ngIf=\"node.data.displayData.type === 'COMPONENT'\">\n                        <div *ngIf=\"node.data.displayData.datatypeBinding && node.data.displayData.datatypeBinding.predicate && node.data.displayData.datatypeBinding.predicate.freeText\">\n                            {{node.data.displayData.datatypeBinding.predicate.freeText}}\n                        </div>\n                        <div *ngIf=\"node.data.displayData.datatypeBinding && node.data.displayData.datatypeBinding.predicate && node.data.displayData.datatypeBinding.predicate.assertion && node.data.displayData.datatypeBinding.predicate.assertion.description\">\n                            {{node.data.displayData.datatypeBinding.predicate.assertion.description}}\n                        </div>\n                        <i class=\"fa fa-pencil\" (click)=\"editPredicate(node)\" style=\"width:20%;\"></i>\n                    </div>\n                    <div *ngIf=\"node.data.displayData.type === 'SUBCOMPONENT'\">\n                        <div *ngIf=\"node.data.displayData.componentDTbinding && node.data.displayData.componentDTbinding.predicate && node.data.displayData.componentDTbinding.predicate.freeText\">\n                            {{node.data.displayData.componentDTbinding.predicate.freeText}}\n                        </div>\n                        <div *ngIf=\"node.data.displayData.componentDTbinding && node.data.displayData.componentDTbinding.predicate && node.data.displayData.componentDTbinding.predicate.assertion && node.data.displayData.componentDTbinding.predicate.assertion.description\">\n                            {{node.data.displayData.componentDTbinding.predicate.assertion.description}}\n                        </div>\n                    </div>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Text Definition\" [style]=\"{'width':'150px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'FIELD'\">\n                    <ng-container *ngIf=\"node.data.text\">\n                        <span (click)=\"editTextDefinition(node)\">{{truncate(node.data.text)}}</span>\n                        <i class=\"fa fa-times\" (click)=\"delTextDefinition(node)\" style=\"width:20%;\"></i>\n                    </ng-container>\n                    <ng-container *ngIf=\"!node.data.text\">\n                        <i class=\"fa fa-pencil\" (click)=\"editTextDefinition(node)\"></i>\n                    </ng-container>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Comment\" [style]=\"{'width':'400px'}\">\n            <ng-template let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.datatypeBinding\">\n                    <div *ngFor=\"let c of node.data.displayData.datatypeBinding.comments\">\n                        <div *ngIf=\"!c.edit\">\n                            <display-comment [elm]=\"c\" [from]=\"'DATATYPE'\"></display-comment>\n                            <i class=\"fa fa-pencil\" (click)=\"makeEditModeForComment(c)\" style=\"width:20%;\"></i>\n                            <i class=\"fa fa-times\" (click)=\"delCommentBinding(node.data.displayData.datatypeBinding, c)\" style=\"width:20%;\"></i>\n                        </div>\n                        <div *ngIf=\"c.edit\">\n                            <textarea pInputTextarea [(ngModel)]=\"c.newComment.description\"></textarea>\n                            <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewComment(c);\" [disabled]=\"c.newComment.description === ''\"></button>\n                        </div>\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.fieldDTbinding\">\n                    <div *ngFor=\"let c of node.data.displayData.fieldDTbinding.comments\">\n                        <display-comment [elm]=\"c\" [from]=\"'FIELD'\"></display-comment>\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.componentDTbinding\">\n                    <div *ngFor=\"let c of node.data.displayData.componentDTbinding.comments\">\n                        <display-comment [elm]=\"c\" [from]=\"'COMPONENT'\"></display-comment>\n                    </div>\n                </div>\n                <i class=\"fa fa-plus\" (click)=\"addNewComment(node)\"></i>\n            </ng-template>\n        </p-column>\n    </p-treeTable>\n\n    <p-dialog *ngIf=\"selectedNode\" header=\"Edit Text Definition of {{selectedNode.data.name}}\" [(visible)]=\"textDefinitionDialogOpen\" [modal]=\"true\" [responsive]=\"true\" [width]=\"350\" [minWidth]=\"200\" [minY]=\"70\">\n        <textarea pInputTextarea [(ngModel)]=\"selectedNode.data.text\"></textarea>\n    </p-dialog>\n\n    <p-dialog *ngIf=\"selectedNode\" header=\"Edit Predicate of {{selectedNode.data.name}}\" [(visible)]=\"preciateEditorOpen\" [modal]=\"true\" [responsive]=\"true\" [width]=\"1200\" [minWidth]=\"800\" [minY]=\"70\">\n        <form #cpForm=\"ngForm\">\n            <div class=\"ui-g ui-fluid\">\n                <div class=\"ui-g-12 ui-md-2\">\n                    <label>Editor Type: </label>\n                </div>\n                <div class=\"ui-g-12 ui-md-10\">\n                    <p-selectButton name=\"type\" [options]=\"constraintTypes\" [(ngModel)]=\"selectedPredicate.type\" (onChange)=\"changeType()\"></p-selectButton>\n                </div>\n            </div>\n\n            <div *ngIf=\"selectedPredicate.type && selectedPredicate.type ==='ASSERTION'\">\n                <div class=\"ui-g ui-fluid\">\n                    <div class=\"ui-g-12 ui-md-2\">\n                        <label>Assertion Type: </label>\n                    </div>\n                    <div class=\"ui-g-12 ui-md-10\">\n                        <p-dropdown id=\"assertionMode\" name=\"assertionMode\" required #assertionMode=\"ngModel\" [options]=\"assertionModes\" [(ngModel)]=\"selectedPredicate.assertion.mode\" (onChange)=\"changeAssertionMode()\"></p-dropdown>\n                        <div *ngIf=\"assertionMode.invalid && (assertionMode.dirty || assertionMode.touched)\" class=\"alert alert-danger\">\n                            <div *ngIf=\"assertionMode.errors.required\">\n                                Assertion Type is required.\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <edit-free-constraint *ngIf=\"selectedPredicate.type === 'FREE'\" [constraint]=\"selectedPredicate\"></edit-free-constraint>\n            <edit-simple-constraint *ngIf=\"selectedPredicate.assertion && selectedPredicate.assertion.mode === 'SIMPLE'\" [constraint]=\"selectedPredicate.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'rootSimple'\"></edit-simple-constraint>\n            <edit-complex-constraint *ngIf=\"selectedPredicate.assertion && selectedPredicate.assertion.mode === 'COMPLEX'\" [constraint]=\"selectedPredicate.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'root'\"></edit-complex-constraint>\n\n            <p>\n                Parent Form Values:\n                {{cpForm.value | json}}\n            </p>\n\n            <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-plus\" label=\"Submit\" (click)=\"submitCP()\" [disabled]=\"cpForm.invalid\"></button>\n            <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-print\" label=\"Print\" (click)=\"print(selectedConformanceStatement)\"></button>\n        </form>\n    </p-dialog>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-structure/datatype-edit-structure.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypeEditStructureComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_constraints_constraints_service__ = __webpack_require__("../../../../../src/app/service/constraints/constraints.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_underscore__ = __webpack_require__("../../../../underscore/underscore.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_indexed_db_datatypes_datatypes_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/datatypes/datatypes-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_indexed_db_valuesets_valuesets_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/valuesets/valuesets-toc.service.ts");
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
 * Created by Jungyub on 10/23/17.
 */









var DatatypeEditStructureComponent = (function () {
    function DatatypeEditStructureComponent(route, router, configService, datatypesService, constraintsService, datatypesTocService, valuesetsTocService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.configService = configService;
        this.datatypesService = datatypesService;
        this.constraintsService = constraintsService;
        this.datatypesTocService = datatypesTocService;
        this.valuesetsTocService = valuesetsTocService;
        this.valuesetColumnWidth = '200px';
        this.textDefinitionDialogOpen = false;
        this.valuesetStrengthOptions = [];
        this.preciateEditorOpen = false;
        this.selectedPredicate = {};
        this.constraintTypes = [];
        this.assertionModes = [];
        this.valuesetsLinks = [];
        this.datatypesLinks = [];
        this.datatypeOptions = [];
        this.valuesetOptions = [{ label: 'Select ValueSet', value: null }];
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
    }
    DatatypeEditStructureComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.usages = this.configService._usages;
        this.cUsages = this.configService._cUsages;
        this.valuesetStrengthOptions = this.configService._valuesetStrengthOptions;
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
        this.datatypesTocService.getAll().then(function (dtTOCdata) {
            var listTocDTs = dtTOCdata;
            for (var _i = 0, listTocDTs_1 = listTocDTs; _i < listTocDTs_1.length; _i++) {
                var entry = listTocDTs_1[_i];
                var treeObj = entry.data;
                var dtLink = {};
                dtLink.id = treeObj.key.id;
                dtLink.label = treeObj.label;
                dtLink.domainInfo = treeObj.domainInfo;
                var index = treeObj.label.indexOf("_");
                if (index > -1) {
                    dtLink.name = treeObj.label.substring(0, index);
                    dtLink.ext = treeObj.label.substring(index);
                    ;
                }
                else {
                    dtLink.name = treeObj.label;
                    dtLink.ext = null;
                }
                if (treeObj.lazyLoading)
                    dtLink.leaf = false;
                else
                    dtLink.leaf = true;
                _this.datatypesLinks.push(dtLink);
                var dtOption = { label: dtLink.label, value: dtLink.id };
                _this.datatypeOptions.push(dtOption);
            }
            _this.valuesetsTocService.getAll().then(function (valuesetTOCdata) {
                var listTocVSs = valuesetTOCdata;
                for (var _i = 0, listTocVSs_1 = listTocVSs; _i < listTocVSs_1.length; _i++) {
                    var entry = listTocVSs_1[_i];
                    var treeObj = entry.data;
                    var valuesetLink = {};
                    valuesetLink.id = treeObj.key.id;
                    valuesetLink.label = treeObj.label;
                    valuesetLink.domainInfo = treeObj.domainInfo;
                    _this.valuesetsLinks.push(valuesetLink);
                    var vsOption = { label: valuesetLink.label, value: valuesetLink.id };
                    _this.valuesetOptions.push(vsOption);
                }
                _this.datatypesService.getDatatypeStructure(_this.datatypeId).then(function (structure) {
                    _this.datatypeStructure = {};
                    _this.datatypeStructure.name = structure.name;
                    _this.datatypeStructure.ext = structure.ext;
                    _this.datatypeStructure.scope = structure.scope;
                    _this.updateDatatype(_this.datatypeStructure, structure.children, structure.binding, null, null, null, null);
                });
            });
        });
    };
    DatatypeEditStructureComponent.prototype.updateDatatype = function (node, children, currentBinding, parentComponentId, datatypeBinding, parentDTId, parentDTName) {
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var entry = children_1[_i];
            if (!entry.data.displayData)
                entry.data.displayData = {};
            entry.data.displayData.datatype = this.getDatatypeLink(entry.data.ref.id);
            entry.data.displayData.valuesetAllowed = this.configService.isValueSetAllow(entry.data.displayData.datatype.name, entry.data.position, parentDTName, null, entry.data.displayData.type);
            entry.data.displayData.valueSetLocationOptions = this.configService.getValuesetLocations(entry.data.displayData.datatype.name, entry.data.displayData.datatype.domainInfo.version);
            if (entry.data.displayData.valuesetAllowed)
                entry.data.displayData.multipleValuesetAllowed = this.configService.isMultipleValuseSetAllowed(entry.data.displayData.datatype.name);
            if (entry.data.displayData.datatype.leaf)
                entry.leaf = true;
            else
                entry.leaf = false;
            if (parentComponentId === null) {
                entry.data.displayData.idPath = entry.data.id;
            }
            else {
                entry.data.displayData.idPath = parentComponentId + '-' + entry.data.id;
            }
            if (entry.data.displayData.idPath.split("-").length === 1) {
                entry.data.displayData.type = 'COMPONENT';
                entry.data.displayData.datatypeBinding = this.findBinding(entry.data.displayData.idPath, currentBinding);
                if (entry.data.usage === 'C' && !entry.data.displayData.datatypeBinding) {
                    entry.data.displayData.datatypeBinding = {};
                }
                if (entry.data.usage === 'C' && !entry.data.displayData.datatypeBinding.predicate) {
                    entry.data.displayData.datatypeBinding.predicate = {};
                }
            }
            else if (entry.data.displayData.idPath.split("-").length === 2) {
                entry.data.displayData.type = 'SUBCOMPONENT';
                entry.data.displayData.componentDT = parentDTId;
                entry.data.displayData.datatypeBinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], datatypeBinding);
                entry.data.displayData.componentDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], currentBinding);
            }
            this.setHasSingleCode(entry.data.displayData);
            this.setHasValueSet(entry.data.displayData);
        }
        node.children = children;
    };
    DatatypeEditStructureComponent.prototype.setHasSingleCode = function (displayData) {
        if (displayData.datatypeBinding || displayData.componentDTbinding) {
            if (displayData.datatypeBinding && displayData.datatypeBinding.internalSingleCode && displayData.datatypeBinding.internalSingleCode !== '') {
                displayData.hasSingleCode = true;
            }
            else if (displayData.datatypeBinding && displayData.datatypeBinding.externalSingleCode && displayData.datatypeBinding.externalSingleCode !== '') {
                displayData.hasSingleCode = true;
            }
            else if (displayData.componentDTbinding && displayData.componentDTbinding.internalSingleCode && displayData.componentDTbinding.internalSingleCode !== '') {
                displayData.hasSingleCode = true;
            }
            else if (displayData.componentDTbinding && displayData.componentDTbinding.externalSingleCode && displayData.componentDTbinding.externalSingleCode !== '') {
                displayData.hasSingleCode = true;
            }
            else {
                displayData.hasSingleCode = false;
            }
        }
        else {
            displayData.hasSingleCode = false;
        }
    };
    DatatypeEditStructureComponent.prototype.setHasValueSet = function (displayData) {
        if (displayData.datatypeBinding || displayData.componentDTbinding) {
            if (displayData.datatypeBinding && displayData.datatypeBinding.valuesetBindings && displayData.datatypeBinding.valuesetBindings.length > 0) {
                displayData.hasValueSet = true;
            }
            else if (displayData.componentDTbinding && displayData.componentDTbinding.valuesetBindings && displayData.componentDTbinding.valuesetBindings.length > 0) {
                displayData.hasValueSet = true;
            }
            else {
                displayData.hasValueSet = false;
            }
        }
        else {
            displayData.hasValueSet = false;
        }
    };
    DatatypeEditStructureComponent.prototype.getValueSetElm = function (id) {
        for (var _i = 0, _a = this.valuesetsLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            if (link.id === id)
                return link;
        }
        return null;
    };
    DatatypeEditStructureComponent.prototype.getDatatypeElm = function (id) {
        for (var _i = 0, _a = this.datatypesLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            if (link.id === id)
                return link;
        }
        return null;
    };
    DatatypeEditStructureComponent.prototype.addNewValueSet = function (node) {
        if (!node.data.displayData.datatypeBinding)
            node.data.displayData.datatypeBinding = [];
        if (!node.data.displayData.datatypeBinding.valuesetBindings)
            node.data.displayData.datatypeBinding.valuesetBindings = [];
        node.data.displayData.datatypeBinding.valuesetBindings.push({ edit: true, newvalue: {} });
        this.valuesetColumnWidth = '500px';
    };
    DatatypeEditStructureComponent.prototype.updateValueSetBindings = function (binding) {
        var result = JSON.parse(JSON.stringify(binding));
        if (result && result.valuesetBindings) {
            for (var _i = 0, _a = result.valuesetBindings; _i < _a.length; _i++) {
                var vs = _a[_i];
                var displayValueSetLink = this.getValueSetLink(vs.valuesetId);
                vs.bindingIdentifier = displayValueSetLink.displayValueSetLink;
                vs.label = displayValueSetLink.label;
                vs.domainInfo = displayValueSetLink.domainInfo;
            }
        }
        return result;
    };
    DatatypeEditStructureComponent.prototype.findBinding = function (id, binding) {
        if (binding && binding.children) {
            for (var _i = 0, _a = binding.children; _i < _a.length; _i++) {
                var b = _a[_i];
                if (b.elementId === id)
                    return this.updateValueSetBindings(b);
            }
        }
        return null;
    };
    DatatypeEditStructureComponent.prototype.delLength = function (node) {
        node.data.minLength = 'NA';
        node.data.maxLength = 'NA';
        node.data.confLength = '';
    };
    DatatypeEditStructureComponent.prototype.delConfLength = function (node) {
        node.data.minLength = '';
        node.data.maxLength = '';
        node.data.confLength = 'NA';
    };
    DatatypeEditStructureComponent.prototype.makeEditModeForDatatype = function (node) {
        node.data.displayData.datatype.edit = true;
        node.data.displayData.datatype.dtOptions = [];
        for (var _i = 0, _a = this.datatypesLinks; _i < _a.length; _i++) {
            var dt = _a[_i];
            if (dt.name === node.data.displayData.datatype.name) {
                var dtOption = { label: dt.label, value: dt.id };
                node.data.displayData.datatype.dtOptions.push(dtOption);
            }
        }
        node.data.displayData.datatype.dtOptions.push({ label: 'Change Datatype root', value: null });
    };
    DatatypeEditStructureComponent.prototype.loadNode = function (event) {
        var _this = this;
        if (event.node && !event.node.children) {
            var datatypeId = event.node.data.ref.id;
            this.datatypesService.getDatatypeStructure(datatypeId).then(function (structure) {
                _this.updateDatatype(event.node, structure.children, structure.binding, event.node.data.displayData.idPath, event.node.data.displayData.datatypeBinding, event.node.data.displayData.componentDT, event.node.data.displayData.datatype.name);
            });
        }
    };
    DatatypeEditStructureComponent.prototype.onDatatypeChange = function (node) {
        if (!node.data.displayData.datatype.id) {
            node.data.displayData.datatype.id = node.data.ref.id;
        }
        else
            node.data.ref.id = node.data.displayData.datatype.id;
        node.data.displayData.datatype = this.getDatatypeLink(node.data.displayData.datatype.id);
        node.children = null;
        node.expanded = false;
        if (node.data.displayData.datatype.leaf)
            node.leaf = true;
        else
            node.leaf = false;
        node.data.displayData.datatype.edit = false;
        node.data.displayData.valuesetAllowed = this.configService.isValueSetAllow(node.data.displayData.datatype.name, node.data.position, null, null, node.data.displayData.type);
        node.data.displayData.valueSetLocationOptions = this.configService.getValuesetLocations(node.data.displayData.datatype.name, node.data.displayData.datatype.domainInfo.version);
    };
    DatatypeEditStructureComponent.prototype.makeEditModeForValueSet = function (vs) {
        vs.newvalue = {};
        vs.newvalue.valuesetId = vs.valuesetId;
        vs.newvalue.strength = vs.strength;
        vs.newvalue.valuesetLocations = vs.valuesetLocations;
        vs.edit = true;
        this.valuesetColumnWidth = '500px';
    };
    DatatypeEditStructureComponent.prototype.makeEditModeForComment = function (c) {
        c.newComment = {};
        c.newComment.description = c.description;
        c.edit = true;
    };
    DatatypeEditStructureComponent.prototype.addNewComment = function (node) {
        if (!node.data.displayData.datatypeBinding)
            node.data.displayData.datatypeBinding = [];
        if (!node.data.displayData.datatypeBinding.comments)
            node.data.displayData.datatypeBinding.comments = [];
        node.data.displayData.datatypeBinding.comments.push({ edit: true, newComment: { description: '' } });
    };
    DatatypeEditStructureComponent.prototype.addNewSingleCode = function (node) {
        if (!node.data.displayData.datatypeBinding)
            node.data.displayData.datatypeBinding = {};
        if (!node.data.displayData.datatypeBinding.externalSingleCode)
            node.data.displayData.datatypeBinding.externalSingleCode = {};
        node.data.displayData.datatypeBinding.externalSingleCode.newSingleCode = '';
        node.data.displayData.datatypeBinding.externalSingleCode.newSingleCodeSystem = '';
        node.data.displayData.datatypeBinding.externalSingleCode.edit = true;
    };
    DatatypeEditStructureComponent.prototype.submitNewSingleCode = function (node) {
        node.data.displayData.datatypeBinding.externalSingleCode.value = node.data.displayData.datatypeBinding.externalSingleCode.newSingleCode;
        node.data.displayData.datatypeBinding.externalSingleCode.codeSystem = node.data.displayData.datatypeBinding.externalSingleCode.newSingleCodeSystem;
        node.data.displayData.datatypeBinding.externalSingleCode.edit = false;
    };
    DatatypeEditStructureComponent.prototype.makeEditModeForSingleCode = function (node) {
        node.data.displayData.datatypeBinding.externalSingleCode.newSingleCode = node.data.displayData.datatypeBinding.externalSingleCode.value;
        node.data.displayData.datatypeBinding.externalSingleCode.newSingleCodeSystem = node.data.displayData.datatypeBinding.externalSingleCode.codeSystem;
        node.data.displayData.datatypeBinding.externalSingleCode.edit = true;
    };
    DatatypeEditStructureComponent.prototype.deleteSingleCode = function (node) {
        node.data.displayData.datatypeBinding.externalSingleCode = null;
        node.data.displayData.hasSingleCode = false;
    };
    DatatypeEditStructureComponent.prototype.addNewConstantValue = function (node) {
        if (!node.data.displayData.datatypeBinding)
            node.data.displayData.datatypeBinding = {};
        node.data.displayData.datatypeBinding.constantValue = null;
        node.data.displayData.datatypeBinding.newConstantValue = '';
        node.data.displayData.datatypeBinding.editConstantValue = true;
        console.log(node);
    };
    DatatypeEditStructureComponent.prototype.deleteConstantValue = function (node) {
        node.data.displayData.datatypeBinding.constantValue = null;
        node.data.displayData.datatypeBinding.editConstantValue = false;
    };
    DatatypeEditStructureComponent.prototype.makeEditModeForConstantValue = function (node) {
        node.data.displayData.datatypeBinding.newConstantValue = node.data.displayData.datatypeBinding.constantValue;
        node.data.displayData.datatypeBinding.editConstantValue = true;
    };
    DatatypeEditStructureComponent.prototype.submitNewConstantValue = function (node) {
        node.data.displayData.datatypeBinding.constantValue = node.data.displayData.datatypeBinding.newConstantValue;
        node.data.displayData.datatypeBinding.editConstantValue = false;
    };
    DatatypeEditStructureComponent.prototype.submitNewValueSet = function (vs) {
        var displayValueSetLink = this.getValueSetLink(vs.newvalue.valuesetId);
        vs.bindingIdentifier = displayValueSetLink.displayValueSetLink;
        vs.label = displayValueSetLink.label;
        vs.domainInfo = displayValueSetLink.domainInfo;
        vs.valuesetId = vs.newvalue.valuesetId;
        vs.strength = vs.newvalue.strength;
        vs.valuesetLocations = vs.newvalue.valuesetLocations;
        vs.edit = false;
        this.valuesetColumnWidth = '200px';
    };
    DatatypeEditStructureComponent.prototype.submitNewComment = function (c) {
        c.description = c.newComment.description;
        c.dateupdated = new Date();
        c.edit = false;
    };
    DatatypeEditStructureComponent.prototype.delValueSetBinding = function (binding, vs, node) {
        binding.valuesetBindings = __WEBPACK_IMPORTED_MODULE_6_underscore__["_"].without(binding.valuesetBindings, __WEBPACK_IMPORTED_MODULE_6_underscore__["_"].findWhere(binding.valuesetBindings, { valuesetId: vs.valuesetId }));
        this.setHasValueSet(node);
    };
    DatatypeEditStructureComponent.prototype.delCommentBinding = function (binding, c) {
        binding.comments = __WEBPACK_IMPORTED_MODULE_6_underscore__["_"].without(binding.comments, __WEBPACK_IMPORTED_MODULE_6_underscore__["_"].findWhere(binding.comments, c));
    };
    DatatypeEditStructureComponent.prototype.delTextDefinition = function (node) {
        node.data.text = null;
    };
    DatatypeEditStructureComponent.prototype.getDatatypeLink = function (id) {
        for (var _i = 0, _a = this.datatypesLinks; _i < _a.length; _i++) {
            var dt = _a[_i];
            if (dt.id === id)
                return JSON.parse(JSON.stringify(dt));
        }
        console.log("Missing DT:::" + id);
        return null;
    };
    DatatypeEditStructureComponent.prototype.getValueSetLink = function (id) {
        for (var _i = 0, _a = this.valuesetsLinks; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v.id === id)
                return JSON.parse(JSON.stringify(v));
        }
        console.log("Missing ValueSet:::" + id);
        return null;
    };
    DatatypeEditStructureComponent.prototype.editTextDefinition = function (node) {
        this.selectedNode = node;
        this.textDefinitionDialogOpen = true;
    };
    DatatypeEditStructureComponent.prototype.truncate = function (txt) {
        if (txt.length < 10)
            return txt;
        else
            return txt.substring(0, 10) + "...";
    };
    DatatypeEditStructureComponent.prototype.print = function (data) {
        console.log(data);
    };
    DatatypeEditStructureComponent.prototype.editPredicate = function (node) {
        var _this = this;
        this.selectedNode = node;
        if (this.selectedNode.data.displayData.datatypeBinding)
            this.selectedPredicate = JSON.parse(JSON.stringify(this.selectedNode.data.displayData.datatypeBinding.predicate));
        if (!this.selectedPredicate)
            this.selectedPredicate = {};
        this.idMap = {};
        this.treeData = [];
        this.datatypesService.getDatatypeStructure(this.datatypeId).then(function (dtStructure) {
            _this.idMap[_this.datatypeId] = { name: dtStructure.name };
            var rootData = { elementId: _this.datatypeId };
            for (var _i = 0, _a = dtStructure.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var childData = JSON.parse(JSON.stringify(rootData));
                childData.child = {
                    elementId: child.data.id,
                };
                if (child.data.max === '1') {
                    childData.child.instanceParameter = '1';
                }
                else if (child.data.max) {
                    childData.child.instanceParameter = '*';
                }
                else {
                    childData.child.instanceParameter = '1';
                }
                var treeNode = {
                    label: child.data.name,
                    data: childData,
                    expandedIcon: "fa-folder-open",
                    collapsedIcon: "fa-folder",
                };
                var data = {
                    id: child.data.id,
                    name: child.data.name,
                    max: child.data.max,
                    position: child.data.position,
                    usage: child.data.usage,
                    dtId: child.data.ref.id
                };
                _this.idMap[_this.datatypeId + '-' + data.id] = data;
                _this.popChild(_this.datatypeId + '-' + data.id, data.dtId, treeNode);
                _this.treeData.push(treeNode);
            }
        });
        this.preciateEditorOpen = true;
    };
    DatatypeEditStructureComponent.prototype.submitCP = function () {
        if (this.selectedPredicate.type === 'ASSERTION') {
            this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedPredicate.assertion, this.idMap);
            this.selectedPredicate.assertion.description = 'If ' + this.selectedPredicate.assertion.description;
            this.selectedPredicate.freeText = undefined;
        }
        if (!this.selectedNode.data.displayData.datatypeBinding)
            this.selectedNode.data.displayData.datatypeBinding = {};
        this.selectedNode.data.displayData.datatypeBinding.predicate = this.selectedPredicate;
        this.preciateEditorOpen = false;
        this.selectedPredicate = {};
        this.selectedNode = null;
    };
    DatatypeEditStructureComponent.prototype.changeType = function () {
        if (this.selectedPredicate.type == 'ASSERTION') {
            this.selectedPredicate.assertion = {};
            this.selectedPredicate.assertion = { mode: "SIMPLE" };
        }
        else if (this.selectedPredicate.type == 'FREE') {
            this.selectedPredicate.assertion = undefined;
        }
        else if (this.selectedPredicate.type == 'PREDEFINEDPATTERNS') {
            this.selectedPredicate.assertion = undefined;
        }
        else if (this.selectedPredicate.type == 'PREDEFINED') {
            this.selectedPredicate.assertion = undefined;
        }
    };
    DatatypeEditStructureComponent.prototype.changeAssertionMode = function () {
        if (this.selectedPredicate.assertion.mode == 'SIMPLE') {
            this.selectedPredicate.assertion = { mode: "SIMPLE" };
        }
        else if (this.selectedPredicate.assertion.mode == 'COMPLEX') {
            this.selectedPredicate.assertion = { mode: "COMPLEX" };
        }
    };
    DatatypeEditStructureComponent.prototype.popChild = function (id, dtId, parentTreeNode) {
        var _this = this;
        this.datatypesService.getDatatypeStructure(dtId).then(function (dtStructure) {
            _this.idMap[id].dtName = dtStructure.name;
            if (dtStructure.children) {
                for (var _i = 0, _a = dtStructure.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var childData = JSON.parse(JSON.stringify(parentTreeNode.data));
                    _this.makeChild(childData, child.data.id, '1');
                    var treeNode = {
                        label: child.data.name,
                        data: childData,
                        expandedIcon: "fa-folder-open",
                        collapsedIcon: "fa-folder",
                    };
                    var data = {
                        id: child.data.id,
                        name: child.data.name,
                        max: "1",
                        position: child.data.position,
                        usage: child.data.usage,
                        dtId: child.data.ref.id
                    };
                    _this.idMap[id + '-' + data.id] = data;
                    _this.popChild(id + '-' + data.id, data.dtId, treeNode);
                    if (!parentTreeNode.children)
                        parentTreeNode.children = [];
                    parentTreeNode.children.push(treeNode);
                }
            }
        });
    };
    DatatypeEditStructureComponent.prototype.makeChild = function (data, id, para) {
        if (data.child)
            this.makeChild(data.child, id, para);
        else
            data.child = {
                elementId: id,
                instanceParameter: para
            };
    };
    DatatypeEditStructureComponent.prototype.onUsageChange = function (node) {
        if (node.data.usage === 'C') {
            if (!node.data.displayData.datatypeBinding) {
                node.data.displayData.datatypeBinding = {};
            }
            if (!node.data.displayData.datatypeBinding.predicate) {
                node.data.displayData.datatypeBinding.predicate = {};
            }
        }
        else if (node.data.usage !== 'C') {
            if (node.data.displayData.datatypeBinding && node.data.displayData.datatypeBinding.predicate) {
                node.data.displayData.datatypeBinding.predicate = undefined;
            }
        }
    };
    DatatypeEditStructureComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'datatype-edit',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-structure/datatype-edit-structure.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-structure/datatype-edit-structure.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */], __WEBPACK_IMPORTED_MODULE_4__service_datatypes_datatypes_service__["a" /* DatatypesService */], __WEBPACK_IMPORTED_MODULE_5__service_constraints_constraints_service__["a" /* ConstraintsService */], __WEBPACK_IMPORTED_MODULE_7__service_indexed_db_datatypes_datatypes_toc_service__["a" /* DatatypesTocService */], __WEBPACK_IMPORTED_MODULE_8__service_indexed_db_valuesets_valuesets_toc_service__["a" /* ValuesetsTocService */]])
    ], DatatypeEditStructureComponent);
    return DatatypeEditStructureComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-conformancestatements/segment-edit-conformancestatements.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".ng-valid[required], .ng-valid.required  {\n  /*border-left: 5px solid #42A948; !* green *!*/\n}\n\n.ng-invalid:not(form)  {\n  border-left: 5px solid #a94442 !important; /* red */\n}\n\ninput[type=text]{\n  border-width:0px 0px 1px 0px;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-conformancestatements/segment-edit-conformancestatements.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"segmentConformanceStatements\">\n    <h1>Conformance Statements</h1>\n    <form #csForm=\"ngForm\">\n        <p-accordion (onOpen)=\"onTabOpen($event)\">\n            <p-accordionTab header=\"List of Conformance Statements\" [(selected)]=\"listTab\">\n                <p-table [columns]=\"cols\" [value]=\"segmentConformanceStatements.conformanceStatements\" [reorderableColumns]=\"true\" [resizableColumns]=\"true\">\n                    <ng-template pTemplate=\"header\" let-columns>\n                        <tr>\n                            <th style=\"width:3em\"></th>\n\n\n                            <th *ngFor=\"let col of columns\" pReorderableColumn [pSortableColumn]=\"col.sort\" [ngStyle]=\"col.colStyle\" pResizableColumn>\n                                {{col.header}}\n                                <p-sortIcon *ngIf=\"col.colStyle\" [field]=\"col.field\"></p-sortIcon>\n                            </th>\n\n                            <th style=\"width:15em\" pReorderableColumn>Actions</th>\n                        </tr>\n                    </ng-template>\n                    <ng-template pTemplate=\"body\" let-rowData let-columns=\"columns\" let-index=\"rowIndex\">\n                        <tr [pReorderableRow]=\"index\">\n                            <td>\n                                <i class=\"fa fa-bars\" pReorderableRowHandle></i>\n                            </td>\n                            <td *ngFor=\"let col of columns\" class=\"ui-resizable-column\">\n                                <div *ngIf=\"col.field === 'identifier'\">\n                                    {{rowData[col.field]}}\n                                </div>\n                                <div *ngIf=\"col.field === 'description'\">\n                                    <div *ngIf=\"rowData['type'] === 'FREE'\">\n                                        {{rowData['freeText']}}\n                                    </div>\n                                    <div *ngIf=\"rowData['type'] === 'ASSERTION'\">\n                                        {{rowData['assertion'].description}}\n                                    </div>\n                                </div>\n                            </td>\n                            <td>\n                                <button pButton style=\"float: right\" type=\"button\"  class=\"ui-button-warning\" icon=\"fa-times\" label=\"Delete\" (click)=\"deleteCS(rowData['identifier'])\"></button>\n                                <button pButton style=\"float: right\" type=\"button\"  class=\"ui-button-info\" icon=\"fa-pencil\" label=\"Edit\" (click)=\"selectCS(rowData)\"></button>\n                            </td>\n                        </tr>\n                    </ng-template>\n                </p-table>\n\n\n            </p-accordionTab>\n            <p-accordionTab header=\"Conformance Statement Editor\" [(selected)]=\"editorTab\">\n                <div class=\"ui-g ui-fluid\">\n                    <div class=\"ui-g-12 ui-md-2\">\n                        <label>Editor Type: </label>\n                    </div>\n                    <div class=\"ui-g-12 ui-md-10\">\n                        <p-selectButton name=\"type\" [options]=\"constraintTypes\" [(ngModel)]=\"selectedConformanceStatement.type\" (onChange)=\"changeType()\"></p-selectButton>\n                    </div>\n                </div>\n\n                <div *ngIf=\"selectedConformanceStatement.type\">\n                    <div class=\"ui-g ui-fluid\">\n                        <div class=\"ui-g-12 ui-md-2\">\n                            <label for=\"id\">ID: </label>\n                        </div>\n                        <div class=\"ui-g-12 ui-md-10\">\n                            <input id=\"id\" name=\"id\" required minlength=\"2\" [(ngModel)]=\"selectedConformanceStatement.identifier\" type=\"text\" #id=\"ngModel\" style=\"width:50%;\"/>\n                            <div *ngIf=\"id.invalid && (id.dirty || id.touched)\" class=\"alert alert-danger\">\n                                <div *ngIf=\"id.errors.required\">\n                                    Constraint Id is required.\n                                </div>\n                                <div *ngIf=\"id.errors.minlength\">\n                                    Constraint Id must be at least 2 characters long.\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n\n                <div *ngIf=\"selectedConformanceStatement.type && selectedConformanceStatement.type ==='ASSERTION'\">\n                    <div class=\"ui-g ui-fluid\">\n                        <div class=\"ui-g-12 ui-md-2\">\n                            <label>Assertion Level: </label>\n                        </div>\n                        <div class=\"ui-g-12 ui-md-4\">\n                            <p-dropdown id=\"assertionMode\" name=\"assertionMode\" required #assertionMode=\"ngModel\" [options]=\"assertionModes\" [(ngModel)]=\"selectedConformanceStatement.assertion.mode\" (onChange)=\"changeAssertionMode()\"></p-dropdown>\n                            <div *ngIf=\"assertionMode.invalid && (assertionMode.dirty || assertionMode.touched)\" class=\"alert alert-danger\">\n                                <div *ngIf=\"assertionMode.errors.required\">\n                                    Assertion Type is required.\n                                </div>\n                            </div>\n                        </div>\n                        <div *ngIf=\"selectedConformanceStatement.assertion && selectedConformanceStatement.assertion.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-2\">\n                            <label>Complex Type: </label>\n                        </div>\n                        <div *ngIf=\"selectedConformanceStatement.assertion && selectedConformanceStatement.assertion.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-4\">\n                            <p-dropdown id=\"complexAssertionType\" name=\"complexAssertionType\" required #complexAssertionType=\"ngModel\" [options]=\"complexAssertionTypes\" [(ngModel)]=\"selectedConformanceStatement.assertion.complexAssertionType\" (onChange)=\"changeComplexAssertionType(selectedConformanceStatement.assertion)\" placeholder=\"Select a complex type\"></p-dropdown>\n                            <div *ngIf=\"complexAssertionType.invalid && (complexAssertionType.dirty || complexAssertionType.touched)\" class=\"alert alert-danger\">\n                                <div *ngIf=\"complexAssertionType.errors.required\">\n                                    Complex Type is required.\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <edit-free-constraint *ngIf=\"selectedConformanceStatement.type === 'FREE'\" [constraint]=\"selectedConformanceStatement\"></edit-free-constraint>\n                <edit-simple-constraint *ngIf=\"selectedConformanceStatement.assertion && selectedConformanceStatement.assertion.mode === 'SIMPLE'\" [constraint]=\"selectedConformanceStatement.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'rootSimple'\"></edit-simple-constraint>\n                <edit-complex-constraint *ngIf=\"selectedConformanceStatement.assertion && selectedConformanceStatement.assertion.mode === 'COMPLEX'\" [constraint]=\"selectedConformanceStatement.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'root'\"></edit-complex-constraint>\n\n                <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-plus\" label=\"Submit\" (click)=\"submitCS()\" [disabled]=\"csForm.invalid\"></button>\n                <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-print\" label=\"Print\" (click)=\"printCS(selectedConformanceStatement)\"></button>\n            </p-accordionTab>\n        </p-accordion>\n    </form>\n</div>"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-conformancestatements/segment-edit-conformancestatements.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditConformanceStatementsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_underscore__ = __webpack_require__("../../../../underscore/underscore.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_constraints_constraints_service__ = __webpack_require__("../../../../../src/app/service/constraints/constraints.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_lodash__);
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
 * Created by Jungyub on 10/23/17.
 */










var SegmentEditConformanceStatementsComponent = (function () {
    function SegmentEditConformanceStatementsComponent(route, router, segmentsService, datatypesService, configService, constraintsService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.segmentsService = segmentsService;
        this.datatypesService = datatypesService;
        this.configService = configService;
        this.constraintsService = constraintsService;
        this.constraintTypes = [];
        this.assertionModes = [];
        this.selectedConformanceStatement = {};
        this.listTab = true;
        this.editorTab = false;
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
        this.cols = [
            { field: 'identifier', header: 'ID', colStyle: { width: '20em' }, sort: 'identifier' },
            { field: 'description', header: 'Description' }
        ];
    }
    SegmentEditConformanceStatementsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
        this.complexAssertionTypes = this.configService._complexAssertionTypes;
        this.idMap = {};
        this.treeData = [];
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.route.data.map(function (data) { return data.segmentConformanceStatements; }).subscribe(function (x) {
            _this.segmentConformanceStatements = x;
            _this.segmentsService.getSegmentStructure(_this.segmentId).then(function (segStructure) {
                _this.idMap[_this.segmentId] = { name: segStructure.name };
                var rootData = { elementId: _this.segmentId };
                for (var _i = 0, _a = segStructure.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var childData = JSON.parse(JSON.stringify(rootData));
                    childData.child = {
                        elementId: child.data.id,
                    };
                    if (child.data.max === '1') {
                        childData.child.instanceParameter = '1';
                    }
                    else {
                        childData.child.instanceParameter = '*';
                    }
                    var treeNode = {
                        label: child.data.name,
                        data: childData,
                        expandedIcon: "fa-folder-open",
                        collapsedIcon: "fa-folder",
                    };
                    var data = {
                        id: child.data.id,
                        name: child.data.name,
                        max: child.data.max,
                        position: child.data.position,
                        usage: child.data.usage,
                        dtId: child.data.ref.id
                    };
                    _this.idMap[_this.segmentId + '-' + data.id] = data;
                    _this.popChild(_this.segmentId + '-' + data.id, data.dtId, treeNode);
                    _this.treeData.push(treeNode);
                    _this.backup = __WEBPACK_IMPORTED_MODULE_9_lodash__["cloneDeep"](_this.segmentConformanceStatements);
                }
            });
        });
    };
    SegmentEditConformanceStatementsComponent.prototype.reset = function () {
        this.segmentConformanceStatements = __WEBPACK_IMPORTED_MODULE_9_lodash__["cloneDeep"](this.backup);
    };
    SegmentEditConformanceStatementsComponent.prototype.getCurrent = function () {
        return this.segmentConformanceStatements;
    };
    SegmentEditConformanceStatementsComponent.prototype.getBackup = function () {
        return this.backup;
    };
    SegmentEditConformanceStatementsComponent.prototype.isValid = function () {
        return !this.csForm.invalid;
    };
    SegmentEditConformanceStatementsComponent.prototype.save = function () {
        return this.segmentsService.saveSegmentConformanceStatements(this.segmentId, this.segmentConformanceStatements);
    };
    SegmentEditConformanceStatementsComponent.prototype.popChild = function (id, dtId, parentTreeNode) {
        var _this = this;
        this.datatypesService.getDatatypeStructure(dtId).then(function (dtStructure) {
            _this.idMap[id].dtName = dtStructure.name;
            if (dtStructure.children) {
                for (var _i = 0, _a = dtStructure.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var childData = JSON.parse(JSON.stringify(parentTreeNode.data));
                    _this.makeChild(childData, child.data.id, '1');
                    var treeNode = {
                        label: child.data.name,
                        data: childData,
                        expandedIcon: "fa-folder-open",
                        collapsedIcon: "fa-folder",
                    };
                    var data = {
                        id: child.data.id,
                        name: child.data.name,
                        max: "1",
                        position: child.data.position,
                        usage: child.data.usage,
                        dtId: child.data.ref.id
                    };
                    _this.idMap[id + '-' + data.id] = data;
                    _this.popChild(id + '-' + data.id, data.dtId, treeNode);
                    if (!parentTreeNode.children)
                        parentTreeNode.children = [];
                    parentTreeNode.children.push(treeNode);
                }
            }
        });
    };
    SegmentEditConformanceStatementsComponent.prototype.makeChild = function (data, id, para) {
        if (data.child)
            this.makeChild(data.child, id, para);
        else
            data.child = {
                elementId: id,
                instanceParameter: para
            };
    };
    SegmentEditConformanceStatementsComponent.prototype.changeType = function () {
        if (this.selectedConformanceStatement.type == 'ASSERTION') {
            this.selectedConformanceStatement.assertion = {};
            this.selectedConformanceStatement.assertion = { mode: "SIMPLE" };
        }
        else if (this.selectedConformanceStatement.type == 'FREE') {
            this.selectedConformanceStatement.assertion = undefined;
        }
        else if (this.selectedConformanceStatement.type == 'PREDEFINEDPATTERNS') {
            this.selectedConformanceStatement.assertion = undefined;
        }
        else if (this.selectedConformanceStatement.type == 'PREDEFINED') {
            this.selectedConformanceStatement.assertion = undefined;
        }
    };
    SegmentEditConformanceStatementsComponent.prototype.changeAssertionMode = function () {
        if (this.selectedConformanceStatement.assertion.mode == 'SIMPLE') {
            this.selectedConformanceStatement.assertion = { mode: "SIMPLE" };
        }
        else if (this.selectedConformanceStatement.assertion.mode == 'COMPLEX') {
            this.selectedConformanceStatement.assertion = { mode: "COMPLEX" };
        }
    };
    SegmentEditConformanceStatementsComponent.prototype.submitCS = function () {
        if (this.selectedConformanceStatement.type === 'ASSERTION')
            this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedConformanceStatement.assertion, this.idMap);
        this.deleteCS(this.selectedConformanceStatement.identifier);
        this.segmentConformanceStatements.conformanceStatements.push(this.selectedConformanceStatement);
        this.selectedConformanceStatement = {};
        this.editorTab = false;
        this.listTab = true;
    };
    SegmentEditConformanceStatementsComponent.prototype.selectCS = function (cs) {
        this.selectedConformanceStatement = JSON.parse(JSON.stringify(cs));
        this.editorTab = true;
        this.listTab = false;
    };
    SegmentEditConformanceStatementsComponent.prototype.deleteCS = function (identifier) {
        this.segmentConformanceStatements.conformanceStatements = __WEBPACK_IMPORTED_MODULE_5_underscore__["_"].without(this.segmentConformanceStatements.conformanceStatements, __WEBPACK_IMPORTED_MODULE_5_underscore__["_"].findWhere(this.segmentConformanceStatements.conformanceStatements, { identifier: identifier }));
    };
    SegmentEditConformanceStatementsComponent.prototype.printCS = function (cs) {
        console.log(cs);
    };
    SegmentEditConformanceStatementsComponent.prototype.onTabOpen = function (e) {
        if (e.index === 0)
            this.selectedConformanceStatement = {};
    };
    SegmentEditConformanceStatementsComponent.prototype.changeComplexAssertionType = function (constraint) {
        if (constraint.complexAssertionType === 'ANDOR') {
            constraint.child = undefined;
            constraint.ifAssertion = undefined;
            constraint.thenAssertion = undefined;
            constraint.operator = 'AND';
            constraint.assertions = [];
            constraint.assertions.push({
                "mode": "SIMPLE"
            });
            constraint.assertions.push({
                "mode": "SIMPLE"
            });
        }
        else if (constraint.complexAssertionType === 'NOT') {
            constraint.assertions = undefined;
            constraint.ifAssertion = undefined;
            constraint.thenAssertion = undefined;
            constraint.child = {
                "mode": "SIMPLE"
            };
        }
        else if (constraint.complexAssertionType === 'IFTHEN') {
            constraint.assertions = undefined;
            constraint.child = undefined;
            constraint.ifAssertion = {
                "mode": "SIMPLE"
            };
            constraint.thenAssertion = {
                "mode": "SIMPLE"
            };
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('csForm'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_8__angular_forms__["NgForm"])
    ], SegmentEditConformanceStatementsComponent.prototype, "csForm", void 0);
    SegmentEditConformanceStatementsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-conformancestatements/segment-edit-conformancestatements.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-conformancestatements/segment-edit-conformancestatements.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"],
            __WEBPACK_IMPORTED_MODULE_3__service_segments_segments_service__["a" /* SegmentsService */],
            __WEBPACK_IMPORTED_MODULE_4__service_datatypes_datatypes_service__["a" /* DatatypesService */],
            __WEBPACK_IMPORTED_MODULE_6__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */],
            __WEBPACK_IMPORTED_MODULE_7__service_constraints_constraints_service__["a" /* ConstraintsService */]])
    ], SegmentEditConformanceStatementsComponent);
    return SegmentEditConformanceStatementsComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-conformancestatements/segment-edit-conformancestatements.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditConformanceStatementsResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/**
 * Created by ena3 on 5/18/18.
 */
/**
 * Created by ena3 on 4/16/18.
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



var SegmentEditConformanceStatementsResolver = (function () {
    function SegmentEditConformanceStatementsResolver(http, segmentService) {
        this.http = http;
        this.segmentService = segmentService;
    }
    SegmentEditConformanceStatementsResolver.prototype.resolve = function (route, rstate) {
        var segmentId = route.params["segmentId"];
        return this.segmentService.getSegmentConformanceStatements(segmentId);
    };
    SegmentEditConformanceStatementsResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__service_segments_segments_service__["a" /* SegmentsService */]])
    ], SegmentEditConformanceStatementsResolver);
    return SegmentEditConformanceStatementsResolver;
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

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__segment_metadata_segment_edit_metadata_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-edit-metadata.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__segment_predef_segment_edit_predef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-predef/segment-edit-predef.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__segment_postdef_segment_edit_postdef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-postdef/segment-edit-postdef.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__segment_structure_segment_edit_structure_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-structure/segment-edit-structure.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__segment_conformancestatements_segment_edit_conformancestatements_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-conformancestatements/segment-edit-conformancestatements.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__segment_metadata_segment_edit_metadata_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-edit-metadata.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__segment_structure_segment_edit_structure_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-structure/segment-edit-structure.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__segment_predef_segment_edit_predef_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-predef/segment-edit-predef.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__segment_postdef_segment_edit_postdef_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-postdef/segment-edit-postdef.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__segment_conformancestatements_segment_edit_conformancestatements_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-conformancestatements/segment-edit-conformancestatements.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__guards_save_guard__ = __webpack_require__("../../../../../src/app/guards/save.guard.ts");
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
                        path: ':segmentId', component: __WEBPACK_IMPORTED_MODULE_5__segment_structure_segment_edit_structure_component__["a" /* SegmentEditStructureComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_12__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { segmentStructure: __WEBPACK_IMPORTED_MODULE_8__segment_structure_segment_edit_structure_resolver__["a" /* SegmentEditStructureResolver */] }
                    },
                    {
                        path: ':segmentId/metadata', component: __WEBPACK_IMPORTED_MODULE_2__segment_metadata_segment_edit_metadata_component__["a" /* SegmentEditMetadataComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_12__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { segmentMetadata: __WEBPACK_IMPORTED_MODULE_7__segment_metadata_segment_edit_metadata_resolver__["a" /* SegmentEditMetadatResolver */] }
                    },
                    {
                        path: ':segmentId/preDef', component: __WEBPACK_IMPORTED_MODULE_3__segment_predef_segment_edit_predef_component__["a" /* SegmentEditPredefComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_12__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { segmentPredef: __WEBPACK_IMPORTED_MODULE_9__segment_predef_segment_edit_predef_resolver__["a" /* SegmentEditPredefResolver */] }
                    },
                    {
                        path: ':segmentId/structure', component: __WEBPACK_IMPORTED_MODULE_5__segment_structure_segment_edit_structure_component__["a" /* SegmentEditStructureComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_12__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { segmentStructure: __WEBPACK_IMPORTED_MODULE_8__segment_structure_segment_edit_structure_resolver__["a" /* SegmentEditStructureResolver */] }
                    },
                    {
                        path: ':segmentId/postDef', component: __WEBPACK_IMPORTED_MODULE_4__segment_postdef_segment_edit_postdef_component__["a" /* SegmentEditPostdefComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_12__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { segmentPostdef: __WEBPACK_IMPORTED_MODULE_10__segment_postdef_segment_edit_postdef_resolver__["a" /* SegmentEditPostdefResolver */] }
                    },
                    {
                        path: ':segmentId/conformanceStatement', component: __WEBPACK_IMPORTED_MODULE_6__segment_conformancestatements_segment_edit_conformancestatements_component__["a" /* SegmentEditConformanceStatementsComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_12__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { segmentConformanceStatements: __WEBPACK_IMPORTED_MODULE_11__segment_conformancestatements_segment_edit_conformancestatements_resolver__["a" /* SegmentEditConformanceStatementsResolver */] }
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

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SegmentEditModule", function() { return SegmentEditModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__segment_metadata_segment_edit_metadata_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-edit-metadata.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__segment_structure_segment_edit_structure_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-structure/segment-edit-structure.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__segment_conformancestatements_segment_edit_conformancestatements_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-conformancestatements/segment-edit-conformancestatements.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__segment_predef_segment_edit_predef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-predef/segment-edit-predef.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__segment_postdef_segment_edit_postdef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-postdef/segment-edit-postdef.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__segment_edit_routing_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_components_tabmenu_tabmenu__ = __webpack_require__("../../../../primeng/components/tabmenu/tabmenu.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_components_tabmenu_tabmenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_primeng_components_tabmenu_tabmenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_primeng_components_treetable_treetable__ = __webpack_require__("../../../../primeng/components/treetable/treetable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_primeng_components_treetable_treetable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_primeng_components_treetable_treetable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_primeng_components_dialog_dialog__ = __webpack_require__("../../../../primeng/components/dialog/dialog.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_primeng_components_dialog_dialog___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_primeng_components_dialog_dialog__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_primeng_components_dropdown_dropdown__ = __webpack_require__("../../../../primeng/components/dropdown/dropdown.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_primeng_components_dropdown_dropdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_primeng_components_dropdown_dropdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_primeng_button__ = __webpack_require__("../../../../primeng/button.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_primeng_button___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_primeng_button__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_primeng_accordion__ = __webpack_require__("../../../../primeng/accordion.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_primeng_accordion___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_primeng_accordion__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_primeng_selectbutton__ = __webpack_require__("../../../../primeng/selectbutton.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_primeng_selectbutton___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_primeng_selectbutton__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_primeng_table__ = __webpack_require__("../../../../primeng/table.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_primeng_table___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_primeng_table__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__utils_utils_module__ = __webpack_require__("../../../../../src/app/utils/utils.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__segment_metadata_segment_edit_metadata_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-edit-metadata.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_angular_froala_wysiwyg__ = __webpack_require__("../../../../angular-froala-wysiwyg/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_primeng_message__ = __webpack_require__("../../../../primeng/message.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_primeng_message___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20_primeng_message__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__segment_structure_segment_edit_structure_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-structure/segment-edit-structure.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__segment_predef_segment_edit_predef_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-predef/segment-edit-predef.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__segment_postdef_segment_edit_postdef_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-postdef/segment-edit-postdef.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__segment_conformancestatements_segment_edit_conformancestatements_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-conformancestatements/segment-edit-conformancestatements.resolver.ts");
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
                __WEBPACK_IMPORTED_MODULE_10__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_8_primeng_components_tabmenu_tabmenu__["TabMenuModule"],
                __WEBPACK_IMPORTED_MODULE_11_primeng_components_dialog_dialog__["DialogModule"],
                __WEBPACK_IMPORTED_MODULE_12_primeng_components_dropdown_dropdown__["DropdownModule"],
                __WEBPACK_IMPORTED_MODULE_7__segment_edit_routing_module__["a" /* SegmentEditRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_17__utils_utils_module__["a" /* UtilsModule */],
                __WEBPACK_IMPORTED_MODULE_9_primeng_components_treetable_treetable__["TreeTableModule"],
                __WEBPACK_IMPORTED_MODULE_13_primeng_button__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_14_primeng_accordion__["AccordionModule"],
                __WEBPACK_IMPORTED_MODULE_15_primeng_selectbutton__["SelectButtonModule"],
                __WEBPACK_IMPORTED_MODULE_16_primeng_table__["TableModule"],
                __WEBPACK_IMPORTED_MODULE_19_angular_froala_wysiwyg__["a" /* FroalaEditorModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_19_angular_froala_wysiwyg__["b" /* FroalaViewModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_20_primeng_message__["MessageModule"]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_18__segment_metadata_segment_edit_metadata_resolver__["a" /* SegmentEditMetadatResolver */], __WEBPACK_IMPORTED_MODULE_21__segment_structure_segment_edit_structure_resolver__["a" /* SegmentEditStructureResolver */], __WEBPACK_IMPORTED_MODULE_22__segment_predef_segment_edit_predef_resolver__["a" /* SegmentEditPredefResolver */], __WEBPACK_IMPORTED_MODULE_23__segment_postdef_segment_edit_postdef_resolver__["a" /* SegmentEditPostdefResolver */], __WEBPACK_IMPORTED_MODULE_24__segment_conformancestatements_segment_edit_conformancestatements_resolver__["a" /* SegmentEditConformanceStatementsResolver */]],
            declarations: [__WEBPACK_IMPORTED_MODULE_2__segment_metadata_segment_edit_metadata_component__["a" /* SegmentEditMetadataComponent */], __WEBPACK_IMPORTED_MODULE_3__segment_structure_segment_edit_structure_component__["a" /* SegmentEditStructureComponent */], __WEBPACK_IMPORTED_MODULE_5__segment_predef_segment_edit_predef_component__["a" /* SegmentEditPredefComponent */], __WEBPACK_IMPORTED_MODULE_6__segment_postdef_segment_edit_postdef_component__["a" /* SegmentEditPostdefComponent */], __WEBPACK_IMPORTED_MODULE_4__segment_conformancestatements_segment_edit_conformancestatements_component__["a" /* SegmentEditConformanceStatementsComponent */]],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["CUSTOM_ELEMENTS_SCHEMA"]]
        })
    ], SegmentEditModule);
    return SegmentEditModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-edit-metadata.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".sg-bar {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f2f5f6+0,e3eaed+37,c8d7dc+100;Grey+3D+%234 */\n  background: #f2f5f6; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n  background: -webkit-gradient(linear, left top, left bottom, from(#f2f5f6),color-stop(37%, #e3eaed),to(#c8d7dc));\n  background: linear-gradient(to bottom, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f5f6', endColorstr='#c8d7dc',GradientType=0 ); /* IE6-9 */\n\n\n  padding-bottom: 10px;\n  padding-top   : 10px;\n  font-size : 24px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-edit-metadata.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>SEGMENT Metadata</h2>\n<div *ngIf=\"segmentMetadata\">\n    <form #editForm=\"ngForm\">\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Name\n            </label>\n            <input name=\"name\" id=\"name\" pInputText type=\"text\" disabled class=\"ui-g-10\" #name=\"ngModel\" [(ngModel)]=\"segmentMetadata.name\" required />\n            <div class=\"ui-g-offset-1\" *ngIf=\"name.invalid&& (name.dirty || name.touched)\">\n                <p-message severity=\"error\" text=\"Name is required\"></p-message>\n            </div>\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Flavor Name (Ext)\n            </label>\n            <input name=\"ext\" id=\"ext\" pInputText type=\"text\" class=\"ui-g-10\" #ext=\"ngModel\" [(ngModel)]=\"segmentMetadata.ext\" required />\n            <div class=\"ui-g-offset-2\" *ngIf=\"ext.invalid && (ext.dirty || ext.touched)\">\n                <p-message severity=\"error\" text=\"Extension is required\"></p-message>\n            </div>\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Description\n            </label>\n            <input name=\"description\" id=\"description\" pInputText type=\"text\" class=\"ui-g-10\" #description=\"ngModel\" [(ngModel)]=\"segmentMetadata.description\" />\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Author Notes\n            </label>\n            <div class=\"ui-g-10\" [froalaEditor] [(froalaModel)]=\"segmentMetadata.authorNote\"></div>\n        </div>\n    </form>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-edit-metadata.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditMetadataComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_toc_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_indexed_db_segments_segments_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/segments/segments-toc.service.ts");
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
 * Created by Jungyub on 10/23/17.
 */









var SegmentEditMetadataComponent = (function () {
    function SegmentEditMetadataComponent(indexedDbService, route, router, segmentsService, segmentsTocService, tocService) {
        var _this = this;
        this.indexedDbService = indexedDbService;
        this.route = route;
        this.router = router;
        this.segmentsService = segmentsService;
        this.segmentsTocService = segmentsTocService;
        this.tocService = tocService;
        this.tocService.getActiveNode().subscribe(function (x) {
            console.log(x);
            _this.currentNode = x;
        });
    }
    SegmentEditMetadataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.route.data.map(function (data) { return data.segmentMetadata; }).subscribe(function (x) {
            _this.segmentsTocService.getAll().then(function (segments) {
                console.log(segments);
                _this.backup = x;
                _this.segmentMetadata = __WEBPACK_IMPORTED_MODULE_2_lodash__["cloneDeep"](_this.backup);
            });
        });
    };
    SegmentEditMetadataComponent.prototype.reset = function () {
        this.segmentMetadata = __WEBPACK_IMPORTED_MODULE_2_lodash__["cloneDeep"](this.backup);
    };
    SegmentEditMetadataComponent.prototype.getCurrent = function () {
        return this.segmentMetadata;
    };
    SegmentEditMetadataComponent.prototype.getBackup = function () {
        return this.backup;
    };
    SegmentEditMetadataComponent.prototype.isValid = function () {
        return !this.editForm.invalid;
    };
    SegmentEditMetadataComponent.prototype.save = function () {
        var _this = this;
        this.tocService.getActiveNode().subscribe(function (x) {
            var node = x;
            node.data.data.ext = __WEBPACK_IMPORTED_MODULE_2_lodash__["cloneDeep"](_this.segmentMetadata.ext);
        });
        console.log("saving segment Meta Data");
        return this.segmentsService.saveSegmentMetadata(this.segmentId, this.segmentMetadata);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('editForm'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_7__angular_forms__["NgForm"])
    ], SegmentEditMetadataComponent.prototype, "editForm", void 0);
    SegmentEditMetadataComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'segment-edit',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-edit-metadata.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-edit-metadata.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_5__service_segments_segments_service__["a" /* SegmentsService */], __WEBPACK_IMPORTED_MODULE_8__service_indexed_db_segments_segments_toc_service__["a" /* SegmentsTocService */], __WEBPACK_IMPORTED_MODULE_4__service_toc_service__["a" /* TocService */]])
    ], SegmentEditMetadataComponent);
    return SegmentEditMetadataComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-edit-metadata.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditMetadatResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/**
 * Created by ena3 on 5/18/18.
 */
/**
 * Created by ena3 on 4/16/18.
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



var SegmentEditMetadatResolver = (function () {
    function SegmentEditMetadatResolver(http, segmentService) {
        this.http = http;
        this.segmentService = segmentService;
    }
    SegmentEditMetadatResolver.prototype.resolve = function (route, rstate) {
        var segmentId = route.params['segmentId'];
        return this.segmentService.getSegmentMetadata(segmentId);
    };
    SegmentEditMetadatResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__service_segments_segments_service__["a" /* SegmentsService */]])
    ], SegmentEditMetadatResolver);
    return SegmentEditMetadatResolver;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-postdef/segment-edit-postdef.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".sg-bar {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f2f5f6+0,e3eaed+37,c8d7dc+100;Grey+3D+%234 */\n  background: #f2f5f6; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n  background: -webkit-gradient(linear, left top, left bottom, from(#f2f5f6),color-stop(37%, #e3eaed),to(#c8d7dc));\n  background: linear-gradient(to bottom, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f5f6', endColorstr='#c8d7dc',GradientType=0 ); /* IE6-9 */\n\n\n  padding-bottom: 10px;\n  padding-top   : 10px;\n  font-size : 24px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-postdef/segment-edit-postdef.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>SEGMENT Post Definition TEXT</h2>\n<div *ngIf=\"segmentPostdef\">\n    <form #editForm=\"ngForm\">\n        <div class=\"ui-g input-box\">\n            <div class=\"ui-g-12\" [froalaEditor] [(froalaModel)]=\"segmentPostdef.postDef\"></div>\n        </div>\n    </form>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-postdef/segment-edit-postdef.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditPostdefComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_lodash__);
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
 * Created by Jungyub on 10/23/17.
 */







var SegmentEditPostdefComponent = (function () {
    function SegmentEditPostdefComponent(route, router, segmentsService, http) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.segmentsService = segmentsService;
        this.http = http;
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
    }
    SegmentEditPostdefComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.route.data.map(function (data) { return data.segmentPostdef; }).subscribe(function (x) {
            _this.backup = x;
            _this.segmentPostdef = __WEBPACK_IMPORTED_MODULE_6_lodash__["cloneDeep"](_this.backup);
        });
    };
    SegmentEditPostdefComponent.prototype.reset = function () {
        this.segmentPostdef = __WEBPACK_IMPORTED_MODULE_6_lodash__["cloneDeep"](this.backup);
    };
    SegmentEditPostdefComponent.prototype.getCurrent = function () {
        return this.segmentPostdef;
    };
    SegmentEditPostdefComponent.prototype.getBackup = function () {
        return this.backup;
    };
    SegmentEditPostdefComponent.prototype.isValid = function () {
        return !this.editForm.invalid;
    };
    SegmentEditPostdefComponent.prototype.save = function () {
        return this.segmentsService.saveSegmentPostDef(this.segmentId, this.segmentPostdef);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('editForm'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_5__angular_forms__["NgForm"])
    ], SegmentEditPostdefComponent.prototype, "editForm", void 0);
    SegmentEditPostdefComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'segment-edit',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-postdef/segment-edit-postdef.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-postdef/segment-edit-postdef.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_4__service_segments_segments_service__["a" /* SegmentsService */], __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */]])
    ], SegmentEditPostdefComponent);
    return SegmentEditPostdefComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-postdef/segment-edit-postdef.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditPostdefResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/**
 * Created by ena3 on 5/18/18.
 */
/**
 * Created by ena3 on 4/16/18.
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



var SegmentEditPostdefResolver = (function () {
    function SegmentEditPostdefResolver(http, segmentService) {
        this.http = http;
        this.segmentService = segmentService;
    }
    SegmentEditPostdefResolver.prototype.resolve = function (route, rstate) {
        var segmentId = route.params["segmentId"];
        return this.segmentService.getSegmentPostDef(segmentId);
    };
    SegmentEditPostdefResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__service_segments_segments_service__["a" /* SegmentsService */]])
    ], SegmentEditPostdefResolver);
    return SegmentEditPostdefResolver;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-predef/segment-edit-predef.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".sg-bar {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f2f5f6+0,e3eaed+37,c8d7dc+100;Grey+3D+%234 */\n  background: #f2f5f6; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n  background: -webkit-gradient(linear, left top, left bottom, from(#f2f5f6),color-stop(37%, #e3eaed),to(#c8d7dc));\n  background: linear-gradient(to bottom, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f5f6', endColorstr='#c8d7dc',GradientType=0 ); /* IE6-9 */\n\n\n  padding-bottom: 10px;\n  padding-top   : 10px;\n  font-size : 24px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-predef/segment-edit-predef.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>SEGMENT Pre Definition TEXT</h2>\n<div *ngIf=\"segmentPredef\">\n    <form #editForm=\"ngForm\">\n        <div class=\"ui-g input-box\">\n            <div class=\"ui-g-12\" [froalaEditor] [(froalaModel)]=\"segmentPredef.preDef\"></div>\n        </div>\n    </form>\n</div>"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-predef/segment-edit-predef.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditPredefComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_lodash__);
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
 * Created by Jungyub on 10/23/17.
 */







var SegmentEditPredefComponent = (function () {
    function SegmentEditPredefComponent(route, router, segmentsService, http) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.segmentsService = segmentsService;
        this.http = http;
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
    }
    SegmentEditPredefComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.route.data.map(function (data) { return data.segmentPredef; }).subscribe(function (x) {
            _this.backup = x;
            _this.segmentPredef = __WEBPACK_IMPORTED_MODULE_6_lodash__["cloneDeep"](_this.backup);
        });
    };
    SegmentEditPredefComponent.prototype.reset = function () {
        this.segmentPredef = __WEBPACK_IMPORTED_MODULE_6_lodash__["cloneDeep"](this.backup);
    };
    SegmentEditPredefComponent.prototype.getCurrent = function () {
        return this.segmentPredef;
    };
    SegmentEditPredefComponent.prototype.getBackup = function () {
        return this.backup;
    };
    SegmentEditPredefComponent.prototype.isValid = function () {
        return !this.editForm.invalid;
    };
    SegmentEditPredefComponent.prototype.save = function () {
        return this.segmentsService.saveSegmentPreDef(this.segmentId, this.segmentPredef);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('editForm'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_5__angular_forms__["NgForm"])
    ], SegmentEditPredefComponent.prototype, "editForm", void 0);
    SegmentEditPredefComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'segment-edit',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-predef/segment-edit-predef.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-predef/segment-edit-predef.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_4__service_segments_segments_service__["a" /* SegmentsService */], __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */]])
    ], SegmentEditPredefComponent);
    return SegmentEditPredefComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-predef/segment-edit-predef.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditPredefResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/**
 * Created by ena3 on 5/18/18.
 */
/**
 * Created by ena3 on 4/16/18.
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



var SegmentEditPredefResolver = (function () {
    function SegmentEditPredefResolver(http, segmentService) {
        this.http = http;
        this.segmentService = segmentService;
    }
    SegmentEditPredefResolver.prototype.resolve = function (route, rstate) {
        var segmentId = route.params["segmentId"];
        return this.segmentService.getSegmentPreDef(segmentId);
    };
    SegmentEditPredefResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__service_segments_segments_service__["a" /* SegmentsService */]])
    ], SegmentEditPredefResolver);
    return SegmentEditPredefResolver;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-structure/segment-edit-structure.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".sg-bar {\n  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f2f5f6+0,e3eaed+37,c8d7dc+100;Grey+3D+%234 */\n  background: #f2f5f6; /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */\n  background: -webkit-gradient(linear, left top, left bottom, from(#f2f5f6),color-stop(37%, #e3eaed),to(#c8d7dc));\n  background: linear-gradient(to bottom, #f2f5f6 0%,#e3eaed 37%,#c8d7dc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f5f6', endColorstr='#c8d7dc',GradientType=0 ); /* IE6-9 */\n\n\n  padding-bottom: 10px;\n  padding-top   : 10px;\n  font-size : 24px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-structure/segment-edit-structure.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>Segment Structure</h2>\n\n<div *ngIf=\"segmentStructure\">\n    <p-treeTable [value]=\"segmentStructure.children\" tableStyleClass=\"table-condensed table-stripped table-bordered\" (onNodeExpand)=\"loadNode($event)\">\n\n        <p-column header=\"Name\" [style]=\"{'width':'350px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <display-badge [type]=\"node.data.displayData.type\"></display-badge>{{node.data.position}}. {{node.data.name}}\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Usage\" [style]=\"{'width':'190px'}\" >\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\" >\n                <div *ngIf=\"node.data.displayData.type === 'FIELD'\">\n                    <p-dropdown *ngIf=\"node.data.usage !== 'C'\" [options]=\"usages\" [(ngModel)]=\"node.data.usage\" appendTo=\"body\" (onChange)=\"onUsageChange(node)\" [style]=\"{'width' : '100%'}\"></p-dropdown>\n                    <div *ngIf=\"node.data.usage === 'C'\">\n                        <p-dropdown [options]=\"usages\" [(ngModel)]=\"node.data.usage\" appendTo=\"body\" (onChange)=\"onUsageChange(node)\" [style]=\"{'width' : '30%'}\"></p-dropdown>\n                        (<p-dropdown [options]=\"cUsages\" [(ngModel)]=\"node.data.displayData.segmentBinding.predicate.trueUsage\" appendTo=\"body\" [style]=\"{'width' : '30%'}\"></p-dropdown>/\n                        <p-dropdown [options]=\"cUsages\" [(ngModel)]=\"node.data.displayData.segmentBinding.predicate.falseUsage\" appendTo=\"body\" [style]=\"{'width' : '30%'}\"></p-dropdown>)\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.type === 'COMPONENT'\">\n                    <div *ngIf=\"node.data.usage !== 'C' || !node.data.displayData.fieldDTbinding|| !node.data.displayData.fieldDTbinding.predicate\">{{node.data.usage}}</div>\n                    <div *ngIf=\"node.data.usage === 'C' && node.data.displayData.fieldDTbinding && node.data.displayData.fieldDTbinding.predicate\">C({{node.data.displayData.fieldDTbinding.predicate.trueUsage}}/{{node.data.displayData.fieldDTbinding.predicate.falseUsage}})</div>\n                </div>\n                <div *ngIf=\"node.data.displayData.type === 'SUBCOMPONENT'\">\n                    <div *ngIf=\"node.data.usage !== 'C' || !node.data.displayData.componentDTbinding || !node.data.displayData.componentDTbinding.predicate\">{{node.data.usage}}</div>\n                    <div *ngIf=\"node.data.usage === 'C' && node.data.displayData.componentDTbinding && node.data.displayData.componentDTbinding.predicate\">C({{node.data.displayData.componentDTbinding.predicate.trueUsage}}/{{node.data.displayData.componentDTbinding.predicate.falseUsage}})</div>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Cardinality\" [style]=\"{'width':'100px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'FIELD'\">\n                    <input required id=\"min\" [(ngModel)]=\"node.data.min\" type=\"number\" #min=\"ngModel\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n                    <input required id=\"max\" [(ngModel)]=\"node.data.max\" type=\"text\" #max=\"ngModel\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Length\" [style]=\"{'width':'150px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'FIELD'\">\n                    <div *ngIf=\"node.data.minLength !== 'NA' && node.data.displayData.datatype.leaf\">\n                        <input [(ngModel)]=\"node.data.minLength\" type=\"number\" style=\"width:40%;border-width:0px 0px 1px 0px\"/>\n                        <input [(ngModel)]=\"node.data.maxLength\" type=\"text\" style=\"width:40%;border-width:0px 0px 1px 0px\"/>\n                        <i class=\"fa fa-times\" (click)=\"delLength(node)\" style=\"width:20%;\"></i>\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.type !== 'FIELD'\">\n                    [{{node.data.minLength}}..{{node.data.maxLength}}]\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Conf. Length\" [style]=\"{'width':'120px'}\" >\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'FIELD'\">\n                    <ng-container *ngIf=\"node.data.confLength !== 'NA' && node.data.displayData.datatype.leaf\">\n                        <input [(ngModel)]=\"node.data.confLength\" type=\"text\" style=\"width: 80%;border-width:0px 0px 1px 0px\"/>\n                        <i class=\"fa fa-times\" (click)=\"delConfLength(node)\" style=\"width:20%;\"></i>\n                    </ng-container>\n                </div>\n                <div *ngIf=\"node.data.displayData.type !== 'FIELD'\">\n                    {{node.data.confLength}}\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Datatype\" [style]=\"{'width':'200px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"!node.data.displayData.datatype.edit\">\n                    <display-ref [elm]=\"node.data.displayData.datatype\"></display-ref>\n                    <i class=\"fa fa-pencil\" *ngIf=\"node.data.displayData.type === 'FIELD'\" (click)=\"makeEditModeForDatatype(node)\"></i>\n                </div>\n                <div *ngIf=\"node.data.displayData.datatype.edit\">\n                    <p-dropdown [options]=\"node.data.displayData.datatype.dtOptions\" [(ngModel)]=\"node.data.displayData.datatype.id\" (onChange)=\"onDatatypeChange(node)\" appendTo=\"body\" [style]=\"{'width':'100%'}\">\n                        <ng-template let-option pTemplate=\"body\">\n                            <div class=\"ui-helper-clearfix\" style=\"position: relative;height: 25px;\">\n                                <display-ref *ngIf=\"option.value\" [elm]=\"getDatatypeElm(option.value)\"></display-ref>\n                                <span *ngIf=\"!option.value\" (click)=\"node.data.displayData.datatype.dtOptions = datatypeOptions\">{{option.label}}</span>\n                            </div>\n                        </ng-template>\n                    </p-dropdown>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"ValueSet\" [style]=\"{'width':valuesetColumnWidth}\">\n            <ng-template let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.valuesetAllowed && !node.data.displayData.hasSingleCode\">\n                    <div *ngIf=\"node.data.displayData.segmentBinding\">\n                        <div *ngFor=\"let vs of node.data.displayData.segmentBinding.valuesetBindings\">\n                            <div *ngIf=\"!vs.edit\">\n                                <display-ref [elm]=\"vs\" [from]=\"'SEGMENT'\"></display-ref>\n                                <i class=\"fa fa-pencil\" (click)=\"makeEditModeForValueSet(vs)\" style=\"width:20%;\"></i>\n                                <i class=\"fa fa-times\" (click)=\"delValueSetBinding(node.data.displayData.segmentBinding, vs, node.data.displayData)\" style=\"width:20%;\"></i>\n                            </div>\n                            <div *ngIf=\"vs.edit\">\n                                <p-dropdown [options]=\"valuesetOptions\" [(ngModel)]=\"vs.newvalue.valuesetId\" appendTo=\"body\" [style]=\"{'width':'150px'}\" filter=\"true\">\n                                    <ng-template let-option pTemplate=\"body\">\n                                        <div class=\"ui-helper-clearfix\" style=\"position: relative;height: 25px;\">\n                                            <display-ref *ngIf=\"option.value\" [elm]=\"getValueSetElm(option.value)\"></display-ref>\n                                            <span *ngIf=\"!option.value\">{{option.label}}</span>\n                                        </div>\n                                    </ng-template>\n                                </p-dropdown>\n                                <p-dropdown [options]=\"valuesetStrengthOptions\" [(ngModel)]=\"vs.newvalue.strength\" appendTo=\"body\" [style]=\"{'width':'150px'}\">\n                                </p-dropdown>\n                                <p-dropdown *ngIf=\"node.data.displayData.valueSetLocationOptions\" [options]=\"node.data.displayData.valueSetLocationOptions\" [(ngModel)]=\"vs.newvalue.valuesetLocations\" appendTo=\"body\" [style]=\"{'width':'150px'}\">\n                                </p-dropdown>\n                                <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewValueSet(vs); node.data.displayData.hasValueSet = true;\" [disabled]=\"!vs.newvalue.valuesetId\"></button>\n                            </div>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.valuesetBindings || node.data.displayData.segmentBinding.valuesetBindings.length === 0) && node.data.displayData.fieldDTbinding\">\n                        <div *ngFor=\"let vs of node.data.displayData.fieldDTbinding.valuesetBindings\">\n                            <div *ngIf=\"!vs.edit\">\n                                <display-ref [elm]=\"vs\" [from]=\"'FIELD'\"></display-ref>\n                            </div>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.valuesetBindings || node.data.displayData.segmentBinding.valuesetBindings.length === 0) && (!node.data.displayData.fieldDTbinding || !node.data.displayData.fieldDTbinding.valuesetBindings || node.data.displayData.fieldDTbinding.valuesetBindings.length === 0) && node.data.displayData.componentDTbinding\">\n                        <div *ngFor=\"let vs of node.data.displayData.componentDTbinding.valuesetBindings\">\n                            <div *ngIf=\"!vs.edit\">\n                                <display-ref [elm]=\"vs\" [from]=\"'COMPONENT'\"></display-ref>\n                            </div>\n                        </div>\n                    </div>\n                    <i class=\"fa fa-plus\" *ngIf=\"node.data.displayData.multipleValuesetAllowed || !node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.valuesetBindings || node.data.displayData.segmentBinding.valuesetBindings.length == 0\" (click)=\"addNewValueSet(node)\"></i>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Single Code\" [style]=\"{'width':'200px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.valuesetAllowed && node.data.displayData.datatype.leaf && !node.data.displayData.hasValueSet\">\n                    <div *ngIf=\"node.data.displayData.segmentBinding\">\n                        <div *ngIf=\"node.data.displayData.segmentBinding.externalSingleCode\">\n                            <div *ngIf=\"!node.data.displayData.segmentBinding.externalSingleCode.edit\">\n                                <display-singlecode [elm]=\"node.data.displayData.segmentBinding.externalSingleCode\" [from]=\"'SEGMENT'\"></display-singlecode>\n                                <i class=\"fa fa-pencil\" (click)=\"makeEditModeForSingleCode(node)\" style=\"width:20%;\"></i>\n                                <i class=\"fa fa-times\" (click)=\"deleteSingleCode(node)\" style=\"width:20%;\"></i>\n                            </div>\n                            <div *ngIf=\"node.data.displayData.segmentBinding.externalSingleCode.edit\">\n                                <input [(ngModel)]=\"node.data.displayData.segmentBinding.externalSingleCode.newSingleCode\" type=\"text\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n                                <input [(ngModel)]=\"node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem\" type=\"text\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n                                <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewSingleCode(node); node.data.displayData.hasSingleCode = true;\" [disabled]=\"node.data.displayData.segmentBinding.externalSingleCode.newSingleCode === '' || node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem === ''\"></button>\n                            </div>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.externalSingleCode) && node.data.displayData.fieldDTbinding\">\n                        <div *ngIf=\"node.data.displayData.fieldDTbinding.externalSingleCode\">\n                            <display-singlecode [elm]=\"node.data.displayData.fieldDTbinding.externalSingleCode\" [from]=\"'FIELD'\"></display-singlecode>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.externalSingleCode) && (!node.data.displayData.fieldDTbinding || !node.data.displayData.fieldDTbinding.externalSingleCode) && node.data.displayData.componentDTbinding\">\n                        <div *ngIf=\"node.data.displayData.componentDTbinding.externalSingleCode\">\n                            <display-singlecode [elm]=\"node.data.displayData.componentDTbinding.externalSingleCode\" [from]=\"'COMPONENT'\"></display-singlecode>\n                        </div>\n                    </div>\n                    <i class=\"fa fa-plus\" *ngIf=\"!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.externalSingleCode\" (click)=\"addNewSingleCode(node)\"></i>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Constant Value\" [style]=\"{'width':'200px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.datatype.leaf && !node.data.displayData.valuesetAllowed\">\n                    <div *ngIf=\"node.data.displayData.segmentBinding\">\n                            <div *ngIf=\"!node.data.displayData.segmentBinding.editConstantValue\">\n                                <div *ngIf=\"node.data.displayData.segmentBinding.constantValue\">\n                                    <display-constantvalue [elm]=\"node.data.displayData.segmentBinding.constantValue\" [from]=\"'SEGMENT'\"></display-constantvalue>\n                                    <i class=\"fa fa-pencil\" (click)=\"makeEditModeForConstantValue(node)\" style=\"width:20%;\"></i>\n                                    <i class=\"fa fa-times\" (click)=\"deleteConstantValue(node)\" style=\"width:20%;\"></i>\n                                </div>\n                            </div>\n                            <div *ngIf=\"node.data.displayData.segmentBinding.editConstantValue\">\n                                <input [(ngModel)]=\"node.data.displayData.segmentBinding.newConstantValue\" type=\"text\" style=\"width:90%;border-width:0px 0px 1px 0px\"/>\n                                <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewConstantValue(node)\" [disabled]=\"node.data.displayData.segmentBinding.newConstantValue === ''\"></button>\n                            </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.constantValue) && node.data.displayData.fieldDTbinding\">\n                        <div *ngIf=\"node.data.displayData.fieldDTbinding.constantValue !== undefined  && node.data.displayData.fieldDTbinding.constantValue !== ''\">\n                            <display-constantvalue [elm]=\"node.data.displayData.fieldDTbinding.constantValue\" [from]=\"'FIELD'\"></display-constantvalue>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.constantValue) && (!node.data.displayData.fieldDTbinding || !node.data.displayData.fieldDTbinding.constantValue) && node.data.displayData.componentDTbinding\">\n                        <div *ngIf=\"node.data.displayData.componentDTbinding.constantValue  !== undefined && node.data.displayData.componentDTbinding.constantValue !== ''\">\n                            <display-constantvalue [elm]=\"node.data.displayData.componentDTbinding.constantValue\" [from]=\"'COMPONENT'\"></display-constantvalue>\n                        </div>\n                    </div>\n                    <div *ngIf=\"!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.editConstantValue\">\n                        <i class=\"fa fa-plus\" *ngIf=\"!node.data.displayData.segmentBinding || (node.data.displayData.segmentBinding && !node.data.displayData.segmentBinding.constantValue)\" (click)=\"addNewConstantValue(node)\"></i>\n                    </div>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Predicate\" [style]=\"{'width':'150px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.usage === 'C'\">\n                    <div *ngIf=\"node.data.displayData.type === 'FIELD'\">\n                        <div *ngIf=\"node.data.displayData.segmentBinding && node.data.displayData.segmentBinding.predicate && node.data.displayData.segmentBinding.predicate.freeText\">\n                            {{node.data.displayData.segmentBinding.predicate.freeText}}\n                        </div>\n                        <div *ngIf=\"node.data.displayData.segmentBinding && node.data.displayData.segmentBinding.predicate && node.data.displayData.segmentBinding.predicate.assertion && node.data.displayData.segmentBinding.predicate.assertion.description\">\n                            {{node.data.displayData.segmentBinding.predicate.assertion.description}}\n                        </div>\n                        <i class=\"fa fa-pencil\" (click)=\"editPredicate(node)\" style=\"width:20%;\"></i>\n                    </div>\n                    <div *ngIf=\"node.data.displayData.type === 'COMPONENT'\">\n                        <div *ngIf=\"node.data.displayData.fieldDTbinding && node.data.displayData.fieldDTbinding.predicate && node.data.displayData.fieldDTbinding.predicate.freeText\">\n                            {{node.data.displayData.fieldDTbinding.predicate.freeText}}\n                        </div>\n                        <div *ngIf=\"node.data.displayData.fieldDTbinding && node.data.displayData.fieldDTbinding.predicate && node.data.displayData.fieldDTbinding.predicate.assertion && node.data.displayData.fieldDTbinding.predicate.assertion.description\">\n                            {{node.data.displayData.fieldDTbinding.predicate.assertion.description}}\n                        </div>\n                    </div>\n                    <div *ngIf=\"node.data.displayData.type === 'SUBCOMPONENT'\">\n                        <div *ngIf=\"node.data.displayData.componentDTbinding && node.data.displayData.componentDTbinding.predicate && node.data.displayData.componentDTbinding.predicate.freeText\">\n                            {{node.data.displayData.componentDTbinding.predicate.freeText}}\n                        </div>\n                        <div *ngIf=\"node.data.displayData.componentDTbinding && node.data.displayData.componentDTbinding.predicate && node.data.displayData.componentDTbinding.predicate.assertion && node.data.displayData.componentDTbinding.predicate.assertion.description\">\n                            {{node.data.displayData.componentDTbinding.predicate.assertion.description}}\n                        </div>\n                    </div>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Text Definition\" [style]=\"{'width':'150px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'FIELD'\">\n                    <ng-container *ngIf=\"node.data.text\">\n                        <span (click)=\"editTextDefinition(node)\">{{truncate(node.data.text)}}</span>\n                        <i class=\"fa fa-times\" (click)=\"delTextDefinition(node)\" style=\"width:20%;\"></i>\n                    </ng-container>\n                    <ng-container *ngIf=\"!node.data.text\">\n                        <i class=\"fa fa-pencil\" (click)=\"editTextDefinition(node)\"></i>\n                    </ng-container>\n                </div>\n            </ng-template>\n        </p-column>\n        <p-column header=\"Comment\" [style]=\"{'width':'400px'}\">\n            <ng-template let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.segmentBinding\">\n                    <div *ngFor=\"let c of node.data.displayData.segmentBinding.comments\">\n                        <div *ngIf=\"!c.edit\">\n                            <display-comment [elm]=\"c\" [from]=\"'SEGMENT'\"></display-comment>\n                            <i class=\"fa fa-pencil\" (click)=\"makeEditModeForComment(c)\" style=\"width:20%;\"></i>\n                            <i class=\"fa fa-times\" (click)=\"delCommentBinding(node.data.displayData.segmentBinding, c)\" style=\"width:20%;\"></i>\n                        </div>\n                        <div *ngIf=\"c.edit\">\n                            <textarea pInputTextarea [(ngModel)]=\"c.newComment.description\"></textarea>\n                            <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewComment(c);\" [disabled]=\"c.newComment.description === ''\"></button>\n                        </div>\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.fieldDTbinding\">\n                    <div *ngFor=\"let c of node.data.displayData.fieldDTbinding.comments\">\n                        <display-comment [elm]=\"c\" [from]=\"'FIELD'\"></display-comment>\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.componentDTbinding\">\n                    <div *ngFor=\"let c of node.data.displayData.componentDTbinding.comments\">\n                        <display-comment [elm]=\"c\" [from]=\"'COMPONENT'\"></display-comment>\n                    </div>\n                </div>\n                <i class=\"fa fa-plus\" (click)=\"addNewComment(node)\"></i>\n            </ng-template>\n        </p-column>\n    </p-treeTable>\n\n    <p-dialog *ngIf=\"selectedNode\" header=\"Edit Text Definition of {{selectedNode.data.name}}\" [(visible)]=\"textDefinitionDialogOpen\" [modal]=\"true\" [responsive]=\"true\" [width]=\"350\" [minWidth]=\"200\" [minY]=\"70\">\n        <textarea pInputTextarea [(ngModel)]=\"selectedNode.data.text\"></textarea>\n    </p-dialog>\n\n    <p-dialog *ngIf=\"selectedNode\" header=\"Edit Predicate of {{selectedNode.data.name}}\" [(visible)]=\"preciateEditorOpen\" [modal]=\"true\" [responsive]=\"true\" [width]=\"1200\" [minWidth]=\"800\" [minY]=\"70\">\n        <form #cpForm=\"ngForm\">\n            <div class=\"ui-g ui-fluid\">\n                <div class=\"ui-g-12 ui-md-2\">\n                    <label>Editor Type: </label>\n                </div>\n                <div class=\"ui-g-12 ui-md-10\">\n                    <p-selectButton name=\"type\" [options]=\"constraintTypes\" [(ngModel)]=\"selectedPredicate.type\" (onChange)=\"changeType()\"></p-selectButton>\n                </div>\n            </div>\n\n            <div *ngIf=\"selectedPredicate.type && selectedPredicate.type ==='ASSERTION'\">\n                <div class=\"ui-g ui-fluid\">\n                    <div class=\"ui-g-12 ui-md-2\">\n                        <label>Assertion Type: </label>\n                    </div>\n                    <div class=\"ui-g-12 ui-md-10\">\n                        <p-dropdown id=\"assertionMode\" name=\"assertionMode\" required #assertionMode=\"ngModel\" [options]=\"assertionModes\" [(ngModel)]=\"selectedPredicate.assertion.mode\" (onChange)=\"changeAssertionMode()\"></p-dropdown>\n                        <div *ngIf=\"assertionMode.invalid && (assertionMode.dirty || assertionMode.touched)\" class=\"alert alert-danger\">\n                            <div *ngIf=\"assertionMode.errors.required\">\n                                Assertion Type is required.\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <edit-free-constraint *ngIf=\"selectedPredicate.type === 'FREE'\" [constraint]=\"selectedPredicate\"></edit-free-constraint>\n            <edit-simple-constraint *ngIf=\"selectedPredicate.assertion && selectedPredicate.assertion.mode === 'SIMPLE'\" [constraint]=\"selectedPredicate.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'rootSimple'\"></edit-simple-constraint>\n            <edit-complex-constraint *ngIf=\"selectedPredicate.assertion && selectedPredicate.assertion.mode === 'COMPLEX'\" [constraint]=\"selectedPredicate.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'root'\"></edit-complex-constraint>\n\n            <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-plus\" label=\"Submit\" (click)=\"submitCP()\" [disabled]=\"cpForm.invalid\"></button>\n            <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-print\" label=\"Print\" (click)=\"print(selectedConformanceStatement)\"></button>\n        </form>\n    </p-dialog>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-structure/segment-edit-structure.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditStructureComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_constraints_constraints_service__ = __webpack_require__("../../../../../src/app/service/constraints/constraints.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_underscore__ = __webpack_require__("../../../../underscore/underscore.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_indexed_db_datatypes_datatypes_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/datatypes/datatypes-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__service_indexed_db_valuesets_valuesets_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/valuesets/valuesets-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__service_toc_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__common_constants_types__ = __webpack_require__("../../../../../src/app/common/constants/types.ts");
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
 * Created by Jungyub on 10/23/17.
 */















var SegmentEditStructureComponent = (function () {
    function SegmentEditStructureComponent(indexedDbService, route, router, configService, segmentsService, datatypesService, constraintsService, datatypesTocService, valuesetsTocService, tocService) {
        var _this = this;
        this.indexedDbService = indexedDbService;
        this.route = route;
        this.router = router;
        this.configService = configService;
        this.segmentsService = segmentsService;
        this.datatypesService = datatypesService;
        this.constraintsService = constraintsService;
        this.datatypesTocService = datatypesTocService;
        this.valuesetsTocService = valuesetsTocService;
        this.tocService = tocService;
        this.valuesetColumnWidth = '200px';
        this.textDefinitionDialogOpen = false;
        this.valuesetStrengthOptions = [];
        this.preciateEditorOpen = false;
        this.selectedPredicate = {};
        this.constraintTypes = [];
        this.assertionModes = [];
        this.valuesetsLinks = [];
        this.datatypesLinks = [];
        this.datatypeOptions = [];
        this.valuesetOptions = [{ label: 'Select ValueSet', value: null }];
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
    }
    SegmentEditStructureComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.usages = this.configService._usages;
        this.cUsages = this.configService._cUsages;
        this.valuesetStrengthOptions = this.configService._valuesetStrengthOptions;
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
        this.route.data.map(function (data) { return data.segmentStructure; }).subscribe(function (x) {
            console.log(x);
            _this.tocService.getNodesList(__WEBPACK_IMPORTED_MODULE_14__common_constants_types__["a" /* Types */].DATATYPEREGISTRY).then(function (dtTOCdata) {
                var listTocDTs = dtTOCdata;
                for (var _i = 0, listTocDTs_1 = listTocDTs; _i < listTocDTs_1.length; _i++) {
                    var entry = listTocDTs_1[_i];
                    var treeObj = entry.data;
                    var dtLink = {};
                    dtLink.id = treeObj.key.id;
                    dtLink.label = treeObj.label;
                    dtLink.domainInfo = treeObj.domainInfo;
                    var index = treeObj.label.indexOf("_");
                    if (index > -1) {
                        dtLink.name = treeObj.label.substring(0, index);
                        dtLink.ext = treeObj.label.substring(index);
                        ;
                    }
                    else {
                        dtLink.name = treeObj.label;
                        dtLink.ext = null;
                    }
                    if (treeObj.lazyLoading)
                        dtLink.leaf = false;
                    else
                        dtLink.leaf = true;
                    _this.datatypesLinks.push(dtLink);
                    var dtOption = { label: dtLink.label, value: dtLink.id };
                    _this.datatypeOptions.push(dtOption);
                }
                _this.tocService.getNodesList(__WEBPACK_IMPORTED_MODULE_14__common_constants_types__["a" /* Types */].VALUESETREGISTRY).then(function (valuesetTOCdata) {
                    var listTocVSs = valuesetTOCdata;
                    for (var _i = 0, listTocVSs_1 = listTocVSs; _i < listTocVSs_1.length; _i++) {
                        var entry = listTocVSs_1[_i];
                        var treeObj = entry.data;
                        var valuesetLink = {};
                        valuesetLink.id = treeObj.key.id;
                        valuesetLink.label = treeObj.label;
                        valuesetLink.domainInfo = treeObj.domainInfo;
                        _this.valuesetsLinks.push(valuesetLink);
                        var vsOption = { label: valuesetLink.label, value: valuesetLink.id };
                        _this.valuesetOptions.push(vsOption);
                    }
                    _this.segmentStructure = {};
                    _this.segmentStructure.name = x.name;
                    _this.segmentStructure.ext = x.ext;
                    _this.segmentStructure.scope = x.scope;
                    _this.updateDatatype(_this.segmentStructure, x.children, x.binding, null, null, null, null, null, null);
                    _this.backup = __WEBPACK_IMPORTED_MODULE_12_lodash__["cloneDeep"](_this.segmentStructure);
                });
            });
        });
    };
    SegmentEditStructureComponent.prototype.reset = function () {
        this.segmentStructure = __WEBPACK_IMPORTED_MODULE_12_lodash__["cloneDeep"](this.backup);
    };
    SegmentEditStructureComponent.prototype.getCurrent = function () {
        return this.segmentStructure;
    };
    SegmentEditStructureComponent.prototype.getBackup = function () {
        return this.backup;
    };
    SegmentEditStructureComponent.prototype.isValid = function () {
        // return !this.editForm.invalid;
        return true;
    };
    SegmentEditStructureComponent.prototype.save = function () {
        return this.segmentsService.saveSegmentStructure(this.segmentId, this.segmentStructure);
    };
    SegmentEditStructureComponent.prototype.updateDatatype = function (node, children, currentBinding, parentFieldId, fieldDT, segmentBinding, fieldDTbinding, parentDTId, parentDTName) {
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var entry = children_1[_i];
            if (!entry.data.displayData)
                entry.data.displayData = {};
            entry.data.displayData.datatype = this.getDatatypeLink(entry.data.ref.id);
            entry.data.displayData.valuesetAllowed = this.configService.isValueSetAllow(entry.data.displayData.datatype.name, entry.data.position, parentDTName, this.segmentStructure.name, entry.data.displayData.type);
            entry.data.displayData.valueSetLocationOptions = this.configService.getValuesetLocations(entry.data.displayData.datatype.name, entry.data.displayData.datatype.domainInfo.version);
            if (entry.data.displayData.valuesetAllowed)
                entry.data.displayData.multipleValuesetAllowed = this.configService.isMultipleValuseSetAllowed(entry.data.displayData.datatype.name);
            if (entry.data.displayData.datatype.leaf)
                entry.leaf = true;
            else
                entry.leaf = false;
            if (parentFieldId === null) {
                entry.data.displayData.idPath = entry.data.id;
            }
            else {
                entry.data.displayData.idPath = parentFieldId + '-' + entry.data.id;
            }
            if (entry.data.displayData.idPath.split("-").length === 1) {
                entry.data.displayData.type = 'FIELD';
                entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath, currentBinding);
                if (entry.data.usage === 'C' && !entry.data.displayData.segmentBinding) {
                    entry.data.displayData.segmentBinding = {};
                }
                if (entry.data.usage === 'C' && !entry.data.displayData.segmentBinding.predicate) {
                    entry.data.displayData.segmentBinding.predicate = {};
                }
            }
            else if (entry.data.displayData.idPath.split("-").length === 2) {
                entry.data.displayData.type = 'COMPONENT';
                entry.data.displayData.fieldDT = parentDTId;
                entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], segmentBinding);
                entry.data.displayData.fieldDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], currentBinding);
            }
            else if (entry.data.displayData.idPath.split("-").length === 3) {
                entry.data.displayData.type = "SUBCOMPONENT";
                entry.data.displayData.fieldDT = fieldDT;
                entry.data.displayData.componentDT = parentDTId;
                entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], segmentBinding);
                entry.data.displayData.fieldDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], fieldDTbinding);
                entry.data.displayData.componentDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], currentBinding);
            }
            this.setHasSingleCode(entry.data.displayData);
            this.setHasValueSet(entry.data.displayData);
        }
        node.children = children;
    };
    SegmentEditStructureComponent.prototype.setHasSingleCode = function (displayData) {
        if (displayData.segmentBinding || displayData.fieldDTbinding || displayData.componentDTbinding) {
            if (displayData.segmentBinding && displayData.segmentBinding.internalSingleCode && displayData.segmentBinding.internalSingleCode !== '') {
                displayData.hasSingleCode = true;
            }
            else if (displayData.segmentBinding && displayData.segmentBinding.externalSingleCode && displayData.segmentBinding.externalSingleCode !== '') {
                displayData.hasSingleCode = true;
            }
            else if (displayData.fieldDTbinding && displayData.fieldDTbinding.internalSingleCode && displayData.fieldDTbinding.internalSingleCode !== '') {
                displayData.hasSingleCode = true;
            }
            else if (displayData.fieldDTbinding && displayData.fieldDTbinding.externalSingleCode && displayData.fieldDTbinding.externalSingleCode !== '') {
                displayData.hasSingleCode = true;
            }
            else if (displayData.componentDTbinding && displayData.componentDTbinding.internalSingleCode && displayData.componentDTbinding.internalSingleCode !== '') {
                displayData.hasSingleCode = true;
            }
            else if (displayData.componentDTbinding && displayData.componentDTbinding.externalSingleCode && displayData.componentDTbinding.externalSingleCode !== '') {
                displayData.hasSingleCode = true;
            }
            else {
                displayData.hasSingleCode = false;
            }
        }
        else {
            displayData.hasSingleCode = false;
        }
    };
    SegmentEditStructureComponent.prototype.setHasValueSet = function (displayData) {
        if (displayData.segmentBinding || displayData.fieldDTbinding || displayData.componentDTbinding) {
            if (displayData.segmentBinding && displayData.segmentBinding.valuesetBindings && displayData.segmentBinding.valuesetBindings.length > 0) {
                displayData.hasValueSet = true;
            }
            else if (displayData.fieldDTbinding && displayData.fieldDTbinding.valuesetBindings && displayData.fieldDTbinding.valuesetBindings.length > 0) {
                displayData.hasValueSet = true;
            }
            else if (displayData.componentDTbinding && displayData.componentDTbinding.valuesetBindings && displayData.componentDTbinding.valuesetBindings.length > 0) {
                displayData.hasValueSet = true;
            }
            else {
                displayData.hasValueSet = false;
            }
        }
        else {
            displayData.hasValueSet = false;
        }
    };
    SegmentEditStructureComponent.prototype.getValueSetElm = function (id) {
        for (var _i = 0, _a = this.valuesetsLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            if (link.id === id)
                return link;
        }
        return null;
    };
    SegmentEditStructureComponent.prototype.getDatatypeElm = function (id) {
        for (var _i = 0, _a = this.datatypesLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            if (link.id === id)
                return link;
        }
        return null;
    };
    SegmentEditStructureComponent.prototype.addNewValueSet = function (node) {
        if (!node.data.displayData.segmentBinding)
            node.data.displayData.segmentBinding = [];
        if (!node.data.displayData.segmentBinding.valuesetBindings)
            node.data.displayData.segmentBinding.valuesetBindings = [];
        node.data.displayData.segmentBinding.valuesetBindings.push({ edit: true, newvalue: {} });
        this.valuesetColumnWidth = '500px';
    };
    SegmentEditStructureComponent.prototype.updateValueSetBindings = function (binding) {
        var result = JSON.parse(JSON.stringify(binding));
        if (result && result.valuesetBindings) {
            for (var _i = 0, _a = result.valuesetBindings; _i < _a.length; _i++) {
                var vs = _a[_i];
                var displayValueSetLink = this.getValueSetLink(vs.valuesetId);
                // vs.bindingIdentifier = displayValueSetLink.displayValueSetLink;
                vs.label = displayValueSetLink.label;
                vs.domainInfo = displayValueSetLink.domainInfo;
            }
        }
        return result;
    };
    SegmentEditStructureComponent.prototype.findBinding = function (id, binding) {
        if (binding && binding.children) {
            for (var _i = 0, _a = binding.children; _i < _a.length; _i++) {
                var b = _a[_i];
                if (b.elementId === id)
                    return this.updateValueSetBindings(b);
            }
        }
        return null;
    };
    SegmentEditStructureComponent.prototype.delLength = function (node) {
        node.data.minLength = 'NA';
        node.data.maxLength = 'NA';
        node.data.confLength = '';
    };
    SegmentEditStructureComponent.prototype.delConfLength = function (node) {
        node.data.minLength = '';
        node.data.maxLength = '';
        node.data.confLength = 'NA';
    };
    SegmentEditStructureComponent.prototype.makeEditModeForDatatype = function (node) {
        node.data.displayData.datatype.edit = true;
        node.data.displayData.datatype.dtOptions = [];
        for (var _i = 0, _a = this.datatypesLinks; _i < _a.length; _i++) {
            var dt = _a[_i];
            if (dt.name === node.data.displayData.datatype.name) {
                var dtOption = { label: dt.label, value: dt.id };
                node.data.displayData.datatype.dtOptions.push(dtOption);
            }
        }
        node.data.displayData.datatype.dtOptions.push({ label: 'Change Datatype root', value: null });
    };
    SegmentEditStructureComponent.prototype.loadNode = function (event) {
        var _this = this;
        if (event.node && !event.node.children) {
            var datatypeId = event.node.data.ref.id;
            this.datatypesService.getDatatypeStructure(datatypeId).then(function (structure) {
                _this.updateDatatype(event.node, structure.children, structure.binding, event.node.data.displayData.idPath, datatypeId, event.node.data.displayData.segmentBinding, event.node.data.displayData.fieldDTBinding, event.node.data.displayData.fieldDT, event.node.data.displayData.datatype.name);
            });
        }
    };
    SegmentEditStructureComponent.prototype.onDatatypeChange = function (node) {
        if (!node.data.displayData.datatype.id) {
            node.data.displayData.datatype.id = node.data.ref.id;
        }
        else
            node.data.ref.id = node.data.displayData.datatype.id;
        node.data.displayData.datatype = this.getDatatypeLink(node.data.displayData.datatype.id);
        node.children = null;
        node.expanded = false;
        if (node.data.displayData.datatype.leaf)
            node.leaf = true;
        else
            node.leaf = false;
        node.data.displayData.datatype.edit = false;
        node.data.displayData.valuesetAllowed = this.configService.isValueSetAllow(node.data.displayData.datatype.name, node.data.position, null, null, node.data.displayData.type);
        node.data.displayData.valueSetLocationOptions = this.configService.getValuesetLocations(node.data.displayData.datatype.name, node.data.displayData.datatype.domainInfo.version);
    };
    SegmentEditStructureComponent.prototype.makeEditModeForValueSet = function (vs) {
        vs.newvalue = {};
        vs.newvalue.valuesetId = vs.valuesetId;
        vs.newvalue.strength = vs.strength;
        vs.newvalue.valuesetLocations = vs.valuesetLocations;
        vs.edit = true;
        this.valuesetColumnWidth = '500px';
    };
    SegmentEditStructureComponent.prototype.makeEditModeForComment = function (c) {
        c.newComment = {};
        c.newComment.description = c.description;
        c.edit = true;
    };
    SegmentEditStructureComponent.prototype.addNewComment = function (node) {
        if (!node.data.displayData.segmentBinding)
            node.data.displayData.segmentBinding = [];
        if (!node.data.displayData.segmentBinding.comments)
            node.data.displayData.segmentBinding.comments = [];
        node.data.displayData.segmentBinding.comments.push({ edit: true, newComment: { description: '' } });
    };
    SegmentEditStructureComponent.prototype.addNewSingleCode = function (node) {
        if (!node.data.displayData.segmentBinding)
            node.data.displayData.segmentBinding = {};
        if (!node.data.displayData.segmentBinding.externalSingleCode)
            node.data.displayData.segmentBinding.externalSingleCode = {};
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCode = '';
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem = '';
        node.data.displayData.segmentBinding.externalSingleCode.edit = true;
    };
    SegmentEditStructureComponent.prototype.submitNewSingleCode = function (node) {
        node.data.displayData.segmentBinding.externalSingleCode.value = node.data.displayData.segmentBinding.externalSingleCode.newSingleCode;
        node.data.displayData.segmentBinding.externalSingleCode.codeSystem = node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem;
        node.data.displayData.segmentBinding.externalSingleCode.edit = false;
    };
    SegmentEditStructureComponent.prototype.makeEditModeForSingleCode = function (node) {
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCode = node.data.displayData.segmentBinding.externalSingleCode.value;
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem = node.data.displayData.segmentBinding.externalSingleCode.codeSystem;
        node.data.displayData.segmentBinding.externalSingleCode.edit = true;
    };
    SegmentEditStructureComponent.prototype.deleteSingleCode = function (node) {
        node.data.displayData.segmentBinding.externalSingleCode = null;
        node.data.displayData.hasSingleCode = false;
    };
    SegmentEditStructureComponent.prototype.addNewConstantValue = function (node) {
        if (!node.data.displayData.segmentBinding)
            node.data.displayData.segmentBinding = {};
        node.data.displayData.segmentBinding.constantValue = null;
        node.data.displayData.segmentBinding.newConstantValue = '';
        node.data.displayData.segmentBinding.editConstantValue = true;
        console.log(node);
    };
    SegmentEditStructureComponent.prototype.deleteConstantValue = function (node) {
        node.data.displayData.segmentBinding.constantValue = null;
        node.data.displayData.segmentBinding.editConstantValue = false;
    };
    SegmentEditStructureComponent.prototype.makeEditModeForConstantValue = function (node) {
        node.data.displayData.segmentBinding.newConstantValue = node.data.displayData.segmentBinding.constantValue;
        node.data.displayData.segmentBinding.editConstantValue = true;
    };
    SegmentEditStructureComponent.prototype.submitNewConstantValue = function (node) {
        node.data.displayData.segmentBinding.constantValue = node.data.displayData.segmentBinding.newConstantValue;
        node.data.displayData.segmentBinding.editConstantValue = false;
    };
    SegmentEditStructureComponent.prototype.submitNewValueSet = function (vs) {
        var displayValueSetLink = this.getValueSetLink(vs.newvalue.valuesetId);
        vs.bindingIdentifier = displayValueSetLink.displayValueSetLink;
        vs.label = displayValueSetLink.label;
        vs.domainInfo = displayValueSetLink.domainInfo;
        vs.valuesetId = vs.newvalue.valuesetId;
        vs.strength = vs.newvalue.strength;
        vs.valuesetLocations = vs.newvalue.valuesetLocations;
        vs.edit = false;
        this.valuesetColumnWidth = '200px';
    };
    SegmentEditStructureComponent.prototype.submitNewComment = function (c) {
        c.description = c.newComment.description;
        c.dateupdated = new Date();
        c.edit = false;
    };
    SegmentEditStructureComponent.prototype.delValueSetBinding = function (binding, vs, node) {
        binding.valuesetBindings = __WEBPACK_IMPORTED_MODULE_8_underscore__["_"].without(binding.valuesetBindings, __WEBPACK_IMPORTED_MODULE_8_underscore__["_"].findWhere(binding.valuesetBindings, { valuesetId: vs.valuesetId }));
        this.setHasValueSet(node);
    };
    SegmentEditStructureComponent.prototype.delCommentBinding = function (binding, c) {
        binding.comments = __WEBPACK_IMPORTED_MODULE_8_underscore__["_"].without(binding.comments, __WEBPACK_IMPORTED_MODULE_8_underscore__["_"].findWhere(binding.comments, c));
    };
    SegmentEditStructureComponent.prototype.delTextDefinition = function (node) {
        node.data.text = null;
    };
    SegmentEditStructureComponent.prototype.getDatatypeLink = function (id) {
        for (var _i = 0, _a = this.datatypesLinks; _i < _a.length; _i++) {
            var dt = _a[_i];
            if (dt.id === id)
                return JSON.parse(JSON.stringify(dt));
        }
        console.log("Missing DT:::" + id);
        return null;
    };
    SegmentEditStructureComponent.prototype.getValueSetLink = function (id) {
        for (var _i = 0, _a = this.valuesetsLinks; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v.id === id)
                return JSON.parse(JSON.stringify(v));
        }
        console.log("Missing ValueSet:::" + id);
        return null;
    };
    SegmentEditStructureComponent.prototype.editTextDefinition = function (node) {
        this.selectedNode = node;
        this.textDefinitionDialogOpen = true;
    };
    SegmentEditStructureComponent.prototype.truncate = function (txt) {
        if (txt.length < 10)
            return txt;
        else
            return txt.substring(0, 10) + "...";
    };
    SegmentEditStructureComponent.prototype.print = function (data) {
        console.log(data);
    };
    SegmentEditStructureComponent.prototype.editPredicate = function (node) {
        var _this = this;
        this.selectedNode = node;
        if (this.selectedNode.data.displayData.segmentBinding)
            this.selectedPredicate = JSON.parse(JSON.stringify(this.selectedNode.data.displayData.segmentBinding.predicate));
        if (!this.selectedPredicate)
            this.selectedPredicate = {};
        this.idMap = {};
        this.treeData = [];
        this.segmentsService.getSegmentStructure(this.segmentId).then(function (segStructure) {
            _this.idMap[_this.segmentId] = { name: segStructure.name };
            var rootData = { elementId: _this.segmentId };
            for (var _i = 0, _a = segStructure.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var childData = JSON.parse(JSON.stringify(rootData));
                childData.child = {
                    elementId: child.data.id,
                };
                if (child.data.max === '1') {
                    childData.child.instanceParameter = '1';
                }
                else {
                    childData.child.instanceParameter = '*';
                }
                var treeNode = {
                    label: child.data.name,
                    data: childData,
                    expandedIcon: "fa-folder-open",
                    collapsedIcon: "fa-folder",
                };
                var data = {
                    id: child.data.id,
                    name: child.data.name,
                    max: child.data.max,
                    position: child.data.position,
                    usage: child.data.usage,
                    dtId: child.data.ref.id
                };
                _this.idMap[_this.segmentId + '-' + data.id] = data;
                _this.popChild(_this.segmentId + '-' + data.id, data.dtId, treeNode);
                _this.treeData.push(treeNode);
            }
        });
        this.preciateEditorOpen = true;
    };
    SegmentEditStructureComponent.prototype.submitCP = function () {
        if (this.selectedPredicate.type === 'ASSERTION') {
            this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedPredicate.assertion, this.idMap);
            this.selectedPredicate.assertion.description = 'If ' + this.selectedPredicate.assertion.description;
            this.selectedPredicate.freeText = undefined;
        }
        if (!this.selectedNode.data.displayData.segmentBinding)
            this.selectedNode.data.displayData.segmentBinding = {};
        this.selectedNode.data.displayData.segmentBinding.predicate = this.selectedPredicate;
        this.preciateEditorOpen = false;
        this.selectedPredicate = {};
        this.selectedNode = null;
    };
    SegmentEditStructureComponent.prototype.changeType = function () {
        if (this.selectedPredicate.type == 'ASSERTION') {
            this.selectedPredicate.assertion = {};
            this.selectedPredicate.assertion = { mode: "SIMPLE" };
        }
        else if (this.selectedPredicate.type == 'FREE') {
            this.selectedPredicate.assertion = undefined;
        }
        else if (this.selectedPredicate.type == 'PREDEFINEDPATTERNS') {
            this.selectedPredicate.assertion = undefined;
        }
        else if (this.selectedPredicate.type == 'PREDEFINED') {
            this.selectedPredicate.assertion = undefined;
        }
    };
    SegmentEditStructureComponent.prototype.changeAssertionMode = function () {
        if (this.selectedPredicate.assertion.mode == 'SIMPLE') {
            this.selectedPredicate.assertion = { mode: "SIMPLE" };
        }
        else if (this.selectedPredicate.assertion.mode == 'COMPLEX') {
            this.selectedPredicate.assertion = { mode: "COMPLEX" };
        }
    };
    SegmentEditStructureComponent.prototype.popChild = function (id, dtId, parentTreeNode) {
        var _this = this;
        this.datatypesService.getDatatypeStructure(dtId).then(function (dtStructure) {
            _this.idMap[id].dtName = dtStructure.name;
            if (dtStructure.children) {
                for (var _i = 0, _a = dtStructure.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var childData = JSON.parse(JSON.stringify(parentTreeNode.data));
                    _this.makeChild(childData, child.data.id, '1');
                    var treeNode = {
                        label: child.data.name,
                        data: childData,
                        expandedIcon: "fa-folder-open",
                        collapsedIcon: "fa-folder",
                    };
                    var data = {
                        id: child.data.id,
                        name: child.data.name,
                        max: "1",
                        position: child.data.position,
                        usage: child.data.usage,
                        dtId: child.data.ref.id
                    };
                    _this.idMap[id + '-' + data.id] = data;
                    _this.popChild(id + '-' + data.id, data.dtId, treeNode);
                    if (!parentTreeNode.children)
                        parentTreeNode.children = [];
                    parentTreeNode.children.push(treeNode);
                }
            }
        });
    };
    SegmentEditStructureComponent.prototype.makeChild = function (data, id, para) {
        if (data.child)
            this.makeChild(data.child, id, para);
        else
            data.child = {
                elementId: id,
                instanceParameter: para
            };
    };
    SegmentEditStructureComponent.prototype.onUsageChange = function (node) {
        if (node.data.usage === 'C') {
            if (!node.data.displayData.segmentBinding) {
                node.data.displayData.segmentBinding = {};
            }
            if (!node.data.displayData.segmentBinding.predicate) {
                node.data.displayData.segmentBinding.predicate = {};
            }
        }
        else if (node.data.usage !== 'C') {
            if (node.data.displayData.segmentBinding && node.data.displayData.segmentBinding.predicate) {
                node.data.displayData.segmentBinding.predicate = undefined;
            }
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('editForm'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_11__angular_forms__["NgForm"])
    ], SegmentEditStructureComponent.prototype, "editForm", void 0);
    SegmentEditStructureComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'segment-edit',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-structure/segment-edit-structure.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-structure/segment-edit-structure.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */], __WEBPACK_IMPORTED_MODULE_4__service_segments_segments_service__["a" /* SegmentsService */], __WEBPACK_IMPORTED_MODULE_5__service_datatypes_datatypes_service__["a" /* DatatypesService */],
            __WEBPACK_IMPORTED_MODULE_7__service_constraints_constraints_service__["a" /* ConstraintsService */],
            __WEBPACK_IMPORTED_MODULE_9__service_indexed_db_datatypes_datatypes_toc_service__["a" /* DatatypesTocService */],
            __WEBPACK_IMPORTED_MODULE_10__service_indexed_db_valuesets_valuesets_toc_service__["a" /* ValuesetsTocService */], __WEBPACK_IMPORTED_MODULE_13__service_toc_service__["a" /* TocService */]])
    ], SegmentEditStructureComponent);
    return SegmentEditStructureComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-structure/segment-edit-structure.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentEditStructureResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/**
 * Created by ena3 on 5/18/18.
 */
/**
 * Created by ena3 on 4/16/18.
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



var SegmentEditStructureResolver = (function () {
    function SegmentEditStructureResolver(http, segmentService) {
        this.http = http;
        this.segmentService = segmentService;
    }
    SegmentEditStructureResolver.prototype.resolve = function (route, rstate) {
        var segmentId = route.params["segmentId"];
        return this.segmentService.getSegmentStructure(segmentId);
    };
    SegmentEditStructureResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__service_segments_segments_service__["a" /* SegmentsService */]])
    ], SegmentEditStructureResolver);
    return SegmentEditStructureResolver;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/service/toc.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TocService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_constants_types__ = __webpack_require__("../../../../../src/app/common/constants/types.ts");
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
/**
 * Created by ena3 on 10/26/17.
 */





var TocService = (function () {
    function TocService(dbService) {
        this.dbService = dbService;
        this.activeNode = new __WEBPACK_IMPORTED_MODULE_1_rxjs__["BehaviorSubject"](null);
    }
    TocService.prototype.setActiveNode = function (node) {
        this.activeNode.next(node);
    };
    TocService.prototype.getActiveNode = function () {
        return this.activeNode;
    };
    TocService.prototype.findDirectChildByType = function (nodes, type) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].data.type == type) {
                return nodes[i];
            }
        }
        return null;
    };
    TocService.prototype.addNodesByType = function (toAdd, toc, type) {
        var profile = this.findDirectChildByType(toc, __WEBPACK_IMPORTED_MODULE_3__common_constants_types__["a" /* Types */].PROFILE);
        var registry = this.findDirectChildByType(profile.children, type);
        var position = registry.children.length + 1;
        for (var i = 0; i < toAdd.length; i++) {
            toAdd[i].data.position = position;
            position++;
            registry.children.push(toAdd[i]);
        }
    };
    TocService.prototype.getNameUnicityIndicators = function (nodes, type) {
        if (type == __WEBPACK_IMPORTED_MODULE_3__common_constants_types__["a" /* Types */].SEGMENTREGISTRY) {
            return this.getNameUnicityIndicatorsForSegment(nodes, type);
        }
        else if (type == __WEBPACK_IMPORTED_MODULE_3__common_constants_types__["a" /* Types */].DATATYPEREGISTRY) {
            return this.getNameUnicityIndicatorsForDatatype(nodes, type);
        }
    };
    TocService.prototype.getNameUnicityIndicatorsForSegment = function (nodes, type) {
        var profile = this.findDirectChildByType(nodes, __WEBPACK_IMPORTED_MODULE_3__common_constants_types__["a" /* Types */].PROFILE);
        var registry = this.findDirectChildByType(profile.children, type);
        return __WEBPACK_IMPORTED_MODULE_2_lodash__["map"](registry.children, function (obj) {
            return obj.data.label + obj.data.ext;
        });
    };
    TocService.prototype.getRegistryByType = function (nodes, type) {
        var profile = this.findDirectChildByType(nodes, __WEBPACK_IMPORTED_MODULE_3__common_constants_types__["a" /* Types */].PROFILE);
        if (profile != null) {
            return this.findDirectChildByType(profile.children, type);
        }
    };
    TocService.prototype.getNameUnicityIndicatorsForDatatype = function (nodes, type) {
        var profile = this.findDirectChildByType(nodes, __WEBPACK_IMPORTED_MODULE_3__common_constants_types__["a" /* Types */].PROFILE);
        var registry = this.findDirectChildByType(profile.children, type);
        return __WEBPACK_IMPORTED_MODULE_2_lodash__["map"](registry.children, function (obj) {
            return obj.data.label + obj.data.ext;
        });
    };
    TocService.prototype.getNodesList = function (type) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.dbService.getIgDocument().then(function (x) {
                if (x.toc) {
                    resolve(_this.findRegistryByType(x.toc, type));
                }
                else {
                    console.log("Could not find the toc ");
                }
            }, function (error) {
                console.log("Could not find the toc ");
            });
        });
    };
    ;
    TocService.prototype.getCurrentSegmentList = function (id) {
    };
    TocService.prototype.getCurrentConformanceProfileList = function (id) {
    };
    TocService.prototype.getCurrentValueSetList = function (id) {
    };
    TocService.prototype.findRegistryByType = function (toc, type) {
        var profile = __WEBPACK_IMPORTED_MODULE_2_lodash__["find"](toc, function (node) { return __WEBPACK_IMPORTED_MODULE_3__common_constants_types__["a" /* Types */].PROFILE == node.data.type; });
        if (profile && profile.children) {
            var registry = __WEBPACK_IMPORTED_MODULE_2_lodash__["find"](profile.children, function (node) { return type == node.data.type; });
            if (registry != null) {
                return registry.children;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };
    TocService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */]])
    ], TocService);
    return TocService;
}());



/***/ }),

/***/ "../../../../../src/app/utils/utils.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UtilsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_badge_display_badge_component__ = __webpack_require__("../../../../../src/app/common/badge/display-badge.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_constraint_edit_freeconstraint_component__ = __webpack_require__("../../../../../src/app/common/constraint/edit-freeconstraint.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_constraint_edit_simpleconstraint_component__ = __webpack_require__("../../../../../src/app/common/constraint/edit-simpleconstraint.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_constraint_edit_complexconstraint_component__ = __webpack_require__("../../../../../src/app/common/constraint/edit-complexconstraint.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_constraint_edit_andorconstraint_component__ = __webpack_require__("../../../../../src/app/common/constraint/edit-andorconstraint.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__common_constraint_edit_notconstraint_component__ = __webpack_require__("../../../../../src/app/common/constraint/edit-notconstraint.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__common_constraint_edit_ifthenconstraint_component__ = __webpack_require__("../../../../../src/app/common/constraint/edit-ifthenconstraint.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__igdocuments_igdocument_edit_segment_edit_segment_definition_coconstraint_table_datatype_name_pipe__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/datatype-name.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__common_entity_header_entity_header_component__ = __webpack_require__("../../../../../src/app/common/entity-header/entity-header.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__common_label_display_label_component__ = __webpack_require__("../../../../../src/app/common/label/display-label.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__common_tree_table_label_display_ref_component__ = __webpack_require__("../../../../../src/app/common/tree-table-label/display-ref.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__common_tree_table_label_display_singlecode_component__ = __webpack_require__("../../../../../src/app/common/tree-table-label/display-singlecode.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__common_tree_table_label_display_constantvalue_component__ = __webpack_require__("../../../../../src/app/common/tree-table-label/display-constantvalue.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__common_tree_table_label_display_comment_component__ = __webpack_require__("../../../../../src/app/common/tree-table-label/display-comment.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__common_constraint_display_path_component__ = __webpack_require__("../../../../../src/app/common/constraint/display-path.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_primeng_dropdown__ = __webpack_require__("../../../../primeng/dropdown.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_primeng_dropdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20_primeng_dropdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_primeng_checkbox__ = __webpack_require__("../../../../primeng/checkbox.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_primeng_checkbox___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21_primeng_checkbox__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_primeng_tree__ = __webpack_require__("../../../../primeng/tree.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_primeng_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22_primeng_tree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23_primeng_dialog__ = __webpack_require__("../../../../primeng/dialog.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23_primeng_dialog___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_23_primeng_dialog__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24_primeng_panel__ = __webpack_require__("../../../../primeng/panel.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24_primeng_panel___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_24_primeng_panel__);
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
                __WEBPACK_IMPORTED_MODULE_10__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_13__angular_router__["RouterModule"],
                __WEBPACK_IMPORTED_MODULE_14_primeng_primeng__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_20_primeng_dropdown__["DropdownModule"],
                __WEBPACK_IMPORTED_MODULE_21_primeng_checkbox__["CheckboxModule"],
                __WEBPACK_IMPORTED_MODULE_22_primeng_tree__["TreeModule"],
                __WEBPACK_IMPORTED_MODULE_23_primeng_dialog__["DialogModule"],
                __WEBPACK_IMPORTED_MODULE_24_primeng_panel__["PanelModule"]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__common_badge_display_badge_component__["a" /* DisplayBadgeComponent */],
                __WEBPACK_IMPORTED_MODULE_11__common_entity_header_entity_header_component__["a" /* EntityHeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_9__igdocuments_igdocument_edit_segment_edit_segment_definition_coconstraint_table_datatype_name_pipe__["a" /* DtFlavorPipe */],
                __WEBPACK_IMPORTED_MODULE_12__common_label_display_label_component__["a" /* DisplayLabelComponent */],
                __WEBPACK_IMPORTED_MODULE_15__common_tree_table_label_display_ref_component__["a" /* DisplayRefComponent */],
                __WEBPACK_IMPORTED_MODULE_16__common_tree_table_label_display_singlecode_component__["a" /* DisplaySingleCodeComponent */],
                __WEBPACK_IMPORTED_MODULE_17__common_tree_table_label_display_constantvalue_component__["a" /* DisplayConstantValueComponent */],
                __WEBPACK_IMPORTED_MODULE_18__common_tree_table_label_display_comment_component__["a" /* DisplayCommentComponent */],
                __WEBPACK_IMPORTED_MODULE_3__common_constraint_edit_freeconstraint_component__["a" /* EditFreeConstraintComponent */],
                __WEBPACK_IMPORTED_MODULE_4__common_constraint_edit_simpleconstraint_component__["a" /* EditSimpleConstraintComponent */],
                __WEBPACK_IMPORTED_MODULE_5__common_constraint_edit_complexconstraint_component__["a" /* EditComplexConstraintComponent */],
                __WEBPACK_IMPORTED_MODULE_19__common_constraint_display_path_component__["a" /* DisplayPathComponent */],
                __WEBPACK_IMPORTED_MODULE_6__common_constraint_edit_andorconstraint_component__["a" /* EditAndOrConstraintComponent */],
                __WEBPACK_IMPORTED_MODULE_7__common_constraint_edit_notconstraint_component__["a" /* EditNotConstraintComponent */],
                __WEBPACK_IMPORTED_MODULE_8__common_constraint_edit_ifthenconstraint_component__["a" /* EditIfThenConstraintComponent */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_2__common_badge_display_badge_component__["a" /* DisplayBadgeComponent */],
                __WEBPACK_IMPORTED_MODULE_11__common_entity_header_entity_header_component__["a" /* EntityHeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_9__igdocuments_igdocument_edit_segment_edit_segment_definition_coconstraint_table_datatype_name_pipe__["a" /* DtFlavorPipe */],
                __WEBPACK_IMPORTED_MODULE_12__common_label_display_label_component__["a" /* DisplayLabelComponent */],
                __WEBPACK_IMPORTED_MODULE_15__common_tree_table_label_display_ref_component__["a" /* DisplayRefComponent */],
                __WEBPACK_IMPORTED_MODULE_16__common_tree_table_label_display_singlecode_component__["a" /* DisplaySingleCodeComponent */],
                __WEBPACK_IMPORTED_MODULE_17__common_tree_table_label_display_constantvalue_component__["a" /* DisplayConstantValueComponent */],
                __WEBPACK_IMPORTED_MODULE_18__common_tree_table_label_display_comment_component__["a" /* DisplayCommentComponent */],
                __WEBPACK_IMPORTED_MODULE_3__common_constraint_edit_freeconstraint_component__["a" /* EditFreeConstraintComponent */],
                __WEBPACK_IMPORTED_MODULE_4__common_constraint_edit_simpleconstraint_component__["a" /* EditSimpleConstraintComponent */],
                __WEBPACK_IMPORTED_MODULE_5__common_constraint_edit_complexconstraint_component__["a" /* EditComplexConstraintComponent */],
                __WEBPACK_IMPORTED_MODULE_19__common_constraint_display_path_component__["a" /* DisplayPathComponent */],
                __WEBPACK_IMPORTED_MODULE_6__common_constraint_edit_andorconstraint_component__["a" /* EditAndOrConstraintComponent */],
                __WEBPACK_IMPORTED_MODULE_7__common_constraint_edit_notconstraint_component__["a" /* EditNotConstraintComponent */],
                __WEBPACK_IMPORTED_MODULE_8__common_constraint_edit_ifthenconstraint_component__["a" /* EditIfThenConstraintComponent */]
            ]
        })
    ], UtilsModule);
    return UtilsModule;
}());



/***/ }),

/***/ "../../../../angular-froala-wysiwyg/editor/editor.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FroalaEditorDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");


var FroalaEditorDirective = (function () {
    function FroalaEditorDirective(el, zone) {
        this.zone = zone;
        // editor options
        this._opts = {
            immediateAngularModelUpdate: false,
            angularIgnoreAttrs: null
        };
        this.SPECIAL_TAGS = ['img', 'button', 'input', 'a'];
        this.INNER_HTML_ATTR = 'innerHTML';
        this._hasSpecialTag = false;
        this._listeningEvents = [];
        this._editorInitialized = false;
        this._oldModel = null;
        // Begin ControlValueAccesor methods.
        this.onChange = function (_) { };
        this.onTouched = function () { };
        // froalaModel directive as output: update model if editor contentChanged
        this.froalaModelChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        // froalaInit directive as output: send manual editor initialization
        this.froalaInit = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        var element = el.nativeElement;
        // check if the element is a special tag
        if (this.SPECIAL_TAGS.indexOf(element.tagName.toLowerCase()) != -1) {
            this._hasSpecialTag = true;
        }
        // jquery wrap and store element
        this._$element = $(element);
        this.zone = zone;
    }
    // Form model content changed.
    // Form model content changed.
    FroalaEditorDirective.prototype.writeValue = 
    // Form model content changed.
    function (content) {
        this.updateEditor(content);
    };
    FroalaEditorDirective.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    FroalaEditorDirective.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    Object.defineProperty(FroalaEditorDirective.prototype, "froalaEditor", {
        set: 
        // End ControlValueAccesor methods.
        // froalaEditor directive as input: store the editor options
        function (opts) {
            this._opts = opts || this._opts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FroalaEditorDirective.prototype, "froalaModel", {
        set: 
        // froalaModel directive as input: store initial editor content
        function (content) {
            this.updateEditor(content);
        },
        enumerable: true,
        configurable: true
    });
    // Update editor with model contents.
    // Update editor with model contents.
    FroalaEditorDirective.prototype.updateEditor = 
    // Update editor with model contents.
    function (content) {
        if (JSON.stringify(this._oldModel) == JSON.stringify(content)) {
            return;
        }
        this._oldModel = content;
        if (this._editorInitialized) {
            this._$element.froalaEditor('html.set', content);
        }
        else {
            this._$element.html(content);
        }
    };
    // update model if editor contentChanged
    // update model if editor contentChanged
    FroalaEditorDirective.prototype.updateModel = 
    // update model if editor contentChanged
    function () {
        var _this = this;
        this.zone.run(function () {
            var modelContent = null;
            if (_this._hasSpecialTag) {
                var attributeNodes = _this._$element[0].attributes;
                var attrs = {};
                for (var i = 0; i < attributeNodes.length; i++) {
                    var attrName = attributeNodes[i].name;
                    if (_this._opts.angularIgnoreAttrs && _this._opts.angularIgnoreAttrs.indexOf(attrName) != -1) {
                        continue;
                    }
                    attrs[attrName] = attributeNodes[i].value;
                }
                if (_this._$element[0].innerHTML) {
                    attrs[_this.INNER_HTML_ATTR] = _this._$element[0].innerHTML;
                }
                modelContent = attrs;
            }
            else {
                var returnedHtml = _this._$element.froalaEditor('html.get');
                if (typeof returnedHtml === 'string') {
                    modelContent = returnedHtml;
                }
            }
            _this._oldModel = modelContent;
            // Update froalaModel.
            // Update froalaModel.
            _this.froalaModelChange.emit(modelContent);
            // Update form model.
            // Update form model.
            _this.onChange(modelContent);
        });
    };
    // register event on jquery element
    // register event on jquery element
    FroalaEditorDirective.prototype.registerEvent = 
    // register event on jquery element
    function (element, eventName, callback) {
        if (!element || !eventName || !callback) {
            return;
        }
        this._listeningEvents.push(eventName);
        element.on(eventName, callback);
    };
    FroalaEditorDirective.prototype.initListeners = function () {
        var self = this;
        // bind contentChange and keyup event to froalaModel
        this.registerEvent(this._$element, 'froalaEditor.contentChanged', function () {
            setTimeout(function () {
                self.updateModel();
            }, 0);
        });
        if (this._opts.immediateAngularModelUpdate) {
            this.registerEvent(this._editor, 'keyup', function () {
                setTimeout(function () {
                    self.updateModel();
                }, 0);
            });
        }
    };
    // register events from editor options
    // register events from editor options
    FroalaEditorDirective.prototype.registerFroalaEvents = 
    // register events from editor options
    function () {
        if (!this._opts.events) {
            return;
        }
        for (var eventName in this._opts.events) {
            if (this._opts.events.hasOwnProperty(eventName)) {
                this.registerEvent(this._$element, eventName, this._opts.events[eventName]);
            }
        }
    };
    FroalaEditorDirective.prototype.createEditor = function () {
        var _this = this;
        if (this._editorInitialized) {
            return;
        }
        this.setContent(true);
        // Registering events before initializing the editor will bind the initialized event correctly.
        this.registerFroalaEvents();
        this.initListeners();
        // init editor
        this.zone.runOutsideAngular(function () {
            _this._editor = _this._$element.froalaEditor(_this._opts).data('froala.editor').$el;
        });
        this._editorInitialized = true;
    };
    FroalaEditorDirective.prototype.setHtml = function () {
        this._$element.froalaEditor('html.set', this._model || '', true);
        // This will reset the undo stack everytime the model changes externally. Can we fix this?
        this._$element.froalaEditor('undo.reset');
        this._$element.froalaEditor('undo.saveStep');
    };
    FroalaEditorDirective.prototype.setContent = function (firstTime) {
        if (firstTime === void 0) { firstTime = false; }
        var self = this;
        // Set initial content
        if (this._model || this._model == '') {
            this._oldModel = this._model;
            if (this._hasSpecialTag) {
                var tags = this._model;
                // add tags on element
                if (tags) {
                    for (var attr in tags) {
                        if (tags.hasOwnProperty(attr) && attr != this.INNER_HTML_ATTR) {
                            this._$element.attr(attr, tags[attr]);
                        }
                    }
                    if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
                        this._$element[0].innerHTML = tags[this.INNER_HTML_ATTR];
                    }
                }
            }
            else {
                if (firstTime) {
                    this.registerEvent(this._$element, 'froalaEditor.initialized', function () {
                        self.setHtml();
                    });
                }
                else {
                    self.setHtml();
                }
            }
        }
    };
    FroalaEditorDirective.prototype.destroyEditor = function () {
        if (this._editorInitialized) {
            this._$element.off(this._listeningEvents.join(" "));
            this._editor.off('keyup');
            this._$element.froalaEditor('destroy');
            this._listeningEvents.length = 0;
            this._editorInitialized = false;
        }
    };
    FroalaEditorDirective.prototype.getEditor = function () {
        if (this._$element) {
            return this._$element.froalaEditor.bind(this._$element);
        }
        return null;
    };
    // send manual editor initialization
    // send manual editor initialization
    FroalaEditorDirective.prototype.generateManualController = 
    // send manual editor initialization
    function () {
        var self = this;
        var controls = {
            initialize: this.createEditor.bind(this),
            destroy: this.destroyEditor.bind(this),
            getEditor: this.getEditor.bind(this),
        };
        this.froalaInit.emit(controls);
    };
    // TODO not sure if ngOnInit is executed after @inputs
    // TODO not sure if ngOnInit is executed after @inputs
    FroalaEditorDirective.prototype.ngOnInit = 
    // TODO not sure if ngOnInit is executed after @inputs
    function () {
        // check if output froalaInit is present. Maybe observers is private and should not be used?? TODO how to better test that an output directive is present.
        if (!this.froalaInit.observers.length) {
            this.createEditor();
        }
        else {
            this.generateManualController();
        }
    };
    FroalaEditorDirective.prototype.ngOnDestroy = function () {
        this.destroyEditor();
    };
    FroalaEditorDirective.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[froalaEditor]',
                    providers: [{
                            provide: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["NG_VALUE_ACCESSOR"], useExisting: Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return FroalaEditorDirective; }),
                            multi: true
                        }]
                },] },
    ];
    /** @nocollapse */
    FroalaEditorDirective.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], },
    ]; };
    FroalaEditorDirective.propDecorators = {
        "froalaEditor": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "froalaModel": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "froalaModelChange": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
        "froalaInit": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
    };
    return FroalaEditorDirective;
}());

//# sourceMappingURL=editor.directive.js.map

/***/ }),

/***/ "../../../../angular-froala-wysiwyg/editor/editor.module.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FroalaEditorModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__editor_directive__ = __webpack_require__("../../../../angular-froala-wysiwyg/editor/editor.directive.js");


var FroalaEditorModule = (function () {
    function FroalaEditorModule() {
    }
    FroalaEditorModule.forRoot = function () {
        return { ngModule: FroalaEditorModule, providers: [] };
    };
    FroalaEditorModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    declarations: [__WEBPACK_IMPORTED_MODULE_1__editor_directive__["a" /* FroalaEditorDirective */]],
                    exports: [__WEBPACK_IMPORTED_MODULE_1__editor_directive__["a" /* FroalaEditorDirective */]]
                },] },
    ];
    /** @nocollapse */
    FroalaEditorModule.ctorParameters = function () { return []; };
    return FroalaEditorModule;
}());

//# sourceMappingURL=editor.module.js.map

/***/ }),

/***/ "../../../../angular-froala-wysiwyg/editor/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__editor_directive__ = __webpack_require__("../../../../angular-froala-wysiwyg/editor/editor.directive.js");
/* unused harmony reexport FroalaEditorDirective */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__editor_module__ = __webpack_require__("../../../../angular-froala-wysiwyg/editor/editor.module.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__editor_module__["a"]; });


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../angular-froala-wysiwyg/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export FERootModule */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__editor__ = __webpack_require__("../../../../angular-froala-wysiwyg/editor/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__view__ = __webpack_require__("../../../../angular-froala-wysiwyg/view/index.js");
/* unused harmony reexport FroalaEditorDirective */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__editor__["a"]; });
/* unused harmony reexport FroalaViewDirective */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_2__view__["a"]; });





var MODULES = [
    __WEBPACK_IMPORTED_MODULE_1__editor__["a" /* FroalaEditorModule */],
    __WEBPACK_IMPORTED_MODULE_2__view__["a" /* FroalaViewModule */]
];
var FERootModule = (function () {
    function FERootModule() {
    }
    FERootModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    imports: [
                        __WEBPACK_IMPORTED_MODULE_1__editor__["a" /* FroalaEditorModule */].forRoot(),
                        __WEBPACK_IMPORTED_MODULE_2__view__["a" /* FroalaViewModule */].forRoot()
                    ],
                    exports: MODULES
                },] },
    ];
    /** @nocollapse */
    FERootModule.ctorParameters = function () { return []; };
    return FERootModule;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../angular-froala-wysiwyg/view/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__view_directive__ = __webpack_require__("../../../../angular-froala-wysiwyg/view/view.directive.js");
/* unused harmony reexport FroalaViewDirective */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__view_module__ = __webpack_require__("../../../../angular-froala-wysiwyg/view/view.module.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__view_module__["a"]; });


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../angular-froala-wysiwyg/view/view.directive.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FroalaViewDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");

var FroalaViewDirective = (function () {
    function FroalaViewDirective(renderer, element) {
        this.renderer = renderer;
        this._element = element.nativeElement;
    }
    Object.defineProperty(FroalaViewDirective.prototype, "froalaView", {
        set: 
        // update content model as it comes
        function (content) {
            this._element.innerHTML = content;
        },
        enumerable: true,
        configurable: true
    });
    FroalaViewDirective.prototype.ngAfterViewInit = function () {
        this.renderer.setElementClass(this._element, "fr-view", true);
    };
    FroalaViewDirective.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[froalaView]'
                },] },
    ];
    /** @nocollapse */
    FroalaViewDirective.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    ]; };
    FroalaViewDirective.propDecorators = {
        "froalaView": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return FroalaViewDirective;
}());

//# sourceMappingURL=view.directive.js.map

/***/ }),

/***/ "../../../../angular-froala-wysiwyg/view/view.module.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FroalaViewModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__view_directive__ = __webpack_require__("../../../../angular-froala-wysiwyg/view/view.directive.js");


var FroalaViewModule = (function () {
    function FroalaViewModule() {
    }
    FroalaViewModule.forRoot = function () {
        return { ngModule: FroalaViewModule, providers: [] };
    };
    FroalaViewModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    declarations: [__WEBPACK_IMPORTED_MODULE_1__view_directive__["a" /* FroalaViewDirective */]],
                    exports: [__WEBPACK_IMPORTED_MODULE_1__view_directive__["a" /* FroalaViewDirective */]]
                },] },
    ];
    /** @nocollapse */
    FroalaViewModule.ctorParameters = function () { return []; };
    return FroalaViewModule;
}());

//# sourceMappingURL=view.module.js.map

/***/ }),

/***/ "../../../../primeng/accordion.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/accordion/accordion.js"));

/***/ }),

/***/ "../../../../primeng/button.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/button/button.js"));

/***/ }),

/***/ "../../../../primeng/checkbox.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/checkbox/checkbox.js"));

/***/ }),

/***/ "../../../../primeng/dialog.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/dialog/dialog.js"));

/***/ }),

/***/ "../../../../primeng/dropdown.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/dropdown/dropdown.js"));

/***/ }),

/***/ "../../../../primeng/panel.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/panel/panel.js"));

/***/ }),

/***/ "../../../../primeng/selectbutton.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/selectbutton/selectbutton.js"));

/***/ }),

/***/ "../../../../primeng/tree.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/tree/tree.js"));

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
    /** @deprecated internal use only */ SwitchMapSubscriber.prototype._unsubscribe = function () {
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


/***/ }),

/***/ "../../../../underscore/underscore.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.9.0
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.0';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return obj != null && hasOwnProperty.call(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../../../../webpack/buildin/global.js"), __webpack_require__("../../../../webpack/buildin/module.js")(module)))

/***/ })

});
//# sourceMappingURL=common.chunk.js.map