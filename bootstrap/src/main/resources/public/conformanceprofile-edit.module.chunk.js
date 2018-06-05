webpackJsonp(["conformanceprofile-edit.module"],{

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".ng-valid[required], .ng-valid.required  {\n  /*border-left: 5px solid #42A948; !* green *!*/\n}\n\n.ng-invalid:not(form)  {\n  border-left: 5px solid #a94442 !important; /* red */\n}\n\ninput[type=text]{\n  border-width:0px 0px 1px 0px;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"segmentConformanceStatements\">\n    <h1>Conformance Statements</h1>\n    <form #csForm=\"ngForm\">\n        <p-accordion (onOpen)=\"onTabOpen($event)\">\n            <p-accordionTab header=\"List of Conformance Statements\" [(selected)]=\"listTab\">\n                <p-table [columns]=\"cols\" [value]=\"segmentConformanceStatements.conformanceStatements\" [reorderableColumns]=\"true\" [resizableColumns]=\"true\">\n                    <ng-template pTemplate=\"header\" let-columns>\n                        <tr>\n                            <th style=\"width:3em\"></th>\n\n\n                            <th *ngFor=\"let col of columns\" pReorderableColumn [pSortableColumn]=\"col.sort\" [ngStyle]=\"col.colStyle\" pResizableColumn>\n                                {{col.header}}\n                                <p-sortIcon *ngIf=\"col.colStyle\" [field]=\"col.field\"></p-sortIcon>\n                            </th>\n\n                            <th style=\"width:15em\" pReorderableColumn>Actions</th>\n                        </tr>\n                    </ng-template>\n                    <ng-template pTemplate=\"body\" let-rowData let-columns=\"columns\" let-index=\"rowIndex\">\n                        <tr [pReorderableRow]=\"index\">\n                            <td>\n                                <i class=\"fa fa-bars\" pReorderableRowHandle></i>\n                            </td>\n                            <td *ngFor=\"let col of columns\" class=\"ui-resizable-column\">\n                                <div *ngIf=\"col.field === 'identifier'\">\n                                    {{rowData[col.field]}}\n                                </div>\n                                <div *ngIf=\"col.field === 'description'\">\n                                    <div *ngIf=\"rowData['type'] === 'FREE'\">\n                                        {{rowData['freeText']}}\n                                    </div>\n                                    <div *ngIf=\"rowData['type'] === 'ASSERTION'\">\n                                        {{rowData['assertion'].description}}\n                                    </div>\n                                </div>\n                            </td>\n                            <td>\n                                <button pButton style=\"float: right\" type=\"button\"  class=\"ui-button-warning\" icon=\"fa-times\" label=\"Delete\" (click)=\"deleteCS(rowData['identifier'])\"></button>\n                                <button pButton style=\"float: right\" type=\"button\"  class=\"ui-button-info\" icon=\"fa-pencil\" label=\"Edit\" (click)=\"selectCS(rowData)\"></button>\n                            </td>\n                        </tr>\n                    </ng-template>\n                </p-table>\n\n\n            </p-accordionTab>\n            <p-accordionTab header=\"Conformance Statement Editor\" [(selected)]=\"editorTab\">\n                <div class=\"ui-g ui-fluid\">\n                    <div class=\"ui-g-12 ui-md-2\">\n                        <label>Editor Type: </label>\n                    </div>\n                    <div class=\"ui-g-12 ui-md-10\">\n                        <p-selectButton name=\"type\" [options]=\"constraintTypes\" [(ngModel)]=\"selectedConformanceStatement.type\" (onChange)=\"changeType()\"></p-selectButton>\n                    </div>\n                </div>\n\n                <div *ngIf=\"selectedConformanceStatement.type\">\n                    <div class=\"ui-g ui-fluid\">\n                        <div class=\"ui-g-12 ui-md-2\">\n                            <label for=\"id\">ID: </label>\n                        </div>\n                        <div class=\"ui-g-12 ui-md-10\">\n                            <input id=\"id\" name=\"id\" required minlength=\"2\" [(ngModel)]=\"selectedConformanceStatement.identifier\" type=\"text\" #id=\"ngModel\" style=\"width:50%;\"/>\n                            <div *ngIf=\"id.invalid && (id.dirty || id.touched)\" class=\"alert alert-danger\">\n                                <div *ngIf=\"id.errors.required\">\n                                    Constraint Id is required.\n                                </div>\n                                <div *ngIf=\"id.errors.minlength\">\n                                    Constraint Id must be at least 2 characters long.\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n\n                <div *ngIf=\"selectedConformanceStatement.type && selectedConformanceStatement.type ==='ASSERTION'\">\n                    <div class=\"ui-g ui-fluid\">\n                        <div class=\"ui-g-12 ui-md-2\">\n                            <label>Assertion Level: </label>\n                        </div>\n                        <div class=\"ui-g-12 ui-md-4\">\n                            <p-dropdown id=\"assertionMode\" name=\"assertionMode\" required #assertionMode=\"ngModel\" [options]=\"assertionModes\" [(ngModel)]=\"selectedConformanceStatement.assertion.mode\" (onChange)=\"changeAssertionMode()\"></p-dropdown>\n                            <div *ngIf=\"assertionMode.invalid && (assertionMode.dirty || assertionMode.touched)\" class=\"alert alert-danger\">\n                                <div *ngIf=\"assertionMode.errors.required\">\n                                    Assertion Type is required.\n                                </div>\n                            </div>\n                        </div>\n                        <div *ngIf=\"selectedConformanceStatement.assertion && selectedConformanceStatement.assertion.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-2\">\n                            <label>Complex Type: </label>\n                        </div>\n                        <div *ngIf=\"selectedConformanceStatement.assertion && selectedConformanceStatement.assertion.mode === 'COMPLEX'\" class=\"ui-g-12 ui-md-4\">\n                            <p-dropdown id=\"complexAssertionType\" name=\"complexAssertionType\" required #complexAssertionType=\"ngModel\" [options]=\"complexAssertionTypes\" [(ngModel)]=\"selectedConformanceStatement.assertion.complexAssertionType\" (onChange)=\"changeComplexAssertionType(selectedConformanceStatement.assertion)\" placeholder=\"Select a complex type\"></p-dropdown>\n                            <div *ngIf=\"complexAssertionType.invalid && (complexAssertionType.dirty || complexAssertionType.touched)\" class=\"alert alert-danger\">\n                                <div *ngIf=\"complexAssertionType.errors.required\">\n                                    Complex Type is required.\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <edit-free-constraint *ngIf=\"selectedConformanceStatement.type === 'FREE'\" [constraint]=\"selectedConformanceStatement\"></edit-free-constraint>\n                <edit-simple-constraint *ngIf=\"selectedConformanceStatement.assertion && selectedConformanceStatement.assertion.mode === 'SIMPLE'\" [constraint]=\"selectedConformanceStatement.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'rootSimple'\"></edit-simple-constraint>\n                <edit-complex-constraint *ngIf=\"selectedConformanceStatement.assertion && selectedConformanceStatement.assertion.mode === 'COMPLEX'\" [constraint]=\"selectedConformanceStatement.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'root'\"></edit-complex-constraint>\n\n                <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-plus\" label=\"Submit\" (click)=\"submitCS()\" [disabled]=\"csForm.invalid\"></button>\n                <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-print\" label=\"Print\" (click)=\"printCS(selectedConformanceStatement)\"></button>\n            </p-accordionTab>\n        </p-accordion>\n    </form>\n</div>"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceprofileEditConformancestatementsComponent; });
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










var ConformanceprofileEditConformancestatementsComponent = (function () {
    function ConformanceprofileEditConformancestatementsComponent(route, router, segmentsService, datatypesService, configService, constraintsService) {
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
    ConformanceprofileEditConformancestatementsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
        this.complexAssertionTypes = this.configService._complexAssertionTypes;
        this.idMap = {};
        this.treeData = [];
        this.segmentId = this.route.snapshot.params["segmentId"];
        this.route.data.map(function (data) { return data.conformanceprofileConformanceStatements; }).subscribe(function (x) {
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
    ConformanceprofileEditConformancestatementsComponent.prototype.reset = function () {
        this.segmentConformanceStatements = __WEBPACK_IMPORTED_MODULE_9_lodash__["cloneDeep"](this.backup);
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.getCurrent = function () {
        return this.segmentConformanceStatements;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.getBackup = function () {
        return this.backup;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.isValid = function () {
        return !this.csForm.invalid;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.save = function () {
        return this.segmentsService.saveSegmentConformanceStatements(this.segmentId, this.segmentConformanceStatements);
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.popChild = function (id, dtId, parentTreeNode) {
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
    ConformanceprofileEditConformancestatementsComponent.prototype.makeChild = function (data, id, para) {
        if (data.child)
            this.makeChild(data.child, id, para);
        else
            data.child = {
                elementId: id,
                instanceParameter: para
            };
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.changeType = function () {
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
    ConformanceprofileEditConformancestatementsComponent.prototype.changeAssertionMode = function () {
        if (this.selectedConformanceStatement.assertion.mode == 'SIMPLE') {
            this.selectedConformanceStatement.assertion = { mode: "SIMPLE" };
        }
        else if (this.selectedConformanceStatement.assertion.mode == 'COMPLEX') {
            this.selectedConformanceStatement.assertion = { mode: "COMPLEX" };
        }
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.submitCS = function () {
        if (this.selectedConformanceStatement.type === 'ASSERTION')
            this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedConformanceStatement.assertion, this.idMap);
        this.deleteCS(this.selectedConformanceStatement.identifier);
        this.segmentConformanceStatements.conformanceStatements.push(this.selectedConformanceStatement);
        this.selectedConformanceStatement = {};
        this.editorTab = false;
        this.listTab = true;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.selectCS = function (cs) {
        this.selectedConformanceStatement = JSON.parse(JSON.stringify(cs));
        this.editorTab = true;
        this.listTab = false;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.deleteCS = function (identifier) {
        this.segmentConformanceStatements.conformanceStatements = __WEBPACK_IMPORTED_MODULE_5_underscore__["_"].without(this.segmentConformanceStatements.conformanceStatements, __WEBPACK_IMPORTED_MODULE_5_underscore__["_"].findWhere(this.segmentConformanceStatements.conformanceStatements, { identifier: identifier }));
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.printCS = function (cs) {
        console.log(cs);
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.onTabOpen = function (e) {
        if (e.index === 0)
            this.selectedConformanceStatement = {};
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.changeComplexAssertionType = function (constraint) {
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
    ], ConformanceprofileEditConformancestatementsComponent.prototype, "csForm", void 0);
    ConformanceprofileEditConformancestatementsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"],
            __WEBPACK_IMPORTED_MODULE_3__service_segments_segments_service__["a" /* SegmentsService */],
            __WEBPACK_IMPORTED_MODULE_4__service_datatypes_datatypes_service__["a" /* DatatypesService */],
            __WEBPACK_IMPORTED_MODULE_6__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */],
            __WEBPACK_IMPORTED_MODULE_7__service_constraints_constraints_service__["a" /* ConstraintsService */]])
    ], ConformanceprofileEditConformancestatementsComponent);
    return ConformanceprofileEditConformancestatementsComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceprofileEditConformancestatementsResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_conformance_profiles_conformance_profiles_service__ = __webpack_require__("../../../../../src/app/service/conformance-profiles/conformance-profiles.service.ts");
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



var ConformanceprofileEditConformancestatementsResolver = (function () {
    function ConformanceprofileEditConformancestatementsResolver(http, conformanceProfilesService) {
        this.http = http;
        this.conformanceProfilesService = conformanceProfilesService;
    }
    ConformanceprofileEditConformancestatementsResolver.prototype.resolve = function (route, rstate) {
        var conformanceprofileId = route.params["conformanceprofileId"];
        return this.conformanceProfilesService.getConformanceProfileConformanceStatements(conformanceprofileId);
    };
    ConformanceprofileEditConformancestatementsResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__service_conformance_profiles_conformance_profiles_service__["a" /* ConformanceProfilesService */]])
    ], ConformanceprofileEditConformancestatementsResolver);
    return ConformanceprofileEditConformancestatementsResolver;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-edit-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceprofileEditRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__conformanceprofile_metadata_conformanceprofile_edit_metadata_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-metadata/conformanceprofile-edit-metadata.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__conformanceprofile_metadata_conformanceprofile_edit_metadata_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-metadata/conformanceprofile-edit-metadata.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__guards_save_guard__ = __webpack_require__("../../../../../src/app/guards/save.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__conformanceprofile_postdef_conformanceprofile_edit_postdef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-postdef/conformanceprofile-edit-postdef.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__conformanceprofile_postdef_conformanceprofile_edit_postdef_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-postdef/conformanceprofile-edit-postdef.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__conformanceprofile_predef_conformanceprofile_edit_predef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-predef/conformanceprofile-edit-predef.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__conformanceprofile_predef_conformanceprofile_edit_predef_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-predef/conformanceprofile-edit-predef.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__conformanceprofile_structure_conformanceprofile_edit_structure_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-structure/conformanceprofile-edit-structure.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__conformanceprofile_structure_conformanceprofile_edit_structure_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-structure/conformanceprofile-edit-structure.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__conformanceprofile_conformancestatements_conformanceprofile_edit_conformancestatements_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__conformanceprofile_conformancestatements_conformanceprofile_edit_conformancestatements_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.resolver.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by hnt5 on 10/23/17.
 */













var ConformanceprofileEditRoutingModule = (function () {
    function ConformanceprofileEditRoutingModule() {
    }
    ConformanceprofileEditRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_router__["RouterModule"].forChild([
                    {
                        path: ':conformanceprofileId', component: __WEBPACK_IMPORTED_MODULE_9__conformanceprofile_structure_conformanceprofile_edit_structure_component__["a" /* ConformanceprofileEditStructureComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_4__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { conformanceprofileStructure: __WEBPACK_IMPORTED_MODULE_10__conformanceprofile_structure_conformanceprofile_edit_structure_resolver__["a" /* ConformanceprofileEditStructureResolver */] }
                    },
                    {
                        path: ':conformanceprofileId/metadata', component: __WEBPACK_IMPORTED_MODULE_2__conformanceprofile_metadata_conformanceprofile_edit_metadata_component__["a" /* ConformanceprofileEditMetadataComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_4__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { conformanceprofileMetadata: __WEBPACK_IMPORTED_MODULE_3__conformanceprofile_metadata_conformanceprofile_edit_metadata_resolver__["a" /* ConformanceprofileEditMetadatResolver */] }
                    },
                    {
                        path: ':conformanceprofileId/postDef', component: __WEBPACK_IMPORTED_MODULE_5__conformanceprofile_postdef_conformanceprofile_edit_postdef_component__["a" /* ConformanceprofileEditPostdefComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_4__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { conformanceprofilePostdef: __WEBPACK_IMPORTED_MODULE_6__conformanceprofile_postdef_conformanceprofile_edit_postdef_resolver__["a" /* ConformanceprofileEditPostdefResolver */] }
                    },
                    {
                        path: ':conformanceprofileId/preDef', component: __WEBPACK_IMPORTED_MODULE_7__conformanceprofile_predef_conformanceprofile_edit_predef_component__["a" /* ConformanceprofileEditPredefComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_4__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { conformanceprofilePredef: __WEBPACK_IMPORTED_MODULE_8__conformanceprofile_predef_conformanceprofile_edit_predef_resolver__["a" /* ConformanceprofileEditPredefResolver */] }
                    },
                    {
                        path: ':conformanceprofileId/structure', component: __WEBPACK_IMPORTED_MODULE_9__conformanceprofile_structure_conformanceprofile_edit_structure_component__["a" /* ConformanceprofileEditStructureComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_4__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { conformanceprofileStructure: __WEBPACK_IMPORTED_MODULE_10__conformanceprofile_structure_conformanceprofile_edit_structure_resolver__["a" /* ConformanceprofileEditStructureResolver */] }
                    },
                    {
                        path: ':segmentId/conformanceStatement', component: __WEBPACK_IMPORTED_MODULE_11__conformanceprofile_conformancestatements_conformanceprofile_edit_conformancestatements_component__["a" /* ConformanceprofileEditConformancestatementsComponent */], canDeactivate: [__WEBPACK_IMPORTED_MODULE_4__guards_save_guard__["a" /* SaveFormsGuard */]], resolve: { conformanceprofileConformanceStatements: __WEBPACK_IMPORTED_MODULE_12__conformanceprofile_conformancestatements_conformanceprofile_edit_conformancestatements_resolver__["a" /* ConformanceprofileEditConformancestatementsResolver */] }
                    }
                ])
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_router__["RouterModule"]
            ]
        })
    ], ConformanceprofileEditRoutingModule);
    return ConformanceprofileEditRoutingModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-edit.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConformanceprofileEditModule", function() { return ConformanceprofileEditModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__conformanceprofile_metadata_conformanceprofile_edit_metadata_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-metadata/conformanceprofile-edit-metadata.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__conformanceprofile_edit_routing_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-edit-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_components_tabmenu_tabmenu__ = __webpack_require__("../../../../primeng/components/tabmenu/tabmenu.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_components_tabmenu_tabmenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_primeng_components_tabmenu_tabmenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_primeng_components_treetable_treetable__ = __webpack_require__("../../../../primeng/components/treetable/treetable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_primeng_components_treetable_treetable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_primeng_components_treetable_treetable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_components_dialog_dialog__ = __webpack_require__("../../../../primeng/components/dialog/dialog.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_components_dialog_dialog___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_primeng_components_dialog_dialog__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_components_dropdown_dropdown__ = __webpack_require__("../../../../primeng/components/dropdown/dropdown.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_components_dropdown_dropdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_primeng_components_dropdown_dropdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_primeng_button__ = __webpack_require__("../../../../primeng/button.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_primeng_button___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_primeng_button__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_primeng_accordion__ = __webpack_require__("../../../../primeng/accordion.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_primeng_accordion___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_primeng_accordion__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_primeng_selectbutton__ = __webpack_require__("../../../../primeng/selectbutton.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_primeng_selectbutton___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_primeng_selectbutton__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_primeng_table__ = __webpack_require__("../../../../primeng/table.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_primeng_table___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_primeng_table__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__utils_utils_module__ = __webpack_require__("../../../../../src/app/utils/utils.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__conformanceprofile_metadata_conformanceprofile_edit_metadata_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-metadata/conformanceprofile-edit-metadata.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_angular_froala_wysiwyg__ = __webpack_require__("../../../../angular-froala-wysiwyg/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_primeng_message__ = __webpack_require__("../../../../primeng/message.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_primeng_message___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_primeng_message__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__conformanceprofile_postdef_conformanceprofile_edit_postdef_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-postdef/conformanceprofile-edit-postdef.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__conformanceprofile_postdef_conformanceprofile_edit_postdef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-postdef/conformanceprofile-edit-postdef.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__conformanceprofile_predef_conformanceprofile_edit_predef_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-predef/conformanceprofile-edit-predef.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__conformanceprofile_predef_conformanceprofile_edit_predef_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-predef/conformanceprofile-edit-predef.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__conformanceprofile_structure_conformanceprofile_edit_structure_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-structure/conformanceprofile-edit-structure.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__conformanceprofile_structure_conformanceprofile_edit_structure_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-structure/conformanceprofile-edit-structure.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__conformanceprofile_conformancestatements_conformanceprofile_edit_conformancestatements_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__conformanceprofile_conformancestatements_conformanceprofile_edit_conformancestatements_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-conformancestatements/conformanceprofile-edit-conformancestatements.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

























var ConformanceprofileEditModule = (function () {
    function ConformanceprofileEditModule() {
    }
    ConformanceprofileEditModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_6__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_4_primeng_components_tabmenu_tabmenu__["TabMenuModule"],
                __WEBPACK_IMPORTED_MODULE_7_primeng_components_dialog_dialog__["DialogModule"],
                __WEBPACK_IMPORTED_MODULE_8_primeng_components_dropdown_dropdown__["DropdownModule"],
                __WEBPACK_IMPORTED_MODULE_3__conformanceprofile_edit_routing_module__["a" /* ConformanceprofileEditRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_13__utils_utils_module__["a" /* UtilsModule */],
                __WEBPACK_IMPORTED_MODULE_5_primeng_components_treetable_treetable__["TreeTableModule"],
                __WEBPACK_IMPORTED_MODULE_9_primeng_button__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_10_primeng_accordion__["AccordionModule"],
                __WEBPACK_IMPORTED_MODULE_11_primeng_selectbutton__["SelectButtonModule"],
                __WEBPACK_IMPORTED_MODULE_12_primeng_table__["TableModule"],
                __WEBPACK_IMPORTED_MODULE_15_angular_froala_wysiwyg__["a" /* FroalaEditorModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_15_angular_froala_wysiwyg__["b" /* FroalaViewModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_16_primeng_message__["MessageModule"]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_14__conformanceprofile_metadata_conformanceprofile_edit_metadata_resolver__["a" /* ConformanceprofileEditMetadatResolver */], __WEBPACK_IMPORTED_MODULE_17__conformanceprofile_postdef_conformanceprofile_edit_postdef_resolver__["a" /* ConformanceprofileEditPostdefResolver */], __WEBPACK_IMPORTED_MODULE_19__conformanceprofile_predef_conformanceprofile_edit_predef_resolver__["a" /* ConformanceprofileEditPredefResolver */], __WEBPACK_IMPORTED_MODULE_21__conformanceprofile_structure_conformanceprofile_edit_structure_resolver__["a" /* ConformanceprofileEditStructureResolver */], __WEBPACK_IMPORTED_MODULE_23__conformanceprofile_conformancestatements_conformanceprofile_edit_conformancestatements_resolver__["a" /* ConformanceprofileEditConformancestatementsResolver */]],
            declarations: [__WEBPACK_IMPORTED_MODULE_2__conformanceprofile_metadata_conformanceprofile_edit_metadata_component__["a" /* ConformanceprofileEditMetadataComponent */], __WEBPACK_IMPORTED_MODULE_18__conformanceprofile_postdef_conformanceprofile_edit_postdef_component__["a" /* ConformanceprofileEditPostdefComponent */], __WEBPACK_IMPORTED_MODULE_20__conformanceprofile_predef_conformanceprofile_edit_predef_component__["a" /* ConformanceprofileEditPredefComponent */], __WEBPACK_IMPORTED_MODULE_22__conformanceprofile_structure_conformanceprofile_edit_structure_component__["a" /* ConformanceprofileEditStructureComponent */], __WEBPACK_IMPORTED_MODULE_24__conformanceprofile_conformancestatements_conformanceprofile_edit_conformancestatements_component__["a" /* ConformanceprofileEditConformancestatementsComponent */]],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["CUSTOM_ELEMENTS_SCHEMA"]]
        })
    ], ConformanceprofileEditModule);
    return ConformanceprofileEditModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-metadata/conformanceprofile-edit-metadata.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-metadata/conformanceprofile-edit-metadata.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>Conformance Profile Metadata</h2>\n<div *ngIf=\"conformanceprofileMetadata\">\n    <form #editForm=\"ngForm\">\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Name\n            </label>\n            <input name=\"name\" id=\"name\" pInputText type=\"text\" disabled class=\"ui-g-10\" #name=\"ngModel\" [(ngModel)]=\"conformanceprofileMetadata.name\" required />\n            <div class=\"ui-g-offset-1\" *ngIf=\"name.invalid&& (name.dirty || name.touched)\">\n                <p-message severity=\"error\" text=\"Name is required\"></p-message>\n            </div>\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Identifier\n            </label>\n            <input name=\"identifier\" id=\"identifier\" pInputText type=\"text\" class=\"ui-g-10\" #ext=\"ngModel\" [(ngModel)]=\"conformanceprofileMetadata.identifier\" />\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Description\n            </label>\n            <input name=\"description\" id=\"description\" pInputText type=\"text\" class=\"ui-g-10\" #description=\"ngModel\" [(ngModel)]=\"conformanceprofileMetadata.description\" />\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Message Type\n            </label>\n            <input name=\"messageType\" id=\"messageType\" pInputText type=\"text\" class=\"ui-g-10\" #description=\"ngModel\" [(ngModel)]=\"conformanceprofileMetadata.messageType\" />\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Message Event\n            </label>\n            <input name=\"messageEvent\" id=\"messageEvent\" pInputText type=\"text\" class=\"ui-g-10\" #description=\"ngModel\" [(ngModel)]=\"conformanceprofileMetadata.messageEvent\" />\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Message Structure ID\n            </label>\n            <input name=\"structId\" id=\"structId\" pInputText type=\"text\" class=\"ui-g-10\" #description=\"ngModel\" [(ngModel)]=\"conformanceprofileMetadata.structId\" />\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Author Notes\n            </label>\n            <div class=\"ui-g-10\" [froalaEditor] [(froalaModel)]=\"conformanceprofileMetadata.authorNote\"></div>\n        </div>\n\n        <div class=\"ui-g input-box\">\n            <label class=\"metadata-label ui-g-2\">\n                Usage Notes\n            </label>\n            <div class=\"ui-g-10\" [froalaEditor] [(froalaModel)]=\"conformanceprofileMetadata.usageNote\"></div>\n        </div>\n    </form>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-metadata/conformanceprofile-edit-metadata.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceprofileEditMetadataComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__toc_toc_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/toc/toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_conformance_profiles_conformance_profiles_service__ = __webpack_require__("../../../../../src/app/service/conformance-profiles/conformance-profiles.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_indexed_db_conformance_profiles_conformance_profiles_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/conformance-profiles/conformance-profiles-toc.service.ts");
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









var ConformanceprofileEditMetadataComponent = (function () {
    function ConformanceprofileEditMetadataComponent(indexedDbService, route, router, conformanceProfilesService, conformanceProfilesTocService, tocService) {
        var _this = this;
        this.indexedDbService = indexedDbService;
        this.route = route;
        this.router = router;
        this.conformanceProfilesService = conformanceProfilesService;
        this.conformanceProfilesTocService = conformanceProfilesTocService;
        this.tocService = tocService;
        this.tocService.getActiveNode().subscribe(function (x) {
            console.log(x);
            _this.currentNode = x;
        });
    }
    ConformanceprofileEditMetadataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(function (data) { return data.conformanceprofileMetadata; }).subscribe(function (x) {
            _this.conformanceProfilesTocService.getAll().then(function (conformanceprofiles) {
                console.log(conformanceprofiles);
                _this.backup = x;
                _this.conformanceprofileMetadata = __WEBPACK_IMPORTED_MODULE_2_lodash__["cloneDeep"](_this.backup);
            });
        });
    };
    ConformanceprofileEditMetadataComponent.prototype.reset = function () {
        this.conformanceprofileMetadata = __WEBPACK_IMPORTED_MODULE_2_lodash__["cloneDeep"](this.backup);
    };
    ConformanceprofileEditMetadataComponent.prototype.getCurrent = function () {
        return this.conformanceprofileMetadata;
    };
    ConformanceprofileEditMetadataComponent.prototype.getBackup = function () {
        return this.backup;
    };
    ConformanceprofileEditMetadataComponent.prototype.isValid = function () {
        return !this.editForm.invalid;
    };
    ConformanceprofileEditMetadataComponent.prototype.save = function () {
        var _this = this;
        this.tocService.getActiveNode().subscribe(function (x) {
            var node = x;
            node.data.data.ext = __WEBPACK_IMPORTED_MODULE_2_lodash__["cloneDeep"](_this.conformanceprofileMetadata.ext);
        });
        return this.conformanceProfilesService.saveConformanceProfileConformanceStatements(this.conformanceprofileId, this.conformanceprofileMetadata);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('editForm'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6__angular_forms__["NgForm"])
    ], ConformanceprofileEditMetadataComponent.prototype, "editForm", void 0);
    ConformanceprofileEditMetadataComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-metadata/conformanceprofile-edit-metadata.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-metadata/conformanceprofile-edit-metadata.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_7__service_conformance_profiles_conformance_profiles_service__["a" /* ConformanceProfilesService */], __WEBPACK_IMPORTED_MODULE_8__service_indexed_db_conformance_profiles_conformance_profiles_toc_service__["a" /* ConformanceProfilesTocService */], __WEBPACK_IMPORTED_MODULE_4__toc_toc_service__["a" /* TocService */]])
    ], ConformanceprofileEditMetadataComponent);
    return ConformanceprofileEditMetadataComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-metadata/conformanceprofile-edit-metadata.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceprofileEditMetadatResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_conformance_profiles_conformance_profiles_service__ = __webpack_require__("../../../../../src/app/service/conformance-profiles/conformance-profiles.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ConformanceprofileEditMetadatResolver = (function () {
    function ConformanceprofileEditMetadatResolver(http, conformanceProfilesService) {
        this.http = http;
        this.conformanceProfilesService = conformanceProfilesService;
    }
    ConformanceprofileEditMetadatResolver.prototype.resolve = function (route, rstate) {
        var conformanceprofileId = route.params['conformanceprofileId'];
        return this.conformanceProfilesService.getConformanceProfileMetadata(conformanceprofileId);
    };
    ConformanceprofileEditMetadatResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__service_conformance_profiles_conformance_profiles_service__["a" /* ConformanceProfilesService */]])
    ], ConformanceprofileEditMetadatResolver);
    return ConformanceprofileEditMetadatResolver;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-postdef/conformanceprofile-edit-postdef.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-postdef/conformanceprofile-edit-postdef.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>Conformance Profile Post Definition TEXT</h2>\n<div *ngIf=\"conformanceProfilePostdef\">\n    <form #editForm=\"ngForm\">\n        <div class=\"ui-g input-box\">\n            <div class=\"ui-g-12\" [froalaEditor] [(froalaModel)]=\"conformanceProfilePostdef.postDef\"></div>\n        </div>\n    </form>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-postdef/conformanceprofile-edit-postdef.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceprofileEditPostdefComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_conformance_profiles_conformance_profiles_service__ = __webpack_require__("../../../../../src/app/service/conformance-profiles/conformance-profiles.service.ts");
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







var ConformanceprofileEditPostdefComponent = (function () {
    function ConformanceprofileEditPostdefComponent(route, router, conformanceProfilesService, http) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.conformanceProfilesService = conformanceProfilesService;
        this.http = http;
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
    }
    ConformanceprofileEditPostdefComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(function (data) { return data.conformanceprofilePostdef; }).subscribe(function (x) {
            _this.backup = x;
            _this.conformanceProfilePostdef = __WEBPACK_IMPORTED_MODULE_5_lodash__["cloneDeep"](_this.backup);
        });
    };
    ConformanceprofileEditPostdefComponent.prototype.reset = function () {
        this.conformanceProfilePostdef = __WEBPACK_IMPORTED_MODULE_5_lodash__["cloneDeep"](this.backup);
    };
    ConformanceprofileEditPostdefComponent.prototype.getCurrent = function () {
        return this.conformanceProfilePostdef;
    };
    ConformanceprofileEditPostdefComponent.prototype.getBackup = function () {
        return this.backup;
    };
    ConformanceprofileEditPostdefComponent.prototype.isValid = function () {
        return !this.editForm.invalid;
    };
    ConformanceprofileEditPostdefComponent.prototype.save = function () {
        return this.conformanceProfilesService.saveConformanceProfilePostDef(this.conformanceprofileId, this.conformanceProfilePostdef);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('editForm'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__angular_forms__["NgForm"])
    ], ConformanceprofileEditPostdefComponent.prototype, "editForm", void 0);
    ConformanceprofileEditPostdefComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-postdef/conformanceprofile-edit-postdef.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-postdef/conformanceprofile-edit-postdef.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_6__service_conformance_profiles_conformance_profiles_service__["a" /* ConformanceProfilesService */], __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */]])
    ], ConformanceprofileEditPostdefComponent);
    return ConformanceprofileEditPostdefComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-postdef/conformanceprofile-edit-postdef.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceprofileEditPostdefResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_conformance_profiles_conformance_profiles_service__ = __webpack_require__("../../../../../src/app/service/conformance-profiles/conformance-profiles.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ConformanceprofileEditPostdefResolver = (function () {
    function ConformanceprofileEditPostdefResolver(http, conformanceProfilesService) {
        this.http = http;
        this.conformanceProfilesService = conformanceProfilesService;
    }
    ConformanceprofileEditPostdefResolver.prototype.resolve = function (route, rstate) {
        var conformanceprofileId = route.params["conformanceprofileId"];
        return this.conformanceProfilesService.getConformanceProfilePostDef(conformanceprofileId);
    };
    ConformanceprofileEditPostdefResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__service_conformance_profiles_conformance_profiles_service__["a" /* ConformanceProfilesService */]])
    ], ConformanceprofileEditPostdefResolver);
    return ConformanceprofileEditPostdefResolver;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-predef/conformanceprofile-edit-predef.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-predef/conformanceprofile-edit-predef.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>Conformance Profile Pre Definition TEXT</h2>\n<div *ngIf=\"conformanceprofilePredef\">\n    <form #editForm=\"ngForm\">\n        <div class=\"ui-g input-box\">\n            <div class=\"ui-g-12\" [froalaEditor] [(froalaModel)]=\"conformanceprofilePredef.preDef\"></div>\n        </div>\n    </form>\n</div>"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-predef/conformanceprofile-edit-predef.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceprofileEditPredefComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_filter__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_conformance_profiles_conformance_profiles_service__ = __webpack_require__("../../../../../src/app/service/conformance-profiles/conformance-profiles.service.ts");
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







var ConformanceprofileEditPredefComponent = (function () {
    function ConformanceprofileEditPredefComponent(route, router, conformanceProfilesService, http) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.conformanceProfilesService = conformanceProfilesService;
        this.http = http;
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
    }
    ConformanceprofileEditPredefComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(function (data) { return data.conformanceprofilePredef; }).subscribe(function (x) {
            _this.backup = x;
            _this.conformanceprofilePredef = __WEBPACK_IMPORTED_MODULE_5_lodash__["cloneDeep"](_this.backup);
        });
    };
    ConformanceprofileEditPredefComponent.prototype.reset = function () {
        this.conformanceprofilePredef = __WEBPACK_IMPORTED_MODULE_5_lodash__["cloneDeep"](this.backup);
    };
    ConformanceprofileEditPredefComponent.prototype.getCurrent = function () {
        return this.conformanceprofilePredef;
    };
    ConformanceprofileEditPredefComponent.prototype.getBackup = function () {
        return this.backup;
    };
    ConformanceprofileEditPredefComponent.prototype.isValid = function () {
        return !this.editForm.invalid;
    };
    ConformanceprofileEditPredefComponent.prototype.save = function () {
        return this.conformanceProfilesService.saveConformanceProfilePreDef(this.conformanceprofileId, this.conformanceprofilePredef);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('editForm'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__angular_forms__["NgForm"])
    ], ConformanceprofileEditPredefComponent.prototype, "editForm", void 0);
    ConformanceprofileEditPredefComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-predef/conformanceprofile-edit-predef.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-predef/conformanceprofile-edit-predef.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_6__service_conformance_profiles_conformance_profiles_service__["a" /* ConformanceProfilesService */], __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */]])
    ], ConformanceprofileEditPredefComponent);
    return ConformanceprofileEditPredefComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-predef/conformanceprofile-edit-predef.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceprofileEditPredefResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_conformance_profiles_conformance_profiles_service__ = __webpack_require__("../../../../../src/app/service/conformance-profiles/conformance-profiles.service.ts");
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



var ConformanceprofileEditPredefResolver = (function () {
    function ConformanceprofileEditPredefResolver(http, conformanceProfilesService) {
        this.http = http;
        this.conformanceProfilesService = conformanceProfilesService;
    }
    ConformanceprofileEditPredefResolver.prototype.resolve = function (route, rstate) {
        var conformanceprofileId = route.params["conformanceprofileId"];
        return this.conformanceProfilesService.getConformanceProfilePreDef(conformanceprofileId);
    };
    ConformanceprofileEditPredefResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__service_conformance_profiles_conformance_profiles_service__["a" /* ConformanceProfilesService */]])
    ], ConformanceprofileEditPredefResolver);
    return ConformanceprofileEditPredefResolver;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-structure/conformanceprofile-edit-structure.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-structure/conformanceprofile-edit-structure.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>Conformance Profile Structure</h2>\n\n<div *ngIf=\"conformanceprofileStructure\">\n    <p-treeTable [value]=\"conformanceprofileStructure.children\" tableStyleClass=\"table-condensed table-stripped table-bordered\" (onNodeExpand)=\"loadNode($event)\">\n\n        <p-column header=\"Name\" [style]=\"{'width':'350px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'SEGMENT'\">\n                    <display-badge [type]=\"node.data.displayData.type\"></display-badge>{{node.data.position}}. {{node.data.displayData.segment.label}}\n                </div>\n                <div *ngIf=\"node.data.displayData.type !== 'SEGMENT'\">\n                    <display-badge [type]=\"node.data.displayData.type\"></display-badge>{{node.data.position}}. {{node.data.name}}\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Usage\" [style]=\"{'width':'190px'}\" >\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\" >\n                <div *ngIf=\"node.data.displayData.type === 'GROUP' || node.data.displayData.type === 'SEGMENT'\">\n                    <p-dropdown *ngIf=\"node.data.usage !== 'C'\" [options]=\"usages\" [(ngModel)]=\"node.data.usage\" appendTo=\"body\" (onChange)=\"onUsageChange(node)\" [style]=\"{'width' : '100%'}\"></p-dropdown>\n                    <div *ngIf=\"node.data.usage === 'C'\">\n                        <p-dropdown [options]=\"usages\" [(ngModel)]=\"node.data.usage\" appendTo=\"body\" (onChange)=\"onUsageChange(node)\" [style]=\"{'width' : '30%'}\"></p-dropdown>\n                        (<p-dropdown [options]=\"cUsages\" [(ngModel)]=\"node.data.displayData.messageBinding.predicate.trueUsage\" appendTo=\"body\" [style]=\"{'width' : '30%'}\"></p-dropdown>/\n                        <p-dropdown [options]=\"cUsages\" [(ngModel)]=\"node.data.displayData.messageBinding.predicate.falseUsage\" appendTo=\"body\" [style]=\"{'width' : '30%'}\"></p-dropdown>)\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.type === 'FIELD'\">\n                    <div *ngIf=\"node.data.usage !== 'C' || !node.data.displayData.segmentBinding|| !node.data.displayData.segmentBinding.predicate\">{{node.data.usage}}</div>\n                    <div *ngIf=\"node.data.usage === 'C' && node.data.displayData.segmentBinding && node.data.displayData.segmentBinding.predicate\">C({{node.data.displayData.segmentBinding.predicate.trueUsage}}/{{node.data.displayData.segmentBinding.predicate.falseUsage}})</div>\n                </div>\n                <div *ngIf=\"node.data.displayData.type === 'COMPONENT'\">\n                    <div *ngIf=\"node.data.usage !== 'C' || !node.data.displayData.fieldDTbinding|| !node.data.displayData.fieldDTbinding.predicate\">{{node.data.usage}}</div>\n                    <div *ngIf=\"node.data.usage === 'C' && node.data.displayData.fieldDTbinding && node.data.displayData.fieldDTbinding.predicate\">C({{node.data.displayData.fieldDTbinding.predicate.trueUsage}}/{{node.data.displayData.fieldDTbinding.predicate.falseUsage}})</div>\n                </div>\n                <div *ngIf=\"node.data.displayData.type === 'SUBCOMPONENT'\">\n                    <div *ngIf=\"node.data.usage !== 'C' || !node.data.displayData.componentDTbinding || !node.data.displayData.componentDTbinding.predicate\">{{node.data.usage}}</div>\n                    <div *ngIf=\"node.data.usage === 'C' && node.data.displayData.componentDTbinding && node.data.displayData.componentDTbinding.predicate\">C({{node.data.displayData.componentDTbinding.predicate.trueUsage}}/{{node.data.displayData.componentDTbinding.predicate.falseUsage}})</div>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Cardinality\" [style]=\"{'width':'100px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type !== 'COMPONENT' && node.data.displayData.type !== 'SUBCOMPONENT'\">\n                    <input required id=\"min\" [(ngModel)]=\"node.data.min\" type=\"number\" #min=\"ngModel\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n                    <input required id=\"max\" [(ngModel)]=\"node.data.max\" type=\"text\" #max=\"ngModel\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Length\" [style]=\"{'width':'150px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'FIELD' || node.data.displayData.type === 'COMPONENT' || node.data.displayData.type === 'SUBCOMPONENT'\">\n                    [{{node.data.minLength}}..{{node.data.maxLength}}]\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Conf. Length\" [style]=\"{'width':'120px'}\" >\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'FIELD' || node.data.displayData.type === 'COMPONENT' || node.data.displayData.type === 'SUBCOMPONENT'\">\n                    {{node.data.confLength}}\n                </div>\n            </ng-template>\n        </p-column>\n\n\n        <p-column header=\"Datatype\" [style]=\"{'width':'200px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'FIELD' || node.data.displayData.type === 'COMPONENT' || node.data.displayData.type === 'SUBCOMPONENT'\">\n                    <display-ref [elm]=\"node.data.displayData.datatype\"></display-ref>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"ValueSet\" [style]=\"{'width':valuesetColumnWidth}\">\n            <ng-template let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.valuesetAllowed && !node.data.displayData.hasSingleCode\">\n                    <div *ngIf=\"node.data.displayData.messageBinding\">\n                        <div *ngFor=\"let vs of node.data.displayData.messageBinding.valuesetBindings\">\n                            <div *ngIf=\"!vs.edit\">\n                                <display-ref [elm]=\"vs\" [from]=\"'MESSAGE'\"></display-ref>\n                                <i class=\"fa fa-pencil\" (click)=\"makeEditModeForValueSet(vs)\" style=\"width:20%;\"></i>\n                                <i class=\"fa fa-times\" (click)=\"delValueSetBinding(node.data.displayData.messageBinding, vs, node.data.displayData)\" style=\"width:20%;\"></i>\n                            </div>\n                            <div *ngIf=\"vs.edit\">\n                                <p-dropdown [options]=\"valuesetOptions\" [(ngModel)]=\"vs.newvalue.valuesetId\" appendTo=\"body\" [style]=\"{'width':'150px'}\" filter=\"true\">\n                                    <ng-template let-option pTemplate=\"body\">\n                                        <div class=\"ui-helper-clearfix\" style=\"position: relative;height: 25px;\">\n                                            <display-ref *ngIf=\"option.value\" [elm]=\"getValueSetElm(option.value)\"></display-ref>\n                                            <span *ngIf=\"!option.value\">{{option.label}}</span>\n                                        </div>\n                                    </ng-template>\n                                </p-dropdown>\n                                <p-dropdown [options]=\"valuesetStrengthOptions\" [(ngModel)]=\"vs.newvalue.strength\" appendTo=\"body\" [style]=\"{'width':'150px'}\">\n                                </p-dropdown>\n                                <p-dropdown *ngIf=\"node.data.displayData.valueSetLocationOptions\" [options]=\"node.data.displayData.valueSetLocationOptions\" [(ngModel)]=\"vs.newvalue.valuesetLocations\" appendTo=\"body\" [style]=\"{'width':'150px'}\">\n                                </p-dropdown>\n                                <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewValueSet(vs); node.data.displayData.hasValueSet = true;\" [disabled]=\"!vs.newvalue.valuesetId\"></button>\n                            </div>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.messageBinding || !node.data.displayData.messageBinding.valuesetBindings || node.data.displayData.messageBinding.valuesetBindings.length === 0) && node.data.displayData.segmentBinding\">\n                        <div *ngFor=\"let vs of node.data.displayData.segmentBinding.valuesetBindings\">\n                            <div *ngIf=\"!vs.edit\">\n                                <display-ref [elm]=\"vs\" [from]=\"'SEGMENT'\"></display-ref>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div *ngIf=\"(!node.data.displayData.messageBinding || !node.data.displayData.messageBinding.valuesetBindings || node.data.displayData.messageBinding.valuesetBindings.length === 0) && (!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.valuesetBindings || node.data.displayData.segmentBinding.valuesetBindings.length === 0) && node.data.displayData.fieldDTbinding\">\n                        <div *ngFor=\"let vs of node.data.displayData.fieldDTbinding.valuesetBindings\">\n                            <div *ngIf=\"!vs.edit\">\n                                <display-ref [elm]=\"vs\" [from]=\"'FIELD'\"></display-ref>\n                            </div>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.messageBinding || !node.data.displayData.messageBinding.valuesetBindings || node.data.displayData.messageBinding.valuesetBindings.length === 0) && (!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.valuesetBindings || node.data.displayData.segmentBinding.valuesetBindings.length === 0) && (!node.data.displayData.fieldDTbinding || !node.data.displayData.fieldDTbinding.valuesetBindings || node.data.displayData.fieldDTbinding.valuesetBindings.length === 0) && node.data.displayData.componentDTbinding\">\n                        <div *ngFor=\"let vs of node.data.displayData.componentDTbinding.valuesetBindings\">\n                            <div *ngIf=\"!vs.edit\">\n                                <display-ref [elm]=\"vs\" [from]=\"'COMPONENT'\"></display-ref>\n                            </div>\n                        </div>\n                    </div>\n                    <i class=\"fa fa-plus\" *ngIf=\"node.data.displayData.multipleValuesetAllowed || !node.data.displayData.messageBinding || !node.data.displayData.messageBinding.valuesetBindings || node.data.displayData.messageBinding.valuesetBindings.length == 0\" (click)=\"addNewValueSet(node)\"></i>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Single Code\" [style]=\"{'width':'200px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.valuesetAllowed && node.data.displayData.datatype.leaf && !node.data.displayData.hasValueSet\">\n                    <div *ngIf=\"node.data.displayData.messageBinding\">\n                        <div *ngIf=\"node.data.displayData.messageBinding.externalSingleCode\">\n                            <div *ngIf=\"!node.data.displayData.messageBinding.externalSingleCode.edit\">\n                                <display-singlecode [elm]=\"node.data.displayData.messageBinding.externalSingleCode\" [from]=\"'MESSAGE'\"></display-singlecode>\n                                <i class=\"fa fa-pencil\" (click)=\"makeEditModeForSingleCode(node)\" style=\"width:20%;\"></i>\n                                <i class=\"fa fa-times\" (click)=\"deleteSingleCode(node)\" style=\"width:20%;\"></i>\n                            </div>\n                            <div *ngIf=\"node.data.displayData.messageBinding.externalSingleCode.edit\">\n                                <input [(ngModel)]=\"node.data.displayData.messageBinding.externalSingleCode.newSingleCode\" type=\"text\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n                                <input [(ngModel)]=\"node.data.displayData.messageBinding.externalSingleCode.newSingleCodeSystem\" type=\"text\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n                                <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewSingleCode(node); node.data.displayData.hasSingleCode = true;\" [disabled]=\"node.data.displayData.messageBinding.externalSingleCode.newSingleCode === '' || node.data.displayData.messageBinding.externalSingleCode.newSingleCodeSystem === ''\"></button>\n                            </div>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.messageBinding || !node.data.displayData.messageBinding.externalSingleCode) && node.data.displayData.segmentBinding\">\n                        <div *ngIf=\"node.data.displayData.segmentBinding.externalSingleCode\">\n                            <display-singlecode [elm]=\"node.data.displayData.segmentBinding.externalSingleCode\" [from]=\"'SEGMENT'\"></display-singlecode>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.messageBinding || !node.data.displayData.messageBinding.externalSingleCode) && (!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.externalSingleCode) && node.data.displayData.fieldDTbinding\">\n                        <div *ngIf=\"node.data.displayData.fieldDTbinding.externalSingleCode\">\n                            <display-singlecode [elm]=\"node.data.displayData.fieldDTbinding.externalSingleCode\" [from]=\"'FIELD'\"></display-singlecode>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.messageBinding || !node.data.displayData.messageBinding.externalSingleCode) && (!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.externalSingleCode) && (!node.data.displayData.fieldDTbinding || !node.data.displayData.fieldDTbinding.externalSingleCode) && node.data.displayData.componentDTbinding\">\n                        <div *ngIf=\"node.data.displayData.componentDTbinding.externalSingleCode\">\n                            <display-singlecode [elm]=\"node.data.displayData.componentDTbinding.externalSingleCode\" [from]=\"'COMPONENT'\"></display-singlecode>\n                        </div>\n                    </div>\n                    <i class=\"fa fa-plus\" *ngIf=\"!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.externalSingleCode\" (click)=\"addNewSingleCode(node)\"></i>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Constant Value\" [style]=\"{'width':'200px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.datatype && node.data.displayData.datatype.leaf && !node.data.displayData.valuesetAllowed\">\n                    <div *ngIf=\"node.data.displayData.messageBinding\">\n                        <div *ngIf=\"!node.data.displayData.messageBinding.editConstantValue\">\n                            <div *ngIf=\"node.data.displayData.messageBinding.constantValue\">\n                                <display-constantvalue [elm]=\"node.data.displayData.messageBinding.constantValue\" [from]=\"'MESSAGE'\"></display-constantvalue>\n                                <i class=\"fa fa-pencil\" (click)=\"makeEditModeForConstantValue(node)\" style=\"width:20%;\"></i>\n                                <i class=\"fa fa-times\" (click)=\"deleteConstantValue(node)\" style=\"width:20%;\"></i>\n                            </div>\n                        </div>\n                        <div *ngIf=\"node.data.displayData.messageBinding.editConstantValue\">\n                            <input [(ngModel)]=\"node.data.displayData.messageBinding.newConstantValue\" type=\"text\" style=\"width:90%;border-width:0px 0px 1px 0px\"/>\n                            <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewConstantValue(node)\" [disabled]=\"node.data.displayData.messageBinding.newConstantValue === ''\"></button>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.messageBinding || !node.data.displayData.messageBinding.constantValue) && node.data.displayData.segmentBinding\">\n                        <div *ngIf=\"node.data.displayData.segmentBinding.constantValue !== undefined  && node.data.displayData.segmentBinding.constantValue !== ''\">\n                            <display-constantvalue [elm]=\"node.data.displayData.segmentBinding.constantValue\" [from]=\"'SEGMENT'\"></display-constantvalue>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.messageBinding || !node.data.displayData.messageBinding.constantValue) && (!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.constantValue) && node.data.displayData.fieldDTbinding\">\n                        <div *ngIf=\"node.data.displayData.fieldDTbinding.constantValue !== undefined  && node.data.displayData.fieldDTbinding.constantValue !== ''\">\n                            <display-constantvalue [elm]=\"node.data.displayData.fieldDTbinding.constantValue\" [from]=\"'FIELD'\"></display-constantvalue>\n                        </div>\n                    </div>\n                    <div *ngIf=\"(!node.data.displayData.messageBinding || !node.data.displayData.messageBinding.constantValue) && (!node.data.displayData.segmentBinding || !node.data.displayData.segmentBinding.constantValue) && (!node.data.displayData.fieldDTbinding || !node.data.displayData.fieldDTbinding.constantValue) && node.data.displayData.componentDTbinding\">\n                        <div *ngIf=\"node.data.displayData.componentDTbinding.constantValue  !== undefined && node.data.displayData.componentDTbinding.constantValue !== ''\">\n                            <display-constantvalue [elm]=\"node.data.displayData.componentDTbinding.constantValue\" [from]=\"'COMPONENT'\"></display-constantvalue>\n                        </div>\n                    </div>\n                    <div *ngIf=\"!node.data.displayData.messageBinding || !node.data.displayData.messageBinding.editConstantValue\">\n                        <i class=\"fa fa-plus\" *ngIf=\"!node.data.displayData.messageBinding || (node.data.displayData.messageBinding && !node.data.displayData.messageBinding.constantValue)\" (click)=\"addNewConstantValue(node)\"></i>\n                    </div>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Predicate\" [style]=\"{'width':'150px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.usage === 'C'\">\n                    <!--<div *ngIf=\"node.data.displayData.type === 'GROUP'\">-->\n                        <!--<div *ngIf=\"node.data.displayData.messageBinding && node.data.displayData.messageBinding.predicate && node.data.displayData.messageBinding.predicate.freeText\">-->\n                            <!--{{node.data.displayData.messageBinding.predicate.freeText}}-->\n                        <!--</div>-->\n                        <!--<div *ngIf=\"node.data.displayData.messageBinding && node.data.displayData.messageBinding.predicate && node.data.displayData.messageBinding.predicate.assertion && node.data.displayData.messageBinding.predicate.assertion.description\">-->\n                            <!--{{node.data.displayData.messageBinding.predicate.assertion.description}}-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <!--<div *ngIf=\"node.data.displayData.type === 'FIELD'\">-->\n                        <!--<div *ngIf=\"node.data.displayData.segmentBinding && node.data.displayData.segmentBinding.predicate && node.data.displayData.segmentBinding.predicate.freeText\">-->\n                            <!--{{node.data.displayData.segmentBinding.predicate.freeText}}-->\n                        <!--</div>-->\n                        <!--<div *ngIf=\"node.data.displayData.segmentBinding && node.data.displayData.segmentBinding.predicate && node.data.displayData.segmentBinding.predicate.assertion && node.data.displayData.segmentBinding.predicate.assertion.description\">-->\n                            <!--{{node.data.displayData.segmentBinding.predicate.assertion.description}}-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <!--<div *ngIf=\"node.data.displayData.type === 'COMPONENT'\">-->\n                        <!--<div *ngIf=\"node.data.displayData.fieldDTbinding && node.data.displayData.fieldDTbinding.predicate && node.data.displayData.fieldDTbinding.predicate.freeText\">-->\n                            <!--{{node.data.displayData.fieldDTbinding.predicate.freeText}}-->\n                        <!--</div>-->\n                        <!--<div *ngIf=\"node.data.displayData.fieldDTbinding && node.data.displayData.fieldDTbinding.predicate && node.data.displayData.fieldDTbinding.predicate.assertion && node.data.displayData.fieldDTbinding.predicate.assertion.description\">-->\n                            <!--{{node.data.displayData.fieldDTbinding.predicate.assertion.description}}-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <!--<div *ngIf=\"node.data.displayData.type === 'SUBCOMPONENT'\">-->\n                        <!--<div *ngIf=\"node.data.displayData.componentDTbinding && node.data.displayData.componentDTbinding.predicate && node.data.displayData.componentDTbinding.predicate.freeText\">-->\n                            <!--{{node.data.displayData.componentDTbinding.predicate.freeText}}-->\n                        <!--</div>-->\n                        <!--<div *ngIf=\"node.data.displayData.componentDTbinding && node.data.displayData.componentDTbinding.predicate && node.data.displayData.componentDTbinding.predicate.assertion && node.data.displayData.componentDTbinding.predicate.assertion.description\">-->\n                            <!--{{node.data.displayData.componentDTbinding.predicate.assertion.description}}-->\n                        <!--</div>-->\n                    <!--</div>-->\n                    <i class=\"fa fa-pencil\" (click)=\"editPredicate(node)\" style=\"width:20%;\"></i>\n                </div>\n            </ng-template>\n        </p-column>\n\n        <p-column header=\"Text Definition\" [style]=\"{'width':'150px'}\">\n            <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.type === 'GROUP' || node.data.displayData.type === 'SEGMENT'\">\n                    <ng-container *ngIf=\"node.data.text\">\n                        <span (click)=\"editTextDefinition(node)\">{{truncate(node.data.text)}}</span>\n                        <i class=\"fa fa-times\" (click)=\"delTextDefinition(node)\" style=\"width:20%;\"></i>\n                    </ng-container>\n                    <ng-container *ngIf=\"!node.data.text\">\n                        <i class=\"fa fa-pencil\" (click)=\"editTextDefinition(node)\"></i>\n                    </ng-container>\n                </div>\n            </ng-template>\n        </p-column>\n        <p-column header=\"Comment\" [style]=\"{'width':'400px'}\">\n            <ng-template let-node=\"rowData\" pTemplate=\"body\">\n                <div *ngIf=\"node.data.displayData.messageBinding\">\n                    <div *ngFor=\"let c of node.data.displayData.messageBinding.comments\">\n                        <div *ngIf=\"!c.edit\">\n                            <display-comment [elm]=\"c\" [from]=\"'MESSAGE'\"></display-comment>\n                            <i class=\"fa fa-pencil\" (click)=\"makeEditModeForComment(c)\" style=\"width:20%;\"></i>\n                            <i class=\"fa fa-times\" (click)=\"delCommentBinding(node.data.displayData.messageBinding, c)\" style=\"width:20%;\"></i>\n                        </div>\n                        <div *ngIf=\"c.edit\">\n                            <textarea pInputTextarea [(ngModel)]=\"c.newComment.description\"></textarea>\n                            <button pButton type=\"button\" class=\"blue-btn\" icon=\"fa-check\" (click)=\"submitNewComment(c);\" [disabled]=\"c.newComment.description === ''\"></button>\n                        </div>\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.segmentBinding\">\n                    <div *ngFor=\"let c of node.data.displayData.segmentBinding.comments\">\n                        <display-comment [elm]=\"c\" [from]=\"'SEGMENT'\"></display-comment>\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.fieldDTbinding\">\n                    <div *ngFor=\"let c of node.data.displayData.fieldDTbinding.comments\">\n                        <display-comment [elm]=\"c\" [from]=\"'FIELD'\"></display-comment>\n                    </div>\n                </div>\n                <div *ngIf=\"node.data.displayData.componentDTbinding\">\n                    <div *ngFor=\"let c of node.data.displayData.componentDTbinding.comments\">\n                        <display-comment [elm]=\"c\" [from]=\"'COMPONENT'\"></display-comment>\n                    </div>\n                </div>\n                <i class=\"fa fa-plus\" (click)=\"addNewComment(node)\"></i>\n            </ng-template>\n        </p-column>\n    </p-treeTable>\n    <p-dialog *ngIf=\"selectedNode\" header=\"Edit Text Definition of {{selectedNode.data.name}}\" [(visible)]=\"textDefinitionDialogOpen\" [modal]=\"true\" [responsive]=\"true\" [width]=\"350\" [minWidth]=\"200\" [minY]=\"70\">\n        <textarea pInputTextarea [(ngModel)]=\"selectedNode.data.text\"></textarea>\n    </p-dialog>\n\n    <p-dialog *ngIf=\"selectedNode\" header=\"Edit Predicate of {{selectedNode.data.name}}\" [(visible)]=\"preciateEditorOpen\" [modal]=\"true\" [responsive]=\"true\" [width]=\"1200\" [minWidth]=\"800\" [minY]=\"70\">\n        <form #cpForm=\"ngForm\">\n            <div class=\"ui-g ui-fluid\">\n                <div class=\"ui-g-12 ui-md-2\">\n                    <label>Editor Type: </label>\n                </div>\n                <div class=\"ui-g-12 ui-md-10\">\n                    <p-selectButton name=\"type\" [options]=\"constraintTypes\" [(ngModel)]=\"selectedPredicate.type\" (onChange)=\"changeType()\"></p-selectButton>\n                </div>\n            </div>\n\n            <div *ngIf=\"selectedPredicate.type && selectedPredicate.type ==='ASSERTION'\">\n                <div class=\"ui-g ui-fluid\">\n                    <div class=\"ui-g-12 ui-md-2\">\n                        <label>Assertion Type: </label>\n                    </div>\n                    <div class=\"ui-g-12 ui-md-10\">\n                        <p-dropdown id=\"assertionMode\" name=\"assertionMode\" required #assertionMode=\"ngModel\" [options]=\"assertionModes\" [(ngModel)]=\"selectedPredicate.assertion.mode\" (onChange)=\"changeAssertionMode()\"></p-dropdown>\n                        <div *ngIf=\"assertionMode.invalid && (assertionMode.dirty || assertionMode.touched)\" class=\"alert alert-danger\">\n                            <div *ngIf=\"assertionMode.errors.required\">\n                                Assertion Type is required.\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <edit-free-constraint *ngIf=\"selectedPredicate.type === 'FREE'\" [constraint]=\"selectedPredicate\"></edit-free-constraint>\n            <edit-simple-constraint *ngIf=\"selectedPredicate.assertion && selectedPredicate.assertion.mode === 'SIMPLE'\" [constraint]=\"selectedPredicate.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'rootSimple'\"></edit-simple-constraint>\n            <edit-complex-constraint *ngIf=\"selectedPredicate.assertion && selectedPredicate.assertion.mode === 'COMPLEX'\" [constraint]=\"selectedPredicate.assertion\" [idMap]=\"idMap\" [treeData]=\"treeData\" [groupName]=\"'root'\"></edit-complex-constraint>\n\n            <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-plus\" label=\"Submit\" (click)=\"submitCP()\" [disabled]=\"cpForm.invalid\"></button>\n            <button pButton style=\"float: right\" type=\"button\"  class=\"blue-btn\" icon=\"fa-print\" label=\"Print\" (click)=\"print(selectedConformanceStatement)\"></button>\n        </form>\n    </p-dialog>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-structure/conformanceprofile-edit-structure.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceprofileEditStructureComponent; });
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__service_conformance_profiles_conformance_profiles_service__ = __webpack_require__("../../../../../src/app/service/conformance-profiles/conformance-profiles.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__service_indexed_db_conformance_profiles_conformance_profiles_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/conformance-profiles/conformance-profiles-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__service_indexed_db_segments_segments_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/segments/segments-toc.service.ts");
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
















var ConformanceprofileEditStructureComponent = (function () {
    function ConformanceprofileEditStructureComponent(indexedDbService, route, router, configService, conformanceProfilesService, segmentsService, datatypesService, constraintsService, datatypesTocService, segmentsTocService, valuesetsTocService, conformanceProfilesTocService) {
        var _this = this;
        this.indexedDbService = indexedDbService;
        this.route = route;
        this.router = router;
        this.configService = configService;
        this.conformanceProfilesService = conformanceProfilesService;
        this.segmentsService = segmentsService;
        this.datatypesService = datatypesService;
        this.constraintsService = constraintsService;
        this.datatypesTocService = datatypesTocService;
        this.segmentsTocService = segmentsTocService;
        this.valuesetsTocService = valuesetsTocService;
        this.conformanceProfilesTocService = conformanceProfilesTocService;
        this.valuesetColumnWidth = '200px';
        this.textDefinitionDialogOpen = false;
        this.valuesetStrengthOptions = [];
        this.preciateEditorOpen = false;
        this.selectedPredicate = {};
        this.constraintTypes = [];
        this.assertionModes = [];
        this.datatypesLinks = [];
        this.datatypesOptions = [];
        this.segmentsLinks = [];
        this.segmentsOptions = [];
        this.valuesetsLinks = [];
        this.valuesetOptions = [{ label: 'Select ValueSet', value: null }];
        router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
            }
        });
    }
    ConformanceprofileEditStructureComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.usages = this.configService._usages;
        this.cUsages = this.configService._cUsages;
        this.valuesetStrengthOptions = this.configService._valuesetStrengthOptions;
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
        this.route.data.map(function (data) { return data.conformanceprofileStructure; }).subscribe(function (x) {
            console.log(x);
            _this.segmentsTocService.getAll().then(function (segTOCdata) {
                var listTocSegs = segTOCdata[0];
                for (var _i = 0, listTocSegs_1 = listTocSegs; _i < listTocSegs_1.length; _i++) {
                    var entry = listTocSegs_1[_i];
                    var treeObj = entry.data;
                    var segLink = {};
                    segLink.id = treeObj.key.id;
                    segLink.label = treeObj.label;
                    segLink.domainInfo = treeObj.domainInfo;
                    var index = treeObj.label.indexOf("_");
                    if (index > -1) {
                        segLink.name = treeObj.label.substring(0, index);
                        segLink.ext = treeObj.label.substring(index);
                        ;
                    }
                    else {
                        segLink.name = treeObj.label;
                        segLink.ext = null;
                    }
                    if (treeObj.lazyLoading)
                        segLink.leaf = false;
                    else
                        segLink.leaf = true;
                    _this.segmentsLinks.push(segLink);
                    var segOption = { label: segLink.label, value: segLink.id };
                    _this.segmentsOptions.push(segOption);
                }
                _this.datatypesTocService.getAll().then(function (dtTOCdata) {
                    var listTocDts = dtTOCdata[0];
                    for (var _i = 0, listTocDts_1 = listTocDts; _i < listTocDts_1.length; _i++) {
                        var entry = listTocDts_1[_i];
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
                        _this.datatypesOptions.push(dtOption);
                        _this.valuesetsTocService.getAll().then(function (valuesetTOCdata) {
                            var listTocVSs = valuesetTOCdata[0];
                            for (var _i = 0, listTocVSs_1 = listTocVSs; _i < listTocVSs_1.length; _i++) {
                                var entry_1 = listTocVSs_1[_i];
                                var treeObj = entry_1.data;
                                var valuesetLink = {};
                                valuesetLink.id = treeObj.key.id;
                                valuesetLink.label = treeObj.label;
                                valuesetLink.domainInfo = treeObj.domainInfo;
                                _this.valuesetsLinks.push(valuesetLink);
                                var vsOption = { label: valuesetLink.label, value: valuesetLink.id };
                                _this.valuesetOptions.push(vsOption);
                            }
                            _this.conformanceprofileStructure = {};
                            _this.conformanceprofileStructure.name = x.name;
                            _this.updateMessage(x.children, x.binding, null);
                            // this.updateDatatype(this.conformanceprofileStructure, x.children, x.binding, null, null, null, null, null, null);
                            _this.conformanceprofileStructure.children = x.children;
                            _this.backup = __WEBPACK_IMPORTED_MODULE_12_lodash__["cloneDeep"](_this.conformanceprofileStructure);
                        });
                    }
                });
            });
        });
    };
    ConformanceprofileEditStructureComponent.prototype.reset = function () {
        this.conformanceprofileStructure = __WEBPACK_IMPORTED_MODULE_12_lodash__["cloneDeep"](this.backup);
    };
    ConformanceprofileEditStructureComponent.prototype.getCurrent = function () {
        return this.conformanceprofileStructure;
    };
    ConformanceprofileEditStructureComponent.prototype.getBackup = function () {
        return this.backup;
    };
    ConformanceprofileEditStructureComponent.prototype.isValid = function () {
        return true;
    };
    ConformanceprofileEditStructureComponent.prototype.save = function () {
        return this.conformanceProfilesService.saveConformanceProfileStructure(this.conformanceprofileId, this.conformanceprofileStructure);
    };
    ConformanceprofileEditStructureComponent.prototype.updateMessage = function (children, currentBinding, parentFieldId) {
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var entry = children_1[_i];
            if (!entry.data.displayData)
                entry.data.displayData = {};
            entry.leaf = false;
            if (parentFieldId === null) {
                entry.data.displayData.idPath = entry.data.id;
            }
            else {
                entry.data.displayData.idPath = parentFieldId + '-' + entry.data.id;
            }
            if (entry.data.type === 'GROUP') {
                entry.data.displayData.type = 'GROUP';
                this.updateMessage(entry.children, currentBinding, entry.data.displayData.idPath);
            }
            else if (entry.data.type === 'SEGMENTREF') {
                entry.data.displayData.type = 'SEGMENT';
                entry.data.displayData.segment = this.getSegmentLink(entry.data.ref.id);
            }
        }
    };
    ConformanceprofileEditStructureComponent.prototype.updateDatatype = function (node, children, currentBinding, parentFieldId, fieldDT, messageBinding, segmentBinding, fieldDTbinding, parentDTId, parentDTName, segmentName, type) {
        for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
            var entry = children_2[_i];
            if (!entry.data.displayData)
                entry.data.displayData = {};
            entry.data.displayData.datatype = this.getDatatypeLink(entry.data.ref.id);
            entry.data.displayData.valuesetAllowed = this.configService.isValueSetAllow(entry.data.displayData.datatype.name, entry.data.position, parentDTName, segmentName, entry.data.displayData.type);
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
            if (type === 'FIELD') {
                entry.data.displayData.type = 'FIELD';
                // entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath, currentBinding);
                // if(entry.data.usage === 'C' && !entry.data.displayData.segmentBinding) {
                //     entry.data.displayData.segmentBinding = {};
                // }
                // if(entry.data.usage === 'C' && !entry.data.displayData.segmentBinding.predicate){
                //     entry.data.displayData.segmentBinding.predicate = {};
                // }
            }
            else if (type === 'COMPONENT') {
                entry.data.displayData.type = 'COMPONENT';
                entry.data.displayData.fieldDT = parentDTId;
                //     entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], segmentBinding);
                //     entry.data.displayData.fieldDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[1], currentBinding);
            }
            else if (type === 'SUBCOMPONENT') {
                entry.data.displayData.type = "SUBCOMPONENT";
                entry.data.displayData.fieldDT = fieldDT;
                entry.data.displayData.componentDT = parentDTId;
                // entry.data.displayData.segmentBinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], segmentBinding);
                // entry.data.displayData.fieldDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], fieldDTbinding);
                // entry.data.displayData.componentDTbinding = this.findBinding(entry.data.displayData.idPath.split("-")[2], currentBinding);
            }
            this.setHasSingleCode(entry.data.displayData);
            this.setHasValueSet(entry.data.displayData);
        }
        node.children = children;
    };
    ConformanceprofileEditStructureComponent.prototype.setHasSingleCode = function (displayData) {
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
    ConformanceprofileEditStructureComponent.prototype.setHasValueSet = function (displayData) {
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
    ConformanceprofileEditStructureComponent.prototype.getValueSetElm = function (id) {
        for (var _i = 0, _a = this.valuesetsLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            if (link.id === id)
                return link;
        }
        return null;
    };
    ConformanceprofileEditStructureComponent.prototype.getDatatypeElm = function (id) {
        for (var _i = 0, _a = this.datatypesLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            if (link.id === id)
                return link;
        }
        return null;
    };
    ConformanceprofileEditStructureComponent.prototype.addNewValueSet = function (node) {
        if (!node.data.displayData.segmentBinding)
            node.data.displayData.segmentBinding = [];
        if (!node.data.displayData.segmentBinding.valuesetBindings)
            node.data.displayData.segmentBinding.valuesetBindings = [];
        node.data.displayData.segmentBinding.valuesetBindings.push({ edit: true, newvalue: {} });
        this.valuesetColumnWidth = '500px';
    };
    ConformanceprofileEditStructureComponent.prototype.updateValueSetBindings = function (binding) {
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
    ConformanceprofileEditStructureComponent.prototype.findBinding = function (id, binding) {
        if (binding && binding.children) {
            for (var _i = 0, _a = binding.children; _i < _a.length; _i++) {
                var b = _a[_i];
                if (b.elementId === id)
                    return this.updateValueSetBindings(b);
            }
        }
        return null;
    };
    ConformanceprofileEditStructureComponent.prototype.delLength = function (node) {
        node.data.minLength = 'NA';
        node.data.maxLength = 'NA';
        node.data.confLength = '';
    };
    ConformanceprofileEditStructureComponent.prototype.delConfLength = function (node) {
        node.data.minLength = '';
        node.data.maxLength = '';
        node.data.confLength = 'NA';
    };
    ConformanceprofileEditStructureComponent.prototype.makeEditModeForDatatype = function (node) {
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
    ConformanceprofileEditStructureComponent.prototype.loadNode = function (event) {
        var _this = this;
        if (event.node && !event.node.children) {
            if (event.node.data.type === 'SEGMENTREF') {
                var segmentId = event.node.data.ref.id;
                this.segmentsService.getSegmentStructure(segmentId).then(function (structure) {
                    _this.updateDatatype(event.node, structure.children, structure.binding, event.node.data.displayData.idPath, null, event.node.data.displayData.messageBinding, null, null, null, null, structure.name, 'FIELD');
                });
            }
            else {
                var datatypeId = event.node.data.ref.id;
                this.datatypesService.getDatatypeStructure(datatypeId).then(function (structure) {
                    _this.updateDatatype(event.node, structure.children, structure.binding, event.node.data.displayData.idPath, datatypeId, event.node.data.displayData.messageBinding, event.node.data.displayData.segmentBinding, event.node.data.displayData.fieldDTBinding, event.node.data.displayData.fieldDT, event.node.data.displayData.datatype.name, null, event.node.data.displayData.type);
                });
            }
        }
    };
    ConformanceprofileEditStructureComponent.prototype.onDatatypeChange = function (node) {
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
    ConformanceprofileEditStructureComponent.prototype.makeEditModeForValueSet = function (vs) {
        vs.newvalue = {};
        vs.newvalue.valuesetId = vs.valuesetId;
        vs.newvalue.strength = vs.strength;
        vs.newvalue.valuesetLocations = vs.valuesetLocations;
        vs.edit = true;
        this.valuesetColumnWidth = '500px';
    };
    ConformanceprofileEditStructureComponent.prototype.makeEditModeForComment = function (c) {
        c.newComment = {};
        c.newComment.description = c.description;
        c.edit = true;
    };
    ConformanceprofileEditStructureComponent.prototype.addNewComment = function (node) {
        if (!node.data.displayData.segmentBinding)
            node.data.displayData.segmentBinding = [];
        if (!node.data.displayData.segmentBinding.comments)
            node.data.displayData.segmentBinding.comments = [];
        node.data.displayData.segmentBinding.comments.push({ edit: true, newComment: { description: '' } });
    };
    ConformanceprofileEditStructureComponent.prototype.addNewSingleCode = function (node) {
        if (!node.data.displayData.segmentBinding)
            node.data.displayData.segmentBinding = {};
        if (!node.data.displayData.segmentBinding.externalSingleCode)
            node.data.displayData.segmentBinding.externalSingleCode = {};
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCode = '';
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem = '';
        node.data.displayData.segmentBinding.externalSingleCode.edit = true;
    };
    ConformanceprofileEditStructureComponent.prototype.submitNewSingleCode = function (node) {
        node.data.displayData.segmentBinding.externalSingleCode.value = node.data.displayData.segmentBinding.externalSingleCode.newSingleCode;
        node.data.displayData.segmentBinding.externalSingleCode.codeSystem = node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem;
        node.data.displayData.segmentBinding.externalSingleCode.edit = false;
    };
    ConformanceprofileEditStructureComponent.prototype.makeEditModeForSingleCode = function (node) {
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCode = node.data.displayData.segmentBinding.externalSingleCode.value;
        node.data.displayData.segmentBinding.externalSingleCode.newSingleCodeSystem = node.data.displayData.segmentBinding.externalSingleCode.codeSystem;
        node.data.displayData.segmentBinding.externalSingleCode.edit = true;
    };
    ConformanceprofileEditStructureComponent.prototype.deleteSingleCode = function (node) {
        node.data.displayData.segmentBinding.externalSingleCode = null;
        node.data.displayData.hasSingleCode = false;
    };
    ConformanceprofileEditStructureComponent.prototype.addNewConstantValue = function (node) {
        if (!node.data.displayData.segmentBinding)
            node.data.displayData.segmentBinding = {};
        node.data.displayData.segmentBinding.constantValue = null;
        node.data.displayData.segmentBinding.newConstantValue = '';
        node.data.displayData.segmentBinding.editConstantValue = true;
        console.log(node);
    };
    ConformanceprofileEditStructureComponent.prototype.deleteConstantValue = function (node) {
        node.data.displayData.segmentBinding.constantValue = null;
        node.data.displayData.segmentBinding.editConstantValue = false;
    };
    ConformanceprofileEditStructureComponent.prototype.makeEditModeForConstantValue = function (node) {
        node.data.displayData.segmentBinding.newConstantValue = node.data.displayData.segmentBinding.constantValue;
        node.data.displayData.segmentBinding.editConstantValue = true;
    };
    ConformanceprofileEditStructureComponent.prototype.submitNewConstantValue = function (node) {
        node.data.displayData.segmentBinding.constantValue = node.data.displayData.segmentBinding.newConstantValue;
        node.data.displayData.segmentBinding.editConstantValue = false;
    };
    ConformanceprofileEditStructureComponent.prototype.submitNewValueSet = function (vs) {
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
    ConformanceprofileEditStructureComponent.prototype.submitNewComment = function (c) {
        c.description = c.newComment.description;
        c.dateupdated = new Date();
        c.edit = false;
    };
    ConformanceprofileEditStructureComponent.prototype.delValueSetBinding = function (binding, vs, node) {
        binding.valuesetBindings = __WEBPACK_IMPORTED_MODULE_8_underscore__["_"].without(binding.valuesetBindings, __WEBPACK_IMPORTED_MODULE_8_underscore__["_"].findWhere(binding.valuesetBindings, { valuesetId: vs.valuesetId }));
        this.setHasValueSet(node);
    };
    ConformanceprofileEditStructureComponent.prototype.delCommentBinding = function (binding, c) {
        binding.comments = __WEBPACK_IMPORTED_MODULE_8_underscore__["_"].without(binding.comments, __WEBPACK_IMPORTED_MODULE_8_underscore__["_"].findWhere(binding.comments, c));
    };
    ConformanceprofileEditStructureComponent.prototype.delTextDefinition = function (node) {
        node.data.text = null;
    };
    ConformanceprofileEditStructureComponent.prototype.getDatatypeLink = function (id) {
        for (var _i = 0, _a = this.datatypesLinks; _i < _a.length; _i++) {
            var dt = _a[_i];
            if (dt.id === id)
                return JSON.parse(JSON.stringify(dt));
        }
        console.log("Missing DT:::" + id);
        return null;
    };
    ConformanceprofileEditStructureComponent.prototype.getSegmentLink = function (id) {
        for (var _i = 0, _a = this.segmentsLinks; _i < _a.length; _i++) {
            var dt = _a[_i];
            if (dt.id === id)
                return JSON.parse(JSON.stringify(dt));
        }
        console.log("Missing SEG:::" + id);
        return null;
    };
    ConformanceprofileEditStructureComponent.prototype.getValueSetLink = function (id) {
        for (var _i = 0, _a = this.valuesetsLinks; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v.id === id)
                return JSON.parse(JSON.stringify(v));
        }
        console.log("Missing ValueSet:::" + id);
        return null;
    };
    ConformanceprofileEditStructureComponent.prototype.editTextDefinition = function (node) {
        this.selectedNode = node;
        this.textDefinitionDialogOpen = true;
    };
    ConformanceprofileEditStructureComponent.prototype.truncate = function (txt) {
        if (txt.length < 10)
            return txt;
        else
            return txt.substring(0, 10) + "...";
    };
    ConformanceprofileEditStructureComponent.prototype.print = function (data) {
        console.log(data);
    };
    ConformanceprofileEditStructureComponent.prototype.submitCP = function () {
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
    ConformanceprofileEditStructureComponent.prototype.changeType = function () {
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
    ConformanceprofileEditStructureComponent.prototype.changeAssertionMode = function () {
        if (this.selectedPredicate.assertion.mode == 'SIMPLE') {
            this.selectedPredicate.assertion = { mode: "SIMPLE" };
        }
        else if (this.selectedPredicate.assertion.mode == 'COMPLEX') {
            this.selectedPredicate.assertion = { mode: "COMPLEX" };
        }
    };
    ConformanceprofileEditStructureComponent.prototype.popChild = function (id, dtId, parentTreeNode) {
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
    ConformanceprofileEditStructureComponent.prototype.makeChild = function (data, id, para) {
        if (data.child)
            this.makeChild(data.child, id, para);
        else
            data.child = {
                elementId: id,
                instanceParameter: para
            };
    };
    ConformanceprofileEditStructureComponent.prototype.onUsageChange = function (node) {
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
    ], ConformanceprofileEditStructureComponent.prototype, "editForm", void 0);
    ConformanceprofileEditStructureComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-structure/conformanceprofile-edit-structure.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-structure/conformanceprofile-edit-structure.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"],
            __WEBPACK_IMPORTED_MODULE_3__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */],
            __WEBPACK_IMPORTED_MODULE_13__service_conformance_profiles_conformance_profiles_service__["a" /* ConformanceProfilesService */],
            __WEBPACK_IMPORTED_MODULE_4__service_segments_segments_service__["a" /* SegmentsService */],
            __WEBPACK_IMPORTED_MODULE_5__service_datatypes_datatypes_service__["a" /* DatatypesService */],
            __WEBPACK_IMPORTED_MODULE_7__service_constraints_constraints_service__["a" /* ConstraintsService */],
            __WEBPACK_IMPORTED_MODULE_9__service_indexed_db_datatypes_datatypes_toc_service__["a" /* DatatypesTocService */],
            __WEBPACK_IMPORTED_MODULE_15__service_indexed_db_segments_segments_toc_service__["a" /* SegmentsTocService */],
            __WEBPACK_IMPORTED_MODULE_10__service_indexed_db_valuesets_valuesets_toc_service__["a" /* ValuesetsTocService */],
            __WEBPACK_IMPORTED_MODULE_14__service_indexed_db_conformance_profiles_conformance_profiles_toc_service__["a" /* ConformanceProfilesTocService */]])
    ], ConformanceprofileEditStructureComponent);
    return ConformanceprofileEditStructureComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/conformanceprofile-edit/conformanceprofile-structure/conformanceprofile-edit-structure.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConformanceprofileEditStructureResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_conformance_profiles_conformance_profiles_service__ = __webpack_require__("../../../../../src/app/service/conformance-profiles/conformance-profiles.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ConformanceprofileEditStructureResolver = (function () {
    function ConformanceprofileEditStructureResolver(http, conformanceProfilesService) {
        this.http = http;
        this.conformanceProfilesService = conformanceProfilesService;
    }
    ConformanceprofileEditStructureResolver.prototype.resolve = function (route, rstate) {
        var conformanceprofileId = route.params["conformanceprofileId"];
        return this.conformanceProfilesService.getConformanceProfileStructure(conformanceprofileId);
    };
    ConformanceprofileEditStructureResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__service_conformance_profiles_conformance_profiles_service__["a" /* ConformanceProfilesService */]])
    ], ConformanceprofileEditStructureResolver);
    return ConformanceprofileEditStructureResolver;
}());



/***/ })

});
//# sourceMappingURL=conformanceprofile-edit.module.chunk.js.map