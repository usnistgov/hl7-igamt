"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Jungyub on 10/23/17.
 */
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
require("rxjs/add/operator/filter");
var underscore_1 = require("underscore");
var __ = require("lodash");
var ConformanceprofileEditConformancestatementsComponent = (function () {
    function ConformanceprofileEditConformancestatementsComponent(route, router, configService, conformanceProfilesService, segmentsService, datatypesService, constraintsService, tocService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.configService = configService;
        this.conformanceProfilesService = conformanceProfilesService;
        this.segmentsService = segmentsService;
        this.datatypesService = datatypesService;
        this.constraintsService = constraintsService;
        this.tocService = tocService;
        this.segmentsLinks = [];
        this.segmentsOptions = [];
        this.datatypesLinks = [];
        this.datatypeOptions = [];
        this.valuesetsLinks = [];
        this.valuesetOptions = [{ label: 'Select ValueSet', value: null }];
        this.valuesetStrengthOptions = [];
        this.listTab = true;
        this.editorTab = false;
        this.selectContextDialog = false;
        this.selectedConformanceStatement = {};
        this.constraintTypes = [];
        this.assertionModes = [];
        this.contextTreeModel = [];
        router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
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
        this.usages = this.configService._usages;
        this.cUsages = this.configService._cUsages;
        this.constraintTypes = this.configService._constraintTypes;
        this.assertionModes = this.configService._assertionModes;
        this.valuesetStrengthOptions = this.configService._valuesetStrengthOptions;
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(function (data) { return data.conformanceprofileConformanceStatements; }).subscribe(function (x) {
            _this.tocService.getSegmentsList().then(function (segTOCdata) {
                var listTocSEGs = segTOCdata;
                for (var _i = 0, listTocSEGs_1 = listTocSEGs; _i < listTocSEGs_1.length; _i++) {
                    var entry = listTocSEGs_1[_i];
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
                    _this.segmentsLinks.push(segLink);
                    var segOption = { label: segLink.label, value: segLink.id };
                    _this.segmentsOptions.push(segOption);
                }
                _this.tocService.getDataypeList().then(function (dtTOCdata) {
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
                    _this.tocService.getValueSetList().then(function (valuesetTOCdata) {
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
                        _this.sortStructure(x);
                        _this.backup = x;
                        _this.conformanceprofileConformanceStatements = __.cloneDeep(_this.backup);
                    });
                });
            });
        });
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.sortStructure = function (x) {
        x.children = underscore_1._.sortBy(x.children, function (child) { return child.position; });
        for (var _i = 0, _a = x.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.children)
                this.sortStructure(child);
        }
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.selectCS = function (cs) {
        this.selectedConformanceStatement = JSON.parse(JSON.stringify(cs));
        this.editorTab = true;
        this.listTab = false;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.deleteCS = function (identifier) {
        this.conformanceprofileConformanceStatements.conformanceStatements = underscore_1._.without(this.conformanceprofileConformanceStatements.conformanceStatements, underscore_1._.findWhere(this.conformanceprofileConformanceStatements.conformanceStatements, { identifier: identifier }));
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.onTabOpen = function (e) {
        if (e.index === 0)
            this.selectedConformanceStatement = {};
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.submitCS = function () {
        // if(this.selectedConformanceStatement.type === 'ASSERTION') this.constraintsService.generateDescriptionForSimpleAssertion(this.selectedConformanceStatement.assertion, this.idMap);
        this.deleteCS(this.selectedConformanceStatement.identifier);
        this.conformanceprofileConformanceStatements.conformanceStatements.push(this.selectedConformanceStatement);
        this.selectedConformanceStatement = {};
        this.editorTab = false;
        this.listTab = true;
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
    ConformanceprofileEditConformancestatementsComponent.prototype.addNewCS = function () {
        this.selectedConformanceStatement = {};
        this.editorTab = true;
        this.listTab = false;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.changeAssertionMode = function () {
        if (this.selectedConformanceStatement.assertion.mode == 'SIMPLE') {
            this.selectedConformanceStatement.assertion = { mode: "SIMPLE" };
        }
        else if (this.selectedConformanceStatement.assertion.mode === 'ANDOR') {
            this.selectedConformanceStatement.assertion.child = undefined;
            this.selectedConformanceStatement.assertion.ifAssertion = undefined;
            this.selectedConformanceStatement.assertion.thenAssertion = undefined;
            this.selectedConformanceStatement.assertion.operator = 'AND';
            this.selectedConformanceStatement.assertion.assertions = [];
            this.selectedConformanceStatement.assertion.assertions.push({
                "mode": "SIMPLE"
            });
            this.selectedConformanceStatement.assertion.assertions.push({
                "mode": "SIMPLE"
            });
        }
        else if (this.selectedConformanceStatement.assertion.mode === 'NOT') {
            this.selectedConformanceStatement.assertion.assertions = undefined;
            this.selectedConformanceStatement.assertion.ifAssertion = undefined;
            this.selectedConformanceStatement.assertion.thenAssertion = undefined;
            this.selectedConformanceStatement.assertion.child = {
                "mode": "SIMPLE"
            };
        }
        else if (this.selectedConformanceStatement.assertion.mode === 'IFTHEN') {
            this.selectedConformanceStatement.assertion.assertions = undefined;
            this.selectedConformanceStatement.assertion.child = undefined;
            this.selectedConformanceStatement.assertion.ifAssertion = {
                "mode": "SIMPLE"
            };
            this.selectedConformanceStatement.assertion.thenAssertion = {
                "mode": "SIMPLE"
            };
        }
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.openDialogSelectContext = function () {
        this.contextTreeModel = [
            {
                "label": this.conformanceprofileConformanceStatements.name,
                "data": { idPath: null, type: 'MESSAGE' },
                "expandedIcon": "fa fa-folder-open",
                "collapsedIcon": "fa fa-folder",
                "children": []
            }
        ];
        this.popTreeModel(this.contextTreeModel[0], this.conformanceprofileConformanceStatements.children);
        this.selectContextDialog = true;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.selectContext = function (idPath) {
        this.selectedConformanceStatement.contextLocation = idPath;
        this.selectContextDialog = false;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.popTreeModel = function (parent, list) {
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var item = list_1[_i];
            var idPath = void 0;
            if (parent.data.idPath)
                idPath = parent.data.idPath + ',' + item.id;
            else
                idPath = item.id;
            if (item.type === 'SEGMENTREF') {
                parent.children.push({
                    "label": item.position + '. ' + this.getSegmentElm(item.ref.id).name,
                    "data": { "idPath": idPath, "type": 'SEGMENTREF' },
                    "expandedIcon": "fa fa-folder-open",
                    "collapsedIcon": "fa fa-folder"
                });
            }
            else if (item.type === 'GROUP') {
                var group = {
                    "label": item.position + '. ' + item.name,
                    "data": { idPath: idPath, type: 'GROUP' },
                    "expandedIcon": "fa fa-folder-open",
                    "collapsedIcon": "fa fa-folder",
                    "children": []
                };
                this.popTreeModel(group, item.children);
                parent.children.push(group);
            }
        }
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.showContext = function (context) {
        if (context) {
            return this.findContext(context, this.conformanceprofileConformanceStatements.children, this.conformanceprofileConformanceStatements.name);
        }
        return this.conformanceprofileConformanceStatements.name;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.findContext = function (context, list, result) {
        var res = context.split(",");
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var item = list_2[_i];
            if (item.id === res[0]) {
                if (res.length === 1) {
                    return result + '-' + '[' + item.position + ']' + item.name;
                }
                else if (res.length > 1) {
                    res.shift();
                    return this.findContext(res.toString(), item.children, result + '-' + '[' + item.position + ']' + item.name);
                }
            }
        }
        return "NOT FOUND";
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.getSegmentElm = function (id) {
        for (var _i = 0, _a = this.segmentsLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            if (link.id === id)
                return link;
        }
        return null;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.reset = function () {
        this.conformanceprofileConformanceStatements = __.cloneDeep(this.backup);
        this.editForm.control.markAsPristine();
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.getCurrent = function () {
        return this.conformanceprofileConformanceStatements;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.getBackup = function () {
        return this.backup;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.isValid = function () {
        return !this.editForm.invalid;
    };
    ConformanceprofileEditConformancestatementsComponent.prototype.save = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.conformanceProfilesService.saveConformanceProfileConformanceStatements(_this.conformanceprofileId, _this.conformanceprofileConformanceStatements).then(function (saved) {
                _this.backup = __.cloneDeep(_this.conformanceprofileConformanceStatements);
                _this.editForm.control.markAsPristine();
                resolve(true);
            }, function (error) {
                console.log("error saving");
                reject();
            });
        });
    };
    __decorate([
        core_1.ViewChild('editForm')
    ], ConformanceprofileEditConformancestatementsComponent.prototype, "editForm", void 0);
    ConformanceprofileEditConformancestatementsComponent = __decorate([
        core_1.Component({
            templateUrl: './conformanceprofile-edit-conformancestatements.component.html',
            styleUrls: ['./conformanceprofile-edit-conformancestatements.component.css']
        })
    ], ConformanceprofileEditConformancestatementsComponent);
    return ConformanceprofileEditConformancestatementsComponent;
}());
exports.ConformanceprofileEditConformancestatementsComponent = ConformanceprofileEditConformancestatementsComponent;
