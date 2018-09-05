"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Jungyub on 10/26/17.
 */
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var underscore_1 = require("underscore");
var __ = require("lodash");
var EditSimpleMessageConstraintComponent = (function () {
    function EditSimpleMessageConstraintComponent(configService, datatypesService, segmentsService) {
        this.configService = configService;
        this.datatypesService = datatypesService;
        this.segmentsService = segmentsService;
        this.displayPicker = false;
    }
    EditSimpleMessageConstraintComponent.prototype.ngOnInit = function () {
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
        this.instanceNums = this.configService._instanceNums;
        this.operators = this.configService._operators;
        this.formatTypes = this.configService._formatTypes;
        this.simpleAssertionTypes = this.configService._simpleAssertionTypes;
    };
    EditSimpleMessageConstraintComponent.prototype.addValue = function () {
        if (!this.constraint.complement.values)
            this.constraint.complement.values = [];
        this.constraint.complement.values.push('');
    };
    EditSimpleMessageConstraintComponent.prototype.generateAssertionScript = function (constraint) {
        constraint.path1 = "OBX-4[" + constraint.instanceNum + "].1[1]";
        constraint.positionPath1 = "4[" + constraint.instanceNum + "].1[1]";
        constraint.assertionScript = "<PlainText Path=\"4[" + constraint.instanceNum + "].1[1]\" Text=\"AAAA\" IgnoreCase=\"false\"/>";
    };
    EditSimpleMessageConstraintComponent.prototype.openPathSelector = function (selectedHolder) {
        if (this.context) {
        }
        else {
            this.treeModel = [];
            this.popTreeModel(this.treeModel, this.structure, null, []);
        }
        this.selectedHolder = selectedHolder;
        this.displayPicker = true;
    };
    EditSimpleMessageConstraintComponent.prototype.popTreeModel = function (holderArray, list, parentId, parentDataArray) {
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var item = list_1[_i];
            if (item.type === 'SEGMENTREF') {
                var idPath = void 0;
                if (parentId)
                    idPath = parentId + ',' + item.id;
                else
                    idPath = item.id;
                var maxV = void 0;
                if (item.max && item.max !== 0 && item.max !== 1)
                    maxV = '[*]';
                else
                    maxV = '';
                var seg = {
                    "label": item.position + '. ' + this.getSegmentElm(item.ref.id).name + maxV,
                    "data": {
                        "id": item.id,
                        "idPath": idPath,
                        "type": 'SEGMENTREF',
                        "ref": item.ref,
                        "max": item.max,
                        "name": this.getSegmentElm(item.ref.id).name
                    },
                    "expandedIcon": "fa fa-folder-open",
                    "collapsedIcon": "fa fa-folder",
                    "leaf": false
                };
                var currentDataArray = __.cloneDeep(parentDataArray);
                currentDataArray.push(seg.data);
                seg.dataArray = currentDataArray;
                holderArray.push(seg);
            }
            else if (item.type === 'GROUP') {
                var idPath = void 0;
                if (parentId)
                    idPath = parentId + ',' + item.id;
                else
                    idPath = item.id;
                var maxV = void 0;
                if (item.max && item.max !== 0 && item.max !== 1)
                    maxV = '[*]';
                else
                    maxV = '';
                var group = {
                    "label": item.position + '. ' + item.name + maxV,
                    "data": {
                        "id": item.id,
                        "idPath": idPath,
                        "type": 'GROUP',
                        "max": item.max,
                        "name": item.name
                    },
                    "expandedIcon": "fa fa-folder-open",
                    "collapsedIcon": "fa fa-folder",
                    "children": [],
                    "leaf": false
                };
                var currentDataArray = __.cloneDeep(parentDataArray);
                currentDataArray.push(group.data);
                group.dataArray = currentDataArray;
                this.popTreeModel(group.children, item.children, group.data.idPath, group.dataArray);
                holderArray.push(group);
            }
            else if (item.data.type === 'FIELD') {
                var idPath = void 0;
                if (parentId)
                    idPath = parentId + ',' + item.data.id;
                else
                    idPath = item.data.id;
                var maxV = void 0;
                if (item.data.max && item.data.max !== 0 && item.data.max !== 1)
                    maxV = '[*]';
                else
                    maxV = '';
                var field = {
                    "label": item.data.position + '. ' + item.data.name + maxV,
                    "data": {
                        "id": item.data.id,
                        "idPath": idPath,
                        "ref": item.data.ref,
                        "type": 'FIELD',
                        "max": item.data.max,
                        "name": item.data.name
                    },
                    "expandedIcon": "fa fa-folder-open",
                    "collapsedIcon": "fa fa-folder",
                };
                var datatype = this.getDatatypeLink(field.data.ref.id);
                if (datatype.leaf)
                    field.leaf = true;
                else {
                    field.leaf = false;
                }
                var currentDataArray = __.cloneDeep(parentDataArray);
                currentDataArray.push(field.data);
                field.dataArray = currentDataArray;
                holderArray.push(field);
            }
            else if (item.data.type === 'COMPONENT') {
                var idPath = void 0;
                if (parentId)
                    idPath = parentId + ',' + item.data.id;
                else
                    idPath = item.data.id;
                var component = {
                    "label": item.data.position + '. ' + item.data.name,
                    "data": {
                        "id": item.data.id,
                        "idPath": idPath,
                        "ref": item.data.ref,
                        "type": 'COMPONENT',
                        "name": item.data.name
                    },
                    "expandedIcon": "fa fa-folder-open",
                    "collapsedIcon": "fa fa-folder"
                };
                var datatype = this.getDatatypeLink(component.data.ref.id);
                if (datatype.leaf)
                    component.leaf = true;
                else {
                    component.leaf = false;
                }
                var currentDataArray = __.cloneDeep(parentDataArray);
                currentDataArray.push(component.data);
                component.dataArray = currentDataArray;
                holderArray.push(component);
            }
        }
    };
    EditSimpleMessageConstraintComponent.prototype.getDatatypeLink = function (id) {
        for (var _i = 0, _a = this.datatypesLinks; _i < _a.length; _i++) {
            var dt = _a[_i];
            if (dt.id === id)
                return JSON.parse(JSON.stringify(dt));
        }
        console.log("Missing DT:::" + id);
        return null;
    };
    EditSimpleMessageConstraintComponent.prototype.getSegmentElm = function (id) {
        for (var _i = 0, _a = this.segmentsLinks; _i < _a.length; _i++) {
            var link = _a[_i];
            if (link.id === id)
                return link;
        }
        return null;
    };
    EditSimpleMessageConstraintComponent.prototype.loadNode = function (node) {
        var _this = this;
        if (node && !node.children) {
            if (node.data.type === 'SEGMENTREF') {
                this.segmentsService.getSegmentStructure(node.data.ref.id).then(function (structure) {
                    structure.children = underscore_1._.sortBy(structure.children, function (child) { return child.data.position; });
                    node.children = [];
                    _this.popTreeModel(node.children, structure.children, node.data.idPath, node.dataArray);
                });
            }
            else if (node.data.type === 'FIELD') {
                this.datatypesService.getDatatypeStructure(node.data.ref.id).then(function (structure) {
                    structure.children = underscore_1._.sortBy(structure.children, function (child) { return child.data.position; });
                    node.children = [];
                    _this.popTreeModel(node.children, structure.children, node.data.idPath, node.dataArray);
                });
            }
            else if (node.data.type === 'COMPONENT') {
                this.datatypesService.getDatatypeStructure(node.data.ref.id).then(function (structure) {
                    structure.children = underscore_1._.sortBy(structure.children, function (child) { return child.data.position; });
                    node.children = [];
                    _this.popTreeModel(node.children, structure.children, node.data.idPath, node.dataArray);
                });
            }
        }
    };
    EditSimpleMessageConstraintComponent.prototype.selectNode = function (node) {
        this.selectedHolder.dataArray = node.dataArray;
        this.displayPicker = false;
    };
    __decorate([
        core_1.Input()
    ], EditSimpleMessageConstraintComponent.prototype, "constraint", void 0);
    __decorate([
        core_1.Input()
    ], EditSimpleMessageConstraintComponent.prototype, "context", void 0);
    __decorate([
        core_1.Input()
    ], EditSimpleMessageConstraintComponent.prototype, "structure", void 0);
    __decorate([
        core_1.Input()
    ], EditSimpleMessageConstraintComponent.prototype, "ifVerb", void 0);
    __decorate([
        core_1.Input()
    ], EditSimpleMessageConstraintComponent.prototype, "groupName", void 0);
    __decorate([
        core_1.Input()
    ], EditSimpleMessageConstraintComponent.prototype, "segmentsLinks", void 0);
    __decorate([
        core_1.Input()
    ], EditSimpleMessageConstraintComponent.prototype, "datatypesLinks", void 0);
    EditSimpleMessageConstraintComponent = __decorate([
        core_1.Component({
            selector: 'edit-simple-message-constraint',
            templateUrl: './edit-simplemessageconstraint.component.html',
            styleUrls: ['./edit-simplemessageconstraint.component.css'],
            viewProviders: [{ provide: forms_1.ControlContainer, useExisting: forms_1.NgForm }]
        })
    ], EditSimpleMessageConstraintComponent);
    return EditSimpleMessageConstraintComponent;
}());
exports.EditSimpleMessageConstraintComponent = EditSimpleMessageConstraintComponent;
