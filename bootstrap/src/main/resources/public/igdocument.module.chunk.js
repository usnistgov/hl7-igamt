webpackJsonp(["igdocument.module"],{

/***/ "../../../../../src/app/igdocuments/igdocument-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IgDocumentRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var IgDocumentRoutingModule = (function () {
    function IgDocumentRoutingModule() {
    }
    IgDocumentRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"].forChild([
                    { path: 'igdocuments-list', loadChildren: './igdocument-list/igdocument-list.module#IgDocumentListModule' },
                    // { path: 'igdocuments-edit', loadChildren: './igdocument-edit/igdocument-edit.module#IgDocumentEditModule' },
                    { path: 'create', loadChildren: './igdocument-create/igdocument-create.module#IgDocumentCreateModule' },
                    { path: '', redirectTo: 'igdocuments-list' }
                ])
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"]
            ]
        })
    ], IgDocumentRoutingModule);
    return IgDocumentRoutingModule;
}());



/***/ }),

/***/ "../../../../../src/app/igdocuments/igdocument.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IgDocumentModule", function() { return IgDocumentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__igdocument_routing_module__ = __webpack_require__("../../../../../src/app/igdocuments/igdocument-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_primeng_message__ = __webpack_require__("../../../../primeng/message.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_primeng_message___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_primeng_message__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_steps__ = __webpack_require__("../../../../primeng/steps.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_steps___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_primeng_steps__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_components_messages_messages__ = __webpack_require__("../../../../primeng/components/messages/messages.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_primeng_components_messages_messages___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_primeng_components_messages_messages__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_components_radiobutton_radiobutton__ = __webpack_require__("../../../../primeng/components/radiobutton/radiobutton.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_primeng_components_radiobutton_radiobutton___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_primeng_components_radiobutton_radiobutton__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










var IgDocumentModule = (function () {
    function IgDocumentModule() {
    }
    IgDocumentModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_4_primeng_primeng__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_4_primeng_primeng__["TabMenuModule"],
                __WEBPACK_IMPORTED_MODULE_6_primeng_steps__["StepsModule"],
                __WEBPACK_IMPORTED_MODULE_5_primeng_message__["MessageModule"],
                __WEBPACK_IMPORTED_MODULE_7_primeng_components_messages_messages__["MessagesModule"],
                __WEBPACK_IMPORTED_MODULE_8_primeng_components_radiobutton_radiobutton__["RadioButtonModule"],
                __WEBPACK_IMPORTED_MODULE_3__igdocument_routing_module__["a" /* IgDocumentRoutingModule */]
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["CUSTOM_ELEMENTS_SCHEMA"]],
            declarations: []
        })
    ], IgDocumentModule);
    return IgDocumentModule;
}());



/***/ }),

/***/ "../../../../primeng/steps.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Shorthand */

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../../../../primeng/components/steps/steps.js"));

/***/ })

});
//# sourceMappingURL=igdocument.module.chunk.js.map