webpackJsonp(["configuration.module"],{

/***/ "../../../../../src/app/configuration/configuration-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigurationRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__configuration_compronent__ = __webpack_require__("../../../../../src/app/configuration/configuration.compronent.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var ConfigurationRoutingModule = (function () {
    function ConfigurationRoutingModule() {
    }
    ConfigurationRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"].forChild([
                    { path: '', component: __WEBPACK_IMPORTED_MODULE_2__configuration_compronent__["a" /* ConfigurationComponent */] }
                ])
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"]
            ]
        })
    ], ConfigurationRoutingModule);
    return ConfigurationRoutingModule;
}());



/***/ }),

/***/ "../../../../../src/app/configuration/configuration.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"content-section introduction\">\n    <div>\n        <span class=\"feature-title\">Configuration</span>\n        <span>Configuration Module</span>\n    </div>\n</div>\n\n<div class=\"content-section implementation\">\n    <p-growl [value]=\"msgs\"></p-growl>\n\n    <h3 class=\"first\">Configuration page module</h3>\n\n  <h3>Fonts</h3>\n  <ul>\n    <li *ngFor=\"let font of fonts\">{{font.name}}</li>\n  </ul>\n</div>\n\n<app-froala-editor></app-froala-editor>\n"

/***/ }),

/***/ "../../../../../src/app/configuration/configuration.compronent.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigurationComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ConfigurationComponent = (function () {
    function ConfigurationComponent() {
    }
    ConfigurationComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/configuration/configuration.component.html")
        })
    ], ConfigurationComponent);
    return ConfigurationComponent;
}());



/***/ }),

/***/ "../../../../../src/app/configuration/configuration.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigurationModule", function() { return ConfigurationModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__configuration__ = __webpack_require__("../../../../../src/app/configuration/configuration.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__configuration_routing_module__ = __webpack_require__("../../../../../src/app/configuration/configuration-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_primeng_primeng__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var ConfigurationModule = (function () {
    function ConfigurationModule() {
    }
    ConfigurationModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_3__configuration_routing_module__["a" /* ConfigurationRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_4_primeng_primeng__["AccordionModule"],
                __WEBPACK_IMPORTED_MODULE_4_primeng_primeng__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_4_primeng_primeng__["TabViewModule"],
                __WEBPACK_IMPORTED_MODULE_4_primeng_primeng__["GrowlModule"]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__configuration__["a" /* Configuration */]
            ]
        })
    ], ConfigurationModule);
    return ConfigurationModule;
}());



/***/ }),

/***/ "../../../../../src/app/configuration/configuration.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Configuration; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/map.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var Configuration = (function () {
    function Configuration(http) {
        var _this = this;
        this.http = http;
        this.fonts = {};
        console.log('Config constructor');
        this.findFonts().subscribe(function (data) {
            _this.fonts = data;
        });
    }
    Configuration.prototype.findFonts = function () {
        return this.http.get('api/exportConfiguration/findFonts').map(function (res) { return res.json(); });
    };
    Configuration = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/configuration/configuration.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], Configuration);
    return Configuration;
}());



/***/ })

});
//# sourceMappingURL=configuration.module.chunk.js.map