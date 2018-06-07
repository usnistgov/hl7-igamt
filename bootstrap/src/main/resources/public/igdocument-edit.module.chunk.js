webpackJsonp(["igdocument-edit.module"],{

/***/ "../../../../../src/app/common/prime-ng-adapters/prime-dialog-adapter.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PrimeDialogAdapter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs__);
/**
 * Created by hnt5 on 10/5/17.
 */

var PrimeDialogAdapter = (function () {
    function PrimeDialogAdapter() {
    }
    PrimeDialogAdapter.prototype.open = function (data) {
        var _this = this;
        this.initResolvedData(data);
        this.onDialogOpen();
        this._visible = true;
        this.result$ = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.result$.subscribe(function (complete) {
            _this._visible = false;
        });
        return this.result$;
    };
    PrimeDialogAdapter.prototype.hook = function (parent) {
        this.parent = parent;
    };
    PrimeDialogAdapter.prototype.initResolvedData = function (data) {
        for (var k in data) {
            if (data.hasOwnProperty(k) && this.parent.hasOwnProperty(k)) {
                this.parent[k] = data[k];
            }
        }
    };
    PrimeDialogAdapter.prototype.dismissWithNoData = function () {
        this.result$.complete();
    };
    PrimeDialogAdapter.prototype.dismissWithData = function (result) {
        this.result$.next(result);
        this.result$.complete();
    };
    return PrimeDialogAdapter;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/add-conformance-profile/add-conformance-profile.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/add-conformance-profile/add-conformance-profile.component.html":
/***/ (function(module, exports) {

module.exports = "<p-dialog [(visible)]=\"_visible\">\n    <p-header>\n      Add Conformance Profile\n    </p-header>\n  <div>\n    <label class=\"metadata-label\"> Select Hl7 Version</label>\n\n\n    <p-radioButton [style]=\"{'margin-left':'10px'}\" *ngFor=\"let v of hl7Versions\" name=\"{{v}}\" value=\"{{v}}\" label=\"{{v}}\" [(ngModel)]=\"selcetedVersion\" (click)=\"getMessages(v)\">\n\n    </p-radioButton>\n  </div>\n\n  <div>\n    <ng-container *ngFor=\"let selected of getSelected()\">\n\n      <label class=\"badge cp-badge\" (click)=\"unselect(selected)\" *ngIf=\"!selected.children\">\n        <span style=\"background-color: red; border-radius: 25%\" class=\"mini-badge\">{{selected.parent.data.hl7Version}}</span>    {{selected.data.name}}-{{selected.data.parentStructId}}\n        <i class=\"fa fa-remove cp-remove\"></i>\n      </label>\n\n    </ng-container>\n  </div>\n\n  <p-treeTable *ngIf=\"selcetedVersion\" [value]=\"tableValue\"  selectionMode=\"checkbox\" [(selection)]=\"selectdNodeMap[selectedVerion]\" [style]=\"{'margin-top':'10px', 'max-height':'400px', 'overflow':'scroll'}\">\n    <p-column  header=\"Name\">\n      <ng-template let-node=\"rowData\" pTemplate=\"body\">\n        <span *ngIf=\"node.data.type=='EVENTS'\"> {{node.data.name}}</span>\n\n      </ng-template>\n    </p-column>\n    <p-column  header=\"Event Types\">\n      <ng-template let-node=\"rowData\" pTemplate=\"body\">\n        <span *ngIf=\"node.data.type=='EVENT' \"> {{node.data.name}}</span>\n      </ng-template>\n    </p-column>\n    <p-column  header=\"Description\">\n      <ng-template let-node=\"rowData\" pTemplate=\"body\">\n        {{node.data.description}}\n      </ng-template>\n    </p-column>\n  </p-treeTable>\n\n  <p-footer>\n    <p-button    styleClass=\"green-btn\" (onClick)=\"addMessages()\" label=\"Submit\" icon=\"fa fa-check\" iconPos=\"left\"></p-button>\n  </p-footer>\n\n</p-dialog>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/add-conformance-profile/add-conformance-profile.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddConformanceProfileComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__igdocument_edit_service_adding_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/adding.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_prime_ng_adapters_prime_dialog_adapter__ = __webpack_require__("../../../../../src/app/common/prime-ng-adapters/prime-dialog-adapter.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AddConformanceProfileComponent = (function (_super) {
    __extends(AddConformanceProfileComponent, _super);
    function AddConformanceProfileComponent(addingService, router, route, ws) {
        var _this = _super.call(this) || this;
        _this.addingService = addingService;
        _this.router = router;
        _this.route = route;
        _this.ws = ws;
        _this.tableValueMap = {};
        _this.loading = false;
        _this.uploadedFiles = [];
        _this.activeIndex = 0;
        _this.blockUI = false;
        _this.metaData = {};
        _this.selectdNodeMap = {};
        _this.msgEvts = [];
        _this.selcetedVersion = null;
        _this.hl7Versions = ws.getAppConstant().hl7Versions;
        return _this;
    }
    AddConformanceProfileComponent.prototype.ngOnInit = function () {
        // Mandatory
        _super.prototype.hook.call(this, this);
    };
    AddConformanceProfileComponent.prototype.onDialogOpen = function () {
        // Init code
    };
    AddConformanceProfileComponent.prototype.close = function () {
        this.dismissWithNoData();
    };
    AddConformanceProfileComponent.prototype.closeWithData = function (data) {
        this.dismissWithData(data);
    };
    AddConformanceProfileComponent.prototype.getMessages = function (v) {
        var _this = this;
        this.tableValue = [];
        this.selectedVerion = v;
        console.log(v);
        if (this.tableValueMap[v]) {
            this.tableValue = this.tableValueMap[this.selectedVerion];
            if (this.selectdNodeMap[v]) {
                this.selectdNodeMap[this.selcetedVersion] = this.selectdNodeMap[v];
            }
        }
        else {
            this.addingService.getMessagesByVersion(v).subscribe(function (x) {
                console.log(_this.selectedVerion);
                _this.tableValue = x;
                _this.tableValueMap[_this.selectedVerion] = _this.tableValue;
                _this.selectdNodeMap[_this.selectedVerion] = _this.selectdNodeMap[_this.selcetedVersion];
            });
        }
    };
    AddConformanceProfileComponent.prototype.nodeSelect = function (event) {
        console.log(event);
    };
    ;
    AddConformanceProfileComponent.prototype.toggle = function (node) {
        if (node.data.checked) {
            this.addNode(node);
        }
        else {
            this.removeNode(node);
        }
    };
    ;
    AddConformanceProfileComponent.prototype.addNode = function (node) {
        console.log("Add Node");
        console.log(node);
    };
    ;
    AddConformanceProfileComponent.prototype.removeNode = function (node) {
        console.log("Remove");
        console.log(node);
    };
    ;
    AddConformanceProfileComponent.prototype.addMessages = function () {
        var _this = this;
        var wrapper = {};
        this.blockUI = true;
        var versions = Object.keys(this.selectdNodeMap);
        for (var i = 0; i < versions.length; i++) {
            var version = versions[i];
            console.log(this.selectdNodeMap[version]);
            for (var j = 0; j < this.selectdNodeMap[version].length; j++) {
                this.selectNode(this.selectdNodeMap[version][j]);
            }
        }
        ;
        wrapper.msgEvts = this.msgEvts;
        wrapper.id = this.id;
        this.blockUI = true;
        this.addingService.addMessages(wrapper).subscribe(function (res) {
            console.log(res);
            _this.closeWithData(res);
            _this.blockUI = false;
        });
    };
    ;
    AddConformanceProfileComponent.prototype.goTo = function (res) {
        var _this = this;
        this.route.queryParams
            .subscribe(function (params) {
            var link = "/ig/" + res.id;
            _this.loading = false;
            _this.router.navigate([link], params); // add the parameters to the end
        });
    };
    AddConformanceProfileComponent.prototype.print = function (obj) {
        console.log(obj);
        // this.submitEvent();
        // this.getMessages();
    };
    AddConformanceProfileComponent.prototype.selectEvent = function (event) {
        this.selectNode(event.node);
    };
    AddConformanceProfileComponent.prototype.selectNode = function (node) {
        if (node.children && node.children.length > 0) {
        }
        else {
            this.msgEvts.push(node.data);
        }
    };
    AddConformanceProfileComponent.prototype.unselectEvent = function (event) {
        this.unselectNode(event.node);
    };
    AddConformanceProfileComponent.prototype.unselectNode = function (node) {
        if (node.children && node.children.length > 0) {
            for (var i = 0; i < node.children.length; i++) {
                this.unselectdata(node.children[i].data);
            }
        }
        else {
            this.unselectdata(node.data);
        }
    };
    ;
    AddConformanceProfileComponent.prototype.unselectdata = function (data) {
        var index = this.msgEvts.indexOf(data);
        if (index > -1) {
            this.msgEvts.splice(index, 1);
        }
    };
    AddConformanceProfileComponent.prototype.next = function (ev) {
        console.log("call next");
        this.activeIndex = 1;
    };
    AddConformanceProfileComponent.prototype.previous = function (ev) {
        console.log("call previous");
        this.activeIndex = 0;
    };
    AddConformanceProfileComponent.prototype.unselect = function (selected) {
        console.log(selected);
        var index = this.selectdNodeMap[this.selcetedVersion].indexOf(selected);
        if (index > -1) {
            this.selectdNodeMap[this.selcetedVersion].splice(index, 1);
            if (selected.parent) {
                this.unselectParent(selected.parent);
            }
        }
    };
    AddConformanceProfileComponent.prototype.unselectParent = function (parent) {
        parent.partialSelected = this.getPartialSelection(parent);
        console.log(parent.partialSelected);
        this.unselect(parent);
    };
    AddConformanceProfileComponent.prototype.getPartialSelection = function (parent) {
        for (var i = 0; i < parent.children.length; i++) {
            if (this.selectdNodeMap[this.selcetedVersion].indexOf(parent.children[i]) > -1) {
                return true;
            }
        }
        return false;
    };
    AddConformanceProfileComponent.prototype.getSelected = function () {
        var ret = [];
        var versions = Object.keys(this.selectdNodeMap);
        if (versions.length > 0) {
            for (var i = 0; i < versions.length; i++) {
                var version = versions[i];
                if (this.selectdNodeMap[version]) {
                    for (var j = 0; j < this.selectdNodeMap[version].length; j++) {
                        if (this.selectdNodeMap[version][j].parent) {
                            ret.push(this.selectdNodeMap[version][j]);
                        }
                    }
                }
            }
            ;
        }
        return ret;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], AddConformanceProfileComponent.prototype, "id", void 0);
    AddConformanceProfileComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-add-conformance-profile',
            template: __webpack_require__("../../../../../src/app/igdocuments/add-conformance-profile/add-conformance-profile.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/add-conformance-profile/add-conformance-profile.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__igdocument_edit_service_adding_service__["a" /* IgDocumentAddingService */],
            __WEBPACK_IMPORTED_MODULE_2__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_2__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["a" /* WorkspaceService */]])
    ], AddConformanceProfileComponent);
    return AddConformanceProfileComponent;
}(__WEBPACK_IMPORTED_MODULE_4__common_prime_ng_adapters_prime_dialog_adapter__["a" /* PrimeDialogAdapter */]));



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/add-datatype/add-datatype.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/add-datatype/add-datatype.component.html":
/***/ (function(module, exports) {

module.exports = "<p-dialog [(visible)]=\"_visible\">\n  <p-header>\n    Add Data Types\n  </p-header>\n  <div class=\"ui-g\">\n\n    <label class=\"metadata-label\"> Select Hl7 Version</label>\n\n\n    <p-radioButton [style]=\"{'margin-left':'10px'}\" *ngFor=\"let v of hl7Versions\" name=\"{{v}}\" value=\"{{v}}\" label=\"{{v}}\" [(ngModel)]=\"selcetedVersion\" (click)=\"getSource(v)\">\n\n    </p-radioButton>\n\n\n\n\n  </div>\n\n  <div class=\"ui-g\">\n    <div class=\"ui-g-6\">\n\n      <p-table #tt *ngIf=\"sources\"  [value]=\"sources\" sortField=\"name\" sortMode=\"single\" [scrollable]=\"true\" scrollHeight=\"200px\" [resizableColumns]=\"true\"  [globalFilterFields]=\"['name','description']\" >\n\n        <ng-template pTemplate=\"caption\">\n          <i class=\"fa fa-search\" style=\"margin:4px 4px 0 0\"></i>\n          <input type=\"text\" pInputText size=\"50\" placeholder=\"Global Filter\" (input)=\"tt.filterGlobal($event.target.value, 'contains')\" style=\"width:auto\">\n        </ng-template>\n        <ng-template pTemplate=\"header\">\n          <tr>\n            <th pResizableColumn width=\"250px\">\n              Data Type\n            </th>\n            <th pResizableColumn width=\"75px\">\n              As Is\n            </th>\n            <th pResizableColumn width=\"75px\">\n              As Flavor\n            </th>\n          </tr>\n        </ng-template>\n        <ng-template pTemplate=\"body\" let-rowData>\n          <tr>\n            <td class=\"ui-resizable-column\" width=\"250px\">\n\n       <span class=\"badge label-HL7\" >\n\n        HL7 {{rowData.domainInfo.version}}</span> {{rowData.name}}--{{rowData.description}}\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <button type=\"button\" icon=\"fa-plus\" pButton (click)=\"addAsIs(rowData)\"></button>\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <button type=\"button\" icon=\"fa-plus\" pButton (click)=\"addAsFlavor(rowData)\"></button>\n            </td>\n          </tr>\n        </ng-template>\n      </p-table>\n\n    </div>\n    <div class=\"ui-g-6\">\n\n      <p-table #dst  [value]=\"dest\" sortField=\"name\" sortMode=\"single\" [scrollable]=\"true\" scrollHeight=\"200px\" [resizableColumns]=\"true\"  [globalFilterFields]=\"['name','description']\" >\n\n        <ng-template pTemplate=\"caption\">\n          <i class=\"fa fa-search\" style=\"margin:4px 4px 0 0\"></i>\n          <input type=\"text\" pInputText size=\"50\" placeholder=\"Global Filter\" (input)=\"dst.filterGlobal($event.target.value, 'contains')\" style=\"width:auto\">\n        </ng-template>\n        <ng-template pTemplate=\"header\">\n          <tr>\n            <th pResizableColumn width=\"250px\">\n              Data Type\n            </th>\n            <th pResizableColumn width=\"75px\">\n              Extension\n            </th>\n            <th pResizableColumn width=\"75px\">\n              Actions\n            </th>\n          </tr>\n        </ng-template>\n        <ng-template pTemplate=\"body\" let-rowData>\n          <tr>\n            <td class=\"ui-resizable-column\" width=\"250px\">\n\n       <span class=\"badge\"  [ngClass]=\"{'label-HL7' : getScopeLabel(rowData)==='HL7', 'label-USE': getScopeLabel(rowData)==='USR','label-MASTER':getScopeLabel(rowData)==='MAS','label-PRL':getScopeLabel(rowData)==='PRL','label-PVS':getScopeLabel(rowData)==='PVS'}\">\n\n       {{getScopeLabel(rowData)}} {{rowData.domainInfo.version}}</span>\n              {{rowData.name}}--{{rowData.description}}\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <input *ngIf=\"rowData.flavor\" type=\"text\" style=\"width: 100%\" pInputText [(ngModel)]=\"rowData.ext\"/>\n\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <button type=\"button\" icon=\"fa-remove\" (click)=\"remove(rowData)\" pButton class=\"ui-button-danger\"></button>\n            </td>\n          </tr>\n        </ng-template>\n      </p-table>\n    </div>\n\n\n  </div>\n\n\n  <p-footer>\n    <p-button    styleClass=\"green-btn\" (onClick)=\"submit()\" label=\"Submit\" icon=\"fa fa-check\" iconPos=\"left\"></p-button>\n  </p-footer>\n\n</p-dialog>\n\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/add-datatype/add-datatype.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddDatatypeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_prime_ng_adapters_prime_dialog_adapter__ = __webpack_require__("../../../../../src/app/common/prime-ng-adapters/prime-dialog-adapter.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__igdocument_edit_service_adding_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/adding.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AddDatatypeComponent = (function (_super) {
    __extends(AddDatatypeComponent, _super);
    function AddDatatypeComponent(addingService, router, route, ws) {
        var _this = _super.call(this) || this;
        _this.addingService = addingService;
        _this.router = router;
        _this.route = route;
        _this.ws = ws;
        _this.id = "";
        _this.dest = [];
        _this.namingIndicators = [];
        _this.hl7Versions = ws.getAppConstant().hl7Versions;
        return _this;
    }
    AddDatatypeComponent.prototype.ngOnInit = function () {
        // Mandatory
        _super.prototype.hook.call(this, this);
    };
    AddDatatypeComponent.prototype.onDialogOpen = function () {
        // Init code
        this.sources = [];
        this.dest = [];
    };
    AddDatatypeComponent.prototype.close = function () {
        this.dismissWithNoData();
    };
    AddDatatypeComponent.prototype.closeWithData = function (data) {
        this.dismissWithData(data);
    };
    AddDatatypeComponent.prototype.getSource = function (version) {
        var _this = this;
        console.log(this.namingIndicators);
        this.addingService.getHl7DatatypesByVersion(version).subscribe(function (x) {
            _this.sources = x;
        });
    };
    AddDatatypeComponent.prototype.addAsIs = function (elm) {
        var copy = __WEBPACK_IMPORTED_MODULE_5_lodash__["cloneDeep"](elm);
        var x = {};
        x.domainInfo = copy.domainInfo;
        x.name = copy.name;
        x.flavor = false;
        x.description = copy.description;
        x.id = copy.id;
        this.dest.push(x);
    };
    AddDatatypeComponent.prototype.addAsFlavor = function (elm) {
        var x = {};
        var copy = __WEBPACK_IMPORTED_MODULE_5_lodash__["cloneDeep"](elm);
        x.domainInfo = copy.domainInfo;
        x.domainInfo.scope = "USER";
        x.name = copy.name;
        x.ext = "";
        x.flavor = true;
        x.description = copy.description;
        x.id = copy.id;
        this.dest.push(x);
    };
    AddDatatypeComponent.prototype.remove = function (elm) {
        var index = this.dest.indexOf(elm);
        if (index > -1) {
            this.dest.splice(index, 1);
        }
    };
    AddDatatypeComponent.prototype.getScopeLabel = function (elm) {
        var scope = elm.domainInfo.scope;
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
    };
    AddDatatypeComponent.prototype.submit = function () {
        var _this = this;
        var wrapper = {};
        wrapper.toAdd = this.dest;
        wrapper.id = this.id;
        this.addingService.addDatatypes(wrapper).subscribe(function (res) {
            console.log(res);
            _this.closeWithData(res);
        });
    };
    AddDatatypeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-add-datatype',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-datatype/add-datatype.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-datatype/add-datatype.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__igdocument_edit_service_adding_service__["a" /* IgDocumentAddingService */],
            __WEBPACK_IMPORTED_MODULE_3__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__["a" /* WorkspaceService */]])
    ], AddDatatypeComponent);
    return AddDatatypeComponent;
}(__WEBPACK_IMPORTED_MODULE_1__common_prime_ng_adapters_prime_dialog_adapter__["a" /* PrimeDialogAdapter */]));



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/add-segment/add-segment.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/add-segment/add-segment.component.html":
/***/ (function(module, exports) {

module.exports = "<p-dialog [(visible)]=\"_visible\">\n  <p-header>\n    Add Segments\n  </p-header>\n<div class=\"ui-g\">\n\n  <label class=\"metadata-label\"> Select Hl7 Version</label>\n\n\n  <p-radioButton [style]=\"{'margin-left':'10px'}\" *ngFor=\"let v of hl7Versions\" name=\"{{v}}\" value=\"{{v}}\" label=\"{{v}}\" [(ngModel)]=\"selcetedVersion\" (click)=\"getSource(v)\">\n\n  </p-radioButton>\n\n\n\n\n</div>\n\n  <div class=\"ui-g\">\n    <div class=\"ui-g-6\">\n\n      <p-table #tt *ngIf=\"sources\"  [value]=\"sources\" sortField=\"name\" sortMode=\"single\" [scrollable]=\"true\" scrollHeight=\"200px\" [resizableColumns]=\"true\"  [globalFilterFields]=\"['name','description']\" >\n\n        <ng-template pTemplate=\"caption\">\n          <i class=\"fa fa-search\" style=\"margin:4px 4px 0 0\"></i>\n          <input type=\"text\" pInputText size=\"50\" placeholder=\"Global Filter\" (input)=\"tt.filterGlobal($event.target.value, 'contains')\" style=\"width:auto\">\n        </ng-template>\n        <ng-template pTemplate=\"header\">\n          <tr>\n            <th pResizableColumn width=\"250px\">\n              Segment\n            </th>\n            <th pResizableColumn width=\"75px\">\n              As Is\n            </th>\n            <th pResizableColumn width=\"75px\">\n              As Flavor\n            </th>\n          </tr>\n        </ng-template>\n        <ng-template pTemplate=\"body\" let-rowData>\n          <tr>\n            <td class=\"ui-resizable-column\" width=\"250px\">\n\n       <span class=\"badge label-HL7\" >\n\n        HL7 {{rowData.domainInfo.version}}</span> {{rowData.name}}--{{rowData.description}}\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <button type=\"button\" icon=\"fa-plus\" pButton (click)=\"addAsIs(rowData)\"></button>\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <button type=\"button\" icon=\"fa-plus\" pButton (click)=\"addAsFlavor(rowData)\"></button>\n            </td>\n          </tr>\n        </ng-template>\n      </p-table>\n\n    </div>\n    <div class=\"ui-g-6\">\n\n      <p-table #dst  [value]=\"dest\" sortField=\"name\" sortMode=\"single\" [scrollable]=\"true\" scrollHeight=\"200px\" [resizableColumns]=\"true\"  [globalFilterFields]=\"['name','description']\" >\n\n        <ng-template pTemplate=\"caption\">\n          <i class=\"fa fa-search\" style=\"margin:4px 4px 0 0\"></i>\n          <input type=\"text\" pInputText size=\"50\" placeholder=\"Global Filter\" (input)=\"dst.filterGlobal($event.target.value, 'contains')\" style=\"width:auto\">\n        </ng-template>\n        <ng-template pTemplate=\"header\">\n          <tr>\n            <th pResizableColumn width=\"250px\">\n              Segment\n            </th>\n            <th pResizableColumn width=\"75px\">\n              Extension\n            </th>\n            <th pResizableColumn width=\"75px\">\n              Actions\n            </th>\n          </tr>\n        </ng-template>\n        <ng-template pTemplate=\"body\" let-rowData>\n          <tr>\n            <td class=\"ui-resizable-column\" width=\"250px\">\n\n       <span class=\"badge\"  [ngClass]=\"{'label-HL7' : getScopeLabel(rowData)==='HL7', 'label-USE': getScopeLabel(rowData)==='USR','label-MASTER':getScopeLabel(rowData)==='MAS','label-PRL':getScopeLabel(rowData)==='PRL','label-PVS':getScopeLabel(rowData)==='PVS'}\">\n\n       {{getScopeLabel(rowData)}} {{rowData.domainInfo.version}}</span>\n              {{rowData.name}}--{{rowData.description}}\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <input *ngIf=\"rowData.flavor\" type=\"text\" style=\"width: 100%\" pInputText [(ngModel)]=\"rowData.ext\"/>\n\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <button type=\"button\" icon=\"fa-remove\" (click)=\"remove(rowData)\" pButton class=\"ui-button-danger\"></button>\n            </td>\n          </tr>\n        </ng-template>\n      </p-table>\n    </div>\n\n\n  </div>\n\n\n    <p-footer>\n      <p-button    styleClass=\"green-btn\" (onClick)=\"submit()\" label=\"Submit\" icon=\"fa fa-check\" iconPos=\"left\"></p-button>\n    </p-footer>\n\n</p-dialog>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/add-segment/add-segment.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddSegmentComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_prime_ng_adapters_prime_dialog_adapter__ = __webpack_require__("../../../../../src/app/common/prime-ng-adapters/prime-dialog-adapter.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__igdocument_edit_service_adding_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/adding.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AddSegmentComponent = (function (_super) {
    __extends(AddSegmentComponent, _super);
    function AddSegmentComponent(addingService, router, route, ws) {
        var _this = _super.call(this) || this;
        _this.addingService = addingService;
        _this.router = router;
        _this.route = route;
        _this.ws = ws;
        _this.id = "";
        _this.dest = [];
        _this.namingIndicators = [];
        _this.hl7Versions = ws.getAppConstant().hl7Versions;
        return _this;
    }
    AddSegmentComponent.prototype.ngOnInit = function () {
        // Mandatory
        _super.prototype.hook.call(this, this);
    };
    AddSegmentComponent.prototype.onDialogOpen = function () {
        // Init code
        this.sources = [];
        this.dest = [];
    };
    AddSegmentComponent.prototype.close = function () {
        this.dismissWithNoData();
    };
    AddSegmentComponent.prototype.closeWithData = function (data) {
        this.dismissWithData(data);
    };
    AddSegmentComponent.prototype.getSource = function (version) {
        var _this = this;
        console.log(this.namingIndicators);
        this.addingService.getHl7SegmentByVersion(version).subscribe(function (x) {
            _this.sources = x;
        });
    };
    AddSegmentComponent.prototype.addAsIs = function (elm) {
        var copy = __WEBPACK_IMPORTED_MODULE_5_lodash__["cloneDeep"](elm);
        var x = {};
        x.domainInfo = copy.domainInfo;
        x.name = copy.name;
        x.flavor = false;
        x.description = copy.description;
        x.id = copy.id;
        this.dest.push(x);
    };
    AddSegmentComponent.prototype.addAsFlavor = function (elm) {
        var x = {};
        var copy = __WEBPACK_IMPORTED_MODULE_5_lodash__["cloneDeep"](elm);
        x.domainInfo = copy.domainInfo;
        x.domainInfo.scope = "USER";
        x.name = copy.name;
        x.ext = "";
        x.flavor = true;
        x.description = copy.description;
        x.id = copy.id;
        this.dest.push(x);
    };
    AddSegmentComponent.prototype.remove = function (elm) {
        var index = this.dest.indexOf(elm);
        if (index > -1) {
            this.dest.splice(index, 1);
        }
    };
    AddSegmentComponent.prototype.getScopeLabel = function (elm) {
        var scope = elm.domainInfo.scope;
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
    };
    AddSegmentComponent.prototype.submit = function () {
        var _this = this;
        var wrapper = {};
        wrapper.toAdd = this.dest;
        wrapper.id = this.id;
        this.addingService.addSegment(wrapper).subscribe(function (res) {
            console.log(res);
            _this.closeWithData(res);
        });
    };
    AddSegmentComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-add-segment',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-segment/add-segment.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-segment/add-segment.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__igdocument_edit_service_adding_service__["a" /* IgDocumentAddingService */],
            __WEBPACK_IMPORTED_MODULE_3__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__["a" /* WorkspaceService */]])
    ], AddSegmentComponent);
    return AddSegmentComponent;
}(__WEBPACK_IMPORTED_MODULE_1__common_prime_ng_adapters_prime_dialog_adapter__["a" /* PrimeDialogAdapter */]));



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/add-value-set/add-value-set.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/add-value-set/add-value-set.component.html":
/***/ (function(module, exports) {

module.exports = "<p-dialog [(visible)]=\"_visible\">\n  <p-header>\n    Add HL7 Value Sets\n  </p-header>\n  <div class=\"ui-g\">\n\n    <label class=\"metadata-label\"> Select Hl7 Version</label>\n\n    <p-radioButton [style]=\"{'margin-left':'10px'}\" *ngFor=\"let v of hl7Versions\" name=\"{{v}}\" value=\"{{v}}\" label=\"{{v}}\" [(ngModel)]=\"selcetedVersion\" (click)=\"getSource(v)\">\n\n    </p-radioButton>\n\n  </div>\n\n  <div class=\"ui-g\">\n    <div class=\"ui-g-6\">\n      <p-table #tt *ngIf=\"sources\"  [value]=\"sources\" sortField=\"name\" sortMode=\"single\" [scrollable]=\"true\" scrollHeight=\"200px\" [resizableColumns]=\"true\"  [globalFilterFields]=\"['name','description']\" >\n        <ng-template pTemplate=\"caption\">\n          <i class=\"fa fa-search\" style=\"margin:4px 4px 0 0\"></i>\n          <input type=\"text\" pInputText size=\"50\" placeholder=\"Global Filter\" (input)=\"tt.filterGlobal($event.target.value, 'contains')\" style=\"width:auto\">\n        </ng-template>\n        <ng-template pTemplate=\"header\">\n          <tr>\n            <th pResizableColumn width=\"250px\">\n              Value Sets\n            </th>\n            <th pResizableColumn width=\"75px\">\n              As Is\n            </th>\n            <th pResizableColumn width=\"75px\">\n              As Flavor\n            </th>\n          </tr>\n        </ng-template>\n        <ng-template pTemplate=\"body\" let-rowData>\n          <tr>\n            <td class=\"ui-resizable-column\" width=\"250px\">\n\n       <span class=\"badge label-HL7\" >\n\n        HL7 {{rowData.domainInfo.version}}</span> {{rowData.bindingIdentifier}}-{{rowData.name}}\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <button type=\"button\" icon=\"fa-plus\" pButton (click)=\"addAsIs(rowData)\"></button>\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <button type=\"button\" icon=\"fa-plus\" pButton (click)=\"addAsFlavor(rowData)\"></button>\n            </td>\n          </tr>\n        </ng-template>\n      </p-table>\n\n    </div>\n    <div class=\"ui-g-6\">\n\n      <p-table #dst  [value]=\"dest\" sortField=\"name\" sortMode=\"single\" [scrollable]=\"true\" scrollHeight=\"200px\" [resizableColumns]=\"true\"  [globalFilterFields]=\"['name','description']\" >\n\n        <ng-template pTemplate=\"caption\">\n          <i class=\"fa fa-search\" style=\"margin:4px 4px 0 0\"></i>\n          <input type=\"text\" pInputText size=\"50\" placeholder=\"Global Filter\" (input)=\"dst.filterGlobal($event.target.value, 'contains')\" style=\"width:auto\">\n        </ng-template>\n        <ng-template pTemplate=\"header\">\n          <tr>\n            <th pResizableColumn width=\"250px\">\n              Value Set\n            </th>\n            <th pResizableColumn width=\"75px\">\n              Binding Indentifier\n            </th>\n            <th pResizableColumn width=\"75px\">\n              Actions\n            </th>\n          </tr>\n        </ng-template>\n        <ng-template pTemplate=\"body\" let-rowData>\n          <tr>\n            <td class=\"ui-resizable-column\" width=\"250px\">\n\n       <span class=\"badge\"  [ngClass]=\"{'label-HL7' : getScopeLabel(rowData)==='HL7', 'label-USE': getScopeLabel(rowData)==='USR','label-MASTER':getScopeLabel(rowData)==='MAS','label-PRL':getScopeLabel(rowData)==='PRL','label-PVS':getScopeLabel(rowData)==='PVS'}\">\n\n       {{getScopeLabel(rowData)}} {{rowData.domainInfo.version}}</span>\n              {{rowData.name}}-{{rowData.description}}\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <input *ngIf=\"rowData.flavor\" type=\"text\" style=\"width: 100%\" pInputText [(ngModel)]=\"rowData.name\"/>\n\n            </td>\n            <td class=\"ui-resizable-column\" width=\"75px\">\n              <button type=\"button\" icon=\"fa-remove\" (click)=\"remove(rowData)\" pButton class=\"ui-button-danger\"></button>\n            </td>\n          </tr>\n        </ng-template>\n      </p-table>\n    </div>\n\n\n  </div>\n\n\n  <p-footer>\n    <p-button  styleClass=\"green-btn\" (onClick)=\"submit()\" label=\"Submit\" icon=\"fa fa-check\" iconPos=\"left\"></p-button>\n  </p-footer>\n\n</p-dialog>\n\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/add-value-set/add-value-set.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddValueSetComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_prime_ng_adapters_prime_dialog_adapter__ = __webpack_require__("../../../../../src/app/common/prime-ng-adapters/prime-dialog-adapter.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__igdocument_edit_service_adding_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/adding.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AddValueSetComponent = (function (_super) {
    __extends(AddValueSetComponent, _super);
    function AddValueSetComponent(addingService, router, route, ws) {
        var _this = _super.call(this) || this;
        _this.addingService = addingService;
        _this.router = router;
        _this.route = route;
        _this.ws = ws;
        _this.id = "";
        _this.dest = [];
        _this.namingIndicators = [];
        _this.hl7Versions = ws.getAppConstant().hl7Versions;
        return _this;
    }
    AddValueSetComponent.prototype.ngOnInit = function () {
        // Mandatory
        _super.prototype.hook.call(this, this);
    };
    AddValueSetComponent.prototype.onDialogOpen = function () {
        // Init code
        this.sources = [];
        this.dest = [];
    };
    AddValueSetComponent.prototype.close = function () {
        this.dismissWithNoData();
    };
    AddValueSetComponent.prototype.closeWithData = function (data) {
        this.dismissWithData(data);
    };
    AddValueSetComponent.prototype.getSource = function (version) {
        var _this = this;
        console.log(this.namingIndicators);
        this.addingService.getHl7ValueSetsByVersion(version).subscribe(function (x) {
            _this.sources = x;
        });
    };
    AddValueSetComponent.prototype.addAsIs = function (elm) {
        var copy = __WEBPACK_IMPORTED_MODULE_5_lodash__["cloneDeep"](elm);
        var x = {};
        x.domainInfo = copy.domainInfo;
        x.name = copy.bindingIdentifier;
        x.flavor = false;
        x.description = copy.name;
        x.id = copy.id;
        this.dest.push(x);
    };
    AddValueSetComponent.prototype.addAsFlavor = function (elm) {
        var x = {};
        var copy = __WEBPACK_IMPORTED_MODULE_5_lodash__["cloneDeep"](elm);
        x.domainInfo = copy.domainInfo;
        x.domainInfo.scope = "USER";
        x.name = copy.bindingIdentifier;
        x.ext = "";
        x.flavor = true;
        x.description = copy.name;
        x.id = copy.id;
        this.dest.push(x);
    };
    AddValueSetComponent.prototype.remove = function (elm) {
        var index = this.dest.indexOf(elm);
        if (index > -1) {
            this.dest.splice(index, 1);
        }
    };
    AddValueSetComponent.prototype.getScopeLabel = function (elm) {
        var scope = elm.domainInfo.scope;
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
    };
    AddValueSetComponent.prototype.submit = function () {
        var _this = this;
        var wrapper = {};
        wrapper.toAdd = this.dest;
        wrapper.id = this.id;
        this.addingService.addValueSets(wrapper).subscribe(function (res) {
            console.log(res);
            _this.closeWithData(res);
        });
    };
    AddValueSetComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-add-value-set',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-value-set/add-value-set.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-value-set/add-value-set.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__igdocument_edit_service_adding_service__["a" /* IgDocumentAddingService */],
            __WEBPACK_IMPORTED_MODULE_3__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__["a" /* WorkspaceService */]])
    ], AddValueSetComponent);
    return AddValueSetComponent;
}(__WEBPACK_IMPORTED_MODULE_1__common_prime_ng_adapters_prime_dialog_adapter__["a" /* PrimeDialogAdapter */]));



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/copy-element/copy-element.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/copy-element/copy-element.component.html":
/***/ (function(module, exports) {

module.exports = "<p-dialog [(visible)]=\"_visible\">\n  <p-header>\n    Choose Name of your  {{name}} flavor\n  </p-header>\n  <!--<form [formGroup]=\"registrationForm\" novalidate>-->\n  <!--</form>-->\n\n\n\n\n  <p-footer>\n    <p-button  styleClass=\"green-btn\" (onClick)=\"submit()\" label=\"Submit\" icon=\"fa fa-check\" iconPos=\"left\"></p-button>\n  </p-footer>\n\n</p-dialog>\n\n\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/copy-element/copy-element.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CopyElementComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_prime_ng_adapters_prime_dialog_adapter__ = __webpack_require__("../../../../../src/app/common/prime-ng-adapters/prime-dialog-adapter.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CopyElementComponent = (function (_super) {
    __extends(CopyElementComponent, _super);
    function CopyElementComponent(router, route, ws) {
        var _this = _super.call(this) || this;
        _this.router = router;
        _this.route = route;
        _this.ws = ws;
        _this.igDocumentId = "";
        _this.name = "";
        _this.ext = "";
        _this.wrapper = {};
        _this.namingIndicators = [];
        return _this;
    }
    CopyElementComponent.prototype.ngOnInit = function () {
        // Mandatory
        _super.prototype.hook.call(this, this);
    };
    CopyElementComponent.prototype.onDialogOpen = function () {
        // Init code
    };
    CopyElementComponent.prototype.close = function () {
        this.dismissWithNoData();
    };
    CopyElementComponent.prototype.closeWithData = function (data) {
        this.dismissWithData(data);
    };
    CopyElementComponent.prototype.submit = function () {
        console.log(this.namingIndicators);
        console.log(this.name);
        console.log(this.ext);
    };
    CopyElementComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-copy-element',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/copy-element/copy-element.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/copy-element/copy-element.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_2__service_workspace_workspace_service__["a" /* WorkspaceService */]])
    ], CopyElementComponent);
    return CopyElementComponent;
}(__WEBPACK_IMPORTED_MODULE_1__common_prime_ng_adapters_prime_dialog_adapter__["a" /* PrimeDialogAdapter */]));



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/displayMenu/SubMenu.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SubMenu; });
/**
 * Created by ena3 on 4/24/18.
 */
var SubMenu = (function () {
    function SubMenu(id, value, label, icon) {
        this.id = id;
        this.value = value;
        this.label = label;
        this.icon = icon;
    }
    return SubMenu;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/displayMenu/display-menu.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.custom-menu .ui-panelmenu .ui-panelmenu-header.ui-state-active > a {\n  background-color: #ffffff;\n  color: #343a40;\n}\n\n.custom-menu .ui-panelmenu .ui-panelmenu-header > a {\n  padding: 0.429em 0.857em;\n  background-color: #ffffff;\n  color: #424242;\n  border: 1px solid #ffffff;\n  outline: 0 none;\n}\n\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/displayMenu/display-menu.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"custom-menu\">\n\n\n    <ul style=\"list-style-type: none;\">\n\n        <li *ngFor=\"let item of items\">\n         <span [ngClass]=\"{'active-node':activeId==item.id}\"> <i class=\"{{item.icon}}\"></i>\n          <a  (click)=\"goTo(item)\">\n          {{item.label}}\n\n          </a>\n         </span>\n\n        </li>\n\n    </ul>\n\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/displayMenu/display-menu.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DisplayMenuComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_switchMap__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/switchMap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__SubMenu__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/displayMenu/SubMenu.ts");
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
 * Created by ena3 on 4/23/18.
 */




var DisplayMenuComponent = (function () {
    function DisplayMenuComponent(route, router) {
        this.route = route;
        this.router = router;
    }
    DisplayMenuComponent.prototype.ngOnInit = function () {
        console.log(this.elm);
        if (this.elm.type) {
            this.items = this.getMenuItems();
        }
    };
    DisplayMenuComponent.prototype.goTo = function (item) {
        var type = this.elm.type.toLowerCase();
        this.activeId = item.id;
        console.log(item);
        console.log(this.activeId);
        this.router.navigate(["./" + type + "/" + this.elm.key.id + "/" + item.value], { preserveQueryParams: true, relativeTo: this.route, preserveFragment: true });
    };
    DisplayMenuComponent.prototype.getMenuItems = function () {
        var ret = [];
        var type = this.elm.type.toLowerCase();
        ret.push(new __WEBPACK_IMPORTED_MODULE_3__SubMenu__["a" /* SubMenu */]("metadata" + "/" + this.elm.key.id, "metadata", "Meta Data", "fa fa-edit"));
        ret.push(new __WEBPACK_IMPORTED_MODULE_3__SubMenu__["a" /* SubMenu */]("preDef" + "/" + this.elm.key.id, "preDef", "Pre Definition", "fa fa-mail-reply"));
        ret.push(new __WEBPACK_IMPORTED_MODULE_3__SubMenu__["a" /* SubMenu */]("structure" + "/" + this.elm.key.id, "structure", "Structure", "fa fa-table"));
        ret.push(new __WEBPACK_IMPORTED_MODULE_3__SubMenu__["a" /* SubMenu */]("postDef" + "/" + this.elm.key.id, "postDef", "Post Definition", "fa fa-mail-forward"));
        ret.push(new __WEBPACK_IMPORTED_MODULE_3__SubMenu__["a" /* SubMenu */]("conformanceStatement" + "/" + this.elm.key.id, "conformanceStatement", "Conformance Statement", "fa fa-table"));
        if (type == 'segment' && this.elm.label == "OBX") {
            ret.push(new __WEBPACK_IMPORTED_MODULE_3__SubMenu__["a" /* SubMenu */]("coConstraint" + "/" + this.elm.key.id, "coConstraint", "Co-Constraint", "fa fa-table"));
            ret.push(new __WEBPACK_IMPORTED_MODULE_3__SubMenu__["a" /* SubMenu */]("dynamicMapping" + "/" + this.elm.key.id, "dynamicMapping", "Dynamic Mapping", "fa fa-table"));
        }
        ret.push(new __WEBPACK_IMPORTED_MODULE_3__SubMenu__["a" /* SubMenu */]("crossRef" + "/" + this.elm.key.id, "crossRef", "Cross Reference", "fa fa-list"));
        return ret;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], DisplayMenuComponent.prototype, "elm", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], DisplayMenuComponent.prototype, "igId", void 0);
    DisplayMenuComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'display-menu',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/displayMenu/display-menu.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/displayMenu/display-menu.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], DisplayMenuComponent);
    return DisplayMenuComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentEditRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__igdocument_edit_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__igdocument_metadata_igdocument_metadata_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/igdocument-metadata.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__section_section_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/section/section.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__igdocument_edit_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__section_sectionResolver_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/section/sectionResolver.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__igdocument_metadata_IgMetaDataResolver_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/IgMetaDataResolver.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__guards_save_guard__ = __webpack_require__("../../../../../src/app/guards/save.guard.ts");
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
                        path: ':igId', resolve: { currentIg: __WEBPACK_IMPORTED_MODULE_5__igdocument_edit_resolver__["a" /* IgdocumentEditResolver */] }, component: __WEBPACK_IMPORTED_MODULE_2__igdocument_edit_component__["a" /* IgDocumentEditComponent */],
                        children: [
                            { path: 'metadata', component: __WEBPACK_IMPORTED_MODULE_3__igdocument_metadata_igdocument_metadata_component__["a" /* IgDocumentMetadataComponent */], resolve: { metadata: __WEBPACK_IMPORTED_MODULE_7__igdocument_metadata_IgMetaDataResolver_resolver__["a" /* IgMetaDataResolver */] } },
                            { path: 'section/:sectionId', component: __WEBPACK_IMPORTED_MODULE_4__section_section_component__["a" /* SectionComponent */], resolve: { currentSection: __WEBPACK_IMPORTED_MODULE_6__section_sectionResolver_resolver__["a" /* SectionResolver */] }, canDeactivate: [__WEBPACK_IMPORTED_MODULE_8__guards_save_guard__["a" /* SaveFormsGuard */]] },
                            { path: '', component: __WEBPACK_IMPORTED_MODULE_3__igdocument_metadata_igdocument_metadata_component__["a" /* IgDocumentMetadataComponent */], resolve: { metadata: __WEBPACK_IMPORTED_MODULE_7__igdocument_metadata_IgMetaDataResolver_resolver__["a" /* IgMetaDataResolver */] } },
                            { path: 'segment', loadChildren: './segment-edit/segment-edit.module#SegmentEditModule' },
                            { path: 'datatype', loadChildren: './datatype-edit/datatype-edit.module#DatatypeEditModule' },
                            { path: 'conformanceprofile', loadChildren: './conformanceprofile-edit/conformanceprofile-edit.module#ConformanceprofileEditModule' }
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
exports.push([module.i, "\n\n.menu-c {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n  height: 100%;\n}\n\n.menu-c li {\n  float: right;\n  color: white;\n  padding: 10px;\n  margin-right: 10px;\n  font-size: 15px;\n  display: block;\n  text-align: center;\n  text-decoration: none;\n}\n\n.menu-c li:hover {\n  background-color: #00cede;\n  cursor: pointer;\n}\n\n.active-node{\n  color:#39a3f4;\n}\n\n.active-node{\n  color:#39a3f4 !important;\n}\n\n.layout-content-container{\n  padding: 3px !important;\n}\n\n.multiselect-adapter .ui-multiselect .ui-multiselect-label-container {\n  width: 150px;\n  height: 28px;\n  margin: 0px;\n  padding: 0px;\n}\n\n.multiselect-adapter  input{\n  width: 150px;\n  height: 28px;\n  padding: 0px;\n  margin-top: 1px;\n  background: #ffffff;\n  border: 1px solid #cccccc;\n  -webkit-transition: border-color 0.3s, box-shadow 0.3s;\n  -webkit-transition: border-color 0.3s, -webkit-box-shadow 0.3s;\n  transition: border-color 0.3s, -webkit-box-shadow 0.3s;\n  transition: border-color 0.3s, box-shadow 0.3s;\n  transition: border-color 0.3s, box-shadow 0.3s, -webkit-box-shadow 0.3s;\n  font-size: 12px;\n  border-radius: 2px;\n\n\n}\n\n.multiselect-adapter  .span{\n  width: 150px;\n  height: 28px;\n  padding: 0px;\n  margin-top: 1px;\n  background: #ffffff;\n  border: 1px solid #cccccc;\n  -webkit-transition: border-color 0.3s, box-shadow 0.3s;\n  -webkit-transition: border-color 0.3s, -webkit-box-shadow 0.3s;\n  transition: border-color 0.3s, -webkit-box-shadow 0.3s;\n  transition: border-color 0.3s, box-shadow 0.3s;\n  transition: border-color 0.3s, box-shadow 0.3s, -webkit-box-shadow 0.3s;\n  font-family: \"Source Sans Pro\", Arial, sans-serif;\n  font-size: 12px;\n  border-radius: 2px;\n}\n\n.toc-filter-toolbar .ui-toolbar {\n  background-color: #f5f5f5;\n  border-color: #d8d8d8;\n  padding: 1px;\n  font-size: 12px;\n}\n\n.rotate {\n  -webkit-transform: rotate(90deg);\n  transform: rotate(90deg);\n\n}\n\n.panel-leftheading\n{\n  width: 42px;\n  border-right: 1px solid transparent;\n  border-bottom: 1px solid transparent;\n  border-top-right-radius: 3px;\n  border-bottom-left-radius: 3px;\n  border-bottom-right-radius: 3px;\n  float: left;\n  height: 100%;\n  position: absolute;\n  width: 4%;\n  height: 800px;\n  background-color: whitesmoke;\n  padding-top: 200px;\n  padding-right: 0px;\n  cursor: pointer;\n}\n\n.panel-lefttitle\n{\n  margin-top: 0;\n  margin-bottom: 0;\n  margin-left: 38px;\n  font-size: 24px;\n  color: inherit;\n  -webkit-transform: rotate(90deg);\n  -webkit-transform-origin: left top;\n  -moz-transform: rotate(90deg);\n  -moz-transform-origin: left top;\n  -ms-transform: rotate(90deg);\n  -ms-transform-origin: left top;\n  -o-transform: rotate(90deg);\n  -o-transform-origin: left top;\n  transform: rotate(90deg);\n  transform-origin: left top;\n  position: absolute;\n  white-space: nowrap;\n}\n\n.ig-title{\n  font-size: 16px;\n  font-weight: 800;\n}\n\n.ig-date{\n  font-size: 11px;\n  font-style: italic;\n}\n\n.toc-panel-header .ui-button.ui-button-icon-only .ui-button-text {\n  padding: 0px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n  <p-confirmDialog header=\"Confirmation\" icon=\"fa fa-question-circle\" width=\"425\"></p-confirmDialog>\n  <app-add-conformance-profile [id]=\"igId\"></app-add-conformance-profile>\n  <app-add-segment [id]=\"igId\" ></app-add-segment>\n  <app-add-datatype></app-add-datatype>\n  <app-add-value-set></app-add-value-set>\n  <app-copy-element></app-copy-element>\n  <div>\n\n      <span class=\"ig-title\">{{ig.metadata.title}}</span>\n              <span class=\"ig-title\">{{ig.metadata.title}}</span>\n\n              <span class=\"ig-title\">{{ig.metadata.title}}</span>\n\n    <hr style=\"margin-top: 0rem;\n    margin-bottom: 0rem;\n    border: 0;\n    border-top: 1px solid #f5f5f5;\"/>\n      <span class=\"ig-date\" *ngIf=\"ig.dateUpdated\">\n\n            <i class=\"fa fa-calendar\"></i> Date Updated:   {{ig.dateUpdated|date }}\n      </span>\n\n\n</div>\n\n\n<p-toolbar class=\"toc-filter-toolbar\">\n\n\n    <div class=\"multiselect-adapter ui-toolbar-group-left\">\n\n    <input   type=\"text\" [(ngModel)]=\"searchFilter\" pInputText placeholder=\"Filter By Name\"  id=\"filter\" #filter (keyup)=\"filterFn()\" pTooltip=\"Filter by name\"  tooltipPosition=\"top\" >\n    <p-multiSelect defaultLabel=\"Types\"  [style]=\"{'vertical-align' : 'top' }\" [options]=\"types\" [(ngModel)]=\"selectedTypes\" (onChange)=\"filterFn()\" pTooltip=\"Filter by Type\" tooltipPosition=\"top\" ></p-multiSelect>\n\n    <p-multiSelect defaultLabel=\"Scopes\"  [style]=\"{'vertical-align' : 'top' }\"  [options]=\"scopes\" [(ngModel)]=\"selectedScopes\" (onChange)=\"filterFn()\" pTooltip=\"Filter by Scope\" tooltipPosition=\"top\" ></p-multiSelect>\n    </div>\n  <div class=\"ui-toolbar-group-right\">\n\n    <button   pButton type=\"button\" label=\"verify\" class=\"blue-btn\" icon=\"fa-check\"></button>\n    <button   pButton type=\"button\" label=\"share\"  icon=\"fa-share\"></button>\n\n    <button  pButton type=\"button\" label=\"Connect to Gvt\" class=\"blue-btn\" icon=\"fa-check\"></button>\n    <p-splitButton   label=\"Export\"  icon=\"fa-download\" [model]=\"exportModel\"></p-splitButton>\n\n  <button  (click)=\"print(igForm)\"  pButton type=\"button\" label=\"save\" class=\"green-btn\" icon=\"fa-floppy-o\"></button>\n    <button  pButton type=\"button\" label=\"reset\" class=\"red-btn\" icon=\"fa-refresh\"></button>\n\n\n  </div>\n\n\n\n\n</p-toolbar>\n</div>\n<div class=\"ui-g\">\n<div *ngIf=\"hideToc\"  style=\"width: 50px\">\n\n  <div (click)=\"toggleHideToc()\"   class=\"panel-leftheading \">\n    <p-header class=\"panel-lefttitle\" pTooltip=\"Show TOC \"  tooltipPosition=\"bottom\" > <i class=\"fa fa-eye\"></i>Table of Content</p-header>\n  </div>\n\n\n</div>\n\n<div [ngClass]=\"{'ui-g-12 ':!hideToc, 'ui-g-11':hideToc}\" style=\"padding : 0;\">\n  <div class=\"ui-g-3 no-margin\" style=\"padding : 0;\"  *ngIf=\"!hideToc\">\n  <p-panel [toggleable]=\"false\">\n    <p-header class=\"toc-panel-header\">\n      Table Of Content\n      <button  style=\"float: right; padding: 0px\" pButton type=\"button\"  icon=\"fa-arrow-left\"  pTooltip=\"Hide TOC\" tooltipPosition=\"top\" (click)=\"toggleHideToc()\"></button>\n      <button style=\"float: right;padding: 0px\" pButton type=\"button\"  icon=\"fa-compress\" pTooltip=\"Collapse All\" tooltipPosition=\"top\"  (click)=\"collapseAll()\"></button>\n      <button  style=\"float: right; padding: 0px\" pButton type=\"button\"  icon=\"fa-expand\"  pTooltip=\"Expand All\" tooltipPosition=\"top\" (click)=\"expandAll()\"></button>\n      <button  style=\"float: right;padding: 0px\" pButton type=\"button\"  icon=\"fa-plus\"  pTooltip=\"Add new Section\"  tooltipPosition=\"top\"  (click)=\"addSection()\"></button>\n\n\n\n\n    </p-header>\n    <span  style=\"cursor: pointer\" (click)=\"goToMetaData()\">IGDocument Metadata</span>\n    <tree-root [nodes]=\"nodes\"  #treeroot [options]=\"options\">\n\n      <ng-template #treeNodeTemplate let-node let-index=\"index\">\n        <ng-container [ngSwitch]=\"node.data.data.type\">\n\n\n          <ng-container *ngSwitchCase=\"'TEXT'\">\n            <span [contextMenu]=\"textcontextmenu\" (click)=\"goToSection(node.id)\" [ngClass]=\"{'active-node':activeNode==node.id}\"> {{getPath(node)}}{{node.data.data.label}}</span>\n            <context-menu #textcontextmenu>\n              <ng-template contextMenuItem (execute)=\"addSection(node)\">\n                <i class=\"fa fa-plus\"></i> Add Section\n              </ng-template>\n              <ng-template contextMenuItem (execute)=\"addSection(node)\">\n                <i class=\"fa fa-copy\"></i> Copy Section\n              </ng-template>\n              <ng-template contextMenuItem (execute)=\"addSection(node)\">\n                <i class=\"fa fa-remove\"></i> Delete Section\n              </ng-template>\n\n            </context-menu>\n\n          </ng-container>\n\n\n          <ng-container *ngSwitchCase=\"'PROFILE'\">\n            <span (click)=\"print(node)\"> {{getPath(node)}} {{node.data.data.label}}</span>\n          </ng-container>\n\n\n          <ng-container *ngSwitchCase=\"'PROFILECOMPONENTREGISTRY'\">\n            <span> {{getPath(node)}} {{node.data.data.label}}</span>\n          </ng-container>\n\n\n          <ng-container *ngSwitchCase=\"'CONFORMANCEPROFILEREGISTRY'\">\n            <span  [contextMenu]=\"conformanceProfilesContextMenu\"> {{getPath(node)}} {{node.data.data.label}}</span>\n\n            <context-menu  #conformanceProfilesContextMenu>\n              <ng-template contextMenuItem (execute)=\"addMessage(node)\">\n                <i class=\"fa fa-plus\"></i>Add Conformance Profile\n              </ng-template>\n            </context-menu>\n          </ng-container>\n\n\n\n          <ng-container *ngSwitchCase=\"'COMPOSITEPROFILEREGISTRY'\">\n            <span> {{getPath(node)}} {{node.data.data.label}}</span>\n          </ng-container>\n\n          <ng-container *ngSwitchCase=\"'DATATYPEREGISTRY'\">\n            <span [contextMenu]=\"addDatatypeContextMenu\"> {{getPath(node)}} {{node.data.data.label}}</span>\n\n            <context-menu  #addDatatypeContextMenu>\n              <ng-template contextMenuItem (execute)=\"addDatatypes()\">\n                <i class=\"fa fa-plus\"></i> Add HL7 Data Types\n              </ng-template>\n            </context-menu>\n          </ng-container>\n\n\n\n          <ng-container *ngSwitchCase=\"'VALUESETREGISTRY'\">\n            <span [contextMenu]=\"valueSetsContextMenu\"> {{getPath(node)}} {{node.data.data.label}}</span>\n            <context-menu  #valueSetsContextMenu>\n              <ng-template contextMenuItem (execute)=\"addValueSets()\">\n                <i class=\"fa fa-plus\"></i> Add Hl7 Value Sets\n              </ng-template>\n            </context-menu>\n          </ng-container>\n\n\n          <ng-container *ngSwitchCase=\"'SEGMENTREGISTRY'\">\n\n            <span [contextMenu]=\"segmentContextMenu\"> {{getPath(node)}} {{node.data.data.label}}</span>\n            <context-menu  #segmentContextMenu>\n              <ng-template contextMenuItem (execute)=\"addSegments()\">\n                <i class=\"fa fa-plus\"></i> Add Segments\n              </ng-template>\n            </context-menu>\n          </ng-container>\n\n          <ng-container *ngSwitchCase=\"'DATATYPE'\">\n            <display-label [elm]=\"node.data.data\" [igId]=\"igId\"   [contextMenu]=\"datatypeContextMenu\" (click)=\"activateNode(node)\" [ngClass]=\"{'active-node':activeNode==node.id}\"></display-label>\n            <context-menu  #datatypeContextMenu>\n              <ng-template contextMenuItem (execute)=\"copyDatatype(node)\">\n                <i class=\"fa fa-copy\"></i> Copy\n              </ng-template>\n              <ng-template contextMenuItem (execute)=\"deleteDatatype(node)\">\n                <i class=\"fa fa-remove\"></i> Delete\n              </ng-template>\n            </context-menu>\n            <display-menu [elm]=\"node.data.data\" *ngIf=\"activeNode==node.id\"></display-menu>\n          </ng-container>\n\n          <ng-container *ngSwitchCase=\"'CONFORMANCEPROFILE'\">\n            <display-label [elm]=\"node.data.data\" [contextMenu]=\"conformanceProfileContextMenu\" [igId]=\"igId\" (click)=\"activateNode(node)\" [ngClass]=\"{'active-node':activeNode==node.id}\"></display-label>\n            <context-menu  #conformanceProfileContextMenu>\n              <ng-template contextMenuItem (execute)=\"copyConformanceProfile(node)\">\n                <i class=\"fa fa-copy\"></i> Copy\n              </ng-template>\n              <ng-template contextMenuItem (execute)=\"deleteConformanceProfile(node)\">\n                <i class=\"fa fa-remove\"></i> Delete\n              </ng-template>\n            </context-menu>\n            <display-menu [elm]=\"node.data.data\" *ngIf=\"activeNode==node.id\"></display-menu>\n          </ng-container>\n\n\n          <ng-container *ngSwitchCase=\"'COMPOSITEPROFILE'\">\n            <span>  {{node.data.data.label}}</span>\n            <display-menu [elm]=\"node.data.data\" *ngIf=\"activeNode==node.id\"></display-menu>\n          </ng-container>\n\n\n          <ng-container *ngSwitchCase=\"'SEGMENT'\">\n            <display-label [elm]=\"node.data.data\" [igId]=\"igId\" [contextMenu]=\"segmentContextMenu\" (click)=\"activateNode(node)\" [ngClass]=\"{'active-node':activeNode==node.id}\"></display-label>\n            <context-menu  #segmentContextMenu>\n              <ng-template contextMenuItem (execute)=\"copySegment(node)\">\n                <i class=\"fa fa-copy\"></i> Copy\n              </ng-template>\n              <ng-template contextMenuItem (execute)=\"deleteSegment(node)\">\n                <i class=\"fa fa-remove\"></i> Delete\n              </ng-template>\n            </context-menu>\n            <display-menu [elm]=\"node.data.data\" *ngIf=\"activeNode==node.id\"></display-menu>\n\n\n\n          </ng-container>\n\n          <ng-container *ngSwitchCase=\"'VALUESET'\" >\n            <display-label [elm]=\"node.data.data\" [igId]=\"igId\" [contextMenu]=\"valueSetContextMenu\" (click)=\"activateNode(node.id)\" [ngClass]=\"{'active-node':activeNode==node.id}\"></display-label>\n\n            <context-menu  #valueSetContextMenu>\n              <ng-template contextMenuItem (execute)=\"copyValueSet(node)\">\n                <i class=\"fa fa-copy\"></i> Copy\n              </ng-template>\n              <ng-template contextMenuItem (execute)=\"deleteValueSet(node)\">\n                <i class=\"fa fa-remove\"></i> Delete\n              </ng-template>\n            </context-menu>\n            <display-menu [elm]=\"node.data.data\" *ngIf=\"activeNode==node.id\"></display-menu>      </ng-container>\n          <ng-container *ngSwitchCase=\"'PROFILECOMPONENT'\">\n\n            <span>{{node.data.data.label}}</span>\n            <display-menu *ngIf=\"node.active\" [elm]=\"node.data.data\"></display-menu>\n\n          </ng-container>\n\n        </ng-container>\n\n      </ng-template>\n\n    </tree-root>\n  </p-panel>\n  </div>\n\n  <!--ROUTE-->\n  <div [ngClass]=\"{'ui-g-9 ':!hideToc, 'ui-g-12':hideToc}\" class=\"ui-g-9 \" style=\"padding : 0;\">\n\n      <router-outlet></router-outlet>\n\n  </div>\n</div>\n</div>\n\n<p-blockUI [blocked]=\"blockUI\"></p-blockUI>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentEditComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_toc_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular_tree_component__ = __webpack_require__("../../../../angular-tree-component/dist/angular-tree-component.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__ = __webpack_require__("../../../../ngx-contextmenu/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__add_conformance_profile_add_conformance_profile_component__ = __webpack_require__("../../../../../src/app/igdocuments/add-conformance-profile/add-conformance-profile.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__add_segment_add_segment_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-segment/add-segment.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__add_datatype_add_datatype_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-datatype/add-datatype.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__add_value_set_add_value_set_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-value-set/add-value-set.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__copy_element_copy_element_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/copy-element/copy-element.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__service_indexed_db_datatypes_datatypes_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/datatypes/datatypes-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__service_indexed_db_toc_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/toc-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__service_export_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/export.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__common_constants_types__ = __webpack_require__("../../../../../src/app/common/constants/types.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__service_sections_sections_service__ = __webpack_require__("../../../../../src/app/service/sections/sections.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
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
    function IgDocumentEditComponent(tocService, sp, router, dtsToCService, tocDbService, exportService, sectionService, indexedDbService) {
        var _this = this;
        this.tocService = tocService;
        this.sp = sp;
        this.router = router;
        this.dtsToCService = dtsToCService;
        this.tocDbService = tocDbService;
        this.exportService = exportService;
        this.sectionService = sectionService;
        this.indexedDbService = indexedDbService;
        this.displayMessageAdding = false;
        this.hideToc = false;
        this.searchFilter = "";
        this.types = [
            { label: "Narrative", value: "TEXT" },
            { label: "Conforamance profile", value: "CONFORMANCEPROFILE" },
            { label: "Segment", value: "SEGMENT" },
            { label: "Data Type", value: "DATATYPE" },
            { label: "Profile Component", value: "PROFILECOMPONENT" },
            { label: "Composite Profile ", value: "COMPOSITEPROFILE" },
            { label: "ValueSet", value: "VALUESET" }
        ];
        this.scopes = [
            { label: "HL7", value: "HL7STANDARD" },
            { label: "USER", value: "USER" },
            { label: "HL7 Flavors", value: "MASTER" }
        ];
        this.options = {
            allowDrag: function (node) { return node.data.data.type == __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].TEXT || node.data.data.type == __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].CONFORMANCEPROFILE || node.data.data.type == __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].PROFILE; },
            actionMapping: {
                mouse: {
                    drop: function (tree, node, $event, _a) {
                        var from = _a.from, to = _a.to;
                        console.log("dropping");
                        console.log(node);
                        console.log(from);
                        console.log(to);
                        if (from.data.data.type == __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].TEXT && (!_this.isOrphan(to) && to.parent.data.data.type == __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].TEXT || _this.isOrphan(to))) {
                            console.log(from);
                            _this.sectionService.updateDnD(from.id, from.data, { from: to.id, to: node.id, position: from.data.data.position }).then(function (res) {
                                __WEBPACK_IMPORTED_MODULE_2_angular_tree_component__["a" /* TREE_ACTIONS */].MOVE_NODE(tree, node, $event, { from: from, to: to });
                                _this.indexedDbService.updateIgDocument(_this.igId, _this.tree.treeModel.nodes);
                            });
                        }
                        if (from.data.data.type == __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].PROFILE && _this.isOrphan(to)) {
                            console.log(from);
                            __WEBPACK_IMPORTED_MODULE_2_angular_tree_component__["a" /* TREE_ACTIONS */].MOVE_NODE(tree, node, $event, { from: from, to: to });
                            _this.indexedDbService.updateIgDocument(_this.igId, _this.tree.treeModel.nodes);
                            //this.sectionService.updateDnD(node.id,node.data, {from:from.id,to:to.id,position:node.data.data.position})
                        }
                    },
                    mouse: {
                        click: __WEBPACK_IMPORTED_MODULE_2_angular_tree_component__["a" /* TREE_ACTIONS */].ACTIVATE
                    },
                    contextMenu: function (model, node, event) {
                        event.preventDefault();
                        _this.onContextMenu(event, node);
                        console.log('in context menu...');
                    }
                }
            }
        };
        this.getPath = function (node) {
            node.data.data.position = parseInt(node.index) + 1; // temporary to be discussed
            if (this.isOrphan(node)) {
                return node.data.data.position + ".";
            }
            else {
                return this.getPath(node.parent) + node.data.data.position + ".";
            }
        };
        router.events.subscribe(function (event) {
            console.log(event);
            if (event instanceof __WEBPACK_IMPORTED_MODULE_4__angular_router__["NavigationEnd"]) {
                _this.currentUrl = event.url;
                _this.parseUrl();
            }
        });
    }
    IgDocumentEditComponent.prototype.isOrphan = function (node) {
        return node.parent && !node.parent.parent;
    };
    IgDocumentEditComponent.prototype.filterFn = function () {
        var _this = this;
        this.hideToc = false; // show the TOC if we filter
        this.tree.treeModel.filterNodes(function (node) {
            if (node.data.data.domainInfo) {
                if (node.data.data.domainInfo.scope) {
                    return node.data.data.label.startsWith(_this.searchFilter) && (!_this.selectedTypes || _this.selectedTypes.indexOf(node.data.data.type) > -1) && (!_this.selectedScopes || _this.selectedScopes.indexOf(node.data.data.domainInfo.scope) > -1);
                }
            }
            return node.data.data.label.startsWith(_this.searchFilter) && (!_this.selectedTypes || _this.selectedTypes.indexOf(node.data.data.type) > -1) && (!_this.selectedScopes || _this.selectedScopes.length == 0);
        });
    };
    IgDocumentEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("Calling on Init");
        this.igId = this.sp.snapshot.params["igId"];
        this.sp.data.map(function (data) { return data.currentIg; }).subscribe(function (x) {
            _this.ig = x;
            _this.nodes = _this.ig.toc;
        });
        this.exportModel = [
            { label: 'As Word', command: function () {
                    _this.exportAsWord();
                } },
            { label: 'As HTML', command: function () {
                    _this.exportAsHTML();
                } }
        ];
    };
    IgDocumentEditComponent.prototype.exportAsWord = function () {
        this.exportService.exportAsWord(this.igId).subscribe(function (x) {
            console.log(x);
        });
    };
    IgDocumentEditComponent.prototype.exportAsHTML = function () {
        this.exportService.exportAsHtml(this.igId).subscribe(function (x) {
            console.log(x);
        });
    };
    IgDocumentEditComponent.prototype.toggleHideToc = function () {
        this.hideToc = !this.hideToc;
    };
    IgDocumentEditComponent.prototype.print = function (node) {
        console.log(node);
    };
    IgDocumentEditComponent.prototype.ngAfterViewInit = function () {
        this.parseUrl();
    };
    IgDocumentEditComponent.prototype.parseUrl = function () {
        if (this.tree) {
            var index = this.currentUrl.indexOf("/ig/");
            var fromIg = this.currentUrl.substring(this.currentUrl.indexOf("/ig/") + 4);
            var paramIndex = fromIg.indexOf('?');
            console.log(paramIndex);
            if (paramIndex > -1) {
                fromIg = fromIg.substring(0, paramIndex);
            }
            var slashIndex = fromIg.indexOf("/");
            if (slashIndex > 0) {
                var fromChild = fromIg.substring(slashIndex + 1, fromIg.length);
                var child = fromChild.substring(fromChild.indexOf("/") + 1, fromChild.length);
                var childId = "";
                console.log(child);
                if (child.indexOf("/") > 0 || child.indexOf("/") == child.length - 1) {
                    console.log(childId);
                    childId = child.substring(0, child.indexOf("/"));
                }
                else {
                    childId = child;
                }
                var node = this.tree.treeModel.getNodeById(childId);
                if (node) {
                    this.tocService.setActiveNode(node);
                    node.setIsActive(true);
                    this.activeNode = node.id;
                }
            }
        }
    };
    IgDocumentEditComponent.prototype.filterByUrl = function (url) {
        var _this = this;
        this.tree.treeModel.filterNodes(function (node) {
            if (node.data.data.key) {
                if (node.data.data.key && node.data.data.key.id) {
                    if (_this.currentUrl.includes(node.data.data.key.id)) {
                        _this.activeNode = node.id;
                        return true;
                    }
                }
            }
            else {
            }
        });
    };
    IgDocumentEditComponent.prototype.getItemFromTargetType = function (node) {
        this.currentNode = node;
        if (node.data.data.type == __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].IGDOCUMENT) {
            this.items = [
                { label: 'Add Section', icon: 'fa-plus', command: function (event) {
                        console.log(event);
                    }
                }
            ];
            return this.items;
        }
    };
    IgDocumentEditComponent.prototype.onContextMenu = function (event, node) {
    };
    IgDocumentEditComponent.prototype.addSection = function () {
        //console.log(this.toc);
        var data1 = {
            label: "new Section",
            content: "",
            type: __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].TEXT,
            position: this.tree.treeModel.nodes.length + 1
        };
        var newNode = { id: "bla", data: data1, children: [] };
        this.tree.treeModel.nodes.push(newNode);
        this.tree.treeModel.update();
    };
    ;
    IgDocumentEditComponent.prototype.path = function (node) {
        return node.path;
    };
    IgDocumentEditComponent.prototype.collapseAll = function () {
        this.tree.treeModel.collapseAll();
    };
    IgDocumentEditComponent.prototype.expandAll = function () {
        this.tree.treeModel.expandAll();
    };
    IgDocumentEditComponent.prototype.filterByTypes = function () {
        var _this = this;
        this.tree.treeModel.filterNodes(function (node) {
            return (!_this.selectedTypes || _this.selectedTypes.indexOf(node.data.data.type) > -1) && (_this.selectedScopes || _this.selectedScopes.indexOf(node.data.data.domainInfo.scope) > -1) && node.data.data.label.startsWith(_this.searchFilter);
        });
    };
    IgDocumentEditComponent.prototype.activateNode = function (node) {
        // this.activeNode=node.id;
    };
    IgDocumentEditComponent.prototype.goToSection = function (id) {
        var _this = this;
        this.sp.queryParams
            .subscribe(function (params) {
            console.log(params);
            _this.router.navigate(["./section/" + id], { preserveQueryParams: true, relativeTo: _this.sp, preserveFragment: true });
        });
    };
    IgDocumentEditComponent.prototype.goToMetaData = function () {
        var _this = this;
        this.sp.queryParams
            .subscribe(function (params) {
            _this.router.navigate(["./metadata/"], { preserveQueryParams: true, relativeTo: _this.sp, preserveFragment: true });
        });
    };
    IgDocumentEditComponent.prototype.addMessage = function (node) {
        var _this = this;
        this.addCps.open({
            id: this.igId
        })
            .subscribe(function (result) {
            _this.distributeResult(result);
            console.log(result);
        });
    };
    IgDocumentEditComponent.prototype.distributeResult = function (object) {
        var _this = this;
        var conformanceProfiles = [];
        var segments = [];
        var datatypes = [];
        var valueSets = [];
        var compositeProfiles = [];
        var profileComponents = [];
        if (object.conformanceProfiles) {
            conformanceProfiles = this.convertList(object.conformanceProfiles);
        }
        if (object.segments) {
            segments = this.convertList(object.segments);
        }
        if (object.datatypes) {
            datatypes = this.convertList(object.datatypes);
        }
        if (object.valueSets) {
            valueSets = this.convertList(object.valueSets);
        }
        this.tocDbService.bulkAddTocNewElements(valueSets, datatypes, segments, conformanceProfiles, profileComponents, compositeProfiles).then(function () {
            if (object.conformanceProfiles) {
                _this.tocService.addNodesByType(object.conformanceProfiles, _this.tree.treeModel.nodes, __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].CONFORMANCEPROFILEREGISTRY);
            }
            if (object.segments) {
                _this.tocService.addNodesByType(object.segments, _this.tree.treeModel.nodes, __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].SEGMENTREGISTRY);
            }
            if (object.datatypes) {
                _this.tocService.addNodesByType(object.datatypes, _this.tree.treeModel.nodes, __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].DATATYPEREGISTRY);
            }
            if (object.valueSets) {
                _this.tocService.addNodesByType(object.valueSets, _this.tree.treeModel.nodes, __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].VALUESETREGISTRY);
            }
            _this.tree.treeModel.update();
            _this.indexedDbService.updateIgDocument(_this.igId, _this.tree.treeModel.nodes);
        }).catch(function (error) {
        });
    };
    IgDocumentEditComponent.prototype.addSegments = function () {
        var _this = this;
        var existing = this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes, __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].SEGMENTREGISTRY);
        console.log(existing);
        this.addSegs.open({
            id: this.igId,
            namingIndicators: existing
        })
            .subscribe(function (result) {
            _this.distributeResult(result);
            console.log(result);
        });
    };
    IgDocumentEditComponent.prototype.addDatatypes = function () {
        var _this = this;
        var existing = this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes, __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].DATATYPEREGISTRY);
        this.addDts.open({
            id: this.igId,
            namingIndicators: existing
        })
            .subscribe(function (result) {
            _this.distributeResult(result);
        });
    };
    IgDocumentEditComponent.prototype.addValueSets = function () {
        var _this = this;
        var existing = this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes, __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].VALUESETREGISTRY);
        this.addVs.open({
            id: this.igId,
            namingIndicators: existing
        }).subscribe(function (result) {
            _this.distributeResult(result);
        });
    };
    IgDocumentEditComponent.prototype.copyDatatype = function (node) {
        var _this = this;
        var existing = this.tocService.getNameUnicityIndicators(this.tree.treeModel.nodes, __WEBPACK_IMPORTED_MODULE_13__common_constants_types__["a" /* Types */].DATATYPEREGISTRY);
        this.copyElemt.open({
            igDocumentId: this.igId,
            id: node.data.data.key,
            name: node.data.data.label,
            namingIndicators: existing
        })
            .subscribe(function (result) {
            _this.distributeResult(result);
        });
    };
    IgDocumentEditComponent.prototype.convertList = function (list) {
        var ret = [];
        for (var i = 0; i < list.length; i++) {
            ret.push(list[i]);
        }
        return ret;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__["a" /* ContextMenuComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__["a" /* ContextMenuComponent */])
    ], IgDocumentEditComponent.prototype, "basicMenu", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_5__add_conformance_profile_add_conformance_profile_component__["a" /* AddConformanceProfileComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_5__add_conformance_profile_add_conformance_profile_component__["a" /* AddConformanceProfileComponent */])
    ], IgDocumentEditComponent.prototype, "addCps", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_6__add_segment_add_segment_component__["a" /* AddSegmentComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6__add_segment_add_segment_component__["a" /* AddSegmentComponent */])
    ], IgDocumentEditComponent.prototype, "addSegs", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_7__add_datatype_add_datatype_component__["a" /* AddDatatypeComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_7__add_datatype_add_datatype_component__["a" /* AddDatatypeComponent */])
    ], IgDocumentEditComponent.prototype, "addDts", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_8__add_value_set_add_value_set_component__["a" /* AddValueSetComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_8__add_value_set_add_value_set_component__["a" /* AddValueSetComponent */])
    ], IgDocumentEditComponent.prototype, "addVs", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_9__copy_element_copy_element_component__["a" /* CopyElementComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_9__copy_element_copy_element_component__["a" /* CopyElementComponent */])
    ], IgDocumentEditComponent.prototype, "copyElemt", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_2_angular_tree_component__["b" /* TreeComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_angular_tree_component__["b" /* TreeComponent */])
    ], IgDocumentEditComponent.prototype, "tree", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('igcontextmenu'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__["a" /* ContextMenuComponent */])
    ], IgDocumentEditComponent.prototype, "igcontextmenu", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('textcontextmenu'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__["a" /* ContextMenuComponent */])
    ], IgDocumentEditComponent.prototype, "textcontextmenu", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('datatypescontextmenu'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__["a" /* ContextMenuComponent */])
    ], IgDocumentEditComponent.prototype, "datatypescontextmenu", void 0);
    IgDocumentEditComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__service_toc_service__["a" /* TocService */], __WEBPACK_IMPORTED_MODULE_4__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_4__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_10__service_indexed_db_datatypes_datatypes_toc_service__["a" /* DatatypesTocService */], __WEBPACK_IMPORTED_MODULE_11__service_indexed_db_toc_db_service__["a" /* TocDbService */], __WEBPACK_IMPORTED_MODULE_12__service_export_service__["a" /* ExportService */], __WEBPACK_IMPORTED_MODULE_14__service_sections_sections_service__["a" /* SectionsService */], __WEBPACK_IMPORTED_MODULE_15__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */]])
    ], IgDocumentEditComponent);
    return IgDocumentEditComponent;
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__toc_toc_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_components_menubar_menubar__ = __webpack_require__("../../../../primeng/components/menubar/menubar.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_components_menubar_menubar___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_primeng_components_menubar_menubar__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_primeng_components_tooltip_tooltip__ = __webpack_require__("../../../../primeng/components/tooltip/tooltip.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_primeng_components_tooltip_tooltip___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_primeng_components_tooltip_tooltip__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_primeng_components_tieredmenu_tieredmenu__ = __webpack_require__("../../../../primeng/components/tieredmenu/tieredmenu.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_primeng_components_tieredmenu_tieredmenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_primeng_components_tieredmenu_tieredmenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__utils_utils_module__ = __webpack_require__("../../../../../src/app/utils/utils.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__service_toc_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_primeng_components_common_treedragdropservice__ = __webpack_require__("../../../../primeng/components/common/treedragdropservice.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_primeng_components_common_treedragdropservice___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_primeng_components_common_treedragdropservice__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_primeng_components_dragdrop_dragdrop__ = __webpack_require__("../../../../primeng/components/dragdrop/dragdrop.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_primeng_components_dragdrop_dragdrop___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_primeng_components_dragdrop_dragdrop__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__igdocument_edit_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_angular_tree_component__ = __webpack_require__("../../../../angular-tree-component/dist/angular-tree-component.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_primeng_overlaypanel__ = __webpack_require__("../../../../primeng/overlaypanel.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_primeng_overlaypanel___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18_primeng_overlaypanel__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_ngx_contextmenu__ = __webpack_require__("../../../../ngx-contextmenu/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_primeng_panel__ = __webpack_require__("../../../../primeng/panel.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_primeng_panel___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20_primeng_panel__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_primeng_multiselect__ = __webpack_require__("../../../../primeng/multiselect.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_primeng_multiselect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21_primeng_multiselect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_primeng_dropdown__ = __webpack_require__("../../../../primeng/dropdown.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_primeng_dropdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22_primeng_dropdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__section_sectionResolver_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/section/sectionResolver.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24_angular_froala_wysiwyg__ = __webpack_require__("../../../../angular-froala-wysiwyg/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25_primeng_panelmenu__ = __webpack_require__("../../../../primeng/panelmenu.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25_primeng_panelmenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_25_primeng_panelmenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__displayMenu_display_menu_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/displayMenu/display-menu.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__igdocument_metadata_IgMetaDataResolver_resolver__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/IgMetaDataResolver.resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28_primeng_components_fileupload_fileupload__ = __webpack_require__("../../../../primeng/components/fileupload/fileupload.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28_primeng_components_fileupload_fileupload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_28_primeng_components_fileupload_fileupload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__segment_edit_segment_edit_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__datatype_edit_datatype_edit_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/datatype-edit/datatype-edit.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31_primeng_components_common_confirmationservice__ = __webpack_require__("../../../../primeng/components/common/confirmationservice.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31_primeng_components_common_confirmationservice___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_31_primeng_components_common_confirmationservice__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32_primeng_components_confirmdialog_confirmdialog__ = __webpack_require__("../../../../primeng/components/confirmdialog/confirmdialog.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32_primeng_components_confirmdialog_confirmdialog___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_32_primeng_components_confirmdialog_confirmdialog__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33_primeng_components_message_message__ = __webpack_require__("../../../../primeng/components/message/message.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33_primeng_components_message_message___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_33_primeng_components_message_message__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__guards_save_guard__ = __webpack_require__("../../../../../src/app/guards/save.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35_primeng_dialog__ = __webpack_require__("../../../../primeng/dialog.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35_primeng_dialog___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_35_primeng_dialog__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36_primeng_components_treetable_treetable__ = __webpack_require__("../../../../primeng/components/treetable/treetable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36_primeng_components_treetable_treetable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_36_primeng_components_treetable_treetable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37_primeng_components_common_shared__ = __webpack_require__("../../../../primeng/components/common/shared.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37_primeng_components_common_shared___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_37_primeng_components_common_shared__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__add_conformance_profile_add_conformance_profile_component__ = __webpack_require__("../../../../../src/app/igdocuments/add-conformance-profile/add-conformance-profile.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39_ngx_bootstrap__ = __webpack_require__("../../../../ngx-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40_primeng_components_radiobutton_radiobutton__ = __webpack_require__("../../../../primeng/components/radiobutton/radiobutton.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40_primeng_components_radiobutton_radiobutton___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_40_primeng_components_radiobutton_radiobutton__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41_primeng_components_blockui_blockui__ = __webpack_require__("../../../../primeng/components/blockui/blockui.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41_primeng_components_blockui_blockui___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_41_primeng_components_blockui_blockui__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__service_adding_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/adding.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__add_segment_add_segment_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-segment/add-segment.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44_primeng_components_table_table__ = __webpack_require__("../../../../primeng/components/table/table.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44_primeng_components_table_table___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_44_primeng_components_table_table__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__add_datatype_add_datatype_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-datatype/add-datatype.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__add_value_set_add_value_set_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/add-value-set/add-value-set.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__copy_element_copy_element_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/copy-element/copy-element.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__service_names_and_positions_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/names-and-positions.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49_primeng_components_splitbutton_splitbutton__ = __webpack_require__("../../../../primeng/components/splitbutton/splitbutton.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49_primeng_components_splitbutton_splitbutton___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_49_primeng_components_splitbutton_splitbutton__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__service_export_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/export.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















// import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";





































var IgDocumentEditModule = (function () {
    function IgDocumentEditModule() {
    }
    IgDocumentEditModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_5__igdocument_edit_routing_module__["a" /* IgDocumentEditRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["AccordionModule"],
                __WEBPACK_IMPORTED_MODULE_18_primeng_overlaypanel__["OverlayPanelModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["TabViewModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["GrowlModule"],
                __WEBPACK_IMPORTED_MODULE_8_primeng_components_menubar_menubar__["MenubarModule"],
                __WEBPACK_IMPORTED_MODULE_9_primeng_components_tooltip_tooltip__["TooltipModule"],
                __WEBPACK_IMPORTED_MODULE_10_primeng_components_tieredmenu_tieredmenu__["TieredMenuModule"],
                __WEBPACK_IMPORTED_MODULE_11__utils_utils_module__["a" /* UtilsModule */],
                __WEBPACK_IMPORTED_MODULE_14_primeng_components_dragdrop_dragdrop__["DragDropModule"],
                __WEBPACK_IMPORTED_MODULE_15__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_17_angular_tree_component__["c" /* TreeModule */],
                __WEBPACK_IMPORTED_MODULE_20_primeng_panel__["PanelModule"],
                __WEBPACK_IMPORTED_MODULE_21_primeng_multiselect__["MultiSelectModule"],
                __WEBPACK_IMPORTED_MODULE_15__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_19_ngx_contextmenu__["b" /* ContextMenuModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_22_primeng_dropdown__["DropdownModule"],
                __WEBPACK_IMPORTED_MODULE_24_angular_froala_wysiwyg__["a" /* FroalaEditorModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_24_angular_froala_wysiwyg__["b" /* FroalaViewModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_25_primeng_panelmenu__["PanelMenuModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["ToolbarModule"],
                __WEBPACK_IMPORTED_MODULE_28_primeng_components_fileupload_fileupload__["FileUploadModule"],
                __WEBPACK_IMPORTED_MODULE_29__segment_edit_segment_edit_module__["SegmentEditModule"],
                __WEBPACK_IMPORTED_MODULE_30__datatype_edit_datatype_edit_module__["DatatypeEditModule"],
                __WEBPACK_IMPORTED_MODULE_32_primeng_components_confirmdialog_confirmdialog__["ConfirmDialogModule"],
                __WEBPACK_IMPORTED_MODULE_33_primeng_components_message_message__["MessageModule"],
                __WEBPACK_IMPORTED_MODULE_35_primeng_dialog__["DialogModule"],
                __WEBPACK_IMPORTED_MODULE_36_primeng_components_treetable_treetable__["TreeTableModule"],
                __WEBPACK_IMPORTED_MODULE_37_primeng_components_common_shared__["SharedModule"],
                __WEBPACK_IMPORTED_MODULE_44_primeng_components_table_table__["TableModule"],
                __WEBPACK_IMPORTED_MODULE_40_primeng_components_radiobutton_radiobutton__["RadioButtonModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_41_primeng_components_blockui_blockui__["BlockUIModule"],
                __WEBPACK_IMPORTED_MODULE_49_primeng_components_splitbutton_splitbutton__["SplitButtonModule"],
                __WEBPACK_IMPORTED_MODULE_39_ngx_bootstrap__["b" /* ModalModule */].forRoot()
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__igdocument_edit_component__["a" /* IgDocumentEditComponent */], __WEBPACK_IMPORTED_MODULE_3__igdocument_metadata_igdocument_metadata_component__["a" /* IgDocumentMetadataComponent */], __WEBPACK_IMPORTED_MODULE_4__section_section_component__["a" /* SectionComponent */], __WEBPACK_IMPORTED_MODULE_7__toc_toc_component__["a" /* TocComponent */], __WEBPACK_IMPORTED_MODULE_26__displayMenu_display_menu_component__["a" /* DisplayMenuComponent */], __WEBPACK_IMPORTED_MODULE_38__add_conformance_profile_add_conformance_profile_component__["a" /* AddConformanceProfileComponent */], __WEBPACK_IMPORTED_MODULE_43__add_segment_add_segment_component__["a" /* AddSegmentComponent */], __WEBPACK_IMPORTED_MODULE_45__add_datatype_add_datatype_component__["a" /* AddDatatypeComponent */], __WEBPACK_IMPORTED_MODULE_46__add_value_set_add_value_set_component__["a" /* AddValueSetComponent */], __WEBPACK_IMPORTED_MODULE_47__copy_element_copy_element_component__["a" /* CopyElementComponent */]
            ],
            entryComponents: [],
            providers: [
                __WEBPACK_IMPORTED_MODULE_12__service_toc_service__["a" /* TocService */], __WEBPACK_IMPORTED_MODULE_13_primeng_components_common_treedragdropservice__["TreeDragDropService"], __WEBPACK_IMPORTED_MODULE_16__igdocument_edit_resolver__["a" /* IgdocumentEditResolver */], __WEBPACK_IMPORTED_MODULE_23__section_sectionResolver_resolver__["a" /* SectionResolver */], __WEBPACK_IMPORTED_MODULE_27__igdocument_metadata_IgMetaDataResolver_resolver__["a" /* IgMetaDataResolver */], __WEBPACK_IMPORTED_MODULE_34__guards_save_guard__["a" /* SaveFormsGuard */], __WEBPACK_IMPORTED_MODULE_31_primeng_components_common_confirmationservice__["ConfirmationService"], __WEBPACK_IMPORTED_MODULE_42__service_adding_service__["a" /* IgDocumentAddingService */], __WEBPACK_IMPORTED_MODULE_48__service_names_and_positions_service__["a" /* NamesAndPositionsService */], __WEBPACK_IMPORTED_MODULE_50__service_export_service__["a" /* ExportService */]
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["CUSTOM_ELEMENTS_SCHEMA"]]
        })
    ], IgDocumentEditModule);
    return IgDocumentEditModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgdocumentEditResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_indexed_db_conformance_profiles_conformance_profiles_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/conformance-profiles/conformance-profiles-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_indexed_db_toc_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/toc-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_indexed_db_valuesets_valuesets_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/valuesets/valuesets-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_indexed_db_segments_segments_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/segments/segments-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_indexed_db_datatypes_datatypes_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/datatypes/datatypes-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_indexed_db_composite_profiles_composite_profiles_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/composite-profiles/composite-profiles-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_indexed_db_profile_components_profile_components_toc_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/profile-components/profile-components-toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__common_constants_types__ = __webpack_require__("../../../../../src/app/common/constants/types.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__service_names_and_positions_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/names-and-positions.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__service_indexed_db_ig_document_info_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/ig-document-info-database.ts");
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














var IgdocumentEditResolver = (function () {
    function IgdocumentEditResolver(http, indexedDbService, saveService, valuesetsTocService, segmentsTocService, datatypesTocService, conformanceProfilesTocService, compositeProfilesTocService, profileComponentsTocService, namesAndPositionsService) {
        this.http = http;
        this.indexedDbService = indexedDbService;
        this.saveService = saveService;
        this.valuesetsTocService = valuesetsTocService;
        this.segmentsTocService = segmentsTocService;
        this.datatypesTocService = datatypesTocService;
        this.conformanceProfilesTocService = conformanceProfilesTocService;
        this.compositeProfilesTocService = compositeProfilesTocService;
        this.profileComponentsTocService = profileComponentsTocService;
        this.namesAndPositionsService = namesAndPositionsService;
        this.segments = [];
        this.datatypes = [];
        this.profileComponents = [];
        this.conformanceProfiles = [];
        this.compositeProfiles = [];
        this.valueSets = [];
    }
    IgdocumentEditResolver.prototype.resolve = function (route, rstate) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var igId = route.params["igId"];
            console.log("TEST");
            _this.indexedDbService.getIgDocumentId().then(function (id) {
                if (id !== igId) {
                    // this.initToc(igId,resolve,reject);
                    _this.initIgDocument(igId, resolve, reject);
                }
                else {
                    _this.getFromClientDb(igId, resolve, reject);
                    //this.getMergedIg(igId, resolve,reject);
                }
            }, function (error) {
                _this.initIgDocument(igId, resolve, reject);
                // this.initToc(igId,resolve,reject);
            });
        });
    };
    IgdocumentEditResolver.prototype.parseToc = function (toc) {
        for (var i = 0; i < toc.length; i++) {
            var node = toc[i];
            if (node.data.type == __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].PROFILE) {
                this.parseProfile(node);
            }
        }
    };
    IgdocumentEditResolver.prototype.parseProfile = function (profile) {
        for (var i = 0; i < profile.children.length; i++) {
            var node = profile.children[i];
            var converted = this.convertList(node.children);
            if (node.data.type == __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].CONFORMANCEPROFILEREGISTRY) {
                this.conformanceProfiles = converted;
            }
            else if (node.data.type == __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].PROFILECOMPONENTREGISTRY) {
                this.profileComponents = converted;
            }
            else if (node.data.type == __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].COMPOSITEPROFILEREGISTRY) {
                this.compositeProfiles = converted;
            }
            else if (node.data.type == __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].SEGMENTREGISTRY) {
                this.segments = converted;
            }
            else if (node.data.type == __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].DATATYPEREGISTRY) {
                this.datatypes = converted;
            }
            else if (node.data.type == __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].VALUESETREGISTRY) {
                this.valueSets = converted;
            }
        }
    };
    IgdocumentEditResolver.prototype.convertList = function (list) {
        var ret = [];
        for (var i = 0; i < list.length; i++) {
            ret.push(list[i]);
        }
        return ret;
    };
    IgdocumentEditResolver.prototype.getFromClientDb = function (igId, resolve, reject) {
        var _this = this;
        this.http.get("api/igdocuments/" + igId + "/display").subscribe(function (x) {
            _this.ig = x;
            _this.indexedDbService.getIgDocument().then(function (x) {
                resolve(x);
            });
        });
    };
    IgdocumentEditResolver.prototype.getMergedIg = function (igId, resolve, reject) {
        var _this = this;
        this.http.get("api/igdocuments/" + igId + "/display").subscribe(function (x) {
            _this.ig = x;
            console.log(_this.ig.toc);
            _this.segments = [];
            _this.datatypes = [];
            _this.profileComponents = [];
            _this.conformanceProfiles = [];
            _this.compositeProfiles = [];
            _this.valueSets = [];
            _this.conformanceProfilesTocService.getAllFromAdded().then(function (cpsNodes) {
                _this.conformanceProfiles = cpsNodes;
                console.log(_this.conformanceProfiles);
                if (_this.conformanceProfiles.length > 0) {
                    _this.addNodesByType(_this.ig.toc, __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].CONFORMANCEPROFILEREGISTRY, _this.conformanceProfiles);
                }
                _this.profileComponentsTocService.getAllFromAdded().then(function (pcsNodes) {
                    _this.profileComponents = pcsNodes;
                    console.log(_this.profileComponents);
                    if (_this.profileComponents.length > 0) {
                        _this.addNodesByType(_this.ig.toc, __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].PROFILECOMPONENTREGISTRY, _this.profileComponents);
                    }
                    _this.compositeProfilesTocService.getAllFromAdded().then(function (composites) {
                        _this.compositeProfiles = composites;
                        console.log(_this.compositeProfiles);
                        if (_this.compositeProfiles.length > 0) {
                            _this.addNodesByType(_this.ig.toc, __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].COMPOSITEPROFILEREGISTRY, _this.compositeProfiles);
                        }
                        _this.segmentsTocService.getAllFromAdded().then(function (segments) {
                            _this.segments = segments;
                            console.log(_this.segments);
                            if (_this.segments.length > 0) {
                                _this.addNodesByType(_this.ig.toc, __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].SEGMENTREGISTRY, _this.segments);
                            }
                            _this.datatypesTocService.getAllFromAdded().then(function (datatypes) {
                                _this.datatypes = datatypes;
                                console.log(_this.datatypes);
                                if (_this.datatypes.length > 0) {
                                    _this.addNodesByType(_this.ig.toc, __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].DATATYPEREGISTRY, _this.datatypes);
                                }
                                _this.valuesetsTocService.getAllFromAdded().then(function (valueSets) {
                                    _this.valueSets = valueSets;
                                    if (_this.valueSets.length > 0) {
                                        _this.addNodesByType(_this.ig.toc, __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].VALUESETREGISTRY, _this.valueSets);
                                    }
                                    console.log("resolving ig");
                                    console.log(_this.ig);
                                    _this.namesAndPositionsService.updateIgTocNames(_this.ig, resolve, reject);
                                    resolve(_this.ig);
                                }, function (error) {
                                });
                            }, function (error) {
                            });
                        }, function (error) {
                        });
                    }, function (error) {
                    });
                }, function (error) {
                });
            }, function (error) {
            });
        });
    };
    IgdocumentEditResolver.prototype.initToc = function (igId, resolve, reject) {
        var _this = this;
        this.http.get("api/igdocuments/" + igId + "/display").subscribe(function (x) {
            _this.parseToc(x.toc);
            _this.indexedDbService.initializeDatabase(igId).then(function () {
                _this.saveService.bulkAddToc(_this.valueSets, _this.datatypes, _this.segments, _this.conformanceProfiles, _this.profileComponents, _this.compositeProfiles).then(function () {
                    resolve(x);
                }, function (error) {
                    console.log("Could not add elements to client db");
                    reject();
                });
            }, function (error) {
                console.log("Could not load Ig : " + error);
                reject();
            });
        });
    };
    IgdocumentEditResolver.prototype.initIgDocument = function (igId, resolve, reject) {
        var _this = this;
        this.http.get("api/igdocuments/" + igId + "/display").subscribe(function (x) {
            // this.parseToc(x.toc);
            _this.indexedDbService.initializeDatabase(igId).then(function () {
                var ig = new __WEBPACK_IMPORTED_MODULE_13__service_indexed_db_ig_document_info_database__["a" /* IgDocumentInfo */](igId);
                ig.metadata = x["metadata"];
                ig.toc = x["toc"];
                _this.indexedDbService.initIg(ig).then(function () {
                    resolve(ig);
                }, function (error) {
                    console.log("Could not add elements to client db");
                    reject();
                });
            }, function (error) {
                console.log("Could not load Ig : " + error);
                reject();
            });
        });
    };
    IgdocumentEditResolver.prototype.findNodeByType = function (children, type) {
        return __WEBPACK_IMPORTED_MODULE_10_lodash__["find"](children, function (node) { return type == node.data.type; });
    };
    IgdocumentEditResolver.prototype.addNodesByType = function (tocChildren, type, added) {
        var profile = this.findNodeByType(tocChildren, __WEBPACK_IMPORTED_MODULE_11__common_constants_types__["a" /* Types */].PROFILE);
        if (profile != null) {
            if (profile.children && profile.children.length > 0) {
                var registry = this.findNodeByType(profile.children, type);
                if (registry && registry.children && registry.children.length > 0) {
                    console.log("adding" + type);
                    registry.children = __WEBPACK_IMPORTED_MODULE_10_lodash__["union"](registry.children, added);
                    registry.children = __WEBPACK_IMPORTED_MODULE_10_lodash__["sortBy"](registry.children, [function (node) {
                            return node.data.label;
                        }
                    ]);
                }
            }
        }
    };
    ;
    IgdocumentEditResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */], __WEBPACK_IMPORTED_MODULE_4__service_indexed_db_toc_db_service__["a" /* TocDbService */], __WEBPACK_IMPORTED_MODULE_5__service_indexed_db_valuesets_valuesets_toc_service__["a" /* ValuesetsTocService */], __WEBPACK_IMPORTED_MODULE_6__service_indexed_db_segments_segments_toc_service__["a" /* SegmentsTocService */], __WEBPACK_IMPORTED_MODULE_7__service_indexed_db_datatypes_datatypes_toc_service__["a" /* DatatypesTocService */], __WEBPACK_IMPORTED_MODULE_3__service_indexed_db_conformance_profiles_conformance_profiles_toc_service__["a" /* ConformanceProfilesTocService */], __WEBPACK_IMPORTED_MODULE_8__service_indexed_db_composite_profiles_composite_profiles_toc_service__["a" /* CompositeProfilesTocService */], __WEBPACK_IMPORTED_MODULE_9__service_indexed_db_profile_components_profile_components_toc_service__["a" /* ProfileComponentsTocService */], __WEBPACK_IMPORTED_MODULE_12__service_names_and_positions_service__["a" /* NamesAndPositionsService */]])
    ], IgdocumentEditResolver);
    return IgdocumentEditResolver;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/IgMetaDataResolver.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgMetaDataResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs__);
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




var IgMetaDataResolver = (function () {
    function IgMetaDataResolver(http, router) {
        this.http = http;
        this.router = router;
    }
    IgMetaDataResolver.prototype.resolve = function (route, rstate) {
        console.log("calling resolver");
        if (!route.parent.data["currentIg"]) {
            this.router.navigate(["/404"]);
            return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].empty();
        }
        else {
            console.log(route.parent.data["currentIg"].metadata);
            return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(route.parent.data["currentIg"].metadata);
        }
    };
    IgMetaDataResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__angular_router__["Router"]])
    ], IgMetaDataResolver);
    return IgMetaDataResolver;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/igdocument-metadata.component.html":
/***/ (function(module, exports) {

module.exports = "\n\n\n\n\n  <div class=\"ui-g input-box\">\n    <label class=\"metadata-label ui-g-2\">\n      Cover Picture <p-fileUpload mode=\"basic\" name=\"file\" url=\"./uploaded_files/upload\" auto=\"auto\"   maxFileSize=\"1000000\" (onUpload)=\"upload($event)\">\n    </p-fileUpload>\n    </label>\n    <div class=\"ui-g-offset-3\">\n      <img *ngIf=\"metaData.coverPicture\" src={{metaData.coverPicture}} width=\"80\" height=\"80\">\n      <span *ngIf=\"!metaData.coverPicture\" > No Image Selected </span>\n    </div>\n\n  </div>\n  <div class=\"ui-g input-box\">\n    <label class=\"metadata-label ui-g-2\">\n      Title\n    </label>\n\n    <input name=\"title\" id=\"title\" pInputText placeholder=\"title\"\n           [(ngModel)]=\"metaData.title\" class=\"ui-g-10\" #title=\"ngModel\" required>\n\n    <div class=\"ui-g-offset-1\" *ngIf=\"title.invalid&&  (title.dirty || title.touched)\">\n      <p-message severity=\"error\" text=\"Title is required\"></p-message>\n\n    </div>\n\n  </div>\n\n  <div class=\"ui-g input-box\">\n    <label class=\"metadata-label ui-g-2\">\n      Sub-Title\n    </label>\n\n    <input name=\"subTitle\" id=\"subTitle\" pInputText placeholder=\"Sub Title \"\n           [(ngModel)]=\"metaData.subTitle\" class=\"ui-g-10\" #subTitle=\"ngModel\">\n\n  </div>\n\n  <div class=\"ui-g input-box\">\n    <label class=\"metadata-label ui-g-2\">\n      Organization\n    </label>\n\n    <input name=\"orgName\" id=\"orgName\" pInputText placeholder=\"Organization\"\n           [(ngModel)]=\"metaData.orgName\" class=\"ui-g-10\" #orgName=\"ngModel\">\n\n\n  </div>\n\n  <div class=\"ui-g input-box\">\n    <label class=\"metadata-label ui-g-2\">\n      Author Notes\n    </label>\n    <div  class=\"ui-g-10\" [froalaEditor] [(froalaModel)]=\"metaData.implementationNotes\"></div>\n  </div>\n\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/igdocument-metadata.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentMetadataComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
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
    function IgDocumentMetadataComponent(sp, router) {
        this.sp = sp;
        this.router = router;
    }
    IgDocumentMetadataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sp.data.map(function (data) { return data.metadata; }).subscribe(function (x) {
            _this.metaData = x;
            console.log(_this.metaData);
        });
    };
    IgDocumentMetadataComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/igdocument-metadata/igdocument-metadata.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], IgDocumentMetadataComponent);
    return IgDocumentMetadataComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/section/section.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n    <span style=\"font-weight: 700; font-size: 16px\">\n  {{section.label}}\n\n<button style=\"float:right\" (click)=\"reset()\">Rest</button>\n\n  </span>\n</div>\n  <div>\n<span style=\"font-weight: 300 ;    font-weight: 300;\n    font-style: italic;\n    font-size: 13px;\">\n   <i class=\"fa fa-calendar\"></i> date updated:{{section.dateUpdated|date}}\n\n\n</span>\n  </div>\n<form  #editForm=\"ngForm\" novalidate>\n<div class=\"ui-g\">\n  <label class=\"ui-g-1\">\n   <strong> Title </strong>\n  </label>\n  <input name=\"title\" id=\"title\" pInputText placeholder=\"title\"\n         [(ngModel)]=\"section.label\" class=\"ui-g-11\" #title=\"ngModel\"  pTooltip=\"section Title\" required>\n\n  <div class=\"ui-g-offset-1\" *ngIf=\"title.invalid&&  (title.dirty || title.touched)\">\n    <p-message severity=\"error\" text=\"Title is required\"></p-message>\n\n  </div>\n</div>\n\n<div class=\"ui-g\">\n  <label class=\"ui-g-1\">\n   <strong>Content</strong>\n  </label>\n\n  <div class=\"ui-g-11\" [froalaEditor] [(froalaModel)]=\"section.description\">{{section.description}}</div>\n\n</div>\n</form>\n\n\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/section/section.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SectionComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_toc_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_sections_sections_service__ = __webpack_require__("../../../../../src/app/service/sections/sections.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_indexed_db_objects_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/objects-database.ts");
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
    function SectionComponent(sp, router, tocService, sectionsService) {
        var _this = this;
        this.sp = sp;
        this.router = router;
        this.tocService = tocService;
        this.sectionsService = sectionsService;
        this.tocService.getActiveNode().subscribe(function (x) {
            console.log(x);
            _this.currentNode = x;
        });
    }
    SectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sp.data.map(function (data) { return data.currentSection; }).subscribe(function (x) {
            console.log(_this.section);
            _this.backup = x;
            _this.section = __WEBPACK_IMPORTED_MODULE_2_lodash__["cloneDeep"](_this.backup);
        });
    };
    SectionComponent.prototype.save = function () {
        var _this = this;
        this.tocService.getActiveNode().subscribe(function (x) {
            var node = x;
            if (_this.section.id === node.data.id) {
                node.data.data.label = _this.section.label;
            }
        });
        var s = new __WEBPACK_IMPORTED_MODULE_6__service_indexed_db_objects_database__["c" /* Section */]();
        s.id = this.section.id;
        s.section = this.section;
        return this.sectionsService.updateContent(this.section.id, this.section, null);
    };
    SectionComponent.prototype.reset = function () {
        this.section = __WEBPACK_IMPORTED_MODULE_2_lodash__["cloneDeep"](this.backup);
    };
    SectionComponent.prototype.getCurrent = function () {
        return this.section;
    };
    SectionComponent.prototype.getBackup = function () {
        return this.backup;
    };
    SectionComponent.prototype.isValid = function () {
        return !this.editForm.invalid;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('editForm'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__angular_forms__["NgForm"])
    ], SectionComponent.prototype, "editForm", void 0);
    SectionComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/section/section.component.html"),
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__service_toc_service__["a" /* TocService */], __WEBPACK_IMPORTED_MODULE_5__service_sections_sections_service__["a" /* SectionsService */]])
    ], SectionComponent);
    return SectionComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/section/sectionResolver.resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SectionResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_sections_sections_service__ = __webpack_require__("../../../../../src/app/service/sections/sections.service.ts");
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




var SectionResolver = (function () {
    function SectionResolver(http, router, sectionService) {
        this.http = http;
        this.router = router;
        this.sectionService = sectionService;
    }
    SectionResolver.prototype.resolve = function (route, rstate) {
        var sectionId = route.params["sectionId"];
        return this.sectionService.getSection(sectionId);
    };
    SectionResolver.prototype.findSectionById = function (sections, id) {
        console.log(sections);
        console.log(id);
        for (var i = 0; i < sections.length; i++) {
            var section = this.findInSideSection(sections[i], id);
            if (section != null) {
                return section;
            }
        }
        return null;
    };
    SectionResolver.prototype.findInSideSection = function (section, id) {
        if (section.id && section.id == id) {
            return section;
        }
        if (section.children && section.children.length > 0) {
            for (var i = 0; i < section.children.length; i++) {
                var s = this.findInSideSection(section.children[i], id);
                if (s != null) {
                    return s;
                }
            }
        }
        return null;
    };
    SectionResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__service_sections_sections_service__["a" /* SectionsService */]])
    ], SectionResolver);
    return SectionResolver;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/service/adding.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentAddingService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
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
 * Created by ena3 on 5/14/18.
 */


var IgDocumentAddingService = (function () {
    function IgDocumentAddingService(http) {
        this.http = http;
    }
    IgDocumentAddingService.prototype.addMessages = function (wrapper) {
        return this.http.post('api/ig/addConformanceProfile', wrapper);
    };
    IgDocumentAddingService.prototype.addSegment = function (wrapper) {
        return this.http.post('api/ig/addSegments', wrapper);
    };
    IgDocumentAddingService.prototype.addDatatypes = function (wrapper) {
        return this.http.post('api/ig/addDatatypes', wrapper);
    };
    IgDocumentAddingService.prototype.addValueSets = function (wrapper) {
        return this.http.post('api/ig/addValueSets', wrapper);
    };
    IgDocumentAddingService.prototype.getMessagesByVersion = function (hl7Version) {
        return this.http.get('api/igdocuments/findMessageEvents/' + hl7Version);
    };
    IgDocumentAddingService.prototype.getHl7SegmentByVersion = function (hl7Version) {
        return this.http.get('api/ig/findHl7Segments/' + hl7Version);
    };
    IgDocumentAddingService.prototype.getHl7DatatypesByVersion = function (hl7Version) {
        return this.http.get('api/ig/findHl7Datatypes/' + hl7Version);
    };
    IgDocumentAddingService.prototype.getHl7ValueSetsByVersion = function (hl7Version) {
        return this.http.get('api/ig/findHl7ValueSets/' + hl7Version);
    };
    IgDocumentAddingService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]])
    ], IgDocumentAddingService);
    return IgDocumentAddingService;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/service/export.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExportService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ExportService = (function () {
    function ExportService(http) {
        this.http = http;
    }
    ExportService.prototype.exportAsWord = function (igId) {
        console.log("Exporting");
        return this.http.get("api/igdocuments/" + igId + "/export/word");
    };
    ExportService.prototype.exportAsHtml = function (igId) {
        return this.http.get("api/igdocuments/" + igId + "/export/html");
    };
    ExportService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]])
    ], ExportService);
    return ExportService;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/service/names-and-positions.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NamesAndPositionsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_indexed_db_segments_segments_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/segments/segments-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_indexed_db_datatypes_datatypes_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/datatypes/datatypes-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_indexed_db_valuesets_valuesets_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/valuesets/valuesets-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_indexed_db_sections_sections_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/sections/sections-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_indexed_db_conformance_profiles_conformance_profiles_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/conformance-profiles/conformance-profiles-indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_constants_types__ = __webpack_require__("../../../../../src/app/common/constants/types.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_lodash__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var NamesAndPositionsService = (function () {
    function NamesAndPositionsService(segmentsIndexedDbService, datatypesIndexedDbService, valueSetsIndexedDbService, sectionsIndexedDbService, conformanceProfilesIndexedDbService) {
        this.segmentsIndexedDbService = segmentsIndexedDbService;
        this.datatypesIndexedDbService = datatypesIndexedDbService;
        this.valueSetsIndexedDbService = valueSetsIndexedDbService;
        this.sectionsIndexedDbService = sectionsIndexedDbService;
        this.conformanceProfilesIndexedDbService = conformanceProfilesIndexedDbService;
    }
    NamesAndPositionsService.prototype.updateIgTocNames = function (ig, resolve, reject) {
        console.log("Merging profile");
        this.updateProfile(ig, resolve, reject);
    };
    NamesAndPositionsService.prototype.findNodeByType = function (children, type) {
        return __WEBPACK_IMPORTED_MODULE_7_lodash__["find"](children, function (node) { return type == node.data.type; });
    };
    NamesAndPositionsService.prototype.updateProfile = function (igToc, resolve, reject) {
        this.mergeRegistries(igToc, resolve, reject);
    };
    NamesAndPositionsService.prototype.mergeRegistries = function (ig, resolve, reject) {
        var _this = this;
        var profile = this.findNodeByType(ig.toc, __WEBPACK_IMPORTED_MODULE_6__common_constants_types__["a" /* Types */].PROFILE);
        this.segmentsIndexedDbService.getAllMetaData().then(function (metadataList) {
            if (metadataList.length > 0) {
                var registry = _this.findNodeByType(profile.children, __WEBPACK_IMPORTED_MODULE_6__common_constants_types__["a" /* Types */].SEGMENTREGISTRY);
                _this.updateChildren(registry, metadataList);
            }
            _this.datatypesIndexedDbService.getAllMetaData().then(function (metadataList) {
                if (metadataList.length > 0) {
                    var registry = _this.findNodeByType(profile.children, __WEBPACK_IMPORTED_MODULE_6__common_constants_types__["a" /* Types */].SEGMENTREGISTRY);
                    _this.updateChildren(registry, metadataList);
                }
                _this.conformanceProfilesIndexedDbService.getAllMetaData().then(function (metadataList) {
                    if (metadataList.length > 0) {
                        var registry = _this.findNodeByType(profile.children, __WEBPACK_IMPORTED_MODULE_6__common_constants_types__["a" /* Types */].SEGMENTREGISTRY);
                        _this.updateChildren(registry, metadataList);
                    }
                    _this.valueSetsIndexedDbService.getAllMetaData().then(function (metadataList) {
                        if (metadataList.length > 0) {
                            var registry = _this.findNodeByType(profile.children, __WEBPACK_IMPORTED_MODULE_6__common_constants_types__["a" /* Types */].SEGMENTREGISTRY);
                            _this.updateChildren(registry, metadataList);
                        }
                        resolve(ig);
                    }, function (error) {
                    });
                }, function (error) {
                });
            }, function (error) {
            });
        }, function (error) {
        });
    };
    ;
    NamesAndPositionsService.prototype.updateChildren = function (registry, metadataList) {
        __WEBPACK_IMPORTED_MODULE_7_lodash__["forEach"](metadataList, function (metadata) {
            var node = __WEBPACK_IMPORTED_MODULE_7_lodash__["find"](registry.children, function (node) {
                return node.id == metadata.id;
            });
            if (node != null) {
                node.data.ext = metadata.metadata.ext;
                node.data.label = metadata.metadata.label;
                node.data.description = metadata.metadata.description;
            }
        });
    };
    ;
    NamesAndPositionsService.prototype.findNodeById = function (children, id) {
        return __WEBPACK_IMPORTED_MODULE_7_lodash__["find"](children, function (node) { return id == node.id; });
    };
    NamesAndPositionsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__service_indexed_db_segments_segments_indexed_db_service__["a" /* SegmentsIndexedDbService */], __WEBPACK_IMPORTED_MODULE_2__service_indexed_db_datatypes_datatypes_indexed_db_service__["a" /* DatatypesIndexedDbService */],
            __WEBPACK_IMPORTED_MODULE_3__service_indexed_db_valuesets_valuesets_indexed_db_service__["a" /* ValuesetsIndexedDbService */],
            __WEBPACK_IMPORTED_MODULE_4__service_indexed_db_sections_sections_indexed_db_service__["a" /* SectionsIndexedDbService */],
            __WEBPACK_IMPORTED_MODULE_5__service_indexed_db_conformance_profiles_conformance_profiles_indexed_db_service__["a" /* ConformanceProfilesIndexedDbService */]])
    ], NamesAndPositionsService);
    return NamesAndPositionsService;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".ngx-contextmenu .dropdown-menu {\n  padding: 0;\n}\n.ngx-contextmenu li {\n  display: block;\n  text-transform: uppercase;\n  text-align: center;\n}\n.ngx-contextmenu li:first-child {\n  border-top:none;\n}\n.ngx-contextmenu a {\n  display: block;\n  padding: 0.5em 1em;\n}\n.ngx-contextmenu a:hover {\n}\nbody .ui-panelmenu .ui-panelmenu-header > a {\n  padding: 0.429em 0.857em;\n  background-color: #f5f5f5;\n  color: #424242;\n  border: 1px solid #0c7ed5;\n  outline: 0 none;\n}\nbody .ui-widget-content {\n  background-color: #ffffff;\n  border: 1px solid #ffffff;\n /*border: 1px solid #d8d8d8;*/\n}\n.toc-container{\n  border-top:1px solid;\n}\n.toc-container .ui-widget-header {\n  background: #ffffff;\n  border: 1px solid #39a3f4;\n  font-weight: 700;\n}\n.toc-container .ui-panelmenu .ui-panelmenu-header.ui-state-active > a {\n  background-color: #ffffff;\n  color: #343a40;\n}\n.node-wrapper {display: -webkit-box;display: -ms-flexbox;display: flex; -webkit-box-align: start; -ms-flex-align: start; align-items: flex-start;}\n/*.node-content-wrapper-active,*/\n/*.node-content-wrapper.node-content-wrapper-active:hover,*/\n/*.node-content-wrapper-active.node-content-wrapper-focused {*/\n/*background: #beebff;*/\n/*}*/\n/*.node-content-wrapper-focused { background: #e7f4f9 }*/\n/*.node-content-wrapper:hover { background: #f7fbff }*/\n/*.node-content-wrapper-active, .node-content-wrapper-focused, .node-content-wrapper:hover {*/\n/*box-shadow: inset 0 0 1px #999;*/\n/*}*/\n.tree-children.tree-children-no-padding { padding-left: 0 }\n.tree-children { padding-left: 20px; overflow: hidden }\n.node-drop-slot { display: block; height: 2px }\n.node-drop-slot.is-dragging-over { background: #2d60ff; height: 20px; border: 2px dotted #888; }\n.toggle-children-wrapper-expanded .toggle-children { -webkit-transform: rotate(90deg); transform: rotate(90deg) }\n.toggle-children-wrapper-collapsed .toggle-children { -webkit-transform: rotate(0); transform: rotate(0); }\n.toggle-children-wrapper {\n  padding: 2px 3px 5px 1px;\n}\n/* tslint:disable */\n.toggle-children {\n  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABAhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjY1RTYzOTA2ODZDRjExREJBNkUyRDg4N0NFQUNCNDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYzRkRFQjcxODUzNTExRTU4RTQwRkQwODFEOUZEMEE3IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYzRkRFQjcwODUzNTExRTU4RTQwRkQwODFEOUZEMEE3IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTk5NzA1OGEtZDI3OC00NDZkLWE4ODgtNGM4MGQ4YWI1NzNmIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YzRkZmQxMGMtY2NlNS0xMTc4LWE5OGQtY2NkZmM5ODk5YWYwIi8+IDxkYzp0aXRsZT4gPHJkZjpBbHQ+IDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+Z2x5cGhpY29uczwvcmRmOmxpPiA8L3JkZjpBbHQ+IDwvZGM6dGl0bGU+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+5iogFwAAAGhJREFUeNpiYGBgKABigf///zOQg0EARH4A4gZyDIIZ8B/JoAJKDIDhB0CcQIkBRBtEyABkgxwoMQCGD6AbRKoBGAYxQgXIBRuZGKgAKPIC3QLxArnRSHZCIjspk52ZKMrOFBUoAAEGAKnq593MQAZtAAAAAElFTkSuQmCC');\n  height: 8px;\n  width: 9px;\n  background-size: contain;\n  display: inline-block;\n  position: relative;\n  top: 1px;\n  background-repeat: no-repeat;\n  background-position: center;\n}\n.toggle-children-placeholder {\n  display: inline-block;\n  height: 10px;\n  width: 10px;\n  position: relative;\n  top: 1px;\n  padding-right: 3px;\n}\n.node-content-wrapper {\n  display: inline-block;\n  padding: 2px 5px;\n  border-radius: 2px;\n  -webkit-transition: background-color .15s,-webkit-box-shadow .15s;\n  transition: background-color .15s,-webkit-box-shadow .15s;\n  transition: background-color .15s,box-shadow .15s;\n  transition: background-color .15s,box-shadow .15s,-webkit-box-shadow .15s;\n}\n.node-wrapper {display: -webkit-box;display: -ms-flexbox;display: flex; -webkit-box-align: start; -ms-flex-align: start; align-items: flex-start;}\n/*.node-content-wrapper-active,*/\n/*.node-content-wrapper.node-content-wrapper-active:hover,*/\n/*.node-content-wrapper-active.node-content-wrapper-focused {*/\n/*background: #beebff;*/\n/*}*/\n/*.node-content-wrapper-focused { background: #e7f4f9 }*/\n/*.node-content-wrapper:hover { background: #f7fbff }*/\n/*.node-content-wrapper-active, .node-content-wrapper-focused, .node-content-wrapper:hover {*/\n/*box-shadow: inset 0 0 1px #999;*/\n/*}*/\n.node-content-wrapper.is-dragging-over { background: #2d60ff; -webkit-box-shadow: inset 0 0 1px #999; box-shadow: inset 0 0 1px #999; }\n.node-content-wrapper.is-dragging-over-disabled { opacity: 0.5 }\ntree-viewport {\n  -webkit-tap-highlight-color: transparent;\n  height: 100%;\n  overflow: auto;\n  display: block;\n}\n.tree-children { padding-left: 20px }\n.empty-tree-drop-slot .node-drop-slot { height: 20px; min-width: 100px }\n.angular-tree-component {\n  width: 100%;\n  position:relative;\n  display: inline-block;\n  cursor: pointer;\n  -webkit-touch-callout: none; /* iOS Safari */\n  -webkit-user-select: none;   /* Chrome/Safari/Opera */    /* Konqueror */\n  -moz-user-select: none;      /* Firefox */\n  -ms-user-select: none;       /* IE/Edge */\n  user-select: none;           /* non-prefixed version, currently not supported by any browser */\n}\ntree-root .angular-tree-component-rtl {\n  direction: rtl;\n}\ntree-root .angular-tree-component-rtl .toggle-children-wrapper-collapsed .toggle-children {\n  -webkit-transform: rotate(180deg) !important;\n          transform: rotate(180deg) !important;\n}\ntree-root .angular-tree-component-rtl .tree-children {\n  padding-right: 20px;\n  padding-left: 0;\n}\ntree-node-checkbox {\n  padding: 1px;\n}\n\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"card\" style=\"padding: 0px\">\n\n\n<p-panel [toggleable]=\"true\" expandIcon=\"fa-filter\" collapseIcon=\"fa-filter\">\n\n  <div class=\"ui-inputgroup u-g-12\" >\n    <button pButton type=\"button\"  icon=\"fa-search\" ></button>\n    <input type=\"text\" [(ngModel)]=\"searchFilter\" pInputText placeholder=\"Search By Name\" id=\"filter\" #filter (keyup)=\"filterFn()\" style=\"width:100%\">{{searchFilter}}\n  </div>\n  <!--<input id=\"filter\" #filter (keyup)=\"filterFn(filter.value)\" placeholder=\"filter nodes\"/>-->\n    <div class=\"ui-g-12\">\n\n      <p-multiSelect defaultLabel=\"Types\" [style]=\"{'width':'100%'}\" [options]=\"types\" [(ngModel)]=\"selectedTypes\" (onChange)=\"filterFn()\"></p-multiSelect>\n\n    </div>\n\n    <div class=\"ui-g-12\">\n\n       <p-multiSelect defaultLabel=\"SCOPE\" [style]=\"{'width':'100%'}\" [options]=\"scopes\" [(ngModel)]=\"selectedScopes\" (onChange)=\"filterFn()\"></p-multiSelect>\n\n    </div>\n\n  <div class=\"ui-g-12\">\n\n    <button style=\"float: right;\" pButton label=\"Expand All\" type=\"button\"  icon=\"fa-expand-alt\" (click)=\"expandAll()\"></button>\n    <button pButton style=\"float:left\" label=\"Collapse All\" type=\"button\"  icon=\"fa-compress-alt\" (click)=\"collapseAll()\"></button>\n\n\n  </div>\n\n\n\n</p-panel>\n<div class=\"toc-container card-body\">\n<tree-root [nodes]=\"ig.toc.content\" [options]=\"options\" #treeroot>\n\n  <ng-template #treeNodeTemplate let-node let-index=\"index\">\n    <ng-container [ngSwitch]=\"node.data.data.type\">\n      <ng-container *ngSwitchCase=\"'IGDOCUMENT'\">\n        <span [contextMenu]=\"igcontextmenu\">{{node.data.data.label}}</span>\n\n        <context-menu #igcontextmenu>\n          <ng-template contextMenuItem (execute)=\"addSection(node)\">\n            <i class=\"fa fa-plus\"></i> Add Section\n          </ng-template>\n        </context-menu>\n      </ng-container>\n\n      <ng-container *ngSwitchCase=\"'TEXT'\">\n        <span [contextMenu]=\"textcontextmenu\" (click)=\"path(node)\"> {{getPath(node)}}{{node.data.data.label}}</span>\n        <context-menu #textcontextmenu>\n          <ng-template contextMenuItem (execute)=\"addSection(node)\">\n            <i class=\"fa fa-plus\"></i> Add Section\n          </ng-template>\n          <ng-template contextMenuItem (execute)=\"addSection(node)\">\n            <i class=\"fa fa-copy\"></i> Copy Section\n          </ng-template>\n          <ng-template contextMenuItem (execute)=\"addSection(node)\">\n            <i class=\"fa fa-remove\"></i> Delete Section\n          </ng-template>\n\n        </context-menu>\n\n      </ng-container>\n\n\n      <ng-container *ngSwitchCase=\"'PROFILE'\">\n        <span> {{getPath(node)}} {{node.data.data.label}}</span>\n      </ng-container>\n\n\n      <ng-container *ngSwitchCase=\"'PROFILECOMPONENTREGISTRY'\">\n        <span> {{getPath(node)}} {{node.data.data.label}}</span>\n      </ng-container>\n\n\n      <ng-container *ngSwitchCase=\"'CONFORMANCEPROFILEREGISTRY'\">\n        <span> {{getPath(node)}} {{node.data.data.label}}</span>\n      </ng-container>\n\n\n\n      <ng-container *ngSwitchCase=\"'COMPOSITEPROFILEREGISTRY'\">\n        <span> {{getPath(node)}} {{node.data.data.label}}</span>\n      </ng-container>\n\n      <ng-container *ngSwitchCase=\"'DATATYPEREGISTRY'\">\n        <span> {{getPath(node)}} {{node.data.data.label}}</span>\n      </ng-container>\n\n\n\n      <ng-container *ngSwitchCase=\"'VALUESETREGISTRY'\">\n        <span> {{getPath(node)}} {{node.data.data.label}}</span>\n      </ng-container>\n\n\n      <ng-container *ngSwitchCase=\"'SEGMENTRGISTRY'\">\n\n        <span> {{getPath(node)}} {{node.data.data.label}}</span>\n      </ng-container>\n\n      <ng-container *ngSwitchCase=\"'DATATYPE'\">\n        <display-label [elm]=\"node.data.data\" [igId]=\"igId\" (click)=\"activateNode(node.id)\" [ngClass]=\"{'active-node':activeNode==node.id}\"></display-label>\n        <display-menu [elm]=\"node.data.data\" *ngIf=\"activeNode==node.id\"></display-menu>\n      </ng-container>\n\n      <ng-container *ngSwitchCase=\"'CONFORMANCEPROFILE'\">\n        <display-label [elm]=\"node.data.data\" [igId]=\"igId\" (click)=\"activateNode(node.id)\" [ngClass]=\"{'active-node':activeNode==node.id}\"></display-label>\n        <display-menu [elm]=\"node.data.data\" *ngIf=\"activeNode==node.id\"></display-menu>\n      </ng-container>\n\n\n      <ng-container *ngSwitchCase=\"'COMPOSITEPROFILE'\">\n        <span>  {{node.data.data.label}}</span>\n        <display-menu [elm]=\"node.data.data\" *ngIf=\"activeNode==node.id\"></display-menu>\n      </ng-container>\n\n\n      <ng-container *ngSwitchCase=\"'SEGMENT'\">\n        <display-label [elm]=\"node.data.data\" [igId]=\"igId\" (click)=\"activateNode(node.id)\" [ngClass]=\"{'active-node':activeNode==node.id}\"></display-label>\n        <display-menu [elm]=\"node.data.data\" *ngIf=\"activeNode==node.id\"></display-menu>\n\n\n\n      </ng-container>\n\n      <ng-container *ngSwitchCase=\"'VALUESET'\" >\n        <display-label [elm]=\"node.data.data\" [igId]=\"igId\" (click)=\"activateNode(node.id)\" [ngClass]=\"{'active-node':activeNode==node.id}\"></display-label>\n        <display-menu [elm]=\"node.data.data\" *ngIf=\"activeNode==node.id\"></display-menu>      </ng-container>\n      <ng-container *ngSwitchCase=\"'PROFILECOMPONENT'\">\n\n         <span>{{node.data.data.label}}</span>\n        <display-menu *ngIf=\"node.active\" [elm]=\"node.data.data\"></display-menu>\n\n\n      </ng-container>\n\n\n    </ng-container>\n\n\n  </ng-template>\n\n\n\n</tree-root>\n</div>\n</div>\n\n\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TocComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_toc_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/service/toc.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular_tree_component__ = __webpack_require__("../../../../angular-tree-component/dist/angular-tree-component.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__ = __webpack_require__("../../../../ngx-contextmenu/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TocComponent = (function () {
    function TocComponent(tocService, sp) {
        var _this = this;
        this.tocService = tocService;
        this.sp = sp;
        this.searchFilter = "";
        this.types = [
            { label: "TEXT", value: "TEXT" },
            { label: "CONFORMANCEPROFILE", value: "CONFORMANCEPROFILE" },
            { label: "SEGMENT", value: "SEGMENT" },
            { label: "DATA TYPES", value: "DATATYPE" },
            { label: "PRFOILECOMPONENT", value: "PROFILECOMPONENT" },
            { label: "Composite Profile ", value: "COMPOSITEPROFILE" },
            { label: "Value Set", value: "VALUESET" }
        ];
        this.scopes = [
            { label: "HL7STANARD", value: "HL7STANDARD" },
            { label: "USER", value: "USER" },
            { label: "HL7 FLAVORS", value: "MASTER" }
        ];
        this.options = {
            allowDrag: function (node) { return node.data.data.type == "TEXT" || node.data.data.type == 'CONFORMANCEPROFILE' || node.data.data.type == 'PROFILE'; },
            actionMapping: {
                mouse: {
                    drop: function (tree, node, $event, _a) {
                        var from = _a.from, to = _a.to;
                        if (from.data.data.type == "TEXT" && (to.parent.data.data.type == "TEXT" || to.parent.data.data.type == "IGDOCUMENT")) {
                            console.log("Dropping");
                            __WEBPACK_IMPORTED_MODULE_2_angular_tree_component__["a" /* TREE_ACTIONS */].MOVE_NODE(tree, node, $event, { from: from, to: to });
                        }
                        if (from.data.data.type == "PROFILE" && to.parent.data.data.type == "IGDOCUMENT") {
                            console.log("Dropping");
                            __WEBPACK_IMPORTED_MODULE_2_angular_tree_component__["a" /* TREE_ACTIONS */].MOVE_NODE(tree, node, $event, { from: from, to: to });
                        }
                        // use from to get the dragged node.
                        // use to.parent and to.index to get the drop location
                    },
                    mouse: {
                        click: __WEBPACK_IMPORTED_MODULE_2_angular_tree_component__["a" /* TREE_ACTIONS */].ACTIVATE
                    },
                    contextMenu: function (model, node, event) {
                        event.preventDefault();
                        _this.onContextMenu(event, node);
                        console.log('in context menu...');
                    }
                }
            }
        };
        this.getPath = function (node) {
            node.data.data.position = parseInt(node.index) + 1; // temporary to be discussed
            if (node.parent.data.data.type == "IGDOCUMENT") {
                return node.data.data.position + ".";
            }
            else {
                return this.getPath(node.parent) + node.data.data.position + ".";
            }
        };
        this.sp.data.map(function (data) { return data.currentIg; }).subscribe(function (x) {
            console.log(x);
            _this.ig = x;
            console.log(_this.ig);
        });
        console.log(this.ig);
    }
    TocComponent.prototype.filterFn = function () {
        var _this = this;
        this.tree.treeModel.filterNodes(function (node) {
            if (node.data.data.domainInfo) {
                if (node.data.data.domainInfo.scope) {
                    return node.data.data.label.startsWith(_this.searchFilter) && (!_this.selectedTypes || _this.selectedTypes.indexOf(node.data.data.type) > -1) && (!_this.selectedScopes || _this.selectedScopes.indexOf(node.data.data.domainInfo.scope) > -1);
                }
            }
            return node.data.data.label.startsWith(_this.searchFilter) && (!_this.selectedTypes || _this.selectedTypes.indexOf(node.data.data.type) > -1) && (!_this.selectedScopes || _this.selectedScopes.length == 0);
        });
    };
    TocComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.igId = this.sp.snapshot.params["igId"];
        this.sp.data.map(function (data) { return data.currentIg; }).subscribe(function (x) {
            console.log(x);
            _this.ig = x;
            console.log(_this.ig);
        });
        console.log(this.igId);
    };
    TocComponent.prototype.print = function (node) {
        console.log(node);
    };
    TocComponent.prototype.ngAfterViewInit = function () {
        console.log(this.ig);
    };
    TocComponent.prototype.getItemFromTargetType = function (node) {
        this.currentNode = node;
        if (node.data.data.type == 'IGDOCUMENT') {
            this.items = [
                { label: 'Add Section', icon: 'fa-plus', command: function (event) {
                        console.log(event);
                    }
                }
            ];
            return this.items;
        }
    };
    TocComponent.prototype.onContextMenu = function (event, node) {
    };
    TocComponent.prototype.addSection = function (node) {
        //console.log(this.toc);
        var data1 = {
            label: "new Section",
            content: "",
            type: "TEXT",
            position: node.data.children.length + 1
        };
        var newNode = { id: "bla", data: data1, children: [] };
        console.log(node);
        node.data.children.push(newNode);
        node.treeModel.update();
        console.log(this.ig.toc.content);
    };
    ;
    TocComponent.prototype.path = function (node) {
        console.log(node);
        return node.path;
    };
    TocComponent.prototype.collapseAll = function () {
        this.tree.treeModel.collapseAll();
    };
    TocComponent.prototype.expandAll = function () {
        this.tree.treeModel.expandAll();
    };
    TocComponent.prototype.filterByTypes = function () {
        var _this = this;
        this.tree.treeModel.filterNodes(function (node) {
            return (!_this.selectedTypes || _this.selectedTypes.indexOf(node.data.data.type) > -1) && (_this.selectedScopes || _this.selectedScopes.indexOf(node.data.data.domainInfo.scope) > -1) && node.data.data.label.startsWith(_this.searchFilter);
        });
    };
    TocComponent.prototype.activateNode = function (node) {
        this.activeNode = node;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__["a" /* ContextMenuComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__["a" /* ContextMenuComponent */])
    ], TocComponent.prototype, "basicMenu", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_2_angular_tree_component__["b" /* TreeComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_angular_tree_component__["b" /* TreeComponent */])
    ], TocComponent.prototype, "tree", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('igcontextmenu'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__["a" /* ContextMenuComponent */])
    ], TocComponent.prototype, "igcontextmenu", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('textcontextmenu'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__["a" /* ContextMenuComponent */])
    ], TocComponent.prototype, "textcontextmenu", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('datatypescontextmenu'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3_ngx_contextmenu__["a" /* ContextMenuComponent */])
    ], TocComponent.prototype, "datatypescontextmenu", void 0);
    TocComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'igamt-toc',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/toc/toc.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__service_toc_service__["a" /* TocService */], __WEBPACK_IMPORTED_MODULE_4__angular_router__["ActivatedRoute"]])
    ], TocComponent);
    return TocComponent;
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators__ = __webpack_require__("../../../../rxjs/_esm5/operators.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contextMenu_item_directive__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.item.directive.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__contextMenu_service__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.service.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__contextMenu_tokens__ = __webpack_require__("../../../../ngx-contextmenu/lib/contextMenu.tokens.js");
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
        this.menuClass = "";
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
        this.subscription.add(_contextMenuService.show.subscribe(function (menuEvent) {
            _this.onMenuEvent(menuEvent);
        }));
    }
    ContextMenuComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    ContextMenuComponent.prototype.onMenuEvent = function (menuEvent) {
        var _this = this;
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
        this._contextMenuService.openContextMenu(__assign({}, menuEvent, { menuItems: this.visibleMenuItems, menuClass: this.menuClass }));
        this._contextMenuService.close.asObservable().pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["a" /* first */])()).subscribe(function (closeEvent) { return _this.close.emit(closeEvent); });
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
        { type: __WEBPACK_IMPORTED_MODULE_4__contextMenu_service__["a" /* ContextMenuService */], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_5__contextMenu_tokens__["a" /* CONTEXT_MENU_OPTIONS */],] },] },
    ]; };
    ContextMenuComponent.propDecorators = {
        "menuClass": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "autoFocus": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "useBootstrap4": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "disabled": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
        "close": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
        "open": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
        "menuItems": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ContentChildren"], args: [__WEBPACK_IMPORTED_MODULE_3__contextMenu_item_directive__["a" /* ContextMenuItemDirective */],] },],
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};






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
            var mouseEvent_1 = event;
            this.fakeElement.getBoundingClientRect = function () {
                return ({
                    bottom: mouseEvent_1.clientY,
                    height: 0,
                    left: mouseEvent_1.clientX,
                    right: mouseEvent_1.clientX,
                    top: mouseEvent_1.clientY,
                    width: 0,
                });
            };
            this.closeAllContextMenus({ eventType: 'cancel', event: event });
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
        var event = context.event, item = context.item, menuItems = context.menuItems, menuClass = context.menuClass;
        var contextMenuContent = overlay.attach(new __WEBPACK_IMPORTED_MODULE_1__angular_cdk_portal__["a" /* ComponentPortal */](__WEBPACK_IMPORTED_MODULE_5__contextMenuContent_component__["a" /* ContextMenuContentComponent */]));
        contextMenuContent.instance.event = event;
        contextMenuContent.instance.item = item;
        contextMenuContent.instance.menuItems = menuItems;
        contextMenuContent.instance.overlay = overlay;
        contextMenuContent.instance.isLeaf = true;
        contextMenuContent.instance.menuClass = menuClass;
        overlay.contextMenu = contextMenuContent.instance;
        var subscriptions = new __WEBPACK_IMPORTED_MODULE_4_rxjs_Subscription__["a" /* Subscription */]();
        subscriptions.add(contextMenuContent.instance.execute.asObservable()
            .subscribe(function (executeEvent) { return _this.closeAllContextMenus(__assign({ eventType: 'execute' }, executeEvent)); }));
        subscriptions.add(contextMenuContent.instance.closeAllMenus.asObservable()
            .subscribe(function (closeAllEvent) { return _this.closeAllContextMenus(__assign({ eventType: 'cancel' }, closeAllEvent)); }));
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
    ContextMenuService.prototype.closeAllContextMenus = function (closeEvent) {
        if (this.overlays) {
            this.close.next(closeEvent);
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
        var _b = _a === void 0 ? {} : _a, exceptRootMenu = _b.exceptRootMenu, event = _b.event;
        if (this.isDestroyingLeafMenu) {
            return;
        }
        this.isDestroyingLeafMenu = true;
        setTimeout(function () {
            var overlay = _this.getLastAttachedOverlay();
            if (_this.overlays.length > 1 && overlay) {
                overlay.detach();
                overlay.dispose();
            }
            if (!exceptRootMenu && _this.overlays.length > 0 && overlay) {
                _this.close.next({ eventType: 'cancel', event: event });
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
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_cdk_overlay__["a" /* Overlay */], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_cdk_overlay__["c" /* ScrollStrategyOptions */], },
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
        this._keyManager = new __WEBPACK_IMPORTED_MODULE_4__angular_cdk_a11y__["a" /* ActiveDescendantKeyManager */](queryList).withWrap();
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
        this.closeLeafMenu.emit({ exceptRootMenu: event.keyCode === ARROW_LEFT_KEYCODE, event: event });
    };
    ContextMenuContentComponent.prototype.closeMenu = function (event) {
        if (event.type === 'click' && event.button === 2) {
            return;
        }
        this.closeAllMenus.emit({ event: event });
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
                    template: "<div class=\"dropdown open show ngx-contextmenu\" [ngClass]=\"menuClass\" tabindex=\"0\">\n      <ul #menu class=\"dropdown-menu show\" style=\"position: static; float: none;\" tabindex=\"0\">\n        <li #li *ngFor=\"let menuItem of menuItems; let i = index\" [class.disabled]=\"!isMenuItemEnabled(menuItem)\"\n            [class.divider]=\"menuItem.divider\" [class.dropdown-divider]=\"useBootstrap4 && menuItem.divider\"\n            [class.active]=\"menuItem.isActive && isMenuItemEnabled(menuItem)\"\n            [attr.role]=\"menuItem.divider ? 'separator' : undefined\">\n          <a *ngIf=\"!menuItem.divider && !menuItem.passive\" href [class.dropdown-item]=\"useBootstrap4\"\n            [class.active]=\"menuItem.isActive && isMenuItemEnabled(menuItem)\"\n            [class.disabled]=\"useBootstrap4 && !isMenuItemEnabled(menuItem)\" [class.hasSubMenu]=\"!!menuItem.subMenu\"\n            (click)=\"onMenuItemSelect(menuItem, $event)\" (mouseenter)=\"onOpenSubMenu(menuItem, $event)\">\n            <ng-template [ngTemplateOutlet]=\"menuItem.template\" [ngTemplateOutletContext]=\"{ $implicit: item }\"></ng-template>\n          </a>\n\n          <span (click)=\"stopEvent($event)\" (contextmenu)=\"stopEvent($event)\" class=\"passive\"\n                *ngIf=\"!menuItem.divider && menuItem.passive\" [class.dropdown-item]=\"useBootstrap4\"\n                [class.disabled]=\"useBootstrap4 && !isMenuItemEnabled(menuItem)\">\n            <ng-template [ngTemplateOutlet]=\"menuItem.template\" [ngTemplateOutletContext]=\"{ $implicit: item }\"></ng-template>\n          </span>\n        </li>\n      </ul>\n    </div>\n  ",
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
        "menuClass": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"] },],
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
                        __WEBPACK_IMPORTED_MODULE_0__angular_cdk_overlay__["b" /* OverlayModule */],
                    ],
                },] },
    ];
    /** @nocollapse */
    ContextMenuModule.ctorParameters = function () { return []; };
    return ContextMenuModule;
}());

//# sourceMappingURL=ngx-contextmenu.js.map

/***/ }),

/***/ "../../../../primeng/multiselect.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/multiselect/multiselect.js"));

/***/ }),

/***/ "../../../../primeng/overlaypanel.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/overlaypanel/overlaypanel.js"));

/***/ }),

/***/ "../../../../primeng/panelmenu.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/panelmenu/panelmenu.js"));

/***/ }),

/***/ "../../../../rxjs/_esm5/AsyncSubject.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AsyncSubject; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/** PURE_IMPORTS_START ._Subject,._Subscription PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * @class AsyncSubject<T>
 */
var AsyncSubject = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(AsyncSubject, _super);
    function AsyncSubject() {
        _super.apply(this, arguments);
        this.value = null;
        this.hasNext = false;
        this.hasCompleted = false;
    }
    /** @deprecated internal use only */ AsyncSubject.prototype._subscribe = function (subscriber) {
        if (this.hasError) {
            subscriber.error(this.thrownError);
            return __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */].EMPTY;
        }
        else if (this.hasCompleted && this.hasNext) {
            subscriber.next(this.value);
            subscriber.complete();
            return __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */].EMPTY;
        }
        return _super.prototype._subscribe.call(this, subscriber);
    };
    AsyncSubject.prototype.next = function (value) {
        if (!this.hasCompleted) {
            this.value = value;
            this.hasNext = true;
        }
    };
    AsyncSubject.prototype.error = function (error) {
        if (!this.hasCompleted) {
            _super.prototype.error.call(this, error);
        }
    };
    AsyncSubject.prototype.complete = function () {
        this.hasCompleted = true;
        if (this.hasNext) {
            _super.prototype.next.call(this, this.value);
        }
        _super.prototype.complete.call(this);
    };
    return AsyncSubject;
}(__WEBPACK_IMPORTED_MODULE_0__Subject__["Subject"]));
//# sourceMappingURL=AsyncSubject.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/ReplaySubject.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReplaySubject; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_queue__ = __webpack_require__("../../../../rxjs/_esm5/scheduler/queue.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__operators_observeOn__ = __webpack_require__("../../../../rxjs/_esm5/operators/observeOn.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_ObjectUnsubscribedError__ = __webpack_require__("../../../../rxjs/_esm5/util/ObjectUnsubscribedError.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__SubjectSubscription__ = __webpack_require__("../../../../rxjs/_esm5/SubjectSubscription.js");
/** PURE_IMPORTS_START ._Subject,._scheduler_queue,._Subscription,._operators_observeOn,._util_ObjectUnsubscribedError,._SubjectSubscription PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};






/**
 * @class ReplaySubject<T>
 */
var ReplaySubject = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
        if (bufferSize === void 0) {
            bufferSize = Number.POSITIVE_INFINITY;
        }
        if (windowTime === void 0) {
            windowTime = Number.POSITIVE_INFINITY;
        }
        _super.call(this);
        this.scheduler = scheduler;
        this._events = [];
        this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        this._windowTime = windowTime < 1 ? 1 : windowTime;
    }
    ReplaySubject.prototype.next = function (value) {
        var now = this._getNow();
        this._events.push(new ReplayEvent(now, value));
        this._trimBufferThenGetEvents();
        _super.prototype.next.call(this, value);
    };
    /** @deprecated internal use only */ ReplaySubject.prototype._subscribe = function (subscriber) {
        var _events = this._trimBufferThenGetEvents();
        var scheduler = this.scheduler;
        var subscription;
        if (this.closed) {
            throw new __WEBPACK_IMPORTED_MODULE_4__util_ObjectUnsubscribedError__["a" /* ObjectUnsubscribedError */]();
        }
        else if (this.hasError) {
            subscription = __WEBPACK_IMPORTED_MODULE_2__Subscription__["a" /* Subscription */].EMPTY;
        }
        else if (this.isStopped) {
            subscription = __WEBPACK_IMPORTED_MODULE_2__Subscription__["a" /* Subscription */].EMPTY;
        }
        else {
            this.observers.push(subscriber);
            subscription = new __WEBPACK_IMPORTED_MODULE_5__SubjectSubscription__["a" /* SubjectSubscription */](this, subscriber);
        }
        if (scheduler) {
            subscriber.add(subscriber = new __WEBPACK_IMPORTED_MODULE_3__operators_observeOn__["a" /* ObserveOnSubscriber */](subscriber, scheduler));
        }
        var len = _events.length;
        for (var i = 0; i < len && !subscriber.closed; i++) {
            subscriber.next(_events[i].value);
        }
        if (this.hasError) {
            subscriber.error(this.thrownError);
        }
        else if (this.isStopped) {
            subscriber.complete();
        }
        return subscription;
    };
    ReplaySubject.prototype._getNow = function () {
        return (this.scheduler || __WEBPACK_IMPORTED_MODULE_1__scheduler_queue__["a" /* queue */]).now();
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
        var now = this._getNow();
        var _bufferSize = this._bufferSize;
        var _windowTime = this._windowTime;
        var _events = this._events;
        var eventsCount = _events.length;
        var spliceCount = 0;
        // Trim events that fall out of the time window.
        // Start at the front of the list. Break early once
        // we encounter an event that falls within the window.
        while (spliceCount < eventsCount) {
            if ((now - _events[spliceCount].time) < _windowTime) {
                break;
            }
            spliceCount++;
        }
        if (eventsCount > _bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
        }
        if (spliceCount > 0) {
            _events.splice(0, spliceCount);
        }
        return _events;
    };
    return ReplaySubject;
}(__WEBPACK_IMPORTED_MODULE_0__Subject__["Subject"]));
var ReplayEvent = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function ReplayEvent(time, value) {
        this.time = time;
        this.value = value;
    }
    return ReplayEvent;
}());
//# sourceMappingURL=ReplaySubject.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/observable/FromEventObservable.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FromEventObservable; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__("../../../../rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__("../../../../rxjs/_esm5/util/tryCatch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_isFunction__ = __webpack_require__("../../../../rxjs/_esm5/util/isFunction.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_errorObject__ = __webpack_require__("../../../../rxjs/_esm5/util/errorObject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/** PURE_IMPORTS_START .._Observable,.._util_tryCatch,.._util_isFunction,.._util_errorObject,.._Subscription PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





var toString = Object.prototype.toString;
function isNodeStyleEventEmitter(sourceObj) {
    return !!sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
}
function isJQueryStyleEventEmitter(sourceObj) {
    return !!sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
}
function isNodeList(sourceObj) {
    return !!sourceObj && toString.call(sourceObj) === '[object NodeList]';
}
function isHTMLCollection(sourceObj) {
    return !!sourceObj && toString.call(sourceObj) === '[object HTMLCollection]';
}
function isEventTarget(sourceObj) {
    return !!sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var FromEventObservable = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(FromEventObservable, _super);
    function FromEventObservable(sourceObj, eventName, selector, options) {
        _super.call(this);
        this.sourceObj = sourceObj;
        this.eventName = eventName;
        this.selector = selector;
        this.options = options;
    }
    /* tslint:enable:max-line-length */
    /**
     * Creates an Observable that emits events of a specific type coming from the
     * given event target.
     *
     * <span class="informal">Creates an Observable from DOM events, or Node.js
     * EventEmitter events or others.</span>
     *
     * <img src="./img/fromEvent.png" width="100%">
     *
     * `fromEvent` accepts as a first argument event target, which is an object with methods
     * for registering event handler functions. As a second argument it takes string that indicates
     * type of event we want to listen for. `fromEvent` supports selected types of event targets,
     * which are described in detail below. If your event target does not match any of the ones listed,
     * you should use {@link fromEventPattern}, which can be used on arbitrary APIs.
     * When it comes to APIs supported by `fromEvent`, their methods for adding and removing event
     * handler functions have different names, but they all accept a string describing event type
     * and function itself, which will be called whenever said event happens.
     *
     * Every time resulting Observable is subscribed, event handler function will be registered
     * to event target on given event type. When that event fires, value
     * passed as a first argument to registered function will be emitted by output Observable.
     * When Observable is unsubscribed, function will be unregistered from event target.
     *
     * Note that if event target calls registered function with more than one argument, second
     * and following arguments will not appear in resulting stream. In order to get access to them,
     * you can pass to `fromEvent` optional project function, which will be called with all arguments
     * passed to event handler. Output Observable will then emit value returned by project function,
     * instead of the usual value.
     *
     * Remember that event targets listed below are checked via duck typing. It means that
     * no matter what kind of object you have and no matter what environment you work in,
     * you can safely use `fromEvent` on that object if it exposes described methods (provided
     * of course they behave as was described above). So for example if Node.js library exposes
     * event target which has the same method names as DOM EventTarget, `fromEvent` is still
     * a good choice.
     *
     * If the API you use is more callback then event handler oriented (subscribed
     * callback function fires only once and thus there is no need to manually
     * unregister it), you should use {@link bindCallback} or {@link bindNodeCallback}
     * instead.
     *
     * `fromEvent` supports following types of event targets:
     *
     * **DOM EventTarget**
     *
     * This is an object with `addEventListener` and `removeEventListener` methods.
     *
     * In the browser, `addEventListener` accepts - apart from event type string and event
     * handler function arguments - optional third parameter, which is either an object or boolean,
     * both used for additional configuration how and when passed function will be called. When
     * `fromEvent` is used with event target of that type, you can provide this values
     * as third parameter as well.
     *
     * **Node.js EventEmitter**
     *
     * An object with `addListener` and `removeListener` methods.
     *
     * **JQuery-style event target**
     *
     * An object with `on` and `off` methods
     *
     * **DOM NodeList**
     *
     * List of DOM Nodes, returned for example by `document.querySelectorAll` or `Node.childNodes`.
     *
     * Although this collection is not event target in itself, `fromEvent` will iterate over all Nodes
     * it contains and install event handler function in every of them. When returned Observable
     * is unsubscribed, function will be removed from all Nodes.
     *
     * **DOM HtmlCollection**
     *
     * Just as in case of NodeList it is a collection of DOM nodes. Here as well event handler function is
     * installed and removed in each of elements.
     *
     *
     * @example <caption>Emits clicks happening on the DOM document</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * clicks.subscribe(x => console.log(x));
     *
     * // Results in:
     * // MouseEvent object logged to console every time a click
     * // occurs on the document.
     *
     *
     * @example <caption>Use addEventListener with capture option</caption>
     * var clicksInDocument = Rx.Observable.fromEvent(document, 'click', true); // note optional configuration parameter
     *                                                                          // which will be passed to addEventListener
     * var clicksInDiv = Rx.Observable.fromEvent(someDivInDocument, 'click');
     *
     * clicksInDocument.subscribe(() => console.log('document'));
     * clicksInDiv.subscribe(() => console.log('div'));
     *
     * // By default events bubble UP in DOM tree, so normally
     * // when we would click on div in document
     * // "div" would be logged first and then "document".
     * // Since we specified optional `capture` option, document
     * // will catch event when it goes DOWN DOM tree, so console
     * // will log "document" and then "div".
     *
     * @see {@link bindCallback}
     * @see {@link bindNodeCallback}
     * @see {@link fromEventPattern}
     *
     * @param {EventTargetLike} target The DOM EventTarget, Node.js
     * EventEmitter, JQuery-like event target, NodeList or HTMLCollection to attach the event handler to.
     * @param {string} eventName The event name of interest, being emitted by the
     * `target`.
     * @param {EventListenerOptions} [options] Options to pass through to addEventListener
     * @param {SelectorMethodSignature<T>} [selector] An optional function to
     * post-process results. It takes the arguments from the event handler and
     * should return a single value.
     * @return {Observable<T>}
     * @static true
     * @name fromEvent
     * @owner Observable
     */
    FromEventObservable.create = function (target, eventName, options, selector) {
        if (Object(__WEBPACK_IMPORTED_MODULE_2__util_isFunction__["a" /* isFunction */])(options)) {
            selector = options;
            options = undefined;
        }
        return new FromEventObservable(target, eventName, selector, options);
    };
    FromEventObservable.setupSubscription = function (sourceObj, eventName, handler, subscriber, options) {
        var unsubscribe;
        if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
            for (var i = 0, len = sourceObj.length; i < len; i++) {
                FromEventObservable.setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
            }
        }
        else if (isEventTarget(sourceObj)) {
            var source_1 = sourceObj;
            sourceObj.addEventListener(eventName, handler, options);
            unsubscribe = function () { return source_1.removeEventListener(eventName, handler, options); };
        }
        else if (isJQueryStyleEventEmitter(sourceObj)) {
            var source_2 = sourceObj;
            sourceObj.on(eventName, handler);
            unsubscribe = function () { return source_2.off(eventName, handler); };
        }
        else if (isNodeStyleEventEmitter(sourceObj)) {
            var source_3 = sourceObj;
            sourceObj.addListener(eventName, handler);
            unsubscribe = function () { return source_3.removeListener(eventName, handler); };
        }
        else {
            throw new TypeError('Invalid event target');
        }
        subscriber.add(new __WEBPACK_IMPORTED_MODULE_4__Subscription__["a" /* Subscription */](unsubscribe));
    };
    /** @deprecated internal use only */ FromEventObservable.prototype._subscribe = function (subscriber) {
        var sourceObj = this.sourceObj;
        var eventName = this.eventName;
        var options = this.options;
        var selector = this.selector;
        var handler = selector ? function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(selector).apply(void 0, args);
            if (result === __WEBPACK_IMPORTED_MODULE_3__util_errorObject__["a" /* errorObject */]) {
                subscriber.error(__WEBPACK_IMPORTED_MODULE_3__util_errorObject__["a" /* errorObject */].e);
            }
            else {
                subscriber.next(result);
            }
        } : function (e) { return subscriber.next(e); };
        FromEventObservable.setupSubscription(sourceObj, eventName, handler, subscriber, options);
    };
    return FromEventObservable;
}(__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */]));
//# sourceMappingURL=FromEventObservable.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/observable/TimerObservable.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimerObservable; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isNumeric__ = __webpack_require__("../../../../rxjs/_esm5/util/isNumeric.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Observable__ = __webpack_require__("../../../../rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scheduler_async__ = __webpack_require__("../../../../rxjs/_esm5/scheduler/async.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_isScheduler__ = __webpack_require__("../../../../rxjs/_esm5/util/isScheduler.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_isDate__ = __webpack_require__("../../../../rxjs/_esm5/util/isDate.js");
/** PURE_IMPORTS_START .._util_isNumeric,.._Observable,.._scheduler_async,.._util_isScheduler,.._util_isDate PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var TimerObservable = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(TimerObservable, _super);
    function TimerObservable(dueTime, period, scheduler) {
        if (dueTime === void 0) {
            dueTime = 0;
        }
        _super.call(this);
        this.period = -1;
        this.dueTime = 0;
        if (Object(__WEBPACK_IMPORTED_MODULE_0__util_isNumeric__["a" /* isNumeric */])(period)) {
            this.period = Number(period) < 1 && 1 || Number(period);
        }
        else if (Object(__WEBPACK_IMPORTED_MODULE_3__util_isScheduler__["a" /* isScheduler */])(period)) {
            scheduler = period;
        }
        if (!Object(__WEBPACK_IMPORTED_MODULE_3__util_isScheduler__["a" /* isScheduler */])(scheduler)) {
            scheduler = __WEBPACK_IMPORTED_MODULE_2__scheduler_async__["a" /* async */];
        }
        this.scheduler = scheduler;
        this.dueTime = Object(__WEBPACK_IMPORTED_MODULE_4__util_isDate__["a" /* isDate */])(dueTime) ?
            (+dueTime - this.scheduler.now()) :
            dueTime;
    }
    /**
     * Creates an Observable that starts emitting after an `initialDelay` and
     * emits ever increasing numbers after each `period` of time thereafter.
     *
     * <span class="informal">Its like {@link interval}, but you can specify when
     * should the emissions start.</span>
     *
     * <img src="./img/timer.png" width="100%">
     *
     * `timer` returns an Observable that emits an infinite sequence of ascending
     * integers, with a constant interval of time, `period` of your choosing
     * between those emissions. The first emission happens after the specified
     * `initialDelay`. The initial delay may be a {@link Date}. By default, this
     * operator uses the `async` IScheduler to provide a notion of time, but you
     * may pass any IScheduler to it. If `period` is not specified, the output
     * Observable emits only one value, `0`. Otherwise, it emits an infinite
     * sequence.
     *
     * @example <caption>Emits ascending numbers, one every second (1000ms), starting after 3 seconds</caption>
     * var numbers = Rx.Observable.timer(3000, 1000);
     * numbers.subscribe(x => console.log(x));
     *
     * @example <caption>Emits one number after five seconds</caption>
     * var numbers = Rx.Observable.timer(5000);
     * numbers.subscribe(x => console.log(x));
     *
     * @see {@link interval}
     * @see {@link delay}
     *
     * @param {number|Date} initialDelay The initial delay time to wait before
     * emitting the first value of `0`.
     * @param {number} [period] The period of time between emissions of the
     * subsequent numbers.
     * @param {Scheduler} [scheduler=async] The IScheduler to use for scheduling
     * the emission of values, and providing a notion of "time".
     * @return {Observable} An Observable that emits a `0` after the
     * `initialDelay` and ever increasing numbers after each `period` of time
     * thereafter.
     * @static true
     * @name timer
     * @owner Observable
     */
    TimerObservable.create = function (initialDelay, period, scheduler) {
        if (initialDelay === void 0) {
            initialDelay = 0;
        }
        return new TimerObservable(initialDelay, period, scheduler);
    };
    TimerObservable.dispatch = function (state) {
        var index = state.index, period = state.period, subscriber = state.subscriber;
        var action = this;
        subscriber.next(index);
        if (subscriber.closed) {
            return;
        }
        else if (period === -1) {
            return subscriber.complete();
        }
        state.index = index + 1;
        action.schedule(state, period);
    };
    /** @deprecated internal use only */ TimerObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var _a = this, period = _a.period, dueTime = _a.dueTime, scheduler = _a.scheduler;
        return scheduler.schedule(TimerObservable.dispatch, dueTime, {
            index: index, period: period, subscriber: subscriber
        });
    };
    return TimerObservable;
}(__WEBPACK_IMPORTED_MODULE_1__Observable__["a" /* Observable */]));
//# sourceMappingURL=TimerObservable.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/observable/concat.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = concat;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isScheduler__ = __webpack_require__("../../../../rxjs/_esm5/util/isScheduler.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__of__ = __webpack_require__("../../../../rxjs/_esm5/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__from__ = __webpack_require__("../../../../rxjs/_esm5/observable/from.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__operators_concatAll__ = __webpack_require__("../../../../rxjs/_esm5/operators/concatAll.js");
/** PURE_IMPORTS_START .._util_isScheduler,._of,._from,.._operators_concatAll PURE_IMPORTS_END */




/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which sequentially emits all values from given
 * Observable and then moves on to the next.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * <img src="./img/concat.png" width="100%">
 *
 * `concat` joins multiple Observables together, by subscribing to them one at a time and
 * merging their results into the output Observable. You can pass either an array of
 * Observables, or put them directly as arguments. Passing an empty array will result
 * in Observable that completes immediately.
 *
 * `concat` will subscribe to first input Observable and emit all its values, without
 * changing or affecting them in any way. When that Observable completes, it will
 * subscribe to then next Observable passed and, again, emit its values. This will be
 * repeated, until the operator runs out of Observables. When last input Observable completes,
 * `concat` will complete as well. At any given moment only one Observable passed to operator
 * emits values. If you would like to emit values from passed Observables concurrently, check out
 * {@link merge} instead, especially with optional `concurrent` parameter. As a matter of fact,
 * `concat` is an equivalent of `merge` operator with `concurrent` parameter set to `1`.
 *
 * Note that if some input Observable never completes, `concat` will also never complete
 * and Observables following the one that did not complete will never be subscribed. On the other
 * hand, if some Observable simply completes immediately after it is subscribed, it will be
 * invisible for `concat`, which will just move on to the next Observable.
 *
 * If any Observable in chain errors, instead of passing control to the next Observable,
 * `concat` will error immediately as well. Observables that would be subscribed after
 * the one that emitted error, never will.
 *
 * If you pass to `concat` the same Observable many times, its stream of values
 * will be "replayed" on every subscription, which means you can repeat given Observable
 * as many times as you like. If passing the same Observable to `concat` 1000 times becomes tedious,
 * you can always use {@link repeat}.
 *
 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
 * var timer = Rx.Observable.interval(1000).take(4);
 * var sequence = Rx.Observable.range(1, 10);
 * var result = Rx.Observable.concat(timer, sequence);
 * result.subscribe(x => console.log(x));
 *
 * // results in:
 * // 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3 -immediate-> 1 ... 10
 *
 *
 * @example <caption>Concatenate an array of 3 Observables</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var result = Rx.Observable.concat([timer1, timer2, timer3]); // note that array is passed
 * result.subscribe(x => console.log(x));
 *
 * // results in the following:
 * // (Prints to console sequentially)
 * // -1000ms-> 0 -1000ms-> 1 -1000ms-> ... 9
 * // -2000ms-> 0 -2000ms-> 1 -2000ms-> ... 5
 * // -500ms-> 0 -500ms-> 1 -500ms-> ... 9
 *
 *
 * @example <caption>Concatenate the same Observable to repeat it</caption>
 * const timer = Rx.Observable.interval(1000).take(2);
 *
 * Rx.Observable.concat(timer, timer) // concating the same Observable!
 * .subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('...and it is done!')
 * );
 *
 * // Logs:
 * // 0 after 1s
 * // 1 after 2s
 * // 0 after 3s
 * // 1 after 4s
 * // "...and it is done!" also after 4s
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {ObservableInput} input1 An input Observable to concatenate with others.
 * @param {ObservableInput} input2 An input Observable to concatenate with others.
 * More than one input Observables may be given as argument.
 * @param {Scheduler} [scheduler=null] An optional IScheduler to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @static true
 * @name concat
 * @owner Observable
 */
function concat() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    if (observables.length === 1 || (observables.length === 2 && Object(__WEBPACK_IMPORTED_MODULE_0__util_isScheduler__["a" /* isScheduler */])(observables[1]))) {
        return Object(__WEBPACK_IMPORTED_MODULE_2__from__["a" /* from */])(observables[0]);
    }
    return Object(__WEBPACK_IMPORTED_MODULE_3__operators_concatAll__["a" /* concatAll */])()(__WEBPACK_IMPORTED_MODULE_1__of__["a" /* of */].apply(void 0, observables));
}
//# sourceMappingURL=concat.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/observable/fromEvent.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fromEvent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FromEventObservable__ = __webpack_require__("../../../../rxjs/_esm5/observable/FromEventObservable.js");
/** PURE_IMPORTS_START ._FromEventObservable PURE_IMPORTS_END */

var fromEvent = __WEBPACK_IMPORTED_MODULE_0__FromEventObservable__["a" /* FromEventObservable */].create;
//# sourceMappingURL=fromEvent.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/observable/race.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = race;
/* unused harmony export RaceOperator */
/* unused harmony export RaceSubscriber */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isArray__ = __webpack_require__("../../../../rxjs/_esm5/util/isArray.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_ArrayObservable__ = __webpack_require__("../../../../rxjs/_esm5/observable/ArrayObservable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._util_isArray,.._observable_ArrayObservable,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




function race() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    // if the only argument is an array, it was most likely called with
    // `race([obs1, obs2, ...])`
    if (observables.length === 1) {
        if (Object(__WEBPACK_IMPORTED_MODULE_0__util_isArray__["a" /* isArray */])(observables[0])) {
            observables = observables[0];
        }
        else {
            return observables[0];
        }
    }
    return new __WEBPACK_IMPORTED_MODULE_1__observable_ArrayObservable__["a" /* ArrayObservable */](observables).lift(new RaceOperator());
}
var RaceOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function RaceOperator() {
    }
    RaceOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RaceSubscriber(subscriber));
    };
    return RaceOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RaceSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(RaceSubscriber, _super);
    function RaceSubscriber(destination) {
        _super.call(this, destination);
        this.hasFirst = false;
        this.observables = [];
        this.subscriptions = [];
    }
    RaceSubscriber.prototype._next = function (observable) {
        this.observables.push(observable);
    };
    RaceSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            for (var i = 0; i < len && !this.hasFirst; i++) {
                var observable = observables[i];
                var subscription = Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, observable, observable, i);
                if (this.subscriptions) {
                    this.subscriptions.push(subscription);
                }
                this.add(subscription);
            }
            this.observables = null;
        }
    };
    RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (!this.hasFirst) {
            this.hasFirst = true;
            for (var i = 0; i < this.subscriptions.length; i++) {
                if (i !== outerIndex) {
                    var subscription = this.subscriptions[i];
                    subscription.unsubscribe();
                    this.remove(subscription);
                }
            }
            this.subscriptions = null;
        }
        this.destination.next(innerValue);
    };
    return RaceSubscriber;
}(__WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=race.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/observable/timer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return timer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__TimerObservable__ = __webpack_require__("../../../../rxjs/_esm5/observable/TimerObservable.js");
/** PURE_IMPORTS_START ._TimerObservable PURE_IMPORTS_END */

var timer = __WEBPACK_IMPORTED_MODULE_0__TimerObservable__["a" /* TimerObservable */].create;
//# sourceMappingURL=timer.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__operators_audit__ = __webpack_require__("../../../../rxjs/_esm5/operators/audit.js");
/* unused harmony reexport audit */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operators_auditTime__ = __webpack_require__("../../../../rxjs/_esm5/operators/auditTime.js");
/* unused harmony reexport auditTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__operators_buffer__ = __webpack_require__("../../../../rxjs/_esm5/operators/buffer.js");
/* unused harmony reexport buffer */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__operators_bufferCount__ = __webpack_require__("../../../../rxjs/_esm5/operators/bufferCount.js");
/* unused harmony reexport bufferCount */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__operators_bufferTime__ = __webpack_require__("../../../../rxjs/_esm5/operators/bufferTime.js");
/* unused harmony reexport bufferTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__operators_bufferToggle__ = __webpack_require__("../../../../rxjs/_esm5/operators/bufferToggle.js");
/* unused harmony reexport bufferToggle */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__operators_bufferWhen__ = __webpack_require__("../../../../rxjs/_esm5/operators/bufferWhen.js");
/* unused harmony reexport bufferWhen */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__operators_catchError__ = __webpack_require__("../../../../rxjs/_esm5/operators/catchError.js");
/* unused harmony reexport catchError */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__operators_combineAll__ = __webpack_require__("../../../../rxjs/_esm5/operators/combineAll.js");
/* unused harmony reexport combineAll */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__operators_combineLatest__ = __webpack_require__("../../../../rxjs/_esm5/operators/combineLatest.js");
/* unused harmony reexport combineLatest */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__operators_concat__ = __webpack_require__("../../../../rxjs/_esm5/operators/concat.js");
/* unused harmony reexport concat */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__operators_concatAll__ = __webpack_require__("../../../../rxjs/_esm5/operators/concatAll.js");
/* unused harmony reexport concatAll */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__operators_concatMap__ = __webpack_require__("../../../../rxjs/_esm5/operators/concatMap.js");
/* unused harmony reexport concatMap */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__operators_concatMapTo__ = __webpack_require__("../../../../rxjs/_esm5/operators/concatMapTo.js");
/* unused harmony reexport concatMapTo */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__operators_count__ = __webpack_require__("../../../../rxjs/_esm5/operators/count.js");
/* unused harmony reexport count */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__operators_debounce__ = __webpack_require__("../../../../rxjs/_esm5/operators/debounce.js");
/* unused harmony reexport debounce */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__operators_debounceTime__ = __webpack_require__("../../../../rxjs/_esm5/operators/debounceTime.js");
/* unused harmony reexport debounceTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__operators_defaultIfEmpty__ = __webpack_require__("../../../../rxjs/_esm5/operators/defaultIfEmpty.js");
/* unused harmony reexport defaultIfEmpty */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__operators_delay__ = __webpack_require__("../../../../rxjs/_esm5/operators/delay.js");
/* unused harmony reexport delay */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__operators_delayWhen__ = __webpack_require__("../../../../rxjs/_esm5/operators/delayWhen.js");
/* unused harmony reexport delayWhen */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__operators_dematerialize__ = __webpack_require__("../../../../rxjs/_esm5/operators/dematerialize.js");
/* unused harmony reexport dematerialize */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__operators_distinct__ = __webpack_require__("../../../../rxjs/_esm5/operators/distinct.js");
/* unused harmony reexport distinct */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__operators_distinctUntilChanged__ = __webpack_require__("../../../../rxjs/_esm5/operators/distinctUntilChanged.js");
/* unused harmony reexport distinctUntilChanged */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__operators_distinctUntilKeyChanged__ = __webpack_require__("../../../../rxjs/_esm5/operators/distinctUntilKeyChanged.js");
/* unused harmony reexport distinctUntilKeyChanged */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__operators_elementAt__ = __webpack_require__("../../../../rxjs/_esm5/operators/elementAt.js");
/* unused harmony reexport elementAt */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__operators_every__ = __webpack_require__("../../../../rxjs/_esm5/operators/every.js");
/* unused harmony reexport every */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__operators_exhaust__ = __webpack_require__("../../../../rxjs/_esm5/operators/exhaust.js");
/* unused harmony reexport exhaust */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__operators_exhaustMap__ = __webpack_require__("../../../../rxjs/_esm5/operators/exhaustMap.js");
/* unused harmony reexport exhaustMap */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__operators_expand__ = __webpack_require__("../../../../rxjs/_esm5/operators/expand.js");
/* unused harmony reexport expand */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__operators_filter__ = __webpack_require__("../../../../rxjs/_esm5/operators/filter.js");
/* unused harmony reexport filter */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__operators_finalize__ = __webpack_require__("../../../../rxjs/_esm5/operators/finalize.js");
/* unused harmony reexport finalize */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__operators_find__ = __webpack_require__("../../../../rxjs/_esm5/operators/find.js");
/* unused harmony reexport find */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__operators_findIndex__ = __webpack_require__("../../../../rxjs/_esm5/operators/findIndex.js");
/* unused harmony reexport findIndex */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__operators_first__ = __webpack_require__("../../../../rxjs/_esm5/operators/first.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_33__operators_first__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__operators_groupBy__ = __webpack_require__("../../../../rxjs/_esm5/operators/groupBy.js");
/* unused harmony reexport groupBy */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__operators_ignoreElements__ = __webpack_require__("../../../../rxjs/_esm5/operators/ignoreElements.js");
/* unused harmony reexport ignoreElements */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__operators_isEmpty__ = __webpack_require__("../../../../rxjs/_esm5/operators/isEmpty.js");
/* unused harmony reexport isEmpty */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__operators_last__ = __webpack_require__("../../../../rxjs/_esm5/operators/last.js");
/* unused harmony reexport last */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__operators_map__ = __webpack_require__("../../../../rxjs/_esm5/operators/map.js");
/* unused harmony reexport map */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__operators_mapTo__ = __webpack_require__("../../../../rxjs/_esm5/operators/mapTo.js");
/* unused harmony reexport mapTo */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__operators_materialize__ = __webpack_require__("../../../../rxjs/_esm5/operators/materialize.js");
/* unused harmony reexport materialize */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__operators_max__ = __webpack_require__("../../../../rxjs/_esm5/operators/max.js");
/* unused harmony reexport max */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__operators_merge__ = __webpack_require__("../../../../rxjs/_esm5/operators/merge.js");
/* unused harmony reexport merge */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__operators_mergeAll__ = __webpack_require__("../../../../rxjs/_esm5/operators/mergeAll.js");
/* unused harmony reexport mergeAll */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__operators_mergeMap__ = __webpack_require__("../../../../rxjs/_esm5/operators/mergeMap.js");
/* unused harmony reexport mergeMap */
/* unused harmony reexport flatMap */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__operators_mergeMapTo__ = __webpack_require__("../../../../rxjs/_esm5/operators/mergeMapTo.js");
/* unused harmony reexport mergeMapTo */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__operators_mergeScan__ = __webpack_require__("../../../../rxjs/_esm5/operators/mergeScan.js");
/* unused harmony reexport mergeScan */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__operators_min__ = __webpack_require__("../../../../rxjs/_esm5/operators/min.js");
/* unused harmony reexport min */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__operators_multicast__ = __webpack_require__("../../../../rxjs/_esm5/operators/multicast.js");
/* unused harmony reexport multicast */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__operators_observeOn__ = __webpack_require__("../../../../rxjs/_esm5/operators/observeOn.js");
/* unused harmony reexport observeOn */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__operators_onErrorResumeNext__ = __webpack_require__("../../../../rxjs/_esm5/operators/onErrorResumeNext.js");
/* unused harmony reexport onErrorResumeNext */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__operators_pairwise__ = __webpack_require__("../../../../rxjs/_esm5/operators/pairwise.js");
/* unused harmony reexport pairwise */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__operators_partition__ = __webpack_require__("../../../../rxjs/_esm5/operators/partition.js");
/* unused harmony reexport partition */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__operators_pluck__ = __webpack_require__("../../../../rxjs/_esm5/operators/pluck.js");
/* unused harmony reexport pluck */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__operators_publish__ = __webpack_require__("../../../../rxjs/_esm5/operators/publish.js");
/* unused harmony reexport publish */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__operators_publishBehavior__ = __webpack_require__("../../../../rxjs/_esm5/operators/publishBehavior.js");
/* unused harmony reexport publishBehavior */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__operators_publishLast__ = __webpack_require__("../../../../rxjs/_esm5/operators/publishLast.js");
/* unused harmony reexport publishLast */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__operators_publishReplay__ = __webpack_require__("../../../../rxjs/_esm5/operators/publishReplay.js");
/* unused harmony reexport publishReplay */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__operators_race__ = __webpack_require__("../../../../rxjs/_esm5/operators/race.js");
/* unused harmony reexport race */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__operators_reduce__ = __webpack_require__("../../../../rxjs/_esm5/operators/reduce.js");
/* unused harmony reexport reduce */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__operators_repeat__ = __webpack_require__("../../../../rxjs/_esm5/operators/repeat.js");
/* unused harmony reexport repeat */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__operators_repeatWhen__ = __webpack_require__("../../../../rxjs/_esm5/operators/repeatWhen.js");
/* unused harmony reexport repeatWhen */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_62__operators_retry__ = __webpack_require__("../../../../rxjs/_esm5/operators/retry.js");
/* unused harmony reexport retry */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_63__operators_retryWhen__ = __webpack_require__("../../../../rxjs/_esm5/operators/retryWhen.js");
/* unused harmony reexport retryWhen */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_64__operators_refCount__ = __webpack_require__("../../../../rxjs/_esm5/operators/refCount.js");
/* unused harmony reexport refCount */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_65__operators_sample__ = __webpack_require__("../../../../rxjs/_esm5/operators/sample.js");
/* unused harmony reexport sample */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_66__operators_sampleTime__ = __webpack_require__("../../../../rxjs/_esm5/operators/sampleTime.js");
/* unused harmony reexport sampleTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_67__operators_scan__ = __webpack_require__("../../../../rxjs/_esm5/operators/scan.js");
/* unused harmony reexport scan */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_68__operators_sequenceEqual__ = __webpack_require__("../../../../rxjs/_esm5/operators/sequenceEqual.js");
/* unused harmony reexport sequenceEqual */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_69__operators_share__ = __webpack_require__("../../../../rxjs/_esm5/operators/share.js");
/* unused harmony reexport share */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_70__operators_shareReplay__ = __webpack_require__("../../../../rxjs/_esm5/operators/shareReplay.js");
/* unused harmony reexport shareReplay */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_71__operators_single__ = __webpack_require__("../../../../rxjs/_esm5/operators/single.js");
/* unused harmony reexport single */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_72__operators_skip__ = __webpack_require__("../../../../rxjs/_esm5/operators/skip.js");
/* unused harmony reexport skip */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_73__operators_skipLast__ = __webpack_require__("../../../../rxjs/_esm5/operators/skipLast.js");
/* unused harmony reexport skipLast */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_74__operators_skipUntil__ = __webpack_require__("../../../../rxjs/_esm5/operators/skipUntil.js");
/* unused harmony reexport skipUntil */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_75__operators_skipWhile__ = __webpack_require__("../../../../rxjs/_esm5/operators/skipWhile.js");
/* unused harmony reexport skipWhile */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_76__operators_startWith__ = __webpack_require__("../../../../rxjs/_esm5/operators/startWith.js");
/* unused harmony reexport startWith */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_77__operators_switchAll__ = __webpack_require__("../../../../rxjs/_esm5/operators/switchAll.js");
/* unused harmony reexport switchAll */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_78__operators_switchMap__ = __webpack_require__("../../../../rxjs/_esm5/operators/switchMap.js");
/* unused harmony reexport switchMap */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_79__operators_switchMapTo__ = __webpack_require__("../../../../rxjs/_esm5/operators/switchMapTo.js");
/* unused harmony reexport switchMapTo */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_80__operators_take__ = __webpack_require__("../../../../rxjs/_esm5/operators/take.js");
/* unused harmony reexport take */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_81__operators_takeLast__ = __webpack_require__("../../../../rxjs/_esm5/operators/takeLast.js");
/* unused harmony reexport takeLast */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_82__operators_takeUntil__ = __webpack_require__("../../../../rxjs/_esm5/operators/takeUntil.js");
/* unused harmony reexport takeUntil */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_83__operators_takeWhile__ = __webpack_require__("../../../../rxjs/_esm5/operators/takeWhile.js");
/* unused harmony reexport takeWhile */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_84__operators_tap__ = __webpack_require__("../../../../rxjs/_esm5/operators/tap.js");
/* unused harmony reexport tap */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_85__operators_throttle__ = __webpack_require__("../../../../rxjs/_esm5/operators/throttle.js");
/* unused harmony reexport throttle */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_86__operators_throttleTime__ = __webpack_require__("../../../../rxjs/_esm5/operators/throttleTime.js");
/* unused harmony reexport throttleTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_87__operators_timeInterval__ = __webpack_require__("../../../../rxjs/_esm5/operators/timeInterval.js");
/* unused harmony reexport timeInterval */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_88__operators_timeout__ = __webpack_require__("../../../../rxjs/_esm5/operators/timeout.js");
/* unused harmony reexport timeout */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_89__operators_timeoutWith__ = __webpack_require__("../../../../rxjs/_esm5/operators/timeoutWith.js");
/* unused harmony reexport timeoutWith */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_90__operators_timestamp__ = __webpack_require__("../../../../rxjs/_esm5/operators/timestamp.js");
/* unused harmony reexport timestamp */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_91__operators_toArray__ = __webpack_require__("../../../../rxjs/_esm5/operators/toArray.js");
/* unused harmony reexport toArray */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_92__operators_window__ = __webpack_require__("../../../../rxjs/_esm5/operators/window.js");
/* unused harmony reexport window */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_93__operators_windowCount__ = __webpack_require__("../../../../rxjs/_esm5/operators/windowCount.js");
/* unused harmony reexport windowCount */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_94__operators_windowTime__ = __webpack_require__("../../../../rxjs/_esm5/operators/windowTime.js");
/* unused harmony reexport windowTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_95__operators_windowToggle__ = __webpack_require__("../../../../rxjs/_esm5/operators/windowToggle.js");
/* unused harmony reexport windowToggle */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_96__operators_windowWhen__ = __webpack_require__("../../../../rxjs/_esm5/operators/windowWhen.js");
/* unused harmony reexport windowWhen */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_97__operators_withLatestFrom__ = __webpack_require__("../../../../rxjs/_esm5/operators/withLatestFrom.js");
/* unused harmony reexport withLatestFrom */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_98__operators_zip__ = __webpack_require__("../../../../rxjs/_esm5/operators/zip.js");
/* unused harmony reexport zip */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_99__operators_zipAll__ = __webpack_require__("../../../../rxjs/_esm5/operators/zipAll.js");
/* unused harmony reexport zipAll */
/** PURE_IMPORTS_START  PURE_IMPORTS_END */














































































/**
 * TODO(https://github.com/ReactiveX/rxjs/issues/2900): Add back subscribeOn once it can be
 * treeshaken. Currently if this export is added back, it
 * forces apps to bring in asap scheduler along with
 * Immediate, root, and other supporting code.
 */
// export { subscribeOn } from './operators/subscribeOn';























//# sourceMappingURL=operators.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/audit.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = audit;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_tryCatch__ = __webpack_require__("../../../../rxjs/_esm5/util/tryCatch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_errorObject__ = __webpack_require__("../../../../rxjs/_esm5/util/errorObject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._util_tryCatch,.._util_errorObject,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/**
 * Ignores source values for a duration determined by another Observable, then
 * emits the most recent value from the source Observable, then repeats this
 * process.
 *
 * <span class="informal">It's like {@link auditTime}, but the silencing
 * duration is determined by a second Observable.</span>
 *
 * <img src="./img/audit.png" width="100%">
 *
 * `audit` is similar to `throttle`, but emits the last value from the silenced
 * time window, instead of the first value. `audit` emits the most recent value
 * from the source Observable on the output Observable as soon as its internal
 * timer becomes disabled, and ignores source values while the timer is enabled.
 * Initially, the timer is disabled. As soon as the first source value arrives,
 * the timer is enabled by calling the `durationSelector` function with the
 * source value, which returns the "duration" Observable. When the duration
 * Observable emits a value or completes, the timer is disabled, then the most
 * recent source value is emitted on the output Observable, and this process
 * repeats for the next source value.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.audit(ev => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounce}
 * @see {@link delayWhen}
 * @see {@link sample}
 * @see {@link throttle}
 *
 * @param {function(value: T): SubscribableOrPromise} durationSelector A function
 * that receives a value from the source Observable, for computing the silencing
 * duration, returned as an Observable or a Promise.
 * @return {Observable<T>} An Observable that performs rate-limiting of
 * emissions from the source Observable.
 * @method audit
 * @owner Observable
 */
function audit(durationSelector) {
    return function auditOperatorFunction(source) {
        return source.lift(new AuditOperator(durationSelector));
    };
}
var AuditOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function AuditOperator(durationSelector) {
        this.durationSelector = durationSelector;
    }
    AuditOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new AuditSubscriber(subscriber, this.durationSelector));
    };
    return AuditOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AuditSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(AuditSubscriber, _super);
    function AuditSubscriber(destination, durationSelector) {
        _super.call(this, destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
    }
    AuditSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
            var duration = Object(__WEBPACK_IMPORTED_MODULE_0__util_tryCatch__["a" /* tryCatch */])(this.durationSelector)(value);
            if (duration === __WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */]) {
                this.destination.error(__WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */].e);
            }
            else {
                var innerSubscription = Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, duration);
                if (innerSubscription.closed) {
                    this.clearThrottle();
                }
                else {
                    this.add(this.throttled = innerSubscription);
                }
            }
        }
    };
    AuditSubscriber.prototype.clearThrottle = function () {
        var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
        if (hasValue) {
            this.value = null;
            this.hasValue = false;
            this.destination.next(value);
        }
    };
    AuditSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
        this.clearThrottle();
    };
    AuditSubscriber.prototype.notifyComplete = function () {
        this.clearThrottle();
    };
    return AuditSubscriber;
}(__WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=audit.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/auditTime.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = auditTime;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_async__ = __webpack_require__("../../../../rxjs/_esm5/scheduler/async.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__audit__ = __webpack_require__("../../../../rxjs/_esm5/operators/audit.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__observable_timer__ = __webpack_require__("../../../../rxjs/_esm5/observable/timer.js");
/** PURE_IMPORTS_START .._scheduler_async,._audit,.._observable_timer PURE_IMPORTS_END */



/**
 * Ignores source values for `duration` milliseconds, then emits the most recent
 * value from the source Observable, then repeats this process.
 *
 * <span class="informal">When it sees a source values, it ignores that plus
 * the next ones for `duration` milliseconds, and then it emits the most recent
 * value from the source.</span>
 *
 * <img src="./img/auditTime.png" width="100%">
 *
 * `auditTime` is similar to `throttleTime`, but emits the last value from the
 * silenced time window, instead of the first value. `auditTime` emits the most
 * recent value from the source Observable on the output Observable as soon as
 * its internal timer becomes disabled, and ignores source values while the
 * timer is enabled. Initially, the timer is disabled. As soon as the first
 * source value arrives, the timer is enabled. After `duration` milliseconds (or
 * the time unit determined internally by the optional `scheduler`) has passed,
 * the timer is disabled, then the most recent source value is emitted on the
 * output Observable, and this process repeats for the next source value.
 * Optionally takes a {@link IScheduler} for managing timers.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.auditTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttleTime}
 *
 * @param {number} duration Time to wait before emitting the most recent source
 * value, measured in milliseconds or the time unit determined internally
 * by the optional `scheduler`.
 * @param {Scheduler} [scheduler=async] The {@link IScheduler} to use for
 * managing the timers that handle the rate-limiting behavior.
 * @return {Observable<T>} An Observable that performs rate-limiting of
 * emissions from the source Observable.
 * @method auditTime
 * @owner Observable
 */
function auditTime(duration, scheduler) {
    if (scheduler === void 0) {
        scheduler = __WEBPACK_IMPORTED_MODULE_0__scheduler_async__["a" /* async */];
    }
    return Object(__WEBPACK_IMPORTED_MODULE_1__audit__["a" /* audit */])(function () { return Object(__WEBPACK_IMPORTED_MODULE_2__observable_timer__["a" /* timer */])(duration, scheduler); });
}
//# sourceMappingURL=auditTime.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/buffer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export buffer */
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


/**
 * Buffers the source Observable values until `closingNotifier` emits.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when another Observable emits.</span>
 *
 * <img src="./img/buffer.png" width="100%">
 *
 * Buffers the incoming Observable values until the given `closingNotifier`
 * Observable emits a value, at which point it emits the buffer on the output
 * Observable and starts a new buffer internally, awaiting the next time
 * `closingNotifier` emits.
 *
 * @example <caption>On every click, emit array of most recent interval events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var interval = Rx.Observable.interval(1000);
 * var buffered = interval.buffer(clicks);
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link window}
 *
 * @param {Observable<any>} closingNotifier An Observable that signals the
 * buffer to be emitted on the output Observable.
 * @return {Observable<T[]>} An Observable of buffers, which are arrays of
 * values.
 * @method buffer
 * @owner Observable
 */
function buffer(closingNotifier) {
    return function bufferOperatorFunction(source) {
        return source.lift(new BufferOperator(closingNotifier));
    };
}
var BufferOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function BufferOperator(closingNotifier) {
        this.closingNotifier = closingNotifier;
    }
    BufferOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
    };
    return BufferOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(BufferSubscriber, _super);
    function BufferSubscriber(destination, closingNotifier) {
        _super.call(this, destination);
        this.buffer = [];
        this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, closingNotifier));
    }
    BufferSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
    };
    BufferSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var buffer = this.buffer;
        this.buffer = [];
        this.destination.next(buffer);
    };
    return BufferSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=buffer.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/bufferCount.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export bufferCount */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Buffers the source Observable values until the size hits the maximum
 * `bufferSize` given.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when its size reaches `bufferSize`.</span>
 *
 * <img src="./img/bufferCount.png" width="100%">
 *
 * Buffers a number of values from the source Observable by `bufferSize` then
 * emits the buffer and clears it, and starts a new buffer each
 * `startBufferEvery` values. If `startBufferEvery` is not provided or is
 * `null`, then new buffers are started immediately at the start of the source
 * and when each buffer closes and is emitted.
 *
 * @example <caption>Emit the last two click events as an array</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferCount(2);
 * buffered.subscribe(x => console.log(x));
 *
 * @example <caption>On every click, emit the last two click events as an array</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferCount(2, 1);
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link pairwise}
 * @see {@link windowCount}
 *
 * @param {number} bufferSize The maximum size of the buffer emitted.
 * @param {number} [startBufferEvery] Interval at which to start a new buffer.
 * For example if `startBufferEvery` is `2`, then a new buffer will be started
 * on every other value from the source. A new buffer is started at the
 * beginning of the source by default.
 * @return {Observable<T[]>} An Observable of arrays of buffered values.
 * @method bufferCount
 * @owner Observable
 */
function bufferCount(bufferSize, startBufferEvery) {
    if (startBufferEvery === void 0) {
        startBufferEvery = null;
    }
    return function bufferCountOperatorFunction(source) {
        return source.lift(new BufferCountOperator(bufferSize, startBufferEvery));
    };
}
var BufferCountOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function BufferCountOperator(bufferSize, startBufferEvery) {
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        if (!startBufferEvery || bufferSize === startBufferEvery) {
            this.subscriberClass = BufferCountSubscriber;
        }
        else {
            this.subscriberClass = BufferSkipCountSubscriber;
        }
    }
    BufferCountOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new this.subscriberClass(subscriber, this.bufferSize, this.startBufferEvery));
    };
    return BufferCountOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferCountSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(BufferCountSubscriber, _super);
    function BufferCountSubscriber(destination, bufferSize) {
        _super.call(this, destination);
        this.bufferSize = bufferSize;
        this.buffer = [];
    }
    BufferCountSubscriber.prototype._next = function (value) {
        var buffer = this.buffer;
        buffer.push(value);
        if (buffer.length == this.bufferSize) {
            this.destination.next(buffer);
            this.buffer = [];
        }
    };
    BufferCountSubscriber.prototype._complete = function () {
        var buffer = this.buffer;
        if (buffer.length > 0) {
            this.destination.next(buffer);
        }
        _super.prototype._complete.call(this);
    };
    return BufferCountSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferSkipCountSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(BufferSkipCountSubscriber, _super);
    function BufferSkipCountSubscriber(destination, bufferSize, startBufferEvery) {
        _super.call(this, destination);
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        this.buffers = [];
        this.count = 0;
    }
    BufferSkipCountSubscriber.prototype._next = function (value) {
        var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count = _a.count;
        this.count++;
        if (count % startBufferEvery === 0) {
            buffers.push([]);
        }
        for (var i = buffers.length; i--;) {
            var buffer = buffers[i];
            buffer.push(value);
            if (buffer.length === bufferSize) {
                buffers.splice(i, 1);
                this.destination.next(buffer);
            }
        }
    };
    BufferSkipCountSubscriber.prototype._complete = function () {
        var _a = this, buffers = _a.buffers, destination = _a.destination;
        while (buffers.length > 0) {
            var buffer = buffers.shift();
            if (buffer.length > 0) {
                destination.next(buffer);
            }
        }
        _super.prototype._complete.call(this);
    };
    return BufferSkipCountSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=bufferCount.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/bufferTime.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export bufferTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_async__ = __webpack_require__("../../../../rxjs/_esm5/scheduler/async.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_isScheduler__ = __webpack_require__("../../../../rxjs/_esm5/util/isScheduler.js");
/** PURE_IMPORTS_START .._scheduler_async,.._Subscriber,.._util_isScheduler PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/* tslint:enable:max-line-length */
/**
 * Buffers the source Observable values for a specific time period.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * those arrays periodically in time.</span>
 *
 * <img src="./img/bufferTime.png" width="100%">
 *
 * Buffers values from the source for a specific time duration `bufferTimeSpan`.
 * Unless the optional argument `bufferCreationInterval` is given, it emits and
 * resets the buffer every `bufferTimeSpan` milliseconds. If
 * `bufferCreationInterval` is given, this operator opens the buffer every
 * `bufferCreationInterval` milliseconds and closes (emits and resets) the
 * buffer every `bufferTimeSpan` milliseconds. When the optional argument
 * `maxBufferSize` is specified, the buffer will be closed either after
 * `bufferTimeSpan` milliseconds or when it contains `maxBufferSize` elements.
 *
 * @example <caption>Every second, emit an array of the recent click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferTime(1000);
 * buffered.subscribe(x => console.log(x));
 *
 * @example <caption>Every 5 seconds, emit the click events from the next 2 seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferTime(2000, 5000);
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link windowTime}
 *
 * @param {number} bufferTimeSpan The amount of time to fill each buffer array.
 * @param {number} [bufferCreationInterval] The interval at which to start new
 * buffers.
 * @param {number} [maxBufferSize] The maximum buffer size.
 * @param {Scheduler} [scheduler=async] The scheduler on which to schedule the
 * intervals that determine buffer boundaries.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferTime
 * @owner Observable
 */
function bufferTime(bufferTimeSpan) {
    var length = arguments.length;
    var scheduler = __WEBPACK_IMPORTED_MODULE_0__scheduler_async__["a" /* async */];
    if (Object(__WEBPACK_IMPORTED_MODULE_2__util_isScheduler__["a" /* isScheduler */])(arguments[arguments.length - 1])) {
        scheduler = arguments[arguments.length - 1];
        length--;
    }
    var bufferCreationInterval = null;
    if (length >= 2) {
        bufferCreationInterval = arguments[1];
    }
    var maxBufferSize = Number.POSITIVE_INFINITY;
    if (length >= 3) {
        maxBufferSize = arguments[2];
    }
    return function bufferTimeOperatorFunction(source) {
        return source.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
    };
}
var BufferTimeOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.maxBufferSize = maxBufferSize;
        this.scheduler = scheduler;
    }
    BufferTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
    };
    return BufferTimeOperator;
}());
var Context = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function Context() {
        this.buffer = [];
    }
    return Context;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferTimeSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(BufferTimeSubscriber, _super);
    function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        _super.call(this, destination);
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.maxBufferSize = maxBufferSize;
        this.scheduler = scheduler;
        this.contexts = [];
        var context = this.openContext();
        this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
        if (this.timespanOnly) {
            var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
            this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
        else {
            var closeState = { subscriber: this, context: context };
            var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: this, scheduler: scheduler };
            this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
            this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
        }
    }
    BufferTimeSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        var len = contexts.length;
        var filledBufferContext;
        for (var i = 0; i < len; i++) {
            var context = contexts[i];
            var buffer = context.buffer;
            buffer.push(value);
            if (buffer.length == this.maxBufferSize) {
                filledBufferContext = context;
            }
        }
        if (filledBufferContext) {
            this.onBufferFull(filledBufferContext);
        }
    };
    BufferTimeSubscriber.prototype._error = function (err) {
        this.contexts.length = 0;
        _super.prototype._error.call(this, err);
    };
    BufferTimeSubscriber.prototype._complete = function () {
        var _a = this, contexts = _a.contexts, destination = _a.destination;
        while (contexts.length > 0) {
            var context = contexts.shift();
            destination.next(context.buffer);
        }
        _super.prototype._complete.call(this);
    };
    /** @deprecated internal use only */ BufferTimeSubscriber.prototype._unsubscribe = function () {
        this.contexts = null;
    };
    BufferTimeSubscriber.prototype.onBufferFull = function (context) {
        this.closeContext(context);
        var closeAction = context.closeAction;
        closeAction.unsubscribe();
        this.remove(closeAction);
        if (!this.closed && this.timespanOnly) {
            context = this.openContext();
            var bufferTimeSpan = this.bufferTimeSpan;
            var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
            this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
    };
    BufferTimeSubscriber.prototype.openContext = function () {
        var context = new Context();
        this.contexts.push(context);
        return context;
    };
    BufferTimeSubscriber.prototype.closeContext = function (context) {
        this.destination.next(context.buffer);
        var contexts = this.contexts;
        var spliceIndex = contexts ? contexts.indexOf(context) : -1;
        if (spliceIndex >= 0) {
            contexts.splice(contexts.indexOf(context), 1);
        }
    };
    return BufferTimeSubscriber;
}(__WEBPACK_IMPORTED_MODULE_1__Subscriber__["a" /* Subscriber */]));
function dispatchBufferTimeSpanOnly(state) {
    var subscriber = state.subscriber;
    var prevContext = state.context;
    if (prevContext) {
        subscriber.closeContext(prevContext);
    }
    if (!subscriber.closed) {
        state.context = subscriber.openContext();
        state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
    }
}
function dispatchBufferCreation(state) {
    var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
    var context = subscriber.openContext();
    var action = this;
    if (!subscriber.closed) {
        subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, context: context }));
        action.schedule(state, bufferCreationInterval);
    }
}
function dispatchBufferClose(arg) {
    var subscriber = arg.subscriber, context = arg.context;
    subscriber.closeContext(context);
}
//# sourceMappingURL=bufferTime.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/bufferToggle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export bufferToggle */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/** PURE_IMPORTS_START .._Subscription,.._util_subscribeToResult,.._OuterSubscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/**
 * Buffers the source Observable values starting from an emission from
 * `openings` and ending when the output of `closingSelector` emits.
 *
 * <span class="informal">Collects values from the past as an array. Starts
 * collecting only when `opening` emits, and calls the `closingSelector`
 * function to get an Observable that tells when to close the buffer.</span>
 *
 * <img src="./img/bufferToggle.png" width="100%">
 *
 * Buffers values from the source by opening the buffer via signals from an
 * Observable provided to `openings`, and closing and sending the buffers when
 * a Subscribable or Promise returned by the `closingSelector` function emits.
 *
 * @example <caption>Every other second, emit the click events from the next 500ms</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var openings = Rx.Observable.interval(1000);
 * var buffered = clicks.bufferToggle(openings, i =>
 *   i % 2 ? Rx.Observable.interval(500) : Rx.Observable.empty()
 * );
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferWhen}
 * @see {@link windowToggle}
 *
 * @param {SubscribableOrPromise<O>} openings A Subscribable or Promise of notifications to start new
 * buffers.
 * @param {function(value: O): SubscribableOrPromise} closingSelector A function that takes
 * the value emitted by the `openings` observable and returns a Subscribable or Promise,
 * which, when it emits, signals that the associated buffer should be emitted
 * and cleared.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferToggle
 * @owner Observable
 */
function bufferToggle(openings, closingSelector) {
    return function bufferToggleOperatorFunction(source) {
        return source.lift(new BufferToggleOperator(openings, closingSelector));
    };
}
var BufferToggleOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function BufferToggleOperator(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    BufferToggleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
    };
    return BufferToggleOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferToggleSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(BufferToggleSubscriber, _super);
    function BufferToggleSubscriber(destination, openings, closingSelector) {
        _super.call(this, destination);
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, openings));
    }
    BufferToggleSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        var len = contexts.length;
        for (var i = 0; i < len; i++) {
            contexts[i].buffer.push(value);
        }
    };
    BufferToggleSubscriber.prototype._error = function (err) {
        var contexts = this.contexts;
        while (contexts.length > 0) {
            var context = contexts.shift();
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        _super.prototype._error.call(this, err);
    };
    BufferToggleSubscriber.prototype._complete = function () {
        var contexts = this.contexts;
        while (contexts.length > 0) {
            var context = contexts.shift();
            this.destination.next(context.buffer);
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        _super.prototype._complete.call(this);
    };
    BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
    };
    BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
        this.closeBuffer(innerSub.context);
    };
    BufferToggleSubscriber.prototype.openBuffer = function (value) {
        try {
            var closingSelector = this.closingSelector;
            var closingNotifier = closingSelector.call(this, value);
            if (closingNotifier) {
                this.trySubscribe(closingNotifier);
            }
        }
        catch (err) {
            this._error(err);
        }
    };
    BufferToggleSubscriber.prototype.closeBuffer = function (context) {
        var contexts = this.contexts;
        if (contexts && context) {
            var buffer = context.buffer, subscription = context.subscription;
            this.destination.next(buffer);
            contexts.splice(contexts.indexOf(context), 1);
            this.remove(subscription);
            subscription.unsubscribe();
        }
    };
    BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
        var contexts = this.contexts;
        var buffer = [];
        var subscription = new __WEBPACK_IMPORTED_MODULE_0__Subscription__["a" /* Subscription */]();
        var context = { buffer: buffer, subscription: subscription };
        contexts.push(context);
        var innerSubscription = Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, closingNotifier, context);
        if (!innerSubscription || innerSubscription.closed) {
            this.closeBuffer(context);
        }
        else {
            innerSubscription.context = context;
            this.add(innerSubscription);
            subscription.add(innerSubscription);
        }
    };
    return BufferToggleSubscriber;
}(__WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=bufferToggle.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/bufferWhen.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export bufferWhen */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__("../../../../rxjs/_esm5/util/tryCatch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__("../../../../rxjs/_esm5/util/errorObject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._Subscription,.._util_tryCatch,.._util_errorObject,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





/**
 * Buffers the source Observable values, using a factory function of closing
 * Observables to determine when to close, emit, and reset the buffer.
 *
 * <span class="informal">Collects values from the past as an array. When it
 * starts collecting values, it calls a function that returns an Observable that
 * tells when to close the buffer and restart collecting.</span>
 *
 * <img src="./img/bufferWhen.png" width="100%">
 *
 * Opens a buffer immediately, then closes the buffer when the observable
 * returned by calling `closingSelector` function emits a value. When it closes
 * the buffer, it immediately opens a new buffer and repeats the process.
 *
 * @example <caption>Emit an array of the last clicks every [1-5] random seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferWhen(() =>
 *   Rx.Observable.interval(1000 + Math.random() * 4000)
 * );
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link windowWhen}
 *
 * @param {function(): Observable} closingSelector A function that takes no
 * arguments and returns an Observable that signals buffer closure.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferWhen
 * @owner Observable
 */
function bufferWhen(closingSelector) {
    return function (source) {
        return source.lift(new BufferWhenOperator(closingSelector));
    };
}
var BufferWhenOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function BufferWhenOperator(closingSelector) {
        this.closingSelector = closingSelector;
    }
    BufferWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
    };
    return BufferWhenOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferWhenSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(BufferWhenSubscriber, _super);
    function BufferWhenSubscriber(destination, closingSelector) {
        _super.call(this, destination);
        this.closingSelector = closingSelector;
        this.subscribing = false;
        this.openBuffer();
    }
    BufferWhenSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
    };
    BufferWhenSubscriber.prototype._complete = function () {
        var buffer = this.buffer;
        if (buffer) {
            this.destination.next(buffer);
        }
        _super.prototype._complete.call(this);
    };
    /** @deprecated internal use only */ BufferWhenSubscriber.prototype._unsubscribe = function () {
        this.buffer = null;
        this.subscribing = false;
    };
    BufferWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openBuffer();
    };
    BufferWhenSubscriber.prototype.notifyComplete = function () {
        if (this.subscribing) {
            this.complete();
        }
        else {
            this.openBuffer();
        }
    };
    BufferWhenSubscriber.prototype.openBuffer = function () {
        var closingSubscription = this.closingSubscription;
        if (closingSubscription) {
            this.remove(closingSubscription);
            closingSubscription.unsubscribe();
        }
        var buffer = this.buffer;
        if (this.buffer) {
            this.destination.next(buffer);
        }
        this.buffer = [];
        var closingNotifier = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(this.closingSelector)();
        if (closingNotifier === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
            this.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
        }
        else {
            closingSubscription = new __WEBPACK_IMPORTED_MODULE_0__Subscription__["a" /* Subscription */]();
            this.closingSubscription = closingSubscription;
            this.add(closingSubscription);
            this.subscribing = true;
            closingSubscription.add(Object(__WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__["a" /* subscribeToResult */])(this, closingNotifier));
            this.subscribing = false;
        }
    };
    return BufferWhenSubscriber;
}(__WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=bufferWhen.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/combineAll.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export combineAll */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__operators_combineLatest__ = __webpack_require__("../../../../rxjs/_esm5/operators/combineLatest.js");
/** PURE_IMPORTS_START .._operators_combineLatest PURE_IMPORTS_END */

function combineAll(project) {
    return function (source) { return source.lift(new __WEBPACK_IMPORTED_MODULE_0__operators_combineLatest__["a" /* CombineLatestOperator */](project)); };
}
//# sourceMappingURL=combineAll.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/combineLatest.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export combineLatest */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CombineLatestOperator; });
/* unused harmony export CombineLatestSubscriber */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__ = __webpack_require__("../../../../rxjs/_esm5/observable/ArrayObservable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isArray__ = __webpack_require__("../../../../rxjs/_esm5/util/isArray.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._observable_ArrayObservable,.._util_isArray,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




var none = {};
/* tslint:enable:max-line-length */
/**
 * Combines multiple Observables to create an Observable whose values are
 * calculated from the latest values of each of its input Observables.
 *
 * <span class="informal">Whenever any input Observable emits a value, it
 * computes a formula using the latest values from all the inputs, then emits
 * the output of that formula.</span>
 *
 * <img src="./img/combineLatest.png" width="100%">
 *
 * `combineLatest` combines the values from this Observable with values from
 * Observables passed as arguments. This is done by subscribing to each
 * Observable, in order, and collecting an array of each of the most recent
 * values any time any of the input Observables emits, then either taking that
 * array and passing it as arguments to an optional `project` function and
 * emitting the return value of that, or just emitting the array of recent
 * values directly if there is no `project` function.
 *
 * @example <caption>Dynamically calculate the Body-Mass Index from an Observable of weight and one for height</caption>
 * var weight = Rx.Observable.of(70, 72, 76, 79, 75);
 * var height = Rx.Observable.of(1.76, 1.77, 1.78);
 * var bmi = weight.combineLatest(height, (w, h) => w / (h * h));
 * bmi.subscribe(x => console.log('BMI is ' + x));
 *
 * // With output to console:
 * // BMI is 24.212293388429753
 * // BMI is 23.93948099205209
 * // BMI is 23.671253629592222
 *
 * @see {@link combineAll}
 * @see {@link merge}
 * @see {@link withLatestFrom}
 *
 * @param {ObservableInput} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {function} [project] An optional function to project the values from
 * the combined latest values into a new value on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method combineLatest
 * @owner Observable
 */
function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = null;
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && Object(__WEBPACK_IMPORTED_MODULE_1__util_isArray__["a" /* isArray */])(observables[0])) {
        observables = observables[0].slice();
    }
    return function (source) { return source.lift.call(new __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__["a" /* ArrayObservable */]([source].concat(observables)), new CombineLatestOperator(project)); };
}
var CombineLatestOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function CombineLatestOperator(project) {
        this.project = project;
    }
    CombineLatestOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new CombineLatestSubscriber(subscriber, this.project));
    };
    return CombineLatestOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var CombineLatestSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(CombineLatestSubscriber, _super);
    function CombineLatestSubscriber(destination, project) {
        _super.call(this, destination);
        this.project = project;
        this.active = 0;
        this.values = [];
        this.observables = [];
    }
    CombineLatestSubscriber.prototype._next = function (observable) {
        this.values.push(none);
        this.observables.push(observable);
    };
    CombineLatestSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            this.active = len;
            this.toRespond = len;
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                this.add(Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, observable, observable, i));
            }
        }
    };
    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    };
    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var values = this.values;
        var oldVal = values[outerIndex];
        var toRespond = !this.toRespond
            ? 0
            : oldVal === none ? --this.toRespond : this.toRespond;
        values[outerIndex] = innerValue;
        if (toRespond === 0) {
            if (this.project) {
                this._tryProject(values);
            }
            else {
                this.destination.next(values.slice());
            }
        }
    };
    CombineLatestSubscriber.prototype._tryProject = function (values) {
        var result;
        try {
            result = this.project.apply(this, values);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return CombineLatestSubscriber;
}(__WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=combineLatest.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/concat.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export concat */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_concat__ = __webpack_require__("../../../../rxjs/_esm5/observable/concat.js");
/* unused harmony reexport concatStatic */
/** PURE_IMPORTS_START .._observable_concat PURE_IMPORTS_END */


/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which sequentially emits all values from every
 * given input Observable after the current Observable.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * <img src="./img/concat.png" width="100%">
 *
 * Joins this Observable with multiple other Observables by subscribing to them
 * one at a time, starting with the source, and merging their results into the
 * output Observable. Will wait for each Observable to complete before moving
 * on to the next.
 *
 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
 * var timer = Rx.Observable.interval(1000).take(4);
 * var sequence = Rx.Observable.range(1, 10);
 * var result = timer.concat(sequence);
 * result.subscribe(x => console.log(x));
 *
 * // results in:
 * // 1000ms-> 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3 -immediate-> 1 ... 10
 *
 * @example <caption>Concatenate 3 Observables</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var result = timer1.concat(timer2, timer3);
 * result.subscribe(x => console.log(x));
 *
 * // results in the following:
 * // (Prints to console sequentially)
 * // -1000ms-> 0 -1000ms-> 1 -1000ms-> ... 9
 * // -2000ms-> 0 -2000ms-> 1 -2000ms-> ... 5
 * // -500ms-> 0 -500ms-> 1 -500ms-> ... 9
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {ObservableInput} other An input Observable to concatenate after the source
 * Observable. More than one input Observables may be given as argument.
 * @param {Scheduler} [scheduler=null] An optional IScheduler to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @method concat
 * @owner Observable
 */
function concat() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    return function (source) { return source.lift.call(__WEBPACK_IMPORTED_MODULE_0__observable_concat__["a" /* concat */].apply(void 0, [source].concat(observables))); };
}
//# sourceMappingURL=concat.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/concatMapTo.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export concatMapTo */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__concatMap__ = __webpack_require__("../../../../rxjs/_esm5/operators/concatMap.js");
/** PURE_IMPORTS_START ._concatMap PURE_IMPORTS_END */

/* tslint:enable:max-line-length */
/**
 * Projects each source value to the same Observable which is merged multiple
 * times in a serialized fashion on the output Observable.
 *
 * <span class="informal">It's like {@link concatMap}, but maps each value
 * always to the same inner Observable.</span>
 *
 * <img src="./img/concatMapTo.png" width="100%">
 *
 * Maps each source value to the given Observable `innerObservable` regardless
 * of the source value, and then flattens those resulting Observables into one
 * single Observable, which is the output Observable. Each new `innerObservable`
 * instance emitted on the output Observable is concatenated with the previous
 * `innerObservable` instance.
 *
 * __Warning:__ if source values arrive endlessly and faster than their
 * corresponding inner Observables can complete, it will result in memory issues
 * as inner Observables amass in an unbounded buffer waiting for their turn to
 * be subscribed to.
 *
 * Note: `concatMapTo` is equivalent to `mergeMapTo` with concurrency parameter
 * set to `1`.
 *
 * @example <caption>For each click event, tick every second from 0 to 3, with no concurrency</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.concatMapTo(Rx.Observable.interval(1000).take(4));
 * result.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // (results are not concurrent)
 * // For every click on the "document" it will emit values 0 to 3 spaced
 * // on a 1000ms interval
 * // one click = 1000ms-> 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3
 *
 * @see {@link concat}
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link mergeMapTo}
 * @see {@link switchMapTo}
 *
 * @param {ObservableInput} innerObservable An Observable to replace each value from
 * the source Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An observable of values merged together by joining the
 * passed observable with itself, one after the other, for each value emitted
 * from the source.
 * @method concatMapTo
 * @owner Observable
 */
function concatMapTo(innerObservable, resultSelector) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__concatMap__["a" /* concatMap */])(function () { return innerObservable; }, resultSelector);
}
//# sourceMappingURL=concatMapTo.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/count.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export count */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Counts the number of emissions on the source and emits that number when the
 * source completes.
 *
 * <span class="informal">Tells how many values were emitted, when the source
 * completes.</span>
 *
 * <img src="./img/count.png" width="100%">
 *
 * `count` transforms an Observable that emits values into an Observable that
 * emits a single value that represents the number of values emitted by the
 * source Observable. If the source Observable terminates with an error, `count`
 * will pass this error notification along without emitting a value first. If
 * the source Observable does not terminate at all, `count` will neither emit
 * a value nor terminate. This operator takes an optional `predicate` function
 * as argument, in which case the output emission will represent the number of
 * source values that matched `true` with the `predicate`.
 *
 * @example <caption>Counts how many seconds have passed before the first click happened</caption>
 * var seconds = Rx.Observable.interval(1000);
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var secondsBeforeClick = seconds.takeUntil(clicks);
 * var result = secondsBeforeClick.count();
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Counts how many odd numbers are there between 1 and 7</caption>
 * var numbers = Rx.Observable.range(1, 7);
 * var result = numbers.count(i => i % 2 === 1);
 * result.subscribe(x => console.log(x));
 *
 * // Results in:
 * // 4
 *
 * @see {@link max}
 * @see {@link min}
 * @see {@link reduce}
 *
 * @param {function(value: T, i: number, source: Observable<T>): boolean} [predicate] A
 * boolean function to select what values are to be counted. It is provided with
 * arguments of:
 * - `value`: the value from the source Observable.
 * - `index`: the (zero-based) "index" of the value from the source Observable.
 * - `source`: the source Observable instance itself.
 * @return {Observable} An Observable of one number that represents the count as
 * described above.
 * @method count
 * @owner Observable
 */
function count(predicate) {
    return function (source) { return source.lift(new CountOperator(predicate, source)); };
}
var CountOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function CountOperator(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    CountOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
    };
    return CountOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var CountSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(CountSubscriber, _super);
    function CountSubscriber(destination, predicate, source) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.source = source;
        this.count = 0;
        this.index = 0;
    }
    CountSubscriber.prototype._next = function (value) {
        if (this.predicate) {
            this._tryPredicate(value);
        }
        else {
            this.count++;
        }
    };
    CountSubscriber.prototype._tryPredicate = function (value) {
        var result;
        try {
            result = this.predicate(value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.count++;
        }
    };
    CountSubscriber.prototype._complete = function () {
        this.destination.next(this.count);
        this.destination.complete();
    };
    return CountSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=count.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/debounce.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export debounce */
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


/**
 * Emits a value from the source Observable only after a particular time span
 * determined by another Observable has passed without another source emission.
 *
 * <span class="informal">It's like {@link debounceTime}, but the time span of
 * emission silence is determined by a second Observable.</span>
 *
 * <img src="./img/debounce.png" width="100%">
 *
 * `debounce` delays values emitted by the source Observable, but drops previous
 * pending delayed emissions if a new value arrives on the source Observable.
 * This operator keeps track of the most recent value from the source
 * Observable, and spawns a duration Observable by calling the
 * `durationSelector` function. The value is emitted only when the duration
 * Observable emits a value or completes, and if no other value was emitted on
 * the source Observable since the duration Observable was spawned. If a new
 * value appears before the duration Observable emits, the previous value will
 * be dropped and will not be emitted on the output Observable.
 *
 * Like {@link debounceTime}, this is a rate-limiting operator, and also a
 * delay-like operator since output emissions do not necessarily occur at the
 * same time as they did on the source Observable.
 *
 * @example <caption>Emit the most recent click after a burst of clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.debounce(() => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounceTime}
 * @see {@link delayWhen}
 * @see {@link throttle}
 *
 * @param {function(value: T): SubscribableOrPromise} durationSelector A function
 * that receives a value from the source Observable, for computing the timeout
 * duration for each source value, returned as an Observable or a Promise.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified duration Observable returned by
 * `durationSelector`, and may drop some values if they occur too frequently.
 * @method debounce
 * @owner Observable
 */
function debounce(durationSelector) {
    return function (source) { return source.lift(new DebounceOperator(durationSelector)); };
}
var DebounceOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function DebounceOperator(durationSelector) {
        this.durationSelector = durationSelector;
    }
    DebounceOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
    };
    return DebounceOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DebounceSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(DebounceSubscriber, _super);
    function DebounceSubscriber(destination, durationSelector) {
        _super.call(this, destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
        this.durationSubscription = null;
    }
    DebounceSubscriber.prototype._next = function (value) {
        try {
            var result = this.durationSelector.call(this, value);
            if (result) {
                this._tryNext(value, result);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    DebounceSubscriber.prototype._complete = function () {
        this.emitValue();
        this.destination.complete();
    };
    DebounceSubscriber.prototype._tryNext = function (value, duration) {
        var subscription = this.durationSubscription;
        this.value = value;
        this.hasValue = true;
        if (subscription) {
            subscription.unsubscribe();
            this.remove(subscription);
        }
        subscription = Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, duration);
        if (!subscription.closed) {
            this.add(this.durationSubscription = subscription);
        }
    };
    DebounceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    };
    DebounceSubscriber.prototype.notifyComplete = function () {
        this.emitValue();
    };
    DebounceSubscriber.prototype.emitValue = function () {
        if (this.hasValue) {
            var value = this.value;
            var subscription = this.durationSubscription;
            if (subscription) {
                this.durationSubscription = null;
                subscription.unsubscribe();
                this.remove(subscription);
            }
            this.value = null;
            this.hasValue = false;
            _super.prototype._next.call(this, value);
        }
    };
    return DebounceSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=debounce.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/delayWhen.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export delayWhen */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Observable__ = __webpack_require__("../../../../rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._Subscriber,.._Observable,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/**
 * Delays the emission of items from the source Observable by a given time span
 * determined by the emissions of another Observable.
 *
 * <span class="informal">It's like {@link delay}, but the time span of the
 * delay duration is determined by a second Observable.</span>
 *
 * <img src="./img/delayWhen.png" width="100%">
 *
 * `delayWhen` time shifts each emitted value from the source Observable by a
 * time span determined by another Observable. When the source emits a value,
 * the `delayDurationSelector` function is called with the source value as
 * argument, and should return an Observable, called the "duration" Observable.
 * The source value is emitted on the output Observable only when the duration
 * Observable emits a value or completes.
 *
 * Optionally, `delayWhen` takes a second argument, `subscriptionDelay`, which
 * is an Observable. When `subscriptionDelay` emits its first value or
 * completes, the source Observable is subscribed to and starts behaving like
 * described in the previous paragraph. If `subscriptionDelay` is not provided,
 * `delayWhen` will subscribe to the source Observable as soon as the output
 * Observable is subscribed.
 *
 * @example <caption>Delay each click by a random amount of time, between 0 and 5 seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var delayedClicks = clicks.delayWhen(event =>
 *   Rx.Observable.interval(Math.random() * 5000)
 * );
 * delayedClicks.subscribe(x => console.log(x));
 *
 * @see {@link debounce}
 * @see {@link delay}
 *
 * @param {function(value: T): Observable} delayDurationSelector A function that
 * returns an Observable for each value emitted by the source Observable, which
 * is then used to delay the emission of that item on the output Observable
 * until the Observable returned from this function emits a value.
 * @param {Observable} subscriptionDelay An Observable that triggers the
 * subscription to the source Observable once it emits any value.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by an amount of time specified by the Observable returned by
 * `delayDurationSelector`.
 * @method delayWhen
 * @owner Observable
 */
function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
        return function (source) {
            return new SubscriptionDelayObservable(source, subscriptionDelay)
                .lift(new DelayWhenOperator(delayDurationSelector));
        };
    }
    return function (source) { return source.lift(new DelayWhenOperator(delayDurationSelector)); };
}
var DelayWhenOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function DelayWhenOperator(delayDurationSelector) {
        this.delayDurationSelector = delayDurationSelector;
    }
    DelayWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
    };
    return DelayWhenOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DelayWhenSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(DelayWhenSubscriber, _super);
    function DelayWhenSubscriber(destination, delayDurationSelector) {
        _super.call(this, destination);
        this.delayDurationSelector = delayDurationSelector;
        this.completed = false;
        this.delayNotifierSubscriptions = [];
        this.values = [];
    }
    DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(outerValue);
        this.removeSubscription(innerSub);
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
        var value = this.removeSubscription(innerSub);
        if (value) {
            this.destination.next(value);
        }
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype._next = function (value) {
        try {
            var delayNotifier = this.delayDurationSelector(value);
            if (delayNotifier) {
                this.tryDelay(delayNotifier, value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    DelayWhenSubscriber.prototype._complete = function () {
        this.completed = true;
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
        subscription.unsubscribe();
        var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
        var value = null;
        if (subscriptionIdx !== -1) {
            value = this.values[subscriptionIdx];
            this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
            this.values.splice(subscriptionIdx, 1);
        }
        return value;
    };
    DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
        var notifierSubscription = Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, delayNotifier, value);
        if (notifierSubscription && !notifierSubscription.closed) {
            this.add(notifierSubscription);
            this.delayNotifierSubscriptions.push(notifierSubscription);
        }
        this.values.push(value);
    };
    DelayWhenSubscriber.prototype.tryComplete = function () {
        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
            this.destination.complete();
        }
    };
    return DelayWhenSubscriber;
}(__WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */]));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubscriptionDelayObservable = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SubscriptionDelayObservable, _super);
    function SubscriptionDelayObservable(/** @deprecated internal use only */ source, subscriptionDelay) {
        _super.call(this);
        this.source = source;
        this.subscriptionDelay = subscriptionDelay;
    }
    /** @deprecated internal use only */ SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
        this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
    };
    return SubscriptionDelayObservable;
}(__WEBPACK_IMPORTED_MODULE_1__Observable__["a" /* Observable */]));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubscriptionDelaySubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SubscriptionDelaySubscriber, _super);
    function SubscriptionDelaySubscriber(parent, source) {
        _super.call(this);
        this.parent = parent;
        this.source = source;
        this.sourceSubscribed = false;
    }
    SubscriptionDelaySubscriber.prototype._next = function (unused) {
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype._error = function (err) {
        this.unsubscribe();
        this.parent.error(err);
    };
    SubscriptionDelaySubscriber.prototype._complete = function () {
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
        if (!this.sourceSubscribed) {
            this.sourceSubscribed = true;
            this.unsubscribe();
            this.source.subscribe(this.parent);
        }
    };
    return SubscriptionDelaySubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=delayWhen.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/dematerialize.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export dematerialize */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Converts an Observable of {@link Notification} objects into the emissions
 * that they represent.
 *
 * <span class="informal">Unwraps {@link Notification} objects as actual `next`,
 * `error` and `complete` emissions. The opposite of {@link materialize}.</span>
 *
 * <img src="./img/dematerialize.png" width="100%">
 *
 * `dematerialize` is assumed to operate an Observable that only emits
 * {@link Notification} objects as `next` emissions, and does not emit any
 * `error`. Such Observable is the output of a `materialize` operation. Those
 * notifications are then unwrapped using the metadata they contain, and emitted
 * as `next`, `error`, and `complete` on the output Observable.
 *
 * Use this operator in conjunction with {@link materialize}.
 *
 * @example <caption>Convert an Observable of Notifications to an actual Observable</caption>
 * var notifA = new Rx.Notification('N', 'A');
 * var notifB = new Rx.Notification('N', 'B');
 * var notifE = new Rx.Notification('E', void 0,
 *   new TypeError('x.toUpperCase is not a function')
 * );
 * var materialized = Rx.Observable.of(notifA, notifB, notifE);
 * var upperCase = materialized.dematerialize();
 * upperCase.subscribe(x => console.log(x), e => console.error(e));
 *
 * // Results in:
 * // A
 * // B
 * // TypeError: x.toUpperCase is not a function
 *
 * @see {@link Notification}
 * @see {@link materialize}
 *
 * @return {Observable} An Observable that emits items and notifications
 * embedded in Notification objects emitted by the source Observable.
 * @method dematerialize
 * @owner Observable
 */
function dematerialize() {
    return function dematerializeOperatorFunction(source) {
        return source.lift(new DeMaterializeOperator());
    };
}
var DeMaterializeOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function DeMaterializeOperator() {
    }
    DeMaterializeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DeMaterializeSubscriber(subscriber));
    };
    return DeMaterializeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DeMaterializeSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(DeMaterializeSubscriber, _super);
    function DeMaterializeSubscriber(destination) {
        _super.call(this, destination);
    }
    DeMaterializeSubscriber.prototype._next = function (value) {
        value.observe(this.destination);
    };
    return DeMaterializeSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=dematerialize.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/distinct.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export distinct */
/* unused harmony export DistinctSubscriber */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_Set__ = __webpack_require__("../../../../rxjs/_esm5/util/Set.js");
/** PURE_IMPORTS_START .._OuterSubscriber,.._util_subscribeToResult,.._util_Set PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items.
 *
 * If a keySelector function is provided, then it will project each value from the source observable into a new value that it will
 * check for equality with previously projected values. If a keySelector function is not provided, it will use each value from the
 * source observable directly with an equality check against previous values.
 *
 * In JavaScript runtimes that support `Set`, this operator will use a `Set` to improve performance of the distinct value checking.
 *
 * In other runtimes, this operator will use a minimal implementation of `Set` that relies on an `Array` and `indexOf` under the
 * hood, so performance will degrade as more values are checked for distinction. Even in newer browsers, a long-running `distinct`
 * use might result in memory leaks. To help alleviate this in some scenarios, an optional `flushes` parameter is also provided so
 * that the internal `Set` can be "flushed", basically clearing it of values.
 *
 * @example <caption>A simple example with numbers</caption>
 * Observable.of(1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1)
 *   .distinct()
 *   .subscribe(x => console.log(x)); // 1, 2, 3, 4
 *
 * @example <caption>An example using a keySelector function</caption>
 * interface Person {
 *    age: number,
 *    name: string
 * }
 *
 * Observable.of<Person>(
 *     { age: 4, name: 'Foo'},
 *     { age: 7, name: 'Bar'},
 *     { age: 5, name: 'Foo'})
 *     .distinct((p: Person) => p.name)
 *     .subscribe(x => console.log(x));
 *
 * // displays:
 * // { age: 4, name: 'Foo' }
 * // { age: 7, name: 'Bar' }
 *
 * @see {@link distinctUntilChanged}
 * @see {@link distinctUntilKeyChanged}
 *
 * @param {function} [keySelector] Optional function to select which value you want to check as distinct.
 * @param {Observable} [flushes] Optional Observable for flushing the internal HashSet of the operator.
 * @return {Observable} An Observable that emits items from the source Observable with distinct values.
 * @method distinct
 * @owner Observable
 */
function distinct(keySelector, flushes) {
    return function (source) { return source.lift(new DistinctOperator(keySelector, flushes)); };
}
var DistinctOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function DistinctOperator(keySelector, flushes) {
        this.keySelector = keySelector;
        this.flushes = flushes;
    }
    DistinctOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DistinctSubscriber(subscriber, this.keySelector, this.flushes));
    };
    return DistinctOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DistinctSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(DistinctSubscriber, _super);
    function DistinctSubscriber(destination, keySelector, flushes) {
        _super.call(this, destination);
        this.keySelector = keySelector;
        this.values = new __WEBPACK_IMPORTED_MODULE_2__util_Set__["a" /* Set */]();
        if (flushes) {
            this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, flushes));
        }
    }
    DistinctSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values.clear();
    };
    DistinctSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    DistinctSubscriber.prototype._next = function (value) {
        if (this.keySelector) {
            this._useKeySelector(value);
        }
        else {
            this._finalizeNext(value, value);
        }
    };
    DistinctSubscriber.prototype._useKeySelector = function (value) {
        var key;
        var destination = this.destination;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this._finalizeNext(key, value);
    };
    DistinctSubscriber.prototype._finalizeNext = function (key, value) {
        var values = this.values;
        if (!values.has(key)) {
            values.add(key);
            this.destination.next(value);
        }
    };
    return DistinctSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=distinct.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/distinctUntilKeyChanged.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export distinctUntilKeyChanged */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__distinctUntilChanged__ = __webpack_require__("../../../../rxjs/_esm5/operators/distinctUntilChanged.js");
/** PURE_IMPORTS_START ._distinctUntilChanged PURE_IMPORTS_END */

/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item,
 * using a property accessed by using the key provided to check if the two items are distinct.
 *
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 *
 * If a comparator function is not provided, an equality check is used by default.
 *
 * @example <caption>An example comparing the name of persons</caption>
 *
 *  interface Person {
 *     age: number,
 *     name: string
 *  }
 *
 * Observable.of<Person>(
 *     { age: 4, name: 'Foo'},
 *     { age: 7, name: 'Bar'},
 *     { age: 5, name: 'Foo'},
 *     { age: 6, name: 'Foo'})
 *     .distinctUntilKeyChanged('name')
 *     .subscribe(x => console.log(x));
 *
 * // displays:
 * // { age: 4, name: 'Foo' }
 * // { age: 7, name: 'Bar' }
 * // { age: 5, name: 'Foo' }
 *
 * @example <caption>An example comparing the first letters of the name</caption>
 *
 * interface Person {
 *     age: number,
 *     name: string
 *  }
 *
 * Observable.of<Person>(
 *     { age: 4, name: 'Foo1'},
 *     { age: 7, name: 'Bar'},
 *     { age: 5, name: 'Foo2'},
 *     { age: 6, name: 'Foo3'})
 *     .distinctUntilKeyChanged('name', (x: string, y: string) => x.substring(0, 3) === y.substring(0, 3))
 *     .subscribe(x => console.log(x));
 *
 * // displays:
 * // { age: 4, name: 'Foo1' }
 * // { age: 7, name: 'Bar' }
 * // { age: 5, name: 'Foo2' }
 *
 * @see {@link distinct}
 * @see {@link distinctUntilChanged}
 *
 * @param {string} key String key for object property lookup on each item.
 * @param {function} [compare] Optional comparison function called to test if an item is distinct from the previous item in the source.
 * @return {Observable} An Observable that emits items from the source Observable with distinct values based on the key specified.
 * @method distinctUntilKeyChanged
 * @owner Observable
 */
function distinctUntilKeyChanged(key, compare) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__distinctUntilChanged__["a" /* distinctUntilChanged */])(function (x, y) { return compare ? compare(x[key], y[key]) : x[key] === y[key]; });
}
//# sourceMappingURL=distinctUntilKeyChanged.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/elementAt.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export elementAt */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__ = __webpack_require__("../../../../rxjs/_esm5/util/ArgumentOutOfRangeError.js");
/** PURE_IMPORTS_START .._Subscriber,.._util_ArgumentOutOfRangeError PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * Emits the single value at the specified `index` in a sequence of emissions
 * from the source Observable.
 *
 * <span class="informal">Emits only the i-th value, then completes.</span>
 *
 * <img src="./img/elementAt.png" width="100%">
 *
 * `elementAt` returns an Observable that emits the item at the specified
 * `index` in the source Observable, or a default value if that `index` is out
 * of range and the `default` argument is provided. If the `default` argument is
 * not given and the `index` is out of range, the output Observable will emit an
 * `ArgumentOutOfRangeError` error.
 *
 * @example <caption>Emit only the third click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.elementAt(2);
 * result.subscribe(x => console.log(x));
 *
 * // Results in:
 * // click 1 = nothing
 * // click 2 = nothing
 * // click 3 = MouseEvent object logged to console
 *
 * @see {@link first}
 * @see {@link last}
 * @see {@link skip}
 * @see {@link single}
 * @see {@link take}
 *
 * @throws {ArgumentOutOfRangeError} When using `elementAt(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0` or the
 * Observable has completed before emitting the i-th `next` notification.
 *
 * @param {number} index Is the number `i` for the i-th source emission that has
 * happened since the subscription, starting from the number `0`.
 * @param {T} [defaultValue] The default value returned for missing indices.
 * @return {Observable} An Observable that emits a single item, if it is found.
 * Otherwise, will emit the default value if given. If not, then emits an error.
 * @method elementAt
 * @owner Observable
 */
function elementAt(index, defaultValue) {
    return function (source) { return source.lift(new ElementAtOperator(index, defaultValue)); };
}
var ElementAtOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function ElementAtOperator(index, defaultValue) {
        this.index = index;
        this.defaultValue = defaultValue;
        if (index < 0) {
            throw new __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__["a" /* ArgumentOutOfRangeError */];
        }
    }
    ElementAtOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ElementAtSubscriber(subscriber, this.index, this.defaultValue));
    };
    return ElementAtOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ElementAtSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(ElementAtSubscriber, _super);
    function ElementAtSubscriber(destination, index, defaultValue) {
        _super.call(this, destination);
        this.index = index;
        this.defaultValue = defaultValue;
    }
    ElementAtSubscriber.prototype._next = function (x) {
        if (this.index-- === 0) {
            this.destination.next(x);
            this.destination.complete();
        }
    };
    ElementAtSubscriber.prototype._complete = function () {
        var destination = this.destination;
        if (this.index >= 0) {
            if (typeof this.defaultValue !== 'undefined') {
                destination.next(this.defaultValue);
            }
            else {
                destination.error(new __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__["a" /* ArgumentOutOfRangeError */]);
            }
        }
        destination.complete();
    };
    return ElementAtSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=elementAt.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/exhaust.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export exhaust */
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


/**
 * Converts a higher-order Observable into a first-order Observable by dropping
 * inner Observables while the previous inner Observable has not yet completed.
 *
 * <span class="informal">Flattens an Observable-of-Observables by dropping the
 * next inner Observables while the current inner is still executing.</span>
 *
 * <img src="./img/exhaust.png" width="100%">
 *
 * `exhaust` subscribes to an Observable that emits Observables, also known as a
 * higher-order Observable. Each time it observes one of these emitted inner
 * Observables, the output Observable begins emitting the items emitted by that
 * inner Observable. So far, it behaves like {@link mergeAll}. However,
 * `exhaust` ignores every new inner Observable if the previous Observable has
 * not yet completed. Once that one completes, it will accept and flatten the
 * next inner Observable and repeat this process.
 *
 * @example <caption>Run a finite timer for each click, only if there is no currently active timer</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000).take(5));
 * var result = higherOrder.exhaust();
 * result.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link switch}
 * @see {@link mergeAll}
 * @see {@link exhaustMap}
 * @see {@link zipAll}
 *
 * @return {Observable} An Observable that takes a source of Observables and propagates the first observable
 * exclusively until it completes before subscribing to the next.
 * @method exhaust
 * @owner Observable
 */
function exhaust() {
    return function (source) { return source.lift(new SwitchFirstOperator()); };
}
var SwitchFirstOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SwitchFirstOperator() {
    }
    SwitchFirstOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SwitchFirstSubscriber(subscriber));
    };
    return SwitchFirstOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchFirstSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SwitchFirstSubscriber, _super);
    function SwitchFirstSubscriber(destination) {
        _super.call(this, destination);
        this.hasCompleted = false;
        this.hasSubscription = false;
    }
    SwitchFirstSubscriber.prototype._next = function (value) {
        if (!this.hasSubscription) {
            this.hasSubscription = true;
            this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, value));
        }
    };
    SwitchFirstSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
    };
    SwitchFirstSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    };
    return SwitchFirstSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=exhaust.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/exhaustMap.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export exhaustMap */
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
 * Observable only if the previous projected Observable has completed.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link exhaust}.</span>
 *
 * <img src="./img/exhaustMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. When it projects a source value to
 * an Observable, the output Observable begins emitting the items emitted by
 * that projected Observable. However, `exhaustMap` ignores every new projected
 * Observable if the previous projected Observable has not yet completed. Once
 * that one completes, it will accept and flatten the next projected Observable
 * and repeat this process.
 *
 * @example <caption>Run a finite timer for each click, only if there is no currently active timer</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.exhaustMap((ev) => Rx.Observable.interval(1000).take(5));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMap}
 * @see {@link exhaust}
 * @see {@link mergeMap}
 * @see {@link switchMap}
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
 * @return {Observable} An Observable containing projected Observables
 * of each item of the source, ignoring projected Observables that start before
 * their preceding Observable has completed.
 * @method exhaustMap
 * @owner Observable
 */
function exhaustMap(project, resultSelector) {
    return function (source) { return source.lift(new SwitchFirstMapOperator(project, resultSelector)); };
}
var SwitchFirstMapOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SwitchFirstMapOperator(project, resultSelector) {
        this.project = project;
        this.resultSelector = resultSelector;
    }
    SwitchFirstMapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SwitchFirstMapSubscriber(subscriber, this.project, this.resultSelector));
    };
    return SwitchFirstMapOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchFirstMapSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SwitchFirstMapSubscriber, _super);
    function SwitchFirstMapSubscriber(destination, project, resultSelector) {
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.hasSubscription = false;
        this.hasCompleted = false;
        this.index = 0;
    }
    SwitchFirstMapSubscriber.prototype._next = function (value) {
        if (!this.hasSubscription) {
            this.tryNext(value);
        }
    };
    SwitchFirstMapSubscriber.prototype.tryNext = function (value) {
        var index = this.index++;
        var destination = this.destination;
        try {
            var result = this.project(value, index);
            this.hasSubscription = true;
            this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, result, value, index));
        }
        catch (err) {
            destination.error(err);
        }
    };
    SwitchFirstMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
    };
    SwitchFirstMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var _a = this, resultSelector = _a.resultSelector, destination = _a.destination;
        if (resultSelector) {
            this.trySelectResult(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            destination.next(innerValue);
        }
    };
    SwitchFirstMapSubscriber.prototype.trySelectResult = function (outerValue, innerValue, outerIndex, innerIndex) {
        var _a = this, resultSelector = _a.resultSelector, destination = _a.destination;
        try {
            var result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
            destination.next(result);
        }
        catch (err) {
            destination.error(err);
        }
    };
    SwitchFirstMapSubscriber.prototype.notifyError = function (err) {
        this.destination.error(err);
    };
    SwitchFirstMapSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    };
    return SwitchFirstMapSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=exhaustMap.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/expand.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export expand */
/* unused harmony export ExpandOperator */
/* unused harmony export ExpandSubscriber */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_tryCatch__ = __webpack_require__("../../../../rxjs/_esm5/util/tryCatch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_errorObject__ = __webpack_require__("../../../../rxjs/_esm5/util/errorObject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._util_tryCatch,.._util_errorObject,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/* tslint:enable:max-line-length */
/**
 * Recursively projects each source value to an Observable which is merged in
 * the output Observable.
 *
 * <span class="informal">It's similar to {@link mergeMap}, but applies the
 * projection function to every source value as well as every output value.
 * It's recursive.</span>
 *
 * <img src="./img/expand.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger. *Expand* will re-emit on the output
 * Observable every source value. Then, each output value is given to the
 * `project` function which returns an inner Observable to be merged on the
 * output Observable. Those output values resulting from the projection are also
 * given to the `project` function to produce new output values. This is how
 * *expand* behaves recursively.
 *
 * @example <caption>Start emitting the powers of two on every click, at most 10 of them</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var powersOfTwo = clicks
 *   .mapTo(1)
 *   .expand(x => Rx.Observable.of(2 * x).delay(1000))
 *   .take(10);
 * powersOfTwo.subscribe(x => console.log(x));
 *
 * @see {@link mergeMap}
 * @see {@link mergeScan}
 *
 * @param {function(value: T, index: number) => Observable} project A function
 * that, when applied to an item emitted by the source or the output Observable,
 * returns an Observable.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The IScheduler to use for subscribing to
 * each projected inner Observable.
 * @return {Observable} An Observable that emits the source values and also
 * result of applying the projection function to each value emitted on the
 * output Observable and and merging the results of the Observables obtained
 * from this transformation.
 * @method expand
 * @owner Observable
 */
function expand(project, concurrent, scheduler) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    if (scheduler === void 0) {
        scheduler = undefined;
    }
    concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
    return function (source) { return source.lift(new ExpandOperator(project, concurrent, scheduler)); };
}
var ExpandOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function ExpandOperator(project, concurrent, scheduler) {
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
    }
    ExpandOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
    };
    return ExpandOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ExpandSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(ExpandSubscriber, _super);
    function ExpandSubscriber(destination, project, concurrent, scheduler) {
        _super.call(this, destination);
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
        this.index = 0;
        this.active = 0;
        this.hasCompleted = false;
        if (concurrent < Number.POSITIVE_INFINITY) {
            this.buffer = [];
        }
    }
    ExpandSubscriber.dispatch = function (arg) {
        var subscriber = arg.subscriber, result = arg.result, value = arg.value, index = arg.index;
        subscriber.subscribeToProjection(result, value, index);
    };
    ExpandSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        if (destination.closed) {
            this._complete();
            return;
        }
        var index = this.index++;
        if (this.active < this.concurrent) {
            destination.next(value);
            var result = Object(__WEBPACK_IMPORTED_MODULE_0__util_tryCatch__["a" /* tryCatch */])(this.project)(value, index);
            if (result === __WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */]) {
                destination.error(__WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */].e);
            }
            else if (!this.scheduler) {
                this.subscribeToProjection(result, value, index);
            }
            else {
                var state = { subscriber: this, result: result, value: value, index: index };
                this.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
            }
        }
        else {
            this.buffer.push(value);
        }
    };
    ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
        this.active++;
        this.add(Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, result, value, index));
    };
    ExpandSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    };
    ExpandSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this._next(innerValue);
    };
    ExpandSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer && buffer.length > 0) {
            this._next(buffer.shift());
        }
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    };
    return ExpandSubscriber;
}(__WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=expand.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/finalize.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export finalize */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/** PURE_IMPORTS_START .._Subscriber,.._Subscription PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * Returns an Observable that mirrors the source Observable, but will call a specified function when
 * the source terminates on complete or error.
 * @param {function} callback Function to be called when source terminates.
 * @return {Observable} An Observable that mirrors the source, but will call the specified function on termination.
 * @method finally
 * @owner Observable
 */
function finalize(callback) {
    return function (source) { return source.lift(new FinallyOperator(callback)); };
}
var FinallyOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function FinallyOperator(callback) {
        this.callback = callback;
    }
    FinallyOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new FinallySubscriber(subscriber, this.callback));
    };
    return FinallyOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FinallySubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(FinallySubscriber, _super);
    function FinallySubscriber(destination, callback) {
        _super.call(this, destination);
        this.add(new __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */](callback));
    }
    return FinallySubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=finalize.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/find.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export find */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FindValueOperator; });
/* unused harmony export FindValueSubscriber */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Emits only the first value emitted by the source Observable that meets some
 * condition.
 *
 * <span class="informal">Finds the first value that passes some test and emits
 * that.</span>
 *
 * <img src="./img/find.png" width="100%">
 *
 * `find` searches for the first item in the source Observable that matches the
 * specified condition embodied by the `predicate`, and returns the first
 * occurrence in the source. Unlike {@link first}, the `predicate` is required
 * in `find`, and does not emit an error if a valid value is not found.
 *
 * @example <caption>Find and emit the first click that happens on a DIV element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.find(ev => ev.target.tagName === 'DIV');
 * result.subscribe(x => console.log(x));
 *
 * @see {@link filter}
 * @see {@link first}
 * @see {@link findIndex}
 * @see {@link take}
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} predicate
 * A function called with each item to test for condition matching.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable<T>} An Observable of the first item that matches the
 * condition.
 * @method find
 * @owner Observable
 */
function find(predicate, thisArg) {
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate is not a function');
    }
    return function (source) { return source.lift(new FindValueOperator(predicate, source, false, thisArg)); };
}
var FindValueOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function FindValueOperator(predicate, source, yieldIndex, thisArg) {
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
    }
    FindValueOperator.prototype.call = function (observer, source) {
        return source.subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
    };
    return FindValueOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FindValueSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(FindValueSubscriber, _super);
    function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
        this.index = 0;
    }
    FindValueSubscriber.prototype.notifyComplete = function (value) {
        var destination = this.destination;
        destination.next(value);
        destination.complete();
    };
    FindValueSubscriber.prototype._next = function (value) {
        var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
        var index = this.index++;
        try {
            var result = predicate.call(thisArg || this, value, index, this.source);
            if (result) {
                this.notifyComplete(this.yieldIndex ? index : value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    FindValueSubscriber.prototype._complete = function () {
        this.notifyComplete(this.yieldIndex ? -1 : undefined);
    };
    return FindValueSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=find.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/findIndex.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export findIndex */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__operators_find__ = __webpack_require__("../../../../rxjs/_esm5/operators/find.js");
/** PURE_IMPORTS_START .._operators_find PURE_IMPORTS_END */

/**
 * Emits only the index of the first value emitted by the source Observable that
 * meets some condition.
 *
 * <span class="informal">It's like {@link find}, but emits the index of the
 * found value, not the value itself.</span>
 *
 * <img src="./img/findIndex.png" width="100%">
 *
 * `findIndex` searches for the first item in the source Observable that matches
 * the specified condition embodied by the `predicate`, and returns the
 * (zero-based) index of the first occurrence in the source. Unlike
 * {@link first}, the `predicate` is required in `findIndex`, and does not emit
 * an error if a valid value is not found.
 *
 * @example <caption>Emit the index of first click that happens on a DIV element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.findIndex(ev => ev.target.tagName === 'DIV');
 * result.subscribe(x => console.log(x));
 *
 * @see {@link filter}
 * @see {@link find}
 * @see {@link first}
 * @see {@link take}
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} predicate
 * A function called with each item to test for condition matching.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable} An Observable of the index of the first item that
 * matches the condition.
 * @method find
 * @owner Observable
 */
function findIndex(predicate, thisArg) {
    return function (source) { return source.lift(new __WEBPACK_IMPORTED_MODULE_0__operators_find__["a" /* FindValueOperator */](predicate, source, true, thisArg)); };
}
//# sourceMappingURL=findIndex.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/groupBy.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export groupBy */
/* unused harmony export GroupedObservable */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Observable__ = __webpack_require__("../../../../rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_Map__ = __webpack_require__("../../../../rxjs/_esm5/util/Map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_FastMap__ = __webpack_require__("../../../../rxjs/_esm5/util/FastMap.js");
/** PURE_IMPORTS_START .._Subscriber,.._Subscription,.._Observable,.._Subject,.._util_Map,.._util_FastMap PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};






/* tslint:enable:max-line-length */
/**
 * Groups the items emitted by an Observable according to a specified criterion,
 * and emits these grouped items as `GroupedObservables`, one
 * {@link GroupedObservable} per group.
 *
 * <img src="./img/groupBy.png" width="100%">
 *
 * @example <caption>Group objects by id and return as array</caption>
 * Observable.of<Obj>({id: 1, name: 'aze1'},
 *                    {id: 2, name: 'sf2'},
 *                    {id: 2, name: 'dg2'},
 *                    {id: 1, name: 'erg1'},
 *                    {id: 1, name: 'df1'},
 *                    {id: 2, name: 'sfqfb2'},
 *                    {id: 3, name: 'qfs3'},
 *                    {id: 2, name: 'qsgqsfg2'}
 *     )
 *     .groupBy(p => p.id)
 *     .flatMap( (group$) => group$.reduce((acc, cur) => [...acc, cur], []))
 *     .subscribe(p => console.log(p));
 *
 * // displays:
 * // [ { id: 1, name: 'aze1' },
 * //   { id: 1, name: 'erg1' },
 * //   { id: 1, name: 'df1' } ]
 * //
 * // [ { id: 2, name: 'sf2' },
 * //   { id: 2, name: 'dg2' },
 * //   { id: 2, name: 'sfqfb2' },
 * //   { id: 2, name: 'qsgqsfg2' } ]
 * //
 * // [ { id: 3, name: 'qfs3' } ]
 *
 * @example <caption>Pivot data on the id field</caption>
 * Observable.of<Obj>({id: 1, name: 'aze1'},
 *                    {id: 2, name: 'sf2'},
 *                    {id: 2, name: 'dg2'},
 *                    {id: 1, name: 'erg1'},
 *                    {id: 1, name: 'df1'},
 *                    {id: 2, name: 'sfqfb2'},
 *                    {id: 3, name: 'qfs1'},
 *                    {id: 2, name: 'qsgqsfg2'}
 *                   )
 *     .groupBy(p => p.id, p => p.name)
 *     .flatMap( (group$) => group$.reduce((acc, cur) => [...acc, cur], ["" + group$.key]))
 *     .map(arr => ({'id': parseInt(arr[0]), 'values': arr.slice(1)}))
 *     .subscribe(p => console.log(p));
 *
 * // displays:
 * // { id: 1, values: [ 'aze1', 'erg1', 'df1' ] }
 * // { id: 2, values: [ 'sf2', 'dg2', 'sfqfb2', 'qsgqsfg2' ] }
 * // { id: 3, values: [ 'qfs1' ] }
 *
 * @param {function(value: T): K} keySelector A function that extracts the key
 * for each item.
 * @param {function(value: T): R} [elementSelector] A function that extracts the
 * return element for each item.
 * @param {function(grouped: GroupedObservable<K,R>): Observable<any>} [durationSelector]
 * A function that returns an Observable to determine how long each group should
 * exist.
 * @return {Observable<GroupedObservable<K,R>>} An Observable that emits
 * GroupedObservables, each of which corresponds to a unique key value and each
 * of which emits those items from the source Observable that share that key
 * value.
 * @method groupBy
 * @owner Observable
 */
function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
    return function (source) {
        return source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
    };
}
var GroupByOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector) {
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.subjectSelector = subjectSelector;
    }
    GroupByOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
    };
    return GroupByOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var GroupBySubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(GroupBySubscriber, _super);
    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
        _super.call(this, destination);
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.subjectSelector = subjectSelector;
        this.groups = null;
        this.attemptedToUnsubscribe = false;
        this.count = 0;
    }
    GroupBySubscriber.prototype._next = function (value) {
        var key;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            this.error(err);
            return;
        }
        this._group(value, key);
    };
    GroupBySubscriber.prototype._group = function (value, key) {
        var groups = this.groups;
        if (!groups) {
            groups = this.groups = typeof key === 'string' ? new __WEBPACK_IMPORTED_MODULE_5__util_FastMap__["a" /* FastMap */]() : new __WEBPACK_IMPORTED_MODULE_4__util_Map__["a" /* Map */]();
        }
        var group = groups.get(key);
        var element;
        if (this.elementSelector) {
            try {
                element = this.elementSelector(value);
            }
            catch (err) {
                this.error(err);
            }
        }
        else {
            element = value;
        }
        if (!group) {
            group = this.subjectSelector ? this.subjectSelector() : new __WEBPACK_IMPORTED_MODULE_3__Subject__["Subject"]();
            groups.set(key, group);
            var groupedObservable = new GroupedObservable(key, group, this);
            this.destination.next(groupedObservable);
            if (this.durationSelector) {
                var duration = void 0;
                try {
                    duration = this.durationSelector(new GroupedObservable(key, group));
                }
                catch (err) {
                    this.error(err);
                    return;
                }
                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
            }
        }
        if (!group.closed) {
            group.next(element);
        }
    };
    GroupBySubscriber.prototype._error = function (err) {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.error(err);
            });
            groups.clear();
        }
        this.destination.error(err);
    };
    GroupBySubscriber.prototype._complete = function () {
        var groups = this.groups;
        if (groups) {
            groups.forEach(function (group, key) {
                group.complete();
            });
            groups.clear();
        }
        this.destination.complete();
    };
    GroupBySubscriber.prototype.removeGroup = function (key) {
        this.groups.delete(key);
    };
    GroupBySubscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.attemptedToUnsubscribe = true;
            if (this.count === 0) {
                _super.prototype.unsubscribe.call(this);
            }
        }
    };
    return GroupBySubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var GroupDurationSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(GroupDurationSubscriber, _super);
    function GroupDurationSubscriber(key, group, parent) {
        _super.call(this, group);
        this.key = key;
        this.group = group;
        this.parent = parent;
    }
    GroupDurationSubscriber.prototype._next = function (value) {
        this.complete();
    };
    /** @deprecated internal use only */ GroupDurationSubscriber.prototype._unsubscribe = function () {
        var _a = this, parent = _a.parent, key = _a.key;
        this.key = this.parent = null;
        if (parent) {
            parent.removeGroup(key);
        }
    };
    return GroupDurationSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
/**
 * An Observable representing values belonging to the same group represented by
 * a common key. The values emitted by a GroupedObservable come from the source
 * Observable. The common key is available as the field `key` on a
 * GroupedObservable instance.
 *
 * @class GroupedObservable<K, T>
 */
var GroupedObservable = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(GroupedObservable, _super);
    function GroupedObservable(key, groupSubject, refCountSubscription) {
        _super.call(this);
        this.key = key;
        this.groupSubject = groupSubject;
        this.refCountSubscription = refCountSubscription;
    }
    /** @deprecated internal use only */ GroupedObservable.prototype._subscribe = function (subscriber) {
        var subscription = new __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */]();
        var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
        if (refCountSubscription && !refCountSubscription.closed) {
            subscription.add(new InnerRefCountSubscription(refCountSubscription));
        }
        subscription.add(groupSubject.subscribe(subscriber));
        return subscription;
    };
    return GroupedObservable;
}(__WEBPACK_IMPORTED_MODULE_2__Observable__["a" /* Observable */]));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerRefCountSubscription = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(InnerRefCountSubscription, _super);
    function InnerRefCountSubscription(parent) {
        _super.call(this);
        this.parent = parent;
        parent.count++;
    }
    InnerRefCountSubscription.prototype.unsubscribe = function () {
        var parent = this.parent;
        if (!parent.closed && !this.closed) {
            _super.prototype.unsubscribe.call(this);
            parent.count -= 1;
            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                parent.unsubscribe();
            }
        }
    };
    return InnerRefCountSubscription;
}(__WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */]));
//# sourceMappingURL=groupBy.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/ignoreElements.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ignoreElements */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_noop__ = __webpack_require__("../../../../rxjs/_esm5/util/noop.js");
/** PURE_IMPORTS_START .._Subscriber,.._util_noop PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * Ignores all items emitted by the source Observable and only passes calls of `complete` or `error`.
 *
 * <img src="./img/ignoreElements.png" width="100%">
 *
 * @return {Observable} An empty Observable that only calls `complete`
 * or `error`, based on which one is called by the source Observable.
 * @method ignoreElements
 * @owner Observable
 */
function ignoreElements() {
    return function ignoreElementsOperatorFunction(source) {
        return source.lift(new IgnoreElementsOperator());
    };
}
var IgnoreElementsOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function IgnoreElementsOperator() {
    }
    IgnoreElementsOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new IgnoreElementsSubscriber(subscriber));
    };
    return IgnoreElementsOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var IgnoreElementsSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(IgnoreElementsSubscriber, _super);
    function IgnoreElementsSubscriber() {
        _super.apply(this, arguments);
    }
    IgnoreElementsSubscriber.prototype._next = function (unused) {
        Object(__WEBPACK_IMPORTED_MODULE_1__util_noop__["a" /* noop */])();
    };
    return IgnoreElementsSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=ignoreElements.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/isEmpty.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isEmpty */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

function isEmpty() {
    return function (source) { return source.lift(new IsEmptyOperator()); };
}
var IsEmptyOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function IsEmptyOperator() {
    }
    IsEmptyOperator.prototype.call = function (observer, source) {
        return source.subscribe(new IsEmptySubscriber(observer));
    };
    return IsEmptyOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var IsEmptySubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(IsEmptySubscriber, _super);
    function IsEmptySubscriber(destination) {
        _super.call(this, destination);
    }
    IsEmptySubscriber.prototype.notifyComplete = function (isEmpty) {
        var destination = this.destination;
        destination.next(isEmpty);
        destination.complete();
    };
    IsEmptySubscriber.prototype._next = function (value) {
        this.notifyComplete(false);
    };
    IsEmptySubscriber.prototype._complete = function () {
        this.notifyComplete(true);
    };
    return IsEmptySubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=isEmpty.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/mapTo.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export mapTo */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Emits the given constant value on the output Observable every time the source
 * Observable emits a value.
 *
 * <span class="informal">Like {@link map}, but it maps every source value to
 * the same output value every time.</span>
 *
 * <img src="./img/mapTo.png" width="100%">
 *
 * Takes a constant `value` as argument, and emits that whenever the source
 * Observable emits a value. In other words, ignores the actual source value,
 * and simply uses the emission moment to know when to emit the given `value`.
 *
 * @example <caption>Map every click to the string 'Hi'</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var greetings = clicks.mapTo('Hi');
 * greetings.subscribe(x => console.log(x));
 *
 * @see {@link map}
 *
 * @param {any} value The value to map each source value to.
 * @return {Observable} An Observable that emits the given `value` every time
 * the source Observable emits something.
 * @method mapTo
 * @owner Observable
 */
function mapTo(value) {
    return function (source) { return source.lift(new MapToOperator(value)); };
}
var MapToOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function MapToOperator(value) {
        this.value = value;
    }
    MapToOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapToSubscriber(subscriber, this.value));
    };
    return MapToOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MapToSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(MapToSubscriber, _super);
    function MapToSubscriber(destination, value) {
        _super.call(this, destination);
        this.value = value;
    }
    MapToSubscriber.prototype._next = function (x) {
        this.destination.next(this.value);
    };
    return MapToSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=mapTo.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/materialize.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export materialize */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Notification__ = __webpack_require__("../../../../rxjs/_esm5/Notification.js");
/** PURE_IMPORTS_START .._Subscriber,.._Notification PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * Represents all of the notifications from the source Observable as `next`
 * emissions marked with their original types within {@link Notification}
 * objects.
 *
 * <span class="informal">Wraps `next`, `error` and `complete` emissions in
 * {@link Notification} objects, emitted as `next` on the output Observable.
 * </span>
 *
 * <img src="./img/materialize.png" width="100%">
 *
 * `materialize` returns an Observable that emits a `next` notification for each
 * `next`, `error`, or `complete` emission of the source Observable. When the
 * source Observable emits `complete`, the output Observable will emit `next` as
 * a Notification of type "complete", and then it will emit `complete` as well.
 * When the source Observable emits `error`, the output will emit `next` as a
 * Notification of type "error", and then `complete`.
 *
 * This operator is useful for producing metadata of the source Observable, to
 * be consumed as `next` emissions. Use it in conjunction with
 * {@link dematerialize}.
 *
 * @example <caption>Convert a faulty Observable to an Observable of Notifications</caption>
 * var letters = Rx.Observable.of('a', 'b', 13, 'd');
 * var upperCase = letters.map(x => x.toUpperCase());
 * var materialized = upperCase.materialize();
 * materialized.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // - Notification {kind: "N", value: "A", error: undefined, hasValue: true}
 * // - Notification {kind: "N", value: "B", error: undefined, hasValue: true}
 * // - Notification {kind: "E", value: undefined, error: TypeError:
 * //   x.toUpperCase is not a function at MapSubscriber.letters.map.x
 * //   [as project] (http://1…, hasValue: false}
 *
 * @see {@link Notification}
 * @see {@link dematerialize}
 *
 * @return {Observable<Notification<T>>} An Observable that emits
 * {@link Notification} objects that wrap the original emissions from the source
 * Observable with metadata.
 * @method materialize
 * @owner Observable
 */
function materialize() {
    return function materializeOperatorFunction(source) {
        return source.lift(new MaterializeOperator());
    };
}
var MaterializeOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function MaterializeOperator() {
    }
    MaterializeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MaterializeSubscriber(subscriber));
    };
    return MaterializeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MaterializeSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(MaterializeSubscriber, _super);
    function MaterializeSubscriber(destination) {
        _super.call(this, destination);
    }
    MaterializeSubscriber.prototype._next = function (value) {
        this.destination.next(__WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createNext(value));
    };
    MaterializeSubscriber.prototype._error = function (err) {
        var destination = this.destination;
        destination.next(__WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createError(err));
        destination.complete();
    };
    MaterializeSubscriber.prototype._complete = function () {
        var destination = this.destination;
        destination.next(__WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createComplete());
        destination.complete();
    };
    return MaterializeSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=materialize.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/max.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export max */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reduce__ = __webpack_require__("../../../../rxjs/_esm5/operators/reduce.js");
/** PURE_IMPORTS_START ._reduce PURE_IMPORTS_END */

/**
 * The Max operator operates on an Observable that emits numbers (or items that can be compared with a provided function),
 * and when source Observable completes it emits a single item: the item with the largest value.
 *
 * <img src="./img/max.png" width="100%">
 *
 * @example <caption>Get the maximal value of a series of numbers</caption>
 * Rx.Observable.of(5, 4, 7, 2, 8)
 *   .max()
 *   .subscribe(x => console.log(x)); // -> 8
 *
 * @example <caption>Use a comparer function to get the maximal item</caption>
 * interface Person {
 *   age: number,
 *   name: string
 * }
 * Observable.of<Person>({age: 7, name: 'Foo'},
 *                       {age: 5, name: 'Bar'},
 *                       {age: 9, name: 'Beer'})
 *           .max<Person>((a: Person, b: Person) => a.age < b.age ? -1 : 1)
 *           .subscribe((x: Person) => console.log(x.name)); // -> 'Beer'
 * }
 *
 * @see {@link min}
 *
 * @param {Function} [comparer] - Optional comparer function that it will use instead of its default to compare the
 * value of two items.
 * @return {Observable} An Observable that emits item with the largest value.
 * @method max
 * @owner Observable
 */
function max(comparer) {
    var max = (typeof comparer === 'function')
        ? function (x, y) { return comparer(x, y) > 0 ? x : y; }
        : function (x, y) { return x > y ? x : y; };
    return Object(__WEBPACK_IMPORTED_MODULE_0__reduce__["a" /* reduce */])(max);
}
//# sourceMappingURL=max.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/merge.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export merge */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_merge__ = __webpack_require__("../../../../rxjs/_esm5/observable/merge.js");
/* unused harmony reexport mergeStatic */
/** PURE_IMPORTS_START .._observable_merge PURE_IMPORTS_END */


/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which concurrently emits all values from every
 * given input Observable.
 *
 * <span class="informal">Flattens multiple Observables together by blending
 * their values into one Observable.</span>
 *
 * <img src="./img/merge.png" width="100%">
 *
 * `merge` subscribes to each given input Observable (either the source or an
 * Observable given as argument), and simply forwards (without doing any
 * transformation) all the values from all the input Observables to the output
 * Observable. The output Observable only completes once all input Observables
 * have completed. Any error delivered by an input Observable will be immediately
 * emitted on the output Observable.
 *
 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var clicksOrTimer = clicks.merge(timer);
 * clicksOrTimer.subscribe(x => console.log(x));
 *
 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var concurrent = 2; // the argument
 * var merged = timer1.merge(timer2, timer3, concurrent);
 * merged.subscribe(x => console.log(x));
 *
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 *
 * @param {ObservableInput} other An input Observable to merge with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The IScheduler to use for managing
 * concurrency of input Observables.
 * @return {Observable} An Observable that emits items that are the result of
 * every input Observable.
 * @method merge
 * @owner Observable
 */
function merge() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    return function (source) { return source.lift.call(__WEBPACK_IMPORTED_MODULE_0__observable_merge__["a" /* merge */].apply(void 0, [source].concat(observables))); };
}
//# sourceMappingURL=merge.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/mergeMapTo.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export mergeMapTo */
/* unused harmony export MergeMapToOperator */
/* unused harmony export MergeMapToSubscriber */
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
 * Projects each source value to the same Observable which is merged multiple
 * times in the output Observable.
 *
 * <span class="informal">It's like {@link mergeMap}, but maps each value always
 * to the same inner Observable.</span>
 *
 * <img src="./img/mergeMapTo.png" width="100%">
 *
 * Maps each source value to the given Observable `innerObservable` regardless
 * of the source value, and then merges those resulting Observables into one
 * single Observable, which is the output Observable.
 *
 * @example <caption>For each click event, start an interval Observable ticking every 1 second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.mergeMapTo(Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMapTo}
 * @see {@link merge}
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeScan}
 * @see {@link switchMapTo}
 *
 * @param {ObservableInput} innerObservable An Observable to replace each value from
 * the source Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits items from the given
 * `innerObservable` (and optionally transformed through `resultSelector`) every
 * time a value is emitted on the source Observable.
 * @method mergeMapTo
 * @owner Observable
 */
function mergeMapTo(innerObservable, resultSelector, concurrent) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
        resultSelector = null;
    }
    return function (source) { return source.lift(new MergeMapToOperator(innerObservable, resultSelector, concurrent)); };
}
// TODO: Figure out correct signature here: an Operator<Observable<T>, R>
//       needs to implement call(observer: Subscriber<R>): Subscriber<Observable<T>>
var MergeMapToOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function MergeMapToOperator(ish, resultSelector, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        this.ish = ish;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
    }
    MergeMapToOperator.prototype.call = function (observer, source) {
        return source.subscribe(new MergeMapToSubscriber(observer, this.ish, this.resultSelector, this.concurrent));
    };
    return MergeMapToOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MergeMapToSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(MergeMapToSubscriber, _super);
    function MergeMapToSubscriber(destination, ish, resultSelector, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        _super.call(this, destination);
        this.ish = ish;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    MergeMapToSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            var resultSelector = this.resultSelector;
            var index = this.index++;
            var ish = this.ish;
            var destination = this.destination;
            this.active++;
            this._innerSub(ish, destination, resultSelector, value, index);
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeMapToSubscriber.prototype._innerSub = function (ish, destination, resultSelector, value, index) {
        this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, ish, value, index));
    };
    MergeMapToSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    };
    MergeMapToSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var _a = this, resultSelector = _a.resultSelector, destination = _a.destination;
        if (resultSelector) {
            this.trySelectResult(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            destination.next(innerValue);
        }
    };
    MergeMapToSubscriber.prototype.trySelectResult = function (outerValue, innerValue, outerIndex, innerIndex) {
        var _a = this, resultSelector = _a.resultSelector, destination = _a.destination;
        var result;
        try {
            result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        destination.next(result);
    };
    MergeMapToSubscriber.prototype.notifyError = function (err) {
        this.destination.error(err);
    };
    MergeMapToSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeMapToSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=mergeMapTo.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/mergeScan.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export mergeScan */
/* unused harmony export MergeScanOperator */
/* unused harmony export MergeScanSubscriber */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_tryCatch__ = __webpack_require__("../../../../rxjs/_esm5/util/tryCatch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_errorObject__ = __webpack_require__("../../../../rxjs/_esm5/util/errorObject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/** PURE_IMPORTS_START .._util_tryCatch,.._util_errorObject,.._util_subscribeToResult,.._OuterSubscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/**
 * Applies an accumulator function over the source Observable where the
 * accumulator function itself returns an Observable, then each intermediate
 * Observable returned is merged into the output Observable.
 *
 * <span class="informal">It's like {@link scan}, but the Observables returned
 * by the accumulator are merged into the outer Observable.</span>
 *
 * @example <caption>Count the number of click events</caption>
 * const click$ = Rx.Observable.fromEvent(document, 'click');
 * const one$ = click$.mapTo(1);
 * const seed = 0;
 * const count$ = one$.mergeScan((acc, one) => Rx.Observable.of(acc + one), seed);
 * count$.subscribe(x => console.log(x));
 *
 * // Results:
 * 1
 * 2
 * 3
 * 4
 * // ...and so on for each click
 *
 * @param {function(acc: R, value: T): Observable<R>} accumulator
 * The accumulator function called on each source value.
 * @param seed The initial accumulation value.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of
 * input Observables being subscribed to concurrently.
 * @return {Observable<R>} An observable of the accumulated values.
 * @method mergeScan
 * @owner Observable
 */
function mergeScan(accumulator, seed, concurrent) {
    if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
    }
    return function (source) { return source.lift(new MergeScanOperator(accumulator, seed, concurrent)); };
}
var MergeScanOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function MergeScanOperator(accumulator, seed, concurrent) {
        this.accumulator = accumulator;
        this.seed = seed;
        this.concurrent = concurrent;
    }
    MergeScanOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MergeScanSubscriber(subscriber, this.accumulator, this.seed, this.concurrent));
    };
    return MergeScanOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MergeScanSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(MergeScanSubscriber, _super);
    function MergeScanSubscriber(destination, accumulator, acc, concurrent) {
        _super.call(this, destination);
        this.accumulator = accumulator;
        this.acc = acc;
        this.concurrent = concurrent;
        this.hasValue = false;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    MergeScanSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            var index = this.index++;
            var ish = Object(__WEBPACK_IMPORTED_MODULE_0__util_tryCatch__["a" /* tryCatch */])(this.accumulator)(this.acc, value);
            var destination = this.destination;
            if (ish === __WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */]) {
                destination.error(__WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */].e);
            }
            else {
                this.active++;
                this._innerSub(ish, value, index);
            }
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeScanSubscriber.prototype._innerSub = function (ish, value, index) {
        this.add(Object(__WEBPACK_IMPORTED_MODULE_2__util_subscribeToResult__["a" /* subscribeToResult */])(this, ish, value, index));
    };
    MergeScanSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    };
    MergeScanSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var destination = this.destination;
        this.acc = innerValue;
        this.hasValue = true;
        destination.next(innerValue);
    };
    MergeScanSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    };
    return MergeScanSubscriber;
}(__WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=mergeScan.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/min.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export min */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reduce__ = __webpack_require__("../../../../rxjs/_esm5/operators/reduce.js");
/** PURE_IMPORTS_START ._reduce PURE_IMPORTS_END */

/**
 * The Min operator operates on an Observable that emits numbers (or items that can be compared with a provided function),
 * and when source Observable completes it emits a single item: the item with the smallest value.
 *
 * <img src="./img/min.png" width="100%">
 *
 * @example <caption>Get the minimal value of a series of numbers</caption>
 * Rx.Observable.of(5, 4, 7, 2, 8)
 *   .min()
 *   .subscribe(x => console.log(x)); // -> 2
 *
 * @example <caption>Use a comparer function to get the minimal item</caption>
 * interface Person {
 *   age: number,
 *   name: string
 * }
 * Observable.of<Person>({age: 7, name: 'Foo'},
 *                       {age: 5, name: 'Bar'},
 *                       {age: 9, name: 'Beer'})
 *           .min<Person>( (a: Person, b: Person) => a.age < b.age ? -1 : 1)
 *           .subscribe((x: Person) => console.log(x.name)); // -> 'Bar'
 * }
 *
 * @see {@link max}
 *
 * @param {Function} [comparer] - Optional comparer function that it will use instead of its default to compare the
 * value of two items.
 * @return {Observable<R>} An Observable that emits item with the smallest value.
 * @method min
 * @owner Observable
 */
function min(comparer) {
    var min = (typeof comparer === 'function')
        ? function (x, y) { return comparer(x, y) < 0 ? x : y; }
        : function (x, y) { return x < y ? x : y; };
    return Object(__WEBPACK_IMPORTED_MODULE_0__reduce__["a" /* reduce */])(min);
}
//# sourceMappingURL=min.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/onErrorResumeNext.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export onErrorResumeNext */
/* unused harmony export onErrorResumeNextStatic */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_FromObservable__ = __webpack_require__("../../../../rxjs/_esm5/observable/FromObservable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isArray__ = __webpack_require__("../../../../rxjs/_esm5/util/isArray.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._observable_FromObservable,.._util_isArray,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/* tslint:enable:max-line-length */
/**
 * When any of the provided Observable emits an complete or error notification, it immediately subscribes to the next one
 * that was passed.
 *
 * <span class="informal">Execute series of Observables no matter what, even if it means swallowing errors.</span>
 *
 * <img src="./img/onErrorResumeNext.png" width="100%">
 *
 * `onErrorResumeNext` is an operator that accepts a series of Observables, provided either directly as
 * arguments or as an array. If no single Observable is provided, returned Observable will simply behave the same
 * as the source.
 *
 * `onErrorResumeNext` returns an Observable that starts by subscribing and re-emitting values from the source Observable.
 * When its stream of values ends - no matter if Observable completed or emitted an error - `onErrorResumeNext`
 * will subscribe to the first Observable that was passed as an argument to the method. It will start re-emitting
 * its values as well and - again - when that stream ends, `onErrorResumeNext` will proceed to subscribing yet another
 * Observable in provided series, no matter if previous Observable completed or ended with an error. This will
 * be happening until there is no more Observables left in the series, at which point returned Observable will
 * complete - even if the last subscribed stream ended with an error.
 *
 * `onErrorResumeNext` can be therefore thought of as version of {@link concat} operator, which is more permissive
 * when it comes to the errors emitted by its input Observables. While `concat` subscribes to the next Observable
 * in series only if previous one successfully completed, `onErrorResumeNext` subscribes even if it ended with
 * an error.
 *
 * Note that you do not get any access to errors emitted by the Observables. In particular do not
 * expect these errors to appear in error callback passed to {@link subscribe}. If you want to take
 * specific actions based on what error was emitted by an Observable, you should try out {@link catch} instead.
 *
 *
 * @example <caption>Subscribe to the next Observable after map fails</caption>
 * Rx.Observable.of(1, 2, 3, 0)
 *   .map(x => {
 *       if (x === 0) { throw Error(); }
         return 10 / x;
 *   })
 *   .onErrorResumeNext(Rx.Observable.of(1, 2, 3))
 *   .subscribe(
 *     val => console.log(val),
 *     err => console.log(err),          // Will never be called.
 *     () => console.log('that\'s it!')
 *   );
 *
 * // Logs:
 * // 10
 * // 5
 * // 3.3333333333333335
 * // 1
 * // 2
 * // 3
 * // "that's it!"
 *
 * @see {@link concat}
 * @see {@link catch}
 *
 * @param {...ObservableInput} observables Observables passed either directly or as an array.
 * @return {Observable} An Observable that emits values from source Observable, but - if it errors - subscribes
 * to the next passed Observable and so on, until it completes or runs out of Observables.
 * @method onErrorResumeNext
 * @owner Observable
 */
function onErrorResumeNext() {
    var nextSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nextSources[_i - 0] = arguments[_i];
    }
    if (nextSources.length === 1 && Object(__WEBPACK_IMPORTED_MODULE_1__util_isArray__["a" /* isArray */])(nextSources[0])) {
        nextSources = nextSources[0];
    }
    return function (source) { return source.lift(new OnErrorResumeNextOperator(nextSources)); };
}
/* tslint:enable:max-line-length */
function onErrorResumeNextStatic() {
    var nextSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nextSources[_i - 0] = arguments[_i];
    }
    var source = null;
    if (nextSources.length === 1 && Object(__WEBPACK_IMPORTED_MODULE_1__util_isArray__["a" /* isArray */])(nextSources[0])) {
        nextSources = nextSources[0];
    }
    source = nextSources.shift();
    return new __WEBPACK_IMPORTED_MODULE_0__observable_FromObservable__["a" /* FromObservable */](source, null).lift(new OnErrorResumeNextOperator(nextSources));
}
var OnErrorResumeNextOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function OnErrorResumeNextOperator(nextSources) {
        this.nextSources = nextSources;
    }
    OnErrorResumeNextOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
    };
    return OnErrorResumeNextOperator;
}());
var OnErrorResumeNextSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(OnErrorResumeNextSubscriber, _super);
    function OnErrorResumeNextSubscriber(destination, nextSources) {
        _super.call(this, destination);
        this.destination = destination;
        this.nextSources = nextSources;
    }
    OnErrorResumeNextSubscriber.prototype.notifyError = function (error, innerSub) {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype.notifyComplete = function (innerSub) {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype._error = function (err) {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype._complete = function () {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
        var next = this.nextSources.shift();
        if (next) {
            this.add(Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, next));
        }
        else {
            this.destination.complete();
        }
    };
    return OnErrorResumeNextSubscriber;
}(__WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=onErrorResumeNext.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/pairwise.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export pairwise */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Groups pairs of consecutive emissions together and emits them as an array of
 * two values.
 *
 * <span class="informal">Puts the current value and previous value together as
 * an array, and emits that.</span>
 *
 * <img src="./img/pairwise.png" width="100%">
 *
 * The Nth emission from the source Observable will cause the output Observable
 * to emit an array [(N-1)th, Nth] of the previous and the current value, as a
 * pair. For this reason, `pairwise` emits on the second and subsequent
 * emissions from the source Observable, but not on the first emission, because
 * there is no previous value in that case.
 *
 * @example <caption>On every click (starting from the second), emit the relative distance to the previous click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var pairs = clicks.pairwise();
 * var distance = pairs.map(pair => {
 *   var x0 = pair[0].clientX;
 *   var y0 = pair[0].clientY;
 *   var x1 = pair[1].clientX;
 *   var y1 = pair[1].clientY;
 *   return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
 * });
 * distance.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 *
 * @return {Observable<Array<T>>} An Observable of pairs (as arrays) of
 * consecutive values from the source Observable.
 * @method pairwise
 * @owner Observable
 */
function pairwise() {
    return function (source) { return source.lift(new PairwiseOperator()); };
}
var PairwiseOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function PairwiseOperator() {
    }
    PairwiseOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new PairwiseSubscriber(subscriber));
    };
    return PairwiseOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var PairwiseSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(PairwiseSubscriber, _super);
    function PairwiseSubscriber(destination) {
        _super.call(this, destination);
        this.hasPrev = false;
    }
    PairwiseSubscriber.prototype._next = function (value) {
        if (this.hasPrev) {
            this.destination.next([this.prev, value]);
        }
        else {
            this.hasPrev = true;
        }
        this.prev = value;
    };
    return PairwiseSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=pairwise.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/partition.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export partition */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_not__ = __webpack_require__("../../../../rxjs/_esm5/util/not.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__filter__ = __webpack_require__("../../../../rxjs/_esm5/operators/filter.js");
/** PURE_IMPORTS_START .._util_not,._filter PURE_IMPORTS_END */


/**
 * Splits the source Observable into two, one with values that satisfy a
 * predicate, and another with values that don't satisfy the predicate.
 *
 * <span class="informal">It's like {@link filter}, but returns two Observables:
 * one like the output of {@link filter}, and the other with values that did not
 * pass the condition.</span>
 *
 * <img src="./img/partition.png" width="100%">
 *
 * `partition` outputs an array with two Observables that partition the values
 * from the source Observable through the given `predicate` function. The first
 * Observable in that array emits source values for which the predicate argument
 * returns true. The second Observable emits source values for which the
 * predicate returns false. The first behaves like {@link filter} and the second
 * behaves like {@link filter} with the predicate negated.
 *
 * @example <caption>Partition click events into those on DIV elements and those elsewhere</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var parts = clicks.partition(ev => ev.target.tagName === 'DIV');
 * var clicksOnDivs = parts[0];
 * var clicksElsewhere = parts[1];
 * clicksOnDivs.subscribe(x => console.log('DIV clicked: ', x));
 * clicksElsewhere.subscribe(x => console.log('Other clicked: ', x));
 *
 * @see {@link filter}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates each value emitted by the source Observable. If it returns `true`,
 * the value is emitted on the first Observable in the returned array, if
 * `false` the value is emitted on the second Observable in the array. The
 * `index` parameter is the number `i` for the i-th source emission that has
 * happened since the subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {[Observable<T>, Observable<T>]} An array with two Observables: one
 * with values that passed the predicate, and another with values that did not
 * pass the predicate.
 * @method partition
 * @owner Observable
 */
function partition(predicate, thisArg) {
    return function (source) {
        return [
            Object(__WEBPACK_IMPORTED_MODULE_1__filter__["a" /* filter */])(predicate, thisArg)(source),
            Object(__WEBPACK_IMPORTED_MODULE_1__filter__["a" /* filter */])(Object(__WEBPACK_IMPORTED_MODULE_0__util_not__["a" /* not */])(predicate, thisArg))(source)
        ];
    };
}
//# sourceMappingURL=partition.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/pluck.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export pluck */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__map__ = __webpack_require__("../../../../rxjs/_esm5/operators/map.js");
/** PURE_IMPORTS_START ._map PURE_IMPORTS_END */

/**
 * Maps each source value (an object) to its specified nested property.
 *
 * <span class="informal">Like {@link map}, but meant only for picking one of
 * the nested properties of every emitted object.</span>
 *
 * <img src="./img/pluck.png" width="100%">
 *
 * Given a list of strings describing a path to an object property, retrieves
 * the value of a specified nested property from all values in the source
 * Observable. If a property can't be resolved, it will return `undefined` for
 * that value.
 *
 * @example <caption>Map every click to the tagName of the clicked target element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var tagNames = clicks.pluck('target', 'tagName');
 * tagNames.subscribe(x => console.log(x));
 *
 * @see {@link map}
 *
 * @param {...string} properties The nested properties to pluck from each source
 * value (an object).
 * @return {Observable} A new Observable of property values from the source values.
 * @method pluck
 * @owner Observable
 */
function pluck() {
    var properties = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        properties[_i - 0] = arguments[_i];
    }
    var length = properties.length;
    if (length === 0) {
        throw new Error('list of properties cannot be empty.');
    }
    return function (source) { return Object(__WEBPACK_IMPORTED_MODULE_0__map__["a" /* map */])(plucker(properties, length))(source); };
}
function plucker(props, length) {
    var mapper = function (x) {
        var currentProp = x;
        for (var i = 0; i < length; i++) {
            var p = currentProp[props[i]];
            if (typeof p !== 'undefined') {
                currentProp = p;
            }
            else {
                return undefined;
            }
        }
        return currentProp;
    };
    return mapper;
}
//# sourceMappingURL=pluck.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/publish.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export publish */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__multicast__ = __webpack_require__("../../../../rxjs/_esm5/operators/multicast.js");
/** PURE_IMPORTS_START .._Subject,._multicast PURE_IMPORTS_END */


/* tslint:enable:max-line-length */
/**
 * Returns a ConnectableObservable, which is a variety of Observable that waits until its connect method is called
 * before it begins emitting items to those Observers that have subscribed to it.
 *
 * <img src="./img/publish.png" width="100%">
 *
 * @param {Function} [selector] - Optional selector function which can use the multicasted source sequence as many times
 * as needed, without causing multiple subscriptions to the source sequence.
 * Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
 * @return A ConnectableObservable that upon connection causes the source Observable to emit items to its Observers.
 * @method publish
 * @owner Observable
 */
function publish(selector) {
    return selector ?
        Object(__WEBPACK_IMPORTED_MODULE_1__multicast__["a" /* multicast */])(function () { return new __WEBPACK_IMPORTED_MODULE_0__Subject__["Subject"](); }, selector) :
        Object(__WEBPACK_IMPORTED_MODULE_1__multicast__["a" /* multicast */])(new __WEBPACK_IMPORTED_MODULE_0__Subject__["Subject"]());
}
//# sourceMappingURL=publish.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/publishBehavior.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export publishBehavior */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm5/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__multicast__ = __webpack_require__("../../../../rxjs/_esm5/operators/multicast.js");
/** PURE_IMPORTS_START .._BehaviorSubject,._multicast PURE_IMPORTS_END */


/**
 * @param value
 * @return {ConnectableObservable<T>}
 * @method publishBehavior
 * @owner Observable
 */
function publishBehavior(value) {
    return function (source) { return Object(__WEBPACK_IMPORTED_MODULE_1__multicast__["a" /* multicast */])(new __WEBPACK_IMPORTED_MODULE_0__BehaviorSubject__["a" /* BehaviorSubject */](value))(source); };
}
//# sourceMappingURL=publishBehavior.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/publishLast.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export publishLast */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AsyncSubject__ = __webpack_require__("../../../../rxjs/_esm5/AsyncSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__multicast__ = __webpack_require__("../../../../rxjs/_esm5/operators/multicast.js");
/** PURE_IMPORTS_START .._AsyncSubject,._multicast PURE_IMPORTS_END */


function publishLast() {
    return function (source) { return Object(__WEBPACK_IMPORTED_MODULE_1__multicast__["a" /* multicast */])(new __WEBPACK_IMPORTED_MODULE_0__AsyncSubject__["a" /* AsyncSubject */]())(source); };
}
//# sourceMappingURL=publishLast.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/publishReplay.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export publishReplay */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReplaySubject__ = __webpack_require__("../../../../rxjs/_esm5/ReplaySubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__multicast__ = __webpack_require__("../../../../rxjs/_esm5/operators/multicast.js");
/** PURE_IMPORTS_START .._ReplaySubject,._multicast PURE_IMPORTS_END */


/* tslint:enable:max-line-length */
function publishReplay(bufferSize, windowTime, selectorOrScheduler, scheduler) {
    if (selectorOrScheduler && typeof selectorOrScheduler !== 'function') {
        scheduler = selectorOrScheduler;
    }
    var selector = typeof selectorOrScheduler === 'function' ? selectorOrScheduler : undefined;
    var subject = new __WEBPACK_IMPORTED_MODULE_0__ReplaySubject__["a" /* ReplaySubject */](bufferSize, windowTime, scheduler);
    return function (source) { return Object(__WEBPACK_IMPORTED_MODULE_1__multicast__["a" /* multicast */])(function () { return subject; }, selector)(source); };
}
//# sourceMappingURL=publishReplay.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/race.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export race */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isArray__ = __webpack_require__("../../../../rxjs/_esm5/util/isArray.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_race__ = __webpack_require__("../../../../rxjs/_esm5/observable/race.js");
/** PURE_IMPORTS_START .._util_isArray,.._observable_race PURE_IMPORTS_END */


/* tslint:enable:max-line-length */
/**
 * Returns an Observable that mirrors the first source Observable to emit an item
 * from the combination of this Observable and supplied Observables.
 * @param {...Observables} ...observables Sources used to race for which Observable emits first.
 * @return {Observable} An Observable that mirrors the output of the first Observable to emit an item.
 * @method race
 * @owner Observable
 */
function race() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    return function raceOperatorFunction(source) {
        // if the only argument is an array, it was most likely called with
        // `pair([obs1, obs2, ...])`
        if (observables.length === 1 && Object(__WEBPACK_IMPORTED_MODULE_0__util_isArray__["a" /* isArray */])(observables[0])) {
            observables = observables[0];
        }
        return source.lift.call(__WEBPACK_IMPORTED_MODULE_1__observable_race__["a" /* race */].apply(void 0, [source].concat(observables)));
    };
}
//# sourceMappingURL=race.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/repeat.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export repeat */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_EmptyObservable__ = __webpack_require__("../../../../rxjs/_esm5/observable/EmptyObservable.js");
/** PURE_IMPORTS_START .._Subscriber,.._observable_EmptyObservable PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * Returns an Observable that repeats the stream of items emitted by the source Observable at most count times.
 *
 * <img src="./img/repeat.png" width="100%">
 *
 * @param {number} [count] The number of times the source Observable items are repeated, a count of 0 will yield
 * an empty Observable.
 * @return {Observable} An Observable that repeats the stream of items emitted by the source Observable at most
 * count times.
 * @method repeat
 * @owner Observable
 */
function repeat(count) {
    if (count === void 0) {
        count = -1;
    }
    return function (source) {
        if (count === 0) {
            return new __WEBPACK_IMPORTED_MODULE_1__observable_EmptyObservable__["a" /* EmptyObservable */]();
        }
        else if (count < 0) {
            return source.lift(new RepeatOperator(-1, source));
        }
        else {
            return source.lift(new RepeatOperator(count - 1, source));
        }
    };
}
var RepeatOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function RepeatOperator(count, source) {
        this.count = count;
        this.source = source;
    }
    RepeatOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
    };
    return RepeatOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RepeatSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(RepeatSubscriber, _super);
    function RepeatSubscriber(destination, count, source) {
        _super.call(this, destination);
        this.count = count;
        this.source = source;
    }
    RepeatSubscriber.prototype.complete = function () {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.complete.call(this);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    };
    return RepeatSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=repeat.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/repeatWhen.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export repeatWhen */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__("../../../../rxjs/_esm5/util/tryCatch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__("../../../../rxjs/_esm5/util/errorObject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._Subject,.._util_tryCatch,.._util_errorObject,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





/**
 * Returns an Observable that mirrors the source Observable with the exception of a `complete`. If the source
 * Observable calls `complete`, this method will emit to the Observable returned from `notifier`. If that Observable
 * calls `complete` or `error`, then this method will call `complete` or `error` on the child subscription. Otherwise
 * this method will resubscribe to the source Observable.
 *
 * <img src="./img/repeatWhen.png" width="100%">
 *
 * @param {function(notifications: Observable): Observable} notifier - Receives an Observable of notifications with
 * which a user can `complete` or `error`, aborting the repetition.
 * @return {Observable} The source Observable modified with repeat logic.
 * @method repeatWhen
 * @owner Observable
 */
function repeatWhen(notifier) {
    return function (source) { return source.lift(new RepeatWhenOperator(notifier)); };
}
var RepeatWhenOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function RepeatWhenOperator(notifier) {
        this.notifier = notifier;
    }
    RepeatWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, source));
    };
    return RepeatWhenOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RepeatWhenSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(RepeatWhenSubscriber, _super);
    function RepeatWhenSubscriber(destination, notifier, source) {
        _super.call(this, destination);
        this.notifier = notifier;
        this.source = source;
        this.sourceIsBeingSubscribedTo = true;
    }
    RepeatWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.sourceIsBeingSubscribedTo = true;
        this.source.subscribe(this);
    };
    RepeatWhenSubscriber.prototype.notifyComplete = function (innerSub) {
        if (this.sourceIsBeingSubscribedTo === false) {
            return _super.prototype.complete.call(this);
        }
    };
    RepeatWhenSubscriber.prototype.complete = function () {
        this.sourceIsBeingSubscribedTo = false;
        if (!this.isStopped) {
            if (!this.retries) {
                this.subscribeToRetries();
            }
            if (!this.retriesSubscription || this.retriesSubscription.closed) {
                return _super.prototype.complete.call(this);
            }
            this._unsubscribeAndRecycle();
            this.notifications.next();
        }
    };
    /** @deprecated internal use only */ RepeatWhenSubscriber.prototype._unsubscribe = function () {
        var _a = this, notifications = _a.notifications, retriesSubscription = _a.retriesSubscription;
        if (notifications) {
            notifications.unsubscribe();
            this.notifications = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    };
    /** @deprecated internal use only */ RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, notifications = _a.notifications, retries = _a.retries, retriesSubscription = _a.retriesSubscription;
        this.notifications = null;
        this.retries = null;
        this.retriesSubscription = null;
        _super.prototype._unsubscribeAndRecycle.call(this);
        this.notifications = notifications;
        this.retries = retries;
        this.retriesSubscription = retriesSubscription;
        return this;
    };
    RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
        this.notifications = new __WEBPACK_IMPORTED_MODULE_0__Subject__["Subject"]();
        var retries = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(this.notifier)(this.notifications);
        if (retries === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
            return _super.prototype.complete.call(this);
        }
        this.retries = retries;
        this.retriesSubscription = Object(__WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__["a" /* subscribeToResult */])(this, retries);
    };
    return RepeatWhenSubscriber;
}(__WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=repeatWhen.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/retry.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export retry */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Returns an Observable that mirrors the source Observable with the exception of an `error`. If the source Observable
 * calls `error`, this method will resubscribe to the source Observable for a maximum of `count` resubscriptions (given
 * as a number parameter) rather than propagating the `error` call.
 *
 * <img src="./img/retry.png" width="100%">
 *
 * Any and all items emitted by the source Observable will be emitted by the resulting Observable, even those emitted
 * during failed subscriptions. For example, if an Observable fails at first but emits [1, 2] then succeeds the second
 * time and emits: [1, 2, 3, 4, 5] then the complete stream of emissions and notifications
 * would be: [1, 2, 1, 2, 3, 4, 5, `complete`].
 * @param {number} count - Number of retry attempts before failing.
 * @return {Observable} The source Observable modified with the retry logic.
 * @method retry
 * @owner Observable
 */
function retry(count) {
    if (count === void 0) {
        count = -1;
    }
    return function (source) { return source.lift(new RetryOperator(count, source)); };
}
var RetryOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function RetryOperator(count, source) {
        this.count = count;
        this.source = source;
    }
    RetryOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RetrySubscriber(subscriber, this.count, this.source));
    };
    return RetryOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RetrySubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(RetrySubscriber, _super);
    function RetrySubscriber(destination, count, source) {
        _super.call(this, destination);
        this.count = count;
        this.source = source;
    }
    RetrySubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.error.call(this, err);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    };
    return RetrySubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=retry.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/retryWhen.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export retryWhen */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__("../../../../rxjs/_esm5/util/tryCatch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__("../../../../rxjs/_esm5/util/errorObject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._Subject,.._util_tryCatch,.._util_errorObject,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





/**
 * Returns an Observable that mirrors the source Observable with the exception of an `error`. If the source Observable
 * calls `error`, this method will emit the Throwable that caused the error to the Observable returned from `notifier`.
 * If that Observable calls `complete` or `error` then this method will call `complete` or `error` on the child
 * subscription. Otherwise this method will resubscribe to the source Observable.
 *
 * <img src="./img/retryWhen.png" width="100%">
 *
 * @param {function(errors: Observable): Observable} notifier - Receives an Observable of notifications with which a
 * user can `complete` or `error`, aborting the retry.
 * @return {Observable} The source Observable modified with retry logic.
 * @method retryWhen
 * @owner Observable
 */
function retryWhen(notifier) {
    return function (source) { return source.lift(new RetryWhenOperator(notifier, source)); };
}
var RetryWhenOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function RetryWhenOperator(notifier, source) {
        this.notifier = notifier;
        this.source = source;
    }
    RetryWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
    };
    return RetryWhenOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RetryWhenSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(RetryWhenSubscriber, _super);
    function RetryWhenSubscriber(destination, notifier, source) {
        _super.call(this, destination);
        this.notifier = notifier;
        this.source = source;
    }
    RetryWhenSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var errors = this.errors;
            var retries = this.retries;
            var retriesSubscription = this.retriesSubscription;
            if (!retries) {
                errors = new __WEBPACK_IMPORTED_MODULE_0__Subject__["Subject"]();
                retries = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(this.notifier)(errors);
                if (retries === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                    return _super.prototype.error.call(this, __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
                }
                retriesSubscription = Object(__WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__["a" /* subscribeToResult */])(this, retries);
            }
            else {
                this.errors = null;
                this.retriesSubscription = null;
            }
            this._unsubscribeAndRecycle();
            this.errors = errors;
            this.retries = retries;
            this.retriesSubscription = retriesSubscription;
            errors.next(err);
        }
    };
    /** @deprecated internal use only */ RetryWhenSubscriber.prototype._unsubscribe = function () {
        var _a = this, errors = _a.errors, retriesSubscription = _a.retriesSubscription;
        if (errors) {
            errors.unsubscribe();
            this.errors = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    };
    RetryWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var _a = this, errors = _a.errors, retries = _a.retries, retriesSubscription = _a.retriesSubscription;
        this.errors = null;
        this.retries = null;
        this.retriesSubscription = null;
        this._unsubscribeAndRecycle();
        this.errors = errors;
        this.retries = retries;
        this.retriesSubscription = retriesSubscription;
        this.source.subscribe(this);
    };
    return RetryWhenSubscriber;
}(__WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=retryWhen.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/sample.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export sample */
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


/**
 * Emits the most recently emitted value from the source Observable whenever
 * another Observable, the `notifier`, emits.
 *
 * <span class="informal">It's like {@link sampleTime}, but samples whenever
 * the `notifier` Observable emits something.</span>
 *
 * <img src="./img/sample.png" width="100%">
 *
 * Whenever the `notifier` Observable emits a value or completes, `sample`
 * looks at the source Observable and emits whichever value it has most recently
 * emitted since the previous sampling, unless the source has not emitted
 * anything since the previous sampling. The `notifier` is subscribed to as soon
 * as the output Observable is subscribed.
 *
 * @example <caption>On every click, sample the most recent "seconds" timer</caption>
 * var seconds = Rx.Observable.interval(1000);
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = seconds.sample(clicks);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link sampleTime}
 * @see {@link throttle}
 *
 * @param {Observable<any>} notifier The Observable to use for sampling the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the results of sampling the
 * values emitted by the source Observable whenever the notifier Observable
 * emits value or completes.
 * @method sample
 * @owner Observable
 */
function sample(notifier) {
    return function (source) { return source.lift(new SampleOperator(notifier)); };
}
var SampleOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SampleOperator(notifier) {
        this.notifier = notifier;
    }
    SampleOperator.prototype.call = function (subscriber, source) {
        var sampleSubscriber = new SampleSubscriber(subscriber);
        var subscription = source.subscribe(sampleSubscriber);
        subscription.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(sampleSubscriber, this.notifier));
        return subscription;
    };
    return SampleOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SampleSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SampleSubscriber, _super);
    function SampleSubscriber() {
        _super.apply(this, arguments);
        this.hasValue = false;
    }
    SampleSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
    };
    SampleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    };
    SampleSubscriber.prototype.notifyComplete = function () {
        this.emitValue();
    };
    SampleSubscriber.prototype.emitValue = function () {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.value);
        }
    };
    return SampleSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=sample.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/sampleTime.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export sampleTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_async__ = __webpack_require__("../../../../rxjs/_esm5/scheduler/async.js");
/** PURE_IMPORTS_START .._Subscriber,.._scheduler_async PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * Emits the most recently emitted value from the source Observable within
 * periodic time intervals.
 *
 * <span class="informal">Samples the source Observable at periodic time
 * intervals, emitting what it samples.</span>
 *
 * <img src="./img/sampleTime.png" width="100%">
 *
 * `sampleTime` periodically looks at the source Observable and emits whichever
 * value it has most recently emitted since the previous sampling, unless the
 * source has not emitted anything since the previous sampling. The sampling
 * happens periodically in time every `period` milliseconds (or the time unit
 * defined by the optional `scheduler` argument). The sampling starts as soon as
 * the output Observable is subscribed.
 *
 * @example <caption>Every second, emit the most recent click at most once</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.sampleTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sample}
 * @see {@link throttleTime}
 *
 * @param {number} period The sampling period expressed in milliseconds or the
 * time unit determined internally by the optional `scheduler`.
 * @param {Scheduler} [scheduler=async] The {@link IScheduler} to use for
 * managing the timers that handle the sampling.
 * @return {Observable<T>} An Observable that emits the results of sampling the
 * values emitted by the source Observable at the specified time interval.
 * @method sampleTime
 * @owner Observable
 */
function sampleTime(period, scheduler) {
    if (scheduler === void 0) {
        scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_async__["a" /* async */];
    }
    return function (source) { return source.lift(new SampleTimeOperator(period, scheduler)); };
}
var SampleTimeOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SampleTimeOperator(period, scheduler) {
        this.period = period;
        this.scheduler = scheduler;
    }
    SampleTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
    };
    return SampleTimeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SampleTimeSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SampleTimeSubscriber, _super);
    function SampleTimeSubscriber(destination, period, scheduler) {
        _super.call(this, destination);
        this.period = period;
        this.scheduler = scheduler;
        this.hasValue = false;
        this.add(scheduler.schedule(dispatchNotification, period, { subscriber: this, period: period }));
    }
    SampleTimeSubscriber.prototype._next = function (value) {
        this.lastValue = value;
        this.hasValue = true;
    };
    SampleTimeSubscriber.prototype.notifyNext = function () {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.lastValue);
        }
    };
    return SampleTimeSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
function dispatchNotification(state) {
    var subscriber = state.subscriber, period = state.period;
    subscriber.notifyNext();
    this.schedule(state, period);
}
//# sourceMappingURL=sampleTime.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/sequenceEqual.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export sequenceEqual */
/* unused harmony export SequenceEqualOperator */
/* unused harmony export SequenceEqualSubscriber */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__("../../../../rxjs/_esm5/util/tryCatch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__("../../../../rxjs/_esm5/util/errorObject.js");
/** PURE_IMPORTS_START .._Subscriber,.._util_tryCatch,.._util_errorObject PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/**
 * Compares all values of two observables in sequence using an optional comparor function
 * and returns an observable of a single boolean value representing whether or not the two sequences
 * are equal.
 *
 * <span class="informal">Checks to see of all values emitted by both observables are equal, in order.</span>
 *
 * <img src="./img/sequenceEqual.png" width="100%">
 *
 * `sequenceEqual` subscribes to two observables and buffers incoming values from each observable. Whenever either
 * observable emits a value, the value is buffered and the buffers are shifted and compared from the bottom
 * up; If any value pair doesn't match, the returned observable will emit `false` and complete. If one of the
 * observables completes, the operator will wait for the other observable to complete; If the other
 * observable emits before completing, the returned observable will emit `false` and complete. If one observable never
 * completes or emits after the other complets, the returned observable will never complete.
 *
 * @example <caption>figure out if the Konami code matches</caption>
 * var code = Rx.Observable.from([
 *  "ArrowUp",
 *  "ArrowUp",
 *  "ArrowDown",
 *  "ArrowDown",
 *  "ArrowLeft",
 *  "ArrowRight",
 *  "ArrowLeft",
 *  "ArrowRight",
 *  "KeyB",
 *  "KeyA",
 *  "Enter" // no start key, clearly.
 * ]);
 *
 * var keys = Rx.Observable.fromEvent(document, 'keyup')
 *  .map(e => e.code);
 * var matches = keys.bufferCount(11, 1)
 *  .mergeMap(
 *    last11 =>
 *      Rx.Observable.from(last11)
 *        .sequenceEqual(code)
 *   );
 * matches.subscribe(matched => console.log('Successful cheat at Contra? ', matched));
 *
 * @see {@link combineLatest}
 * @see {@link zip}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} compareTo The observable sequence to compare the source sequence to.
 * @param {function} [comparor] An optional function to compare each value pair
 * @return {Observable} An Observable of a single boolean value representing whether or not
 * the values emitted by both observables were equal in sequence.
 * @method sequenceEqual
 * @owner Observable
 */
function sequenceEqual(compareTo, comparor) {
    return function (source) { return source.lift(new SequenceEqualOperator(compareTo, comparor)); };
}
var SequenceEqualOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SequenceEqualOperator(compareTo, comparor) {
        this.compareTo = compareTo;
        this.comparor = comparor;
    }
    SequenceEqualOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparor));
    };
    return SequenceEqualOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SequenceEqualSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SequenceEqualSubscriber, _super);
    function SequenceEqualSubscriber(destination, compareTo, comparor) {
        _super.call(this, destination);
        this.compareTo = compareTo;
        this.comparor = comparor;
        this._a = [];
        this._b = [];
        this._oneComplete = false;
        this.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, this)));
    }
    SequenceEqualSubscriber.prototype._next = function (value) {
        if (this._oneComplete && this._b.length === 0) {
            this.emit(false);
        }
        else {
            this._a.push(value);
            this.checkValues();
        }
    };
    SequenceEqualSubscriber.prototype._complete = function () {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
    };
    SequenceEqualSubscriber.prototype.checkValues = function () {
        var _c = this, _a = _c._a, _b = _c._b, comparor = _c.comparor;
        while (_a.length > 0 && _b.length > 0) {
            var a = _a.shift();
            var b = _b.shift();
            var areEqual = false;
            if (comparor) {
                areEqual = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(comparor)(a, b);
                if (areEqual === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                    this.destination.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
                }
            }
            else {
                areEqual = a === b;
            }
            if (!areEqual) {
                this.emit(false);
            }
        }
    };
    SequenceEqualSubscriber.prototype.emit = function (value) {
        var destination = this.destination;
        destination.next(value);
        destination.complete();
    };
    SequenceEqualSubscriber.prototype.nextB = function (value) {
        if (this._oneComplete && this._a.length === 0) {
            this.emit(false);
        }
        else {
            this._b.push(value);
            this.checkValues();
        }
    };
    return SequenceEqualSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
var SequenceEqualCompareToSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SequenceEqualCompareToSubscriber, _super);
    function SequenceEqualCompareToSubscriber(destination, parent) {
        _super.call(this, destination);
        this.parent = parent;
    }
    SequenceEqualCompareToSubscriber.prototype._next = function (value) {
        this.parent.nextB(value);
    };
    SequenceEqualCompareToSubscriber.prototype._error = function (err) {
        this.parent.error(err);
    };
    SequenceEqualCompareToSubscriber.prototype._complete = function () {
        this.parent._complete();
    };
    return SequenceEqualCompareToSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=sequenceEqual.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/shareReplay.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export shareReplay */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReplaySubject__ = __webpack_require__("../../../../rxjs/_esm5/ReplaySubject.js");
/** PURE_IMPORTS_START .._ReplaySubject PURE_IMPORTS_END */

/**
 * @method shareReplay
 * @owner Observable
 */
function shareReplay(bufferSize, windowTime, scheduler) {
    return function (source) { return source.lift(shareReplayOperator(bufferSize, windowTime, scheduler)); };
}
function shareReplayOperator(bufferSize, windowTime, scheduler) {
    var subject;
    var refCount = 0;
    var subscription;
    var hasError = false;
    var isComplete = false;
    return function shareReplayOperation(source) {
        refCount++;
        if (!subject || hasError) {
            hasError = false;
            subject = new __WEBPACK_IMPORTED_MODULE_0__ReplaySubject__["a" /* ReplaySubject */](bufferSize, windowTime, scheduler);
            subscription = source.subscribe({
                next: function (value) { subject.next(value); },
                error: function (err) {
                    hasError = true;
                    subject.error(err);
                },
                complete: function () {
                    isComplete = true;
                    subject.complete();
                },
            });
        }
        var innerSub = subject.subscribe(this);
        return function () {
            refCount--;
            innerSub.unsubscribe();
            if (subscription && refCount === 0 && isComplete) {
                subscription.unsubscribe();
            }
        };
    };
}
;
//# sourceMappingURL=shareReplay.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/single.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export single */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_EmptyError__ = __webpack_require__("../../../../rxjs/_esm5/util/EmptyError.js");
/** PURE_IMPORTS_START .._Subscriber,.._util_EmptyError PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * Returns an Observable that emits the single item emitted by the source Observable that matches a specified
 * predicate, if that Observable emits one such item. If the source Observable emits more than one such item or no
 * such items, notify of an IllegalArgumentException or NoSuchElementException respectively.
 *
 * <img src="./img/single.png" width="100%">
 *
 * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 * @param {Function} predicate - A predicate function to evaluate items emitted by the source Observable.
 * @return {Observable<T>} An Observable that emits the single item emitted by the source Observable that matches
 * the predicate.
 .
 * @method single
 * @owner Observable
 */
function single(predicate) {
    return function (source) { return source.lift(new SingleOperator(predicate, source)); };
}
var SingleOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SingleOperator(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    SingleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
    };
    return SingleOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SingleSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SingleSubscriber, _super);
    function SingleSubscriber(destination, predicate, source) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.source = source;
        this.seenValue = false;
        this.index = 0;
    }
    SingleSubscriber.prototype.applySingleValue = function (value) {
        if (this.seenValue) {
            this.destination.error('Sequence contains more than one element');
        }
        else {
            this.seenValue = true;
            this.singleValue = value;
        }
    };
    SingleSubscriber.prototype._next = function (value) {
        var index = this.index++;
        if (this.predicate) {
            this.tryNext(value, index);
        }
        else {
            this.applySingleValue(value);
        }
    };
    SingleSubscriber.prototype.tryNext = function (value, index) {
        try {
            if (this.predicate(value, index, this.source)) {
                this.applySingleValue(value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    SingleSubscriber.prototype._complete = function () {
        var destination = this.destination;
        if (this.index > 0) {
            destination.next(this.seenValue ? this.singleValue : undefined);
            destination.complete();
        }
        else {
            destination.error(new __WEBPACK_IMPORTED_MODULE_1__util_EmptyError__["a" /* EmptyError */]);
        }
    };
    return SingleSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=single.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/skip.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export skip */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Returns an Observable that skips the first `count` items emitted by the source Observable.
 *
 * <img src="./img/skip.png" width="100%">
 *
 * @param {Number} count - The number of times, items emitted by source Observable should be skipped.
 * @return {Observable} An Observable that skips values emitted by the source Observable.
 *
 * @method skip
 * @owner Observable
 */
function skip(count) {
    return function (source) { return source.lift(new SkipOperator(count)); };
}
var SkipOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SkipOperator(total) {
        this.total = total;
    }
    SkipOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SkipSubscriber(subscriber, this.total));
    };
    return SkipOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SkipSubscriber, _super);
    function SkipSubscriber(destination, total) {
        _super.call(this, destination);
        this.total = total;
        this.count = 0;
    }
    SkipSubscriber.prototype._next = function (x) {
        if (++this.count > this.total) {
            this.destination.next(x);
        }
    };
    return SkipSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=skip.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/skipLast.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export skipLast */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__ = __webpack_require__("../../../../rxjs/_esm5/util/ArgumentOutOfRangeError.js");
/** PURE_IMPORTS_START .._Subscriber,.._util_ArgumentOutOfRangeError PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * Skip the last `count` values emitted by the source Observable.
 *
 * <img src="./img/skipLast.png" width="100%">
 *
 * `skipLast` returns an Observable that accumulates a queue with a length
 * enough to store the first `count` values. As more values are received,
 * values are taken from the front of the queue and produced on the result
 * sequence. This causes values to be delayed.
 *
 * @example <caption>Skip the last 2 values of an Observable with many values</caption>
 * var many = Rx.Observable.range(1, 5);
 * var skipLastTwo = many.skipLast(2);
 * skipLastTwo.subscribe(x => console.log(x));
 *
 * // Results in:
 * // 1 2 3
 *
 * @see {@link skip}
 * @see {@link skipUntil}
 * @see {@link skipWhile}
 * @see {@link take}
 *
 * @throws {ArgumentOutOfRangeError} When using `skipLast(i)`, it throws
 * ArgumentOutOrRangeError if `i < 0`.
 *
 * @param {number} count Number of elements to skip from the end of the source Observable.
 * @returns {Observable<T>} An Observable that skips the last count values
 * emitted by the source Observable.
 * @method skipLast
 * @owner Observable
 */
function skipLast(count) {
    return function (source) { return source.lift(new SkipLastOperator(count)); };
}
var SkipLastOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SkipLastOperator(_skipCount) {
        this._skipCount = _skipCount;
        if (this._skipCount < 0) {
            throw new __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__["a" /* ArgumentOutOfRangeError */];
        }
    }
    SkipLastOperator.prototype.call = function (subscriber, source) {
        if (this._skipCount === 0) {
            // If we don't want to skip any values then just subscribe
            // to Subscriber without any further logic.
            return source.subscribe(new __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */](subscriber));
        }
        else {
            return source.subscribe(new SkipLastSubscriber(subscriber, this._skipCount));
        }
    };
    return SkipLastOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipLastSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SkipLastSubscriber, _super);
    function SkipLastSubscriber(destination, _skipCount) {
        _super.call(this, destination);
        this._skipCount = _skipCount;
        this._count = 0;
        this._ring = new Array(_skipCount);
    }
    SkipLastSubscriber.prototype._next = function (value) {
        var skipCount = this._skipCount;
        var count = this._count++;
        if (count < skipCount) {
            this._ring[count] = value;
        }
        else {
            var currentIndex = count % skipCount;
            var ring = this._ring;
            var oldValue = ring[currentIndex];
            ring[currentIndex] = value;
            this.destination.next(oldValue);
        }
    };
    return SkipLastSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=skipLast.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/skipUntil.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export skipUntil */
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


/**
 * Returns an Observable that skips items emitted by the source Observable until a second Observable emits an item.
 *
 * <img src="./img/skipUntil.png" width="100%">
 *
 * @param {Observable} notifier - The second Observable that has to emit an item before the source Observable's elements begin to
 * be mirrored by the resulting Observable.
 * @return {Observable<T>} An Observable that skips items from the source Observable until the second Observable emits
 * an item, then emits the remaining items.
 * @method skipUntil
 * @owner Observable
 */
function skipUntil(notifier) {
    return function (source) { return source.lift(new SkipUntilOperator(notifier)); };
}
var SkipUntilOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SkipUntilOperator(notifier) {
        this.notifier = notifier;
    }
    SkipUntilOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SkipUntilSubscriber(subscriber, this.notifier));
    };
    return SkipUntilOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipUntilSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SkipUntilSubscriber, _super);
    function SkipUntilSubscriber(destination, notifier) {
        _super.call(this, destination);
        this.hasValue = false;
        this.isInnerStopped = false;
        this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, notifier));
    }
    SkipUntilSubscriber.prototype._next = function (value) {
        if (this.hasValue) {
            _super.prototype._next.call(this, value);
        }
    };
    SkipUntilSubscriber.prototype._complete = function () {
        if (this.isInnerStopped) {
            _super.prototype._complete.call(this);
        }
        else {
            this.unsubscribe();
        }
    };
    SkipUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.hasValue = true;
    };
    SkipUntilSubscriber.prototype.notifyComplete = function () {
        this.isInnerStopped = true;
        if (this.isStopped) {
            _super.prototype._complete.call(this);
        }
    };
    return SkipUntilSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=skipUntil.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/skipWhile.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export skipWhile */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Returns an Observable that skips all items emitted by the source Observable as long as a specified condition holds
 * true, but emits all further source items as soon as the condition becomes false.
 *
 * <img src="./img/skipWhile.png" width="100%">
 *
 * @param {Function} predicate - A function to test each item emitted from the source Observable.
 * @return {Observable<T>} An Observable that begins emitting items emitted by the source Observable when the
 * specified predicate becomes false.
 * @method skipWhile
 * @owner Observable
 */
function skipWhile(predicate) {
    return function (source) { return source.lift(new SkipWhileOperator(predicate)); };
}
var SkipWhileOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SkipWhileOperator(predicate) {
        this.predicate = predicate;
    }
    SkipWhileOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SkipWhileSubscriber(subscriber, this.predicate));
    };
    return SkipWhileOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipWhileSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SkipWhileSubscriber, _super);
    function SkipWhileSubscriber(destination, predicate) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.skipping = true;
        this.index = 0;
    }
    SkipWhileSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        if (this.skipping) {
            this.tryCallPredicate(value);
        }
        if (!this.skipping) {
            destination.next(value);
        }
    };
    SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
        try {
            var result = this.predicate(value, this.index++);
            this.skipping = Boolean(result);
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    return SkipWhileSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=skipWhile.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/startWith.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export startWith */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__ = __webpack_require__("../../../../rxjs/_esm5/observable/ArrayObservable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_ScalarObservable__ = __webpack_require__("../../../../rxjs/_esm5/observable/ScalarObservable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__observable_EmptyObservable__ = __webpack_require__("../../../../rxjs/_esm5/observable/EmptyObservable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__observable_concat__ = __webpack_require__("../../../../rxjs/_esm5/observable/concat.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_isScheduler__ = __webpack_require__("../../../../rxjs/_esm5/util/isScheduler.js");
/** PURE_IMPORTS_START .._observable_ArrayObservable,.._observable_ScalarObservable,.._observable_EmptyObservable,.._observable_concat,.._util_isScheduler PURE_IMPORTS_END */





/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits the items you specify as arguments before it begins to emit
 * items emitted by the source Observable.
 *
 * <img src="./img/startWith.png" width="100%">
 *
 * @param {...T} values - Items you want the modified Observable to emit first.
 * @param {Scheduler} [scheduler] - A {@link IScheduler} to use for scheduling
 * the emissions of the `next` notifications.
 * @return {Observable} An Observable that emits the items in the specified Iterable and then emits the items
 * emitted by the source Observable.
 * @method startWith
 * @owner Observable
 */
function startWith() {
    var array = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        array[_i - 0] = arguments[_i];
    }
    return function (source) {
        var scheduler = array[array.length - 1];
        if (Object(__WEBPACK_IMPORTED_MODULE_4__util_isScheduler__["a" /* isScheduler */])(scheduler)) {
            array.pop();
        }
        else {
            scheduler = null;
        }
        var len = array.length;
        if (len === 1) {
            return Object(__WEBPACK_IMPORTED_MODULE_3__observable_concat__["a" /* concat */])(new __WEBPACK_IMPORTED_MODULE_1__observable_ScalarObservable__["a" /* ScalarObservable */](array[0], scheduler), source);
        }
        else if (len > 1) {
            return Object(__WEBPACK_IMPORTED_MODULE_3__observable_concat__["a" /* concat */])(new __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__["a" /* ArrayObservable */](array, scheduler), source);
        }
        else {
            return Object(__WEBPACK_IMPORTED_MODULE_3__observable_concat__["a" /* concat */])(new __WEBPACK_IMPORTED_MODULE_2__observable_EmptyObservable__["a" /* EmptyObservable */](scheduler), source);
        }
    };
}
//# sourceMappingURL=startWith.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/switchAll.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export switchAll */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__switchMap__ = __webpack_require__("../../../../rxjs/_esm5/operators/switchMap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_identity__ = __webpack_require__("../../../../rxjs/_esm5/util/identity.js");
/** PURE_IMPORTS_START ._switchMap,.._util_identity PURE_IMPORTS_END */


function switchAll() {
    return Object(__WEBPACK_IMPORTED_MODULE_0__switchMap__["a" /* switchMap */])(__WEBPACK_IMPORTED_MODULE_1__util_identity__["a" /* identity */]);
}
//# sourceMappingURL=switchAll.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/switchMapTo.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export switchMapTo */
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
 * Projects each source value to the same Observable which is flattened multiple
 * times with {@link switch} in the output Observable.
 *
 * <span class="informal">It's like {@link switchMap}, but maps each value
 * always to the same inner Observable.</span>
 *
 * <img src="./img/switchMapTo.png" width="100%">
 *
 * Maps each source value to the given Observable `innerObservable` regardless
 * of the source value, and then flattens those resulting Observables into one
 * single Observable, which is the output Observable. The output Observables
 * emits values only from the most recently emitted instance of
 * `innerObservable`.
 *
 * @example <caption>Rerun an interval Observable on every click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.switchMapTo(Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMapTo}
 * @see {@link switch}
 * @see {@link switchMap}
 * @see {@link mergeMapTo}
 *
 * @param {ObservableInput} innerObservable An Observable to replace each value from
 * the source Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An Observable that emits items from the given
 * `innerObservable` (and optionally transformed through `resultSelector`) every
 * time a value is emitted on the source Observable, and taking only the values
 * from the most recently projected inner Observable.
 * @method switchMapTo
 * @owner Observable
 */
function switchMapTo(innerObservable, resultSelector) {
    return function (source) { return source.lift(new SwitchMapToOperator(innerObservable, resultSelector)); };
}
var SwitchMapToOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function SwitchMapToOperator(observable, resultSelector) {
        this.observable = observable;
        this.resultSelector = resultSelector;
    }
    SwitchMapToOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SwitchMapToSubscriber(subscriber, this.observable, this.resultSelector));
    };
    return SwitchMapToOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchMapToSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(SwitchMapToSubscriber, _super);
    function SwitchMapToSubscriber(destination, inner, resultSelector) {
        _super.call(this, destination);
        this.inner = inner;
        this.resultSelector = resultSelector;
        this.index = 0;
    }
    SwitchMapToSubscriber.prototype._next = function (value) {
        var innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        this.add(this.innerSubscription = Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, this.inner, value, this.index++));
    };
    SwitchMapToSubscriber.prototype._complete = function () {
        var innerSubscription = this.innerSubscription;
        if (!innerSubscription || innerSubscription.closed) {
            _super.prototype._complete.call(this);
        }
    };
    /** @deprecated internal use only */ SwitchMapToSubscriber.prototype._unsubscribe = function () {
        this.innerSubscription = null;
    };
    SwitchMapToSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapToSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var _a = this, resultSelector = _a.resultSelector, destination = _a.destination;
        if (resultSelector) {
            this.tryResultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            destination.next(innerValue);
        }
    };
    SwitchMapToSubscriber.prototype.tryResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
        var _a = this, resultSelector = _a.resultSelector, destination = _a.destination;
        var result;
        try {
            result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        destination.next(result);
    };
    return SwitchMapToSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=switchMapTo.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/take.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = take;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__ = __webpack_require__("../../../../rxjs/_esm5/util/ArgumentOutOfRangeError.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__observable_EmptyObservable__ = __webpack_require__("../../../../rxjs/_esm5/observable/EmptyObservable.js");
/** PURE_IMPORTS_START .._Subscriber,.._util_ArgumentOutOfRangeError,.._observable_EmptyObservable PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/**
 * Emits only the first `count` values emitted by the source Observable.
 *
 * <span class="informal">Takes the first `count` values from the source, then
 * completes.</span>
 *
 * <img src="./img/take.png" width="100%">
 *
 * `take` returns an Observable that emits only the first `count` values emitted
 * by the source Observable. If the source emits fewer than `count` values then
 * all of its values are emitted. After that, it completes, regardless if the
 * source completes.
 *
 * @example <caption>Take the first 5 seconds of an infinite 1-second interval Observable</caption>
 * var interval = Rx.Observable.interval(1000);
 * var five = interval.take(5);
 * five.subscribe(x => console.log(x));
 *
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @throws {ArgumentOutOfRangeError} When using `take(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
 *
 * @param {number} count The maximum number of `next` values to emit.
 * @return {Observable<T>} An Observable that emits only the first `count`
 * values emitted by the source Observable, or all of the values from the source
 * if the source emits fewer than `count` values.
 * @method take
 * @owner Observable
 */
function take(count) {
    return function (source) {
        if (count === 0) {
            return new __WEBPACK_IMPORTED_MODULE_2__observable_EmptyObservable__["a" /* EmptyObservable */]();
        }
        else {
            return source.lift(new TakeOperator(count));
        }
    };
}
var TakeOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function TakeOperator(total) {
        this.total = total;
        if (this.total < 0) {
            throw new __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__["a" /* ArgumentOutOfRangeError */];
        }
    }
    TakeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeSubscriber(subscriber, this.total));
    };
    return TakeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(TakeSubscriber, _super);
    function TakeSubscriber(destination, total) {
        _super.call(this, destination);
        this.total = total;
        this.count = 0;
    }
    TakeSubscriber.prototype._next = function (value) {
        var total = this.total;
        var count = ++this.count;
        if (count <= total) {
            this.destination.next(value);
            if (count === total) {
                this.destination.complete();
                this.unsubscribe();
            }
        }
    };
    return TakeSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=take.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/takeUntil.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export takeUntil */
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


/**
 * Emits the values emitted by the source Observable until a `notifier`
 * Observable emits a value.
 *
 * <span class="informal">Lets values pass until a second Observable,
 * `notifier`, emits something. Then, it completes.</span>
 *
 * <img src="./img/takeUntil.png" width="100%">
 *
 * `takeUntil` subscribes and begins mirroring the source Observable. It also
 * monitors a second Observable, `notifier` that you provide. If the `notifier`
 * emits a value or a complete notification, the output Observable stops
 * mirroring the source Observable and completes.
 *
 * @example <caption>Tick every second until the first click happens</caption>
 * var interval = Rx.Observable.interval(1000);
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = interval.takeUntil(clicks);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @param {Observable} notifier The Observable whose first emitted value will
 * cause the output Observable of `takeUntil` to stop emitting values from the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable until such time as `notifier` emits its first value.
 * @method takeUntil
 * @owner Observable
 */
function takeUntil(notifier) {
    return function (source) { return source.lift(new TakeUntilOperator(notifier)); };
}
var TakeUntilOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function TakeUntilOperator(notifier) {
        this.notifier = notifier;
    }
    TakeUntilOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeUntilSubscriber(subscriber, this.notifier));
    };
    return TakeUntilOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeUntilSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(TakeUntilSubscriber, _super);
    function TakeUntilSubscriber(destination, notifier) {
        _super.call(this, destination);
        this.notifier = notifier;
        this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, notifier));
    }
    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.complete();
    };
    TakeUntilSubscriber.prototype.notifyComplete = function () {
        // noop
    };
    return TakeUntilSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=takeUntil.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/takeWhile.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export takeWhile */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/** PURE_IMPORTS_START .._Subscriber PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Emits values emitted by the source Observable so long as each value satisfies
 * the given `predicate`, and then completes as soon as this `predicate` is not
 * satisfied.
 *
 * <span class="informal">Takes values from the source only while they pass the
 * condition given. When the first value does not satisfy, it completes.</span>
 *
 * <img src="./img/takeWhile.png" width="100%">
 *
 * `takeWhile` subscribes and begins mirroring the source Observable. Each value
 * emitted on the source is given to the `predicate` function which returns a
 * boolean, representing a condition to be satisfied by the source values. The
 * output Observable emits the source values until such time as the `predicate`
 * returns false, at which point `takeWhile` stops mirroring the source
 * Observable and completes the output Observable.
 *
 * @example <caption>Emit click events only while the clientX property is greater than 200</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.takeWhile(ev => ev.clientX > 200);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link skip}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates a value emitted by the source Observable and returns a boolean.
 * Also takes the (zero-based) index as the second argument.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable so long as each value satisfies the condition defined by the
 * `predicate`, then completes.
 * @method takeWhile
 * @owner Observable
 */
function takeWhile(predicate) {
    return function (source) { return source.lift(new TakeWhileOperator(predicate)); };
}
var TakeWhileOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function TakeWhileOperator(predicate) {
        this.predicate = predicate;
    }
    TakeWhileOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeWhileSubscriber(subscriber, this.predicate));
    };
    return TakeWhileOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeWhileSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(TakeWhileSubscriber, _super);
    function TakeWhileSubscriber(destination, predicate) {
        _super.call(this, destination);
        this.predicate = predicate;
        this.index = 0;
    }
    TakeWhileSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        var result;
        try {
            result = this.predicate(value, this.index++);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this.nextOrComplete(value, result);
    };
    TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
        var destination = this.destination;
        if (Boolean(predicateResult)) {
            destination.next(value);
        }
        else {
            destination.complete();
        }
    };
    return TakeWhileSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=takeWhile.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/throttle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return defaultThrottleConfig; });
/* unused harmony export throttle */
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


var defaultThrottleConfig = {
    leading: true,
    trailing: false
};
/**
 * Emits a value from the source Observable, then ignores subsequent source
 * values for a duration determined by another Observable, then repeats this
 * process.
 *
 * <span class="informal">It's like {@link throttleTime}, but the silencing
 * duration is determined by a second Observable.</span>
 *
 * <img src="./img/throttle.png" width="100%">
 *
 * `throttle` emits the source Observable values on the output Observable
 * when its internal timer is disabled, and ignores source values when the timer
 * is enabled. Initially, the timer is disabled. As soon as the first source
 * value arrives, it is forwarded to the output Observable, and then the timer
 * is enabled by calling the `durationSelector` function with the source value,
 * which returns the "duration" Observable. When the duration Observable emits a
 * value or completes, the timer is disabled, and this process repeats for the
 * next source value.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.throttle(ev => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link delayWhen}
 * @see {@link sample}
 * @see {@link throttleTime}
 *
 * @param {function(value: T): SubscribableOrPromise} durationSelector A function
 * that receives a value from the source Observable, for computing the silencing
 * duration for each source value, returned as an Observable or a Promise.
 * @param {Object} config a configuration object to define `leading` and `trailing` behavior. Defaults
 * to `{ leading: true, trailing: false }`.
 * @return {Observable<T>} An Observable that performs the throttle operation to
 * limit the rate of emissions from the source.
 * @method throttle
 * @owner Observable
 */
function throttle(durationSelector, config) {
    if (config === void 0) {
        config = defaultThrottleConfig;
    }
    return function (source) { return source.lift(new ThrottleOperator(durationSelector, config.leading, config.trailing)); };
}
var ThrottleOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function ThrottleOperator(durationSelector, leading, trailing) {
        this.durationSelector = durationSelector;
        this.leading = leading;
        this.trailing = trailing;
    }
    ThrottleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ThrottleSubscriber(subscriber, this.durationSelector, this.leading, this.trailing));
    };
    return ThrottleOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc
 * @ignore
 * @extends {Ignored}
 */
var ThrottleSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(ThrottleSubscriber, _super);
    function ThrottleSubscriber(destination, durationSelector, _leading, _trailing) {
        _super.call(this, destination);
        this.destination = destination;
        this.durationSelector = durationSelector;
        this._leading = _leading;
        this._trailing = _trailing;
        this._hasTrailingValue = false;
    }
    ThrottleSubscriber.prototype._next = function (value) {
        if (this.throttled) {
            if (this._trailing) {
                this._hasTrailingValue = true;
                this._trailingValue = value;
            }
        }
        else {
            var duration = this.tryDurationSelector(value);
            if (duration) {
                this.add(this.throttled = Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, duration));
            }
            if (this._leading) {
                this.destination.next(value);
                if (this._trailing) {
                    this._hasTrailingValue = true;
                    this._trailingValue = value;
                }
            }
        }
    };
    ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
        try {
            return this.durationSelector(value);
        }
        catch (err) {
            this.destination.error(err);
            return null;
        }
    };
    /** @deprecated internal use only */ ThrottleSubscriber.prototype._unsubscribe = function () {
        var _a = this, throttled = _a.throttled, _trailingValue = _a._trailingValue, _hasTrailingValue = _a._hasTrailingValue, _trailing = _a._trailing;
        this._trailingValue = null;
        this._hasTrailingValue = false;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
    };
    ThrottleSubscriber.prototype._sendTrailing = function () {
        var _a = this, destination = _a.destination, throttled = _a.throttled, _trailing = _a._trailing, _trailingValue = _a._trailingValue, _hasTrailingValue = _a._hasTrailingValue;
        if (throttled && _trailing && _hasTrailingValue) {
            destination.next(_trailingValue);
            this._trailingValue = null;
            this._hasTrailingValue = false;
        }
    };
    ThrottleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this._sendTrailing();
        this._unsubscribe();
    };
    ThrottleSubscriber.prototype.notifyComplete = function () {
        this._sendTrailing();
        this._unsubscribe();
    };
    return ThrottleSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=throttle.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/throttleTime.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export throttleTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_async__ = __webpack_require__("../../../../rxjs/_esm5/scheduler/async.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__throttle__ = __webpack_require__("../../../../rxjs/_esm5/operators/throttle.js");
/** PURE_IMPORTS_START .._Subscriber,.._scheduler_async,._throttle PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/**
 * Emits a value from the source Observable, then ignores subsequent source
 * values for `duration` milliseconds, then repeats this process.
 *
 * <span class="informal">Lets a value pass, then ignores source values for the
 * next `duration` milliseconds.</span>
 *
 * <img src="./img/throttleTime.png" width="100%">
 *
 * `throttleTime` emits the source Observable values on the output Observable
 * when its internal timer is disabled, and ignores source values when the timer
 * is enabled. Initially, the timer is disabled. As soon as the first source
 * value arrives, it is forwarded to the output Observable, and then the timer
 * is enabled. After `duration` milliseconds (or the time unit determined
 * internally by the optional `scheduler`) has passed, the timer is disabled,
 * and this process repeats for the next source value. Optionally takes a
 * {@link IScheduler} for managing timers.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.throttleTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttle}
 *
 * @param {number} duration Time to wait before emitting another value after
 * emitting the last value, measured in milliseconds or the time unit determined
 * internally by the optional `scheduler`.
 * @param {Scheduler} [scheduler=async] The {@link IScheduler} to use for
 * managing the timers that handle the throttling.
 * @return {Observable<T>} An Observable that performs the throttle operation to
 * limit the rate of emissions from the source.
 * @method throttleTime
 * @owner Observable
 */
function throttleTime(duration, scheduler, config) {
    if (scheduler === void 0) {
        scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_async__["a" /* async */];
    }
    if (config === void 0) {
        config = __WEBPACK_IMPORTED_MODULE_2__throttle__["a" /* defaultThrottleConfig */];
    }
    return function (source) { return source.lift(new ThrottleTimeOperator(duration, scheduler, config.leading, config.trailing)); };
}
var ThrottleTimeOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function ThrottleTimeOperator(duration, scheduler, leading, trailing) {
        this.duration = duration;
        this.scheduler = scheduler;
        this.leading = leading;
        this.trailing = trailing;
    }
    ThrottleTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler, this.leading, this.trailing));
    };
    return ThrottleTimeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ThrottleTimeSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(ThrottleTimeSubscriber, _super);
    function ThrottleTimeSubscriber(destination, duration, scheduler, leading, trailing) {
        _super.call(this, destination);
        this.duration = duration;
        this.scheduler = scheduler;
        this.leading = leading;
        this.trailing = trailing;
        this._hasTrailingValue = false;
        this._trailingValue = null;
    }
    ThrottleTimeSubscriber.prototype._next = function (value) {
        if (this.throttled) {
            if (this.trailing) {
                this._trailingValue = value;
                this._hasTrailingValue = true;
            }
        }
        else {
            this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, { subscriber: this }));
            if (this.leading) {
                this.destination.next(value);
            }
        }
    };
    ThrottleTimeSubscriber.prototype.clearThrottle = function () {
        var throttled = this.throttled;
        if (throttled) {
            if (this.trailing && this._hasTrailingValue) {
                this.destination.next(this._trailingValue);
                this._trailingValue = null;
                this._hasTrailingValue = false;
            }
            throttled.unsubscribe();
            this.remove(throttled);
            this.throttled = null;
        }
    };
    return ThrottleTimeSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
function dispatchNext(arg) {
    var subscriber = arg.subscriber;
    subscriber.clearThrottle();
}
//# sourceMappingURL=throttleTime.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/timeInterval.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export timeInterval */
/* unused harmony export TimeInterval */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_async__ = __webpack_require__("../../../../rxjs/_esm5/scheduler/async.js");
/** PURE_IMPORTS_START .._Subscriber,.._scheduler_async PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


function timeInterval(scheduler) {
    if (scheduler === void 0) {
        scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_async__["a" /* async */];
    }
    return function (source) { return source.lift(new TimeIntervalOperator(scheduler)); };
}
var TimeInterval = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function TimeInterval(value, interval) {
        this.value = value;
        this.interval = interval;
    }
    return TimeInterval;
}());
;
var TimeIntervalOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function TimeIntervalOperator(scheduler) {
        this.scheduler = scheduler;
    }
    TimeIntervalOperator.prototype.call = function (observer, source) {
        return source.subscribe(new TimeIntervalSubscriber(observer, this.scheduler));
    };
    return TimeIntervalOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TimeIntervalSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(TimeIntervalSubscriber, _super);
    function TimeIntervalSubscriber(destination, scheduler) {
        _super.call(this, destination);
        this.scheduler = scheduler;
        this.lastTime = 0;
        this.lastTime = scheduler.now();
    }
    TimeIntervalSubscriber.prototype._next = function (value) {
        var now = this.scheduler.now();
        var span = now - this.lastTime;
        this.lastTime = now;
        this.destination.next(new TimeInterval(value, span));
    };
    return TimeIntervalSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=timeInterval.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/timeout.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export timeout */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_async__ = __webpack_require__("../../../../rxjs/_esm5/scheduler/async.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isDate__ = __webpack_require__("../../../../rxjs/_esm5/util/isDate.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_TimeoutError__ = __webpack_require__("../../../../rxjs/_esm5/util/TimeoutError.js");
/** PURE_IMPORTS_START .._scheduler_async,.._util_isDate,.._Subscriber,.._util_TimeoutError PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/**
 *
 * Errors if Observable does not emit a value in given time span.
 *
 * <span class="informal">Timeouts on Observable that doesn't emit values fast enough.</span>
 *
 * <img src="./img/timeout.png" width="100%">
 *
 * `timeout` operator accepts as an argument either a number or a Date.
 *
 * If number was provided, it returns an Observable that behaves like a source
 * Observable, unless there is a period of time where there is no value emitted.
 * So if you provide `100` as argument and first value comes after 50ms from
 * the moment of subscription, this value will be simply re-emitted by the resulting
 * Observable. If however after that 100ms passes without a second value being emitted,
 * stream will end with an error and source Observable will be unsubscribed.
 * These checks are performed throughout whole lifecycle of Observable - from the moment
 * it was subscribed to, until it completes or errors itself. Thus every value must be
 * emitted within specified period since previous value.
 *
 * If provided argument was Date, returned Observable behaves differently. It throws
 * if Observable did not complete before provided Date. This means that periods between
 * emission of particular values do not matter in this case. If Observable did not complete
 * before provided Date, source Observable will be unsubscribed. Other than that, resulting
 * stream behaves just as source Observable.
 *
 * `timeout` accepts also a Scheduler as a second parameter. It is used to schedule moment (or moments)
 * when returned Observable will check if source stream emitted value or completed.
 *
 * @example <caption>Check if ticks are emitted within certain timespan</caption>
 * const seconds = Rx.Observable.interval(1000);
 *
 * seconds.timeout(1100) // Let's use bigger timespan to be safe,
 *                       // since `interval` might fire a bit later then scheduled.
 * .subscribe(
 *     value => console.log(value), // Will emit numbers just as regular `interval` would.
 *     err => console.log(err) // Will never be called.
 * );
 *
 * seconds.timeout(900).subscribe(
 *     value => console.log(value), // Will never be called.
 *     err => console.log(err) // Will emit error before even first value is emitted,
 *                             // since it did not arrive within 900ms period.
 * );
 *
 * @example <caption>Use Date to check if Observable completed</caption>
 * const seconds = Rx.Observable.interval(1000);
 *
 * seconds.timeout(new Date("December 17, 2020 03:24:00"))
 * .subscribe(
 *     value => console.log(value), // Will emit values as regular `interval` would
 *                                  // until December 17, 2020 at 03:24:00.
 *     err => console.log(err) // On December 17, 2020 at 03:24:00 it will emit an error,
 *                             // since Observable did not complete by then.
 * );
 *
 * @see {@link timeoutWith}
 *
 * @param {number|Date} due Number specifying period within which Observable must emit values
 *                          or Date specifying before when Observable should complete
 * @param {Scheduler} [scheduler] Scheduler controlling when timeout checks occur.
 * @return {Observable<T>} Observable that mirrors behaviour of source, unless timeout checks fail.
 * @method timeout
 * @owner Observable
 */
function timeout(due, scheduler) {
    if (scheduler === void 0) {
        scheduler = __WEBPACK_IMPORTED_MODULE_0__scheduler_async__["a" /* async */];
    }
    var absoluteTimeout = Object(__WEBPACK_IMPORTED_MODULE_1__util_isDate__["a" /* isDate */])(due);
    var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
    return function (source) { return source.lift(new TimeoutOperator(waitFor, absoluteTimeout, scheduler, new __WEBPACK_IMPORTED_MODULE_3__util_TimeoutError__["a" /* TimeoutError */]())); };
}
var TimeoutOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function TimeoutOperator(waitFor, absoluteTimeout, scheduler, errorInstance) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.scheduler = scheduler;
        this.errorInstance = errorInstance;
    }
    TimeoutOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TimeoutSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.scheduler, this.errorInstance));
    };
    return TimeoutOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TimeoutSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(TimeoutSubscriber, _super);
    function TimeoutSubscriber(destination, absoluteTimeout, waitFor, scheduler, errorInstance) {
        _super.call(this, destination);
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.scheduler = scheduler;
        this.errorInstance = errorInstance;
        this.action = null;
        this.scheduleTimeout();
    }
    TimeoutSubscriber.dispatchTimeout = function (subscriber) {
        subscriber.error(subscriber.errorInstance);
    };
    TimeoutSubscriber.prototype.scheduleTimeout = function () {
        var action = this.action;
        if (action) {
            // Recycle the action if we've already scheduled one. All the production
            // Scheduler Actions mutate their state/delay time and return themeselves.
            // VirtualActions are immutable, so they create and return a clone. In this
            // case, we need to set the action reference to the most recent VirtualAction,
            // to ensure that's the one we clone from next time.
            this.action = action.schedule(this, this.waitFor);
        }
        else {
            this.add(this.action = this.scheduler.schedule(TimeoutSubscriber.dispatchTimeout, this.waitFor, this));
        }
    };
    TimeoutSubscriber.prototype._next = function (value) {
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
        _super.prototype._next.call(this, value);
    };
    /** @deprecated internal use only */ TimeoutSubscriber.prototype._unsubscribe = function () {
        this.action = null;
        this.scheduler = null;
        this.errorInstance = null;
    };
    return TimeoutSubscriber;
}(__WEBPACK_IMPORTED_MODULE_2__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=timeout.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/timeoutWith.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export timeoutWith */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_async__ = __webpack_require__("../../../../rxjs/_esm5/scheduler/async.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isDate__ = __webpack_require__("../../../../rxjs/_esm5/util/isDate.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._scheduler_async,.._util_isDate,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/* tslint:enable:max-line-length */
/**
 *
 * Errors if Observable does not emit a value in given time span, in case of which
 * subscribes to the second Observable.
 *
 * <span class="informal">It's a version of `timeout` operator that let's you specify fallback Observable.</span>
 *
 * <img src="./img/timeoutWith.png" width="100%">
 *
 * `timeoutWith` is a variation of `timeout` operator. It behaves exactly the same,
 * still accepting as a first argument either a number or a Date, which control - respectively -
 * when values of source Observable should be emitted or when it should complete.
 *
 * The only difference is that it accepts a second, required parameter. This parameter
 * should be an Observable which will be subscribed when source Observable fails any timeout check.
 * So whenever regular `timeout` would emit an error, `timeoutWith` will instead start re-emitting
 * values from second Observable. Note that this fallback Observable is not checked for timeouts
 * itself, so it can emit values and complete at arbitrary points in time. From the moment of a second
 * subscription, Observable returned from `timeoutWith` simply mirrors fallback stream. When that
 * stream completes, it completes as well.
 *
 * Scheduler, which in case of `timeout` is provided as as second argument, can be still provided
 * here - as a third, optional parameter. It still is used to schedule timeout checks and -
 * as a consequence - when second Observable will be subscribed, since subscription happens
 * immediately after failing check.
 *
 * @example <caption>Add fallback observable</caption>
 * const seconds = Rx.Observable.interval(1000);
 * const minutes = Rx.Observable.interval(60 * 1000);
 *
 * seconds.timeoutWith(900, minutes)
 *     .subscribe(
 *         value => console.log(value), // After 900ms, will start emitting `minutes`,
 *                                      // since first value of `seconds` will not arrive fast enough.
 *         err => console.log(err) // Would be called after 900ms in case of `timeout`,
 *                                 // but here will never be called.
 *     );
 *
 * @param {number|Date} due Number specifying period within which Observable must emit values
 *                          or Date specifying before when Observable should complete
 * @param {Observable<T>} withObservable Observable which will be subscribed if source fails timeout check.
 * @param {Scheduler} [scheduler] Scheduler controlling when timeout checks occur.
 * @return {Observable<T>} Observable that mirrors behaviour of source or, when timeout check fails, of an Observable
 *                          passed as a second parameter.
 * @method timeoutWith
 * @owner Observable
 */
function timeoutWith(due, withObservable, scheduler) {
    if (scheduler === void 0) {
        scheduler = __WEBPACK_IMPORTED_MODULE_0__scheduler_async__["a" /* async */];
    }
    return function (source) {
        var absoluteTimeout = Object(__WEBPACK_IMPORTED_MODULE_1__util_isDate__["a" /* isDate */])(due);
        var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
        return source.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
    };
}
var TimeoutWithOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
    }
    TimeoutWithOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
    };
    return TimeoutWithOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TimeoutWithSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(TimeoutWithSubscriber, _super);
    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        _super.call(this, destination);
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
        this.action = null;
        this.scheduleTimeout();
    }
    TimeoutWithSubscriber.dispatchTimeout = function (subscriber) {
        var withObservable = subscriber.withObservable;
        subscriber._unsubscribeAndRecycle();
        subscriber.add(Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(subscriber, withObservable));
    };
    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
        var action = this.action;
        if (action) {
            // Recycle the action if we've already scheduled one. All the production
            // Scheduler Actions mutate their state/delay time and return themeselves.
            // VirtualActions are immutable, so they create and return a clone. In this
            // case, we need to set the action reference to the most recent VirtualAction,
            // to ensure that's the one we clone from next time.
            this.action = action.schedule(this, this.waitFor);
        }
        else {
            this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
        }
    };
    TimeoutWithSubscriber.prototype._next = function (value) {
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
        _super.prototype._next.call(this, value);
    };
    /** @deprecated internal use only */ TimeoutWithSubscriber.prototype._unsubscribe = function () {
        this.action = null;
        this.scheduler = null;
        this.withObservable = null;
    };
    return TimeoutWithSubscriber;
}(__WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=timeoutWith.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/timestamp.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export timestamp */
/* unused harmony export Timestamp */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_async__ = __webpack_require__("../../../../rxjs/_esm5/scheduler/async.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__map__ = __webpack_require__("../../../../rxjs/_esm5/operators/map.js");
/** PURE_IMPORTS_START .._scheduler_async,._map PURE_IMPORTS_END */


/**
 * @param scheduler
 * @return {Observable<Timestamp<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timestamp
 * @owner Observable
 */
function timestamp(scheduler) {
    if (scheduler === void 0) {
        scheduler = __WEBPACK_IMPORTED_MODULE_0__scheduler_async__["a" /* async */];
    }
    return Object(__WEBPACK_IMPORTED_MODULE_1__map__["a" /* map */])(function (value) { return new Timestamp(value, scheduler.now()); });
    // return (source: Observable<T>) => source.lift(new TimestampOperator(scheduler));
}
var Timestamp = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function Timestamp(value, timestamp) {
        this.value = value;
        this.timestamp = timestamp;
    }
    return Timestamp;
}());
;
//# sourceMappingURL=timestamp.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/window.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export window */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._Subject,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/**
 * Branch out the source Observable values as a nested Observable whenever
 * `windowBoundaries` emits.
 *
 * <span class="informal">It's like {@link buffer}, but emits a nested Observable
 * instead of an array.</span>
 *
 * <img src="./img/window.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits connected, non-overlapping
 * windows. It emits the current window and opens a new one whenever the
 * Observable `windowBoundaries` emits an item. Because each window is an
 * Observable, the output is a higher-order Observable.
 *
 * @example <caption>In every window of 1 second each, emit at most 2 click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var interval = Rx.Observable.interval(1000);
 * var result = clicks.window(interval)
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link buffer}
 *
 * @param {Observable<any>} windowBoundaries An Observable that completes the
 * previous window and starts a new window.
 * @return {Observable<Observable<T>>} An Observable of windows, which are
 * Observables emitting values of the source Observable.
 * @method window
 * @owner Observable
 */
function window(windowBoundaries) {
    return function windowOperatorFunction(source) {
        return source.lift(new WindowOperator(windowBoundaries));
    };
}
var WindowOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function WindowOperator(windowBoundaries) {
        this.windowBoundaries = windowBoundaries;
    }
    WindowOperator.prototype.call = function (subscriber, source) {
        var windowSubscriber = new WindowSubscriber(subscriber);
        var sourceSubscription = source.subscribe(windowSubscriber);
        if (!sourceSubscription.closed) {
            windowSubscriber.add(Object(__WEBPACK_IMPORTED_MODULE_2__util_subscribeToResult__["a" /* subscribeToResult */])(windowSubscriber, this.windowBoundaries));
        }
        return sourceSubscription;
    };
    return WindowOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(WindowSubscriber, _super);
    function WindowSubscriber(destination) {
        _super.call(this, destination);
        this.window = new __WEBPACK_IMPORTED_MODULE_0__Subject__["Subject"]();
        destination.next(this.window);
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow();
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
        this._complete();
    };
    WindowSubscriber.prototype._next = function (value) {
        this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
        this.window.error(err);
        this.destination.error(err);
    };
    WindowSubscriber.prototype._complete = function () {
        this.window.complete();
        this.destination.complete();
    };
    /** @deprecated internal use only */ WindowSubscriber.prototype._unsubscribe = function () {
        this.window = null;
    };
    WindowSubscriber.prototype.openWindow = function () {
        var prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        var destination = this.destination;
        var newWindow = this.window = new __WEBPACK_IMPORTED_MODULE_0__Subject__["Subject"]();
        destination.next(newWindow);
    };
    return WindowSubscriber;
}(__WEBPACK_IMPORTED_MODULE_1__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=window.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/windowCount.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export windowCount */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/** PURE_IMPORTS_START .._Subscriber,.._Subject PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * Branch out the source Observable values as a nested Observable with each
 * nested Observable emitting at most `windowSize` values.
 *
 * <span class="informal">It's like {@link bufferCount}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowCount.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits windows every `startWindowEvery`
 * items, each containing no more than `windowSize` items. When the source
 * Observable completes or encounters an error, the output Observable emits
 * the current window and propagates the notification from the source
 * Observable. If `startWindowEvery` is not provided, then new windows are
 * started immediately at the start of the source and when each window completes
 * with size `windowSize`.
 *
 * @example <caption>Ignore every 3rd click event, starting from the first one</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowCount(3)
 *   .map(win => win.skip(1)) // skip first of every 3 clicks
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Ignore every 3rd click event, starting from the third one</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowCount(2, 3)
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link bufferCount}
 *
 * @param {number} windowSize The maximum number of values emitted by each
 * window.
 * @param {number} [startWindowEvery] Interval at which to start a new window.
 * For example if `startWindowEvery` is `2`, then a new window will be started
 * on every other value from the source. A new window is started at the
 * beginning of the source by default.
 * @return {Observable<Observable<T>>} An Observable of windows, which in turn
 * are Observable of values.
 * @method windowCount
 * @owner Observable
 */
function windowCount(windowSize, startWindowEvery) {
    if (startWindowEvery === void 0) {
        startWindowEvery = 0;
    }
    return function windowCountOperatorFunction(source) {
        return source.lift(new WindowCountOperator(windowSize, startWindowEvery));
    };
}
var WindowCountOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function WindowCountOperator(windowSize, startWindowEvery) {
        this.windowSize = windowSize;
        this.startWindowEvery = startWindowEvery;
    }
    WindowCountOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery));
    };
    return WindowCountOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowCountSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(WindowCountSubscriber, _super);
    function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
        _super.call(this, destination);
        this.destination = destination;
        this.windowSize = windowSize;
        this.startWindowEvery = startWindowEvery;
        this.windows = [new __WEBPACK_IMPORTED_MODULE_1__Subject__["Subject"]()];
        this.count = 0;
        destination.next(this.windows[0]);
    }
    WindowCountSubscriber.prototype._next = function (value) {
        var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
        var destination = this.destination;
        var windowSize = this.windowSize;
        var windows = this.windows;
        var len = windows.length;
        for (var i = 0; i < len && !this.closed; i++) {
            windows[i].next(value);
        }
        var c = this.count - windowSize + 1;
        if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
            windows.shift().complete();
        }
        if (++this.count % startWindowEvery === 0 && !this.closed) {
            var window_1 = new __WEBPACK_IMPORTED_MODULE_1__Subject__["Subject"]();
            windows.push(window_1);
            destination.next(window_1);
        }
    };
    WindowCountSubscriber.prototype._error = function (err) {
        var windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().error(err);
            }
        }
        this.destination.error(err);
    };
    WindowCountSubscriber.prototype._complete = function () {
        var windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().complete();
            }
        }
        this.destination.complete();
    };
    /** @deprecated internal use only */ WindowCountSubscriber.prototype._unsubscribe = function () {
        this.count = 0;
        this.windows = null;
    };
    return WindowCountSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]));
//# sourceMappingURL=windowCount.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/windowTime.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export windowTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_async__ = __webpack_require__("../../../../rxjs/_esm5/scheduler/async.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_isNumeric__ = __webpack_require__("../../../../rxjs/_esm5/util/isNumeric.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_isScheduler__ = __webpack_require__("../../../../rxjs/_esm5/util/isScheduler.js");
/** PURE_IMPORTS_START .._Subject,.._scheduler_async,.._Subscriber,.._util_isNumeric,.._util_isScheduler PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





function windowTime(windowTimeSpan) {
    var scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_async__["a" /* async */];
    var windowCreationInterval = null;
    var maxWindowSize = Number.POSITIVE_INFINITY;
    if (Object(__WEBPACK_IMPORTED_MODULE_4__util_isScheduler__["a" /* isScheduler */])(arguments[3])) {
        scheduler = arguments[3];
    }
    if (Object(__WEBPACK_IMPORTED_MODULE_4__util_isScheduler__["a" /* isScheduler */])(arguments[2])) {
        scheduler = arguments[2];
    }
    else if (Object(__WEBPACK_IMPORTED_MODULE_3__util_isNumeric__["a" /* isNumeric */])(arguments[2])) {
        maxWindowSize = arguments[2];
    }
    if (Object(__WEBPACK_IMPORTED_MODULE_4__util_isScheduler__["a" /* isScheduler */])(arguments[1])) {
        scheduler = arguments[1];
    }
    else if (Object(__WEBPACK_IMPORTED_MODULE_3__util_isNumeric__["a" /* isNumeric */])(arguments[1])) {
        windowCreationInterval = arguments[1];
    }
    return function windowTimeOperatorFunction(source) {
        return source.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler));
    };
}
var WindowTimeOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
        this.windowTimeSpan = windowTimeSpan;
        this.windowCreationInterval = windowCreationInterval;
        this.maxWindowSize = maxWindowSize;
        this.scheduler = scheduler;
    }
    WindowTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.maxWindowSize, this.scheduler));
    };
    return WindowTimeOperator;
}());
var CountedSubject = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(CountedSubject, _super);
    function CountedSubject() {
        _super.apply(this, arguments);
        this._numberOfNextedValues = 0;
    }
    CountedSubject.prototype.next = function (value) {
        this._numberOfNextedValues++;
        _super.prototype.next.call(this, value);
    };
    Object.defineProperty(CountedSubject.prototype, "numberOfNextedValues", {
        get: function () {
            return this._numberOfNextedValues;
        },
        enumerable: true,
        configurable: true
    });
    return CountedSubject;
}(__WEBPACK_IMPORTED_MODULE_0__Subject__["Subject"]));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowTimeSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(WindowTimeSubscriber, _super);
    function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
        _super.call(this, destination);
        this.destination = destination;
        this.windowTimeSpan = windowTimeSpan;
        this.windowCreationInterval = windowCreationInterval;
        this.maxWindowSize = maxWindowSize;
        this.scheduler = scheduler;
        this.windows = [];
        var window = this.openWindow();
        if (windowCreationInterval !== null && windowCreationInterval >= 0) {
            var closeState = { subscriber: this, window: window, context: null };
            var creationState = { windowTimeSpan: windowTimeSpan, windowCreationInterval: windowCreationInterval, subscriber: this, scheduler: scheduler };
            this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
            this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
        }
        else {
            var timeSpanOnlyState = { subscriber: this, window: window, windowTimeSpan: windowTimeSpan };
            this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
        }
    }
    WindowTimeSubscriber.prototype._next = function (value) {
        var windows = this.windows;
        var len = windows.length;
        for (var i = 0; i < len; i++) {
            var window_1 = windows[i];
            if (!window_1.closed) {
                window_1.next(value);
                if (window_1.numberOfNextedValues >= this.maxWindowSize) {
                    this.closeWindow(window_1);
                }
            }
        }
    };
    WindowTimeSubscriber.prototype._error = function (err) {
        var windows = this.windows;
        while (windows.length > 0) {
            windows.shift().error(err);
        }
        this.destination.error(err);
    };
    WindowTimeSubscriber.prototype._complete = function () {
        var windows = this.windows;
        while (windows.length > 0) {
            var window_2 = windows.shift();
            if (!window_2.closed) {
                window_2.complete();
            }
        }
        this.destination.complete();
    };
    WindowTimeSubscriber.prototype.openWindow = function () {
        var window = new CountedSubject();
        this.windows.push(window);
        var destination = this.destination;
        destination.next(window);
        return window;
    };
    WindowTimeSubscriber.prototype.closeWindow = function (window) {
        window.complete();
        var windows = this.windows;
        windows.splice(windows.indexOf(window), 1);
    };
    return WindowTimeSubscriber;
}(__WEBPACK_IMPORTED_MODULE_2__Subscriber__["a" /* Subscriber */]));
function dispatchWindowTimeSpanOnly(state) {
    var subscriber = state.subscriber, windowTimeSpan = state.windowTimeSpan, window = state.window;
    if (window) {
        subscriber.closeWindow(window);
    }
    state.window = subscriber.openWindow();
    this.schedule(state, windowTimeSpan);
}
function dispatchWindowCreation(state) {
    var windowTimeSpan = state.windowTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler, windowCreationInterval = state.windowCreationInterval;
    var window = subscriber.openWindow();
    var action = this;
    var context = { action: action, subscription: null };
    var timeSpanState = { subscriber: subscriber, window: window, context: context };
    context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
    action.add(context.subscription);
    action.schedule(state, windowCreationInterval);
}
function dispatchWindowClose(state) {
    var subscriber = state.subscriber, window = state.window, context = state.context;
    if (context && context.action && context.subscription) {
        context.action.remove(context.subscription);
    }
    subscriber.closeWindow(window);
}
//# sourceMappingURL=windowTime.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/windowToggle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export windowToggle */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_tryCatch__ = __webpack_require__("../../../../rxjs/_esm5/util/tryCatch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_errorObject__ = __webpack_require__("../../../../rxjs/_esm5/util/errorObject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._Subject,.._Subscription,.._util_tryCatch,.._util_errorObject,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};






/**
 * Branch out the source Observable values as a nested Observable starting from
 * an emission from `openings` and ending when the output of `closingSelector`
 * emits.
 *
 * <span class="informal">It's like {@link bufferToggle}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowToggle.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits windows that contain those items
 * emitted by the source Observable between the time when the `openings`
 * Observable emits an item and when the Observable returned by
 * `closingSelector` emits an item.
 *
 * @example <caption>Every other second, emit the click events from the next 500ms</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var openings = Rx.Observable.interval(1000);
 * var result = clicks.windowToggle(openings, i =>
 *   i % 2 ? Rx.Observable.interval(500) : Rx.Observable.empty()
 * ).mergeAll();
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowWhen}
 * @see {@link bufferToggle}
 *
 * @param {Observable<O>} openings An observable of notifications to start new
 * windows.
 * @param {function(value: O): Observable} closingSelector A function that takes
 * the value emitted by the `openings` observable and returns an Observable,
 * which, when it emits (either `next` or `complete`), signals that the
 * associated window should complete.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowToggle
 * @owner Observable
 */
function windowToggle(openings, closingSelector) {
    return function (source) { return source.lift(new WindowToggleOperator(openings, closingSelector)); };
}
var WindowToggleOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function WindowToggleOperator(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    WindowToggleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
    };
    return WindowToggleOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowToggleSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(WindowToggleSubscriber, _super);
    function WindowToggleSubscriber(destination, openings, closingSelector) {
        _super.call(this, destination);
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(this.openSubscription = Object(__WEBPACK_IMPORTED_MODULE_5__util_subscribeToResult__["a" /* subscribeToResult */])(this, openings, openings));
    }
    WindowToggleSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        if (contexts) {
            var len = contexts.length;
            for (var i = 0; i < len; i++) {
                contexts[i].window.next(value);
            }
        }
    };
    WindowToggleSubscriber.prototype._error = function (err) {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context = contexts[index];
                context.window.error(err);
                context.subscription.unsubscribe();
            }
        }
        _super.prototype._error.call(this, err);
    };
    WindowToggleSubscriber.prototype._complete = function () {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context = contexts[index];
                context.window.complete();
                context.subscription.unsubscribe();
            }
        }
        _super.prototype._complete.call(this);
    };
    /** @deprecated internal use only */ WindowToggleSubscriber.prototype._unsubscribe = function () {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context = contexts[index];
                context.window.unsubscribe();
                context.subscription.unsubscribe();
            }
        }
    };
    WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (outerValue === this.openings) {
            var closingSelector = this.closingSelector;
            var closingNotifier = Object(__WEBPACK_IMPORTED_MODULE_2__util_tryCatch__["a" /* tryCatch */])(closingSelector)(innerValue);
            if (closingNotifier === __WEBPACK_IMPORTED_MODULE_3__util_errorObject__["a" /* errorObject */]) {
                return this.error(__WEBPACK_IMPORTED_MODULE_3__util_errorObject__["a" /* errorObject */].e);
            }
            else {
                var window_1 = new __WEBPACK_IMPORTED_MODULE_0__Subject__["Subject"]();
                var subscription = new __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */]();
                var context = { window: window_1, subscription: subscription };
                this.contexts.push(context);
                var innerSubscription = Object(__WEBPACK_IMPORTED_MODULE_5__util_subscribeToResult__["a" /* subscribeToResult */])(this, closingNotifier, context);
                if (innerSubscription.closed) {
                    this.closeWindow(this.contexts.length - 1);
                }
                else {
                    innerSubscription.context = context;
                    subscription.add(innerSubscription);
                }
                this.destination.next(window_1);
            }
        }
        else {
            this.closeWindow(this.contexts.indexOf(outerValue));
        }
    };
    WindowToggleSubscriber.prototype.notifyError = function (err) {
        this.error(err);
    };
    WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
        if (inner !== this.openSubscription) {
            this.closeWindow(this.contexts.indexOf(inner.context));
        }
    };
    WindowToggleSubscriber.prototype.closeWindow = function (index) {
        if (index === -1) {
            return;
        }
        var contexts = this.contexts;
        var context = contexts[index];
        var window = context.window, subscription = context.subscription;
        contexts.splice(index, 1);
        window.complete();
        subscription.unsubscribe();
    };
    return WindowToggleSubscriber;
}(__WEBPACK_IMPORTED_MODULE_4__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=windowToggle.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/windowWhen.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export windowWhen */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__("../../../../rxjs/_esm5/util/tryCatch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__("../../../../rxjs/_esm5/util/errorObject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/** PURE_IMPORTS_START .._Subject,.._util_tryCatch,.._util_errorObject,.._OuterSubscriber,.._util_subscribeToResult PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





/**
 * Branch out the source Observable values as a nested Observable using a
 * factory function of closing Observables to determine when to start a new
 * window.
 *
 * <span class="informal">It's like {@link bufferWhen}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowWhen.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits connected, non-overlapping windows.
 * It emits the current window and opens a new one whenever the Observable
 * produced by the specified `closingSelector` function emits an item. The first
 * window is opened immediately when subscribing to the output Observable.
 *
 * @example <caption>Emit only the first two clicks events in every window of [1-5] random seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks
 *   .windowWhen(() => Rx.Observable.interval(1000 + Math.random() * 4000))
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link bufferWhen}
 *
 * @param {function(): Observable} closingSelector A function that takes no
 * arguments and returns an Observable that signals (on either `next` or
 * `complete`) when to close the previous window and start a new one.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowWhen
 * @owner Observable
 */
function windowWhen(closingSelector) {
    return function windowWhenOperatorFunction(source) {
        return source.lift(new WindowOperator(closingSelector));
    };
}
var WindowOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function WindowOperator(closingSelector) {
        this.closingSelector = closingSelector;
    }
    WindowOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WindowSubscriber(subscriber, this.closingSelector));
    };
    return WindowOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(WindowSubscriber, _super);
    function WindowSubscriber(destination, closingSelector) {
        _super.call(this, destination);
        this.destination = destination;
        this.closingSelector = closingSelector;
        this.openWindow();
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow(innerSub);
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
        this.openWindow(innerSub);
    };
    WindowSubscriber.prototype._next = function (value) {
        this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
        this.window.error(err);
        this.destination.error(err);
        this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype._complete = function () {
        this.window.complete();
        this.destination.complete();
        this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
        if (this.closingNotification) {
            this.closingNotification.unsubscribe();
        }
    };
    WindowSubscriber.prototype.openWindow = function (innerSub) {
        if (innerSub === void 0) {
            innerSub = null;
        }
        if (innerSub) {
            this.remove(innerSub);
            innerSub.unsubscribe();
        }
        var prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        var window = this.window = new __WEBPACK_IMPORTED_MODULE_0__Subject__["Subject"]();
        this.destination.next(window);
        var closingNotifier = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(this.closingSelector)();
        if (closingNotifier === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
            var err = __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e;
            this.destination.error(err);
            this.window.error(err);
        }
        else {
            this.add(this.closingNotification = Object(__WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__["a" /* subscribeToResult */])(this, closingNotifier));
        }
    };
    return WindowSubscriber;
}(__WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=windowWhen.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/withLatestFrom.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export withLatestFrom */
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
 * Combines the source Observable with other Observables to create an Observable
 * whose values are calculated from the latest values of each, only when the
 * source emits.
 *
 * <span class="informal">Whenever the source Observable emits a value, it
 * computes a formula using that value plus the latest values from other input
 * Observables, then emits the output of that formula.</span>
 *
 * <img src="./img/withLatestFrom.png" width="100%">
 *
 * `withLatestFrom` combines each value from the source Observable (the
 * instance) with the latest values from the other input Observables only when
 * the source emits a value, optionally using a `project` function to determine
 * the value to be emitted on the output Observable. All input Observables must
 * emit at least one value before the output Observable will emit a value.
 *
 * @example <caption>On every click event, emit an array with the latest timer event plus the click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var result = clicks.withLatestFrom(timer);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link combineLatest}
 *
 * @param {ObservableInput} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {Function} [project] Projection function for combining values
 * together. Receives all values in order of the Observables passed, where the
 * first parameter is a value from the source Observable. (e.g.
 * `a.withLatestFrom(b, c, (a1, b1, c1) => a1 + b1 + c1)`). If this is not
 * passed, arrays will be emitted on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method withLatestFrom
 * @owner Observable
 */
function withLatestFrom() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return function (source) {
        var project;
        if (typeof args[args.length - 1] === 'function') {
            project = args.pop();
        }
        var observables = args;
        return source.lift(new WithLatestFromOperator(observables, project));
    };
}
var WithLatestFromOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function WithLatestFromOperator(observables, project) {
        this.observables = observables;
        this.project = project;
    }
    WithLatestFromOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
    };
    return WithLatestFromOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WithLatestFromSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(WithLatestFromSubscriber, _super);
    function WithLatestFromSubscriber(destination, observables, project) {
        _super.call(this, destination);
        this.observables = observables;
        this.project = project;
        this.toRespond = [];
        var len = observables.length;
        this.values = new Array(len);
        for (var i = 0; i < len; i++) {
            this.toRespond.push(i);
        }
        for (var i = 0; i < len; i++) {
            var observable = observables[i];
            this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, observable, observable, i));
        }
    }
    WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        var toRespond = this.toRespond;
        if (toRespond.length > 0) {
            var found = toRespond.indexOf(outerIndex);
            if (found !== -1) {
                toRespond.splice(found, 1);
            }
        }
    };
    WithLatestFromSubscriber.prototype.notifyComplete = function () {
        // noop
    };
    WithLatestFromSubscriber.prototype._next = function (value) {
        if (this.toRespond.length === 0) {
            var args = [value].concat(this.values);
            if (this.project) {
                this._tryProject(args);
            }
            else {
                this.destination.next(args);
            }
        }
    };
    WithLatestFromSubscriber.prototype._tryProject = function (args) {
        var result;
        try {
            result = this.project.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return WithLatestFromSubscriber;
}(__WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=withLatestFrom.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/zip.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export zip */
/* unused harmony export zipStatic */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ZipOperator; });
/* unused harmony export ZipSubscriber */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__ = __webpack_require__("../../../../rxjs/_esm5/observable/ArrayObservable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isArray__ = __webpack_require__("../../../../rxjs/_esm5/util/isArray.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Subscriber__ = __webpack_require__("../../../../rxjs/_esm5/Subscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__("../../../../rxjs/_esm5/OuterSubscriber.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__ = __webpack_require__("../../../../rxjs/_esm5/util/subscribeToResult.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__symbol_iterator__ = __webpack_require__("../../../../rxjs/_esm5/symbol/iterator.js");
/** PURE_IMPORTS_START .._observable_ArrayObservable,.._util_isArray,.._Subscriber,.._OuterSubscriber,.._util_subscribeToResult,.._symbol_iterator PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};






/* tslint:enable:max-line-length */
/**
 * @param observables
 * @return {Observable<R>}
 * @method zip
 * @owner Observable
 */
function zip() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    return function zipOperatorFunction(source) {
        return source.lift.call(zipStatic.apply(void 0, [source].concat(observables)));
    };
}
/* tslint:enable:max-line-length */
/**
 * Combines multiple Observables to create an Observable whose values are calculated from the values, in order, of each
 * of its input Observables.
 *
 * If the latest parameter is a function, this function is used to compute the created value from the input values.
 * Otherwise, an array of the input values is returned.
 *
 * @example <caption>Combine age and name from different sources</caption>
 *
 * let age$ = Observable.of<number>(27, 25, 29);
 * let name$ = Observable.of<string>('Foo', 'Bar', 'Beer');
 * let isDev$ = Observable.of<boolean>(true, true, false);
 *
 * Observable
 *     .zip(age$,
 *          name$,
 *          isDev$,
 *          (age: number, name: string, isDev: boolean) => ({ age, name, isDev }))
 *     .subscribe(x => console.log(x));
 *
 * // outputs
 * // { age: 27, name: 'Foo', isDev: true }
 * // { age: 25, name: 'Bar', isDev: true }
 * // { age: 29, name: 'Beer', isDev: false }
 *
 * @param observables
 * @return {Observable<R>}
 * @static true
 * @name zip
 * @owner Observable
 */
function zipStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = observables[observables.length - 1];
    if (typeof project === 'function') {
        observables.pop();
    }
    return new __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__["a" /* ArrayObservable */](observables).lift(new ZipOperator(project));
}
var ZipOperator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function ZipOperator(project) {
        this.project = project;
    }
    ZipOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ZipSubscriber(subscriber, this.project));
    };
    return ZipOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ZipSubscriber = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(ZipSubscriber, _super);
    function ZipSubscriber(destination, project, values) {
        if (values === void 0) {
            values = Object.create(null);
        }
        _super.call(this, destination);
        this.iterators = [];
        this.active = 0;
        this.project = (typeof project === 'function') ? project : null;
        this.values = values;
    }
    ZipSubscriber.prototype._next = function (value) {
        var iterators = this.iterators;
        if (Object(__WEBPACK_IMPORTED_MODULE_1__util_isArray__["a" /* isArray */])(value)) {
            iterators.push(new StaticArrayIterator(value));
        }
        else if (typeof value[__WEBPACK_IMPORTED_MODULE_5__symbol_iterator__["a" /* iterator */]] === 'function') {
            iterators.push(new StaticIterator(value[__WEBPACK_IMPORTED_MODULE_5__symbol_iterator__["a" /* iterator */]]()));
        }
        else {
            iterators.push(new ZipBufferIterator(this.destination, this, value));
        }
    };
    ZipSubscriber.prototype._complete = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        if (len === 0) {
            this.destination.complete();
            return;
        }
        this.active = len;
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            if (iterator.stillUnsubscribed) {
                this.add(iterator.subscribe(iterator, i));
            }
            else {
                this.active--; // not an observable
            }
        }
    };
    ZipSubscriber.prototype.notifyInactive = function () {
        this.active--;
        if (this.active === 0) {
            this.destination.complete();
        }
    };
    ZipSubscriber.prototype.checkIterators = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        var destination = this.destination;
        // abort if not all of them have values
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
                return;
            }
        }
        var shouldComplete = false;
        var args = [];
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            var result = iterator.next();
            // check to see if it's completed now that you've gotten
            // the next value.
            if (iterator.hasCompleted()) {
                shouldComplete = true;
            }
            if (result.done) {
                destination.complete();
                return;
            }
            args.push(result.value);
        }
        if (this.project) {
            this._tryProject(args);
        }
        else {
            destination.next(args);
        }
        if (shouldComplete) {
            destination.complete();
        }
    };
    ZipSubscriber.prototype._tryProject = function (args) {
        var result;
        try {
            result = this.project.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return ZipSubscriber;
}(__WEBPACK_IMPORTED_MODULE_2__Subscriber__["a" /* Subscriber */]));
var StaticIterator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function StaticIterator(iterator) {
        this.iterator = iterator;
        this.nextResult = iterator.next();
    }
    StaticIterator.prototype.hasValue = function () {
        return true;
    };
    StaticIterator.prototype.next = function () {
        var result = this.nextResult;
        this.nextResult = this.iterator.next();
        return result;
    };
    StaticIterator.prototype.hasCompleted = function () {
        var nextResult = this.nextResult;
        return nextResult && nextResult.done;
    };
    return StaticIterator;
}());
var StaticArrayIterator = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function StaticArrayIterator(array) {
        this.array = array;
        this.index = 0;
        this.length = 0;
        this.length = array.length;
    }
    StaticArrayIterator.prototype[__WEBPACK_IMPORTED_MODULE_5__symbol_iterator__["a" /* iterator */]] = function () {
        return this;
    };
    StaticArrayIterator.prototype.next = function (value) {
        var i = this.index++;
        var array = this.array;
        return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
    };
    StaticArrayIterator.prototype.hasValue = function () {
        return this.array.length > this.index;
    };
    StaticArrayIterator.prototype.hasCompleted = function () {
        return this.array.length === this.index;
    };
    return StaticArrayIterator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ZipBufferIterator = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(ZipBufferIterator, _super);
    function ZipBufferIterator(destination, parent, observable) {
        _super.call(this, destination);
        this.parent = parent;
        this.observable = observable;
        this.stillUnsubscribed = true;
        this.buffer = [];
        this.isComplete = false;
    }
    ZipBufferIterator.prototype[__WEBPACK_IMPORTED_MODULE_5__symbol_iterator__["a" /* iterator */]] = function () {
        return this;
    };
    // NOTE: there is actually a name collision here with Subscriber.next and Iterator.next
    //    this is legit because `next()` will never be called by a subscription in this case.
    ZipBufferIterator.prototype.next = function () {
        var buffer = this.buffer;
        if (buffer.length === 0 && this.isComplete) {
            return { value: null, done: true };
        }
        else {
            return { value: buffer.shift(), done: false };
        }
    };
    ZipBufferIterator.prototype.hasValue = function () {
        return this.buffer.length > 0;
    };
    ZipBufferIterator.prototype.hasCompleted = function () {
        return this.buffer.length === 0 && this.isComplete;
    };
    ZipBufferIterator.prototype.notifyComplete = function () {
        if (this.buffer.length > 0) {
            this.isComplete = true;
            this.parent.notifyInactive();
        }
        else {
            this.destination.complete();
        }
    };
    ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.buffer.push(innerValue);
        this.parent.checkIterators();
    };
    ZipBufferIterator.prototype.subscribe = function (value, index) {
        return Object(__WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__["a" /* subscribeToResult */])(this, this.observable, this, index);
    };
    return ZipBufferIterator;
}(__WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */]));
//# sourceMappingURL=zip.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/operators/zipAll.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export zipAll */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__zip__ = __webpack_require__("../../../../rxjs/_esm5/operators/zip.js");
/** PURE_IMPORTS_START ._zip PURE_IMPORTS_END */

function zipAll(project) {
    return function (source) { return source.lift(new __WEBPACK_IMPORTED_MODULE_0__zip__["a" /* ZipOperator */](project)); };
}
//# sourceMappingURL=zipAll.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/util/FastMap.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FastMap; });
var FastMap = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function FastMap() {
        this.values = {};
    }
    FastMap.prototype.delete = function (key) {
        this.values[key] = null;
        return true;
    };
    FastMap.prototype.set = function (key, value) {
        this.values[key] = value;
        return this;
    };
    FastMap.prototype.get = function (key) {
        return this.values[key];
    };
    FastMap.prototype.forEach = function (cb, thisArg) {
        var values = this.values;
        for (var key in values) {
            if (values.hasOwnProperty(key) && values[key] !== null) {
                cb.call(thisArg, values[key], key);
            }
        }
    };
    FastMap.prototype.clear = function () {
        this.values = {};
    };
    return FastMap;
}());
//# sourceMappingURL=FastMap.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/util/Map.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Map; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root__ = __webpack_require__("../../../../rxjs/_esm5/util/root.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MapPolyfill__ = __webpack_require__("../../../../rxjs/_esm5/util/MapPolyfill.js");
/** PURE_IMPORTS_START ._root,._MapPolyfill PURE_IMPORTS_END */


var Map = __WEBPACK_IMPORTED_MODULE_0__root__["a" /* root */].Map || /*@__PURE__*/ (function () { return __WEBPACK_IMPORTED_MODULE_1__MapPolyfill__["a" /* MapPolyfill */]; })();
//# sourceMappingURL=Map.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/util/MapPolyfill.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPolyfill; });
var MapPolyfill = /*@__PURE__*/ (/*@__PURE__*/ function () {
    function MapPolyfill() {
        this.size = 0;
        this._values = [];
        this._keys = [];
    }
    MapPolyfill.prototype.get = function (key) {
        var i = this._keys.indexOf(key);
        return i === -1 ? undefined : this._values[i];
    };
    MapPolyfill.prototype.set = function (key, value) {
        var i = this._keys.indexOf(key);
        if (i === -1) {
            this._keys.push(key);
            this._values.push(value);
            this.size++;
        }
        else {
            this._values[i] = value;
        }
        return this;
    };
    MapPolyfill.prototype.delete = function (key) {
        var i = this._keys.indexOf(key);
        if (i === -1) {
            return false;
        }
        this._values.splice(i, 1);
        this._keys.splice(i, 1);
        this.size--;
        return true;
    };
    MapPolyfill.prototype.clear = function () {
        this._keys.length = 0;
        this._values.length = 0;
        this.size = 0;
    };
    MapPolyfill.prototype.forEach = function (cb, thisArg) {
        for (var i = 0; i < this.size; i++) {
            cb.call(thisArg, this._values[i], this._keys[i]);
        }
    };
    return MapPolyfill;
}());
//# sourceMappingURL=MapPolyfill.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/util/Set.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export minimalSetImpl */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Set; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root__ = __webpack_require__("../../../../rxjs/_esm5/util/root.js");
/** PURE_IMPORTS_START ._root PURE_IMPORTS_END */

function minimalSetImpl() {
    // THIS IS NOT a full impl of Set, this is just the minimum
    // bits of functionality we need for this library.
    return (function () {
        function MinimalSet() {
            this._values = [];
        }
        MinimalSet.prototype.add = function (value) {
            if (!this.has(value)) {
                this._values.push(value);
            }
        };
        MinimalSet.prototype.has = function (value) {
            return this._values.indexOf(value) !== -1;
        };
        Object.defineProperty(MinimalSet.prototype, "size", {
            get: function () {
                return this._values.length;
            },
            enumerable: true,
            configurable: true
        });
        MinimalSet.prototype.clear = function () {
            this._values.length = 0;
        };
        return MinimalSet;
    }());
}
var Set = __WEBPACK_IMPORTED_MODULE_0__root__["a" /* root */].Set || /*@__PURE__*/ minimalSetImpl();
//# sourceMappingURL=Set.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/util/TimeoutError.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimeoutError; });
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when duetime elapses.
 *
 * @see {@link timeout}
 *
 * @class TimeoutError
 */
var TimeoutError = /*@__PURE__*/ (/*@__PURE__*/ function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError() {
        var err = _super.call(this, 'Timeout has occurred');
        this.name = err.name = 'TimeoutError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return TimeoutError;
}(Error));
//# sourceMappingURL=TimeoutError.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/util/isNumeric.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isNumeric;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isArray__ = __webpack_require__("../../../../rxjs/_esm5/util/isArray.js");
/** PURE_IMPORTS_START .._util_isArray PURE_IMPORTS_END */

function isNumeric(val) {
    // parseFloat NaNs numeric-cast false positives (null|true|false|"")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    // adding 1 corrects loss of precision from parseFloat (#15100)
    return !Object(__WEBPACK_IMPORTED_MODULE_0__util_isArray__["a" /* isArray */])(val) && (val - parseFloat(val) + 1) >= 0;
}
;
//# sourceMappingURL=isNumeric.js.map


/***/ }),

/***/ "../../../../rxjs/_esm5/util/not.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = not;
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function not(pred, thisArg) {
    function notPred() {
        return !(notPred.pred.apply(notPred.thisArg, arguments));
    }
    notPred.pred = pred;
    notPred.thisArg = thisArg;
    return notPred;
}
//# sourceMappingURL=not.js.map


/***/ }),

/***/ "../../../cdk/esm5/a11y.es5.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export FocusTrapDirective */
/* unused harmony export MESSAGES_CONTAINER_ID */
/* unused harmony export CDK_DESCRIBEDBY_ID_PREFIX */
/* unused harmony export CDK_DESCRIBEDBY_HOST_ATTRIBUTE */
/* unused harmony export AriaDescriber */
/* unused harmony export ARIA_DESCRIBER_PROVIDER_FACTORY */
/* unused harmony export ARIA_DESCRIBER_PROVIDER */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActiveDescendantKeyManager; });
/* unused harmony export FocusKeyManager */
/* unused harmony export ListKeyManager */
/* unused harmony export FocusTrap */
/* unused harmony export FocusTrapFactory */
/* unused harmony export FocusTrapDeprecatedDirective */
/* unused harmony export CdkTrapFocus */
/* unused harmony export InteractivityChecker */
/* unused harmony export LIVE_ANNOUNCER_ELEMENT_TOKEN */
/* unused harmony export LiveAnnouncer */
/* unused harmony export LIVE_ANNOUNCER_PROVIDER_FACTORY */
/* unused harmony export LIVE_ANNOUNCER_PROVIDER */
/* unused harmony export TOUCH_BUFFER_MS */
/* unused harmony export FocusMonitor */
/* unused harmony export CdkMonitorFocus */
/* unused harmony export FOCUS_MONITOR_PROVIDER_FACTORY */
/* unused harmony export FOCUS_MONITOR_PROVIDER */
/* unused harmony export isFakeMousedownFromScreenReader */
/* unused harmony export A11yModule */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_cdk_coercion__ = __webpack_require__("../../../cdk/esm5/coercion.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators_take__ = __webpack_require__("../../../../rxjs/_esm5/operators/take.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_cdk_platform__ = __webpack_require__("../../../cdk/esm5/platform.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_tslib__ = __webpack_require__("../../../../tslib/tslib.es6.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_cdk_keycodes__ = __webpack_require__("../../../cdk/esm5/keycodes.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_operators_debounceTime__ = __webpack_require__("../../../../rxjs/_esm5/operators/debounceTime.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_operators_filter__ = __webpack_require__("../../../../rxjs/_esm5/operators/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_rxjs_operators_map__ = __webpack_require__("../../../../rxjs/_esm5/operators/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_rxjs_operators_tap__ = __webpack_require__("../../../../rxjs/_esm5/operators/tap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_rxjs_observable_of__ = __webpack_require__("../../../../rxjs/_esm5/observable/of.js");
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
















/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Utility for checking the interactivity of an element, such as whether is is focusable or
 * tabbable.
 */
var InteractivityChecker = /** @class */ (function () {
    function InteractivityChecker(_platform) {
        this._platform = _platform;
    }
    /**
     * Gets whether an element is disabled.
     *
     * @param element Element to be checked.
     * @returns Whether the element is disabled.
     */
    /**
     * Gets whether an element is disabled.
     *
     * @param {?} element Element to be checked.
     * @return {?} Whether the element is disabled.
     */
    InteractivityChecker.prototype.isDisabled = /**
     * Gets whether an element is disabled.
     *
     * @param {?} element Element to be checked.
     * @return {?} Whether the element is disabled.
     */
    function (element) {
        // This does not capture some cases, such as a non-form control with a disabled attribute or
        // a form control inside of a disabled form, but should capture the most common cases.
        return element.hasAttribute('disabled');
    };
    /**
     * Gets whether an element is visible for the purposes of interactivity.
     *
     * This will capture states like `display: none` and `visibility: hidden`, but not things like
     * being clipped by an `overflow: hidden` parent or being outside the viewport.
     *
     * @returns Whether the element is visible.
     */
    /**
     * Gets whether an element is visible for the purposes of interactivity.
     *
     * This will capture states like `display: none` and `visibility: hidden`, but not things like
     * being clipped by an `overflow: hidden` parent or being outside the viewport.
     *
     * @param {?} element
     * @return {?} Whether the element is visible.
     */
    InteractivityChecker.prototype.isVisible = /**
     * Gets whether an element is visible for the purposes of interactivity.
     *
     * This will capture states like `display: none` and `visibility: hidden`, but not things like
     * being clipped by an `overflow: hidden` parent or being outside the viewport.
     *
     * @param {?} element
     * @return {?} Whether the element is visible.
     */
    function (element) {
        return hasGeometry(element) && getComputedStyle(element).visibility === 'visible';
    };
    /**
     * Gets whether an element can be reached via Tab key.
     * Assumes that the element has already been checked with isFocusable.
     *
     * @param element Element to be checked.
     * @returns Whether the element is tabbable.
     */
    /**
     * Gets whether an element can be reached via Tab key.
     * Assumes that the element has already been checked with isFocusable.
     *
     * @param {?} element Element to be checked.
     * @return {?} Whether the element is tabbable.
     */
    InteractivityChecker.prototype.isTabbable = /**
     * Gets whether an element can be reached via Tab key.
     * Assumes that the element has already been checked with isFocusable.
     *
     * @param {?} element Element to be checked.
     * @return {?} Whether the element is tabbable.
     */
    function (element) {
        // Nothing is tabbable on the the server 😎
        if (!this._platform.isBrowser) {
            return false;
        }
        var /** @type {?} */ frameElement = getFrameElement(getWindow(element));
        if (frameElement) {
            var /** @type {?} */ frameType = frameElement && frameElement.nodeName.toLowerCase();
            // Frame elements inherit their tabindex onto all child elements.
            if (getTabIndexValue(frameElement) === -1) {
                return false;
            }
            // Webkit and Blink consider anything inside of an <object> element as non-tabbable.
            if ((this._platform.BLINK || this._platform.WEBKIT) && frameType === 'object') {
                return false;
            }
            // Webkit and Blink disable tabbing to an element inside of an invisible frame.
            if ((this._platform.BLINK || this._platform.WEBKIT) && !this.isVisible(frameElement)) {
                return false;
            }
        }
        var /** @type {?} */ nodeName = element.nodeName.toLowerCase();
        var /** @type {?} */ tabIndexValue = getTabIndexValue(element);
        if (element.hasAttribute('contenteditable')) {
            return tabIndexValue !== -1;
        }
        if (nodeName === 'iframe') {
            // The frames may be tabbable depending on content, but it's not possibly to reliably
            // investigate the content of the frames.
            return false;
        }
        if (nodeName === 'audio') {
            if (!element.hasAttribute('controls')) {
                // By default an <audio> element without the controls enabled is not tabbable.
                return false;
            }
            else if (this._platform.BLINK) {
                // In Blink <audio controls> elements are always tabbable.
                return true;
            }
        }
        if (nodeName === 'video') {
            if (!element.hasAttribute('controls') && this._platform.TRIDENT) {
                // In Trident a <video> element without the controls enabled is not tabbable.
                return false;
            }
            else if (this._platform.BLINK || this._platform.FIREFOX) {
                // In Chrome and Firefox <video controls> elements are always tabbable.
                return true;
            }
        }
        if (nodeName === 'object' && (this._platform.BLINK || this._platform.WEBKIT)) {
            // In all Blink and WebKit based browsers <object> elements are never tabbable.
            return false;
        }
        // In iOS the browser only considers some specific elements as tabbable.
        if (this._platform.WEBKIT && this._platform.IOS && !isPotentiallyTabbableIOS(element)) {
            return false;
        }
        return element.tabIndex >= 0;
    };
    /**
     * Gets whether an element can be focused by the user.
     *
     * @param element Element to be checked.
     * @returns Whether the element is focusable.
     */
    /**
     * Gets whether an element can be focused by the user.
     *
     * @param {?} element Element to be checked.
     * @return {?} Whether the element is focusable.
     */
    InteractivityChecker.prototype.isFocusable = /**
     * Gets whether an element can be focused by the user.
     *
     * @param {?} element Element to be checked.
     * @return {?} Whether the element is focusable.
     */
    function (element) {
        // Perform checks in order of left to most expensive.
        // Again, naive approach that does not capture many edge cases and browser quirks.
        return isPotentiallyFocusable(element) && !this.isDisabled(element) && this.isVisible(element);
    };
    InteractivityChecker.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    InteractivityChecker.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_3__angular_cdk_platform__["a" /* Platform */], },
    ]; };
    return InteractivityChecker;
}());
/**
 * Returns the frame element from a window object. Since browsers like MS Edge throw errors if
 * the frameElement property is being accessed from a different host address, this property
 * should be accessed carefully.
 * @param {?} window
 * @return {?}
 */
function getFrameElement(window) {
    try {
        return /** @type {?} */ (window.frameElement);
    }
    catch (/** @type {?} */ e) {
        return null;
    }
}
/**
 * Checks whether the specified element has any geometry / rectangles.
 * @param {?} element
 * @return {?}
 */
function hasGeometry(element) {
    // Use logic from jQuery to check for an invisible element.
    // See https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js#L12
    return !!(element.offsetWidth || element.offsetHeight ||
        (typeof element.getClientRects === 'function' && element.getClientRects().length));
}
/**
 * Gets whether an element's
 * @param {?} element
 * @return {?}
 */
function isNativeFormElement(element) {
    var /** @type {?} */ nodeName = element.nodeName.toLowerCase();
    return nodeName === 'input' ||
        nodeName === 'select' ||
        nodeName === 'button' ||
        nodeName === 'textarea';
}
/**
 * Gets whether an element is an `<input type="hidden">`.
 * @param {?} element
 * @return {?}
 */
function isHiddenInput(element) {
    return isInputElement(element) && element.type == 'hidden';
}
/**
 * Gets whether an element is an anchor that has an href attribute.
 * @param {?} element
 * @return {?}
 */
function isAnchorWithHref(element) {
    return isAnchorElement(element) && element.hasAttribute('href');
}
/**
 * Gets whether an element is an input element.
 * @param {?} element
 * @return {?}
 */
function isInputElement(element) {
    return element.nodeName.toLowerCase() == 'input';
}
/**
 * Gets whether an element is an anchor element.
 * @param {?} element
 * @return {?}
 */
function isAnchorElement(element) {
    return element.nodeName.toLowerCase() == 'a';
}
/**
 * Gets whether an element has a valid tabindex.
 * @param {?} element
 * @return {?}
 */
function hasValidTabIndex(element) {
    if (!element.hasAttribute('tabindex') || element.tabIndex === undefined) {
        return false;
    }
    var /** @type {?} */ tabIndex = element.getAttribute('tabindex');
    // IE11 parses tabindex="" as the value "-32768"
    if (tabIndex == '-32768') {
        return false;
    }
    return !!(tabIndex && !isNaN(parseInt(tabIndex, 10)));
}
/**
 * Returns the parsed tabindex from the element attributes instead of returning the
 * evaluated tabindex from the browsers defaults.
 * @param {?} element
 * @return {?}
 */
function getTabIndexValue(element) {
    if (!hasValidTabIndex(element)) {
        return null;
    }
    // See browser issue in Gecko https://bugzilla.mozilla.org/show_bug.cgi?id=1128054
    var /** @type {?} */ tabIndex = parseInt(element.getAttribute('tabindex') || '', 10);
    return isNaN(tabIndex) ? -1 : tabIndex;
}
/**
 * Checks whether the specified element is potentially tabbable on iOS
 * @param {?} element
 * @return {?}
 */
function isPotentiallyTabbableIOS(element) {
    var /** @type {?} */ nodeName = element.nodeName.toLowerCase();
    var /** @type {?} */ inputType = nodeName === 'input' && (/** @type {?} */ (element)).type;
    return inputType === 'text'
        || inputType === 'password'
        || nodeName === 'select'
        || nodeName === 'textarea';
}
/**
 * Gets whether an element is potentially focusable without taking current visible/disabled state
 * into account.
 * @param {?} element
 * @return {?}
 */
function isPotentiallyFocusable(element) {
    // Inputs are potentially focusable *unless* they're type="hidden".
    if (isHiddenInput(element)) {
        return false;
    }
    return isNativeFormElement(element) ||
        isAnchorWithHref(element) ||
        element.hasAttribute('contenteditable') ||
        hasValidTabIndex(element);
}
/**
 * Gets the parent window of a DOM node with regards of being inside of an iframe.
 * @param {?} node
 * @return {?}
 */
function getWindow(node) {
    return node.ownerDocument.defaultView || window;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Class that allows for trapping focus within a DOM element.
 *
 * This class currently uses a relatively simple approach to focus trapping.
 * It assumes that the tab order is the same as DOM order, which is not necessarily true.
 * Things like `tabIndex > 0`, flex `order`, and shadow roots can cause to two to misalign.
 */
var FocusTrap = /** @class */ (function () {
    function FocusTrap(_element, _checker, _ngZone, _document, deferAnchors) {
        if (deferAnchors === void 0) { deferAnchors = false; }
        this._element = _element;
        this._checker = _checker;
        this._ngZone = _ngZone;
        this._document = _document;
        this._enabled = true;
        if (!deferAnchors) {
            this.attachAnchors();
        }
    }
    Object.defineProperty(FocusTrap.prototype, "enabled", {
        /** Whether the focus trap is active. */
        get: /**
         * Whether the focus trap is active.
         * @return {?}
         */
        function () { return this._enabled; },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._enabled = val;
            if (this._startAnchor && this._endAnchor) {
                this._startAnchor.tabIndex = this._endAnchor.tabIndex = this._enabled ? 0 : -1;
            }
        },
        enumerable: true,
        configurable: true
    });
    /** Destroys the focus trap by cleaning up the anchors. */
    /**
     * Destroys the focus trap by cleaning up the anchors.
     * @return {?}
     */
    FocusTrap.prototype.destroy = /**
     * Destroys the focus trap by cleaning up the anchors.
     * @return {?}
     */
    function () {
        if (this._startAnchor && this._startAnchor.parentNode) {
            this._startAnchor.parentNode.removeChild(this._startAnchor);
        }
        if (this._endAnchor && this._endAnchor.parentNode) {
            this._endAnchor.parentNode.removeChild(this._endAnchor);
        }
        this._startAnchor = this._endAnchor = null;
    };
    /**
     * Inserts the anchors into the DOM. This is usually done automatically
     * in the constructor, but can be deferred for cases like directives with `*ngIf`.
     */
    /**
     * Inserts the anchors into the DOM. This is usually done automatically
     * in the constructor, but can be deferred for cases like directives with `*ngIf`.
     * @return {?}
     */
    FocusTrap.prototype.attachAnchors = /**
     * Inserts the anchors into the DOM. This is usually done automatically
     * in the constructor, but can be deferred for cases like directives with `*ngIf`.
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this._startAnchor) {
            this._startAnchor = this._createAnchor();
        }
        if (!this._endAnchor) {
            this._endAnchor = this._createAnchor();
        }
        this._ngZone.runOutsideAngular(function () {
            /** @type {?} */ ((_this._startAnchor)).addEventListener('focus', function () {
                _this.focusLastTabbableElement();
            }); /** @type {?} */
            ((_this._endAnchor)).addEventListener('focus', function () {
                _this.focusFirstTabbableElement();
            });
            if (_this._element.parentNode) {
                _this._element.parentNode.insertBefore(/** @type {?} */ ((_this._startAnchor)), _this._element);
                _this._element.parentNode.insertBefore(/** @type {?} */ ((_this._endAnchor)), _this._element.nextSibling);
            }
        });
    };
    /**
     * Waits for the zone to stabilize, then either focuses the first element that the
     * user specified, or the first tabbable element.
     * @returns Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    /**
     * Waits for the zone to stabilize, then either focuses the first element that the
     * user specified, or the first tabbable element.
     * @return {?} Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    FocusTrap.prototype.focusInitialElementWhenReady = /**
     * Waits for the zone to stabilize, then either focuses the first element that the
     * user specified, or the first tabbable element.
     * @return {?} Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this._executeOnStable(function () { return resolve(_this.focusInitialElement()); });
        });
    };
    /**
     * Waits for the zone to stabilize, then focuses
     * the first tabbable element within the focus trap region.
     * @returns Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    /**
     * Waits for the zone to stabilize, then focuses
     * the first tabbable element within the focus trap region.
     * @return {?} Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    FocusTrap.prototype.focusFirstTabbableElementWhenReady = /**
     * Waits for the zone to stabilize, then focuses
     * the first tabbable element within the focus trap region.
     * @return {?} Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this._executeOnStable(function () { return resolve(_this.focusFirstTabbableElement()); });
        });
    };
    /**
     * Waits for the zone to stabilize, then focuses
     * the last tabbable element within the focus trap region.
     * @returns Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    /**
     * Waits for the zone to stabilize, then focuses
     * the last tabbable element within the focus trap region.
     * @return {?} Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    FocusTrap.prototype.focusLastTabbableElementWhenReady = /**
     * Waits for the zone to stabilize, then focuses
     * the last tabbable element within the focus trap region.
     * @return {?} Returns a promise that resolves with a boolean, depending
     * on whether focus was moved successfuly.
     */
    function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this._executeOnStable(function () { return resolve(_this.focusLastTabbableElement()); });
        });
    };
    /**
     * Get the specified boundary element of the trapped region.
     * @param {?} bound The boundary to get (start or end of trapped region).
     * @return {?} The boundary element.
     */
    FocusTrap.prototype._getRegionBoundary = /**
     * Get the specified boundary element of the trapped region.
     * @param {?} bound The boundary to get (start or end of trapped region).
     * @return {?} The boundary element.
     */
    function (bound) {
        // Contains the deprecated version of selector, for temporary backwards comparability.
        var /** @type {?} */ markers = /** @type {?} */ (this._element.querySelectorAll("[cdk-focus-region-" + bound + "], " +
            ("[cdkFocusRegion" + bound + "], ") +
            ("[cdk-focus-" + bound + "]")));
        for (var /** @type {?} */ i = 0; i < markers.length; i++) {
            if (markers[i].hasAttribute("cdk-focus-" + bound)) {
                console.warn("Found use of deprecated attribute 'cdk-focus-" + bound + "'," +
                    (" use 'cdkFocusRegion" + bound + "' instead."), markers[i]);
            }
            else if (markers[i].hasAttribute("cdk-focus-region-" + bound)) {
                console.warn("Found use of deprecated attribute 'cdk-focus-region-" + bound + "'," +
                    (" use 'cdkFocusRegion" + bound + "' instead."), markers[i]);
            }
        }
        if (bound == 'start') {
            return markers.length ? markers[0] : this._getFirstTabbableElement(this._element);
        }
        return markers.length ?
            markers[markers.length - 1] : this._getLastTabbableElement(this._element);
    };
    /**
     * Focuses the element that should be focused when the focus trap is initialized.
     * @returns Whether focus was moved successfuly.
     */
    /**
     * Focuses the element that should be focused when the focus trap is initialized.
     * @return {?} Whether focus was moved successfuly.
     */
    FocusTrap.prototype.focusInitialElement = /**
     * Focuses the element that should be focused when the focus trap is initialized.
     * @return {?} Whether focus was moved successfuly.
     */
    function () {
        // Contains the deprecated version of selector, for temporary backwards comparability.
        var /** @type {?} */ redirectToElement = /** @type {?} */ (this._element.querySelector("[cdk-focus-initial], " +
            "[cdkFocusInitial]"));
        if (this._element.hasAttribute("cdk-focus-initial")) {
            console.warn("Found use of deprecated attribute 'cdk-focus-initial'," +
                " use 'cdkFocusInitial' instead.", this._element);
        }
        if (redirectToElement) {
            redirectToElement.focus();
            return true;
        }
        return this.focusFirstTabbableElement();
    };
    /**
     * Focuses the first tabbable element within the focus trap region.
     * @returns Whether focus was moved successfuly.
     */
    /**
     * Focuses the first tabbable element within the focus trap region.
     * @return {?} Whether focus was moved successfuly.
     */
    FocusTrap.prototype.focusFirstTabbableElement = /**
     * Focuses the first tabbable element within the focus trap region.
     * @return {?} Whether focus was moved successfuly.
     */
    function () {
        var /** @type {?} */ redirectToElement = this._getRegionBoundary('start');
        if (redirectToElement) {
            redirectToElement.focus();
        }
        return !!redirectToElement;
    };
    /**
     * Focuses the last tabbable element within the focus trap region.
     * @returns Whether focus was moved successfuly.
     */
    /**
     * Focuses the last tabbable element within the focus trap region.
     * @return {?} Whether focus was moved successfuly.
     */
    FocusTrap.prototype.focusLastTabbableElement = /**
     * Focuses the last tabbable element within the focus trap region.
     * @return {?} Whether focus was moved successfuly.
     */
    function () {
        var /** @type {?} */ redirectToElement = this._getRegionBoundary('end');
        if (redirectToElement) {
            redirectToElement.focus();
        }
        return !!redirectToElement;
    };
    /**
     * Get the first tabbable element from a DOM subtree (inclusive).
     * @param {?} root
     * @return {?}
     */
    FocusTrap.prototype._getFirstTabbableElement = /**
     * Get the first tabbable element from a DOM subtree (inclusive).
     * @param {?} root
     * @return {?}
     */
    function (root) {
        if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
            return root;
        }
        // Iterate in DOM order. Note that IE doesn't have `children` for SVG so we fall
        // back to `childNodes` which includes text nodes, comments etc.
        var /** @type {?} */ children = root.children || root.childNodes;
        for (var /** @type {?} */ i = 0; i < children.length; i++) {
            var /** @type {?} */ tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE ?
                this._getFirstTabbableElement(/** @type {?} */ (children[i])) :
                null;
            if (tabbableChild) {
                return tabbableChild;
            }
        }
        return null;
    };
    /**
     * Get the last tabbable element from a DOM subtree (inclusive).
     * @param {?} root
     * @return {?}
     */
    FocusTrap.prototype._getLastTabbableElement = /**
     * Get the last tabbable element from a DOM subtree (inclusive).
     * @param {?} root
     * @return {?}
     */
    function (root) {
        if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
            return root;
        }
        // Iterate in reverse DOM order.
        var /** @type {?} */ children = root.children || root.childNodes;
        for (var /** @type {?} */ i = children.length - 1; i >= 0; i--) {
            var /** @type {?} */ tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE ?
                this._getLastTabbableElement(/** @type {?} */ (children[i])) :
                null;
            if (tabbableChild) {
                return tabbableChild;
            }
        }
        return null;
    };
    /**
     * Creates an anchor element.
     * @return {?}
     */
    FocusTrap.prototype._createAnchor = /**
     * Creates an anchor element.
     * @return {?}
     */
    function () {
        var /** @type {?} */ anchor = this._document.createElement('div');
        anchor.tabIndex = this._enabled ? 0 : -1;
        anchor.classList.add('cdk-visually-hidden');
        anchor.classList.add('cdk-focus-trap-anchor');
        return anchor;
    };
    /**
     * Executes a function when the zone is stable.
     * @param {?} fn
     * @return {?}
     */
    FocusTrap.prototype._executeOnStable = /**
     * Executes a function when the zone is stable.
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        if (this._ngZone.isStable) {
            fn();
        }
        else {
            this._ngZone.onStable.asObservable().pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators_take__["a" /* take */])(1)).subscribe(fn);
        }
    };
    return FocusTrap;
}());
/**
 * Factory that allows easy instantiation of focus traps.
 */
var FocusTrapFactory = /** @class */ (function () {
    function FocusTrapFactory(_checker, _ngZone, _document) {
        this._checker = _checker;
        this._ngZone = _ngZone;
        this._document = _document;
    }
    /**
     * Creates a focus-trapped region around the given element.
     * @param element The element around which focus will be trapped.
     * @param deferCaptureElements Defers the creation of focus-capturing elements to be done
     *     manually by the user.
     * @returns The created focus trap instance.
     */
    /**
     * Creates a focus-trapped region around the given element.
     * @param {?} element The element around which focus will be trapped.
     * @param {?=} deferCaptureElements Defers the creation of focus-capturing elements to be done
     *     manually by the user.
     * @return {?} The created focus trap instance.
     */
    FocusTrapFactory.prototype.create = /**
     * Creates a focus-trapped region around the given element.
     * @param {?} element The element around which focus will be trapped.
     * @param {?=} deferCaptureElements Defers the creation of focus-capturing elements to be done
     *     manually by the user.
     * @return {?} The created focus trap instance.
     */
    function (element, deferCaptureElements) {
        if (deferCaptureElements === void 0) { deferCaptureElements = false; }
        return new FocusTrap(element, this._checker, this._ngZone, this._document, deferCaptureElements);
    };
    FocusTrapFactory.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    FocusTrapFactory.ctorParameters = function () { return [
        { type: InteractivityChecker, },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_4__angular_common__["DOCUMENT"],] },] },
    ]; };
    return FocusTrapFactory;
}());
/**
 * Directive for trapping focus within a region.
 * \@docs-private
 * @deprecated
 * \@deletion-target 6.0.0
 */
var FocusTrapDeprecatedDirective = /** @class */ (function () {
    function FocusTrapDeprecatedDirective(_elementRef, _focusTrapFactory) {
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this.focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement, true);
    }
    Object.defineProperty(FocusTrapDeprecatedDirective.prototype, "disabled", {
        get: /**
         * Whether the focus trap is active.
         * @return {?}
         */
        function () { return !this.focusTrap.enabled; },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this.focusTrap.enabled = !Object(__WEBPACK_IMPORTED_MODULE_1__angular_cdk_coercion__["a" /* coerceBooleanProperty */])(val);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    FocusTrapDeprecatedDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.focusTrap.destroy();
    };
    /**
     * @return {?}
     */
    FocusTrapDeprecatedDirective.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        this.focusTrap.attachAnchors();
    };
    FocusTrapDeprecatedDirective.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: 'cdk-focus-trap',
                },] },
    ];
    /** @nocollapse */
    FocusTrapDeprecatedDirective.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
        { type: FocusTrapFactory, },
    ]; };
    FocusTrapDeprecatedDirective.propDecorators = {
        "disabled": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return FocusTrapDeprecatedDirective;
}());
/**
 * Directive for trapping focus within a region.
 */
var CdkTrapFocus = /** @class */ (function () {
    function CdkTrapFocus(_elementRef, _focusTrapFactory, _document) {
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        /**
         * Previously focused element to restore focus to upon destroy when using autoCapture.
         */
        this._previouslyFocusedElement = null;
        this._document = _document;
        this.focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement, true);
    }
    Object.defineProperty(CdkTrapFocus.prototype, "enabled", {
        get: /**
         * Whether the focus trap is active.
         * @return {?}
         */
        function () { return this.focusTrap.enabled; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this.focusTrap.enabled = Object(__WEBPACK_IMPORTED_MODULE_1__angular_cdk_coercion__["a" /* coerceBooleanProperty */])(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkTrapFocus.prototype, "autoCapture", {
        get: /**
         * Whether the directive should automatially move focus into the trapped region upon
         * initialization and return focus to the previous activeElement upon destruction.
         * @return {?}
         */
        function () { return this._autoCapture; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this._autoCapture = Object(__WEBPACK_IMPORTED_MODULE_1__angular_cdk_coercion__["a" /* coerceBooleanProperty */])(value); },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    CdkTrapFocus.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.focusTrap.destroy();
        // If we stored a previously focused element when using autoCapture, return focus to that
        // element now that the trapped region is being destroyed.
        if (this._previouslyFocusedElement) {
            this._previouslyFocusedElement.focus();
            this._previouslyFocusedElement = null;
        }
    };
    /**
     * @return {?}
     */
    CdkTrapFocus.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        this.focusTrap.attachAnchors();
        if (this.autoCapture) {
            this._previouslyFocusedElement = /** @type {?} */ (this._document.activeElement);
            this.focusTrap.focusInitialElementWhenReady();
        }
    };
    CdkTrapFocus.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[cdkTrapFocus]',
                    exportAs: 'cdkTrapFocus',
                },] },
    ];
    /** @nocollapse */
    CdkTrapFocus.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
        { type: FocusTrapFactory, },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_4__angular_common__["DOCUMENT"],] },] },
    ]; };
    CdkTrapFocus.propDecorators = {
        "enabled": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkTrapFocus',] },],
        "autoCapture": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkTrapFocusAutoCapture',] },],
    };
    return CdkTrapFocus;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * IDs are deliminated by an empty space, as per the spec.
 */
var ID_DELIMINATOR = ' ';
/**
 * Adds the given ID to the specified ARIA attribute on an element.
 * Used for attributes such as aria-labelledby, aria-owns, etc.
 * @param {?} el
 * @param {?} attr
 * @param {?} id
 * @return {?}
 */
function addAriaReferencedId(el, attr, id) {
    var /** @type {?} */ ids = getAriaReferenceIds(el, attr);
    if (ids.some(function (existingId) { return existingId.trim() == id.trim(); })) {
        return;
    }
    ids.push(id.trim());
    el.setAttribute(attr, ids.join(ID_DELIMINATOR));
}
/**
 * Removes the given ID from the specified ARIA attribute on an element.
 * Used for attributes such as aria-labelledby, aria-owns, etc.
 * @param {?} el
 * @param {?} attr
 * @param {?} id
 * @return {?}
 */
function removeAriaReferencedId(el, attr, id) {
    var /** @type {?} */ ids = getAriaReferenceIds(el, attr);
    var /** @type {?} */ filteredIds = ids.filter(function (val) { return val != id.trim(); });
    el.setAttribute(attr, filteredIds.join(ID_DELIMINATOR));
}
/**
 * Gets the list of IDs referenced by the given ARIA attribute on an element.
 * Used for attributes such as aria-labelledby, aria-owns, etc.
 * @param {?} el
 * @param {?} attr
 * @return {?}
 */
function getAriaReferenceIds(el, attr) {
    // Get string array of all individual ids (whitespace deliminated) in the attribute value
    return (el.getAttribute(attr) || '').match(/\S+/g) || [];
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Interface used to register message elements and keep a count of how many registrations have
 * the same message and the reference to the message element used for the `aria-describedby`.
 * @record
 */

/**
 * ID used for the body container where all messages are appended.
 */
var MESSAGES_CONTAINER_ID = 'cdk-describedby-message-container';
/**
 * ID prefix used for each created message element.
 */
var CDK_DESCRIBEDBY_ID_PREFIX = 'cdk-describedby-message';
/**
 * Attribute given to each host element that is described by a message element.
 */
var CDK_DESCRIBEDBY_HOST_ATTRIBUTE = 'cdk-describedby-host';
/**
 * Global incremental identifier for each registered message element.
 */
var nextId = 0;
/**
 * Global map of all registered message elements that have been placed into the document.
 */
var messageRegistry = new Map();
/**
 * Container for all registered messages.
 */
var messagesContainer = null;
/**
 * Utility that creates visually hidden elements with a message content. Useful for elements that
 * want to use aria-describedby to further describe themselves without adding additional visual
 * content.
 * \@docs-private
 */
var AriaDescriber = /** @class */ (function () {
    function AriaDescriber(_document) {
        this._document = _document;
    }
    /**
     * Adds to the host element an aria-describedby reference to a hidden element that contains
     * the message. If the same message has already been registered, then it will reuse the created
     * message element.
     */
    /**
     * Adds to the host element an aria-describedby reference to a hidden element that contains
     * the message. If the same message has already been registered, then it will reuse the created
     * message element.
     * @param {?} hostElement
     * @param {?} message
     * @return {?}
     */
    AriaDescriber.prototype.describe = /**
     * Adds to the host element an aria-describedby reference to a hidden element that contains
     * the message. If the same message has already been registered, then it will reuse the created
     * message element.
     * @param {?} hostElement
     * @param {?} message
     * @return {?}
     */
    function (hostElement, message) {
        if (!this._canBeDescribed(hostElement, message)) {
            return;
        }
        if (!messageRegistry.has(message)) {
            this._createMessageElement(message);
        }
        if (!this._isElementDescribedByMessage(hostElement, message)) {
            this._addMessageReference(hostElement, message);
        }
    };
    /** Removes the host element's aria-describedby reference to the message element. */
    /**
     * Removes the host element's aria-describedby reference to the message element.
     * @param {?} hostElement
     * @param {?} message
     * @return {?}
     */
    AriaDescriber.prototype.removeDescription = /**
     * Removes the host element's aria-describedby reference to the message element.
     * @param {?} hostElement
     * @param {?} message
     * @return {?}
     */
    function (hostElement, message) {
        if (!this._canBeDescribed(hostElement, message)) {
            return;
        }
        if (this._isElementDescribedByMessage(hostElement, message)) {
            this._removeMessageReference(hostElement, message);
        }
        var /** @type {?} */ registeredMessage = messageRegistry.get(message);
        if (registeredMessage && registeredMessage.referenceCount === 0) {
            this._deleteMessageElement(message);
        }
        if (messagesContainer && messagesContainer.childNodes.length === 0) {
            this._deleteMessagesContainer();
        }
    };
    /** Unregisters all created message elements and removes the message container. */
    /**
     * Unregisters all created message elements and removes the message container.
     * @return {?}
     */
    AriaDescriber.prototype.ngOnDestroy = /**
     * Unregisters all created message elements and removes the message container.
     * @return {?}
     */
    function () {
        var /** @type {?} */ describedElements = this._document.querySelectorAll("[" + CDK_DESCRIBEDBY_HOST_ATTRIBUTE + "]");
        for (var /** @type {?} */ i = 0; i < describedElements.length; i++) {
            this._removeCdkDescribedByReferenceIds(describedElements[i]);
            describedElements[i].removeAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE);
        }
        if (messagesContainer) {
            this._deleteMessagesContainer();
        }
        messageRegistry.clear();
    };
    /**
     * Creates a new element in the visually hidden message container element with the message
     * as its content and adds it to the message registry.
     * @param {?} message
     * @return {?}
     */
    AriaDescriber.prototype._createMessageElement = /**
     * Creates a new element in the visually hidden message container element with the message
     * as its content and adds it to the message registry.
     * @param {?} message
     * @return {?}
     */
    function (message) {
        var /** @type {?} */ messageElement = this._document.createElement('div');
        messageElement.setAttribute('id', CDK_DESCRIBEDBY_ID_PREFIX + "-" + nextId++);
        messageElement.appendChild(/** @type {?} */ ((this._document.createTextNode(message))));
        if (!messagesContainer) {
            this._createMessagesContainer();
        } /** @type {?} */
        ((messagesContainer)).appendChild(messageElement);
        messageRegistry.set(message, { messageElement: messageElement, referenceCount: 0 });
    };
    /**
     * Deletes the message element from the global messages container.
     * @param {?} message
     * @return {?}
     */
    AriaDescriber.prototype._deleteMessageElement = /**
     * Deletes the message element from the global messages container.
     * @param {?} message
     * @return {?}
     */
    function (message) {
        var /** @type {?} */ registeredMessage = messageRegistry.get(message);
        var /** @type {?} */ messageElement = registeredMessage && registeredMessage.messageElement;
        if (messagesContainer && messageElement) {
            messagesContainer.removeChild(messageElement);
        }
        messageRegistry.delete(message);
    };
    /**
     * Creates the global container for all aria-describedby messages.
     * @return {?}
     */
    AriaDescriber.prototype._createMessagesContainer = /**
     * Creates the global container for all aria-describedby messages.
     * @return {?}
     */
    function () {
        messagesContainer = this._document.createElement('div');
        messagesContainer.setAttribute('id', MESSAGES_CONTAINER_ID);
        messagesContainer.setAttribute('aria-hidden', 'true');
        messagesContainer.style.display = 'none';
        this._document.body.appendChild(messagesContainer);
    };
    /**
     * Deletes the global messages container.
     * @return {?}
     */
    AriaDescriber.prototype._deleteMessagesContainer = /**
     * Deletes the global messages container.
     * @return {?}
     */
    function () {
        if (messagesContainer && messagesContainer.parentNode) {
            messagesContainer.parentNode.removeChild(messagesContainer);
            messagesContainer = null;
        }
    };
    /**
     * Removes all cdk-describedby messages that are hosted through the element.
     * @param {?} element
     * @return {?}
     */
    AriaDescriber.prototype._removeCdkDescribedByReferenceIds = /**
     * Removes all cdk-describedby messages that are hosted through the element.
     * @param {?} element
     * @return {?}
     */
    function (element) {
        // Remove all aria-describedby reference IDs that are prefixed by CDK_DESCRIBEDBY_ID_PREFIX
        var /** @type {?} */ originalReferenceIds = getAriaReferenceIds(element, 'aria-describedby')
            .filter(function (id) { return id.indexOf(CDK_DESCRIBEDBY_ID_PREFIX) != 0; });
        element.setAttribute('aria-describedby', originalReferenceIds.join(' '));
    };
    /**
     * Adds a message reference to the element using aria-describedby and increments the registered
     * message's reference count.
     * @param {?} element
     * @param {?} message
     * @return {?}
     */
    AriaDescriber.prototype._addMessageReference = /**
     * Adds a message reference to the element using aria-describedby and increments the registered
     * message's reference count.
     * @param {?} element
     * @param {?} message
     * @return {?}
     */
    function (element, message) {
        var /** @type {?} */ registeredMessage = /** @type {?} */ ((messageRegistry.get(message)));
        // Add the aria-describedby reference and set the
        // describedby_host attribute to mark the element.
        addAriaReferencedId(element, 'aria-describedby', registeredMessage.messageElement.id);
        element.setAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE, '');
        registeredMessage.referenceCount++;
    };
    /**
     * Removes a message reference from the element using aria-describedby
     * and decrements the registered message's reference count.
     * @param {?} element
     * @param {?} message
     * @return {?}
     */
    AriaDescriber.prototype._removeMessageReference = /**
     * Removes a message reference from the element using aria-describedby
     * and decrements the registered message's reference count.
     * @param {?} element
     * @param {?} message
     * @return {?}
     */
    function (element, message) {
        var /** @type {?} */ registeredMessage = /** @type {?} */ ((messageRegistry.get(message)));
        registeredMessage.referenceCount--;
        removeAriaReferencedId(element, 'aria-describedby', registeredMessage.messageElement.id);
        element.removeAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE);
    };
    /**
     * Returns true if the element has been described by the provided message ID.
     * @param {?} element
     * @param {?} message
     * @return {?}
     */
    AriaDescriber.prototype._isElementDescribedByMessage = /**
     * Returns true if the element has been described by the provided message ID.
     * @param {?} element
     * @param {?} message
     * @return {?}
     */
    function (element, message) {
        var /** @type {?} */ referenceIds = getAriaReferenceIds(element, 'aria-describedby');
        var /** @type {?} */ registeredMessage = messageRegistry.get(message);
        var /** @type {?} */ messageId = registeredMessage && registeredMessage.messageElement.id;
        return !!messageId && referenceIds.indexOf(messageId) != -1;
    };
    /**
     * Determines whether a message can be described on a particular element.
     * @param {?} element
     * @param {?} message
     * @return {?}
     */
    AriaDescriber.prototype._canBeDescribed = /**
     * Determines whether a message can be described on a particular element.
     * @param {?} element
     * @param {?} message
     * @return {?}
     */
    function (element, message) {
        return element.nodeType === this._document.ELEMENT_NODE && message != null &&
            !!("" + message).trim();
    };
    AriaDescriber.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    AriaDescriber.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_4__angular_common__["DOCUMENT"],] },] },
    ]; };
    return AriaDescriber;
}());
/**
 * \@docs-private
 * @param {?} parentDispatcher
 * @param {?} _document
 * @return {?}
 */
function ARIA_DESCRIBER_PROVIDER_FACTORY(parentDispatcher, _document) {
    return parentDispatcher || new AriaDescriber(_document);
}
/**
 * \@docs-private
 */
var ARIA_DESCRIBER_PROVIDER = {
    // If there is already an AriaDescriber available, use that. Otherwise, provide a new one.
    provide: AriaDescriber,
    deps: [
        [new __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"](), new __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"](), AriaDescriber],
        /** @type {?} */ (__WEBPACK_IMPORTED_MODULE_4__angular_common__["DOCUMENT"])
    ],
    useFactory: ARIA_DESCRIBER_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * This interface is for items that can be passed to a ListKeyManager.
 * @record
 */

/**
 * This class manages keyboard events for selectable lists. If you pass it a query list
 * of items, it will set the active item correctly when arrow events occur.
 */
var ListKeyManager = /** @class */ (function () {
    function ListKeyManager(_items) {
        var _this = this;
        this._items = _items;
        this._activeItemIndex = -1;
        this._wrap = false;
        this._letterKeyStream = new __WEBPACK_IMPORTED_MODULE_6_rxjs_Subject__["Subject"]();
        this._typeaheadSubscription = __WEBPACK_IMPORTED_MODULE_7_rxjs_Subscription__["a" /* Subscription */].EMPTY;
        this._vertical = true;
        /**
         * Predicate function that can be used to check whether an item should be skipped
         * by the key manager. By default, disabled items are skipped.
         */
        this._skipPredicateFn = function (item) { return item.disabled; };
        this._pressedLetters = [];
        /**
         * Stream that emits any time the TAB key is pressed, so components can react
         * when focus is shifted off of the list.
         */
        this.tabOut = new __WEBPACK_IMPORTED_MODULE_6_rxjs_Subject__["Subject"]();
        /**
         * Stream that emits whenever the active item of the list manager changes.
         */
        this.change = new __WEBPACK_IMPORTED_MODULE_6_rxjs_Subject__["Subject"]();
        _items.changes.subscribe(function (newItems) {
            if (_this._activeItem) {
                var /** @type {?} */ itemArray = newItems.toArray();
                var /** @type {?} */ newIndex = itemArray.indexOf(_this._activeItem);
                if (newIndex > -1 && newIndex !== _this._activeItemIndex) {
                    _this._activeItemIndex = newIndex;
                }
            }
        });
    }
    /**
     * Sets the predicate function that determines which items should be skipped by the
     * list key manager.
     * @param predicate Function that determines whether the given item should be skipped.
     */
    /**
     * Sets the predicate function that determines which items should be skipped by the
     * list key manager.
     * @param {?} predicate Function that determines whether the given item should be skipped.
     * @return {?}
     */
    ListKeyManager.prototype.skipPredicate = /**
     * Sets the predicate function that determines which items should be skipped by the
     * list key manager.
     * @param {?} predicate Function that determines whether the given item should be skipped.
     * @return {?}
     */
    function (predicate) {
        this._skipPredicateFn = predicate;
        return this;
    };
    /**
     * Turns on wrapping mode, which ensures that the active item will wrap to
     * the other end of list when there are no more items in the given direction.
     */
    /**
     * Turns on wrapping mode, which ensures that the active item will wrap to
     * the other end of list when there are no more items in the given direction.
     * @return {?}
     */
    ListKeyManager.prototype.withWrap = /**
     * Turns on wrapping mode, which ensures that the active item will wrap to
     * the other end of list when there are no more items in the given direction.
     * @return {?}
     */
    function () {
        this._wrap = true;
        return this;
    };
    /**
     * Configures whether the key manager should be able to move the selection vertically.
     * @param enabled Whether vertical selection should be enabled.
     */
    /**
     * Configures whether the key manager should be able to move the selection vertically.
     * @param {?=} enabled Whether vertical selection should be enabled.
     * @return {?}
     */
    ListKeyManager.prototype.withVerticalOrientation = /**
     * Configures whether the key manager should be able to move the selection vertically.
     * @param {?=} enabled Whether vertical selection should be enabled.
     * @return {?}
     */
    function (enabled) {
        if (enabled === void 0) { enabled = true; }
        this._vertical = enabled;
        return this;
    };
    /**
     * Configures the key manager to move the selection horizontally.
     * Passing in `null` will disable horizontal movement.
     * @param direction Direction in which the selection can be moved.
     */
    /**
     * Configures the key manager to move the selection horizontally.
     * Passing in `null` will disable horizontal movement.
     * @param {?} direction Direction in which the selection can be moved.
     * @return {?}
     */
    ListKeyManager.prototype.withHorizontalOrientation = /**
     * Configures the key manager to move the selection horizontally.
     * Passing in `null` will disable horizontal movement.
     * @param {?} direction Direction in which the selection can be moved.
     * @return {?}
     */
    function (direction) {
        this._horizontal = direction;
        return this;
    };
    /**
     * Turns on typeahead mode which allows users to set the active item by typing.
     * @param debounceInterval Time to wait after the last keystroke before setting the active item.
     */
    /**
     * Turns on typeahead mode which allows users to set the active item by typing.
     * @param {?=} debounceInterval Time to wait after the last keystroke before setting the active item.
     * @return {?}
     */
    ListKeyManager.prototype.withTypeAhead = /**
     * Turns on typeahead mode which allows users to set the active item by typing.
     * @param {?=} debounceInterval Time to wait after the last keystroke before setting the active item.
     * @return {?}
     */
    function (debounceInterval) {
        var _this = this;
        if (debounceInterval === void 0) { debounceInterval = 200; }
        if (this._items.length && this._items.some(function (item) { return typeof item.getLabel !== 'function'; })) {
            throw Error('ListKeyManager items in typeahead mode must implement the `getLabel` method.');
        }
        this._typeaheadSubscription.unsubscribe();
        // Debounce the presses of non-navigational keys, collect the ones that correspond to letters
        // and convert those letters back into a string. Afterwards find the first item that starts
        // with that string and select it.
        this._typeaheadSubscription = this._letterKeyStream.pipe(Object(__WEBPACK_IMPORTED_MODULE_12_rxjs_operators_tap__["a" /* tap */])(function (keyCode) { return _this._pressedLetters.push(keyCode); }), Object(__WEBPACK_IMPORTED_MODULE_9_rxjs_operators_debounceTime__["a" /* debounceTime */])(debounceInterval), Object(__WEBPACK_IMPORTED_MODULE_10_rxjs_operators_filter__["a" /* filter */])(function () { return _this._pressedLetters.length > 0; }), Object(__WEBPACK_IMPORTED_MODULE_11_rxjs_operators_map__["a" /* map */])(function () { return _this._pressedLetters.join(''); })).subscribe(function (inputString) {
            var /** @type {?} */ items = _this._items.toArray();
            // Start at 1 because we want to start searching at the item immediately
            // following the current active item.
            for (var /** @type {?} */ i = 1; i < items.length + 1; i++) {
                var /** @type {?} */ index = (_this._activeItemIndex + i) % items.length;
                var /** @type {?} */ item = items[index];
                if (!_this._skipPredicateFn(item) && /** @type {?} */ ((item.getLabel))().toUpperCase().trim().indexOf(inputString) === 0) {
                    _this.setActiveItem(index);
                    break;
                }
            }
            _this._pressedLetters = [];
        });
        return this;
    };
    /**
     * Sets the active item to the item at the index specified.
     * @param index The index of the item to be set as active.
     */
    /**
     * Sets the active item to the item at the index specified.
     * @param {?} index The index of the item to be set as active.
     * @return {?}
     */
    ListKeyManager.prototype.setActiveItem = /**
     * Sets the active item to the item at the index specified.
     * @param {?} index The index of the item to be set as active.
     * @return {?}
     */
    function (index) {
        var /** @type {?} */ previousIndex = this._activeItemIndex;
        this._activeItemIndex = index;
        this._activeItem = this._items.toArray()[index];
        if (this._activeItemIndex !== previousIndex) {
            this.change.next(index);
        }
    };
    /**
     * Sets the active item depending on the key event passed in.
     * @param event Keyboard event to be used for determining which element should be active.
     */
    /**
     * Sets the active item depending on the key event passed in.
     * @param {?} event Keyboard event to be used for determining which element should be active.
     * @return {?}
     */
    ListKeyManager.prototype.onKeydown = /**
     * Sets the active item depending on the key event passed in.
     * @param {?} event Keyboard event to be used for determining which element should be active.
     * @return {?}
     */
    function (event) {
        var /** @type {?} */ keyCode = event.keyCode;
        switch (keyCode) {
            case __WEBPACK_IMPORTED_MODULE_8__angular_cdk_keycodes__["g" /* TAB */]:
                this.tabOut.next();
                return;
            case __WEBPACK_IMPORTED_MODULE_8__angular_cdk_keycodes__["b" /* DOWN_ARROW */]:
                if (this._vertical) {
                    this.setNextItemActive();
                    break;
                }
                else {
                    return;
                }
            case __WEBPACK_IMPORTED_MODULE_8__angular_cdk_keycodes__["h" /* UP_ARROW */]:
                if (this._vertical) {
                    this.setPreviousItemActive();
                    break;
                }
                else {
                    return;
                }
            case __WEBPACK_IMPORTED_MODULE_8__angular_cdk_keycodes__["f" /* RIGHT_ARROW */]:
                if (this._horizontal === 'ltr') {
                    this.setNextItemActive();
                    break;
                }
                else if (this._horizontal === 'rtl') {
                    this.setPreviousItemActive();
                    break;
                }
                else {
                    return;
                }
            case __WEBPACK_IMPORTED_MODULE_8__angular_cdk_keycodes__["d" /* LEFT_ARROW */]:
                if (this._horizontal === 'ltr') {
                    this.setPreviousItemActive();
                    break;
                }
                else if (this._horizontal === 'rtl') {
                    this.setNextItemActive();
                    break;
                }
                else {
                    return;
                }
            default:
                // Attempt to use the `event.key` which also maps it to the user's keyboard language,
                // otherwise fall back to resolving alphanumeric characters via the keyCode.
                if (event.key && event.key.length === 1) {
                    this._letterKeyStream.next(event.key.toLocaleUpperCase());
                }
                else if ((keyCode >= __WEBPACK_IMPORTED_MODULE_8__angular_cdk_keycodes__["a" /* A */] && keyCode <= __WEBPACK_IMPORTED_MODULE_8__angular_cdk_keycodes__["i" /* Z */]) || (keyCode >= __WEBPACK_IMPORTED_MODULE_8__angular_cdk_keycodes__["j" /* ZERO */] && keyCode <= __WEBPACK_IMPORTED_MODULE_8__angular_cdk_keycodes__["e" /* NINE */])) {
                    this._letterKeyStream.next(String.fromCharCode(keyCode));
                }
                // Note that we return here, in order to avoid preventing
                // the default action of non-navigational keys.
                return;
        }
        this._pressedLetters = [];
        event.preventDefault();
    };
    Object.defineProperty(ListKeyManager.prototype, "activeItemIndex", {
        /** Index of the currently active item. */
        get: /**
         * Index of the currently active item.
         * @return {?}
         */
        function () {
            return this._activeItemIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListKeyManager.prototype, "activeItem", {
        /** The active item. */
        get: /**
         * The active item.
         * @return {?}
         */
        function () {
            return this._activeItem;
        },
        enumerable: true,
        configurable: true
    });
    /** Sets the active item to the first enabled item in the list. */
    /**
     * Sets the active item to the first enabled item in the list.
     * @return {?}
     */
    ListKeyManager.prototype.setFirstItemActive = /**
     * Sets the active item to the first enabled item in the list.
     * @return {?}
     */
    function () {
        this._setActiveItemByIndex(0, 1);
    };
    /** Sets the active item to the last enabled item in the list. */
    /**
     * Sets the active item to the last enabled item in the list.
     * @return {?}
     */
    ListKeyManager.prototype.setLastItemActive = /**
     * Sets the active item to the last enabled item in the list.
     * @return {?}
     */
    function () {
        this._setActiveItemByIndex(this._items.length - 1, -1);
    };
    /** Sets the active item to the next enabled item in the list. */
    /**
     * Sets the active item to the next enabled item in the list.
     * @return {?}
     */
    ListKeyManager.prototype.setNextItemActive = /**
     * Sets the active item to the next enabled item in the list.
     * @return {?}
     */
    function () {
        this._activeItemIndex < 0 ? this.setFirstItemActive() : this._setActiveItemByDelta(1);
    };
    /** Sets the active item to a previous enabled item in the list. */
    /**
     * Sets the active item to a previous enabled item in the list.
     * @return {?}
     */
    ListKeyManager.prototype.setPreviousItemActive = /**
     * Sets the active item to a previous enabled item in the list.
     * @return {?}
     */
    function () {
        this._activeItemIndex < 0 && this._wrap ? this.setLastItemActive()
            : this._setActiveItemByDelta(-1);
    };
    /**
     * Allows setting of the activeItemIndex without any other effects.
     * @param index The new activeItemIndex.
     */
    /**
     * Allows setting of the activeItemIndex without any other effects.
     * @param {?} index The new activeItemIndex.
     * @return {?}
     */
    ListKeyManager.prototype.updateActiveItemIndex = /**
     * Allows setting of the activeItemIndex without any other effects.
     * @param {?} index The new activeItemIndex.
     * @return {?}
     */
    function (index) {
        this._activeItemIndex = index;
    };
    /**
     * This method sets the active item, given a list of items and the delta between the
     * currently active item and the new active item. It will calculate differently
     * depending on whether wrap mode is turned on.
     * @param {?} delta
     * @param {?=} items
     * @return {?}
     */
    ListKeyManager.prototype._setActiveItemByDelta = /**
     * This method sets the active item, given a list of items and the delta between the
     * currently active item and the new active item. It will calculate differently
     * depending on whether wrap mode is turned on.
     * @param {?} delta
     * @param {?=} items
     * @return {?}
     */
    function (delta, items) {
        if (items === void 0) { items = this._items.toArray(); }
        this._wrap ? this._setActiveInWrapMode(delta, items)
            : this._setActiveInDefaultMode(delta, items);
    };
    /**
     * Sets the active item properly given "wrap" mode. In other words, it will continue to move
     * down the list until it finds an item that is not disabled, and it will wrap if it
     * encounters either end of the list.
     * @param {?} delta
     * @param {?} items
     * @return {?}
     */
    ListKeyManager.prototype._setActiveInWrapMode = /**
     * Sets the active item properly given "wrap" mode. In other words, it will continue to move
     * down the list until it finds an item that is not disabled, and it will wrap if it
     * encounters either end of the list.
     * @param {?} delta
     * @param {?} items
     * @return {?}
     */
    function (delta, items) {
        for (var /** @type {?} */ i = 1; i <= items.length; i++) {
            var /** @type {?} */ index = (this._activeItemIndex + (delta * i) + items.length) % items.length;
            var /** @type {?} */ item = items[index];
            if (!this._skipPredicateFn(item)) {
                this.setActiveItem(index);
                return;
            }
        }
    };
    /**
     * Sets the active item properly given the default mode. In other words, it will
     * continue to move down the list until it finds an item that is not disabled. If
     * it encounters either end of the list, it will stop and not wrap.
     * @param {?} delta
     * @param {?} items
     * @return {?}
     */
    ListKeyManager.prototype._setActiveInDefaultMode = /**
     * Sets the active item properly given the default mode. In other words, it will
     * continue to move down the list until it finds an item that is not disabled. If
     * it encounters either end of the list, it will stop and not wrap.
     * @param {?} delta
     * @param {?} items
     * @return {?}
     */
    function (delta, items) {
        this._setActiveItemByIndex(this._activeItemIndex + delta, delta, items);
    };
    /**
     * Sets the active item to the first enabled item starting at the index specified. If the
     * item is disabled, it will move in the fallbackDelta direction until it either
     * finds an enabled item or encounters the end of the list.
     * @param {?} index
     * @param {?} fallbackDelta
     * @param {?=} items
     * @return {?}
     */
    ListKeyManager.prototype._setActiveItemByIndex = /**
     * Sets the active item to the first enabled item starting at the index specified. If the
     * item is disabled, it will move in the fallbackDelta direction until it either
     * finds an enabled item or encounters the end of the list.
     * @param {?} index
     * @param {?} fallbackDelta
     * @param {?=} items
     * @return {?}
     */
    function (index, fallbackDelta, items) {
        if (items === void 0) { items = this._items.toArray(); }
        if (!items[index]) {
            return;
        }
        while (this._skipPredicateFn(items[index])) {
            index += fallbackDelta;
            if (!items[index]) {
                return;
            }
        }
        this.setActiveItem(index);
    };
    return ListKeyManager;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * This is the interface for highlightable items (used by the ActiveDescendantKeyManager).
 * Each item must know how to style itself as active or inactive and whether or not it is
 * currently disabled.
 * @record
 */

var ActiveDescendantKeyManager = /** @class */ (function (_super) {
    Object(__WEBPACK_IMPORTED_MODULE_5_tslib__["b" /* __extends */])(ActiveDescendantKeyManager, _super);
    function ActiveDescendantKeyManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * This method sets the active item to the item at the specified index.
     * It also adds active styles to the newly active item and removes active
     * styles from the previously active item.
     */
    /**
     * This method sets the active item to the item at the specified index.
     * It also adds active styles to the newly active item and removes active
     * styles from the previously active item.
     * @param {?} index
     * @return {?}
     */
    ActiveDescendantKeyManager.prototype.setActiveItem = /**
     * This method sets the active item to the item at the specified index.
     * It also adds active styles to the newly active item and removes active
     * styles from the previously active item.
     * @param {?} index
     * @return {?}
     */
    function (index) {
        if (this.activeItem) {
            this.activeItem.setInactiveStyles();
        }
        _super.prototype.setActiveItem.call(this, index);
        if (this.activeItem) {
            this.activeItem.setActiveStyles();
        }
    };
    return ActiveDescendantKeyManager;
}(ListKeyManager));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * This is the interface for focusable items (used by the FocusKeyManager).
 * Each item must know how to focus itself, whether or not it is currently disabled
 * and be able to supply it's label.
 * @record
 */

var FocusKeyManager = /** @class */ (function (_super) {
    Object(__WEBPACK_IMPORTED_MODULE_5_tslib__["b" /* __extends */])(FocusKeyManager, _super);
    function FocusKeyManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._origin = 'program';
        return _this;
    }
    /**
     * Sets the focus origin that will be passed in to the items for any subsequent `focus` calls.
     * @param origin Focus origin to be used when focusing items.
     */
    /**
     * Sets the focus origin that will be passed in to the items for any subsequent `focus` calls.
     * @param {?} origin Focus origin to be used when focusing items.
     * @return {?}
     */
    FocusKeyManager.prototype.setFocusOrigin = /**
     * Sets the focus origin that will be passed in to the items for any subsequent `focus` calls.
     * @param {?} origin Focus origin to be used when focusing items.
     * @return {?}
     */
    function (origin) {
        this._origin = origin;
        return this;
    };
    /**
     * This method sets the active item to the item at the specified index.
     * It also adds focuses the newly active item.
     */
    /**
     * This method sets the active item to the item at the specified index.
     * It also adds focuses the newly active item.
     * @param {?} index
     * @return {?}
     */
    FocusKeyManager.prototype.setActiveItem = /**
     * This method sets the active item to the item at the specified index.
     * It also adds focuses the newly active item.
     * @param {?} index
     * @return {?}
     */
    function (index) {
        _super.prototype.setActiveItem.call(this, index);
        if (this.activeItem) {
            this.activeItem.focus(this._origin);
        }
    };
    return FocusKeyManager;
}(ListKeyManager));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var LIVE_ANNOUNCER_ELEMENT_TOKEN = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["InjectionToken"]('liveAnnouncerElement');
var LiveAnnouncer = /** @class */ (function () {
    function LiveAnnouncer(elementToken, _document) {
        this._document = _document;
        // We inject the live element as `any` because the constructor signature cannot reference
        // browser globals (HTMLElement) on non-browser environments, since having a class decorator
        // causes TypeScript to preserve the constructor signature types.
        this._liveElement = elementToken || this._createLiveElement();
    }
    /**
     * Announces a message to screenreaders.
     * @param message Message to be announced to the screenreader
     * @param politeness The politeness of the announcer element
     * @returns Promise that will be resolved when the message is added to the DOM.
     */
    /**
     * Announces a message to screenreaders.
     * @param {?} message Message to be announced to the screenreader
     * @param {?=} politeness The politeness of the announcer element
     * @return {?} Promise that will be resolved when the message is added to the DOM.
     */
    LiveAnnouncer.prototype.announce = /**
     * Announces a message to screenreaders.
     * @param {?} message Message to be announced to the screenreader
     * @param {?=} politeness The politeness of the announcer element
     * @return {?} Promise that will be resolved when the message is added to the DOM.
     */
    function (message, politeness) {
        var _this = this;
        if (politeness === void 0) { politeness = 'polite'; }
        this._liveElement.textContent = '';
        // TODO: ensure changing the politeness works on all environments we support.
        this._liveElement.setAttribute('aria-live', politeness);
        // This 100ms timeout is necessary for some browser + screen-reader combinations:
        // - Both JAWS and NVDA over IE11 will not announce anything without a non-zero timeout.
        // - With Chrome and IE11 with NVDA or JAWS, a repeated (identical) message won't be read a
        //   second time without clearing and then using a non-zero delay.
        // (using JAWS 17 at time of this writing).
        return new Promise(function (resolve) {
            setTimeout(function () {
                _this._liveElement.textContent = message;
                resolve();
            }, 100);
        });
    };
    /**
     * @return {?}
     */
    LiveAnnouncer.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this._liveElement && this._liveElement.parentNode) {
            this._liveElement.parentNode.removeChild(this._liveElement);
        }
    };
    /**
     * @return {?}
     */
    LiveAnnouncer.prototype._createLiveElement = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ liveEl = this._document.createElement('div');
        liveEl.classList.add('cdk-visually-hidden');
        liveEl.setAttribute('aria-atomic', 'true');
        liveEl.setAttribute('aria-live', 'polite');
        this._document.body.appendChild(liveEl);
        return liveEl;
    };
    LiveAnnouncer.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    LiveAnnouncer.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [LIVE_ANNOUNCER_ELEMENT_TOKEN,] },] },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_4__angular_common__["DOCUMENT"],] },] },
    ]; };
    return LiveAnnouncer;
}());
/**
 * \@docs-private
 * @param {?} parentDispatcher
 * @param {?} liveElement
 * @param {?} _document
 * @return {?}
 */
function LIVE_ANNOUNCER_PROVIDER_FACTORY(parentDispatcher, liveElement, _document) {
    return parentDispatcher || new LiveAnnouncer(liveElement, _document);
}
/**
 * \@docs-private
 */
var LIVE_ANNOUNCER_PROVIDER = {
    // If there is already a LiveAnnouncer available, use that. Otherwise, provide a new one.
    provide: LiveAnnouncer,
    deps: [
        [new __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"](), new __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"](), LiveAnnouncer],
        [new __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"](), new __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"](LIVE_ANNOUNCER_ELEMENT_TOKEN)],
        __WEBPACK_IMPORTED_MODULE_4__angular_common__["DOCUMENT"],
    ],
    useFactory: LIVE_ANNOUNCER_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// This is the value used by AngularJS Material. Through trial and error (on iPhone 6S) they found
// that a value of around 650ms seems appropriate.
var TOUCH_BUFFER_MS = 650;
/**
 * Monitors mouse and keyboard events to determine the cause of focus events.
 */
var FocusMonitor = /** @class */ (function () {
    function FocusMonitor(_ngZone, _platform) {
        this._ngZone = _ngZone;
        this._platform = _platform;
        /**
         * The focus origin that the next focus event is a result of.
         */
        this._origin = null;
        /**
         * Whether the window has just been focused.
         */
        this._windowFocused = false;
        /**
         * Map of elements being monitored to their info.
         */
        this._elementInfo = new Map();
        /**
         * A map of global objects to lists of current listeners.
         */
        this._unregisterGlobalListeners = function () { };
        /**
         * The number of elements currently being monitored.
         */
        this._monitoredElementCount = 0;
    }
    /**
     * @param {?} element
     * @param {?=} renderer
     * @param {?=} checkChildren
     * @return {?}
     */
    FocusMonitor.prototype.monitor = /**
     * @param {?} element
     * @param {?=} renderer
     * @param {?=} checkChildren
     * @return {?}
     */
    function (element, renderer, checkChildren) {
        var _this = this;
        // TODO(mmalerba): clean up after deprecated signature is removed.
        if (!(renderer instanceof __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer2"])) {
            checkChildren = renderer;
        }
        checkChildren = !!checkChildren;
        // Do nothing if we're not on the browser platform.
        if (!this._platform.isBrowser) {
            return Object(__WEBPACK_IMPORTED_MODULE_13_rxjs_observable_of__["a" /* of */])(null);
        }
        // Check if we're already monitoring this element.
        if (this._elementInfo.has(element)) {
            var /** @type {?} */ cachedInfo = this._elementInfo.get(element); /** @type {?} */
            ((cachedInfo)).checkChildren = checkChildren;
            return /** @type {?} */ ((cachedInfo)).subject.asObservable();
        }
        // Create monitored element info.
        var /** @type {?} */ info = {
            unlisten: function () { },
            checkChildren: checkChildren,
            subject: new __WEBPACK_IMPORTED_MODULE_6_rxjs_Subject__["Subject"]()
        };
        this._elementInfo.set(element, info);
        this._incrementMonitoredElementCount();
        // Start listening. We need to listen in capture phase since focus events don't bubble.
        var /** @type {?} */ focusListener = function (event) { return _this._onFocus(event, element); };
        var /** @type {?} */ blurListener = function (event) { return _this._onBlur(event, element); };
        this._ngZone.runOutsideAngular(function () {
            element.addEventListener('focus', focusListener, true);
            element.addEventListener('blur', blurListener, true);
        });
        // Create an unlisten function for later.
        info.unlisten = function () {
            element.removeEventListener('focus', focusListener, true);
            element.removeEventListener('blur', blurListener, true);
        };
        return info.subject.asObservable();
    };
    /**
     * Stops monitoring an element and removes all focus classes.
     * @param element The element to stop monitoring.
     */
    /**
     * Stops monitoring an element and removes all focus classes.
     * @param {?} element The element to stop monitoring.
     * @return {?}
     */
    FocusMonitor.prototype.stopMonitoring = /**
     * Stops monitoring an element and removes all focus classes.
     * @param {?} element The element to stop monitoring.
     * @return {?}
     */
    function (element) {
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (elementInfo) {
            elementInfo.unlisten();
            elementInfo.subject.complete();
            this._setClasses(element);
            this._elementInfo.delete(element);
            this._decrementMonitoredElementCount();
        }
    };
    /**
     * Focuses the element via the specified focus origin.
     * @param element The element to focus.
     * @param origin The focus origin.
     */
    /**
     * Focuses the element via the specified focus origin.
     * @param {?} element The element to focus.
     * @param {?} origin The focus origin.
     * @return {?}
     */
    FocusMonitor.prototype.focusVia = /**
     * Focuses the element via the specified focus origin.
     * @param {?} element The element to focus.
     * @param {?} origin The focus origin.
     * @return {?}
     */
    function (element, origin) {
        this._setOriginForCurrentEventQueue(origin);
        element.focus();
    };
    /**
     * @return {?}
     */
    FocusMonitor.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._elementInfo.forEach(function (_info, element) { return _this.stopMonitoring(element); });
    };
    /**
     * Register necessary event listeners on the document and window.
     * @return {?}
     */
    FocusMonitor.prototype._registerGlobalListeners = /**
     * Register necessary event listeners on the document and window.
     * @return {?}
     */
    function () {
        var _this = this;
        // Do nothing if we're not on the browser platform.
        if (!this._platform.isBrowser) {
            return;
        }
        // On keydown record the origin and clear any touch event that may be in progress.
        var /** @type {?} */ documentKeydownListener = function () {
            _this._lastTouchTarget = null;
            _this._setOriginForCurrentEventQueue('keyboard');
        };
        // On mousedown record the origin only if there is not touch target, since a mousedown can
        // happen as a result of a touch event.
        var /** @type {?} */ documentMousedownListener = function () {
            if (!_this._lastTouchTarget) {
                _this._setOriginForCurrentEventQueue('mouse');
            }
        };
        // When the touchstart event fires the focus event is not yet in the event queue. This means
        // we can't rely on the trick used above (setting timeout of 0ms). Instead we wait 650ms to
        // see if a focus happens.
        var /** @type {?} */ documentTouchstartListener = function (event) {
            if (_this._touchTimeoutId != null) {
                clearTimeout(_this._touchTimeoutId);
            }
            _this._lastTouchTarget = event.target;
            _this._touchTimeoutId = setTimeout(function () { return _this._lastTouchTarget = null; }, TOUCH_BUFFER_MS);
        };
        // Make a note of when the window regains focus, so we can restore the origin info for the
        // focused element.
        var /** @type {?} */ windowFocusListener = function () {
            _this._windowFocused = true;
            _this._windowFocusTimeoutId = setTimeout(function () { return _this._windowFocused = false; }, 0);
        };
        // Note: we listen to events in the capture phase so we can detect them even if the user stops
        // propagation.
        this._ngZone.runOutsideAngular(function () {
            document.addEventListener('keydown', documentKeydownListener, true);
            document.addEventListener('mousedown', documentMousedownListener, true);
            document.addEventListener('touchstart', documentTouchstartListener, Object(__WEBPACK_IMPORTED_MODULE_3__angular_cdk_platform__["c" /* supportsPassiveEventListeners */])() ? (/** @type {?} */ ({ passive: true, capture: true })) : true);
            window.addEventListener('focus', windowFocusListener);
        });
        this._unregisterGlobalListeners = function () {
            document.removeEventListener('keydown', documentKeydownListener, true);
            document.removeEventListener('mousedown', documentMousedownListener, true);
            document.removeEventListener('touchstart', documentTouchstartListener, Object(__WEBPACK_IMPORTED_MODULE_3__angular_cdk_platform__["c" /* supportsPassiveEventListeners */])() ? (/** @type {?} */ ({ passive: true, capture: true })) : true);
            window.removeEventListener('focus', windowFocusListener);
            // Clear timeouts for all potentially pending timeouts to prevent the leaks.
            clearTimeout(_this._windowFocusTimeoutId);
            clearTimeout(_this._touchTimeoutId);
            clearTimeout(_this._originTimeoutId);
        };
    };
    /**
     * @param {?} element
     * @param {?} className
     * @param {?} shouldSet
     * @return {?}
     */
    FocusMonitor.prototype._toggleClass = /**
     * @param {?} element
     * @param {?} className
     * @param {?} shouldSet
     * @return {?}
     */
    function (element, className, shouldSet) {
        if (shouldSet) {
            element.classList.add(className);
        }
        else {
            element.classList.remove(className);
        }
    };
    /**
     * Sets the focus classes on the element based on the given focus origin.
     * @param {?} element The element to update the classes on.
     * @param {?=} origin The focus origin.
     * @return {?}
     */
    FocusMonitor.prototype._setClasses = /**
     * Sets the focus classes on the element based on the given focus origin.
     * @param {?} element The element to update the classes on.
     * @param {?=} origin The focus origin.
     * @return {?}
     */
    function (element, origin) {
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (elementInfo) {
            this._toggleClass(element, 'cdk-focused', !!origin);
            this._toggleClass(element, 'cdk-touch-focused', origin === 'touch');
            this._toggleClass(element, 'cdk-keyboard-focused', origin === 'keyboard');
            this._toggleClass(element, 'cdk-mouse-focused', origin === 'mouse');
            this._toggleClass(element, 'cdk-program-focused', origin === 'program');
        }
    };
    /**
     * Sets the origin and schedules an async function to clear it at the end of the event queue.
     * @param {?} origin The origin to set.
     * @return {?}
     */
    FocusMonitor.prototype._setOriginForCurrentEventQueue = /**
     * Sets the origin and schedules an async function to clear it at the end of the event queue.
     * @param {?} origin The origin to set.
     * @return {?}
     */
    function (origin) {
        var _this = this;
        this._origin = origin;
        this._originTimeoutId = setTimeout(function () { return _this._origin = null; }, 0);
    };
    /**
     * Checks whether the given focus event was caused by a touchstart event.
     * @param {?} event The focus event to check.
     * @return {?} Whether the event was caused by a touch.
     */
    FocusMonitor.prototype._wasCausedByTouch = /**
     * Checks whether the given focus event was caused by a touchstart event.
     * @param {?} event The focus event to check.
     * @return {?} Whether the event was caused by a touch.
     */
    function (event) {
        // Note(mmalerba): This implementation is not quite perfect, there is a small edge case.
        // Consider the following dom structure:
        //
        // <div #parent tabindex="0" cdkFocusClasses>
        //   <div #child (click)="#parent.focus()"></div>
        // </div>
        //
        // If the user touches the #child element and the #parent is programmatically focused as a
        // result, this code will still consider it to have been caused by the touch event and will
        // apply the cdk-touch-focused class rather than the cdk-program-focused class. This is a
        // relatively small edge-case that can be worked around by using
        // focusVia(parentEl, 'program') to focus the parent element.
        //
        // If we decide that we absolutely must handle this case correctly, we can do so by listening
        // for the first focus event after the touchstart, and then the first blur event after that
        // focus event. When that blur event fires we know that whatever follows is not a result of the
        // touchstart.
        var /** @type {?} */ focusTarget = event.target;
        return this._lastTouchTarget instanceof Node && focusTarget instanceof Node &&
            (focusTarget === this._lastTouchTarget || focusTarget.contains(this._lastTouchTarget));
    };
    /**
     * Handles focus events on a registered element.
     * @param {?} event The focus event.
     * @param {?} element The monitored element.
     * @return {?}
     */
    FocusMonitor.prototype._onFocus = /**
     * Handles focus events on a registered element.
     * @param {?} event The focus event.
     * @param {?} element The monitored element.
     * @return {?}
     */
    function (event, element) {
        // NOTE(mmalerba): We currently set the classes based on the focus origin of the most recent
        // focus event affecting the monitored element. If we want to use the origin of the first event
        // instead we should check for the cdk-focused class here and return if the element already has
        // it. (This only matters for elements that have includesChildren = true).
        // If we are not counting child-element-focus as focused, make sure that the event target is the
        // monitored element itself.
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (!elementInfo || (!elementInfo.checkChildren && element !== event.target)) {
            return;
        }
        // If we couldn't detect a cause for the focus event, it's due to one of three reasons:
        // 1) The window has just regained focus, in which case we want to restore the focused state of
        //    the element from before the window blurred.
        // 2) It was caused by a touch event, in which case we mark the origin as 'touch'.
        // 3) The element was programmatically focused, in which case we should mark the origin as
        //    'program'.
        if (!this._origin) {
            if (this._windowFocused && this._lastFocusOrigin) {
                this._origin = this._lastFocusOrigin;
            }
            else if (this._wasCausedByTouch(event)) {
                this._origin = 'touch';
            }
            else {
                this._origin = 'program';
            }
        }
        this._setClasses(element, this._origin);
        elementInfo.subject.next(this._origin);
        this._lastFocusOrigin = this._origin;
        this._origin = null;
    };
    /**
     * Handles blur events on a registered element.
     * @param event The blur event.
     * @param element The monitored element.
     */
    /**
     * Handles blur events on a registered element.
     * @param {?} event The blur event.
     * @param {?} element The monitored element.
     * @return {?}
     */
    FocusMonitor.prototype._onBlur = /**
     * Handles blur events on a registered element.
     * @param {?} event The blur event.
     * @param {?} element The monitored element.
     * @return {?}
     */
    function (event, element) {
        // If we are counting child-element-focus as focused, make sure that we aren't just blurring in
        // order to focus another child of the monitored element.
        var /** @type {?} */ elementInfo = this._elementInfo.get(element);
        if (!elementInfo || (elementInfo.checkChildren && event.relatedTarget instanceof Node &&
            element.contains(event.relatedTarget))) {
            return;
        }
        this._setClasses(element);
        elementInfo.subject.next(null);
    };
    /**
     * @return {?}
     */
    FocusMonitor.prototype._incrementMonitoredElementCount = /**
     * @return {?}
     */
    function () {
        // Register global listeners when first element is monitored.
        if (++this._monitoredElementCount == 1) {
            this._registerGlobalListeners();
        }
    };
    /**
     * @return {?}
     */
    FocusMonitor.prototype._decrementMonitoredElementCount = /**
     * @return {?}
     */
    function () {
        // Unregister global listeners when last element is unmonitored.
        if (!--this._monitoredElementCount) {
            this._unregisterGlobalListeners();
            this._unregisterGlobalListeners = function () { };
        }
    };
    FocusMonitor.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    FocusMonitor.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], },
        { type: __WEBPACK_IMPORTED_MODULE_3__angular_cdk_platform__["a" /* Platform */], },
    ]; };
    return FocusMonitor;
}());
/**
 * Directive that determines how a particular element was focused (via keyboard, mouse, touch, or
 * programmatically) and adds corresponding classes to the element.
 *
 * There are two variants of this directive:
 * 1) cdkMonitorElementFocus: does not consider an element to be focused if one of its children is
 *    focused.
 * 2) cdkMonitorSubtreeFocus: considers an element focused if it or any of its children are focused.
 */
var CdkMonitorFocus = /** @class */ (function () {
    function CdkMonitorFocus(_elementRef, _focusMonitor) {
        var _this = this;
        this._elementRef = _elementRef;
        this._focusMonitor = _focusMonitor;
        this.cdkFocusChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this._monitorSubscription = this._focusMonitor.monitor(this._elementRef.nativeElement, this._elementRef.nativeElement.hasAttribute('cdkMonitorSubtreeFocus'))
            .subscribe(function (origin) { return _this.cdkFocusChange.emit(origin); });
    }
    /**
     * @return {?}
     */
    CdkMonitorFocus.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
        this._monitorSubscription.unsubscribe();
    };
    CdkMonitorFocus.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]',
                },] },
    ];
    /** @nocollapse */
    CdkMonitorFocus.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
        { type: FocusMonitor, },
    ]; };
    CdkMonitorFocus.propDecorators = {
        "cdkFocusChange": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
    };
    return CdkMonitorFocus;
}());
/**
 * \@docs-private
 * @param {?} parentDispatcher
 * @param {?} ngZone
 * @param {?} platform
 * @return {?}
 */
function FOCUS_MONITOR_PROVIDER_FACTORY(parentDispatcher, ngZone, platform) {
    return parentDispatcher || new FocusMonitor(ngZone, platform);
}
/**
 * \@docs-private
 */
var FOCUS_MONITOR_PROVIDER = {
    // If there is already a FocusMonitor available, use that. Otherwise, provide a new one.
    provide: FocusMonitor,
    deps: [[new __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"](), new __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"](), FocusMonitor], __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], __WEBPACK_IMPORTED_MODULE_3__angular_cdk_platform__["a" /* Platform */]],
    useFactory: FOCUS_MONITOR_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Screenreaders will often fire fake mousedown events when a focusable element
 * is activated using the keyboard. We can typically distinguish between these faked
 * mousedown events and real mousedown events using the "buttons" property. While
 * real mousedowns will indicate the mouse button that was pressed (e.g. "1" for
 * the left mouse button), faked mousedowns will usually set the property value to 0.
 * @param {?} event
 * @return {?}
 */
function isFakeMousedownFromScreenReader(event) {
    return event.buttons === 0;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var A11yModule = /** @class */ (function () {
    function A11yModule() {
    }
    A11yModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    imports: [__WEBPACK_IMPORTED_MODULE_4__angular_common__["CommonModule"], __WEBPACK_IMPORTED_MODULE_3__angular_cdk_platform__["b" /* PlatformModule */]],
                    declarations: [CdkTrapFocus, FocusTrapDeprecatedDirective, CdkMonitorFocus],
                    exports: [CdkTrapFocus, FocusTrapDeprecatedDirective, CdkMonitorFocus],
                    providers: [
                        InteractivityChecker,
                        FocusTrapFactory,
                        AriaDescriber,
                        LIVE_ANNOUNCER_PROVIDER,
                        ARIA_DESCRIBER_PROVIDER,
                        FOCUS_MONITOR_PROVIDER,
                    ]
                },] },
    ];
    /** @nocollapse */
    A11yModule.ctorParameters = function () { return []; };
    return A11yModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=a11y.es5.js.map


/***/ }),

/***/ "../../../cdk/esm5/bidi.es5.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Directionality; });
/* unused harmony export DIR_DOCUMENT */
/* unused harmony export Dir */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BidiModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */



/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Injection token used to inject the document into Directionality.
 * This is used so that the value can be faked in tests.
 *
 * We can't use the real document in tests because changing the real `dir` causes geometry-based
 * tests in Safari to fail.
 *
 * We also can't re-provide the DOCUMENT token from platform-brower because the unit tests
 * themselves use things like `querySelector` in test code.
 */
var DIR_DOCUMENT = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["InjectionToken"]('cdk-dir-doc');
/**
 * The directionality (LTR / RTL) context for the application (or a subtree of it).
 * Exposes the current direction and a stream of direction changes.
 */
var Directionality = /** @class */ (function () {
    function Directionality(_document) {
        /**
         * The current 'ltr' or 'rtl' value.
         */
        this.value = 'ltr';
        /**
         * Stream that emits whenever the 'ltr' / 'rtl' state changes.
         */
        this.change = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        if (_document) {
            // TODO: handle 'auto' value -
            // We still need to account for dir="auto".
            // It looks like HTMLElemenet.dir is also "auto" when that's set to the attribute,
            // but getComputedStyle return either "ltr" or "rtl". avoiding getComputedStyle for now
            var /** @type {?} */ bodyDir = _document.body ? _document.body.dir : null;
            var /** @type {?} */ htmlDir = _document.documentElement ? _document.documentElement.dir : null;
            this.value = /** @type {?} */ ((bodyDir || htmlDir || 'ltr'));
        }
    }
    Directionality.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    Directionality.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] }, { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [DIR_DOCUMENT,] },] },
    ]; };
    return Directionality;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Directive to listen for changes of direction of part of the DOM.
 *
 * Provides itself as Directionality such that descendant directives only need to ever inject
 * Directionality to get the closest direction.
 */
var Dir = /** @class */ (function () {
    function Dir() {
        this._dir = 'ltr';
        /**
         * Whether the `value` has been set to its initial value.
         */
        this._isInitialized = false;
        /**
         * Event emitted when the direction changes.
         */
        this.change = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    Object.defineProperty(Dir.prototype, "dir", {
        get: /**
         * \@docs-private
         * @return {?}
         */
        function () { return this._dir; },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            var /** @type {?} */ old = this._dir;
            this._dir = v;
            if (old !== this._dir && this._isInitialized) {
                this.change.emit(this._dir);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dir.prototype, "value", {
        /** Current layout direction of the element. */
        get: /**
         * Current layout direction of the element.
         * @return {?}
         */
        function () { return this.dir; },
        enumerable: true,
        configurable: true
    });
    /** Initialize once default value has been set. */
    /**
     * Initialize once default value has been set.
     * @return {?}
     */
    Dir.prototype.ngAfterContentInit = /**
     * Initialize once default value has been set.
     * @return {?}
     */
    function () {
        this._isInitialized = true;
    };
    /**
     * @return {?}
     */
    Dir.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.change.complete();
    };
    Dir.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[dir]',
                    providers: [{ provide: Directionality, useExisting: Dir }],
                    host: { '[dir]': 'dir' },
                    exportAs: 'dir',
                },] },
    ];
    /** @nocollapse */
    Dir.ctorParameters = function () { return []; };
    Dir.propDecorators = {
        "change": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"], args: ['dirChange',] },],
        "dir": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"] },],
    };
    return Dir;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var BidiModule = /** @class */ (function () {
    function BidiModule() {
    }
    BidiModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    exports: [Dir],
                    declarations: [Dir],
                    providers: [
                        { provide: DIR_DOCUMENT, useExisting: __WEBPACK_IMPORTED_MODULE_1__angular_common__["DOCUMENT"] },
                        Directionality,
                    ]
                },] },
    ];
    /** @nocollapse */
    BidiModule.ctorParameters = function () { return []; };
    return BidiModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=bidi.es5.js.map


/***/ }),

/***/ "../../../cdk/esm5/coercion.es5.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return coerceBooleanProperty; });
/* unused harmony export coerceNumberProperty */
/* unused harmony export _isNumberValue */
/* unused harmony export coerceArray */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Coerces a data-bound value (typically a string) to a boolean.
 * @param {?} value
 * @return {?}
 */
function coerceBooleanProperty(value) {
    return value != null && "" + value !== 'false';
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @param {?} value
 * @param {?=} fallbackValue
 * @return {?}
 */
function coerceNumberProperty(value, fallbackValue) {
    if (fallbackValue === void 0) { fallbackValue = 0; }
    return _isNumberValue(value) ? Number(value) : fallbackValue;
}
/**
 * Whether the provided value is considered a number.
 * \@docs-private
 * @param {?} value
 * @return {?}
 */
function _isNumberValue(value) {
    // parseFloat(value) handles most of the cases we're interested in (it treats null, empty string,
    // and other non-number values as NaN, where Number just uses 0) but it considers the string
    // '123hello' to be a valid number. Therefore we also check if Number(value) is NaN.
    return !isNaN(parseFloat(/** @type {?} */ (value))) && !isNaN(Number(value));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Wraps the provided value in an array, unless the provided value is an array.
 * @template T
 * @param {?} value
 * @return {?}
 */
function coerceArray(value) {
    return Array.isArray(value) ? value : [value];
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=coercion.es5.js.map


/***/ }),

/***/ "../../../cdk/esm5/keycodes.es5.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return UP_ARROW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DOWN_ARROW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return RIGHT_ARROW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return LEFT_ARROW; });
/* unused harmony export PAGE_UP */
/* unused harmony export PAGE_DOWN */
/* unused harmony export HOME */
/* unused harmony export END */
/* unused harmony export ENTER */
/* unused harmony export SPACE */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return TAB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ESCAPE; });
/* unused harmony export BACKSPACE */
/* unused harmony export DELETE */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return A; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return Z; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return ZERO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return NINE; });
/* unused harmony export COMMA */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var UP_ARROW = 38;
var DOWN_ARROW = 40;
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var PAGE_UP = 33;
var PAGE_DOWN = 34;
var HOME = 36;
var END = 35;
var ENTER = 13;
var SPACE = 32;
var TAB = 9;
var ESCAPE = 27;
var BACKSPACE = 8;
var DELETE = 46;
var A = 65;
var Z = 90;
var ZERO = 48;
var NINE = 57;
var COMMA = 188;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=keycodes.es5.js.map


/***/ }),

/***/ "../../../cdk/esm5/overlay.es5.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Overlay; });
/* unused harmony export OverlayContainer */
/* unused harmony export CdkOverlayOrigin */
/* unused harmony export CdkConnectedOverlay */
/* unused harmony export FullscreenOverlayContainer */
/* unused harmony export OverlayRef */
/* unused harmony export OverlayKeyboardDispatcher */
/* unused harmony export OverlayPositionBuilder */
/* unused harmony export GlobalPositionStrategy */
/* unused harmony export ConnectedPositionStrategy */
/* unused harmony export ConnectedOverlayDirective */
/* unused harmony export OverlayOrigin */
/* unused harmony export OverlayConfig */
/* unused harmony export ConnectionPositionPair */
/* unused harmony export ScrollingVisibility */
/* unused harmony export ConnectedOverlayPositionChange */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ScrollStrategyOptions; });
/* unused harmony export RepositionScrollStrategy */
/* unused harmony export CloseScrollStrategy */
/* unused harmony export NoopScrollStrategy */
/* unused harmony export BlockScrollStrategy */
/* unused harmony export OVERLAY_PROVIDERS */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return OverlayModule; });
/* unused harmony export ɵg */
/* unused harmony export ɵf */
/* unused harmony export ɵb */
/* unused harmony export ɵa */
/* unused harmony export ɵc */
/* unused harmony export ɵe */
/* unused harmony export ɵd */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_cdk_scrolling__ = __webpack_require__("../../../cdk/esm5/scrolling.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_cdk_bidi__ = __webpack_require__("../../../cdk/esm5/bidi.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_cdk_portal__ = __webpack_require__("../../../cdk/esm5/portal.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_tslib__ = __webpack_require__("../../../../tslib/tslib.es6.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operators_take__ = __webpack_require__("../../../../rxjs/_esm5/operators/take.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_Subscription__ = __webpack_require__("../../../../rxjs/_esm5/Subscription.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_operators_filter__ = __webpack_require__("../../../../rxjs/_esm5/operators/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_observable_fromEvent__ = __webpack_require__("../../../../rxjs/_esm5/observable/fromEvent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_cdk_coercion__ = __webpack_require__("../../../cdk/esm5/coercion.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__angular_cdk_keycodes__ = __webpack_require__("../../../cdk/esm5/keycodes.es5.js");
/* unused harmony reexport ViewportRuler */
/* unused harmony reexport VIEWPORT_RULER_PROVIDER */
/* unused harmony reexport CdkScrollable */
/* unused harmony reexport ScrollDispatcher */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */















/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Scroll strategy that doesn't do anything.
 */
var NoopScrollStrategy = /** @class */ (function () {
    function NoopScrollStrategy() {
    }
    /** Does nothing, as this scroll strategy is a no-op. */
    /**
     * Does nothing, as this scroll strategy is a no-op.
     * @return {?}
     */
    NoopScrollStrategy.prototype.enable = /**
     * Does nothing, as this scroll strategy is a no-op.
     * @return {?}
     */
    function () { };
    /** Does nothing, as this scroll strategy is a no-op. */
    /**
     * Does nothing, as this scroll strategy is a no-op.
     * @return {?}
     */
    NoopScrollStrategy.prototype.disable = /**
     * Does nothing, as this scroll strategy is a no-op.
     * @return {?}
     */
    function () { };
    /** Does nothing, as this scroll strategy is a no-op. */
    /**
     * Does nothing, as this scroll strategy is a no-op.
     * @return {?}
     */
    NoopScrollStrategy.prototype.attach = /**
     * Does nothing, as this scroll strategy is a no-op.
     * @return {?}
     */
    function () { };
    return NoopScrollStrategy;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Initial configuration used when creating an overlay.
 */
var OverlayConfig = /** @class */ (function () {
    function OverlayConfig(config) {
        var _this = this;
        /**
         * Strategy to be used when handling scroll events while the overlay is open.
         */
        this.scrollStrategy = new NoopScrollStrategy();
        /**
         * Custom class to add to the overlay pane.
         */
        this.panelClass = '';
        /**
         * Whether the overlay has a backdrop.
         */
        this.hasBackdrop = false;
        /**
         * Custom class to add to the backdrop
         */
        this.backdropClass = 'cdk-overlay-dark-backdrop';
        /**
         * The direction of the text in the overlay panel.
         */
        this.direction = 'ltr';
        if (config) {
            Object.keys(config)
                .filter(function (key) { return typeof config[key] !== 'undefined'; })
                .forEach(function (key) { return _this[key] = config[key]; });
        }
    }
    return OverlayConfig;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * A connection point on the origin element.
 * @record
 */

/**
 * A connection point on the overlay element.
 * @record
 */

/**
 * The points of the origin element and the overlay element to connect.
 */
var ConnectionPositionPair = /** @class */ (function () {
    function ConnectionPositionPair(origin, overlay, offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.originX = origin.originX;
        this.originY = origin.originY;
        this.overlayX = overlay.overlayX;
        this.overlayY = overlay.overlayY;
    }
    return ConnectionPositionPair;
}());
/**
 * Set of properties regarding the position of the origin and overlay relative to the viewport
 * with respect to the containing Scrollable elements.
 *
 * The overlay and origin are clipped if any part of their bounding client rectangle exceeds the
 * bounds of any one of the strategy's Scrollable's bounding client rectangle.
 *
 * The overlay and origin are outside view if there is no overlap between their bounding client
 * rectangle and any one of the strategy's Scrollable's bounding client rectangle.
 *
 *       -----------                    -----------
 *       | outside |                    | clipped |
 *       |  view   |              --------------------------
 *       |         |              |     |         |        |
 *       ----------               |     -----------        |
 *  --------------------------    |                        |
 *  |                        |    |      Scrollable        |
 *  |                        |    |                        |
 *  |                        |     --------------------------
 *  |      Scrollable        |
 *  |                        |
 *  --------------------------
 *
 *  \@docs-private
 */
var ScrollingVisibility = /** @class */ (function () {
    function ScrollingVisibility() {
    }
    return ScrollingVisibility;
}());
/**
 * The change event emitted by the strategy when a fallback position is used.
 */
var ConnectedOverlayPositionChange = /** @class */ (function () {
    function ConnectedOverlayPositionChange(connectionPair, /** @docs-private */
        scrollableViewProperties) {
        this.connectionPair = connectionPair;
        this.scrollableViewProperties = scrollableViewProperties;
    }
    /** @nocollapse */
    ConnectedOverlayPositionChange.ctorParameters = function () { return [
        { type: ConnectionPositionPair, },
        { type: ScrollingVisibility, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] },] },
    ]; };
    return ConnectedOverlayPositionChange;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Describes a strategy that will be used by an overlay to handle scroll events while it is open.
 * @record
 */

/**
 * Returns an error to be thrown when attempting to attach an already-attached scroll strategy.
 * @return {?}
 */
function getMatScrollStrategyAlreadyAttachedError() {
    return Error("Scroll strategy has already been attached.");
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Config options for the CloseScrollStrategy.
 * @record
 */

/**
 * Strategy that will close the overlay as soon as the user starts scrolling.
 */
var CloseScrollStrategy = /** @class */ (function () {
    function CloseScrollStrategy(_scrollDispatcher, _ngZone, _viewportRuler, _config) {
        var _this = this;
        this._scrollDispatcher = _scrollDispatcher;
        this._ngZone = _ngZone;
        this._viewportRuler = _viewportRuler;
        this._config = _config;
        this._scrollSubscription = null;
        /**
         * Detaches the overlay ref and disables the scroll strategy.
         */
        this._detach = function () {
            _this.disable();
            if (_this._overlayRef.hasAttached()) {
                _this._ngZone.run(function () { return _this._overlayRef.detach(); });
            }
        };
    }
    /** Attaches this scroll strategy to an overlay. */
    /**
     * Attaches this scroll strategy to an overlay.
     * @param {?} overlayRef
     * @return {?}
     */
    CloseScrollStrategy.prototype.attach = /**
     * Attaches this scroll strategy to an overlay.
     * @param {?} overlayRef
     * @return {?}
     */
    function (overlayRef) {
        if (this._overlayRef) {
            throw getMatScrollStrategyAlreadyAttachedError();
        }
        this._overlayRef = overlayRef;
    };
    /** Enables the closing of the attached overlay on scroll. */
    /**
     * Enables the closing of the attached overlay on scroll.
     * @return {?}
     */
    CloseScrollStrategy.prototype.enable = /**
     * Enables the closing of the attached overlay on scroll.
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._scrollSubscription) {
            return;
        }
        var /** @type {?} */ stream = this._scrollDispatcher.scrolled(0);
        if (this._config && this._config.threshold && this._config.threshold > 1) {
            this._initialScrollPosition = this._viewportRuler.getViewportScrollPosition().top;
            this._scrollSubscription = stream.subscribe(function () {
                var /** @type {?} */ scrollPosition = _this._viewportRuler.getViewportScrollPosition().top;
                if (Math.abs(scrollPosition - _this._initialScrollPosition) > /** @type {?} */ ((/** @type {?} */ ((_this._config)).threshold))) {
                    _this._detach();
                }
                else {
                    _this._overlayRef.updatePosition();
                }
            });
        }
        else {
            this._scrollSubscription = stream.subscribe(this._detach);
        }
    };
    /** Disables the closing the attached overlay on scroll. */
    /**
     * Disables the closing the attached overlay on scroll.
     * @return {?}
     */
    CloseScrollStrategy.prototype.disable = /**
     * Disables the closing the attached overlay on scroll.
     * @return {?}
     */
    function () {
        if (this._scrollSubscription) {
            this._scrollSubscription.unsubscribe();
            this._scrollSubscription = null;
        }
    };
    return CloseScrollStrategy;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Strategy that will prevent the user from scrolling while the overlay is visible.
 */
var BlockScrollStrategy = /** @class */ (function () {
    function BlockScrollStrategy(_viewportRuler, document) {
        this._viewportRuler = _viewportRuler;
        this._previousHTMLStyles = { top: '', left: '' };
        this._isEnabled = false;
        this._document = document;
    }
    /** Attaches this scroll strategy to an overlay. */
    /**
     * Attaches this scroll strategy to an overlay.
     * @return {?}
     */
    BlockScrollStrategy.prototype.attach = /**
     * Attaches this scroll strategy to an overlay.
     * @return {?}
     */
    function () { };
    /** Blocks page-level scroll while the attached overlay is open. */
    /**
     * Blocks page-level scroll while the attached overlay is open.
     * @return {?}
     */
    BlockScrollStrategy.prototype.enable = /**
     * Blocks page-level scroll while the attached overlay is open.
     * @return {?}
     */
    function () {
        if (this._canBeEnabled()) {
            var /** @type {?} */ root = this._document.documentElement;
            this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition();
            // Cache the previous inline styles in case the user had set them.
            this._previousHTMLStyles.left = root.style.left || '';
            this._previousHTMLStyles.top = root.style.top || '';
            // Note: we're using the `html` node, instead of the `body`, because the `body` may
            // have the user agent margin, whereas the `html` is guaranteed not to have one.
            root.style.left = -this._previousScrollPosition.left + "px";
            root.style.top = -this._previousScrollPosition.top + "px";
            root.classList.add('cdk-global-scrollblock');
            this._isEnabled = true;
        }
    };
    /** Unblocks page-level scroll while the attached overlay is open. */
    /**
     * Unblocks page-level scroll while the attached overlay is open.
     * @return {?}
     */
    BlockScrollStrategy.prototype.disable = /**
     * Unblocks page-level scroll while the attached overlay is open.
     * @return {?}
     */
    function () {
        if (this._isEnabled) {
            var /** @type {?} */ html = this._document.documentElement;
            var /** @type {?} */ body = this._document.body;
            var /** @type {?} */ previousHtmlScrollBehavior = html.style['scrollBehavior'] || '';
            var /** @type {?} */ previousBodyScrollBehavior = body.style['scrollBehavior'] || '';
            this._isEnabled = false;
            html.style.left = this._previousHTMLStyles.left;
            html.style.top = this._previousHTMLStyles.top;
            html.classList.remove('cdk-global-scrollblock');
            // Disable user-defined smooth scrolling temporarily while we restore the scroll position.
            // See https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
            html.style['scrollBehavior'] = body.style['scrollBehavior'] = 'auto';
            window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top);
            html.style['scrollBehavior'] = previousHtmlScrollBehavior;
            body.style['scrollBehavior'] = previousBodyScrollBehavior;
        }
    };
    /**
     * @return {?}
     */
    BlockScrollStrategy.prototype._canBeEnabled = /**
     * @return {?}
     */
    function () {
        // Since the scroll strategies can't be singletons, we have to use a global CSS class
        // (`cdk-global-scrollblock`) to make sure that we don't try to disable global
        // scrolling multiple times.
        var /** @type {?} */ html = this._document.documentElement;
        if (html.classList.contains('cdk-global-scrollblock') || this._isEnabled) {
            return false;
        }
        var /** @type {?} */ body = this._document.body;
        var /** @type {?} */ viewport = this._viewportRuler.getViewportSize();
        return body.scrollHeight > viewport.height || body.scrollWidth > viewport.width;
    };
    return BlockScrollStrategy;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

// TODO(jelbourn): move this to live with the rest of the scrolling code
// TODO(jelbourn): someday replace this with IntersectionObservers
/**
 * Gets whether an element is scrolled outside of view by any of its parent scrolling containers.
 * \@docs-private
 * @param {?} element Dimensions of the element (from getBoundingClientRect)
 * @param {?} scrollContainers Dimensions of element's scrolling containers (from getBoundingClientRect)
 * @return {?} Whether the element is scrolled out of view
 */
function isElementScrolledOutsideView(element, scrollContainers) {
    return scrollContainers.some(function (containerBounds) {
        var /** @type {?} */ outsideAbove = element.bottom < containerBounds.top;
        var /** @type {?} */ outsideBelow = element.top > containerBounds.bottom;
        var /** @type {?} */ outsideLeft = element.right < containerBounds.left;
        var /** @type {?} */ outsideRight = element.left > containerBounds.right;
        return outsideAbove || outsideBelow || outsideLeft || outsideRight;
    });
}
/**
 * Gets whether an element is clipped by any of its scrolling containers.
 * \@docs-private
 * @param {?} element Dimensions of the element (from getBoundingClientRect)
 * @param {?} scrollContainers Dimensions of element's scrolling containers (from getBoundingClientRect)
 * @return {?} Whether the element is clipped
 */
function isElementClippedByScrolling(element, scrollContainers) {
    return scrollContainers.some(function (scrollContainerRect) {
        var /** @type {?} */ clippedAbove = element.top < scrollContainerRect.top;
        var /** @type {?} */ clippedBelow = element.bottom > scrollContainerRect.bottom;
        var /** @type {?} */ clippedLeft = element.left < scrollContainerRect.left;
        var /** @type {?} */ clippedRight = element.right > scrollContainerRect.right;
        return clippedAbove || clippedBelow || clippedLeft || clippedRight;
    });
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Config options for the RepositionScrollStrategy.
 * @record
 */

/**
 * Strategy that will update the element position as the user is scrolling.
 */
var RepositionScrollStrategy = /** @class */ (function () {
    function RepositionScrollStrategy(_scrollDispatcher, _viewportRuler, _ngZone, _config) {
        this._scrollDispatcher = _scrollDispatcher;
        this._viewportRuler = _viewportRuler;
        this._ngZone = _ngZone;
        this._config = _config;
        this._scrollSubscription = null;
    }
    /** Attaches this scroll strategy to an overlay. */
    /**
     * Attaches this scroll strategy to an overlay.
     * @param {?} overlayRef
     * @return {?}
     */
    RepositionScrollStrategy.prototype.attach = /**
     * Attaches this scroll strategy to an overlay.
     * @param {?} overlayRef
     * @return {?}
     */
    function (overlayRef) {
        if (this._overlayRef) {
            throw getMatScrollStrategyAlreadyAttachedError();
        }
        this._overlayRef = overlayRef;
    };
    /** Enables repositioning of the attached overlay on scroll. */
    /**
     * Enables repositioning of the attached overlay on scroll.
     * @return {?}
     */
    RepositionScrollStrategy.prototype.enable = /**
     * Enables repositioning of the attached overlay on scroll.
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this._scrollSubscription) {
            var /** @type {?} */ throttle = this._config ? this._config.scrollThrottle : 0;
            this._scrollSubscription = this._scrollDispatcher.scrolled(throttle).subscribe(function () {
                _this._overlayRef.updatePosition();
                // TODO(crisbeto): make `close` on by default once all components can handle it.
                if (_this._config && _this._config.autoClose) {
                    var /** @type {?} */ overlayRect = _this._overlayRef.overlayElement.getBoundingClientRect();
                    var _a = _this._viewportRuler.getViewportSize(), width = _a.width, height = _a.height;
                    // TODO(crisbeto): include all ancestor scroll containers here once
                    // we have a way of exposing the trigger element to the scroll strategy.
                    var /** @type {?} */ parentRects = [{ width: width, height: height, bottom: height, right: width, top: 0, left: 0 }];
                    if (isElementScrolledOutsideView(overlayRect, parentRects)) {
                        _this.disable();
                        _this._ngZone.run(function () { return _this._overlayRef.detach(); });
                    }
                }
            });
        }
    };
    /** Disables repositioning of the attached overlay on scroll. */
    /**
     * Disables repositioning of the attached overlay on scroll.
     * @return {?}
     */
    RepositionScrollStrategy.prototype.disable = /**
     * Disables repositioning of the attached overlay on scroll.
     * @return {?}
     */
    function () {
        if (this._scrollSubscription) {
            this._scrollSubscription.unsubscribe();
            this._scrollSubscription = null;
        }
    };
    return RepositionScrollStrategy;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Options for how an overlay will handle scrolling.
 *
 * Users can provide a custom value for `ScrollStrategyOptions` to replace the default
 * behaviors. This class primarily acts as a factory for ScrollStrategy instances.
 */
var ScrollStrategyOptions = /** @class */ (function () {
    function ScrollStrategyOptions(_scrollDispatcher, _viewportRuler, _ngZone, document) {
        var _this = this;
        this._scrollDispatcher = _scrollDispatcher;
        this._viewportRuler = _viewportRuler;
        this._ngZone = _ngZone;
        /**
         * Do nothing on scroll.
         */
        this.noop = function () { return new NoopScrollStrategy(); };
        /**
         * Close the overlay as soon as the user scrolls.
         * @param config Configuration to be used inside the scroll strategy.
         */
        this.close = function (config) {
            return new CloseScrollStrategy(_this._scrollDispatcher, _this._ngZone, _this._viewportRuler, config);
        };
        /**
         * Block scrolling.
         */
        this.block = function () { return new BlockScrollStrategy(_this._viewportRuler, _this._document); };
        /**
         * Update the overlay's position on scroll.
         * @param config Configuration to be used inside the scroll strategy.
         * Allows debouncing the reposition calls.
         */
        this.reposition = function (config) {
            return new RepositionScrollStrategy(_this._scrollDispatcher, _this._viewportRuler, _this._ngZone, config);
        };
        this._document = document;
    }
    ScrollStrategyOptions.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    ScrollStrategyOptions.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_cdk_scrolling__["b" /* ScrollDispatcher */], },
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_cdk_scrolling__["d" /* ViewportRuler */], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_2__angular_common__["DOCUMENT"],] },] },
    ]; };
    return ScrollStrategyOptions;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Reference to an overlay that has been created with the Overlay service.
 * Used to manipulate or dispose of said overlay.
 */
var OverlayRef = /** @class */ (function () {
    function OverlayRef(_portalOutlet, _pane, _config, _ngZone, _keyboardDispatcher, _document) {
        this._portalOutlet = _portalOutlet;
        this._pane = _pane;
        this._config = _config;
        this._ngZone = _ngZone;
        this._keyboardDispatcher = _keyboardDispatcher;
        this._document = _document;
        this._backdropElement = null;
        this._backdropClick = new __WEBPACK_IMPORTED_MODULE_7_rxjs_Subject__["Subject"]();
        this._attachments = new __WEBPACK_IMPORTED_MODULE_7_rxjs_Subject__["Subject"]();
        this._detachments = new __WEBPACK_IMPORTED_MODULE_7_rxjs_Subject__["Subject"]();
        /**
         * Stream of keydown events dispatched to this overlay.
         */
        this._keydownEvents = new __WEBPACK_IMPORTED_MODULE_7_rxjs_Subject__["Subject"]();
        if (_config.scrollStrategy) {
            _config.scrollStrategy.attach(this);
        }
    }
    Object.defineProperty(OverlayRef.prototype, "overlayElement", {
        /** The overlay's HTML element */
        get: /**
         * The overlay's HTML element
         * @return {?}
         */
        function () {
            return this._pane;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverlayRef.prototype, "backdropElement", {
        /** The overlay's backdrop HTML element. */
        get: /**
         * The overlay's backdrop HTML element.
         * @return {?}
         */
        function () {
            return this._backdropElement;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Attaches content, given via a Portal, to the overlay.
     * If the overlay is configured to have a backdrop, it will be created.
     *
     * @param portal Portal instance to which to attach the overlay.
     * @returns The portal attachment result.
     */
    /**
     * Attaches content, given via a Portal, to the overlay.
     * If the overlay is configured to have a backdrop, it will be created.
     *
     * @param {?} portal Portal instance to which to attach the overlay.
     * @return {?} The portal attachment result.
     */
    OverlayRef.prototype.attach = /**
     * Attaches content, given via a Portal, to the overlay.
     * If the overlay is configured to have a backdrop, it will be created.
     *
     * @param {?} portal Portal instance to which to attach the overlay.
     * @return {?} The portal attachment result.
     */
    function (portal) {
        var _this = this;
        var /** @type {?} */ attachResult = this._portalOutlet.attach(portal);
        if (this._config.positionStrategy) {
            this._config.positionStrategy.attach(this);
        }
        // Update the pane element with the given configuration.
        this._updateStackingOrder();
        this._updateElementSize();
        this._updateElementDirection();
        if (this._config.scrollStrategy) {
            this._config.scrollStrategy.enable();
        }
        // Update the position once the zone is stable so that the overlay will be fully rendered
        // before attempting to position it, as the position may depend on the size of the rendered
        // content.
        this._ngZone.onStable.asObservable().pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators_take__["a" /* take */])(1)).subscribe(function () {
            // The overlay could've been detached before the zone has stabilized.
            if (_this.hasAttached()) {
                _this.updatePosition();
            }
        });
        // Enable pointer events for the overlay pane element.
        this._togglePointerEvents(true);
        if (this._config.hasBackdrop) {
            this._attachBackdrop();
        }
        if (this._config.panelClass) {
            // We can't do a spread here, because IE doesn't support setting multiple classes.
            if (Array.isArray(this._config.panelClass)) {
                this._config.panelClass.forEach(function (cls) { return _this._pane.classList.add(cls); });
            }
            else {
                this._pane.classList.add(this._config.panelClass);
            }
        }
        // Only emit the `attachments` event once all other setup is done.
        this._attachments.next();
        // Track this overlay by the keyboard dispatcher
        this._keyboardDispatcher.add(this);
        return attachResult;
    };
    /**
     * Detaches an overlay from a portal.
     * @returns The portal detachment result.
     */
    /**
     * Detaches an overlay from a portal.
     * @return {?} The portal detachment result.
     */
    OverlayRef.prototype.detach = /**
     * Detaches an overlay from a portal.
     * @return {?} The portal detachment result.
     */
    function () {
        if (!this.hasAttached()) {
            return;
        }
        this.detachBackdrop();
        // When the overlay is detached, the pane element should disable pointer events.
        // This is necessary because otherwise the pane element will cover the page and disable
        // pointer events therefore. Depends on the position strategy and the applied pane boundaries.
        this._togglePointerEvents(false);
        if (this._config.positionStrategy && this._config.positionStrategy.detach) {
            this._config.positionStrategy.detach();
        }
        if (this._config.scrollStrategy) {
            this._config.scrollStrategy.disable();
        }
        var /** @type {?} */ detachmentResult = this._portalOutlet.detach();
        // Only emit after everything is detached.
        this._detachments.next();
        // Remove this overlay from keyboard dispatcher tracking
        this._keyboardDispatcher.remove(this);
        return detachmentResult;
    };
    /** Cleans up the overlay from the DOM. */
    /**
     * Cleans up the overlay from the DOM.
     * @return {?}
     */
    OverlayRef.prototype.dispose = /**
     * Cleans up the overlay from the DOM.
     * @return {?}
     */
    function () {
        var /** @type {?} */ isAttached = this.hasAttached();
        if (this._config.positionStrategy) {
            this._config.positionStrategy.dispose();
        }
        if (this._config.scrollStrategy) {
            this._config.scrollStrategy.disable();
        }
        this.detachBackdrop();
        this._keyboardDispatcher.remove(this);
        this._portalOutlet.dispose();
        this._attachments.complete();
        this._backdropClick.complete();
        this._keydownEvents.complete();
        if (isAttached) {
            this._detachments.next();
        }
        this._detachments.complete();
    };
    /** Whether the overlay has attached content. */
    /**
     * Whether the overlay has attached content.
     * @return {?}
     */
    OverlayRef.prototype.hasAttached = /**
     * Whether the overlay has attached content.
     * @return {?}
     */
    function () {
        return this._portalOutlet.hasAttached();
    };
    /** Gets an observable that emits when the backdrop has been clicked. */
    /**
     * Gets an observable that emits when the backdrop has been clicked.
     * @return {?}
     */
    OverlayRef.prototype.backdropClick = /**
     * Gets an observable that emits when the backdrop has been clicked.
     * @return {?}
     */
    function () {
        return this._backdropClick.asObservable();
    };
    /** Gets an observable that emits when the overlay has been attached. */
    /**
     * Gets an observable that emits when the overlay has been attached.
     * @return {?}
     */
    OverlayRef.prototype.attachments = /**
     * Gets an observable that emits when the overlay has been attached.
     * @return {?}
     */
    function () {
        return this._attachments.asObservable();
    };
    /** Gets an observable that emits when the overlay has been detached. */
    /**
     * Gets an observable that emits when the overlay has been detached.
     * @return {?}
     */
    OverlayRef.prototype.detachments = /**
     * Gets an observable that emits when the overlay has been detached.
     * @return {?}
     */
    function () {
        return this._detachments.asObservable();
    };
    /** Gets an observable of keydown events targeted to this overlay. */
    /**
     * Gets an observable of keydown events targeted to this overlay.
     * @return {?}
     */
    OverlayRef.prototype.keydownEvents = /**
     * Gets an observable of keydown events targeted to this overlay.
     * @return {?}
     */
    function () {
        return this._keydownEvents.asObservable();
    };
    /** Gets the the current overlay configuration, which is immutable. */
    /**
     * Gets the the current overlay configuration, which is immutable.
     * @return {?}
     */
    OverlayRef.prototype.getConfig = /**
     * Gets the the current overlay configuration, which is immutable.
     * @return {?}
     */
    function () {
        return this._config;
    };
    /** Updates the position of the overlay based on the position strategy. */
    /**
     * Updates the position of the overlay based on the position strategy.
     * @return {?}
     */
    OverlayRef.prototype.updatePosition = /**
     * Updates the position of the overlay based on the position strategy.
     * @return {?}
     */
    function () {
        if (this._config.positionStrategy) {
            this._config.positionStrategy.apply();
        }
    };
    /** Update the size properties of the overlay. */
    /**
     * Update the size properties of the overlay.
     * @param {?} sizeConfig
     * @return {?}
     */
    OverlayRef.prototype.updateSize = /**
     * Update the size properties of the overlay.
     * @param {?} sizeConfig
     * @return {?}
     */
    function (sizeConfig) {
        this._config = Object(__WEBPACK_IMPORTED_MODULE_5_tslib__["a" /* __assign */])({}, this._config, sizeConfig);
        this._updateElementSize();
    };
    /** Sets the LTR/RTL direction for the overlay. */
    /**
     * Sets the LTR/RTL direction for the overlay.
     * @param {?} dir
     * @return {?}
     */
    OverlayRef.prototype.setDirection = /**
     * Sets the LTR/RTL direction for the overlay.
     * @param {?} dir
     * @return {?}
     */
    function (dir) {
        this._config = Object(__WEBPACK_IMPORTED_MODULE_5_tslib__["a" /* __assign */])({}, this._config, { direction: dir });
        this._updateElementDirection();
    };
    /**
     * Updates the text direction of the overlay panel.
     * @return {?}
     */
    OverlayRef.prototype._updateElementDirection = /**
     * Updates the text direction of the overlay panel.
     * @return {?}
     */
    function () {
        this._pane.setAttribute('dir', /** @type {?} */ ((this._config.direction)));
    };
    /**
     * Updates the size of the overlay element based on the overlay config.
     * @return {?}
     */
    OverlayRef.prototype._updateElementSize = /**
     * Updates the size of the overlay element based on the overlay config.
     * @return {?}
     */
    function () {
        if (this._config.width || this._config.width === 0) {
            this._pane.style.width = formatCssUnit(this._config.width);
        }
        if (this._config.height || this._config.height === 0) {
            this._pane.style.height = formatCssUnit(this._config.height);
        }
        if (this._config.minWidth || this._config.minWidth === 0) {
            this._pane.style.minWidth = formatCssUnit(this._config.minWidth);
        }
        if (this._config.minHeight || this._config.minHeight === 0) {
            this._pane.style.minHeight = formatCssUnit(this._config.minHeight);
        }
        if (this._config.maxWidth || this._config.maxWidth === 0) {
            this._pane.style.maxWidth = formatCssUnit(this._config.maxWidth);
        }
        if (this._config.maxHeight || this._config.maxHeight === 0) {
            this._pane.style.maxHeight = formatCssUnit(this._config.maxHeight);
        }
    };
    /**
     * Toggles the pointer events for the overlay pane element.
     * @param {?} enablePointer
     * @return {?}
     */
    OverlayRef.prototype._togglePointerEvents = /**
     * Toggles the pointer events for the overlay pane element.
     * @param {?} enablePointer
     * @return {?}
     */
    function (enablePointer) {
        this._pane.style.pointerEvents = enablePointer ? 'auto' : 'none';
    };
    /**
     * Attaches a backdrop for this overlay.
     * @return {?}
     */
    OverlayRef.prototype._attachBackdrop = /**
     * Attaches a backdrop for this overlay.
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ showingClass = 'cdk-overlay-backdrop-showing';
        this._backdropElement = this._document.createElement('div');
        this._backdropElement.classList.add('cdk-overlay-backdrop');
        if (this._config.backdropClass) {
            this._backdropElement.classList.add(this._config.backdropClass);
        } /** @type {?} */
        ((
        // Insert the backdrop before the pane in the DOM order,
        // in order to handle stacked overlays properly.
        this._pane.parentElement)).insertBefore(this._backdropElement, this._pane);
        // Forward backdrop clicks such that the consumer of the overlay can perform whatever
        // action desired when such a click occurs (usually closing the overlay).
        this._backdropElement.addEventListener('click', function (event) { return _this._backdropClick.next(event); });
        // Add class to fade-in the backdrop after one frame.
        if (typeof requestAnimationFrame !== 'undefined') {
            this._ngZone.runOutsideAngular(function () {
                requestAnimationFrame(function () {
                    if (_this._backdropElement) {
                        _this._backdropElement.classList.add(showingClass);
                    }
                });
            });
        }
        else {
            this._backdropElement.classList.add(showingClass);
        }
    };
    /**
     * Updates the stacking order of the element, moving it to the top if necessary.
     * This is required in cases where one overlay was detached, while another one,
     * that should be behind it, was destroyed. The next time both of them are opened,
     * the stacking will be wrong, because the detached element's pane will still be
     * in its original DOM position.
     * @return {?}
     */
    OverlayRef.prototype._updateStackingOrder = /**
     * Updates the stacking order of the element, moving it to the top if necessary.
     * This is required in cases where one overlay was detached, while another one,
     * that should be behind it, was destroyed. The next time both of them are opened,
     * the stacking will be wrong, because the detached element's pane will still be
     * in its original DOM position.
     * @return {?}
     */
    function () {
        if (this._pane.nextSibling) {
            /** @type {?} */ ((this._pane.parentNode)).appendChild(this._pane);
        }
    };
    /** Detaches the backdrop (if any) associated with the overlay. */
    /**
     * Detaches the backdrop (if any) associated with the overlay.
     * @return {?}
     */
    OverlayRef.prototype.detachBackdrop = /**
     * Detaches the backdrop (if any) associated with the overlay.
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ backdropToDetach = this._backdropElement;
        if (backdropToDetach) {
            var /** @type {?} */ finishDetach_1 = function () {
                // It may not be attached to anything in certain cases (e.g. unit tests).
                if (backdropToDetach && backdropToDetach.parentNode) {
                    backdropToDetach.parentNode.removeChild(backdropToDetach);
                }
                // It is possible that a new portal has been attached to this overlay since we started
                // removing the backdrop. If that is the case, only clear the backdrop reference if it
                // is still the same instance that we started to remove.
                if (_this._backdropElement == backdropToDetach) {
                    _this._backdropElement = null;
                }
            };
            backdropToDetach.classList.remove('cdk-overlay-backdrop-showing');
            if (this._config.backdropClass) {
                backdropToDetach.classList.remove(this._config.backdropClass);
            }
            backdropToDetach.addEventListener('transitionend', finishDetach_1);
            // If the backdrop doesn't have a transition, the `transitionend` event won't fire.
            // In this case we make it unclickable and we try to remove it after a delay.
            backdropToDetach.style.pointerEvents = 'none';
            // Run this outside the Angular zone because there's nothing that Angular cares about.
            // If it were to run inside the Angular zone, every test that used Overlay would have to be
            // either async or fakeAsync.
            this._ngZone.runOutsideAngular(function () {
                setTimeout(finishDetach_1, 500);
            });
        }
    };
    return OverlayRef;
}());
/**
 * @param {?} value
 * @return {?}
 */
function formatCssUnit(value) {
    return typeof value === 'string' ? /** @type {?} */ (value) : value + "px";
}
/**
 * Size properties for an overlay.
 * @record
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * implicit position relative some origin element. The relative position is defined in terms of
 * a point on the origin element that is connected to a point on the overlay element. For example,
 * a basic dropdown is connecting the bottom-left corner of the origin to the top-left corner
 * of the overlay.
 */
var ConnectedPositionStrategy = /** @class */ (function () {
    function ConnectedPositionStrategy(originPos, overlayPos, _connectedTo, _viewportRuler, _document) {
        this._connectedTo = _connectedTo;
        this._viewportRuler = _viewportRuler;
        this._document = _document;
        /**
         * Layout direction of the position strategy.
         */
        this._dir = 'ltr';
        /**
         * The offset in pixels for the overlay connection point on the x-axis
         */
        this._offsetX = 0;
        /**
         * The offset in pixels for the overlay connection point on the y-axis
         */
        this._offsetY = 0;
        /**
         * The Scrollable containers used to check scrollable view properties on position change.
         */
        this.scrollables = [];
        /**
         * Subscription to viewport resize events.
         */
        this._resizeSubscription = __WEBPACK_IMPORTED_MODULE_8_rxjs_Subscription__["a" /* Subscription */].EMPTY;
        /**
         * Ordered list of preferred positions, from most to least desirable.
         */
        this._preferredPositions = [];
        /**
         * Whether the position strategy is applied currently.
         */
        this._applied = false;
        /**
         * Whether the overlay position is locked.
         */
        this._positionLocked = false;
        this._onPositionChange = new __WEBPACK_IMPORTED_MODULE_7_rxjs_Subject__["Subject"]();
        this._origin = this._connectedTo.nativeElement;
        this.withFallbackPosition(originPos, overlayPos);
    }
    Object.defineProperty(ConnectedPositionStrategy.prototype, "_isRtl", {
        /** Whether the we're dealing with an RTL context */
        get: /**
         * Whether the we're dealing with an RTL context
         * @return {?}
         */
        function () {
            return this._dir === 'rtl';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedPositionStrategy.prototype, "onPositionChange", {
        /** Emits an event when the connection point changes. */
        get: /**
         * Emits an event when the connection point changes.
         * @return {?}
         */
        function () {
            return this._onPositionChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedPositionStrategy.prototype, "positions", {
        /** Ordered list of preferred positions, from most to least desirable. */
        get: /**
         * Ordered list of preferred positions, from most to least desirable.
         * @return {?}
         */
        function () {
            return this._preferredPositions;
        },
        enumerable: true,
        configurable: true
    });
    /** Attach this position strategy to an overlay. */
    /**
     * Attach this position strategy to an overlay.
     * @param {?} overlayRef
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.attach = /**
     * Attach this position strategy to an overlay.
     * @param {?} overlayRef
     * @return {?}
     */
    function (overlayRef) {
        var _this = this;
        this._pane = overlayRef.overlayElement;
        this._resizeSubscription.unsubscribe();
        this._resizeSubscription = this._viewportRuler.change().subscribe(function () { return _this.apply(); });
    };
    /** Disposes all resources used by the position strategy. */
    /**
     * Disposes all resources used by the position strategy.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.dispose = /**
     * Disposes all resources used by the position strategy.
     * @return {?}
     */
    function () {
        this._applied = false;
        this._resizeSubscription.unsubscribe();
        this._onPositionChange.complete();
    };
    /** @docs-private */
    /**
     * \@docs-private
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.detach = /**
     * \@docs-private
     * @return {?}
     */
    function () {
        this._applied = false;
        this._resizeSubscription.unsubscribe();
    };
    /**
     * Updates the position of the overlay element, using whichever preferred position relative
     * to the origin fits on-screen.
     * @docs-private
     */
    /**
     * Updates the position of the overlay element, using whichever preferred position relative
     * to the origin fits on-screen.
     * \@docs-private
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.apply = /**
     * Updates the position of the overlay element, using whichever preferred position relative
     * to the origin fits on-screen.
     * \@docs-private
     * @return {?}
     */
    function () {
        // If the position has been applied already (e.g. when the overlay was opened) and the
        // consumer opted into locking in the position, re-use the  old position, in order to
        // prevent the overlay from jumping around.
        if (this._applied && this._positionLocked && this._lastConnectedPosition) {
            this.recalculateLastPosition();
            return;
        }
        this._applied = true;
        // We need the bounding rects for the origin and the overlay to determine how to position
        // the overlay relative to the origin.
        var /** @type {?} */ element = this._pane;
        var /** @type {?} */ originRect = this._origin.getBoundingClientRect();
        var /** @type {?} */ overlayRect = element.getBoundingClientRect();
        // We use the viewport size to determine whether a position would go off-screen.
        var /** @type {?} */ viewportSize = this._viewportRuler.getViewportSize();
        // Fallback point if none of the fallbacks fit into the viewport.
        var /** @type {?} */ fallbackPoint;
        var /** @type {?} */ fallbackPosition;
        // We want to place the overlay in the first of the preferred positions such that the
        // overlay fits on-screen.
        for (var _i = 0, _a = this._preferredPositions; _i < _a.length; _i++) {
            var pos = _a[_i];
            // Get the (x, y) point of connection on the origin, and then use that to get the
            // (top, left) coordinate for the overlay at `pos`.
            var /** @type {?} */ originPoint = this._getOriginConnectionPoint(originRect, pos);
            var /** @type {?} */ overlayPoint = this._getOverlayPoint(originPoint, overlayRect, viewportSize, pos);
            // If the overlay in the calculated position fits on-screen, put it there and we're done.
            if (overlayPoint.fitsInViewport) {
                this._setElementPosition(element, overlayRect, overlayPoint, pos);
                // Save the last connected position in case the position needs to be re-calculated.
                this._lastConnectedPosition = pos;
                return;
            }
            else if (!fallbackPoint || fallbackPoint.visibleArea < overlayPoint.visibleArea) {
                fallbackPoint = overlayPoint;
                fallbackPosition = pos;
            }
        }
        // If none of the preferred positions were in the viewport, take the one
        // with the largest visible area.
        this._setElementPosition(element, overlayRect, /** @type {?} */ ((fallbackPoint)), /** @type {?} */ ((fallbackPosition)));
    };
    /**
     * Re-positions the overlay element with the trigger in its last calculated position,
     * even if a position higher in the "preferred positions" list would now fit. This
     * allows one to re-align the panel without changing the orientation of the panel.
     */
    /**
     * Re-positions the overlay element with the trigger in its last calculated position,
     * even if a position higher in the "preferred positions" list would now fit. This
     * allows one to re-align the panel without changing the orientation of the panel.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.recalculateLastPosition = /**
     * Re-positions the overlay element with the trigger in its last calculated position,
     * even if a position higher in the "preferred positions" list would now fit. This
     * allows one to re-align the panel without changing the orientation of the panel.
     * @return {?}
     */
    function () {
        // If the overlay has never been positioned before, do nothing.
        if (!this._lastConnectedPosition) {
            return;
        }
        var /** @type {?} */ originRect = this._origin.getBoundingClientRect();
        var /** @type {?} */ overlayRect = this._pane.getBoundingClientRect();
        var /** @type {?} */ viewportSize = this._viewportRuler.getViewportSize();
        var /** @type {?} */ lastPosition = this._lastConnectedPosition || this._preferredPositions[0];
        var /** @type {?} */ originPoint = this._getOriginConnectionPoint(originRect, lastPosition);
        var /** @type {?} */ overlayPoint = this._getOverlayPoint(originPoint, overlayRect, viewportSize, lastPosition);
        this._setElementPosition(this._pane, overlayRect, overlayPoint, lastPosition);
    };
    /**
     * Sets the list of Scrollable containers that host the origin element so that
     * on reposition we can evaluate if it or the overlay has been clipped or outside view. Every
     * Scrollable must be an ancestor element of the strategy's origin element.
     */
    /**
     * Sets the list of Scrollable containers that host the origin element so that
     * on reposition we can evaluate if it or the overlay has been clipped or outside view. Every
     * Scrollable must be an ancestor element of the strategy's origin element.
     * @param {?} scrollables
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withScrollableContainers = /**
     * Sets the list of Scrollable containers that host the origin element so that
     * on reposition we can evaluate if it or the overlay has been clipped or outside view. Every
     * Scrollable must be an ancestor element of the strategy's origin element.
     * @param {?} scrollables
     * @return {?}
     */
    function (scrollables) {
        this.scrollables = scrollables;
    };
    /**
     * Adds a new preferred fallback position.
     * @param originPos
     * @param overlayPos
     */
    /**
     * Adds a new preferred fallback position.
     * @param {?} originPos
     * @param {?} overlayPos
     * @param {?=} offsetX
     * @param {?=} offsetY
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withFallbackPosition = /**
     * Adds a new preferred fallback position.
     * @param {?} originPos
     * @param {?} overlayPos
     * @param {?=} offsetX
     * @param {?=} offsetY
     * @return {?}
     */
    function (originPos, overlayPos, offsetX, offsetY) {
        var /** @type {?} */ position = new ConnectionPositionPair(originPos, overlayPos, offsetX, offsetY);
        this._preferredPositions.push(position);
        return this;
    };
    /**
     * Sets the layout direction so the overlay's position can be adjusted to match.
     * @param dir New layout direction.
     */
    /**
     * Sets the layout direction so the overlay's position can be adjusted to match.
     * @param {?} dir New layout direction.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withDirection = /**
     * Sets the layout direction so the overlay's position can be adjusted to match.
     * @param {?} dir New layout direction.
     * @return {?}
     */
    function (dir) {
        this._dir = dir;
        return this;
    };
    /**
     * Sets an offset for the overlay's connection point on the x-axis
     * @param offset New offset in the X axis.
     */
    /**
     * Sets an offset for the overlay's connection point on the x-axis
     * @param {?} offset New offset in the X axis.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withOffsetX = /**
     * Sets an offset for the overlay's connection point on the x-axis
     * @param {?} offset New offset in the X axis.
     * @return {?}
     */
    function (offset) {
        this._offsetX = offset;
        return this;
    };
    /**
     * Sets an offset for the overlay's connection point on the y-axis
     * @param  offset New offset in the Y axis.
     */
    /**
     * Sets an offset for the overlay's connection point on the y-axis
     * @param {?} offset New offset in the Y axis.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withOffsetY = /**
     * Sets an offset for the overlay's connection point on the y-axis
     * @param {?} offset New offset in the Y axis.
     * @return {?}
     */
    function (offset) {
        this._offsetY = offset;
        return this;
    };
    /**
     * Sets whether the overlay's position should be locked in after it is positioned
     * initially. When an overlay is locked in, it won't attempt to reposition itself
     * when the position is re-applied (e.g. when the user scrolls away).
     * @param isLocked Whether the overlay should locked in.
     */
    /**
     * Sets whether the overlay's position should be locked in after it is positioned
     * initially. When an overlay is locked in, it won't attempt to reposition itself
     * when the position is re-applied (e.g. when the user scrolls away).
     * @param {?} isLocked Whether the overlay should locked in.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withLockedPosition = /**
     * Sets whether the overlay's position should be locked in after it is positioned
     * initially. When an overlay is locked in, it won't attempt to reposition itself
     * when the position is re-applied (e.g. when the user scrolls away).
     * @param {?} isLocked Whether the overlay should locked in.
     * @return {?}
     */
    function (isLocked) {
        this._positionLocked = isLocked;
        return this;
    };
    /**
     * Overwrites the current set of positions with an array of new ones.
     * @param positions Position pairs to be set on the strategy.
     */
    /**
     * Overwrites the current set of positions with an array of new ones.
     * @param {?} positions Position pairs to be set on the strategy.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.withPositions = /**
     * Overwrites the current set of positions with an array of new ones.
     * @param {?} positions Position pairs to be set on the strategy.
     * @return {?}
     */
    function (positions) {
        this._preferredPositions = positions.slice();
        return this;
    };
    /**
     * Sets the origin element, relative to which to position the overlay.
     * @param origin Reference to the new origin element.
     */
    /**
     * Sets the origin element, relative to which to position the overlay.
     * @param {?} origin Reference to the new origin element.
     * @return {?}
     */
    ConnectedPositionStrategy.prototype.setOrigin = /**
     * Sets the origin element, relative to which to position the overlay.
     * @param {?} origin Reference to the new origin element.
     * @return {?}
     */
    function (origin) {
        this._origin = origin.nativeElement;
        return this;
    };
    /**
     * Gets the horizontal (x) "start" dimension based on whether the overlay is in an RTL context.
     * @param {?} rect
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._getStartX = /**
     * Gets the horizontal (x) "start" dimension based on whether the overlay is in an RTL context.
     * @param {?} rect
     * @return {?}
     */
    function (rect) {
        return this._isRtl ? rect.right : rect.left;
    };
    /**
     * Gets the horizontal (x) "end" dimension based on whether the overlay is in an RTL context.
     * @param {?} rect
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._getEndX = /**
     * Gets the horizontal (x) "end" dimension based on whether the overlay is in an RTL context.
     * @param {?} rect
     * @return {?}
     */
    function (rect) {
        return this._isRtl ? rect.left : rect.right;
    };
    /**
     * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
     * @param {?} originRect
     * @param {?} pos
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._getOriginConnectionPoint = /**
     * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
     * @param {?} originRect
     * @param {?} pos
     * @return {?}
     */
    function (originRect, pos) {
        var /** @type {?} */ originStartX = this._getStartX(originRect);
        var /** @type {?} */ originEndX = this._getEndX(originRect);
        var /** @type {?} */ x;
        if (pos.originX == 'center') {
            x = originStartX + (originRect.width / 2);
        }
        else {
            x = pos.originX == 'start' ? originStartX : originEndX;
        }
        var /** @type {?} */ y;
        if (pos.originY == 'center') {
            y = originRect.top + (originRect.height / 2);
        }
        else {
            y = pos.originY == 'top' ? originRect.top : originRect.bottom;
        }
        return { x: x, y: y };
    };
    /**
     * Gets the (x, y) coordinate of the top-left corner of the overlay given a given position and
     * origin point to which the overlay should be connected, as well as how much of the element
     * would be inside the viewport at that position.
     * @param {?} originPoint
     * @param {?} overlayRect
     * @param {?} viewportSize
     * @param {?} pos
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._getOverlayPoint = /**
     * Gets the (x, y) coordinate of the top-left corner of the overlay given a given position and
     * origin point to which the overlay should be connected, as well as how much of the element
     * would be inside the viewport at that position.
     * @param {?} originPoint
     * @param {?} overlayRect
     * @param {?} viewportSize
     * @param {?} pos
     * @return {?}
     */
    function (originPoint, overlayRect, viewportSize, pos) {
        // Calculate the (overlayStartX, overlayStartY), the start of the potential overlay position
        // relative to the origin point.
        var /** @type {?} */ overlayStartX;
        if (pos.overlayX == 'center') {
            overlayStartX = -overlayRect.width / 2;
        }
        else if (pos.overlayX === 'start') {
            overlayStartX = this._isRtl ? -overlayRect.width : 0;
        }
        else {
            overlayStartX = this._isRtl ? 0 : -overlayRect.width;
        }
        var /** @type {?} */ overlayStartY;
        if (pos.overlayY == 'center') {
            overlayStartY = -overlayRect.height / 2;
        }
        else {
            overlayStartY = pos.overlayY == 'top' ? 0 : -overlayRect.height;
        }
        // The (x, y) offsets of the overlay based on the current position.
        var /** @type {?} */ offsetX = typeof pos.offsetX === 'undefined' ? this._offsetX : pos.offsetX;
        var /** @type {?} */ offsetY = typeof pos.offsetY === 'undefined' ? this._offsetY : pos.offsetY;
        // The (x, y) coordinates of the overlay.
        var /** @type {?} */ x = originPoint.x + overlayStartX + offsetX;
        var /** @type {?} */ y = originPoint.y + overlayStartY + offsetY;
        // How much the overlay would overflow at this position, on each side.
        var /** @type {?} */ leftOverflow = 0 - x;
        var /** @type {?} */ rightOverflow = (x + overlayRect.width) - viewportSize.width;
        var /** @type {?} */ topOverflow = 0 - y;
        var /** @type {?} */ bottomOverflow = (y + overlayRect.height) - viewportSize.height;
        // Visible parts of the element on each axis.
        var /** @type {?} */ visibleWidth = this._subtractOverflows(overlayRect.width, leftOverflow, rightOverflow);
        var /** @type {?} */ visibleHeight = this._subtractOverflows(overlayRect.height, topOverflow, bottomOverflow);
        // The area of the element that's within the viewport.
        var /** @type {?} */ visibleArea = visibleWidth * visibleHeight;
        var /** @type {?} */ fitsInViewport = (overlayRect.width * overlayRect.height) === visibleArea;
        return { x: x, y: y, fitsInViewport: fitsInViewport, visibleArea: visibleArea };
    };
    /**
     * Gets the view properties of the trigger and overlay, including whether they are clipped
     * or completely outside the view of any of the strategy's scrollables.
     * @param {?} overlay
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._getScrollVisibility = /**
     * Gets the view properties of the trigger and overlay, including whether they are clipped
     * or completely outside the view of any of the strategy's scrollables.
     * @param {?} overlay
     * @return {?}
     */
    function (overlay) {
        var /** @type {?} */ originBounds = this._origin.getBoundingClientRect();
        var /** @type {?} */ overlayBounds = overlay.getBoundingClientRect();
        var /** @type {?} */ scrollContainerBounds = this.scrollables.map(function (s) { return s.getElementRef().nativeElement.getBoundingClientRect(); });
        return {
            isOriginClipped: isElementClippedByScrolling(originBounds, scrollContainerBounds),
            isOriginOutsideView: isElementScrolledOutsideView(originBounds, scrollContainerBounds),
            isOverlayClipped: isElementClippedByScrolling(overlayBounds, scrollContainerBounds),
            isOverlayOutsideView: isElementScrolledOutsideView(overlayBounds, scrollContainerBounds),
        };
    };
    /**
     * Physically positions the overlay element to the given coordinate.
     * @param {?} element
     * @param {?} overlayRect
     * @param {?} overlayPoint
     * @param {?} pos
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._setElementPosition = /**
     * Physically positions the overlay element to the given coordinate.
     * @param {?} element
     * @param {?} overlayRect
     * @param {?} overlayPoint
     * @param {?} pos
     * @return {?}
     */
    function (element, overlayRect, overlayPoint, pos) {
        // We want to set either `top` or `bottom` based on whether the overlay wants to appear above
        // or below the origin and the direction in which the element will expand.
        var /** @type {?} */ verticalStyleProperty = pos.overlayY === 'bottom' ? 'bottom' : 'top';
        // When using `bottom`, we adjust the y position such that it is the distance
        // from the bottom of the viewport rather than the top.
        var /** @type {?} */ y = verticalStyleProperty === 'top' ?
            overlayPoint.y :
            this._document.documentElement.clientHeight - (overlayPoint.y + overlayRect.height);
        // We want to set either `left` or `right` based on whether the overlay wants to appear "before"
        // or "after" the origin, which determines the direction in which the element will expand.
        // For the horizontal axis, the meaning of "before" and "after" change based on whether the
        // page is in RTL or LTR.
        var /** @type {?} */ horizontalStyleProperty;
        if (this._dir === 'rtl') {
            horizontalStyleProperty = pos.overlayX === 'end' ? 'left' : 'right';
        }
        else {
            horizontalStyleProperty = pos.overlayX === 'end' ? 'right' : 'left';
        }
        // When we're setting `right`, we adjust the x position such that it is the distance
        // from the right edge of the viewport rather than the left edge.
        var /** @type {?} */ x = horizontalStyleProperty === 'left' ?
            overlayPoint.x :
            this._document.documentElement.clientWidth - (overlayPoint.x + overlayRect.width);
        // Reset any existing styles. This is necessary in case the preferred position has
        // changed since the last `apply`.
        ['top', 'bottom', 'left', 'right'].forEach(function (p) { return element.style[p] = null; });
        element.style[verticalStyleProperty] = y + "px";
        element.style[horizontalStyleProperty] = x + "px";
        // Notify that the position has been changed along with its change properties.
        var /** @type {?} */ scrollableViewProperties = this._getScrollVisibility(element);
        var /** @type {?} */ positionChange = new ConnectedOverlayPositionChange(pos, scrollableViewProperties);
        this._onPositionChange.next(positionChange);
    };
    /**
     * Subtracts the amount that an element is overflowing on an axis from it's length.
     * @param {?} length
     * @param {...?} overflows
     * @return {?}
     */
    ConnectedPositionStrategy.prototype._subtractOverflows = /**
     * Subtracts the amount that an element is overflowing on an axis from it's length.
     * @param {?} length
     * @param {...?} overflows
     * @return {?}
     */
    function (length) {
        var overflows = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            overflows[_i - 1] = arguments[_i];
        }
        return overflows.reduce(function (currentValue, currentOverflow) {
            return currentValue - Math.max(currentOverflow, 0);
        }, length);
    };
    return ConnectedPositionStrategy;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * explicit position relative to the browser's viewport. We use flexbox, instead of
 * transforms, in order to avoid issues with subpixel rendering which can cause the
 * element to become blurry.
 */
var GlobalPositionStrategy = /** @class */ (function () {
    function GlobalPositionStrategy(_document) {
        this._document = _document;
        this._cssPosition = 'static';
        this._topOffset = '';
        this._bottomOffset = '';
        this._leftOffset = '';
        this._rightOffset = '';
        this._alignItems = '';
        this._justifyContent = '';
        this._width = '';
        this._height = '';
        /**
         * A lazily-created wrapper for the overlay element that is used as a flex container.
         */
        this._wrapper = null;
    }
    /**
     * @param {?} overlayRef
     * @return {?}
     */
    GlobalPositionStrategy.prototype.attach = /**
     * @param {?} overlayRef
     * @return {?}
     */
    function (overlayRef) {
        var /** @type {?} */ config = overlayRef.getConfig();
        this._overlayRef = overlayRef;
        if (this._width && !config.width) {
            overlayRef.updateSize({ width: this._width });
        }
        if (this._height && !config.height) {
            overlayRef.updateSize({ height: this._height });
        }
    };
    /**
     * Sets the top position of the overlay. Clears any previously set vertical position.
     * @param value New top offset.
     */
    /**
     * Sets the top position of the overlay. Clears any previously set vertical position.
     * @param {?=} value New top offset.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.top = /**
     * Sets the top position of the overlay. Clears any previously set vertical position.
     * @param {?=} value New top offset.
     * @return {?}
     */
    function (value) {
        if (value === void 0) { value = ''; }
        this._bottomOffset = '';
        this._topOffset = value;
        this._alignItems = 'flex-start';
        return this;
    };
    /**
     * Sets the left position of the overlay. Clears any previously set horizontal position.
     * @param value New left offset.
     */
    /**
     * Sets the left position of the overlay. Clears any previously set horizontal position.
     * @param {?=} value New left offset.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.left = /**
     * Sets the left position of the overlay. Clears any previously set horizontal position.
     * @param {?=} value New left offset.
     * @return {?}
     */
    function (value) {
        if (value === void 0) { value = ''; }
        this._rightOffset = '';
        this._leftOffset = value;
        this._justifyContent = 'flex-start';
        return this;
    };
    /**
     * Sets the bottom position of the overlay. Clears any previously set vertical position.
     * @param value New bottom offset.
     */
    /**
     * Sets the bottom position of the overlay. Clears any previously set vertical position.
     * @param {?=} value New bottom offset.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.bottom = /**
     * Sets the bottom position of the overlay. Clears any previously set vertical position.
     * @param {?=} value New bottom offset.
     * @return {?}
     */
    function (value) {
        if (value === void 0) { value = ''; }
        this._topOffset = '';
        this._bottomOffset = value;
        this._alignItems = 'flex-end';
        return this;
    };
    /**
     * Sets the right position of the overlay. Clears any previously set horizontal position.
     * @param value New right offset.
     */
    /**
     * Sets the right position of the overlay. Clears any previously set horizontal position.
     * @param {?=} value New right offset.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.right = /**
     * Sets the right position of the overlay. Clears any previously set horizontal position.
     * @param {?=} value New right offset.
     * @return {?}
     */
    function (value) {
        if (value === void 0) { value = ''; }
        this._leftOffset = '';
        this._rightOffset = value;
        this._justifyContent = 'flex-end';
        return this;
    };
    /**
     * Sets the overlay width and clears any previously set width.
     * @param value New width for the overlay
     * @deprecated Pass the `width` through the `OverlayConfig`.
     * @deletion-target 7.0.0
     */
    /**
     * Sets the overlay width and clears any previously set width.
     * @deprecated Pass the `width` through the `OverlayConfig`.
     * \@deletion-target 7.0.0
     * @param {?=} value New width for the overlay
     * @return {?}
     */
    GlobalPositionStrategy.prototype.width = /**
     * Sets the overlay width and clears any previously set width.
     * @deprecated Pass the `width` through the `OverlayConfig`.
     * \@deletion-target 7.0.0
     * @param {?=} value New width for the overlay
     * @return {?}
     */
    function (value) {
        if (value === void 0) { value = ''; }
        if (this._overlayRef) {
            this._overlayRef.updateSize({ width: value });
        }
        else {
            this._width = value;
        }
        return this;
    };
    /**
     * Sets the overlay height and clears any previously set height.
     * @param value New height for the overlay
     * @deprecated Pass the `height` through the `OverlayConfig`.
     * @deletion-target 7.0.0
     */
    /**
     * Sets the overlay height and clears any previously set height.
     * @deprecated Pass the `height` through the `OverlayConfig`.
     * \@deletion-target 7.0.0
     * @param {?=} value New height for the overlay
     * @return {?}
     */
    GlobalPositionStrategy.prototype.height = /**
     * Sets the overlay height and clears any previously set height.
     * @deprecated Pass the `height` through the `OverlayConfig`.
     * \@deletion-target 7.0.0
     * @param {?=} value New height for the overlay
     * @return {?}
     */
    function (value) {
        if (value === void 0) { value = ''; }
        if (this._overlayRef) {
            this._overlayRef.updateSize({ height: value });
        }
        else {
            this._height = value;
        }
        return this;
    };
    /**
     * Centers the overlay horizontally with an optional offset.
     * Clears any previously set horizontal position.
     *
     * @param offset Overlay offset from the horizontal center.
     */
    /**
     * Centers the overlay horizontally with an optional offset.
     * Clears any previously set horizontal position.
     *
     * @param {?=} offset Overlay offset from the horizontal center.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.centerHorizontally = /**
     * Centers the overlay horizontally with an optional offset.
     * Clears any previously set horizontal position.
     *
     * @param {?=} offset Overlay offset from the horizontal center.
     * @return {?}
     */
    function (offset) {
        if (offset === void 0) { offset = ''; }
        this.left(offset);
        this._justifyContent = 'center';
        return this;
    };
    /**
     * Centers the overlay vertically with an optional offset.
     * Clears any previously set vertical position.
     *
     * @param offset Overlay offset from the vertical center.
     */
    /**
     * Centers the overlay vertically with an optional offset.
     * Clears any previously set vertical position.
     *
     * @param {?=} offset Overlay offset from the vertical center.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.centerVertically = /**
     * Centers the overlay vertically with an optional offset.
     * Clears any previously set vertical position.
     *
     * @param {?=} offset Overlay offset from the vertical center.
     * @return {?}
     */
    function (offset) {
        if (offset === void 0) { offset = ''; }
        this.top(offset);
        this._alignItems = 'center';
        return this;
    };
    /**
     * Apply the position to the element.
     * @docs-private
     *
     * @returns Resolved when the styles have been applied.
     */
    /**
     * Apply the position to the element.
     * \@docs-private
     *
     * @return {?} Resolved when the styles have been applied.
     */
    GlobalPositionStrategy.prototype.apply = /**
     * Apply the position to the element.
     * \@docs-private
     *
     * @return {?} Resolved when the styles have been applied.
     */
    function () {
        // Since the overlay ref applies the strategy asynchronously, it could
        // have been disposed before it ends up being applied. If that is the
        // case, we shouldn't do anything.
        if (!this._overlayRef.hasAttached()) {
            return;
        }
        var /** @type {?} */ element = this._overlayRef.overlayElement;
        if (!this._wrapper && element.parentNode) {
            this._wrapper = this._document.createElement('div'); /** @type {?} */
            ((this._wrapper)).classList.add('cdk-global-overlay-wrapper');
            element.parentNode.insertBefore(/** @type {?} */ ((this._wrapper)), element); /** @type {?} */
            ((this._wrapper)).appendChild(element);
        }
        var /** @type {?} */ styles = element.style;
        var /** @type {?} */ parentStyles = (/** @type {?} */ (element.parentNode)).style;
        var /** @type {?} */ config = this._overlayRef.getConfig();
        styles.position = this._cssPosition;
        styles.marginLeft = config.width === '100%' ? '0' : this._leftOffset;
        styles.marginTop = config.height === '100%' ? '0' : this._topOffset;
        styles.marginBottom = this._bottomOffset;
        styles.marginRight = this._rightOffset;
        parentStyles.justifyContent = config.width === '100%' ? 'flex-start' : this._justifyContent;
        parentStyles.alignItems = config.height === '100%' ? 'flex-start' : this._alignItems;
    };
    /** Removes the wrapper element from the DOM. */
    /**
     * Removes the wrapper element from the DOM.
     * @return {?}
     */
    GlobalPositionStrategy.prototype.dispose = /**
     * Removes the wrapper element from the DOM.
     * @return {?}
     */
    function () {
        if (this._wrapper && this._wrapper.parentNode) {
            this._wrapper.parentNode.removeChild(this._wrapper);
            this._wrapper = null;
        }
    };
    return GlobalPositionStrategy;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Builder for overlay position strategy.
 */
var OverlayPositionBuilder = /** @class */ (function () {
    function OverlayPositionBuilder(_viewportRuler, _document) {
        this._viewportRuler = _viewportRuler;
        this._document = _document;
    }
    /**
     * Creates a global position strategy.
     */
    /**
     * Creates a global position strategy.
     * @return {?}
     */
    OverlayPositionBuilder.prototype.global = /**
     * Creates a global position strategy.
     * @return {?}
     */
    function () {
        return new GlobalPositionStrategy(this._document);
    };
    /**
     * Creates a relative position strategy.
     * @param elementRef
     * @param originPos
     * @param overlayPos
     */
    /**
     * Creates a relative position strategy.
     * @param {?} elementRef
     * @param {?} originPos
     * @param {?} overlayPos
     * @return {?}
     */
    OverlayPositionBuilder.prototype.connectedTo = /**
     * Creates a relative position strategy.
     * @param {?} elementRef
     * @param {?} originPos
     * @param {?} overlayPos
     * @return {?}
     */
    function (elementRef, originPos, overlayPos) {
        return new ConnectedPositionStrategy(originPos, overlayPos, elementRef, this._viewportRuler, this._document);
    };
    OverlayPositionBuilder.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    OverlayPositionBuilder.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_cdk_scrolling__["d" /* ViewportRuler */], },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_2__angular_common__["DOCUMENT"],] },] },
    ]; };
    return OverlayPositionBuilder;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Service for dispatching keyboard events that land on the body to appropriate overlay ref,
 * if any. It maintains a list of attached overlays to determine best suited overlay based
 * on event target and order of overlay opens.
 */
var OverlayKeyboardDispatcher = /** @class */ (function () {
    function OverlayKeyboardDispatcher(_document) {
        this._document = _document;
        /**
         * Currently attached overlays in the order they were attached.
         */
        this._attachedOverlays = [];
    }
    /**
     * @return {?}
     */
    OverlayKeyboardDispatcher.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._unsubscribeFromKeydownEvents();
    };
    /** Add a new overlay to the list of attached overlay refs. */
    /**
     * Add a new overlay to the list of attached overlay refs.
     * @param {?} overlayRef
     * @return {?}
     */
    OverlayKeyboardDispatcher.prototype.add = /**
     * Add a new overlay to the list of attached overlay refs.
     * @param {?} overlayRef
     * @return {?}
     */
    function (overlayRef) {
        // Lazily start dispatcher once first overlay is added
        if (!this._keydownEventSubscription) {
            this._subscribeToKeydownEvents();
        }
        this._attachedOverlays.push(overlayRef);
    };
    /** Remove an overlay from the list of attached overlay refs. */
    /**
     * Remove an overlay from the list of attached overlay refs.
     * @param {?} overlayRef
     * @return {?}
     */
    OverlayKeyboardDispatcher.prototype.remove = /**
     * Remove an overlay from the list of attached overlay refs.
     * @param {?} overlayRef
     * @return {?}
     */
    function (overlayRef) {
        var /** @type {?} */ index = this._attachedOverlays.indexOf(overlayRef);
        if (index > -1) {
            this._attachedOverlays.splice(index, 1);
        }
        // Remove the global listener once there are no more overlays.
        if (this._attachedOverlays.length === 0) {
            this._unsubscribeFromKeydownEvents();
        }
    };
    /**
     * Subscribe to keydown events that land on the body and dispatch those
     * events to the appropriate overlay.
     * @return {?}
     */
    OverlayKeyboardDispatcher.prototype._subscribeToKeydownEvents = /**
     * Subscribe to keydown events that land on the body and dispatch those
     * events to the appropriate overlay.
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ bodyKeydownEvents = Object(__WEBPACK_IMPORTED_MODULE_10_rxjs_observable_fromEvent__["a" /* fromEvent */])(this._document.body, 'keydown', true);
        this._keydownEventSubscription = bodyKeydownEvents.pipe(Object(__WEBPACK_IMPORTED_MODULE_9_rxjs_operators_filter__["a" /* filter */])(function () { return !!_this._attachedOverlays.length; })).subscribe(function (event) {
            // Dispatch keydown event to the correct overlay.
            // Dispatch keydown event to the correct overlay.
            _this._selectOverlayFromEvent(event)._keydownEvents.next(event);
        });
    };
    /**
     * Removes the global keydown subscription.
     * @return {?}
     */
    OverlayKeyboardDispatcher.prototype._unsubscribeFromKeydownEvents = /**
     * Removes the global keydown subscription.
     * @return {?}
     */
    function () {
        if (this._keydownEventSubscription) {
            this._keydownEventSubscription.unsubscribe();
            this._keydownEventSubscription = null;
        }
    };
    /**
     * Select the appropriate overlay from a keydown event.
     * @param {?} event
     * @return {?}
     */
    OverlayKeyboardDispatcher.prototype._selectOverlayFromEvent = /**
     * Select the appropriate overlay from a keydown event.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // Check if any overlays contain the event
        var /** @type {?} */ targetedOverlay = this._attachedOverlays.find(function (overlay) {
            return overlay.overlayElement === event.target ||
                overlay.overlayElement.contains(/** @type {?} */ (event.target));
        });
        // Use the overlay if it exists, otherwise choose the most recently attached one
        return targetedOverlay || this._attachedOverlays[this._attachedOverlays.length - 1];
    };
    OverlayKeyboardDispatcher.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    OverlayKeyboardDispatcher.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_2__angular_common__["DOCUMENT"],] },] },
    ]; };
    return OverlayKeyboardDispatcher;
}());
/**
 * \@docs-private
 * @param {?} dispatcher
 * @param {?} _document
 * @return {?}
 */
function OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY(dispatcher, _document) {
    return dispatcher || new OverlayKeyboardDispatcher(_document);
}
/**
 * \@docs-private
 */
var OVERLAY_KEYBOARD_DISPATCHER_PROVIDER = {
    // If there is already an OverlayKeyboardDispatcher available, use that.
    // Otherwise, provide a new one.
    provide: OverlayKeyboardDispatcher,
    deps: [
        [new __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"](), new __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"](), OverlayKeyboardDispatcher],
        /** @type {?} */ (
        // Coerce to `InjectionToken` so that the `deps` match the "shape"
        // of the type expected by Angular
        __WEBPACK_IMPORTED_MODULE_2__angular_common__["DOCUMENT"])
    ],
    useFactory: OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Container inside which all overlays will render.
 */
var OverlayContainer = /** @class */ (function () {
    function OverlayContainer(_document) {
        this._document = _document;
    }
    /**
     * @return {?}
     */
    OverlayContainer.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this._containerElement && this._containerElement.parentNode) {
            this._containerElement.parentNode.removeChild(this._containerElement);
        }
    };
    /**
     * This method returns the overlay container element. It will lazily
     * create the element the first time  it is called to facilitate using
     * the container in non-browser environments.
     * @returns the container element
     */
    /**
     * This method returns the overlay container element. It will lazily
     * create the element the first time  it is called to facilitate using
     * the container in non-browser environments.
     * @return {?} the container element
     */
    OverlayContainer.prototype.getContainerElement = /**
     * This method returns the overlay container element. It will lazily
     * create the element the first time  it is called to facilitate using
     * the container in non-browser environments.
     * @return {?} the container element
     */
    function () {
        if (!this._containerElement) {
            this._createContainer();
        }
        return this._containerElement;
    };
    /**
     * Create the overlay container element, which is simply a div
     * with the 'cdk-overlay-container' class on the document body.
     */
    /**
     * Create the overlay container element, which is simply a div
     * with the 'cdk-overlay-container' class on the document body.
     * @return {?}
     */
    OverlayContainer.prototype._createContainer = /**
     * Create the overlay container element, which is simply a div
     * with the 'cdk-overlay-container' class on the document body.
     * @return {?}
     */
    function () {
        var /** @type {?} */ container = this._document.createElement('div');
        container.classList.add('cdk-overlay-container');
        this._document.body.appendChild(container);
        this._containerElement = container;
    };
    OverlayContainer.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    OverlayContainer.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_2__angular_common__["DOCUMENT"],] },] },
    ]; };
    return OverlayContainer;
}());
/**
 * \@docs-private
 * @param {?} parentContainer
 * @param {?} _document
 * @return {?}
 */
function OVERLAY_CONTAINER_PROVIDER_FACTORY(parentContainer, _document) {
    return parentContainer || new OverlayContainer(_document);
}
/**
 * \@docs-private
 */
var OVERLAY_CONTAINER_PROVIDER = {
    // If there is already an OverlayContainer available, use that. Otherwise, provide a new one.
    provide: OverlayContainer,
    deps: [
        [new __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"](), new __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"](), OverlayContainer],
        /** @type {?} */ (__WEBPACK_IMPORTED_MODULE_2__angular_common__["DOCUMENT"] // We need to use the InjectionToken somewhere to keep TS happy
        ) // We need to use the InjectionToken somewhere to keep TS happy
    ],
    useFactory: OVERLAY_CONTAINER_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Next overlay unique ID.
 */
var nextUniqueId = 0;
/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalOutlet, so any kind of Portal can be loaded into one.
 */
var Overlay = /** @class */ (function () {
    function Overlay(scrollStrategies, _overlayContainer, _componentFactoryResolver, _positionBuilder, _keyboardDispatcher, _appRef, _injector, _ngZone, _document) {
        this.scrollStrategies = scrollStrategies;
        this._overlayContainer = _overlayContainer;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._positionBuilder = _positionBuilder;
        this._keyboardDispatcher = _keyboardDispatcher;
        this._appRef = _appRef;
        this._injector = _injector;
        this._ngZone = _ngZone;
        this._document = _document;
    }
    /**
     * Creates an overlay.
     * @param config Configuration applied to the overlay.
     * @returns Reference to the created overlay.
     */
    /**
     * Creates an overlay.
     * @param {?=} config Configuration applied to the overlay.
     * @return {?} Reference to the created overlay.
     */
    Overlay.prototype.create = /**
     * Creates an overlay.
     * @param {?=} config Configuration applied to the overlay.
     * @return {?} Reference to the created overlay.
     */
    function (config) {
        var /** @type {?} */ pane = this._createPaneElement();
        var /** @type {?} */ portalOutlet = this._createPortalOutlet(pane);
        return new OverlayRef(portalOutlet, pane, new OverlayConfig(config), this._ngZone, this._keyboardDispatcher, this._document);
    };
    /**
     * Gets a position builder that can be used, via fluent API,
     * to construct and configure a position strategy.
     * @returns An overlay position builder.
     */
    /**
     * Gets a position builder that can be used, via fluent API,
     * to construct and configure a position strategy.
     * @return {?} An overlay position builder.
     */
    Overlay.prototype.position = /**
     * Gets a position builder that can be used, via fluent API,
     * to construct and configure a position strategy.
     * @return {?} An overlay position builder.
     */
    function () {
        return this._positionBuilder;
    };
    /**
     * Creates the DOM element for an overlay and appends it to the overlay container.
     * @return {?} Newly-created pane element
     */
    Overlay.prototype._createPaneElement = /**
     * Creates the DOM element for an overlay and appends it to the overlay container.
     * @return {?} Newly-created pane element
     */
    function () {
        var /** @type {?} */ pane = this._document.createElement('div');
        pane.id = "cdk-overlay-" + nextUniqueId++;
        pane.classList.add('cdk-overlay-pane');
        this._overlayContainer.getContainerElement().appendChild(pane);
        return pane;
    };
    /**
     * Create a DomPortalOutlet into which the overlay content can be loaded.
     * @param {?} pane The DOM element to turn into a portal outlet.
     * @return {?} A portal outlet for the given DOM element.
     */
    Overlay.prototype._createPortalOutlet = /**
     * Create a DomPortalOutlet into which the overlay content can be loaded.
     * @param {?} pane The DOM element to turn into a portal outlet.
     * @return {?} A portal outlet for the given DOM element.
     */
    function (pane) {
        return new __WEBPACK_IMPORTED_MODULE_4__angular_cdk_portal__["b" /* DomPortalOutlet */](pane, this._componentFactoryResolver, this._appRef, this._injector);
    };
    Overlay.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    Overlay.ctorParameters = function () { return [
        { type: ScrollStrategyOptions, },
        { type: OverlayContainer, },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ComponentFactoryResolver"], },
        { type: OverlayPositionBuilder, },
        { type: OverlayKeyboardDispatcher, },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ApplicationRef"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injector"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [__WEBPACK_IMPORTED_MODULE_2__angular_common__["DOCUMENT"],] },] },
    ]; };
    return Overlay;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Default set of positions for the overlay. Follows the behavior of a dropdown.
 */
var defaultPositionList = [
    new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
    new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
    new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
    new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
];
/**
 * Injection token that determines the scroll handling while the connected overlay is open.
 */
var CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["InjectionToken"]('cdk-connected-overlay-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
function CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.reposition(); };
}
/**
 * \@docs-private
 */
var CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER = {
    provide: CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Directive applied to an element to make it usable as an origin for an Overlay using a
 * ConnectedPositionStrategy.
 */
var CdkOverlayOrigin = /** @class */ (function () {
    function CdkOverlayOrigin(elementRef) {
        this.elementRef = elementRef;
    }
    CdkOverlayOrigin.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]',
                    exportAs: 'cdkOverlayOrigin',
                },] },
    ];
    /** @nocollapse */
    CdkOverlayOrigin.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
    ]; };
    return CdkOverlayOrigin;
}());
/**
 * Directive to facilitate declarative creation of an Overlay using a ConnectedPositionStrategy.
 */
var CdkConnectedOverlay = /** @class */ (function () {
    // TODO(jelbourn): inputs for size, scroll behavior, animation, etc.
    function CdkConnectedOverlay(_overlay, templateRef, viewContainerRef, _scrollStrategy, _dir) {
        this._overlay = _overlay;
        this._scrollStrategy = _scrollStrategy;
        this._dir = _dir;
        this._hasBackdrop = false;
        this._lockPosition = false;
        this._backdropSubscription = __WEBPACK_IMPORTED_MODULE_8_rxjs_Subscription__["a" /* Subscription */].EMPTY;
        this._offsetX = 0;
        this._offsetY = 0;
        /**
         * Strategy to be used when handling scroll events while the overlay is open.
         */
        this.scrollStrategy = this._scrollStrategy();
        /**
         * Whether the overlay is open.
         */
        this.open = false;
        /**
         * Event emitted when the backdrop is clicked.
         */
        this.backdropClick = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * Event emitted when the position has changed.
         */
        this.positionChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * Event emitted when the overlay has been attached.
         */
        this.attach = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        /**
         * Event emitted when the overlay has been detached.
         */
        this.detach = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this._templatePortal = new __WEBPACK_IMPORTED_MODULE_4__angular_cdk_portal__["d" /* TemplatePortal */](templateRef, viewContainerRef);
    }
    Object.defineProperty(CdkConnectedOverlay.prototype, "offsetX", {
        get: /**
         * The offset in pixels for the overlay connection point on the x-axis
         * @return {?}
         */
        function () { return this._offsetX; },
        set: /**
         * @param {?} offsetX
         * @return {?}
         */
        function (offsetX) {
            this._offsetX = offsetX;
            if (this._position) {
                this._position.withOffsetX(offsetX);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "offsetY", {
        get: /**
         * The offset in pixels for the overlay connection point on the y-axis
         * @return {?}
         */
        function () { return this._offsetY; },
        set: /**
         * @param {?} offsetY
         * @return {?}
         */
        function (offsetY) {
            this._offsetY = offsetY;
            if (this._position) {
                this._position.withOffsetY(offsetY);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "hasBackdrop", {
        get: /**
         * Whether or not the overlay should attach a backdrop.
         * @return {?}
         */
        function () { return this._hasBackdrop; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this._hasBackdrop = Object(__WEBPACK_IMPORTED_MODULE_11__angular_cdk_coercion__["a" /* coerceBooleanProperty */])(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "lockPosition", {
        get: /**
         * Whether or not the overlay should be locked when scrolling.
         * @return {?}
         */
        function () { return this._lockPosition; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this._lockPosition = Object(__WEBPACK_IMPORTED_MODULE_11__angular_cdk_coercion__["a" /* coerceBooleanProperty */])(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedOrigin", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.origin; },
        set: /**
         * @param {?} _origin
         * @return {?}
         */
        function (_origin) { this.origin = _origin; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedPositions", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.positions; },
        set: /**
         * @param {?} _positions
         * @return {?}
         */
        function (_positions) { this.positions = _positions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedOffsetX", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.offsetX; },
        set: /**
         * @param {?} _offsetX
         * @return {?}
         */
        function (_offsetX) { this.offsetX = _offsetX; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedOffsetY", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.offsetY; },
        set: /**
         * @param {?} _offsetY
         * @return {?}
         */
        function (_offsetY) { this.offsetY = _offsetY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedWidth", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.width; },
        set: /**
         * @param {?} _width
         * @return {?}
         */
        function (_width) { this.width = _width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedHeight", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.height; },
        set: /**
         * @param {?} _height
         * @return {?}
         */
        function (_height) { this.height = _height; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedMinWidth", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.minWidth; },
        set: /**
         * @param {?} _minWidth
         * @return {?}
         */
        function (_minWidth) { this.minWidth = _minWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedMinHeight", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.minHeight; },
        set: /**
         * @param {?} _minHeight
         * @return {?}
         */
        function (_minHeight) { this.minHeight = _minHeight; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedBackdropClass", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.backdropClass; },
        set: /**
         * @param {?} _backdropClass
         * @return {?}
         */
        function (_backdropClass) { this.backdropClass = _backdropClass; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedScrollStrategy", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.scrollStrategy; },
        set: /**
         * @param {?} _scrollStrategy
         * @return {?}
         */
        function (_scrollStrategy) {
            this.scrollStrategy = _scrollStrategy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedOpen", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.open; },
        set: /**
         * @param {?} _open
         * @return {?}
         */
        function (_open) { this.open = _open; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "_deprecatedHasBackdrop", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.hasBackdrop; },
        set: /**
         * @param {?} _hasBackdrop
         * @return {?}
         */
        function (_hasBackdrop) { this.hasBackdrop = _hasBackdrop; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "overlayRef", {
        /** The associated overlay reference. */
        get: /**
         * The associated overlay reference.
         * @return {?}
         */
        function () {
            return this._overlayRef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkConnectedOverlay.prototype, "dir", {
        /** The element's layout direction. */
        get: /**
         * The element's layout direction.
         * @return {?}
         */
        function () {
            return this._dir ? this._dir.value : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    CdkConnectedOverlay.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._destroyOverlay();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    CdkConnectedOverlay.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (this._position) {
            if (changes['positions'] || changes['_deprecatedPositions']) {
                this._position.withPositions(this.positions);
            }
            if (changes['lockPosition']) {
                this._position.withLockedPosition(this.lockPosition);
            }
            if (changes['origin'] || changes['_deprecatedOrigin']) {
                this._position.setOrigin(this.origin.elementRef);
                if (this.open) {
                    this._position.apply();
                }
            }
        }
        if (changes['open'] || changes['_deprecatedOpen']) {
            this.open ? this._attachOverlay() : this._detachOverlay();
        }
    };
    /**
     * Creates an overlay
     * @return {?}
     */
    CdkConnectedOverlay.prototype._createOverlay = /**
     * Creates an overlay
     * @return {?}
     */
    function () {
        if (!this.positions || !this.positions.length) {
            this.positions = defaultPositionList;
        }
        this._overlayRef = this._overlay.create(this._buildConfig());
    };
    /**
     * Builds the overlay config based on the directive's inputs
     * @return {?}
     */
    CdkConnectedOverlay.prototype._buildConfig = /**
     * Builds the overlay config based on the directive's inputs
     * @return {?}
     */
    function () {
        var /** @type {?} */ positionStrategy = this._position = this._createPositionStrategy();
        var /** @type {?} */ overlayConfig = new OverlayConfig({
            positionStrategy: positionStrategy,
            scrollStrategy: this.scrollStrategy,
            hasBackdrop: this.hasBackdrop
        });
        if (this.width || this.width === 0) {
            overlayConfig.width = this.width;
        }
        if (this.height || this.height === 0) {
            overlayConfig.height = this.height;
        }
        if (this.minWidth || this.minWidth === 0) {
            overlayConfig.minWidth = this.minWidth;
        }
        if (this.minHeight || this.minHeight === 0) {
            overlayConfig.minHeight = this.minHeight;
        }
        if (this.backdropClass) {
            overlayConfig.backdropClass = this.backdropClass;
        }
        return overlayConfig;
    };
    /**
     * Returns the position strategy of the overlay to be set on the overlay config
     * @return {?}
     */
    CdkConnectedOverlay.prototype._createPositionStrategy = /**
     * Returns the position strategy of the overlay to be set on the overlay config
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ primaryPosition = this.positions[0];
        var /** @type {?} */ originPoint = { originX: primaryPosition.originX, originY: primaryPosition.originY };
        var /** @type {?} */ overlayPoint = { overlayX: primaryPosition.overlayX, overlayY: primaryPosition.overlayY };
        var /** @type {?} */ strategy = this._overlay.position()
            .connectedTo(this.origin.elementRef, originPoint, overlayPoint)
            .withOffsetX(this.offsetX)
            .withOffsetY(this.offsetY)
            .withLockedPosition(this.lockPosition);
        for (var /** @type {?} */ i = 1; i < this.positions.length; i++) {
            strategy.withFallbackPosition({ originX: this.positions[i].originX, originY: this.positions[i].originY }, { overlayX: this.positions[i].overlayX, overlayY: this.positions[i].overlayY });
        }
        strategy.onPositionChange.subscribe(function (pos) { return _this.positionChange.emit(pos); });
        return strategy;
    };
    /**
     * Attaches the overlay and subscribes to backdrop clicks if backdrop exists
     * @return {?}
     */
    CdkConnectedOverlay.prototype._attachOverlay = /**
     * Attaches the overlay and subscribes to backdrop clicks if backdrop exists
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this._overlayRef) {
            this._createOverlay(); /** @type {?} */
            ((this._overlayRef)).keydownEvents().subscribe(function (event) {
                if (event.keyCode === __WEBPACK_IMPORTED_MODULE_12__angular_cdk_keycodes__["c" /* ESCAPE */]) {
                    _this._detachOverlay();
                }
            });
        }
        else {
            // Update the overlay size, in case the directive's inputs have changed
            this._overlayRef.updateSize({
                width: this.width,
                minWidth: this.minWidth,
                height: this.height,
                minHeight: this.minHeight,
            });
        }
        this._position.withDirection(this.dir);
        this._overlayRef.setDirection(this.dir);
        if (!this._overlayRef.hasAttached()) {
            this._overlayRef.attach(this._templatePortal);
            this.attach.emit();
        }
        if (this.hasBackdrop) {
            this._backdropSubscription = this._overlayRef.backdropClick().subscribe(function (event) {
                _this.backdropClick.emit(event);
            });
        }
    };
    /**
     * Detaches the overlay and unsubscribes to backdrop clicks if backdrop exists
     * @return {?}
     */
    CdkConnectedOverlay.prototype._detachOverlay = /**
     * Detaches the overlay and unsubscribes to backdrop clicks if backdrop exists
     * @return {?}
     */
    function () {
        if (this._overlayRef) {
            this._overlayRef.detach();
            this.detach.emit();
        }
        this._backdropSubscription.unsubscribe();
    };
    /**
     * Destroys the overlay created by this directive.
     * @return {?}
     */
    CdkConnectedOverlay.prototype._destroyOverlay = /**
     * Destroys the overlay created by this directive.
     * @return {?}
     */
    function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
        this._backdropSubscription.unsubscribe();
    };
    CdkConnectedOverlay.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]',
                    exportAs: 'cdkConnectedOverlay'
                },] },
    ];
    /** @nocollapse */
    CdkConnectedOverlay.ctorParameters = function () { return [
        { type: Overlay, },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"], },
        { type: undefined, decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Inject"], args: [CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY,] },] },
        { type: __WEBPACK_IMPORTED_MODULE_3__angular_cdk_bidi__["b" /* Directionality */], decorators: [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"] },] },
    ]; };
    CdkConnectedOverlay.propDecorators = {
        "origin": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayOrigin',] },],
        "positions": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayPositions',] },],
        "offsetX": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayOffsetX',] },],
        "offsetY": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayOffsetY',] },],
        "width": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayWidth',] },],
        "height": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayHeight',] },],
        "minWidth": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayMinWidth',] },],
        "minHeight": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayMinHeight',] },],
        "backdropClass": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayBackdropClass',] },],
        "scrollStrategy": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayScrollStrategy',] },],
        "open": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayOpen',] },],
        "hasBackdrop": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayHasBackdrop',] },],
        "lockPosition": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['cdkConnectedOverlayLockPosition',] },],
        "_deprecatedOrigin": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['origin',] },],
        "_deprecatedPositions": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['positions',] },],
        "_deprecatedOffsetX": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['offsetX',] },],
        "_deprecatedOffsetY": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['offsetY',] },],
        "_deprecatedWidth": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['width',] },],
        "_deprecatedHeight": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['height',] },],
        "_deprecatedMinWidth": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['minWidth',] },],
        "_deprecatedMinHeight": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['minHeight',] },],
        "_deprecatedBackdropClass": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['backdropClass',] },],
        "_deprecatedScrollStrategy": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['scrollStrategy',] },],
        "_deprecatedOpen": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['open',] },],
        "_deprecatedHasBackdrop": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"], args: ['hasBackdrop',] },],
        "backdropClick": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
        "positionChange": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
        "attach": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
        "detach": [{ type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"] },],
    };
    return CdkConnectedOverlay;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var OVERLAY_PROVIDERS = [
    Overlay,
    OverlayPositionBuilder,
    OVERLAY_KEYBOARD_DISPATCHER_PROVIDER,
    __WEBPACK_IMPORTED_MODULE_1__angular_cdk_scrolling__["c" /* VIEWPORT_RULER_PROVIDER */],
    OVERLAY_CONTAINER_PROVIDER,
    CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER,
];
var OverlayModule = /** @class */ (function () {
    function OverlayModule() {
    }
    OverlayModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    imports: [__WEBPACK_IMPORTED_MODULE_3__angular_cdk_bidi__["a" /* BidiModule */], __WEBPACK_IMPORTED_MODULE_4__angular_cdk_portal__["c" /* PortalModule */], __WEBPACK_IMPORTED_MODULE_1__angular_cdk_scrolling__["a" /* ScrollDispatchModule */]],
                    exports: [CdkConnectedOverlay, CdkOverlayOrigin, __WEBPACK_IMPORTED_MODULE_1__angular_cdk_scrolling__["a" /* ScrollDispatchModule */]],
                    declarations: [CdkConnectedOverlay, CdkOverlayOrigin],
                    providers: [OVERLAY_PROVIDERS, ScrollStrategyOptions],
                },] },
    ];
    /** @nocollapse */
    OverlayModule.ctorParameters = function () { return []; };
    return OverlayModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Alternative to OverlayContainer that supports correct displaying of overlay elements in
 * Fullscreen mode
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
 *
 * Should be provided in the root component.
 */
var FullscreenOverlayContainer = /** @class */ (function (_super) {
    Object(__WEBPACK_IMPORTED_MODULE_5_tslib__["b" /* __extends */])(FullscreenOverlayContainer, _super);
    function FullscreenOverlayContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    FullscreenOverlayContainer.prototype._createContainer = /**
     * @return {?}
     */
    function () {
        var _this = this;
        _super.prototype._createContainer.call(this);
        this._adjustParentForFullscreenChange();
        this._addFullscreenChangeListener(function () { return _this._adjustParentForFullscreenChange(); });
    };
    /**
     * @return {?}
     */
    FullscreenOverlayContainer.prototype._adjustParentForFullscreenChange = /**
     * @return {?}
     */
    function () {
        if (!this._containerElement) {
            return;
        }
        var /** @type {?} */ fullscreenElement = this.getFullscreenElement();
        var /** @type {?} */ parent = fullscreenElement || document.body;
        parent.appendChild(this._containerElement);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    FullscreenOverlayContainer.prototype._addFullscreenChangeListener = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        if (document.fullscreenEnabled) {
            document.addEventListener('fullscreenchange', fn);
        }
        else if (document.webkitFullscreenEnabled) {
            document.addEventListener('webkitfullscreenchange', fn);
        }
        else if ((/** @type {?} */ (document)).mozFullScreenEnabled) {
            document.addEventListener('mozfullscreenchange', fn);
        }
        else if ((/** @type {?} */ (document)).msFullscreenEnabled) {
            document.addEventListener('MSFullscreenChange', fn);
        }
    };
    /**
     * When the page is put into fullscreen mode, a specific element is specified.
     * Only that element and its children are visible when in fullscreen mode.
     */
    /**
     * When the page is put into fullscreen mode, a specific element is specified.
     * Only that element and its children are visible when in fullscreen mode.
     * @return {?}
     */
    FullscreenOverlayContainer.prototype.getFullscreenElement = /**
     * When the page is put into fullscreen mode, a specific element is specified.
     * Only that element and its children are visible when in fullscreen mode.
     * @return {?}
     */
    function () {
        return document.fullscreenElement ||
            document.webkitFullscreenElement ||
            (/** @type {?} */ (document)).mozFullScreenElement ||
            (/** @type {?} */ (document)).msFullscreenElement ||
            null;
    };
    FullscreenOverlayContainer.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    FullscreenOverlayContainer.ctorParameters = function () { return []; };
    return FullscreenOverlayContainer;
}(OverlayContainer));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=overlay.es5.js.map


/***/ }),

/***/ "../../../cdk/esm5/platform.es5.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Platform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return supportsPassiveEventListeners; });
/* unused harmony export getSupportedInputTypes */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PlatformModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

// Whether the current platform supports the V8 Break Iterator. The V8 check
// is necessary to detect all Blink based browsers.
var hasV8BreakIterator = (typeof Intl !== 'undefined' && (/** @type {?} */ (Intl)).v8BreakIterator);
/**
 * Service to detect the current platform by comparing the userAgent strings and
 * checking browser-specific global properties.
 */
var Platform = /** @class */ (function () {
    function Platform() {
        /**
         * Whether the Angular application is being rendered in the browser.
         */
        this.isBrowser = typeof document === 'object' && !!document;
        /**
         * Whether the current browser is Microsoft Edge.
         */
        this.EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent);
        /**
         * Whether the current rendering engine is Microsoft Trident.
         */
        this.TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);
        /**
         * Whether the current rendering engine is Blink.
         */
        this.BLINK = this.isBrowser && (!!((/** @type {?} */ (window)).chrome || hasV8BreakIterator) &&
            typeof CSS !== 'undefined' && !this.EDGE && !this.TRIDENT);
        /**
         * Whether the current rendering engine is WebKit.
         */
        this.WEBKIT = this.isBrowser &&
            /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT;
        /**
         * Whether the current platform is Apple iOS.
         */
        this.IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) &&
            !(/** @type {?} */ (window)).MSStream;
        /**
         * Whether the current browser is Firefox.
         */
        this.FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);
        /**
         * Whether the current platform is Android.
         */
        this.ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;
        /**
         * Whether the current browser is Safari.
         */
        this.SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
    }
    Platform.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    Platform.ctorParameters = function () { return []; };
    return Platform;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Cached result of whether the user's browser supports passive event listeners.
 */
var supportsPassiveEvents;
/**
 * Checks whether the user's browser supports passive event listeners.
 * See: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 * @return {?}
 */
function supportsPassiveEventListeners() {
    if (supportsPassiveEvents == null && typeof window !== 'undefined') {
        try {
            window.addEventListener('test', /** @type {?} */ ((null)), Object.defineProperty({}, 'passive', {
                get: function () { return supportsPassiveEvents = true; }
            }));
        }
        finally {
            supportsPassiveEvents = supportsPassiveEvents || false;
        }
    }
    return supportsPassiveEvents;
}
/**
 * Cached result Set of input types support by the current browser.
 */
var supportedInputTypes;
/**
 * Types of `<input>` that *might* be supported.
 */
var candidateInputTypes = [
    'color',
    'button',
    'checkbox',
    'date',
    'datetime-local',
    'email',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week',
];
/**
 * @return {?} The input types supported by this browser.
 */
function getSupportedInputTypes() {
    // Result is cached.
    if (supportedInputTypes) {
        return supportedInputTypes;
    }
    // We can't check if an input type is not supported until we're on the browser, so say that
    // everything is supported when not on the browser. We don't use `Platform` here since it's
    // just a helper function and can't inject it.
    if (typeof document !== 'object' || !document) {
        supportedInputTypes = new Set(candidateInputTypes);
        return supportedInputTypes;
    }
    var /** @type {?} */ featureTestInput = document.createElement('input');
    supportedInputTypes = new Set(candidateInputTypes.filter(function (value) {
        featureTestInput.setAttribute('type', value);
        return featureTestInput.type === value;
    }));
    return supportedInputTypes;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var PlatformModule = /** @class */ (function () {
    function PlatformModule() {
    }
    PlatformModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    providers: [Platform]
                },] },
    ];
    /** @nocollapse */
    PlatformModule.ctorParameters = function () { return []; };
    return PlatformModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=platform.es5.js.map


/***/ }),

/***/ "../../../cdk/esm5/portal.es5.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export DomPortalHost */
/* unused harmony export PortalHostDirective */
/* unused harmony export TemplatePortalDirective */
/* unused harmony export BasePortalHost */
/* unused harmony export Portal */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentPortal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return TemplatePortal; });
/* unused harmony export BasePortalOutlet */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DomPortalOutlet; });
/* unused harmony export CdkPortal */
/* unused harmony export CdkPortalOutlet */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return PortalModule; });
/* unused harmony export PortalInjector */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__("../../../../tslib/tslib.es6.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */




/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Throws an exception when attempting to attach a null portal to a host.
 * \@docs-private
 * @return {?}
 */
function throwNullPortalError() {
    throw Error('Must provide a portal to attach');
}
/**
 * Throws an exception when attempting to attach a portal to a host that is already attached.
 * \@docs-private
 * @return {?}
 */
function throwPortalAlreadyAttachedError() {
    throw Error('Host already has a portal attached');
}
/**
 * Throws an exception when attempting to attach a portal to an already-disposed host.
 * \@docs-private
 * @return {?}
 */
function throwPortalOutletAlreadyDisposedError() {
    throw Error('This PortalOutlet has already been disposed');
}
/**
 * Throws an exception when attempting to attach an unknown portal type.
 * \@docs-private
 * @return {?}
 */
function throwUnknownPortalTypeError() {
    throw Error('Attempting to attach an unknown Portal type. BasePortalOutlet accepts either ' +
        'a ComponentPortal or a TemplatePortal.');
}
/**
 * Throws an exception when attempting to attach a portal to a null host.
 * \@docs-private
 * @return {?}
 */
function throwNullPortalOutletError() {
    throw Error('Attempting to attach a portal to a null PortalOutlet');
}
/**
 * Throws an exception when attempting to detach a portal that is not attached.
 * \@docs-private
 * @return {?}
 */
function throwNoPortalAttachedError() {
    throw Error('Attempting to detach a portal that is not attached to a host');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Interface that can be used to generically type a class.
 * @record
 */

/**
 * A `Portal` is something that you want to render somewhere else.
 * It can be attach to / detached from a `PortalOutlet`.
 * @abstract
 */
var Portal = /** @class */ (function () {
    function Portal() {
    }
    /** Attach this portal to a host. */
    /**
     * Attach this portal to a host.
     * @param {?} host
     * @return {?}
     */
    Portal.prototype.attach = /**
     * Attach this portal to a host.
     * @param {?} host
     * @return {?}
     */
    function (host) {
        if (host == null) {
            throwNullPortalOutletError();
        }
        if (host.hasAttached()) {
            throwPortalAlreadyAttachedError();
        }
        this._attachedHost = host;
        return /** @type {?} */ (host.attach(this));
    };
    /** Detach this portal from its host */
    /**
     * Detach this portal from its host
     * @return {?}
     */
    Portal.prototype.detach = /**
     * Detach this portal from its host
     * @return {?}
     */
    function () {
        var /** @type {?} */ host = this._attachedHost;
        if (host == null) {
            throwNoPortalAttachedError();
        }
        else {
            this._attachedHost = null;
            host.detach();
        }
    };
    Object.defineProperty(Portal.prototype, "isAttached", {
        /** Whether this portal is attached to a host. */
        get: /**
         * Whether this portal is attached to a host.
         * @return {?}
         */
        function () {
            return this._attachedHost != null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the PortalOutlet reference without performing `attach()`. This is used directly by
     * the PortalOutlet when it is performing an `attach()` or `detach()`.
     */
    /**
     * Sets the PortalOutlet reference without performing `attach()`. This is used directly by
     * the PortalOutlet when it is performing an `attach()` or `detach()`.
     * @param {?} host
     * @return {?}
     */
    Portal.prototype.setAttachedHost = /**
     * Sets the PortalOutlet reference without performing `attach()`. This is used directly by
     * the PortalOutlet when it is performing an `attach()` or `detach()`.
     * @param {?} host
     * @return {?}
     */
    function (host) {
        this._attachedHost = host;
    };
    return Portal;
}());
/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
var ComponentPortal = /** @class */ (function (_super) {
    Object(__WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */])(ComponentPortal, _super);
    function ComponentPortal(component, viewContainerRef, injector) {
        var _this = _super.call(this) || this;
        _this.component = component;
        _this.viewContainerRef = viewContainerRef;
        _this.injector = injector;
        return _this;
    }
    return ComponentPortal;
}(Portal));
/**
 * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
 */
var TemplatePortal = /** @class */ (function (_super) {
    Object(__WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */])(TemplatePortal, _super);
    function TemplatePortal(template, viewContainerRef, context) {
        var _this = _super.call(this) || this;
        _this.templateRef = template;
        _this.viewContainerRef = viewContainerRef;
        _this.context = context;
        return _this;
    }
    Object.defineProperty(TemplatePortal.prototype, "origin", {
        get: /**
         * @return {?}
         */
        function () {
            return this.templateRef.elementRef;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Attach the the portal to the provided `PortalOutlet`.
     * When a context is provided it will override the `context` property of the `TemplatePortal`
     * instance.
     */
    /**
     * Attach the the portal to the provided `PortalOutlet`.
     * When a context is provided it will override the `context` property of the `TemplatePortal`
     * instance.
     * @param {?} host
     * @param {?=} context
     * @return {?}
     */
    TemplatePortal.prototype.attach = /**
     * Attach the the portal to the provided `PortalOutlet`.
     * When a context is provided it will override the `context` property of the `TemplatePortal`
     * instance.
     * @param {?} host
     * @param {?=} context
     * @return {?}
     */
    function (host, context) {
        if (context === void 0) { context = this.context; }
        this.context = context;
        return _super.prototype.attach.call(this, host);
    };
    /**
     * @return {?}
     */
    TemplatePortal.prototype.detach = /**
     * @return {?}
     */
    function () {
        this.context = undefined;
        return _super.prototype.detach.call(this);
    };
    return TemplatePortal;
}(Portal));
/**
 * A `PortalOutlet` is an space that can contain a single `Portal`.
 * @record
 */

/**
 * Partial implementation of PortalOutlet that handles attaching
 * ComponentPortal and TemplatePortal.
 * @abstract
 */
var BasePortalOutlet = /** @class */ (function () {
    function BasePortalOutlet() {
        /**
         * Whether this host has already been permanently disposed.
         */
        this._isDisposed = false;
    }
    /** Whether this host has an attached portal. */
    /**
     * Whether this host has an attached portal.
     * @return {?}
     */
    BasePortalOutlet.prototype.hasAttached = /**
     * Whether this host has an attached portal.
     * @return {?}
     */
    function () {
        return !!this._attachedPortal;
    };
    /** Attaches a portal. */
    /**
     * Attaches a portal.
     * @param {?} portal
     * @return {?}
     */
    BasePortalOutlet.prototype.attach = /**
     * Attaches a portal.
     * @param {?} portal
     * @return {?}
     */
    function (portal) {
        if (!portal) {
            throwNullPortalError();
        }
        if (this.hasAttached()) {
            throwPortalAlreadyAttachedError();
        }
        if (this._isDisposed) {
            throwPortalOutletAlreadyDisposedError();
        }
        if (portal instanceof ComponentPortal) {
            this._attachedPortal = portal;
            return this.attachComponentPortal(portal);
        }
        else if (portal instanceof TemplatePortal) {
            this._attachedPortal = portal;
            return this.attachTemplatePortal(portal);
        }
        throwUnknownPortalTypeError();
    };
    /** Detaches a previously attached portal. */
    /**
     * Detaches a previously attached portal.
     * @return {?}
     */
    BasePortalOutlet.prototype.detach = /**
     * Detaches a previously attached portal.
     * @return {?}
     */
    function () {
        if (this._attachedPortal) {
            this._attachedPortal.setAttachedHost(null);
            this._attachedPortal = null;
        }
        this._invokeDisposeFn();
    };
    /** Permanently dispose of this portal host. */
    /**
     * Permanently dispose of this portal host.
     * @return {?}
     */
    BasePortalOutlet.prototype.dispose = /**
     * Permanently dispose of this portal host.
     * @return {?}
     */
    function () {
        if (this.hasAttached()) {
            this.detach();
        }
        this._invokeDisposeFn();
        this._isDisposed = true;
    };
    /** @docs-private */
    /**
     * \@docs-private
     * @param {?} fn
     * @return {?}
     */
    BasePortalOutlet.prototype.setDisposeFn = /**
     * \@docs-private
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this._disposeFn = fn;
    };
    /**
     * @return {?}
     */
    BasePortalOutlet.prototype._invokeDisposeFn = /**
     * @return {?}
     */
    function () {
        if (this._disposeFn) {
            this._disposeFn();
            this._disposeFn = null;
        }
    };
    return BasePortalOutlet;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * A PortalOutlet for attaching portals to an arbitrary DOM element outside of the Angular
 * application context.
 */
var DomPortalOutlet = /** @class */ (function (_super) {
    Object(__WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */])(DomPortalOutlet, _super);
    function DomPortalOutlet(outletElement, _componentFactoryResolver, _appRef, _defaultInjector) {
        var _this = _super.call(this) || this;
        _this.outletElement = outletElement;
        _this._componentFactoryResolver = _componentFactoryResolver;
        _this._appRef = _appRef;
        _this._defaultInjector = _defaultInjector;
        return _this;
    }
    /**
     * Attach the given ComponentPortal to DOM element using the ComponentFactoryResolver.
     * @param portal Portal to be attached
     * @returns Reference to the created component.
     */
    /**
     * Attach the given ComponentPortal to DOM element using the ComponentFactoryResolver.
     * @template T
     * @param {?} portal Portal to be attached
     * @return {?} Reference to the created component.
     */
    DomPortalOutlet.prototype.attachComponentPortal = /**
     * Attach the given ComponentPortal to DOM element using the ComponentFactoryResolver.
     * @template T
     * @param {?} portal Portal to be attached
     * @return {?} Reference to the created component.
     */
    function (portal) {
        var _this = this;
        var /** @type {?} */ componentFactory = this._componentFactoryResolver.resolveComponentFactory(portal.component);
        var /** @type {?} */ componentRef;
        // If the portal specifies a ViewContainerRef, we will use that as the attachment point
        // for the component (in terms of Angular's component tree, not rendering).
        // When the ViewContainerRef is missing, we use the factory to create the component directly
        // and then manually attach the view to the application.
        if (portal.viewContainerRef) {
            componentRef = portal.viewContainerRef.createComponent(componentFactory, portal.viewContainerRef.length, portal.injector || portal.viewContainerRef.parentInjector);
            this.setDisposeFn(function () { return componentRef.destroy(); });
        }
        else {
            componentRef = componentFactory.create(portal.injector || this._defaultInjector);
            this._appRef.attachView(componentRef.hostView);
            this.setDisposeFn(function () {
                _this._appRef.detachView(componentRef.hostView);
                componentRef.destroy();
            });
        }
        // At this point the component has been instantiated, so we move it to the location in the DOM
        // where we want it to be rendered.
        this.outletElement.appendChild(this._getComponentRootNode(componentRef));
        return componentRef;
    };
    /**
     * Attaches a template portal to the DOM as an embedded view.
     * @param portal Portal to be attached.
     * @returns Reference to the created embedded view.
     */
    /**
     * Attaches a template portal to the DOM as an embedded view.
     * @template C
     * @param {?} portal Portal to be attached.
     * @return {?} Reference to the created embedded view.
     */
    DomPortalOutlet.prototype.attachTemplatePortal = /**
     * Attaches a template portal to the DOM as an embedded view.
     * @template C
     * @param {?} portal Portal to be attached.
     * @return {?} Reference to the created embedded view.
     */
    function (portal) {
        var _this = this;
        var /** @type {?} */ viewContainer = portal.viewContainerRef;
        var /** @type {?} */ viewRef = viewContainer.createEmbeddedView(portal.templateRef, portal.context);
        viewRef.detectChanges();
        // The method `createEmbeddedView` will add the view as a child of the viewContainer.
        // But for the DomPortalOutlet the view can be added everywhere in the DOM
        // (e.g Overlay Container) To move the view to the specified host element. We just
        // re-append the existing root nodes.
        viewRef.rootNodes.forEach(function (rootNode) { return _this.outletElement.appendChild(rootNode); });
        this.setDisposeFn((function () {
            var /** @type {?} */ index = viewContainer.indexOf(viewRef);
            if (index !== -1) {
                viewContainer.remove(index);
            }
        }));
        // TODO(jelbourn): Return locals from view.
        return viewRef;
    };
    /**
     * Clears out a portal from the DOM.
     */
    /**
     * Clears out a portal from the DOM.
     * @return {?}
     */
    DomPortalOutlet.prototype.dispose = /**
     * Clears out a portal from the DOM.
     * @return {?}
     */
    function () {
        _super.prototype.dispose.call(this);
        if (this.outletElement.parentNode != null) {
            this.outletElement.parentNode.removeChild(this.outletElement);
        }
    };
    /**
     * Gets the root HTMLElement for an instantiated component.
     * @param {?} componentRef
     * @return {?}
     */
    DomPortalOutlet.prototype._getComponentRootNode = /**
     * Gets the root HTMLElement for an instantiated component.
     * @param {?} componentRef
     * @return {?}
     */
    function (componentRef) {
        return /** @type {?} */ ((/** @type {?} */ (componentRef.hostView)).rootNodes[0]);
    };
    return DomPortalOutlet;
}(BasePortalOutlet));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Directive version of a `TemplatePortal`. Because the directive *is* a TemplatePortal,
 * the directive instance itself can be attached to a host, enabling declarative use of portals.
 */
var CdkPortal = /** @class */ (function (_super) {
    Object(__WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */])(CdkPortal, _super);
    function CdkPortal(templateRef, viewContainerRef) {
        return _super.call(this, templateRef, viewContainerRef) || this;
    }
    CdkPortal.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Directive"], args: [{
                    selector: '[cdk-portal], [cdkPortal], [portal]',
                    exportAs: 'cdkPortal',
                },] },
    ];
    /** @nocollapse */
    CdkPortal.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["TemplateRef"], },
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ViewContainerRef"], },
    ]; };
    return CdkPortal;
}(TemplatePortal));
/**
 * Directive version of a PortalOutlet. Because the directive *is* a PortalOutlet, portals can be
 * directly attached to it, enabling declarative use.
 *
 * Usage:
 * `<ng-template [cdkPortalOutlet]="greeting"></ng-template>`
 */
var CdkPortalOutlet = /** @class */ (function (_super) {
    Object(__WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */])(CdkPortalOutlet, _super);
    function CdkPortalOutlet(_componentFactoryResolver, _viewContainerRef) {
        var _this = _super.call(this) || this;
        _this._componentFactoryResolver = _componentFactoryResolver;
        _this._viewContainerRef = _viewContainerRef;
        /**
         * Whether the portal component is initialized.
         */
        _this._isInitialized = false;
        _this.attached = new __WEBPACK_IMPORTED_MODULE_1__angular_core__["EventEmitter"]();
        return _this;
    }
    Object.defineProperty(CdkPortalOutlet.prototype, "_deprecatedPortal", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.portal; },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) { this.portal = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkPortalOutlet.prototype, "_deprecatedPortalHost", {
        get: /**
         * @deprecated
         * \@deletion-target 6.0.0
         * @return {?}
         */
        function () { return this.portal; },
        set: /**
         * @param {?} v
         * @return {?}
         */
        function (v) { this.portal = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkPortalOutlet.prototype, "portal", {
        /** Portal associated with the Portal outlet. */
        get: /**
         * Portal associated with the Portal outlet.
         * @return {?}
         */
        function () {
            return this._attachedPortal;
        },
        set: /**
         * @param {?} portal
         * @return {?}
         */
        function (portal) {
            // Ignore the cases where the `portal` is set to a falsy value before the lifecycle hooks have
            // run. This handles the cases where the user might do something like `<div cdkPortalOutlet>`
            // and attach a portal programmatically in the parent component. When Angular does the first CD
            // round, it will fire the setter with empty string, causing the user's content to be cleared.
            if (this.hasAttached() && !portal && !this._isInitialized) {
                return;
            }
            if (this.hasAttached()) {
                _super.prototype.detach.call(this);
            }
            if (portal) {
                _super.prototype.attach.call(this, portal);
            }
            this._attachedPortal = portal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CdkPortalOutlet.prototype, "attachedRef", {
        /** Component or view reference that is attached to the portal. */
        get: /**
         * Component or view reference that is attached to the portal.
         * @return {?}
         */
        function () {
            return this._attachedRef;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    CdkPortalOutlet.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._isInitialized = true;
    };
    /**
     * @return {?}
     */
    CdkPortalOutlet.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        _super.prototype.dispose.call(this);
        this._attachedPortal = null;
        this._attachedRef = null;
    };
    /**
     * Attach the given ComponentPortal to this PortalOutlet using the ComponentFactoryResolver.
     *
     * @param portal Portal to be attached to the portal outlet.
     * @returns Reference to the created component.
     */
    /**
     * Attach the given ComponentPortal to this PortalOutlet using the ComponentFactoryResolver.
     *
     * @template T
     * @param {?} portal Portal to be attached to the portal outlet.
     * @return {?} Reference to the created component.
     */
    CdkPortalOutlet.prototype.attachComponentPortal = /**
     * Attach the given ComponentPortal to this PortalOutlet using the ComponentFactoryResolver.
     *
     * @template T
     * @param {?} portal Portal to be attached to the portal outlet.
     * @return {?} Reference to the created component.
     */
    function (portal) {
        portal.setAttachedHost(this);
        // If the portal specifies an origin, use that as the logical location of the component
        // in the application tree. Otherwise use the location of this PortalOutlet.
        var /** @type {?} */ viewContainerRef = portal.viewContainerRef != null ?
            portal.viewContainerRef :
            this._viewContainerRef;
        var /** @type {?} */ componentFactory = this._componentFactoryResolver.resolveComponentFactory(portal.component);
        var /** @type {?} */ ref = viewContainerRef.createComponent(componentFactory, viewContainerRef.length, portal.injector || viewContainerRef.parentInjector);
        _super.prototype.setDisposeFn.call(this, function () { return ref.destroy(); });
        this._attachedPortal = portal;
        this._attachedRef = ref;
        this.attached.emit(ref);
        return ref;
    };
    /**
     * Attach the given TemplatePortal to this PortlHost as an embedded View.
     * @param portal Portal to be attached.
     * @returns Reference to the created embedded view.
     */
    /**
     * Attach the given TemplatePortal to this PortlHost as an embedded View.
     * @template C
     * @param {?} portal Portal to be attached.
     * @return {?} Reference to the created embedded view.
     */
    CdkPortalOutlet.prototype.attachTemplatePortal = /**
     * Attach the given TemplatePortal to this PortlHost as an embedded View.
     * @template C
     * @param {?} portal Portal to be attached.
     * @return {?} Reference to the created embedded view.
     */
    function (portal) {
        var _this = this;
        portal.setAttachedHost(this);
        var /** @type {?} */ viewRef = this._viewContainerRef.createEmbeddedView(portal.templateRef, portal.context);
        _super.prototype.setDisposeFn.call(this, function () { return _this._viewContainerRef.clear(); });
        this._attachedPortal = portal;
        this._attachedRef = viewRef;
        this.attached.emit(viewRef);
        return viewRef;
    };
    CdkPortalOutlet.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Directive"], args: [{
                    selector: '[cdkPortalOutlet], [cdkPortalHost], [portalHost]',
                    exportAs: 'cdkPortalOutlet, cdkPortalHost',
                    inputs: ['portal: cdkPortalOutlet']
                },] },
    ];
    /** @nocollapse */
    CdkPortalOutlet.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ComponentFactoryResolver"], },
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ViewContainerRef"], },
    ]; };
    CdkPortalOutlet.propDecorators = {
        "_deprecatedPortal": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"], args: ['portalHost',] },],
        "_deprecatedPortalHost": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Input"], args: ['cdkPortalHost',] },],
        "attached": [{ type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["Output"], args: ['attached',] },],
    };
    return CdkPortalOutlet;
}(BasePortalOutlet));
var PortalModule = /** @class */ (function () {
    function PortalModule() {
    }
    PortalModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"], args: [{
                    exports: [CdkPortal, CdkPortalOutlet],
                    declarations: [CdkPortal, CdkPortalOutlet],
                },] },
    ];
    /** @nocollapse */
    PortalModule.ctorParameters = function () { return []; };
    return PortalModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Custom injector to be used when providing custom
 * injection tokens to components inside a portal.
 * \@docs-private
 */
var PortalInjector = /** @class */ (function () {
    function PortalInjector(_parentInjector, _customTokens) {
        this._parentInjector = _parentInjector;
        this._customTokens = _customTokens;
    }
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    PortalInjector.prototype.get = /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    function (token, notFoundValue) {
        var /** @type {?} */ value = this._customTokens.get(token);
        if (typeof value !== 'undefined') {
            return value;
        }
        return this._parentInjector.get(token, notFoundValue);
    };
    return PortalInjector;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=portal.es5.js.map


/***/ }),

/***/ "../../../cdk/esm5/scrolling.es5.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export DEFAULT_SCROLL_TIME */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ScrollDispatcher; });
/* unused harmony export SCROLL_DISPATCHER_PROVIDER_FACTORY */
/* unused harmony export SCROLL_DISPATCHER_PROVIDER */
/* unused harmony export CdkScrollable */
/* unused harmony export DEFAULT_RESIZE_TIME */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ViewportRuler; });
/* unused harmony export VIEWPORT_RULER_PROVIDER_FACTORY */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return VIEWPORT_RULER_PROVIDER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScrollDispatchModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_cdk_platform__ = __webpack_require__("../../../cdk/esm5/platform.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__("../../../../rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_observable_of__ = __webpack_require__("../../../../rxjs/_esm5/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_observable_fromEvent__ = __webpack_require__("../../../../rxjs/_esm5/observable/fromEvent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operators_auditTime__ = __webpack_require__("../../../../rxjs/_esm5/operators/auditTime.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_operators_filter__ = __webpack_require__("../../../../rxjs/_esm5/operators/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_observable_merge__ = __webpack_require__("../../../../rxjs/_esm5/observable/merge.js");
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */










/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Time in ms to throttle the scrolling events by default.
 */
var DEFAULT_SCROLL_TIME = 20;
/**
 * Service contained all registered Scrollable references and emits an event when any one of the
 * Scrollable references emit a scrolled event.
 */
var ScrollDispatcher = /** @class */ (function () {
    function ScrollDispatcher(_ngZone, _platform) {
        this._ngZone = _ngZone;
        this._platform = _platform;
        /**
         * Subject for notifying that a registered scrollable reference element has been scrolled.
         */
        this._scrolled = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["Subject"]();
        /**
         * Keeps track of the global `scroll` and `resize` subscriptions.
         */
        this._globalSubscription = null;
        /**
         * Keeps track of the amount of subscriptions to `scrolled`. Used for cleaning up afterwards.
         */
        this._scrolledCount = 0;
        /**
         * Map of all the scrollable references that are registered with the service and their
         * scroll event subscriptions.
         */
        this.scrollContainers = new Map();
    }
    /**
     * Registers a scrollable instance with the service and listens for its scrolled events. When the
     * scrollable is scrolled, the service emits the event to its scrolled observable.
     * @param scrollable Scrollable instance to be registered.
     */
    /**
     * Registers a scrollable instance with the service and listens for its scrolled events. When the
     * scrollable is scrolled, the service emits the event to its scrolled observable.
     * @param {?} scrollable Scrollable instance to be registered.
     * @return {?}
     */
    ScrollDispatcher.prototype.register = /**
     * Registers a scrollable instance with the service and listens for its scrolled events. When the
     * scrollable is scrolled, the service emits the event to its scrolled observable.
     * @param {?} scrollable Scrollable instance to be registered.
     * @return {?}
     */
    function (scrollable) {
        var _this = this;
        var /** @type {?} */ scrollSubscription = scrollable.elementScrolled()
            .subscribe(function () { return _this._scrolled.next(scrollable); });
        this.scrollContainers.set(scrollable, scrollSubscription);
    };
    /**
     * Deregisters a Scrollable reference and unsubscribes from its scroll event observable.
     * @param scrollable Scrollable instance to be deregistered.
     */
    /**
     * Deregisters a Scrollable reference and unsubscribes from its scroll event observable.
     * @param {?} scrollable Scrollable instance to be deregistered.
     * @return {?}
     */
    ScrollDispatcher.prototype.deregister = /**
     * Deregisters a Scrollable reference and unsubscribes from its scroll event observable.
     * @param {?} scrollable Scrollable instance to be deregistered.
     * @return {?}
     */
    function (scrollable) {
        var /** @type {?} */ scrollableReference = this.scrollContainers.get(scrollable);
        if (scrollableReference) {
            scrollableReference.unsubscribe();
            this.scrollContainers.delete(scrollable);
        }
    };
    /**
     * Returns an observable that emits an event whenever any of the registered Scrollable
     * references (or window, document, or body) fire a scrolled event. Can provide a time in ms
     * to override the default "throttle" time.
     *
     * **Note:** in order to avoid hitting change detection for every scroll event,
     * all of the events emitted from this stream will be run outside the Angular zone.
     * If you need to update any data bindings as a result of a scroll event, you have
     * to run the callback using `NgZone.run`.
     */
    /**
     * Returns an observable that emits an event whenever any of the registered Scrollable
     * references (or window, document, or body) fire a scrolled event. Can provide a time in ms
     * to override the default "throttle" time.
     *
     * **Note:** in order to avoid hitting change detection for every scroll event,
     * all of the events emitted from this stream will be run outside the Angular zone.
     * If you need to update any data bindings as a result of a scroll event, you have
     * to run the callback using `NgZone.run`.
     * @param {?=} auditTimeInMs
     * @return {?}
     */
    ScrollDispatcher.prototype.scrolled = /**
     * Returns an observable that emits an event whenever any of the registered Scrollable
     * references (or window, document, or body) fire a scrolled event. Can provide a time in ms
     * to override the default "throttle" time.
     *
     * **Note:** in order to avoid hitting change detection for every scroll event,
     * all of the events emitted from this stream will be run outside the Angular zone.
     * If you need to update any data bindings as a result of a scroll event, you have
     * to run the callback using `NgZone.run`.
     * @param {?=} auditTimeInMs
     * @return {?}
     */
    function (auditTimeInMs) {
        var _this = this;
        if (auditTimeInMs === void 0) { auditTimeInMs = DEFAULT_SCROLL_TIME; }
        return this._platform.isBrowser ? __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["a" /* Observable */].create(function (observer) {
            if (!_this._globalSubscription) {
                _this._addGlobalListener();
            }
            // In the case of a 0ms delay, use an observable without auditTime
            // since it does add a perceptible delay in processing overhead.
            var /** @type {?} */ subscription = auditTimeInMs > 0 ?
                _this._scrolled.pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators_auditTime__["a" /* auditTime */])(auditTimeInMs)).subscribe(observer) :
                _this._scrolled.subscribe(observer);
            _this._scrolledCount++;
            return function () {
                subscription.unsubscribe();
                _this._scrolledCount--;
                if (!_this._scrolledCount) {
                    _this._removeGlobalListener();
                }
            };
        }) : Object(__WEBPACK_IMPORTED_MODULE_4_rxjs_observable_of__["a" /* of */])();
    };
    /**
     * @return {?}
     */
    ScrollDispatcher.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._removeGlobalListener();
        this.scrollContainers.forEach(function (_, container) { return _this.deregister(container); });
    };
    /**
     * Returns an observable that emits whenever any of the
     * scrollable ancestors of an element are scrolled.
     * @param elementRef Element whose ancestors to listen for.
     * @param auditTimeInMs Time to throttle the scroll events.
     */
    /**
     * Returns an observable that emits whenever any of the
     * scrollable ancestors of an element are scrolled.
     * @param {?} elementRef Element whose ancestors to listen for.
     * @param {?=} auditTimeInMs Time to throttle the scroll events.
     * @return {?}
     */
    ScrollDispatcher.prototype.ancestorScrolled = /**
     * Returns an observable that emits whenever any of the
     * scrollable ancestors of an element are scrolled.
     * @param {?} elementRef Element whose ancestors to listen for.
     * @param {?=} auditTimeInMs Time to throttle the scroll events.
     * @return {?}
     */
    function (elementRef, auditTimeInMs) {
        var /** @type {?} */ ancestors = this.getAncestorScrollContainers(elementRef);
        return this.scrolled(auditTimeInMs).pipe(Object(__WEBPACK_IMPORTED_MODULE_7_rxjs_operators_filter__["a" /* filter */])(function (target) {
            return !target || ancestors.indexOf(target) > -1;
        }));
    };
    /** Returns all registered Scrollables that contain the provided element. */
    /**
     * Returns all registered Scrollables that contain the provided element.
     * @param {?} elementRef
     * @return {?}
     */
    ScrollDispatcher.prototype.getAncestorScrollContainers = /**
     * Returns all registered Scrollables that contain the provided element.
     * @param {?} elementRef
     * @return {?}
     */
    function (elementRef) {
        var _this = this;
        var /** @type {?} */ scrollingContainers = [];
        this.scrollContainers.forEach(function (_subscription, scrollable) {
            if (_this._scrollableContainsElement(scrollable, elementRef)) {
                scrollingContainers.push(scrollable);
            }
        });
        return scrollingContainers;
    };
    /**
     * Returns true if the element is contained within the provided Scrollable.
     * @param {?} scrollable
     * @param {?} elementRef
     * @return {?}
     */
    ScrollDispatcher.prototype._scrollableContainsElement = /**
     * Returns true if the element is contained within the provided Scrollable.
     * @param {?} scrollable
     * @param {?} elementRef
     * @return {?}
     */
    function (scrollable, elementRef) {
        var /** @type {?} */ element = elementRef.nativeElement;
        var /** @type {?} */ scrollableElement = scrollable.getElementRef().nativeElement;
        // Traverse through the element parents until we reach null, checking if any of the elements
        // are the scrollable's element.
        do {
            if (element == scrollableElement) {
                return true;
            }
        } while (element = element.parentElement);
        return false;
    };
    /**
     * Sets up the global scroll listeners.
     * @return {?}
     */
    ScrollDispatcher.prototype._addGlobalListener = /**
     * Sets up the global scroll listeners.
     * @return {?}
     */
    function () {
        var _this = this;
        this._globalSubscription = this._ngZone.runOutsideAngular(function () {
            return Object(__WEBPACK_IMPORTED_MODULE_5_rxjs_observable_fromEvent__["a" /* fromEvent */])(window.document, 'scroll').subscribe(function () { return _this._scrolled.next(); });
        });
    };
    /**
     * Cleans up the global scroll listener.
     * @return {?}
     */
    ScrollDispatcher.prototype._removeGlobalListener = /**
     * Cleans up the global scroll listener.
     * @return {?}
     */
    function () {
        if (this._globalSubscription) {
            this._globalSubscription.unsubscribe();
            this._globalSubscription = null;
        }
    };
    ScrollDispatcher.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    ScrollDispatcher.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], },
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_cdk_platform__["a" /* Platform */], },
    ]; };
    return ScrollDispatcher;
}());
/**
 * \@docs-private
 * @param {?} parentDispatcher
 * @param {?} ngZone
 * @param {?} platform
 * @return {?}
 */
function SCROLL_DISPATCHER_PROVIDER_FACTORY(parentDispatcher, ngZone, platform) {
    return parentDispatcher || new ScrollDispatcher(ngZone, platform);
}
/**
 * \@docs-private
 */
var SCROLL_DISPATCHER_PROVIDER = {
    // If there is already a ScrollDispatcher available, use that. Otherwise, provide a new one.
    provide: ScrollDispatcher,
    deps: [[new __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"](), new __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"](), ScrollDispatcher], __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], __WEBPACK_IMPORTED_MODULE_1__angular_cdk_platform__["a" /* Platform */]],
    useFactory: SCROLL_DISPATCHER_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Sends an event when the directive's element is scrolled. Registers itself with the
 * ScrollDispatcher service to include itself as part of its collection of scrolling events that it
 * can be listened to through the service.
 */
var CdkScrollable = /** @class */ (function () {
    function CdkScrollable(_elementRef, _scroll, _ngZone) {
        var _this = this;
        this._elementRef = _elementRef;
        this._scroll = _scroll;
        this._ngZone = _ngZone;
        this._elementScrolled = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["Subject"]();
        this._scrollListener = function (event) { return _this._elementScrolled.next(event); };
    }
    /**
     * @return {?}
     */
    CdkScrollable.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () {
            _this.getElementRef().nativeElement.addEventListener('scroll', _this._scrollListener);
        });
        this._scroll.register(this);
    };
    /**
     * @return {?}
     */
    CdkScrollable.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._scroll.deregister(this);
        if (this._scrollListener) {
            this.getElementRef().nativeElement.removeEventListener('scroll', this._scrollListener);
        }
    };
    /**
     * Returns observable that emits when a scroll event is fired on the host element.
     */
    /**
     * Returns observable that emits when a scroll event is fired on the host element.
     * @return {?}
     */
    CdkScrollable.prototype.elementScrolled = /**
     * Returns observable that emits when a scroll event is fired on the host element.
     * @return {?}
     */
    function () {
        return this._elementScrolled.asObservable();
    };
    /**
     * @return {?}
     */
    CdkScrollable.prototype.getElementRef = /**
     * @return {?}
     */
    function () {
        return this._elementRef;
    };
    CdkScrollable.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"], args: [{
                    selector: '[cdk-scrollable], [cdkScrollable]'
                },] },
    ];
    /** @nocollapse */
    CdkScrollable.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"], },
        { type: ScrollDispatcher, },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], },
    ]; };
    return CdkScrollable;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Time in ms to throttle the resize events by default.
 */
var DEFAULT_RESIZE_TIME = 20;
/**
 * Simple utility for getting the bounds of the browser viewport.
 * \@docs-private
 */
var ViewportRuler = /** @class */ (function () {
    function ViewportRuler(_platform, ngZone) {
        var _this = this;
        this._platform = _platform;
        this._change = _platform.isBrowser ? ngZone.runOutsideAngular(function () {
            return Object(__WEBPACK_IMPORTED_MODULE_8_rxjs_observable_merge__["a" /* merge */])(Object(__WEBPACK_IMPORTED_MODULE_5_rxjs_observable_fromEvent__["a" /* fromEvent */])(window, 'resize'), Object(__WEBPACK_IMPORTED_MODULE_5_rxjs_observable_fromEvent__["a" /* fromEvent */])(window, 'orientationchange'));
        }) : Object(__WEBPACK_IMPORTED_MODULE_4_rxjs_observable_of__["a" /* of */])();
        this._invalidateCache = this.change().subscribe(function () { return _this._updateViewportSize(); });
    }
    /**
     * @return {?}
     */
    ViewportRuler.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._invalidateCache.unsubscribe();
    };
    /** Returns the viewport's width and height. */
    /**
     * Returns the viewport's width and height.
     * @return {?}
     */
    ViewportRuler.prototype.getViewportSize = /**
     * Returns the viewport's width and height.
     * @return {?}
     */
    function () {
        if (!this._viewportSize) {
            this._updateViewportSize();
        }
        var /** @type {?} */ output = { width: this._viewportSize.width, height: this._viewportSize.height };
        // If we're not on a browser, don't cache the size since it'll be mocked out anyway.
        if (!this._platform.isBrowser) {
            this._viewportSize = /** @type {?} */ ((null));
        }
        return output;
    };
    /** Gets a ClientRect for the viewport's bounds. */
    /**
     * Gets a ClientRect for the viewport's bounds.
     * @return {?}
     */
    ViewportRuler.prototype.getViewportRect = /**
     * Gets a ClientRect for the viewport's bounds.
     * @return {?}
     */
    function () {
        // Use the document element's bounding rect rather than the window scroll properties
        // (e.g. pageYOffset, scrollY) due to in issue in Chrome and IE where window scroll
        // properties and client coordinates (boundingClientRect, clientX/Y, etc.) are in different
        // conceptual viewports. Under most circumstances these viewports are equivalent, but they
        // can disagree when the page is pinch-zoomed (on devices that support touch).
        // See https://bugs.chromium.org/p/chromium/issues/detail?id=489206#c4
        // We use the documentElement instead of the body because, by default (without a css reset)
        // browsers typically give the document body an 8px margin, which is not included in
        // getBoundingClientRect().
        var /** @type {?} */ scrollPosition = this.getViewportScrollPosition();
        var _a = this.getViewportSize(), width = _a.width, height = _a.height;
        return {
            top: scrollPosition.top,
            left: scrollPosition.left,
            bottom: scrollPosition.top + height,
            right: scrollPosition.left + width,
            height: height,
            width: width,
        };
    };
    /** Gets the (top, left) scroll position of the viewport. */
    /**
     * Gets the (top, left) scroll position of the viewport.
     * @return {?}
     */
    ViewportRuler.prototype.getViewportScrollPosition = /**
     * Gets the (top, left) scroll position of the viewport.
     * @return {?}
     */
    function () {
        // While we can get a reference to the fake document
        // during SSR, it doesn't have getBoundingClientRect.
        if (!this._platform.isBrowser) {
            return { top: 0, left: 0 };
        }
        // The top-left-corner of the viewport is determined by the scroll position of the document
        // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
        // whether `document.body` or `document.documentElement` is the scrolled element, so reading
        // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
        // `document.documentElement` works consistently, where the `top` and `left` values will
        // equal negative the scroll position.
        var /** @type {?} */ documentRect = document.documentElement.getBoundingClientRect();
        var /** @type {?} */ top = -documentRect.top || document.body.scrollTop || window.scrollY ||
            document.documentElement.scrollTop || 0;
        var /** @type {?} */ left = -documentRect.left || document.body.scrollLeft || window.scrollX ||
            document.documentElement.scrollLeft || 0;
        return { top: top, left: left };
    };
    /**
     * Returns a stream that emits whenever the size of the viewport changes.
     * @param throttle Time in milliseconds to throttle the stream.
     */
    /**
     * Returns a stream that emits whenever the size of the viewport changes.
     * @param {?=} throttleTime
     * @return {?}
     */
    ViewportRuler.prototype.change = /**
     * Returns a stream that emits whenever the size of the viewport changes.
     * @param {?=} throttleTime
     * @return {?}
     */
    function (throttleTime) {
        if (throttleTime === void 0) { throttleTime = DEFAULT_RESIZE_TIME; }
        return throttleTime > 0 ? this._change.pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators_auditTime__["a" /* auditTime */])(throttleTime)) : this._change;
    };
    /**
     * Updates the cached viewport size.
     * @return {?}
     */
    ViewportRuler.prototype._updateViewportSize = /**
     * Updates the cached viewport size.
     * @return {?}
     */
    function () {
        this._viewportSize = this._platform.isBrowser ?
            { width: window.innerWidth, height: window.innerHeight } :
            { width: 0, height: 0 };
    };
    ViewportRuler.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    ViewportRuler.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_1__angular_cdk_platform__["a" /* Platform */], },
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], },
    ]; };
    return ViewportRuler;
}());
/**
 * \@docs-private
 * @param {?} parentRuler
 * @param {?} platform
 * @param {?} ngZone
 * @return {?}
 */
function VIEWPORT_RULER_PROVIDER_FACTORY(parentRuler, platform, ngZone) {
    return parentRuler || new ViewportRuler(platform, ngZone);
}
/**
 * \@docs-private
 */
var VIEWPORT_RULER_PROVIDER = {
    // If there is already a ViewportRuler available, use that. Otherwise, provide a new one.
    provide: ViewportRuler,
    deps: [[new __WEBPACK_IMPORTED_MODULE_0__angular_core__["Optional"](), new __WEBPACK_IMPORTED_MODULE_0__angular_core__["SkipSelf"](), ViewportRuler], __WEBPACK_IMPORTED_MODULE_1__angular_cdk_platform__["a" /* Platform */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"]],
    useFactory: VIEWPORT_RULER_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var ScrollDispatchModule = /** @class */ (function () {
    function ScrollDispatchModule() {
    }
    ScrollDispatchModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    imports: [__WEBPACK_IMPORTED_MODULE_1__angular_cdk_platform__["b" /* PlatformModule */]],
                    exports: [CdkScrollable],
                    declarations: [CdkScrollable],
                    providers: [SCROLL_DISPATCHER_PROVIDER],
                },] },
    ];
    /** @nocollapse */
    ScrollDispatchModule.ctorParameters = function () { return []; };
    return ScrollDispatchModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=scrolling.es5.js.map


/***/ })

});
//# sourceMappingURL=igdocument-edit.module.chunk.js.map