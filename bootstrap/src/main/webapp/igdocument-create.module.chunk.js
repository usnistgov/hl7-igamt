webpackJsonp(["igdocument-create.module"],{

/***/ "../../../../../src/app/igdocuments/igdocument-create/igdocument-create-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentCreateRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__igdocument_create_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-create/igdocument-create.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_auth_guard_service__ = __webpack_require__("../../../../../src/app/login/auth-guard.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by ena3 on 12/29/17.
 */




var IgDocumentCreateRoutingModule = (function () {
    function IgDocumentCreateRoutingModule() {
    }
    IgDocumentCreateRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"].forChild([
                    {
                        path: '',
                        canActivate: [__WEBPACK_IMPORTED_MODULE_3__login_auth_guard_service__["a" /* AuthGuard */]],
                        component: __WEBPACK_IMPORTED_MODULE_2__igdocument_create_component__["a" /* IgDocumentCreateComponent */],
                        children: []
                    }
                ])
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"]
            ]
        })
    ], IgDocumentCreateRoutingModule);
    return IgDocumentCreateRoutingModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-create/igdocument-create.component.html":
/***/ (function(module, exports) {

module.exports = "<mat-horizontal-stepper #stepper [linear]=\"isLinear\">\n  <mat-step [stepControl]=\"firstFormGroup\">\n    <ng-template matStepLabel>MetaData</ng-template>\n    <form [formGroup]=\"firstFormGroup\">\n      <mat-form-field class=\"ui-g-12\">\n        <input  matInput placeholder=\"IG Document Title\" [(ngModel)]=\"metaData.title\" name=\"title\" formControlName=\"firstCtrl\" required>\n      </mat-form-field>\n      <mat-form-field class=\"ui-g-12\">\n        <input [(ngModel)]=\"metaData.subTitle\" matInput placeholder=\"IG Document Subtitle\" name=\"subTitle\" formControlName=\"firstCtrl\">\n      </mat-form-field>\n\n      <mat-form-field class=\"ui-g-12\">\n        <input matInput  [(ngModel)]=\"metaData.organization\" placeholder=\"Organization\" name=\"organization\" formControlName=\"firstCtrl\">\n      </mat-form-field>\n      <div>\n        <button matStepperNext style=\"float: right\" class=\"btn btn-primary\" type=\"button\">Next</button>\n      </div>\n    </form>\n  </mat-step>\n  <mat-step>\n    <ng-template matStepLabel>Message Events</ng-template>\n    <label>Hl7 Version</label>\n    <mat-radio-group  [(ngModel)]=\"selcetedVersion\" (change)=\"load()\">\n      <mat-radio-button  *ngFor=\"let v of hl7Versions\" value=\"{{v}}\">{{v}}</mat-radio-button>\n    </mat-radio-group>\n\n\n\n    <p-treeTable [value]=\"tableValue\"  selectionMode=\"checkbox\" [(selection)]=\"selectedNodes\" [style]=\"{'margin-top':'50px', 'max-height':'400px', 'overflow':'scroll'}\"\n                 [style]=\"{'margin-top':'50px'}\" >\n\n      <p-header>Message Event</p-header>\n      <p-column>\n          <ng-template let-col let-node=\"rowData\" pTemplate=\"header\">\n            Message\n          </ng-template>\n          <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n            <span *ngIf=\"node.data.type=='message'\">\n           {{node.data.name}}\n            </span>\n          </ng-template>\n      </p-column>\n\n      <p-column>\n        <ng-template let-col let-node=\"rowData\" pTemplate=\"header\">\n          Message Event\n        </ng-template>\n        <ng-template let-col let-node=\"rowData\" pTemplate=\"body\">\n            <span *ngIf=\"node.data.type!=='message'\">\n                       {{node.data.name}}\n            </span>\n        </ng-template>\n      </p-column>\n\n\n\n      <p-column field=\"description\" header=\"Description\"></p-column>\n    </p-treeTable>\n    <p>Selected Nodes: <span *ngFor=\"let file of selectedNodes\">{{file.data.name}} </span></p>\n    <div>\n      <button (click)=\"goBack(stepper)\" type=\"button\" [disabled]=\"stepper.selectedIndex === 0\">Backdd</button>\n      <button (click)=\"goForward(stepper);submitEvent()\" type=\"button\" [disabled]=\"stepper.selectedIndex === stepper._steps.length-1\">Next</button>\n    </div>\n  </mat-step>\n  <mat-step>\n    <ng-template matStepLabel>Done</ng-template>\n    <mat-progress-spinner *ngIf=\"loading\"></mat-progress-spinner>\n\n    <div>\n      <button (click)=\"goBack(stepper)\" type=\"button\" [disabled]=\"stepper.selectedIndex === 0\" >Backdd</button>\n    </div>\n    <button (click)=\"create()\" type=\"button\">Submit</button>\n\n  </mat-step>\n\n\n  <!-- one option -->\n\n</mat-horizontal-stepper>\n\n<!-- second option -->\n\n"

/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-create/igdocument-create.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentCreateComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_material__ = __webpack_require__("../../../material/esm5/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__igdocument_create_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-create/igdocument-create.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
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
 * Created by ena3 on 12/29/17.
 */






var IgDocumentCreateComponent = (function () {
    function IgDocumentCreateComponent(_formBuilder, createService, workSpace, router, route) {
        this._formBuilder = _formBuilder;
        this.createService = createService;
        this.workSpace = workSpace;
        this.router = router;
        this.route = route;
        this.isLinear = true;
        this.loading = false;
        this.metaData = {
            title: "",
            subTitle: "",
            organization: ""
        };
        this.messageEventMap = {};
        this.hl7Versions = this.workSpace.getAppInfo()["hl7Versions"];
        console.log(this.workSpace.getAppInfo());
    }
    IgDocumentCreateComponent.prototype.ngOnInit = function () {
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required]
        });
    };
    IgDocumentCreateComponent.prototype.ngAfterViewInit = function () {
        this.totalStepsCount = this.myStepper._steps.length;
    };
    IgDocumentCreateComponent.prototype.goBack = function (stepper) {
        stepper.previous();
    };
    IgDocumentCreateComponent.prototype.goForward = function (stepper) {
        stepper.next();
    };
    IgDocumentCreateComponent.prototype.getMessages = function (hl7Version) {
        var _this = this;
        this.tableValue = [];
        this.createService.getMessagesByVersion(hl7Version).then(function (res) { return _this.tableValue = res; });
    };
    IgDocumentCreateComponent.prototype.load = function () {
        console.log(this.selectedNodes);
        this.selectedNodes = [];
        this.getMessages(this.selcetedVersion);
    };
    IgDocumentCreateComponent.prototype.nodeSelect = function (event) {
        console.log(event);
    };
    ;
    IgDocumentCreateComponent.prototype.toggle = function (node) {
        if (node.data.checked) {
            this.addNode(node);
        }
        else {
            this.removeNode(node);
        }
    };
    ;
    IgDocumentCreateComponent.prototype.addNode = function (node) {
        console.log("Add Node");
        console.log(node);
    };
    ;
    IgDocumentCreateComponent.prototype.removeNode = function (node) {
        console.log("Remove");
        console.log(node);
    };
    ;
    IgDocumentCreateComponent.prototype.submitEvent = function () {
        var _this = this;
        for (var i = 0; i < this.selectedNodes.length; i++) {
            if (this.selectedNodes[i].data.parentStructId) {
                if (this.selectedNodes[i].parent.data.id) {
                    if (this.messageEventMap[this.selectedNodes[i].parent.data.id]) {
                        if (this.messageEventMap[this.selectedNodes[i].parent.data.id].children) {
                            this.messageEventMap[this.selectedNodes[i].parent.data.id].children.push({
                                name: this.selectedNodes[i].data.name,
                                parentStructId: this.selectedNodes[i].parent.data.structId
                            });
                        }
                        else {
                            this.messageEventMap[this.selectedNodes[i].parent.data.id].children = [];
                            this.messageEventMap[this.selectedNodes[i].parent.data.id].children.push({
                                name: this.selectedNodes[i].data.name,
                                parentStructId: this.selectedNodes[i].parent.data.structId
                            });
                        }
                    }
                    else {
                        this.messageEventMap[this.selectedNodes[i].parent.data.id] = {};
                        this.messageEventMap[this.selectedNodes[i].parent.data.id].children = [];
                        this.messageEventMap[this.selectedNodes[i].parent.data.id].children.push({
                            name: this.selectedNodes[i].data.name,
                            parentStructId: this.selectedNodes[i].parent.data.structId
                        });
                    }
                }
            }
        }
        this.msgEvts = Object.keys(this.messageEventMap).map(function (key) { return { id: key, children: _this.messageEventMap[key].children }; });
    };
    IgDocumentCreateComponent.prototype.create = function () {
        var _this = this;
        this.loading = true;
        this.submitEvent();
        var wrapper = {};
        wrapper.msgEvts = this.msgEvts;
        wrapper.metaData = this.metaData;
        wrapper.hl7Version = this.selcetedVersion;
        this.createService.createIntegrationProfile(wrapper).then(function (res) {
            _this.goTo(res.id);
        });
    };
    ;
    IgDocumentCreateComponent.prototype.goTo = function (id) {
        var _this = this;
        this.route.queryParams
            .subscribe(function (params) {
            var link = "/ig-documents/igdocuments-edit/" + id;
            _this.loading = false;
            _this.router.navigate([link], params); // add the parameters to the end
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('stepper'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2__angular_material__["c" /* MatStepper */])
    ], IgDocumentCreateComponent.prototype, "myStepper", void 0);
    IgDocumentCreateComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/igdocuments/igdocument-create/igdocument-create.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"], __WEBPACK_IMPORTED_MODULE_3__igdocument_create_service__["a" /* IgDocumentCreateService */], __WEBPACK_IMPORTED_MODULE_4__service_workspace_workspace_service__["b" /* WorkspaceService */],
            __WEBPACK_IMPORTED_MODULE_5__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_5__angular_router__["ActivatedRoute"]])
    ], IgDocumentCreateComponent);
    return IgDocumentCreateComponent;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-create/igdocument-create.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IgDocumentCreateModule", function() { return IgDocumentCreateModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__igdocument_create_routing_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-create/igdocument-create-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__igdocument_create_component__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-create/igdocument-create.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_material_stepper__ = __webpack_require__("../../../material/esm5/stepper.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_material__ = __webpack_require__("../../../material/esm5/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__igdocument_create_service__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-create/igdocument-create.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_material_radio__ = __webpack_require__("../../../material/esm5/radio.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_material_checkbox__ = __webpack_require__("../../../material/esm5/checkbox.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_material_progress_spinner__ = __webpack_require__("../../../material/esm5/progress-spinner.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};












var IgDocumentCreateModule = (function () {
    function IgDocumentCreateModule() {
    }
    IgDocumentCreateModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_7_primeng_primeng__["TreeTableModule"], __WEBPACK_IMPORTED_MODULE_7_primeng_primeng__["SharedModule"],
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_2__igdocument_create_routing_module__["a" /* IgDocumentCreateRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_material_stepper__["b" /* MatStepperModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["b" /* MatInputModule */],
                __WEBPACK_IMPORTED_MODULE_8__angular_material_radio__["a" /* MatRadioModule */],
                __WEBPACK_IMPORTED_MODULE_9__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_9__angular_forms__["ReactiveFormsModule"],
                __WEBPACK_IMPORTED_MODULE_10__angular_material_checkbox__["a" /* MatCheckboxModule */],
                __WEBPACK_IMPORTED_MODULE_11__angular_material_progress_spinner__["a" /* MatProgressSpinnerModule */]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__igdocument_create_component__["a" /* IgDocumentCreateComponent */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_6__igdocument_create_service__["a" /* IgDocumentCreateService */]]
        })
    ], IgDocumentCreateModule);
    return IgDocumentCreateModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument-create/igdocument-create.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentCreateService; });
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
 * Created by ena3 on 12/29/17.
 */


var IgDocumentCreateService = (function () {
    function IgDocumentCreateService(http) {
        this.http = http;
    }
    IgDocumentCreateService.prototype.getMessagesByVersion = function (hl7Version) {
        return this.http.post('api/igdocuments/messageListByVersion/', hl7Version)
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    IgDocumentCreateService.prototype.createIntegrationProfile = function (wrapper) {
        return this.http.post('api/igdocuments/createIntegrationProfile/', wrapper)
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    IgDocumentCreateService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], IgDocumentCreateService);
    return IgDocumentCreateService;
}());



/***/ })

});
//# sourceMappingURL=igdocument-create.module.chunk.js.map