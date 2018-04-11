webpackJsonp(["segment-definition.module"],{

/***/ "../../../../../src/app/common/datatype-binding-picker/datatype-binding-picker.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypeBindingPickerComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__prime_ng_adapters_prime_dialog_adapter__ = __webpack_require__("../../../../../src/app/common/prime-ng-adapters/prime-dialog-adapter.ts");
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
/**
 * Created by JyWoo on 12/4/17.
 */



var DatatypeBindingPickerComponent = (function (_super) {
    __extends(DatatypeBindingPickerComponent, _super);
    function DatatypeBindingPickerComponent($http) {
        var _this = _super.call(this) || this;
        _this.$http = $http;
        _this.selectedDatatypeId = "";
        return _this;
    }
    DatatypeBindingPickerComponent.prototype.select = function () {
        this.dismissWithData(this.selectedDatatype);
    };
    DatatypeBindingPickerComponent.prototype.onDialogOpen = function () {
        var _this = this;
        var ctrl = this;
        this.options = [];
        this.getDatatypes().subscribe(function (datatypes) {
            if (datatypes) {
                for (var _i = 0, datatypes_1 = datatypes; _i < datatypes_1.length; _i++) {
                    var dt = datatypes_1[_i];
                    _this.options.push({ label: dt.label, value: dt });
                    if (_this.selectedDatatypeId === dt.id)
                        _this.selectedDatatype = dt;
                }
            }
        });
    };
    DatatypeBindingPickerComponent.prototype.ngOnInit = function () {
        this.hook(this);
    };
    DatatypeBindingPickerComponent.prototype.getScopeLabel = function (leaf) {
        if (leaf) {
            if (leaf.scope === 'HL7STANDARD') {
                return 'HL7';
            }
            else if (leaf.scope === 'USER') {
                return 'USR';
            }
            else if (leaf.scope === 'MASTER') {
                return 'MAS';
            }
            else if (leaf.scope === 'PRELOADED') {
                return 'PRL';
            }
            else if (leaf.scope === 'PHINVADS') {
                return 'PVS';
            }
            else {
                return "";
            }
        }
    };
    DatatypeBindingPickerComponent.prototype.hasSameVersion = function (element) {
        if (element)
            return element.hl7Version;
        return null;
    };
    DatatypeBindingPickerComponent.prototype.getDatatypes = function () {
        return this.$http.get('api/datatype/').map(function (res) { return res.json(); });
    };
    DatatypeBindingPickerComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'datatype-binding-picker',
            template: __webpack_require__("../../../../../src/app/common/datatype-binding-picker/datatype-binding-picker.template.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], DatatypeBindingPickerComponent);
    return DatatypeBindingPickerComponent;
}(__WEBPACK_IMPORTED_MODULE_2__prime_ng_adapters_prime_dialog_adapter__["a" /* PrimeDialogAdapter */]));



/***/ }),

/***/ "../../../../../src/app/common/datatype-binding-picker/datatype-binding-picker.template.html":
/***/ (function(module, exports) {

module.exports = "<p-dialog [(visible)]=\"_visible\" modal=\"modal\" [responsive]=\"true\" [resizable]=\"false\" [draggable]=\"false\" appendTo=\"body\">\n    <p-header>\n        Select Datatype\n    </p-header>\n    <div class=\"g-row\">\n        <p-dropdown [options]=\"options\" appendTo=\"body\" [(ngModel)]=\"selectedDatatype\" [style]=\"{'width':'300px'}\" filter=\"true\">\n            <ng-template let-dt pTemplate=\"body\">\n                <div class=\"ui-helper-clearfix\" style=\"position: relative;height: 25px;\">\n                    <display-label [elm]=\"dt.value\"></display-label>\n                </div>\n            </ng-template>\n        </p-dropdown>\n    </div>\n    <p-footer>\n        <button pButton class=\"btn btn-success\" (click)=\"select()\">Select</button>\n    </p-footer>\n</p-dialog>\n"

/***/ }),

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

/***/ "../../../../../src/app/common/segment-tree/segment-tree.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentTreeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__segment_tree_service__ = __webpack_require__("../../../../../src/app/common/segment-tree/segment-tree.service.ts");
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
 * Created by hnt5 on 10/1/17.
 */


var SegmentTreeComponent = (function () {
    function SegmentTreeComponent(nodeService) {
        this.nodeService = nodeService;
        this.nodeSelect = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    Object.defineProperty(SegmentTreeComponent.prototype, "segment", {
        set: function (value) {
            this._segment = value;
            this.initTree();
        },
        enumerable: true,
        configurable: true
    });
    SegmentTreeComponent.prototype.nodeSelected = function (event) {
        if (event.node) {
            this.nodeSelect.emit(event.node);
        }
    };
    SegmentTreeComponent.prototype.loadNode = function (event) {
        if (event.node) {
            return this.nodeService.getComponentsAsTreeNodes(event.node, this._segment).then(function (nodes) { return event.node.children = nodes; });
        }
    };
    SegmentTreeComponent.prototype.initTree = function () {
        var _this = this;
        if (this._segment) {
            this.nodeService.getFieldsAsTreeNodes(this._segment).then(function (result) {
                _this.tree = result;
            });
        }
    };
    SegmentTreeComponent.prototype.ngOnInit = function () {
        this.initTree();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], SegmentTreeComponent.prototype, "nodeSelect", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], SegmentTreeComponent.prototype, "segment", null);
    SegmentTreeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'segment-tree',
            template: __webpack_require__("../../../../../src/app/common/segment-tree/segment-tree.template.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__segment_tree_service__["a" /* SegmentTreeNodeService */]])
    ], SegmentTreeComponent);
    return SegmentTreeComponent;
}());



/***/ }),

/***/ "../../../../../src/app/common/segment-tree/segment-tree.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentTreeNodeService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_underscore__ = __webpack_require__("../../../../underscore/underscore.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_underscore__);
/**
 * Created by hnt5 on 10/1/17.
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var SegmentTreeNodeService = (function () {
    function SegmentTreeNodeService(http, configService) {
        this.http = http;
        this.configService = configService;
        this.valueSetAllowedDTs = this.configService.valueSetAllowedDTs;
        this.valueSetAllowedComponents = this.configService.valueSetAllowedComponents;
    }
    SegmentTreeNodeService.prototype.getFieldsAsTreeNodes = function (segment) {
        return __awaiter(this, void 0, void 0, function () {
            var nodes, list, _i, list_1, field, node;
            return __generator(this, function (_a) {
                nodes = [];
                list = segment.fields.sort(function (x, y) { return x.position - y.position; });
                for (_i = 0, list_1 = list; _i < list_1.length; _i++) {
                    field = list_1[_i];
                    node = this.lazyNode(field, null, segment);
                    nodes.push(node);
                }
                return [2 /*return*/, nodes];
            });
        });
    };
    SegmentTreeNodeService.prototype.lazyNode = function (element, parent, segment) {
        var node = {};
        node.label = element.name;
        node.data = {
            index: element.position,
            obj: element,
            path: (parent && parent.data && parent.data.path) ? parent.data.path + '.' + element.position : element.position + ''
        };
        if (element.datatype) {
            this.getDatatypeMetadata(element.datatype.id).subscribe(function (meta) {
                if (meta) {
                    element.datatype = meta;
                    if (meta.numOfChildren && meta.numOfChildren > 0) {
                        node.leaf = false;
                    }
                    else {
                        node.leaf = true;
                    }
                }
            });
        }
        if (!parent) {
            this.populateSegmentBinding(segment, node);
        }
        else if (parent && parent.data.obj.type === 'field') {
            node.data.fieldDT = parent.data.obj.datatype;
            this.populateSegmentBinding(segment, node);
            this.populateFieldDTBinding(node.data.fieldDT, node);
        }
        else if (parent && parent.data.obj.type === 'component') {
            node.data.fieldDT = parent.data.fieldDT;
            node.data.componentDT = parent.data.obj.datatype;
            this.populateSegmentBinding(segment, node);
            this.populateFieldDTBinding(node.data.fieldDT, node);
            this.populateComponentDTBinding(node.data.componentDT, node);
        }
        node.data.isAvailableForValueSet = this.isAvailableForValueSet(node);
        node.selectable = true;
        return node;
    };
    SegmentTreeNodeService.prototype.populateSegmentBinding = function (segment, node) {
        node.data.segmentValueSetBindings = [];
        node.data.fieldDTValueSetBindings = [];
        node.data.componentDTValueSetBindings = [];
        if (segment && segment.valueSetBindings) {
            for (var _i = 0, _a = segment.valueSetBindings; _i < _a.length; _i++) {
                var binding = _a[_i];
                if (node.data.path === binding.location) {
                    if (binding.type === 'valueset') {
                        this.getValueSetMetadata(binding.tableId).subscribe(function (meta) {
                            if (meta) {
                                node.data.segmentValueSetBindings.push(meta);
                            }
                        });
                    }
                    else if (binding.type === 'singlecode') {
                    }
                }
            }
        }
    };
    SegmentTreeNodeService.prototype.populateFieldDTBinding = function (fieldDT, node) {
        var _this = this;
        node.data.segmentValueSetBindings = [];
        node.data.fieldDTValueSetBindings = [];
        node.data.componentDTValueSetBindings = [];
        this.getDatatype(fieldDT.id).subscribe(function (fieldDT) {
            if (fieldDT && fieldDT.valueSetBindings) {
                for (var _i = 0, _a = fieldDT.valueSetBindings; _i < _a.length; _i++) {
                    var binding = _a[_i];
                    var pathSplit = node.data.path.split(".");
                    if (pathSplit.length === 2) {
                        if (pathSplit[1] === binding.location) {
                            if (binding.type === 'valueset') {
                                _this.getValueSetMetadata(binding.tableId).subscribe(function (meta) {
                                    if (meta)
                                        node.data.fieldDTValueSetBindings.push(meta);
                                });
                            }
                            else if (binding.type === 'singlecode') {
                            }
                        }
                    }
                    else if (pathSplit.length === 3) {
                        if (pathSplit[1] + '.' + pathSplit[2] === binding.location) {
                            if (binding.type === 'valueset') {
                                _this.getValueSetMetadata(binding.tableId).subscribe(function (meta) {
                                    if (meta)
                                        node.data.fieldDTValueSetBindings.push(meta);
                                });
                            }
                            else if (binding.type === 'singlecode') {
                            }
                        }
                    }
                }
            }
        });
    };
    SegmentTreeNodeService.prototype.populateComponentDTBinding = function (componentDT, node) {
        var _this = this;
        node.data.segmentValueSetBindings = [];
        node.data.fieldDTValueSetBindings = [];
        node.data.componentDTValueSetBindings = [];
        this.getDatatype(componentDT.id).subscribe(function (componentDT) {
            if (componentDT && componentDT.valueSetBindings) {
                for (var _i = 0, _a = componentDT.valueSetBindings; _i < _a.length; _i++) {
                    var binding = _a[_i];
                    var pathSplit = node.data.path.split(".");
                    if (pathSplit[2] === binding.location) {
                        if (binding.type === 'valueset') {
                            _this.getValueSetMetadata(binding.tableId).subscribe(function (meta) {
                                if (meta)
                                    node.data.componentDTValueSetBindings.push(meta);
                            });
                        }
                        else if (binding.type === 'singlecode') {
                        }
                    }
                }
            }
        });
    };
    SegmentTreeNodeService.prototype.getComponentsAsTreeNodes = function (node, segment) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var nodes;
            return __generator(this, function (_a) {
                nodes = [];
                this.http.get('api/datatype/' + node.data.obj.datatype.id)
                    .map(function (res) { return res.json(); }).subscribe(function (data) {
                    for (var _i = 0, _a = data.components; _i < _a.length; _i++) {
                        var d = _a[_i];
                        nodes.push(_this.lazyNode(d, node, segment));
                    }
                });
                return [2 /*return*/, nodes];
            });
        });
    };
    SegmentTreeNodeService.prototype.getDatatypeMetadata = function (id) {
        return this.http.get('api/datatype/metadata/' + id).map(function (res) { return res.json(); });
    };
    SegmentTreeNodeService.prototype.getDatatype = function (id) {
        return this.http.get('api/datatype/' + id).map(function (res) { return res.json(); });
    };
    SegmentTreeNodeService.prototype.getValueSetMetadata = function (id) {
        return this.http.get('api/table/metadata/' + id).map(function (res) { return res.json(); });
    };
    SegmentTreeNodeService.prototype.getDatatypes = function () {
        return this.http.get('api/datatype/').map(function (res) { return res.json(); });
    };
    SegmentTreeNodeService.prototype.isAvailableForValueSet = function (node) {
        if (node && node.data.obj.datatype) {
            if (__WEBPACK_IMPORTED_MODULE_3_underscore__["find"](this.valueSetAllowedDTs, function (valueSetAllowedDT) {
                return valueSetAllowedDT == node.data.obj.datatype.name;
            }))
                return true;
        }
        if (node && node.data.obj.fieldDT && !node.data.obj.componentDT) {
            var pathSplit = node.data.path.split(".");
            if (__WEBPACK_IMPORTED_MODULE_3_underscore__["find"](this.valueSetAllowedComponents, function (valueSetAllowedComponent) {
                return valueSetAllowedComponent.dtName == node.data.obj.fieldDT.name && valueSetAllowedComponent.location == pathSplit[1];
            }))
                return true;
        }
        if (node && node.componentDT) {
            var pathSplit = node.data.path.split(".");
            if (__WEBPACK_IMPORTED_MODULE_3_underscore__["find"](this.valueSetAllowedComponents, function (valueSetAllowedComponent) {
                return valueSetAllowedComponent.dtName == node.componentDT.name && valueSetAllowedComponent.location == pathSplit[2];
            }))
                return true;
        }
        return false;
    };
    SegmentTreeNodeService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_2__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */]])
    ], SegmentTreeNodeService);
    return SegmentTreeNodeService;
}());



/***/ }),

/***/ "../../../../../src/app/common/segment-tree/segment-tree.template.html":
/***/ (function(module, exports) {

module.exports = "<p-tree [style]=\"{'width':'100%'}\" [value]=\"tree\" (onNodeExpand)=\"loadNode($event)\" (onNodeSelect)=\"nodeSelected($event)\" selectionMode=\"single\" [(selection)]=\"selectedNode\">\n    <ng-template let-node pTemplate=\"default\">\n      <display-badge [type]=\"node.data.obj.type\"></display-badge> {{node.data.obj.position}} {{node.label}}\n    </ng-template>\n</p-tree>\n"

/***/ }),

/***/ "../../../../../src/app/common/valueset-binding-picker/valueset-binding-picker.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValueSetBindingPickerComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__prime_ng_adapters_prime_dialog_adapter__ = __webpack_require__("../../../../../src/app/common/prime-ng-adapters/prime-dialog-adapter.ts");
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
/**
 * Created by hnt5 on 10/4/17.
 */



var ValueSetBindingPickerComponent = (function (_super) {
    __extends(ValueSetBindingPickerComponent, _super);
    function ValueSetBindingPickerComponent($http) {
        var _this = _super.call(this) || this;
        _this.$http = $http;
        _this.libraryId = "";
        _this.selectedTables = [];
        return _this;
    }
    ValueSetBindingPickerComponent.prototype.select = function () {
        this.dismissWithData(this.transform(this.selectedTables));
    };
    ValueSetBindingPickerComponent.prototype.transform = function (list) {
        var selected = [];
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var vs = list_1[_i];
            if (vs.hasOwnProperty('bindingStrength') && vs.hasOwnProperty('bindingLocation')) {
                selected.push({
                    bindingIdentifier: vs.bindingIdentifier,
                    bindingLocation: vs.bindingLocation,
                    bindingStrength: vs.bindingStrength,
                    hl7Version: vs.hl7Version,
                    name: vs.name,
                    scope: vs.scope
                });
            }
        }
        return selected;
    };
    ValueSetBindingPickerComponent.prototype.onDialogOpen = function () {
        var ctrl = this;
        this.$http.get('api/table-library/' + this.libraryId + '/tables').toPromise().then(function (response) {
            ctrl.tables = response.json();
        });
    };
    ValueSetBindingPickerComponent.prototype.ngOnInit = function () {
        // Load Table
        this.hook(this);
        this.bindingStrength = [
            {
                label: 'R',
                value: 'R'
            },
            {
                label: 'S',
                value: 'S'
            }
        ];
        this.bindingLocation = [
            {
                label: '1',
                value: '1'
            },
            {
                label: '1 or 4',
                value: '1:4'
            }
        ];
    };
    ValueSetBindingPickerComponent.prototype.getScopeLabel = function (leaf) {
        if (leaf) {
            if (leaf.scope === 'HL7STANDARD') {
                return 'HL7';
            }
            else if (leaf.scope === 'USER') {
                return 'USR';
            }
            else if (leaf.scope === 'MASTER') {
                return 'MAS';
            }
            else if (leaf.scope === 'PRELOADED') {
                return 'PRL';
            }
            else if (leaf.scope === 'PHINVADS') {
                return 'PVS';
            }
            else {
                return "";
            }
        }
    };
    ValueSetBindingPickerComponent.prototype.hasSameVersion = function (element) {
        if (element)
            return element.hl7Version;
        return null;
    };
    ValueSetBindingPickerComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'valueset-binding-picker',
            template: __webpack_require__("../../../../../src/app/common/valueset-binding-picker/valueset-binding-picker.template.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], ValueSetBindingPickerComponent);
    return ValueSetBindingPickerComponent;
}(__WEBPACK_IMPORTED_MODULE_2__prime_ng_adapters_prime_dialog_adapter__["a" /* PrimeDialogAdapter */]));



/***/ }),

/***/ "../../../../../src/app/common/valueset-binding-picker/valueset-binding-picker.template.html":
/***/ (function(module, exports) {

module.exports = "<p-dialog [(visible)]=\"_visible\" modal=\"modal\" [responsive]=\"true\" [resizable]=\"false\" [draggable]=\"false\" appendTo=\"body\">\n    <p-header>\n        Select Value Set Bindings\n    </p-header>\n    <div class=\"g-row\">\n        <p-dataTable styleClass=\"ui-g-6\" [value]=\"tables\" [globalFilter]=\"gb\" [(selection)]=\"selectedTables\" dataKey=\"bindingIdentifier\" [rows]=\"10\" [paginator]=\"true\" [pageLinks]=\"3\" [rowsPerPageOptions]=\"[5,10,20]\" >\n            <p-header>\n                <div class=\"ui-inputgroup\" style=\"width: 100%;\">\n                    <span class=\"ui-inputgroup-addon\"><i class=\"fa fa-search\"></i></span>\n                    <input #gb type=\"text\" pInputText size=\"50\" placeholder=\"Filter\" style=\"width: 100%;\">\n                </div>\n            </p-header>\n            <p-column [style]=\"{'width':'38px'}\" selectionMode=\"multiple\"></p-column>\n            <p-column header=\"Binding Identifier\" field=\"bindingIdentifier\">\n                <ng-template pTemplate=\"body\" let-vs=\"rowData\">\n                    <span class=\"badge\" [ngClass]=\"{'label-HL7' : getScopeLabel(vs)==='HL7', 'label-USE': getScopeLabel(vs)==='USR','label-MASTER':getScopeLabel(vs)==='MAS','label-PRL':getScopeLabel(vs)==='PRL','label-PVS':getScopeLabel(vs)==='PVS'}\">{{getScopeLabel(vs)}} {{hasSameVersion(vs)}}</span> {{vs.bindingIdentifier}}\n                </ng-template>\n            </p-column>\n            <p-column header=\"Name\" field=\"name\"></p-column>\n        </p-dataTable>\n        <p-dataList [value]=\"selectedTables\" styleClass=\"ui-g-6\" emptyMessage=\"No Value Set Selected\">\n            <p-header>Selected Tables</p-header>\n            <ng-template let-vs pTemplate=\"item\">\n                <div class=\"ui-g ui-g-nopad\">\n                    <span class=\"ui-g-4\">\n                        <span class=\"badge\" [ngClass]=\"{'label-HL7' : getScopeLabel(vs)==='HL7', 'label-USE': getScopeLabel(vs)==='USR','label-MASTER':getScopeLabel(vs)==='MAS','label-PRL':getScopeLabel(vs)==='PRL','label-PVS':getScopeLabel(vs)==='PVS'}\">{{getScopeLabel(vs)}} {{hasSameVersion(vs)}}</span> {{vs.bindingIdentifier}} {{vs.name}}\n                    </span>\n                    <p-dropdown class=\"ui-g-4\" [options]=\"bindingStrength\" [(ngModel)]=\"vs.bindingStrength\" placeholder=\"Binding Strength\" [style]=\"{'width' : '100%', 'overflow' : 'visible'}\"></p-dropdown>\n                    <p-dropdown class=\"ui-g-4\" [options]=\"bindingLocation\" [(ngModel)]=\"vs.bindingLocation\" placeholder=\"Binding Location\" [style]=\"{'width' : '100%', 'overflow' : 'visible'}\"></p-dropdown>\n                </div>\n            </ng-template>\n        </p-dataList>\n    </div>\n    <p-footer>\n        <button pButton class=\"btn btn-success\" (click)=\"select()\">Select</button>\n    </p-footer>\n</p-dialog>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint-table.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "input {\n    width: 100%;\n}\n\n.table-header {\n    text-align: center;\n}\n\n.table-ndef {\n    background-color: #6e6e6e;\n}\n\n.invalid {\n    border : 1px solid red;\n}\n\n.wide {\n    min-width: 200px;\n    max-width: 200px;\n}\n\n.small {\n    min-width: 100px;\n    max-width: 100px;\n}\n\n.selector-header{\n    background-color: rgb(21, 130, 225);\n}\n\n.data-header {\n    background-color: rgb(239,239,239);\n}\n\n.user-header {\n    background-color: rgb(114, 207, 75);\n}\n\n.ng-valid[required], .ng-valid.required  {\n    /*border-bottom: 1px solid #42A948; !* green *!*/\n}\n\n.ng-invalid:not(form)  {\n    border-bottom: 2px solid #d82320; /* red */\n}\n\ninput::-webkit-input-placeholder {\n    color: red !important;\n    text-align: center;\n}\n\ninput:-moz-placeholder {\n    color: red !important;\n    text-align: center;\n}\n\ninput::-moz-placeholder {\n    color: red !important;\n    text-align: center;\n}\n\ninput:-ms-input-placeholder {\n    color: red !important;\n    text-align: center;\n}\n\n.label-gray {\n  background-color: gray;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint-table.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoConstraintTableComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint.domain.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__header_dialog_header_dialog_dm_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/header-dialog/header-dialog-dm.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__coconstraint_table_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint-table.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__header_dialog_header_dialog_user_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/header-dialog/header-dialog-user.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_valueset_binding_picker_valueset_binding_picker_component__ = __webpack_require__("../../../../../src/app/common/valueset-binding-picker/valueset-binding-picker.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/**
 * Created by hnt5 on 10/3/17.
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








var CoConstraintTableComponent = (function () {
    function CoConstraintTableComponent(ccTableService, http, _ws) {
        this.ccTableService = ccTableService;
        this.http = http;
        this._ws = _ws;
    }
    Object.defineProperty(CoConstraintTableComponent.prototype, "segment", {
        set: function (value) {
            this._segment = value;
            this.table = this.ccTableService.getCCTableForSegment(this._segment);
            var ctrl = this;
            if (this.table.dyn) {
                this.ccTableService.get_bound_codes(this._segment).then(function (response) {
                    ctrl.config.dynCodes = [];
                    console.log(response.json());
                    for (var _i = 0, _a = response.json().codes; _i < _a.length; _i++) {
                        var code = _a[_i];
                        ctrl.config.dynCodes.push({ label: code.value, value: code.value });
                    }
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    CoConstraintTableComponent.prototype.template = function (node) {
        if (node && node.content && node.content.type) {
            switch (node.content.type) {
                case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByValue:
                    return this.value;
                case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByValueSet:
                    return this.valueset;
                case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].DataType:
                    return this.datatype;
                case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByCode:
                    return this.code;
                case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].DatatypeFlavor:
                    return this.flavor;
            }
        }
        else if (node && node.label) {
            return this.textArea;
        }
        else
            return this.empty;
    };
    CoConstraintTableComponent.prototype.openVSDialog = function (obj, key) {
        this.vsPicker.open({
            libraryId: this.tableid,
            selectedTables: obj[key]
        }).subscribe(function (result) {
            console.log(result);
            obj[key] = result;
        });
    };
    CoConstraintTableComponent.prototype.openHeaderDialog = function (h) {
        var _this = this;
        var resolve = {
            header: h,
            selectedPaths: [],
            type: null,
            fixed: false
        };
        if (h === 'selectors') {
            resolve.type = __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByValue;
            resolve.fixed = true;
        }
        this.headerDialogDm.open(resolve).subscribe(function (result) {
            _this.table.headers[h].push(result);
            _this.initColumn(result);
        });
    };
    CoConstraintTableComponent.prototype.openUserHeaderDialog = function () {
        var _this = this;
        this.headerDialogUser.open({}).subscribe(function (result) {
            _this.table.headers.user.push(result);
            _this.initColumn(result);
        });
    };
    CoConstraintTableComponent.prototype.initCell = function (type, obj, key) {
        switch (type) {
            case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByValue:
                obj[key] = {
                    value: ''
                };
                break;
            case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByValueSet:
                obj[key] = [];
                break;
            case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].DataType:
                obj[key] = {
                    value: '',
                    dt: ''
                };
                break;
            case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByCode:
                obj[key] = {
                    value: '',
                    location: ''
                };
                break;
        }
    };
    CoConstraintTableComponent.prototype.delCol = function (list, i, column) {
        this.reqDel(this.table, column);
        list.splice(i, 1);
    };
    CoConstraintTableComponent.prototype.reqDel = function (obj, key) {
        if (obj.content.free) {
            for (var _i = 0, _a = obj.content.free; _i < _a.length; _i++) {
                var cc = _a[_i];
                delete cc[key];
            }
        }
        if (obj.content.groups) {
            for (var _b = 0, _c = obj.content.groups; _b < _c.length; _b++) {
                var gr = _c[_b];
                this.reqDel(gr, key);
            }
        }
    };
    CoConstraintTableComponent.prototype.delRow = function (list, i) {
        list.splice(i, 1);
    };
    CoConstraintTableComponent.prototype.addCc = function (list) {
        list.push(this.ccTableService.new_line(this.table.headers.selectors, this.table.headers.data, this.table.headers.user));
    };
    CoConstraintTableComponent.prototype.initColumn = function (obj) {
        var ctrl = this;
        var initReq = function (table) {
            if (table.content.free) {
                for (var _i = 0, _a = table.content.free; _i < _a.length; _i++) {
                    var cc = _a[_i];
                    ctrl.ccTableService.initCell(cc, obj);
                    //ctrl.initCell(obj.content.type, cc, obj.id);
                }
            }
            if (table.content.groups) {
                for (var _b = 0, _c = table.content.groups; _b < _c.length; _b++) {
                    var grp = _c[_b];
                    initReq(grp);
                }
            }
        };
        initReq(this.table);
    };
    CoConstraintTableComponent.prototype.addCcGroup = function () {
        this.table.content.groups.push({
            data: {
                name: '',
                requirements: {
                    usage: 'R',
                    cardinality: {
                        min: 1,
                        max: "1"
                    }
                }
            },
            content: {
                free: []
            }
        });
    };
    CoConstraintTableComponent.prototype.delGroup = function (list, i) {
        list.splice(i, 1);
    };
    CoConstraintTableComponent.prototype.dtChange = function (node) {
        node.value = '';
    };
    CoConstraintTableComponent.prototype.groupHeaderSize = function (table) {
        var data = table.headers.data.length === 0 ? 1 : table.headers.data.length;
        var selector = table.headers.selectors.length === 0 ? 1 : table.headers.selectors.length;
        var user = table.headers.user.length === 0 ? 1 : table.headers.user.length;
        return data + selector + user;
    };
    CoConstraintTableComponent.prototype.ngOnInit = function () {
        this.config = {
            selectorTypes: [
                {
                    label: "Constant",
                    value: __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByValue
                },
                {
                    label: "Value Set",
                    value: __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByValue
                }
            ],
            usages: [
                {
                    label: "R",
                    value: "R"
                },
                {
                    label: "O",
                    value: "O"
                }
            ],
            dynCodes: [],
            datatypes: []
        };
        this.readRoute();
    };
    CoConstraintTableComponent.prototype.readRoute = function () {
        var _this = this;
        this._ws.getCurrent(__WEBPACK_IMPORTED_MODULE_7__service_workspace_workspace_service__["a" /* Entity */].IG).subscribe(function (data) {
            var ig = data;
            _this.tableid = ig.profile.tableLibrary.id;
            _this._ws.getCurrent(__WEBPACK_IMPORTED_MODULE_7__service_workspace_workspace_service__["a" /* Entity */].SEGMENT).subscribe(function (seg) {
                _this.segment = seg;
                for (var _i = 0, _a = ig.profile.datatypeLibrary.children; _i < _a.length; _i++) {
                    var dt = _a[_i];
                    _this.config.datatypes.push({ label: dt.label, value: dt });
                }
            });
        });
        //
        //
        // let ig = this._ws.getCurrent(Entity.IG);
        // this.tableid = ig.profile.tableLibrary.id;
        // this.segment = this._ws.getCurrent(Entity.SEGMENT);
        // for(let dt of ig.profile.datatypeLibrary.children){
        //   this.config.datatypes.push({ label : dt.label, value : dt});
        // }
        // console.log(this.config);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Array)
    ], CoConstraintTableComponent.prototype, "dtlist", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], CoConstraintTableComponent.prototype, "tableid", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_5__common_valueset_binding_picker_valueset_binding_picker_component__["a" /* ValueSetBindingPickerComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_5__common_valueset_binding_picker_valueset_binding_picker_component__["a" /* ValueSetBindingPickerComponent */])
    ], CoConstraintTableComponent.prototype, "vsPicker", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_2__header_dialog_header_dialog_dm_component__["a" /* CCHeaderDialogDm */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2__header_dialog_header_dialog_dm_component__["a" /* CCHeaderDialogDm */])
    ], CoConstraintTableComponent.prototype, "headerDialogDm", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_4__header_dialog_header_dialog_user_component__["a" /* CCHeaderDialogUser */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__header_dialog_header_dialog_user_component__["a" /* CCHeaderDialogUser */])
    ], CoConstraintTableComponent.prototype, "headerDialogUser", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('empty'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"])
    ], CoConstraintTableComponent.prototype, "empty", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('value'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"])
    ], CoConstraintTableComponent.prototype, "value", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('valueset'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"])
    ], CoConstraintTableComponent.prototype, "valueset", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('datatype'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"])
    ], CoConstraintTableComponent.prototype, "datatype", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('flavor'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"])
    ], CoConstraintTableComponent.prototype, "flavor", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('textArea'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"])
    ], CoConstraintTableComponent.prototype, "textArea", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('code'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["TemplateRef"])
    ], CoConstraintTableComponent.prototype, "code", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], CoConstraintTableComponent.prototype, "segment", null);
    CoConstraintTableComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'coconstraint-table',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint-table.template.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint-table.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__coconstraint_table_service__["a" /* CoConstraintTableService */],
            __WEBPACK_IMPORTED_MODULE_6__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_7__service_workspace_workspace_service__["b" /* WorkspaceService */]])
    ], CoConstraintTableComponent);
    return CoConstraintTableComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint-table.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoConstraintTableService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint.domain.ts");
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



/**
 * Created by hnt5 on 10/11/17.
 */
var CoConstraintTableService = (function () {
    function CoConstraintTableService($http) {
        this.$http = $http;
    }
    CoConstraintTableService.prototype.getCCTableForSegment = function (segment) {
        if (!segment) {
            return null;
        }
        else {
            if (segment.name === 'OBX')
                return this.generate_obx_table(segment);
            else
                return this.generate_generic_table();
        }
    };
    CoConstraintTableService.prototype.generate_generic_table = function () {
        return {
            grp: false,
            dyn: false,
            headers: {
                selectors: [],
                data: [],
                user: []
            },
            content: {
                free: [],
                groups: []
            }
        };
    };
    CoConstraintTableService.prototype.generate_obx_table = function (segment) {
        var tmp = this.generate_generic_table();
        tmp.grp = true;
        tmp.dyn = true;
        tmp.headers.selectors.push({
            id: 'k3',
            label: 'OBX-3',
            keep: true,
            content: {
                type: __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByCode,
                elmType: 'field',
                path: '3[1]'
            }
        });
        tmp.headers.selectors.push({
            id: 'k2',
            label: 'OBX-2',
            keep: true,
            content: {
                type: __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].DataType,
                elmType: 'field',
                path: '2[1]'
            }
        });
        tmp.headers.data.push({
            id: 'k5',
            label: 'OBX-5',
            keep: true,
            content: {
                type: __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].DatatypeFlavor,
                elmType: 'field',
                path: '5[1]'
            }
        });
        return tmp;
    };
    CoConstraintTableService.prototype.get_bound_codes = function (segment) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, binding;
            return __generator(this, function (_b) {
                if (segment && segment.valueSetBindings) {
                    for (_i = 0, _a = segment.valueSetBindings; _i < _a.length; _i++) {
                        binding = _a[_i];
                        if (binding.location === '2') {
                            return [2 /*return*/, this.$http.get('api/tables/' + binding.tableId).toPromise()];
                        }
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    CoConstraintTableService.prototype.fetchCoConstraintTable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null];
            });
        });
    };
    CoConstraintTableService.prototype.new_line = function (selectors, data, user) {
        var row = {};
        for (var _i = 0, selectors_1 = selectors; _i < selectors_1.length; _i++) {
            var header = selectors_1[_i];
            this.initCell(row, header);
        }
        for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
            var header = data_1[_a];
            this.initCell(row, header);
        }
        for (var _b = 0, user_1 = user; _b < user_1.length; _b++) {
            var header = user_1[_b];
            this.initCell(row, header);
        }
        this.init_req(row);
        return row;
    };
    CoConstraintTableService.prototype.init_req = function (row) {
        row.requirements = {
            usage: 'R',
            cardinality: {
                min: 1,
                max: "1"
            }
        };
    };
    CoConstraintTableService.prototype.initCell = function (obj, header) {
        if (!header.content) {
            obj[header.id] = {
                value: ''
            };
            return;
        }
        switch (header.content.type) {
            case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByValue:
                obj[header.id] = {
                    value: ''
                };
                break;
            case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByValueSet:
                obj[header.id] = [];
                break;
            case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].DataType:
                obj[header.id] = {
                    value: ''
                };
                break;
            case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].DatatypeFlavor:
                obj[header.id] = {
                    value: ''
                };
                break;
            case __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByCode:
                obj[header.id] = {
                    value: '',
                    location: '1'
                };
                break;
            default:
                obj[header.id] = {
                    value: ''
                };
                break;
        }
    };
    CoConstraintTableService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */]])
    ], CoConstraintTableService);
    return CoConstraintTableService;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint-table.template.html":
/***/ (function(module, exports) {

module.exports = "<div style=\"overflow-x: scroll; width: 100%;\" *ngIf=\"table\">\n    <button (click)=\"addCcGroup()\" *ngIf=\"table.grp && table.headers.selectors.length\" style=\"float: left; margin-top : 10px; margin-bottom: 10px;\" type=\"button\" pButton class=\"btn-xs btn-info\">\n        <i class=\"fa fa-plus fa-fw\">&nbsp; </i> Add Co-Constraint Group\n    </button>\n    <form>\n        <table class=\"table table-bordered table-condensed\">\n\n            <!--GROUPS DEFINITION-->\n            <colgroup span=\"1\"></colgroup>\n            <colgroup span=\"{{table.headers.selectors.length}}\" style=\"background-color:#B1daff; text-align: center;\"></colgroup>\n            <colgroup span=\"{{table.headers.data.length}}\" ></colgroup>\n            <colgroup span=\"{{table.headers.user.length}}\" style=\"background-color:#a7d6a9\"></colgroup>\n            <colgroup span=\"1\" class=\"small\"></colgroup>\n            <colgroup span=\"1\" class=\"small\"></colgroup>\n\n\n            <!--HEADERS FIRST ROW-->\n            <tr>\n                <td rowspan=\"2\" style=\"background-color: lightgrey;\">\n                </td>\n                <th [attr.colspan]=\"table.headers.selectors.length\" class=\"table-header selector-header wide\" scope=\"colgroup\">\n                    <div>\n                        Selectors\n                        <button (click)=\"openHeaderDialog('selectors')\" style=\"float: right;\" type=\"button\" pButton class=\"btn-xs btn-primary\">\n                            <i class=\"fa fa-plus fa-fw\">&nbsp; </i>\n                        </button>\n                    </div>\n                </th>\n                <th [attr.colspan]=\"table.headers.data.length\" class=\"table-header data-header wide\" scope=\"colgroup\">\n                    <div>\n                        Data\n                        <button (click)=\"openHeaderDialog('data')\" style=\"float: right;\" type=\"button\" pButton class=\"btn-xs btn-primary\">\n                            <i class=\"fa fa-plus fa-fw\">&nbsp; </i>\n                        </button>\n                    </div>\n                </th>\n                <th [attr.colspan]=\"table.headers.user.length\" class=\"table-header user-header wide\" scope=\"colgroup\">\n                    <div>\n                        User\n                        <button (click)=\"openUserHeaderDialog()\" style=\"float: right;\" type=\"button\" pButton class=\"btn-xs btn-primary\">\n                            <i class=\"fa fa-plus fa-fw\">&nbsp; </i>\n                        </button>\n                    </div>\n                </th>\n                <th class=\"table-header small\" rowspan=\"2\" scope=\"colgroup\">Usage</th>\n                <th class=\"table-header small\" rowspan=\"2\" scope=\"colgroup\">Cardinality</th>\n            </tr>\n\n            <!--DYNAMIC HEADERS-->\n            <tr>\n\n                <ng-container *ngIf=\"!table.headers.selectors.length\">\n                    <td class=\"table-header selector-header wide\"></td>\n                </ng-container>\n\n                <td *ngFor=\"let header of table.headers.selectors; let i = index\" class=\"table-header selector-header wide\">\n                    <ng-container *ngTemplateOutlet=\"dataElement; context : {$implicit : header, list : table.headers.selectors, index : i }\"></ng-container>\n                </td>\n\n                <ng-container *ngIf=\"!table.headers.data.length\">\n                    <td class=\"table-header data-header wide\"></td>\n                </ng-container>\n\n                <td *ngFor=\"let header of table.headers.data; let i = index\" class=\"table-header data-header wide\">\n                    <ng-container *ngTemplateOutlet=\"dataElement; context : {$implicit : header, list : table.headers.data, index : i }\"></ng-container>\n                </td>\n\n                <ng-container *ngIf=\"!table.headers.user.length\">\n                    <td class=\"table-header user-header wide\"></td>\n                </ng-container>\n\n                <td *ngFor=\"let header of table.headers.user; let i = index\" class=\"table-header user-header wide\">\n                    <ng-container *ngTemplateOutlet=\"userHeader; context : {$implicit : header, list : table.headers.user, index : i }\"></ng-container>\n                </td>\n            </tr>\n\n            <!--TABLE CONTENT-->\n            <tr style=\"background-color: lightgrey;\">\n              <td></td>\n              <td [attr.colspan]=\"groupHeaderSize(table)+2\" style=\"text-align: center;\">\n                <button (click)=\"addCc(table.content.free)\" *ngIf=\"table.headers.selectors.length\" style=\"float: left;\" type=\"button\" pButton class=\"btn-xs btn-primary\">\n                  <i class=\"fa fa-plus fa-fw\">&nbsp; </i> Add Co-Constraint\n                </button>\n                Independent Co-Constraints\n              </td>\n            </tr>\n            <ng-container *ngTemplateOutlet=\"cclist; context : {$implicit : table.content.free}\"></ng-container>\n            <ng-container *ngFor=\"let group of table.content.groups; let i = index\">\n                <ng-container *ngTemplateOutlet=\"ccgroup; context : {$implicit : group, list : table.content.groups, index : i}\"></ng-container>\n            </ng-container>\n\n        </table>\n    </form>\n</div>\n\n\n<ng-template #empty let-type=\"type\" let-obj=\"obj\" let-key=\"key\">\n    <div style=\"width: 100%; height: 100%; background-color: lightgrey;\" (dblclick)=\"initCell(type,obj,key)\">\n\n    </div>\n</ng-template>\n\n<ng-template #value let-node let-req=\"req\">\n    <input type=\"text\" [(ngModel)]=\"node.value\" [required]=\"req\" [placeholder]=\"req ? 'required' : ''\">\n</ng-template>\n\n<ng-template #code let-node let-req=\"req\">\n    <input type=\"text\" [(ngModel)]=\"node.value\" style=\"width: 70%;\" [required]=\"req\" [placeholder]=\"req ? 'required' : ''\">\n    <p-dropdown appendTo=\"body\" [style]=\"{'width': '27%'}\" [placeholder]=\"'LOC'\" [required]=\"req\" [options]=\"[{ label : '1', value : '1'}, {label : '4', value : '4'}, {label : '1 or 4', value : '4'}]\" [(ngModel)]=\"node.location\"></p-dropdown>\n</ng-template>\n\n<ng-template #textArea let-node >\n    <textarea rows=\"1\" style=\"width: 100%;\" type=\"text\" [(ngModel)]=\"node.value\"></textarea>\n</ng-template>\n\n<ng-template #usage let-node>\n    <p-dropdown [options]=\"config.usages\" [(ngModel)]=\"node.usage\" [style]=\"{'width':'100%'}\"></p-dropdown>\n</ng-template>\n\n<ng-template #cardinality let-node>\n    <input [(ngModel)]=\"node.cardinality.min\" type=\"number\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n    <input [(ngModel)]=\"node.cardinality.max\" type=\"text\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n</ng-template>\n\n<ng-template #valueset let-obj=\"obj\" let-key=\"key\">\n    <div class=\"g-row\">\n        <div class=\"ui-g-10\">\n            <span *ngFor=\"let vs of obj[key]\" style=\"font-size : 1.15em;\">\n                <span style=\"background-color: #c7cfcc\" class=\"label label-icon\">\n                    <span class=\"label label-icon label-gray\">VS</span>\n                    <span style=\"color: black;\">{{vs.bindingIdentifier}}</span>\n                </span>\n            </span>\n        </div>\n        <div class=\"ui-g-2\">\n            <i (click)=\"openVSDialog(obj,key)\" class=\"fa fa-plus pull-right\" aria-hidden=\"true\"></i>\n        </div>\n    </div>\n</ng-template>\n\n<ng-template #cclist let-list>\n    <tr *ngFor=\"let row of list; let i = index\">\n        <td style=\"width: 30px;\">\n            <button (click)=\"delRow(list,i)\" type=\"button\" pButton class=\"btn-xs btn-danger\">\n                <i class=\"fa fa-trash\">&nbsp; </i>\n            </button>\n        </td>\n\n        <ng-container *ngIf=\"!table.headers.selectors.length\">\n            <td class=\"table-ndef wide\"></td>\n        </ng-container>\n\n        <td class=\"wide\" *ngFor=\"let field of table.headers.selectors\" (dblclick)=\"!row[field.id] && initCell(field.content.type,row,field.id)\">\n            <ng-container *ngIf=\"row[field.id]\">\n                <ng-container  *ngTemplateOutlet=\"template(field); context : {$implicit : row[field.id], obj : row, key : field.id, req : true}\"></ng-container>\n            </ng-container>\n        </td>\n\n        <ng-container *ngIf=\"!table.headers.data.length\">\n            <td class=\"table-ndef wide\"></td>\n        </ng-container>\n\n        <td class=\"wide\" *ngFor=\"let field of table.headers.data\" (dblclick)=\"!row[field.id] && initCell(field.content.type,row,field.id)\">\n            <ng-container *ngIf=\"row[field.id]\">\n                <ng-container  *ngTemplateOutlet=\"template(field); context : {$implicit : row[field.id], obj : row, key : field.id, req : false}\"></ng-container>\n            </ng-container>\n        </td>\n\n        <ng-container *ngIf=\"!table.headers.user.length\">\n            <td class=\"table-ndef wide\"></td>\n        </ng-container>\n\n        <td class=\"wide\" *ngFor=\"let field of table.headers.user\" >\n            <ng-container *ngIf=\"row[field.id]\">\n                <ng-container  *ngTemplateOutlet=\"template(field); context : {$implicit : row[field.id], obj : row, key : field.id, req : false}\"></ng-container>\n            </ng-container>\n            <!--<ng-container *ngTemplateOutlet=\"template(field); context : {$implicit : row[field.id]}\"></ng-container>-->\n        </td>\n        <td class=\"small\">\n            <ng-container *ngTemplateOutlet=\"usage; context : {$implicit : row.requirements}\"></ng-container>\n        </td>\n        <td class=\"small\">\n            <ng-container *ngTemplateOutlet=\"cardinality; context : {$implicit : row.requirements}\"></ng-container>\n        </td>\n    </tr>\n</ng-template>\n\n<ng-template #ccgroup let-node let-index=\"index\" let-list=\"list\">\n    <tr style=\"background-color: black; border-top : 2px solid black;\">\n        <td style=\"width: 30px;\">\n            <button (click)=\"delGroup(list,index)\" type=\"button\" pButton class=\"btn-xs btn-danger\">\n                <i class=\"fa fa-trash\">&nbsp; </i>\n            </button>\n        </td>\n        <td [attr.colspan]=\"groupHeaderSize(table)\">\n          <button (click)=\"addCc(node.content.free)\" style=\"float: left; margin-right: 5px;\" type=\"button\" pButton class=\"btn-xs btn-primary\">\n            <i class=\"fa fa-plus fa-fw\">&nbsp; </i> Add Co-Constraint\n          </button>\n          <input style=\"width: 80% !important;\" [(ngModel)]=\"node.data.name\" type=\"text\" required placeholder=\"required\" >\n        </td>\n        <td class=\"small\">\n            <ng-container *ngTemplateOutlet=\"usage; context : {$implicit : node.data.requirements}\"></ng-container>\n        </td>\n        <td class=\"small\">\n            <ng-container *ngTemplateOutlet=\"cardinality; context : {$implicit : node.data.requirements}\"></ng-container>\n        </td>\n    </tr>\n    <ng-container *ngTemplateOutlet=\"cclist; context : {$implicit : node.content.free}\"></ng-container>\n</ng-template>\n\n<ng-template #dataElement let-header let-index=\"index\" let-list=\"list\">\n    <div style=\"width: 100%; text-align: center; font-size: 13px;\">\n        <span style=\"float : left\">\n            <span *ngIf=\"header.content.type === 1\">\n                <span class=\"label label-icon label-gray\">Value</span>\n            </span>\n            <span *ngIf=\"header.content.type === 2\">\n                <span class=\"label label-icon label-gray\">Value Set</span>\n            </span>\n            <span *ngIf=\"header.content.type === 3\">\n                <span class=\"label label-icon label-gray\">Datatype</span>\n            </span>\n            <span *ngIf=\"header.content.type === 4\">\n                <span class=\"label label-icon label-gray\">Flavor</span>\n            </span>\n            <span *ngIf=\"header.content.type === 5\">\n                <span class=\"label label-icon label-gray\">Code</span>\n            </span>\n        </span>\n        <display-badge [type]=\"header.content.elmType\"></display-badge>\n        {{header.label}}\n        <button *ngIf=\"!header.keep\" (click)=\"delCol(list, index, header.id)\" style=\"float: right;\" type=\"button\" pButton class=\"btn-xs btn-danger\">\n            <i class=\"fa fa-trash\">&nbsp; </i>\n        </button>\n    </div>\n</ng-template>\n\n<ng-template #userHeader let-header let-index=\"index\" let-list=\"list\">\n    {{header.label}}\n    <button (click)=\"delCol(list, index, header.id)\" style=\"float: right;\" type=\"button\" pButton class=\"btn-xs btn-danger\">\n        <i class=\"fa fa-trash\">&nbsp; </i>\n    </button>\n</ng-template>\n\n<ng-template #datatype let-node let-cc=\"obj\">\n    <p-dropdown #dtField placeholder=\"Datatype\" [options]=\"config.dynCodes\" appendTo=\"body\"[(ngModel)]=\"node.value\" [style]=\"{'width':'100%', 'text-align' : 'center'}\"  (onChange)=\"dtChange(cc.k5)\" required=\"true\"></p-dropdown>\n</ng-template>\n\n<ng-template #flavor let-node let-cc=\"obj\">\n  <p-dropdown #flField placeholder=\"Flavor\" *ngIf=\"cc.k2.value\" [options]=\"config.datatypes | dtFlavor : cc.k2.value\" appendTo=\"body\" [(ngModel)]=\"node.value\" [style]=\"{'width':'100%', 'text-align' : 'center'}\" required=\"true\"></p-dropdown>\n</ng-template>\n\n<valueset-binding-picker></valueset-binding-picker>\n<cc-header-dialog-dm [segment]=\"_segment\"></cc-header-dialog-dm>\n<cc-header-dialog-user></cc-header-dialog-user>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint.domain.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CCSelectorType; });
var CCSelectorType;
(function (CCSelectorType) {
    CCSelectorType[CCSelectorType["ByValue"] = 1] = "ByValue";
    CCSelectorType[CCSelectorType["ByValueSet"] = 2] = "ByValueSet";
    CCSelectorType[CCSelectorType["DataType"] = 3] = "DataType";
    CCSelectorType[CCSelectorType["DatatypeFlavor"] = 4] = "DatatypeFlavor";
    CCSelectorType[CCSelectorType["ByCode"] = 5] = "ByCode";
})(CCSelectorType || (CCSelectorType = {}));


/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/header-dialog/header-dialog-dm.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CCHeaderDialogDm; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint.domain.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_prime_ng_adapters_prime_dialog_adapter__ = __webpack_require__("../../../../../src/app/common/prime-ng-adapters/prime-dialog-adapter.ts");
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



var CCHeaderDialogDm = (function (_super) {
    __extends(CCHeaderDialogDm, _super);
    function CCHeaderDialogDm() {
        var _this = _super.call(this) || this;
        _this._segment = {};
        _this.header = "";
        _this.type = null;
        _this.fixed = false;
        return _this;
    }
    Object.defineProperty(CCHeaderDialogDm.prototype, "segment", {
        set: function (val) {
            this._segment = val;
        },
        enumerable: true,
        configurable: true
    });
    CCHeaderDialogDm.prototype.setNode = function (node) {
        this.node = node.data;
    };
    CCHeaderDialogDm.prototype.addHeader = function () {
        this.dismissWithData({
            id: this.node.path,
            label: this._segment.name + '-' + this.node.path,
            content: {
                elmType: this.node.obj.type,
                path: this.node.path,
                type: this.type
            }
        });
    };
    CCHeaderDialogDm.prototype.dismiss = function () {
        this.dismissWithNoData();
    };
    CCHeaderDialogDm.prototype.onDialogOpen = function () {
    };
    CCHeaderDialogDm.prototype.ngOnInit = function () {
        this.hook(this);
        this.selectorTypes = [
            {
                label: "Constant",
                value: __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByValue
            },
            {
                label: "Value Set",
                value: __WEBPACK_IMPORTED_MODULE_1__coconstraint_domain__["a" /* CCSelectorType */].ByValueSet
            }
        ];
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], CCHeaderDialogDm.prototype, "segment", null);
    CCHeaderDialogDm = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'cc-header-dialog-dm',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/header-dialog/header-dialog-dm.template.html")
        }),
        __metadata("design:paramtypes", [])
    ], CCHeaderDialogDm);
    return CCHeaderDialogDm;
}(__WEBPACK_IMPORTED_MODULE_2__common_prime_ng_adapters_prime_dialog_adapter__["a" /* PrimeDialogAdapter */]));



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/header-dialog/header-dialog-dm.template.html":
/***/ (function(module, exports) {

module.exports = "<p-dialog [(visible)]=\"_visible\" modal=\"modal\" [responsive]=\"true\" [resizable]=\"false\" [draggable]=\"false\"  appendTo=\"body\">\n    <p-header>\n        Select Data Element\n    </p-header>\n    <p-dropdown [disabled]=\"fixed\" [style]=\"{'width':'100%'}\" placeholder=\"Value Type\" [options]=\"selectorTypes\" [(ngModel)]=\"type\" appendTo=\"body\"></p-dropdown>\n    <div style=\"max-height: 500px; overflow-y : scroll;\">\n      <segment-tree [segment]=\"_segment\" (nodeSelect)=\"setNode($event)\"></segment-tree>\n    </div>\n    <p-footer>\n        <button type=\"button\" *ngIf=\"type && node\" (click)=\"addHeader()\" class=\"btn btn-success\" pButton icon=\"fa-check\" > Select </button>\n    </p-footer>\n</p-dialog>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/header-dialog/header-dialog-user.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CCHeaderDialogUser; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_prime_ng_adapters_prime_dialog_adapter__ = __webpack_require__("../../../../../src/app/common/prime-ng-adapters/prime-dialog-adapter.ts");
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
/**
 * Created by hnt5 on 10/16/17.
 */


var CCHeaderDialogUser = (function (_super) {
    __extends(CCHeaderDialogUser, _super);
    function CCHeaderDialogUser() {
        var _this = _super.call(this) || this;
        _this.header = "";
        return _this;
    }
    CCHeaderDialogUser.prototype.addHeader = function () {
        this.dismissWithData({
            id: this.header.replace(' ', '-'),
            label: this.header
        });
    };
    CCHeaderDialogUser.prototype.dismiss = function () {
        this.dismissWithNoData();
    };
    CCHeaderDialogUser.prototype.onDialogOpen = function () {
        this.header = '';
    };
    CCHeaderDialogUser.prototype.ngOnInit = function () {
        this.hook(this);
    };
    CCHeaderDialogUser = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'cc-header-dialog-user',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/header-dialog/header-dialog-user.template.html")
        }),
        __metadata("design:paramtypes", [])
    ], CCHeaderDialogUser);
    return CCHeaderDialogUser;
}(__WEBPACK_IMPORTED_MODULE_1__common_prime_ng_adapters_prime_dialog_adapter__["a" /* PrimeDialogAdapter */]));



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/header-dialog/header-dialog-user.template.html":
/***/ (function(module, exports) {

module.exports = "<p-dialog [(visible)]=\"_visible\" modal=\"modal\" [positionTop]=\"40\"  appendTo=\"body\">\n    <p-header>\n        User Column Header\n    </p-header>\n    <input type=\"text\" style=\"width: 100%;\" [(ngModel)]=\"header\">\n    <p-footer>\n        <button type=\"button\" *ngIf=\"header && header.length > 0\" (click)=\"addHeader()\" class=\"btn btn-success\" pButton icon=\"fa-check\" > Select </button>\n    </p-footer>\n</p-dialog>"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-definition-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentDefinitionRouting; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__segment_definition_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-definition.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__coconstraint_table_coconstraint_table_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint-table.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__segment_structure_segment_structure_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-structure/segment-structure.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var SegmentDefinitionRouting = (function () {
    function SegmentDefinitionRouting() {
    }
    SegmentDefinitionRouting = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"].forChild([
                    {
                        path: '',
                        component: __WEBPACK_IMPORTED_MODULE_2__segment_definition_component__["a" /* SegmentDefinitionComponent */],
                        children: [
                            { path: 'coconstraints', component: __WEBPACK_IMPORTED_MODULE_3__coconstraint_table_coconstraint_table_component__["a" /* CoConstraintTableComponent */] },
                            { path: 'structure', component: __WEBPACK_IMPORTED_MODULE_4__segment_structure_segment_structure_component__["a" /* SegmentStructureComponent */] },
                        ]
                    }
                ])
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"]
            ]
        })
    ], SegmentDefinitionRouting);
    return SegmentDefinitionRouting;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-definition.component.html":
/***/ (function(module, exports) {

module.exports = "<p-tabMenu [model]=\"segmentDefTabs\"></p-tabMenu>\n<router-outlet></router-outlet>\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-definition.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentDefinitionComponent; });
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


var SegmentDefinitionComponent = (function () {
    function SegmentDefinitionComponent(route) {
        this.route = route;
    }
    SegmentDefinitionComponent.prototype.ngOnInit = function () {
        this.segmentDefTabs = [
            { label: 'Pre-text', routerLink: './pre' },
            { label: 'Structure', routerLink: './structure' },
            { label: 'Post-text', routerLink: './post' },
            { label: 'Conf. Statements', routerLink: './confstatements' },
            { label: 'Predicates', routerLink: './predicates' },
            { label: 'Co-constraints', routerLink: './coconstraints' }
        ];
    };
    SegmentDefinitionComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'segment-definition',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-definition.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"]])
    ], SegmentDefinitionComponent);
    return SegmentDefinitionComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-definition.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SegmentDefinitionModule", function() { return SegmentDefinitionModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__segment_definition_routing_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-definition-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__segment_definition_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-definition.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_components_tabmenu_tabmenu__ = __webpack_require__("../../../../primeng/components/tabmenu/tabmenu.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_components_tabmenu_tabmenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_primeng_components_tabmenu_tabmenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_components_dialog_dialog__ = __webpack_require__("../../../../primeng/components/dialog/dialog.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_components_dialog_dialog___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_primeng_components_dialog_dialog__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_components_dropdown_dropdown__ = __webpack_require__("../../../../primeng/components/dropdown/dropdown.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_components_dropdown_dropdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_primeng_components_dropdown_dropdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__common_segment_tree_segment_tree_service__ = __webpack_require__("../../../../../src/app/common/segment-tree/segment-tree.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__coconstraint_table_coconstraint_table_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint-table.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__coconstraint_table_header_dialog_header_dialog_user_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/header-dialog/header-dialog-user.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__coconstraint_table_header_dialog_header_dialog_dm_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/header-dialog/header-dialog-dm.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__common_segment_tree_segment_tree_component__ = __webpack_require__("../../../../../src/app/common/segment-tree/segment-tree.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__coconstraint_table_coconstraint_table_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/coconstraint-table/coconstraint-table.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_primeng_components_tree_tree__ = __webpack_require__("../../../../primeng/components/tree/tree.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_primeng_components_tree_tree___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_primeng_components_tree_tree__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__common_valueset_binding_picker_valueset_binding_picker_component__ = __webpack_require__("../../../../../src/app/common/valueset-binding-picker/valueset-binding-picker.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__common_datatype_binding_picker_datatype_binding_picker_component__ = __webpack_require__("../../../../../src/app/common/datatype-binding-picker/datatype-binding-picker.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_primeng_components_datalist_datalist__ = __webpack_require__("../../../../primeng/components/datalist/datalist.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_primeng_components_datalist_datalist___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18_primeng_components_datalist_datalist__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_primeng_components_datatable_datatable__ = __webpack_require__("../../../../primeng/components/datatable/datatable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_primeng_components_datatable_datatable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19_primeng_components_datatable_datatable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__segment_structure_segment_structure_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-structure/segment-structure.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_primeng_components_treetable_treetable__ = __webpack_require__("../../../../primeng/components/treetable/treetable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_primeng_components_treetable_treetable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21_primeng_components_treetable_treetable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__segment_structure_segment_table_segment_table_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-structure/segment-table/segment-table.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__utils_utils_module__ = __webpack_require__("../../../../../src/app/utils/utils.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
























var SegmentDefinitionModule = (function () {
    function SegmentDefinitionModule() {
    }
    SegmentDefinitionModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_5__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_components_tabmenu_tabmenu__["TabMenuModule"],
                __WEBPACK_IMPORTED_MODULE_7_primeng_components_dialog_dialog__["DialogModule"],
                __WEBPACK_IMPORTED_MODULE_8_primeng_components_dropdown_dropdown__["DropdownModule"],
                __WEBPACK_IMPORTED_MODULE_15_primeng_components_tree_tree__["TreeModule"],
                __WEBPACK_IMPORTED_MODULE_3__segment_definition_routing_module__["a" /* SegmentDefinitionRouting */],
                __WEBPACK_IMPORTED_MODULE_2_primeng_primeng__["GrowlModule"],
                __WEBPACK_IMPORTED_MODULE_18_primeng_components_datalist_datalist__["DataListModule"],
                __WEBPACK_IMPORTED_MODULE_19_primeng_components_datatable_datatable__["DataTableModule"],
                __WEBPACK_IMPORTED_MODULE_21_primeng_components_treetable_treetable__["TreeTableModule"],
                __WEBPACK_IMPORTED_MODULE_23__utils_utils_module__["a" /* UtilsModule */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_10__coconstraint_table_coconstraint_table_service__["a" /* CoConstraintTableService */], __WEBPACK_IMPORTED_MODULE_9__common_segment_tree_segment_tree_service__["a" /* SegmentTreeNodeService */]],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__segment_definition_component__["a" /* SegmentDefinitionComponent */], __WEBPACK_IMPORTED_MODULE_14__coconstraint_table_coconstraint_table_component__["a" /* CoConstraintTableComponent */], __WEBPACK_IMPORTED_MODULE_13__common_segment_tree_segment_tree_component__["a" /* SegmentTreeComponent */], __WEBPACK_IMPORTED_MODULE_12__coconstraint_table_header_dialog_header_dialog_dm_component__["a" /* CCHeaderDialogDm */], __WEBPACK_IMPORTED_MODULE_11__coconstraint_table_header_dialog_header_dialog_user_component__["a" /* CCHeaderDialogUser */], __WEBPACK_IMPORTED_MODULE_16__common_valueset_binding_picker_valueset_binding_picker_component__["a" /* ValueSetBindingPickerComponent */], __WEBPACK_IMPORTED_MODULE_20__segment_structure_segment_structure_component__["a" /* SegmentStructureComponent */], __WEBPACK_IMPORTED_MODULE_22__segment_structure_segment_table_segment_table_component__["a" /* SegmentTableComponent */], __WEBPACK_IMPORTED_MODULE_17__common_datatype_binding_picker_datatype_binding_picker_component__["a" /* DatatypeBindingPickerComponent */]
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["CUSTOM_ELEMENTS_SCHEMA"]]
        })
    ], SegmentDefinitionModule);
    return SegmentDefinitionModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-structure/segment-structure.component.html":
/***/ (function(module, exports) {

module.exports = "<segment-table [segment]=\"_segment\"></segment-table>\n\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-structure/segment-structure.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentStructureComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
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
 * Created by hnt5 on 10/27/17.
 */


var SegmentStructureComponent = (function () {
    function SegmentStructureComponent(_ws) {
        var _this = this;
        this._ws = _ws;
        _ws.getCurrent(__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["a" /* Entity */].SEGMENT).subscribe(function (data) { _this.segment = data; });
    }
    Object.defineProperty(SegmentStructureComponent.prototype, "segment", {
        set: function (s) {
            this._segment = s;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], SegmentStructureComponent.prototype, "segment", null);
    SegmentStructureComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'segment-structure',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-structure/segment-structure.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["b" /* WorkspaceService */]])
    ], SegmentStructureComponent);
    return SegmentStructureComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-structure/segment-table/segment-table.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".segment-tree-table {\n  max-height: 500px;\n  overflow-y : scroll;\n}\n\n.tt-table {\n  height: 500px;\n}\n\n.empty {\n  width: 100%;\n  height: 100%;\n  background-color: #221010;\n}\n\n.valueset {\n  width:300px;\n}\n\n.colordiv {\n  background-color: #221010;\n}\n\n.ui-treetable thead th, .ui-treetable tbody td, .ui-treetable tfoot td{\n  background-color: #221010;\n}\n\n.label-segment-binding-icon {\n  color: blue !important;\n}\n\n.label-field-binding-icon {\n  color:purple !important;\n}\n\n.label-component-binding-icon {\n  color:#d400d4 !important;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-structure/segment-table/segment-table.component.html":
/***/ (function(module, exports) {

module.exports = "<div style=\"overflow: scroll;\">\n\n  <div class=\"table-context\">\n    <strong> Context :</strong>\n    <span class=\"label-segment-binding-icon\">\n      <i class=\"fa fa-circle fa-fw\"></i>\n    </span>\n      Segment\n    <span class=\"label-field-binding-icon\">\n      <i class=\"fa fa-circle fa-fw\"></i>\n    </span>\n      Field\n    <span class=\"label-component-binding-icon\">\n      <i class=\"fa fa-circle fa-fw\"></i>\n    </span>\n      Component\n  </div>\n\n  <p-treeTable [value]=\"tree\" (onNodeExpand)=\"loadNode($event)\" tableStyleClass=\"table-condensed table-stripped table-bordered\">\n    \n    <p-column field=\"obj.name\" header=\"Name\" [style]=\"{'width':'350px'}\">\n      <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n        <display-badge [type]=\"node.data.obj.type\"></display-badge> {{node.data.obj.position}} {{node.data.obj.name}}\n      </ng-template>\n    </p-column>\n\n    <p-column field=\"obj\" header=\"Usage\" [style]=\"{'width':'100px'}\" >\n      <ng-template let-col let-node=\"rowData\" pTemplate=\"body\" >\n        <div *ngIf=\"node.data.obj.type === 'field'\">\n          <p-dropdown [options]=\"usages\" [(ngModel)]=\"node.data.obj.usage\" appendTo=\"body\" [style]=\"{'width' : '100%'}\"></p-dropdown>\n        </div>\n        <div *ngIf=\"node.data.obj.type === 'component'\">\n          {{node.data.obj.usage}}\n        </div>\n      </ng-template>\n    </p-column>\n\n    <p-column header=\"Cardinality\" [style]=\"{'width':'100px'}\">\n      <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n        <div *ngIf=\"node.data.obj.type === 'field'\">\n          <input [(ngModel)]=\"node.data.obj.min\" type=\"number\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n          <input [(ngModel)]=\"node.data.obj.max\" type=\"text\" style=\"width:45%;border-width:0px 0px 1px 0px\"/>\n        </div>\n      </ng-template>\n    </p-column>\n\n    <p-column header=\"Length\" [style]=\"{'width':'150px'}\">\n      <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n          <div *ngIf=\"node.data.obj.type === 'field'\">\n            <div *ngIf=\"node.data.obj.minLength !== 'NA' && node.leaf\">\n              <input [(ngModel)]=\"node.data.obj.minLength\" type=\"text\" style=\"width:40%;border-width:0px 0px 1px 0px\"/>\n              <input [(ngModel)]=\"node.data.obj.maxLength\" type=\"text\" style=\"width:40%;border-width:0px 0px 1px 0px\"/>\n              <i class=\"fa fa-times\" (click)=\"delLength(node)\" style=\"width:20%;\"></i>\n            </div>\n          </div>\n          <div *ngIf=\"node.data.obj.type === 'component'\">\n            [{{node.data.obj.minLength}}..{{node.data.obj.maxLength}}]\n          </div>\n      </ng-template>\n    </p-column>\n\n    <p-column header=\"Conf. Length\" [style]=\"{'width':'120px'}\" >\n      <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n        <div *ngIf=\"node.data.obj.type === 'field'\">\n          <ng-container *ngIf=\"node.data.obj.confLength != 'NA' && node.leaf\">\n            <input [(ngModel)]=\"node.data.obj.confLength\" type=\"text\" style=\"width: 80%;border-width:0px 0px 1px 0px\"/>\n            <i class=\"fa fa-times\" (click)=\"delConfLength(node)\" style=\"width:20%;\"></i>\n          </ng-container>\n        </div>\n        <div *ngIf=\"node.data.obj.type === 'component'\">\n          {{node.data.obj.confLength}}\n        </div>\n      </ng-template>\n    </p-column>\n\n    <p-column header=\"Datatype\" [style]=\"{'width':'150px'}\">\n      <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n        <div *ngIf=\"!node.data.obj.datatype.edit\">\n          <display-label [elm]=\"node.data.obj.datatype\"></display-label>\n          <i class=\"fa fa-pencil\" *ngIf=\"node.data.obj.type === 'field'\" (click)=\"makeEditModeDT(node)\"></i>\n        </div>\n        <div *ngIf=\"node.data.obj.datatype.edit\">\n            <p-dropdown [options]=\"node.data.obj.datatype.options\" [(ngModel)]=\"node.data.obj.datatype\" (onChange)=\"onChange(node)\" appendTo=\"body\" [style]=\"{'width':'100%'}\">\n                <ng-template let-dt pTemplate=\"body\">\n                    <div class=\"ui-helper-clearfix\" style=\"position: relative;height: 25px;\">\n                        <display-label *ngIf=\"dt.label!=='Change Datatype root'\" [elm]=\"dt.value\"></display-label>\n                        <span *ngIf=\"dt.label==='Change Datatype root'\">{{dt.label}}</span>\n                    </div>\n                </ng-template>\n            </p-dropdown>\n        </div>\n      </ng-template>\n    </p-column>\n\n    <p-column [style]=\"{'width':'150px'}\">\n      <ng-template pTemplate=\"header\">\n        ValueSet \n      </ng-template>\n\n      <ng-template let-node=\"rowData\" pTemplate=\"body\">\n          <div *ngIf=\"node.data.isAvailableForValueSet\">\n            <div *ngIf=\"node.data.segmentValueSetBindings.length > 0\">\n              <div *ngFor=\"let binding of node.data.segmentValueSetBindings\">\n                <i class=\"fa fa-circle fa-fw label-segment-binding-icon\"></i>\n                {{binding.bindingIdentifier}}\n                <i class=\"fa fa-times\" (click)=\"delValueSet(binding,node)\"></i>\n                <i class=\"fa fa-pencil\" (click)=\"makeEditModeDT(node)\"></i>\n              </div>\n            </div>\n            <div *ngIf=\"node.data.segmentValueSetBindings.length === 0 && node.data.fieldDTValueSetBindings.length > 0\">\n              <div *ngFor=\"let binding of node.data.fieldDTValueSetBindings\">\n                <i class=\"fa fa-circle fa-fw label-field-binding-icon\"></i>\n                {{binding.bindingIdentifier}}\n                <i class=\"fa fa-pencil\" (click)=\"makeEditModeDT(node)\"></i>\n              </div>\n            </div>\n            <div *ngIf=\"node.data.segmentValueSetBindings.length === 0 && node.data.fieldDTValueSetBindings.length === 0 && node.data.componentDTValueSetBindings.length > 0\">\n              <div *ngFor=\"let binding of node.data.componentDTValueSetBindings\">\n                <i class=\"fa fa-circle fa-fw label-component-binding-icon\"></i>\n                {{binding.bindingIdentifier}}\n                <i class=\"fa fa-pencil\" (click)=\"makeEditModeDT(node)\"></i>\n              </div>\n            </div>\n          </div>\n          <div *ngIf=\"!node.data.isAvailableForValueSet\">NA</div>\n      </ng-template>\n    </p-column>\n\n    <p-column header=\"Single Code\" [style]=\"{'width':'150px'}\">\n        <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n            <div class=\"ui-g-10\">\n                <ng-container *ngIf=\"node.data.binding\">\n                    {{node.data.binding.tableId}}\n                </ng-container>\n            </div>\n            <div class=\"ui-g-2\">\n            </div>\n        </ng-template>\n      </p-column>\n\n\n    \n      <p-column header=\"Constant Value\" [style]=\"{'width':'100px'}\">\n      <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n      </ng-template>\n    </p-column>\n\n    <p-column header=\"Predicate\" [style]=\"{'width':'100px'}\">\n      <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n      </ng-template>\n    </p-column>\n\n    <p-column header=\"Text Definition\" [style]=\"{'width':'100px'}\">\n      <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n        <div *ngIf=\"node.data.obj.type === 'field'\">\n          <div *ngIf=\"node.data.obj.text\">\n\n          </div>\n          <div *ngIf=\"!node.data.obj.text\">\n            \n          </div>\n        </div>\n      </ng-template>\n    </p-column>\n\n    <p-column header=\"Comment\" [style]=\"{'width':'100px'}\">\n      <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n\n      </ng-template>\n    </p-column>\n\n    <p-column header=\"Path (For Dev)\" [style]=\"{'width':'100px'}\">\n        <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n            {{node.data.path}}\n        </ng-template>\n    </p-column>\n  </p-treeTable>\n\n</div>\n\n<datatype-binding-picker></datatype-binding-picker>"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-structure/segment-table/segment-table.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentTableComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_segment_tree_segment_tree_service__ = __webpack_require__("../../../../../src/app/common/segment-tree/segment-tree.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_datatype_binding_picker_datatype_binding_picker_component__ = __webpack_require__("../../../../../src/app/common/datatype-binding-picker/datatype-binding-picker.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
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
 * Created by hnt5 on 10/27/17.
 */




var SegmentTableComponent = (function () {
    function SegmentTableComponent(treeNodeService, configService) {
        this.treeNodeService = treeNodeService;
        this.configService = configService;
    }
    SegmentTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.treeNodeService.getFieldsAsTreeNodes(this.segment).then(function (result) {
            _this.tree = result;
            console.log(_this.tree);
        });
        this.usages = this.configService.usages;
    };
    SegmentTableComponent.prototype.loadNode = function ($event) {
        if ($event.node && !$event.node.children) {
            this.treeNodeService.getComponentsAsTreeNodes($event.node, this.segment).then(function (nodes) {
                $event.node.children = nodes;
            });
        }
    };
    SegmentTableComponent.prototype.checkStyleClass = function () {
        console.log("called!!");
        return "error";
    };
    SegmentTableComponent.prototype.delLength = function (node) {
        node.data.obj.minLength = 'NA';
        node.data.obj.maxLength = 'NA';
        node.data.obj.confLength = '';
    };
    SegmentTableComponent.prototype.delConfLength = function (node) {
        node.data.obj.minLength = '';
        node.data.obj.maxLength = '';
        node.data.obj.confLength = 'NA';
    };
    SegmentTableComponent.prototype.delValueSet = function (binding, node) {
        var indexForBinding = -1;
        for (var _i = 0, _a = this.segment.valueSetBindings; _i < _a.length; _i++) {
            var b = _a[_i];
            if (node.data.path === b.location && b.type === 'valueset' && b.tableId === binding.id) {
                indexForBinding = this.segment.valueSetBindings.indexOf(b);
            }
        }
        if (indexForBinding >= 0) {
            this.segment.valueSetBindings.splice(indexForBinding, 1);
        }
        var index = node.data.segmentValueSetBindings.indexOf(binding);
        if (index >= 0) {
            node.data.segmentValueSetBindings.splice(index, 1);
        }
    };
    SegmentTableComponent.prototype.makeEditModeDT = function (node) {
        node.data.obj.datatype.options = [];
        node.data.obj.tempDatatype = node.data.obj.datatype;
        this.treeNodeService.getDatatypes().subscribe(function (datatypes) {
            if (datatypes) {
                for (var _i = 0, datatypes_1 = datatypes; _i < datatypes_1.length; _i++) {
                    var dt = datatypes_1[_i];
                    if (dt.name === node.data.obj.datatype.name) {
                        if (node.data.obj.datatype.id === dt.id) {
                            var oldOptions = node.data.obj.datatype.options;
                            node.data.obj.datatype = dt;
                            node.data.obj.datatype.options = oldOptions;
                            node.data.obj.datatype.edit = true;
                        }
                        node.data.obj.datatype.options.push({ label: dt.label, value: dt });
                    }
                }
            }
            node.data.obj.datatype.options.push({ label: 'Change Datatype root', value: null });
        });
    };
    SegmentTableComponent.prototype.onChange = function (node) {
        if (!node.data.obj.datatype) {
            node.data.obj.datatype = node.data.obj.tempDatatype;
            this.openDTDialog(node);
        }
        node.children = null;
        if (node.data.obj.datatype.numOfChildren > 0)
            this.treeNodeService.getComponentsAsTreeNodes(node, this.segment).then(function (nodes) { return node.children = nodes; });
    };
    SegmentTableComponent.prototype.openDTDialog = function (node) {
        var _this = this;
        this.dtPicker.open({
            selectedDatatypeId: node.data.obj.datatype.id
        }).subscribe(function (result) {
            if (result) {
                node.data.obj.datatype = result;
                node.children = null;
                if (node.data.obj.datatype.numOfChildren > 0) {
                    _this.treeNodeService.getComponentsAsTreeNodes(node, _this.segment).then(function (nodes) { return node.children = nodes; });
                }
                else {
                    node.leaf = true;
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], SegmentTableComponent.prototype, "segment", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_2__common_datatype_binding_picker_datatype_binding_picker_component__["a" /* DatatypeBindingPickerComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2__common_datatype_binding_picker_datatype_binding_picker_component__["a" /* DatatypeBindingPickerComponent */])
    ], SegmentTableComponent.prototype, "dtPicker", void 0);
    SegmentTableComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'segment-table',
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-structure/segment-table/segment-table.component.html"),
            styles: [__webpack_require__("../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-structure/segment-table/segment-table.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__common_segment_tree_segment_tree_service__["a" /* SegmentTreeNodeService */], __WEBPACK_IMPORTED_MODULE_3__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */]])
    ], SegmentTableComponent);
    return SegmentTableComponent;
}());



/***/ }),

/***/ "../../../../underscore/underscore.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
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

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
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

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
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
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
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
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

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
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
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
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
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
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
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

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
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
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
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
    if (array == null) return void 0;
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
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
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
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
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
      if (isSorted) {
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
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
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

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
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

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
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
  }

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
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
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
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

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
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
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
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
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

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
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

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
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
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

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
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
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
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
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

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
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
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
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
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
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

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
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
    // Regexes for identifying a key that needs to be escaped
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

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
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
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

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
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
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
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
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
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
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
    return '' + this._wrapped;
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
}.call(this));


/***/ })

});
//# sourceMappingURL=segment-definition.module.chunk.js.map