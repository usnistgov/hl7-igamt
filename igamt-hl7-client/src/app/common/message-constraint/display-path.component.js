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
var DisplayPathComponent = (function () {
    function DisplayPathComponent(datatypesService, tocService) {
        this.datatypesService = datatypesService;
        this.tocService = tocService;
        this.displayPicker = false;
        this.datatypesLinks = [];
        this.datatypeOptions = [];
    }
    DisplayPathComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.tocService.getDataypeList().then(function (dtTOCdata) {
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
        });
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
        this.pathHolder.path = JSON.parse(JSON.stringify(event.node.data.pathData));
        this.displayPicker = false;
    };
    DisplayPathComponent.prototype.loadNode = function (event) {
        var _this = this;
        if (event.node && !event.node.children) {
            console.log(event.node.data);
            this.datatypesService.getDatatypeStructure(event.node.data.dtId).then(function (dtStructure) {
                dtStructure.children = underscore_1._.sortBy(dtStructure.children, function (child) { return child.data.position; });
                _this.idMap[event.node.data.idPath].dtName = dtStructure.name;
                if (dtStructure.children) {
                    for (var _i = 0, _a = dtStructure.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        var childData = JSON.parse(JSON.stringify(event.node.data.pathData));
                        _this.makeChild(childData, child.data.id, '1');
                        var data = {
                            id: child.data.id,
                            name: child.data.name,
                            max: "1",
                            position: child.data.position,
                            usage: child.data.usage,
                            dtId: child.data.ref.id,
                            idPath: event.node.data.idPath + '-' + child.data.id,
                            pathData: childData
                        };
                        var treeNode = {
                            label: child.data.position + '. ' + child.data.name,
                            data: data,
                            expandedIcon: "fa-folder-open",
                            collapsedIcon: "fa-folder",
                            leaf: false
                        };
                        var dt = _this.getDatatypeLink(child.data.ref.id);
                        if (dt.leaf)
                            treeNode.leaf = true;
                        else
                            treeNode.leaf = false;
                        _this.idMap[data.idPath] = data;
                        if (!event.node.children)
                            event.node.children = [];
                        event.node.children.push(treeNode);
                    }
                }
            });
        }
    };
    DisplayPathComponent.prototype.getDatatypeLink = function (id) {
        for (var _i = 0, _a = this.datatypesLinks; _i < _a.length; _i++) {
            var dt = _a[_i];
            if (dt.id === id)
                return JSON.parse(JSON.stringify(dt));
        }
        console.log("Missing DT:::" + id);
        return null;
    };
    DisplayPathComponent.prototype.makeChild = function (data, id, para) {
        if (data.child)
            this.makeChild(data.child, id, para);
        else
            data.child = {
                elementId: id,
                instanceParameter: para
            };
    };
    __decorate([
        core_1.Input()
    ], DisplayPathComponent.prototype, "parentPath", void 0);
    __decorate([
        core_1.Input()
    ], DisplayPathComponent.prototype, "path", void 0);
    __decorate([
        core_1.Input()
    ], DisplayPathComponent.prototype, "idMap", void 0);
    __decorate([
        core_1.Input()
    ], DisplayPathComponent.prototype, "treeData", void 0);
    __decorate([
        core_1.Input()
    ], DisplayPathComponent.prototype, "pathHolder", void 0);
    __decorate([
        core_1.Input()
    ], DisplayPathComponent.prototype, "groupName", void 0);
    DisplayPathComponent = __decorate([
        core_1.Component({
            selector: 'display-path',
            templateUrl: './display-path.component.html',
            styleUrls: ['./display-path.component.css'],
            viewProviders: [{ provide: forms_1.ControlContainer, useExisting: forms_1.NgForm }]
        })
    ], DisplayPathComponent);
    return DisplayPathComponent;
}());
exports.DisplayPathComponent = DisplayPathComponent;
