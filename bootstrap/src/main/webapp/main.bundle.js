webpackJsonp(["main"],{

/***/ "../../../../../src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./configuration/configuration.module": [
		"../../../../../src/app/configuration/configuration.module.ts",
		"configuration.module"
	],
	"./datatype-library/datatype-library.module": [
		"../../../../../src/app/datatype-library/datatype-library.module.ts",
		"datatype-library.module"
	],
	"./delta/delta.module": [
		"../../../../../src/app/delta/delta.module.ts",
		"delta.module"
	],
	"./igdocument-create/igdocument-create.module": [
		"../../../../../src/app/igdocuments/igdocument-create/igdocument-create.module.ts",
		"common",
		"igdocument-create.module"
	],
	"./igdocument-edit/igdocument-edit.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/igdocument-edit.module.ts",
		"common",
		"igdocument-edit.module"
	],
	"./igdocument-list/igdocument-list.module": [
		"../../../../../src/app/igdocuments/igdocument-list/igdocument-list.module.ts",
		"common",
		"igdocument-list.module"
	],
	"./igdocuments/igdocument.module": [
		"../../../../../src/app/igdocuments/igdocument.module.ts",
		"igdocument.module"
	],
	"./search/search.module": [
		"../../../../../src/app/search/search.module.ts",
		"search.module"
	],
	"./segment-definition/segment-definition.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-definition/segment-definition.module.ts",
		"common",
		"segment-definition.module"
	],
	"./segment-edit/segment-edit.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-edit.module.ts",
		"common",
		"segment-edit.module"
	],
	"./segment-metadata/segment-metadata.module": [
		"../../../../../src/app/igdocuments/igdocument-edit/segment-edit/segment-metadata/segment-metadata.module.ts",
		"segment-metadata.module"
	],
	"./shared-elements/shared-elements.module": [
		"../../../../../src/app/shared-elements/shared-elements.module.ts",
		"shared-elements.module"
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "../../../../../src/$$_lazy_route_resource lazy recursive";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "../../../../../src/app/about/about.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"layout-content-full\">\n  <div>\n This is ABOUT page\n  </div>\n</div>"

/***/ }),

/***/ "../../../../../src/app/about/about.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutComponent; });
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

var AboutComponent = (function () {
    function AboutComponent() {
    }
    AboutComponent.prototype.ngOnInit = function () {
    };
    AboutComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/about/about.component.html")
        }),
        __metadata("design:paramtypes", [])
    ], AboutComponent);
    return AboutComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app-topbar.component.html":
/***/ (function(module, exports) {

module.exports = "<div style=\"background-color:  black\">\n\n      <span>\n        <div style=\"\n    margin-left: 10px;\n    font-size: 32px;\n    color: #F3C60D !important;\">\n\n          NIST IGAMT\n\n          <span style=\"color:white; font-size:medium\" class=\"ng-binding\">Implementation Guide Authoring and Management Tool</span><span class=\"badge ng-binding\" style=\"background-color: rgb(152, 45, 18);color:white; font-size:12px\"> 2.0.0-beta13</span>\n        </div>\n      </span>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "\n\n\n    <app-topbar></app-topbar>\n\n    <div>\n          <app-menu></app-menu>\n\n    </div>\n\n      <div class=\"container-fluid outlet\">\n      <router-outlet></router-outlet>\n      </div>\n    <!--<app-footer></app-footer>-->\n\n"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__appinfo_service__ = __webpack_require__("../../../../../src/app/appinfo.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MenuOrientation;
(function (MenuOrientation) {
    MenuOrientation[MenuOrientation["STATIC"] = 0] = "STATIC";
    MenuOrientation[MenuOrientation["OVERLAY"] = 1] = "OVERLAY";
    MenuOrientation[MenuOrientation["SLIM"] = 2] = "SLIM";
    MenuOrientation[MenuOrientation["HORIZONTAL"] = 3] = "HORIZONTAL";
})(MenuOrientation || (MenuOrientation = {}));
;
var AppComponent = (function () {
    function AppComponent(renderer, workSpace, http, appInfo) {
        var _this = this;
        this.renderer = renderer;
        this.workSpace = workSpace;
        this.http = http;
        this.appInfo = appInfo;
        this.appInfo.getInfo().then(function (info) {
            console.log(info);
            _this.workSpace.setAppInfo(info);
        });
    }
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__("../../../../../src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], __WEBPACK_IMPORTED_MODULE_1__service_workspace_workspace_service__["b" /* WorkspaceService */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* HttpModule */], __WEBPACK_IMPORTED_MODULE_3__appinfo_service__["a" /* AppInfoService */]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.footer.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#footer {\n  background: #333333;\n  /*background-color: white;*/\n  color: white;\n  position: absolute;\n  bottom : 0;\n  width: 100%;\n}\n\n.footer__inner {\n  padding-left:20px;\n  padding-top:20px;\n  padding-right:20px;\n  padding-bottom:10px;\n\n}\n\n#footer .footer__logo img {\n  width: 286px;\n}\n\nfield-items img\n{width:100%;}\n\nimg {\n  border: 0;\n  max-width: 100%;\n  height: auto;\n}\n\n#footer a {\n  color: white;\n}\n\n.clearfix:after {\n  content: \".\";\n  display: block;\n  height: 0;\n  clear: both;\n  visibility: hidden;\n}\n\n#footer .footer__contact {\n  font-size: 15px;\n  line-height: 17px;\n  border-bottom: 1px solid #595959;\n  padding-bottom : .6rem;\n}\n\n.custom-icon:hover {\n  color:#8ac34e;\n}\n\n.item-list li{\n  display:inline;\n  padding:0px 0px 0px 0px;\n  padding:0rem .2rem 0rem 0rem;\n  list-style-type:none;\n  background-image:none;\n  margin-bottom:24px;\n  margin-bottom:1.5rem;\n  margin-left:0;\n}\n\n.menu--footer-main-menu {\n  clear: both;\n  border-top: 1px solid #595959;\n  border-bottom: 1px solid #595959;\n  padding-bottom: 40px;\n  padding-bottom: 2.5rem;\n}\n\n.block {\n  margin-bottom: 1.0rem;\n}\n\n.menu--footer-main-menu ul.menu {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\ndl, menu, ol, ul {\n  margin: 0px 0px 20px 16px;\n  margin: 0rem 0rem 1.25rem 1rem;\n  padding: 0px 0px 0px 32px;\n  padding: 0rem 0rem 0rem 2rem;\n}\n\nul, menu, dir {\n  display: block;\n  list-style-type: disc;\n  -webkit-margin-before: 1em;\n  -webkit-margin-after: 1em;\n  -webkit-margin-start: 0px;\n  -webkit-margin-end: 0px;\n  -webkit-padding-start: 40px;\n}\n\n.menu--footer-main-menu ul.menu li {\n  padding: 0;\n  margin-bottom: 0;\n  vertical-align: top;\n  font-size: 16px;\n  font-size: 1rem;\n  line-height: 20px;\n  line-height: 1.25rem;\n}\n\n#footer .social-links {\n  float: right;\n}\n\n.social-btn--large {\n  height: 40px;\n}\n\n.social-btn {\n  margin-right: 2px;\n  margin-left: 0;\n  padding: 0;\n  height: 34px;\n  color: white;\n}\n\nul.list-horiz > li, li.list-horiz {\n  list-style: none;\n  display: inline-block;\n  margin: 0;\n}\n\n.social-btn:hover, .social-btn:visited, .social-btn:active {\n  color: white;\n}\n\na:visited {\n  color: #2d9de7;\n}\n\n.social-btn--large i:before {\n  font-size: 26px;\n  line-height: 40px;\n  height: 40px;\n  width: 40px;\n  text-align: center;\n  display: inline-block;\n}\n\n.social-btn .ext {\n  display: none;\n}\n\nspan.ext {\n  display: inline-block;\n  padding-right: 0;\n  text-indent: -99999px;\n  width: 12px;\n}\n\nspan.ext {\n  background: url(https://www2.nist.gov/sites/all/modules/contrib/extlink/extlink_s.png) 2px center no-repeat;\n  width: 10px;\n  height: 10px;\n  padding-right: 12px;\n  text-decoration: none;\n}\n\n.element-invisible, .element-focusable, #navigation .block-menu .block__title, #navigation .block-menu-block .block__title {\n  position: absolute !important;\n  height: 1px;\n  width: 1px;\n  overflow: hidden;\n  clip: rect(1px, 1px, 1px, 1px);\n}\n\n.menu--footer-menu {\n  clear: both;\n  margin-bottom: 0.6rem;\n}\n\n\n.menu--footer-menu ul.menu {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  text-align: center;\n}\n\n\nul, menu, dir {\n  display: block;\n  -webkit-margin-before: 1em;\n  -webkit-margin-after: 1em;\n  -webkit-margin-start: 0px;\n  -webkit-margin-end: 0px;\n  -webkit-padding-start: 40px;\n}\n\n.menu--footer-menu ul.menu li {\n  display: inline-block;\n  font-size: 0.9rem;\n  padding: 0;\n  margin-bottom: 0;\n  margin-left: 0;\n}\n\n.menu--footer-menu ul.menu {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.menu--footer-menu ul.menu li.first:before {\n  content: none;\n}\n.menu--footer-menu ul.menu li:before {\n  content: '|';\n  margin-left: 1.6px;\n  margin-left: 0.1rem;\n  display: inherit;\n  position: static;\n  font: inherit;\n  line-height: inherit;\n  color: inherit;\n}\n\n#footer a {\n  color:  white;\n}\n.menu--footer-menu ul.menu li.first a {\n  margin-left: 0;\n}\n.menu--footer-menu ul.menu li a {\n  font-weight: normal;\n  white-space: nowrap;\n}\n.menu a {\n  text-decoration: none;\n}\n\n.menu--footer-menu ul.menu li {\n  display: inline-block;\n  padding: 0;\n  margin-bottom: 0;\n  margin-left: 0;\n}\n\n.social-btn {\n  margin-right:2px;\n  margin-left:0;\n  padding:0;\n  height:40px;\n  color:gray;\n}\n.social-btn:hover,.social-btn:visited,.social-btn:active{\n  color:gray;\n}\n.social-btn i:before{\n  font-size:22px;\n  line-height:40px;\n  height:40px;\n  width:40px;\n  text-align:center;\n  display:inline-block;\n}\n\n.social-btn i{\n  transition:background-color 300ms ease;\n}\n.social-btn i:hover{\n  color:#fff;\n  background:gray;\n  height: 40px;\n  line-height: 40px;\n  text-align:center;\n  display:inline-block;\n}\n.social-btn i.faa-facebook:hover{\n  background:#3a5897;\n}\n.social-btn i.faa-google-plus:hover{\n  background:#d2412f;\n}\n.social-btn i.faa-twitter:hover{\n  background:#49c9f2;\n}\n.social-btn i.faa-youtube:hover{\n  background:#e52d27;\n}\n\n.social-btn {\n  margin-right: 2px;\n  margin-left: 0;\n  padding: 0;\n  height: 34px;\n  color: white;\n}\n\n.fa, .social-share a {\n  display: inline-block;\n  font: normal normal normal 14px/1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.menu--footer-menu.first {\n  padding-top: 1.0rem;\n}\n\nul, menu, dir {\n  display: block;\n  -webkit-margin-before: 1em;\n  -webkit-margin-after: 1em;\n  -webkit-margin-start: 0px;\n  -webkit-margin-end: 0px;\n  -webkit-padding-start: 40px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.footer.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppFooterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppFooterComponent = (function () {
    function AppFooterComponent() {
    }
    AppFooterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-footer',
            styles: [__webpack_require__("../../../../../src/app/app.footer.component.css")],
            template: "\n      <div id=\"footer\" class=\"region region-footer \">\n        <div class=\"footer__inner\">\n\n          <div class=\"social-links\">\n            <div class=\"item-list\">\n              <ul>\n                <li ><a href=\"https://twitter.com/USNISTGOV\" target=\"_blank\" class=\"social-btn social-btn--large extlink ext\"><i class=\"faa faa-twitter\"><span class=\"element-invisible\">twitter</span></i><span class=\"ext\"><span class=\"element-invisible\"> (link is external)</span></span></a></li>\n                <li class=\"field-item service-facebook list-horiz\"><a href=\"https://www.facebook.com/USNISTGOV\" target=\"_blank\" class=\"social-btn social-btn--large extlink ext\"><i class=\"faa faa-facebook\"><span class=\"element-invisible\">facebook</span></i><span class=\"ext\"><span class=\"element-invisible\"> (link is external)</span></span></a></li>\n                <li class=\"field-item service-googleplus list-horiz\"><a href=\"https://plus.google.com/+USNISTGOV\" target=\"_blank\" class=\"social-btn social-btn--large extlink ext\"><i class=\"faa faa-google-plus\"><span class=\"element-invisible\">google plus</span></i><span class=\"ext\"><span class=\"element-invisible\"> (link is external)</span></span></a></li>\n                <li class=\"field-item service-youtube list-horiz\"><a href=\"https://www.youtube.com/user/USNISTGOV\" target=\"_blank\" class=\"social-btn social-btn--large extlink ext\"><i class=\"faa faa-youtube\"><span class=\"element-invisible\">youtube</span></i><span class=\"ext\"><span class=\"element-invisible\"> (link is external)</span></span></a></li>\n                <li class=\"field-item service-rss list-horiz\"><a href=\"https://www2.nist.gov/news-events/nist-rss-feeds\" target=\"_blank\" class=\"social-btn social-btn--large extlink\"><i class=\"faa faa-rss\"><span class=\"element-invisible\">rss</span></i></a></li>\n                <li class=\"field-item service-govdelivery list-horiz last\"><a href=\"https://service.govdelivery.com/accounts/USNIST/subscriber/new\" target=\"_blank\" class=\"social-btn social-btn--large extlink ext\"><i class=\"faa faa-envelope\"><span class=\"element-invisible\">govdelivery</span></i><span class=\"ext\"><span class=\"element-invisible\"> (link is external)</span></span></a></li>\n              </ul>\n            </div>\n          </div>\n\n          <div class=\"footer__logo\">\n            <a href=\"\" title=\"National Institute of Standards and Technology\" class=\"footer__logo-link\" rel=\"home\">\n              <img srcset=\"./assets/images/logo_rev.png\" alt=\"National Institute of Standards and Technology\" title=\"National Institute of Standards and Technology\">\n            </a>\n          </div>\n\n          <div class=\"footer__contact\">\n            <p>\n              <strong>HEADQUARTERS</strong><br>\n              100 Bureau Drive<br>\n              Gaithersburg, MD 20899\n            </p>\n            <p>\n              <a href=\"https://www.nist.gov/about-nist/contact-us\" target=\"_blank\"><u>Contact Us</u></a> | <a href=\"https://www.nist.gov/about-nist/our-organization\" target=\"_blank\"><u>Our Other Offices</u></a>\n            </p>\n          </div>\n\n          <div id=\"block-menu-menu-footer-menu\" class=\"block menu--footer-menu first even block--menu block--menu-menu-footer-menu\" role=\"navigation\">\n            <ul class=\"menu\"><li class=\"menu__item is-leaf first leaf menu-depth-1\"><a href=\"https://www.nist.gov/privacy-policy\" target=\"_blank\" class=\"menu__link\">Privacy Statement</a></li>\n              <li class=\"menu__item is-leaf leaf menu-depth-1\"><a href=\"https://www.nist.gov/privacy-policy#privpolicy\" target=\"_blank\" class=\"menu__link\"> Privacy Policy</a></li>\n              <li class=\"menu__item is-leaf leaf menu-depth-1\"><a href=\"https://www.nist.gov/privacy-policy#secnot\" target=\"_blank\" class=\"menu__link\"> Security Notice</a></li>\n              <li class=\"menu__item is-leaf leaf menu-depth-1\"><a href=\"https://www.nist.gov/privacy-policy#accesstate\" target=\"_blank\" class=\"menu__link\"> Accessibility Statement</a></li>\n              <li class=\"menu__item is-leaf leaf menu-depth-1\"><a href=\"https://www.nist.gov/privacy\" target=\"_blank\" class=\"menu__link\"> NIST Privacy Program</a></li>\n              <li class=\"menu__item is-leaf last leaf menu-depth-1\"><a href=\"https://www.nist.gov/no-fear-act-policy\" target = \"_blank\" class=\"menu__link\"> No Fear Act Policy</a></li>\n            </ul>\n          </div>\n          <div id=\"block-menu-menu-footer-menu-2\" class=\"block menu--footer-menu odd block--menu block--menu-menu-footer-menu-2\" role=\"navigation\">\n            <ul class=\"menu\"><li class=\"menu__item is-leaf first leaf menu-depth-1\"><a href=\"https://www.nist.gov/disclaimer\" target=\"_blank\" class=\"menu__link\"> Disclaimer</a></li>\n              <li class=\"menu__item is-leaf leaf menu-depth-1\"><a href=\"https://www.nist.gov/office-director/freedom-information-act\" target=\"_blank\" class=\"menu__link\"> FOIA</a></li>\n              <li class=\"menu__item is-leaf leaf menu-depth-1\"><a href=\"https://www.nist.gov/environmental-policy-statement\" target=\"_blank\" class=\"menu__link\"> Environmental Policy Statement</a></li>\n              <li class=\"menu__item is-leaf leaf menu-depth-1\"><a href=\"https://www.nist.gov/privacy-policy#cookie\" target=\"_blank\" class=\"menu__link\"> Cookie Disclaimer</a></li>\n              <li class=\"menu__item is-leaf leaf menu-depth-1\"><a href=\"https://www.nist.gov/summary-report-scientific-integrity\" target=\"_blank\" class=\"menu__link\"> Scientific Integrity Summary</a></li>\n              <li class=\"menu__item is-leaf last leaf menu-depth-1\"><a href=\"https://www.nist.gov/nist-information-quality-standards\" target=\"_blank\" class=\"menu__link\"> NIST Information Quality Standards</a></li>\n            </ul>\n          </div>\n          <div id=\"block-menu-menu-footer-menu-3\" class=\"block menu--footer-menu last even block--menu block--menu-menu-footer-menu-3\" role=\"navigation\">\n            <ul class=\"menu\"><li class=\"menu__item is-leaf first leaf menu-depth-1\"><a href=\"http://business.usa.gov/\" class=\"menu__link ext extlink\" target=\"_blank\">Business USA<span class=\"ext\"><span class=\"element-invisible\"> (link is external)</span></span></a></li>\n              <li class=\"menu__item is-leaf leaf menu-depth-1\"><a href=\"https://www.healthcare.gov/\" class=\"menu__link ext extlink\" target=\"_blank\"> Healthcare.gov<span class=\"ext\"><span class=\"element-invisible\"> (link is external)</span></span></a></li>\n              <li class=\"menu__item is-leaf leaf menu-depth-1\"><a href=\"http://www.science.gov/\" class=\"menu__link ext extlink\" target=\"_blank\"> Science.gov<span class=\"ext\"><span class=\"element-invisible\"> (link is external)</span></span></a></li>\n              <li class=\"menu__item is-leaf last leaf menu-depth-1\"><a href=\"http://www.usa.gov/\" class=\"menu__link ext extlink\" target=\"_blank\"> USA.gov<span class=\"ext\"><span class=\"element-invisible\"> (link is external)</span></span></a></li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    "
        })
    ], AppFooterComponent);
    return AppFooterComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.menu.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppMenuComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppMenuComponent = (function () {
    function AppMenuComponent(app) {
        this.app = app;
    }
    AppMenuComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], AppMenuComponent.prototype, "reset", void 0);
    AppMenuComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-menu',
            template: __webpack_require__("../../../../../src/app/app.menu.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__app_component__["a" /* AppComponent */]])
    ], AppMenuComponent);
    return AppMenuComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.menu.html":
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-expand nav-back\">\n  <div class=\"collapse navbar-collapse\">\n    <ul class=\"navbar-nav mr-auto\">\n      <li class=\"nav-item \">\n        <a class=\"nav-link\">\n         Home\n        </a>\n\n      </li>\n      <li class=\"nav-item dropdown\">\n        <a class=\"nav-link dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n         IG Documents\n        </a>\n        <div class=\"dropdown-menu\">\n          <a class=\"dropdown-item\">Create new Document</a>\n          <a class=\"dropdown-item\">My Documents</a>\n          <a class=\"dropdown-item\">Pre-loaded Documents</a>\n          <a class=\"dropdown-item\">Shared with Me</a>\n          <a class=\"dropdown-item\">All Documents</a>\n        </div>\n      </li>\n      <li class=\"nav-item dropdown\">\n        <a class=\"nav-link dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n          Data Type Libraries\n        </a>\n        <div class=\"dropdown-menu\">\n          <a class=\"dropdown-item\">Create new User Library</a>\n          <a class=\"dropdown-item\">Data Types Evolution Matrix</a>\n\n          <a class=\"dropdown-item\">My Libraries</a>\n          <a class=\"dropdown-item\">Master Libraries</a>\n          <a class=\"dropdown-item\">Shared with Me</a>\n        </div>\n      </li>\n      <li class=\"nav-item \">\n        <a class=\"nav-link\">\n          Comparator\n        </a>\n\n      </li>\n      <li class=\"nav-item \">\n        <a class=\"nav-link\">\n          Documentation\n        </a>\n\n      </li>\n      <li class=\"nav-item \">\n        <a class=\"nav-link\">\n          Search\n        </a>\n\n      </li>\n      <li class=\"nav-item \">\n        <a class=\"nav-link\">\n         About\n        </a>\n\n      </li>\n    </ul>\n\n\n    <ul class=\"nav navbar-nav navbar-right\">\n        <li routerLink=\"register\"><a class=\"nav-link\"><span class=\"glyphicon glyphicon-user\"></span> <i class=\"fa fa-user\"></i>\n          Sign Up</a></li>\n        <li routerLink=\"login\"><a class=\"nav-link\"><i class=\"fa fa-sign-in\"></i>Login</a></li>\n      </ul>\n\n  </div>\n</nav>\n\n\n\n\n"

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_animations__ = __webpack_require__("../../../platform-browser/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__home_home_component__ = __webpack_require__("../../../../../src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__about_about_component__ = __webpack_require__("../../../../../src/app/about/about.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__documentation_documentation_component__ = __webpack_require__("../../../../../src/app/documentation/documentation.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__service_workspace_workspace_service__ = __webpack_require__("../../../../../src/app/service/workspace/workspace.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_ngx_bootstrap__ = __webpack_require__("../../../../ngx-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__common_404_404_component__ = __webpack_require__("../../../../../src/app/common/404/404.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__appinfo_service__ = __webpack_require__("../../../../../src/app/appinfo.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__service_datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__service_valueSets_valueSets_service__ = __webpack_require__("../../../../../src/app/service/valueSets/valueSets.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__app_routes__ = __webpack_require__("../../../../../src/app/app.routes.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__app_menu_component__ = __webpack_require__("../../../../../src/app/app.menu.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__app_topbar_component__ = __webpack_require__("../../../../../src/app/app.topbar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__app_footer_component__ = __webpack_require__("../../../../../src/app/app.footer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__service_general_configuration_general_configuration_service__ = __webpack_require__("../../../../../src/app/service/general-configuration/general-configuration.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__service_segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__service_profilecomponents_profilecomponents_service__ = __webpack_require__("../../../../../src/app/service/profilecomponents/profilecomponents.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__login_login_component__ = __webpack_require__("../../../../../src/app/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__login_auth_service__ = __webpack_require__("../../../../../src/app/login/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__login_auth_guard_service__ = __webpack_require__("../../../../../src/app/login/auth-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__requestInterceptor__ = __webpack_require__("../../../../../src/app/requestInterceptor.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__register_register_component__ = __webpack_require__("../../../../../src/app/register/register.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__service_userService_user_service__ = __webpack_require__("../../../../../src/app/service/userService/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__angular_flex_layout__ = __webpack_require__("../../../flex-layout/esm5/flex-layout.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


































var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_7__home_home_component__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_8__about_about_component__["a" /* AboutComponent */],
                __WEBPACK_IMPORTED_MODULE_9__documentation_documentation_component__["a" /* DocumentationComponent */],
                __WEBPACK_IMPORTED_MODULE_19__app_menu_component__["a" /* AppMenuComponent */],
                __WEBPACK_IMPORTED_MODULE_20__app_topbar_component__["a" /* AppTopBarComponent */],
                __WEBPACK_IMPORTED_MODULE_21__app_footer_component__["a" /* AppFooterComponent */],
                __WEBPACK_IMPORTED_MODULE_12__common_404_404_component__["a" /* NotFoundComponent */],
                __WEBPACK_IMPORTED_MODULE_25__login_login_component__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_30__register_register_component__["a" /* RegisterComponent */]
            ],
            exports: [],
            imports: [
                __WEBPACK_IMPORTED_MODULE_5__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_11_ngx_bootstrap__["a" /* AlertModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["BrowserModule"],
                __WEBPACK_IMPORTED_MODULE_32__angular_flex_layout__["a" /* FlexLayoutModule */],
                __WEBPACK_IMPORTED_MODULE_17_primeng_primeng__["PanelModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["ReactiveFormsModule"],
                __WEBPACK_IMPORTED_MODULE_18__app_routes__["a" /* AppRoutes */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_28__angular_common_http__["c" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_17_primeng_primeng__["MenubarModule"]
            ],
            providers: [
                { provide: __WEBPACK_IMPORTED_MODULE_5__angular_common__["LocationStrategy"], useClass: __WEBPACK_IMPORTED_MODULE_5__angular_common__["HashLocationStrategy"] },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_28__angular_common_http__["a" /* HTTP_INTERCEPTORS */],
                    useClass: __WEBPACK_IMPORTED_MODULE_29__requestInterceptor__["a" /* TokenInterceptor */],
                    multi: true
                },
                __WEBPACK_IMPORTED_MODULE_13__appinfo_service__["a" /* AppInfoService */],
                __WEBPACK_IMPORTED_MODULE_10__service_workspace_workspace_service__["b" /* WorkspaceService */],
                __WEBPACK_IMPORTED_MODULE_22__service_general_configuration_general_configuration_service__["a" /* GeneralConfigurationService */],
                __WEBPACK_IMPORTED_MODULE_14__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */],
                __WEBPACK_IMPORTED_MODULE_15__service_datatypes_datatypes_service__["a" /* DatatypesService */],
                __WEBPACK_IMPORTED_MODULE_16__service_valueSets_valueSets_service__["a" /* ValueSetsService */],
                __WEBPACK_IMPORTED_MODULE_23__service_segments_segments_service__["a" /* SegmentsService */],
                __WEBPACK_IMPORTED_MODULE_24__service_profilecomponents_profilecomponents_service__["a" /* ProfileComponentsService */],
                __WEBPACK_IMPORTED_MODULE_26__login_auth_service__["a" /* AuthService */],
                __WEBPACK_IMPORTED_MODULE_27__login_auth_guard_service__["a" /* AuthGuard */],
                __WEBPACK_IMPORTED_MODULE_31__service_userService_user_service__["a" /* UserService */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "../../../../../src/app/app.routes.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export routes */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutes; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_home_component__ = __webpack_require__("../../../../../src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__about_about_component__ = __webpack_require__("../../../../../src/app/about/about.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__documentation_documentation_component__ = __webpack_require__("../../../../../src/app/documentation/documentation.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_404_404_component__ = __webpack_require__("../../../../../src/app/common/404/404.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login_component__ = __webpack_require__("../../../../../src/app/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__register_register_component__ = __webpack_require__("../../../../../src/app/register/register.component.ts");







var routes = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_1__home_home_component__["a" /* HomeComponent */] },
    { path: 'ig-documents', loadChildren: './igdocuments/igdocument.module#IgDocumentModule' },
    { path: 'datatype-libraries', loadChildren: './datatype-library/datatype-library.module#DatatypeLibraryModule' },
    { path: 'shared-data', loadChildren: './shared-elements/shared-elements.module#SharedElementsModule' },
    { path: 'comparator', loadChildren: './delta/delta.module#DeltaModule' },
    { path: 'configuration', loadChildren: './configuration/configuration.module#ConfigurationModule' },
    { path: 'search', loadChildren: './search/search.module#SearchModule' },
    { path: 'about', component: __WEBPACK_IMPORTED_MODULE_2__about_about_component__["a" /* AboutComponent */] },
    { path: 'documentation', component: __WEBPACK_IMPORTED_MODULE_3__documentation_documentation_component__["a" /* DocumentationComponent */] },
    { path: '', component: __WEBPACK_IMPORTED_MODULE_3__documentation_documentation_component__["a" /* DocumentationComponent */] },
    { path: 'login', component: __WEBPACK_IMPORTED_MODULE_5__login_login_component__["a" /* LoginComponent */] },
    { path: 'register', component: __WEBPACK_IMPORTED_MODULE_6__register_register_component__["a" /* RegisterComponent */] },
    { path: '**', component: __WEBPACK_IMPORTED_MODULE_4__common_404_404_component__["a" /* NotFoundComponent */] }
];
var AppRoutes = __WEBPACK_IMPORTED_MODULE_0__angular_router__["RouterModule"].forRoot(routes);


/***/ }),

/***/ "../../../../../src/app/app.topbar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppTopBarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppTopBarComponent = (function () {
    function AppTopBarComponent(app) {
        this.app = app;
    }
    AppTopBarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-topbar',
            template: __webpack_require__("../../../../../src/app/app-topbar.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__app_component__["a" /* AppComponent */]])
    ], AppTopBarComponent);
    return AppTopBarComponent;
}());



/***/ }),

/***/ "../../../../../src/app/appinfo.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppInfoService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppInfoService = (function () {
    function AppInfoService(http) {
        this.http = http;
        this.appInfoUrl = 'api/appInfo';
    }
    AppInfoService.prototype.getInfo = function () {
        return this.http.get(this.appInfoUrl)
            .toPromise()
            .then(function (res) { return res.json(); });
    };
    AppInfoService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], AppInfoService);
    return AppInfoService;
}());



/***/ }),

/***/ "../../../../../src/app/common/404/404.component.html":
/***/ (function(module, exports) {

module.exports = "<strong>404</strong> PAGE NOT FOUND\n"

/***/ }),

/***/ "../../../../../src/app/common/404/404.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotFoundComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * Created by hnt5 on 10/25/17.
 */
var NotFoundComponent = (function () {
    function NotFoundComponent() {
    }
    NotFoundComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/common/404/404.component.html")
        })
    ], NotFoundComponent);
    return NotFoundComponent;
}());



/***/ }),

/***/ "../../../../../src/app/documentation/documentation.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"layout-content-full\">\n  <!--<div>-->\n <!--This is Documentation page-->\n  <!--</div>-->\n  <!--<div>-->\n    <!--<button (click)=\"getDatatype('579654555455fa34e848dcf7')\">Load datatype</button>-->\n    <!--label: <input type=text [value]=\"this.datatype.label\" (input)=\"this.datatype.label = $event.target.value\" (change)=\"saveDatatype(this.datatype)\"/>-->\n    <!--<br/>-->\n    <!--Datatype metadata:-->\n    <!--<pre>-->\n      <!--{{this.datatypeMetadata | json}}-->\n    <!--</pre>-->\n    <!--Full datatype:-->\n    <!--<pre>-->\n      <!--{{this.datatype | json}}-->\n    <!--</pre>-->\n  <!--</div>-->\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/documentation/documentation.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DocumentationComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_indexed_db_indexed_db_service__ = __webpack_require__("../../../../../src/app/service/indexed-db/indexed-db.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DocumentationComponent = (function () {
    function DocumentationComponent(indexedDbService) {
        this.indexedDbService = indexedDbService;
    }
    DocumentationComponent.prototype.ngOnInit = function () {
    };
    DocumentationComponent.prototype.getDatatype = function (datatypeId) {
        this.indexedDbService.getDatatype(datatypeId, function (datatype) {
            // console.log('datatype 579654555455fa34e848dcf7: ' + datatype.label);
            this.datatype = datatype;
        }.bind(this));
        this.indexedDbService.getDatatypeMetadata(datatypeId, function (datatypeMetadata) {
            // console.log('datatype 579654555455fa34e848dcf7: ' + datatype.label);
            this.datatypeMetadata = datatypeMetadata;
        }.bind(this));
    };
    DocumentationComponent.prototype.saveDatatype = function (datatype) {
        this.indexedDbService.saveDatatype(datatype);
    };
    DocumentationComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/documentation/documentation.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__service_indexed_db_indexed_db_service__["a" /* IndexedDbService */]])
    ], DocumentationComponent);
    return DocumentationComponent;
}());



/***/ }),

/***/ "../../../../../src/app/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "\n      <h1> Welcome to the Implementation Guide Authoring and\n        Management Tool (IGAMT)</h1>\n\n      <div class=\"ui-g-12\">\n        <div class=\"card\">\n          <h3>\n            Note to Testers\n          </h3>\n          <p style=\"text-align:justify\">IGAMT is a tool used to create HL7 v2.x implementation guides that contain one or more conformance profiles. The tool provides capabilities to create both narrative text (akin to a word processing program) and messaging requirements in a structured environment. IGAMT contains a model of all the message events for every version of the HL7 v2 standard. Users begin by selecting the version of the HL7 v2 standard and the message events they want to include and refine (constrain) in their implementation guide.\n          </p>\n          <p style=\"color:red; font-weight: bold;text-align:justify\">\n            IGAMT is a work-in-progress and is in a constant state of change. Many core features exist and IGAMT has been used to create complete Implementation Guides in pilot projects. However, be aware that new features may not be completely functionality and some existing features will change. Also, we are currently working on integration with the NIST validation tool. If you have issues, please contact us or join the IGAMT Google Group to post questions.\n          </p>\n        </div>\n      </div>\n      <div class=\"ui-g-6\">\n        <div class=\"card\">\n          <h3>\n            Have a Question?\n          </h3>\n          <p style=\"text-align: justify;\">A Google Group <a class=\"point\"\n                                                            ng-href=\"https://groups.google.com/forum/#!forum/nist-igamt\"\n                                                            target=\"_blank\">NIST-IGAMT</a>\n            has been established for discussion/questions about the tool. No\n            membership is required. A Google account is required for posting.\n          </p>\n          <ul>\n            <li>Site: <a class=\"point\" target=\"_blank\"\n                         ng-href=\"https://groups.google.com/forum/#!forum/nist-igamt\">https://groups.google.com/forum/#!forum/nist-igamt</a>\n            </li>\n            <li>Email: nist-igamt@googlegroups.com</li>\n          </ul>\n        </div>\n      </div>\n      <div class=\"ui-g-6\">\n        <div class=\"card\">\n          <h3>\n            Supported Browsers\n          </h3>\n          <p style=\"text-align: justify\">The following browsers are currently supported:</p>\n          <ul>\n            <li>Chrome <span style=\"color:red\">(Recommended)</span></li>\n            <li>Firefox <span style=\"color:red\"></span></li>\n            <li>Safari</li>\n          </ul>\n        </div>\n      </div>\n\n\n\n"

/***/ }),

/***/ "../../../../../src/app/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var HomeComponent = (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    HomeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("../../../../../src/app/home/home.component.html")
        })
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "../../../../../src/app/login/auth-guard.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__("../../../../../src/app/login/auth.service.ts");
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
 * Created by ena3 on 12/20/17.
 */



var AuthGuard = (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.checkLogin = function (url) {
        if (this.authService.isLoggedIn.getValue()) {
            return true;
        }
        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;
        // Navigate to the login page with extras
        this.router.navigate(['/login']);
        return false;
    };
    AuthGuard = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "../../../../../src/app/login/auth.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_of__ = __webpack_require__("../../../../rxjs/_esm5/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_do__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/do.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_delay__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/delay.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs__ = __webpack_require__("../../../../rxjs/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs__);
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
 * Created by ena3 on 12/20/17.
 */






var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        //isLoggedIn = false;
        this.isLoggedIn = new __WEBPACK_IMPORTED_MODULE_5_rxjs__["BehaviorSubject"](false);
    }
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        this.http.post('api/login', { username: username, password: password }, { observe: 'response' }).subscribe(function (data) {
            console.log(data);
            var token = data.headers.get('Authorization');
            console.log(token);
            localStorage.setItem('currentUser', token);
            _this.isLoggedIn.next(true);
            console.log(_this.redirectUrl);
        }, function (error) {
            _this.isLoggedIn.next(false);
        });
        return this.isLoggedIn;
    };
    AuthService.prototype.logout = function () {
        localStorage.removeItem('currentUser');
        this.isLoggedIn.next(false);
    };
    AuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__angular_common_http__["b" /* HttpClient */]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "../../../../../src/app/login/login.component.html":
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\"  fxLayoutAlign=\"center\">\n\n<div fxFlex=\"50\" class=\"card container-fluid\" >\n  <h4 class=\"card-title\"> Sign in </h4>\n      <form name=\"form\" #f=\"ngForm\" novalidate>\n        <div class=\"form-group\" [ngClass]=\"{ 'has-error': f.submitted && !username.valid }\">\n          <input type=\"text\" class=\"form-control\" name=\"username\" [(ngModel)]=\"username\" required placeholder=\"username\" />\n          <div *ngIf=\"f.submitted && !username.valid\" class=\"help-block\">Username is required</div>\n        </div>\n        <div class=\"form-group\" [ngClass]=\"{ 'has-error': f.submitted && !password.valid }\">\n          <input type=\"password\" class=\"form-control\" name=\"password\" [(ngModel)]=\"password\" required placeholder=\"password\" />\n          <div *ngIf=\"f.submitted && !password.valid\" class=\"help-block\">Password is required</div>\n        </div>\n        <div class=\"form-group\">\n          <button [disabled]=\"loading\" class=\"btn btn-primary\" (click)=\"login()\">Login</button>\n          <a [routerLink]=\"['/register']\" class=\"btn btn-link\">Register</a>\n        </div>\n      </form>\n</div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/login/login.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__("../../../../../src/app/login/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LoginComponent = (function () {
    function LoginComponent(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.message = 'Trying to log in ...';
        this.authService.login(this.username, this.password).subscribe(function (x) {
            if (x == true) {
                console.log("test");
                console.log(_this.authService.redirectUrl);
                var redirect = _this.authService.redirectUrl;
                // Redirect the user
                _this.router.navigate([redirect]);
            }
            else {
                _this.router.navigate(["/"]);
            }
        });
    };
    LoginComponent.prototype.logout = function () {
        this.authService.logout(); //?
    };
    LoginComponent.prototype.register = function () {
        this.router.navigate(["/register"]);
    };
    LoginComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-login',
            template: __webpack_require__("../../../../../src/app/login/login.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "../../../../../src/app/register/register.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/register/register.component.html":
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\"  fxLayoutAlign=\"center\">\n  <div fxFlex=\"50\" class=\"card container-fluid\" >\n    <h4 class=\"card-title\"> Sign up </h4>\n  <form [formGroup]=\"registrationForm\"  #formDir=\"ngForm\">\n\n\n    <div class=\"form-group\">\n\n      <label for=\"fullname\">Full Name</label>\n      <input name=\"fullname\" id=\"fullname\" class=\"form-control\"\n             formControlName=\"fullname\" [(ngModel)]=\"model.fullname\" required  >\n\n      <div *ngIf=\"fullname.invalid && (fullname.dirty || fullname.touched)\"\n           class=\"alert alert-danger\">\n\n        <div *ngIf=\"fullname.errors.required\">\n          Name is required.\n        </div>\n\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n\n      <label for=\"username\">Username</label>\n      <input name=\"username\" id=\"username\" class=\"form-control\"\n             formControlName=\"username\" required [(ngModel)]=\"model.username\"  >\n\n      <div *ngIf=\"username.invalid && (username.dirty || username.touched)\"\n           class=\"alert alert-danger\">\n\n        <div *ngIf=\"username.errors.required\">\n         Username is required.\n        </div>\n\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n\n      <label for=\"email\">e-mail</label>\n      <input name=\"email\" id=\"email\" class=\"form-control\"\n             formControlName=\"email\" required [(ngModel)]=\"model.email\" >\n\n      <div *ngIf=\"email.invalid && (email.dirty || email.touched)\"\n           class=\"alert alert-danger\">\n\n        <div *ngIf=\"email.errors.required\">\n          email is required.\n        </div>\n        <div *ngIf=\"email.errors.email\">\n         Please enter a valid e-mail\n        </div>\n\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n\n      <label for=\"password\">password</label>\n      <input name=\"password\" id=\"password\" class=\"form-control\"\n             formControlName=\"password\" required [(ngModel)]=\"model.password\">\n\n      <div *ngIf=\"password.invalid && (password.dirty || password.touched)\"\n           class=\"alert alert-danger\">\n\n        <div *ngIf=\"password.errors.required\">\n          Password is required.\n        </div>\n\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n\n      <label for=\"confirmPasswordForm\">Confirm password</label>\n      <input name=\"confirmPasswordForm\" id=\"confirmPasswordForm\" [(ngModel)]=\"confirmPassword\" formControlName=\"confirmPasswordForm\"  required class=\"form-control\">\n\n\n      <div *ngIf=\"confirmPasswordForm.invalid && (confirmPasswordForm.dirty || confirmPasswordForm.touched)\"\n           class=\"alert alert-danger\">\n\n          Passwords do not match\n\n      </div>\n    </div>\n\n\n\n\n\n\n\n    <div class=\"form-group\">\n      <button [disabled]=\"loading|| !registrationForm.valid\" class=\"btn btn-primary\" (click)=\"register()\">Register</button>\n      <a [routerLink]=\"['/login']\" class=\"btn btn-link\">Cancel</a>\n    </div>\n  </form>\n\n\n\n\n\n\n</div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/register/register.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_userService_user_service__ = __webpack_require__("../../../../../src/app/service/userService/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var RegisterComponent = (function () {
    function RegisterComponent(router, userService) {
        this.router = router;
        this.userService = userService;
        this.model = {};
        this.loading = false;
        this.registrationForm = new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormGroup"]({
            'fullname': new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormControl"](this.model.fullname, [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required]),
            'email': new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormControl"](this.model.email, [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].email, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required]),
            'username': new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormControl"](this.model.username, [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].minLength(4)]),
            'password': new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormControl"](this.model.password, [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].minLength(8)]),
            'confirmPasswordForm': new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormControl"](this.confirmPassword, [this.passwordValidator(this.model.password)])
        });
    }
    Object.defineProperty(RegisterComponent.prototype, "fullname", {
        get: function () {
            return this.registrationForm.get('fullname');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterComponent.prototype, "email", {
        get: function () {
            return this.registrationForm.get('email');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterComponent.prototype, "confirmPasswordForm", {
        get: function () {
            return this.registrationForm.get('confirmPasswordForm');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterComponent.prototype, "username", {
        get: function () {
            return this.registrationForm.get('username');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterComponent.prototype, "password", {
        get: function () {
            return this.registrationForm.get('password');
        },
        enumerable: true,
        configurable: true
    });
    RegisterComponent.prototype.register = function () {
        var _this = this;
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(function (data) {
            console.log("success");
            _this.router.navigate(['/login']);
        }, function (error) {
            console.log("error");
            _this.loading = false;
        });
    };
    RegisterComponent.prototype.passwordValidator = function (obj) {
        var _this = this;
        return function (control) {
            return _this.confirmPassword !== _this.model.password ? { 'NotMAtch': { value: control.value } } : null;
        };
    };
    RegisterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-register',
            template: __webpack_require__("../../../../../src/app/register/register.component.html"),
            styles: [__webpack_require__("../../../../../src/app/register/register.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"],
            __WEBPACK_IMPORTED_MODULE_2__service_userService_user_service__["a" /* UserService */]])
    ], RegisterComponent);
    return RegisterComponent;
}());



/***/ }),

/***/ "../../../../../src/app/requestInterceptor.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TokenInterceptor; });
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
 * Created by ena3 on 3/1/18.
 */

var TokenInterceptor = (function () {
    function TokenInterceptor() {
    }
    TokenInterceptor.prototype.intercept = function (request, next) {
        console.log("here");
        // request = request.clone({
        //   setHeaders: {
        //     Authorization: "Bearer"+localStorage.getItem('currentUser')
        //   }
        // });
        return next.handle(request);
    };
    TokenInterceptor = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], TokenInterceptor);
    return TokenInterceptor;
}());



/***/ }),

/***/ "../../../../../src/app/service/datatypes/datatypes.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatatypesService; });
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


var DatatypesService = (function () {
    function DatatypesService(http) {
        this.http = http;
    }
    DatatypesService.prototype.getDatatypes = function (libId, callback) {
        this.http.get('api/datatype-library/' + libId + '/datatypes').map(function (res) { return res.json(); }).subscribe(function (data) {
            callback(data);
        });
    };
    DatatypesService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], DatatypesService);
    return DatatypesService;
}());



/***/ }),

/***/ "../../../../../src/app/service/general-configuration/general-configuration.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GeneralConfigurationService; });
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
 * Created by hnt5 on 11/2/17.
 */


var GeneralConfigurationService = (function () {
    function GeneralConfigurationService(http) {
        this.http = http;
        //TODO GETTING USAGES FROM API
        this._usages = [{ label: 'R', value: 'R' }, { label: 'RE', value: 'RE' }, { label: 'C', value: 'C' }, { label: 'X', value: 'O' }];
        this._valueSetAllowedDTs = ["ID", "IS", "CE", "CF", "CWE", "CNE", "CSU", "HD"];
        this._valueSetAllowedComponents =
            [
                {
                    "dtName": "CNS",
                    "location": 7
                },
                {
                    "dtName": "CSU",
                    "location": 11
                },
                {
                    "dtName": "XON",
                    "location": 10
                },
                {
                    "dtName": "CSU",
                    "location": 2
                },
                {
                    "dtName": "LA2",
                    "location": 12
                },
                {
                    "dtName": "OSD",
                    "location": 4
                },
                {
                    "dtName": "AD",
                    "location": 4
                },
                {
                    "dtName": "LA2",
                    "location": 11
                },
                {
                    "dtName": "XAD",
                    "location": 4
                },
                {
                    "dtName": "AD",
                    "location": 5
                },
                {
                    "dtName": "XAD",
                    "location": 3
                },
                {
                    "dtName": "XON",
                    "location": 3
                },
                {
                    "dtName": "AD",
                    "location": 3
                },
                {
                    "dtName": "CSU",
                    "location": 14
                },
                {
                    "dtName": "LA2",
                    "location": 13
                },
                {
                    "dtName": "OSD",
                    "location": 2
                },
                {
                    "dtName": "XAD",
                    "location": 5
                },
                {
                    "dtName": "CSU",
                    "location": 5
                }
            ];
    }
    Object.defineProperty(GeneralConfigurationService.prototype, "usages", {
        get: function () {
            return this._usages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeneralConfigurationService.prototype, "valueSetAllowedDTs", {
        get: function () {
            return this._valueSetAllowedDTs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeneralConfigurationService.prototype, "valueSetAllowedComponents", {
        get: function () {
            return this._valueSetAllowedComponents;
        },
        enumerable: true,
        configurable: true
    });
    GeneralConfigurationService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], GeneralConfigurationService);
    return GeneralConfigurationService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/indexed-db.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IndexedDbService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__objects_database__ = __webpack_require__("../../../../../src/app/service/indexed-db/objects-database.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__datatypes_datatypes_service__ = __webpack_require__("../../../../../src/app/service/datatypes/datatypes.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__valueSets_valueSets_service__ = __webpack_require__("../../../../../src/app/service/valueSets/valueSets.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__segments_segments_service__ = __webpack_require__("../../../../../src/app/service/segments/segments.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__profilecomponents_profilecomponents_service__ = __webpack_require__("../../../../../src/app/service/profilecomponents/profilecomponents.service.ts");
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






var IndexedDbService = (function () {
    function IndexedDbService(datatypesService, valueSetsService, segmentsService, profileComponentsService) {
        this.datatypesService = datatypesService;
        this.valueSetsService = valueSetsService;
        this.segmentsService = segmentsService;
        this.profileComponentsService = profileComponentsService;
        this.objectsDatabase = new __WEBPACK_IMPORTED_MODULE_1__objects_database__["a" /* ObjectsDatabase */]('ObjectsDatabase');
        this.changedObjectsDatabase = new __WEBPACK_IMPORTED_MODULE_1__objects_database__["a" /* ObjectsDatabase */]('ChangedObjectsDatabase');
    }
    IndexedDbService.prototype.init = function (ig) {
        var _this = this;
        this.objectsDatabase.transaction('rw', this.objectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.objectsDatabase.datatypes.clear().then(this.injectDatatypes(ig.profile.datatypeLibrary.id));
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.changedObjectsDatabase.datatypes.clear();
                return [2 /*return*/];
            });
        }); });
        // valueSets
        this.objectsDatabase.transaction('rw', this.objectsDatabase.valueSets, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.objectsDatabase.valueSets.clear().then(this.injectValueSets(ig.profile.tableLibrary.id));
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.valueSets, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.changedObjectsDatabase.valueSets.clear();
                return [2 /*return*/];
            });
        }); });
        // segments
        this.objectsDatabase.transaction('rw', this.objectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.objectsDatabase.segments.clear().then(this.injectSegments(ig.profile.segmentLibrary.id));
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.changedObjectsDatabase.segments.clear();
                return [2 /*return*/];
            });
        }); });
        // sections
        this.objectsDatabase.transaction('rw', this.objectsDatabase.sections, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.sections, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
        // profileComponents
        this.objectsDatabase.transaction('rw', this.objectsDatabase.profileComponents, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.objectsDatabase.profileComponents.clear().then(this.injectProfileComponents(ig.profile.profileComponentLibrary.id));
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.profileComponents, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
        // profiles
        this.objectsDatabase.transaction('rw', this.objectsDatabase.profiles, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.profiles, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
    };
    /*
    .filter(function (fullDatatype) {
          const metadataDatatype = {
            'label': fullDatatype.label,
            'hl7Version': fullDatatype.hl7Version
          }
          return metadataDatatype;
        });
     */
    IndexedDbService.prototype.getDatatype = function (id, callback) {
        var _this = this;
        var datatype;
        this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedObjectsDatabase.datatypes.get(id)];
                    case 1:
                        datatype = _a.sent();
                        if (datatype != null) {
                            callback(datatype.object);
                        }
                        else {
                            this.objectsDatabase.transaction('r', this.objectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.objectsDatabase.datatypes.get(id)];
                                        case 1:
                                            datatype = _a.sent();
                                            callback(datatype.object);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    IndexedDbService.prototype.getValueSet = function (id, callback) {
        var _this = this;
        var valueSet;
        this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valueSets, function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedObjectsDatabase.valueSets.get(id)];
                    case 1:
                        valueSet = _a.sent();
                        if (valueSet != null) {
                            callback(valueSet.object);
                        }
                        else {
                            this.objectsDatabase.transaction('r', this.objectsDatabase.valueSets, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.objectsDatabase.valueSets.get(id)];
                                        case 1:
                                            valueSet = _a.sent();
                                            callback(valueSet.object);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    IndexedDbService.prototype.getSegment = function (id, callback) {
        var _this = this;
        var segment;
        this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedObjectsDatabase.segments.get(id)];
                    case 1:
                        segment = _a.sent();
                        if (segment != null) {
                            callback(segment.object);
                        }
                        else {
                            this.objectsDatabase.transaction('r', this.objectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.objectsDatabase.segments.get(id)];
                                        case 1:
                                            segment = _a.sent();
                                            callback(segment.object);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    IndexedDbService.prototype.getDatatypeMetadata = function (id, callback) {
        this.getDatatype(id, function (datatype) {
            var metadataDatatype = {
                'id': datatype.id,
                'name': datatype.name,
                'ext': datatype.ext,
                'label': datatype.label,
                'scope': datatype.scope,
                'publicationVersion': datatype.publicationVersion,
                'hl7Version': datatype.hl7Version,
                'hl7Versions': datatype.hl7Versions,
                'numberOfComponents': datatype.components.length,
                'type': datatype.type
            };
            callback(metadataDatatype);
        });
    };
    IndexedDbService.prototype.getSegmentMetadata = function (id, callback) {
        this.getSegment(id, function (segment) {
            var metadataSegment = {
                'id': segment.id,
                'name': segment.name,
                'scope': segment.scope,
                'hl7Version': segment.hl7Version,
                'numberOfFields': segment.fields.length,
                'type': segment.type
            };
            callback(metadataSegment);
        });
    };
    IndexedDbService.prototype.getValueSetMetadata = function (id, callback) {
        this.getValueSet(id, function (valueSet) {
            var metadataValueSet = {
                'id': valueSet.id,
                'bindingIdentifier': valueSet.bindingIdentifier,
                'scope': valueSet.scope,
                'hl7Version': valueSet.hl7Version,
                'type': valueSet.type
            };
            callback(metadataValueSet);
        });
    };
    IndexedDbService.prototype.injectDatatypes = function (libId) {
        this.datatypesService.getDatatypes(libId, this.populateDatatypes.bind(this));
    };
    IndexedDbService.prototype.injectValueSets = function (libID) {
        this.valueSetsService.getValueSets(libID, this.populateValueSets.bind(this));
    };
    IndexedDbService.prototype.injectSegments = function (libId) {
        this.segmentsService.getSegments(libId, this.populateSegments.bind(this));
    };
    IndexedDbService.prototype.injectProfileComponents = function (libID) {
        this.profileComponentsService.getProfileComponents(libID, this.populateProfileComponents.bind(this));
    };
    IndexedDbService.prototype.populateDatatypes = function (datatypes) {
        var _this = this;
        datatypes.forEach(function (datatype) {
            _this.objectsDatabase.transaction('rw', _this.objectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.objectsDatabase.datatypes.put({
                                'id': datatype.id,
                                'object': datatype
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    ;
    IndexedDbService.prototype.populateValueSets = function (valueSets) {
        var _this = this;
        valueSets.forEach(function (valueSet) {
            _this.objectsDatabase.transaction('rw', _this.objectsDatabase.valueSets, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.objectsDatabase.valueSets.put({
                                'id': valueSet.id,
                                'object': valueSet
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    ;
    IndexedDbService.prototype.populateSegments = function (segments) {
        var _this = this;
        segments.forEach(function (segment) {
            _this.objectsDatabase.transaction('rw', _this.objectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.objectsDatabase.segments.put({
                                'id': segment.id,
                                'object': segment
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    ;
    IndexedDbService.prototype.populateProfileComponents = function (profileComponents) {
        var _this = this;
        profileComponents.forEach(function (pc) {
            _this.objectsDatabase.transaction('rw', _this.objectsDatabase.profileComponents, function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.objectsDatabase.profileComponents.put({
                                'id': pc.id,
                                'object': pc
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    ;
    IndexedDbService.prototype.saveDatatype = function (datatype) {
        var _this = this;
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedObjectsDatabase.datatypes.put({
                            'id': datatype.id,
                            'object': datatype
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    IndexedDbService.prototype.saveSegment = function (segment) {
        var _this = this;
        console.log(segment);
        this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changedObjectsDatabase.segments.put({
                            'id': segment.id,
                            'object': segment
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    IndexedDbService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__datatypes_datatypes_service__["a" /* DatatypesService */], __WEBPACK_IMPORTED_MODULE_3__valueSets_valueSets_service__["a" /* ValueSetsService */], __WEBPACK_IMPORTED_MODULE_4__segments_segments_service__["a" /* SegmentsService */], __WEBPACK_IMPORTED_MODULE_5__profilecomponents_profilecomponents_service__["a" /* ProfileComponentsService */]])
    ], IndexedDbService);
    return IndexedDbService;
}());



/***/ }),

/***/ "../../../../../src/app/service/indexed-db/objects-database.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ObjectsDatabase; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_dexie__ = __webpack_require__("../../../../dexie/dist/dexie.es.js");
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

/*
export interface IDatatype {
  id?: string;
  datatype?: object;
}
export interface IValueSet {
  id?: string;
  valueSet?: object;
}
export interface ISegment {
  id?: string;
  segment?: object;
}
export interface ISection {
  id?: string;
  section?: object;
}
export interface IProfileComponent {
  id?: string;
  profileComponent?: object;
}
export interface IProfile {
  id?: string;
  profile?: object;
}
*/
var ObjectsDatabase = (function (_super) {
    __extends(ObjectsDatabase, _super);
    function ObjectsDatabase(name) {
        var _this = _super.call(this, name) || this;
        _this.version(1).stores({
            datatypes: '++id,object',
            segments: '++id,object',
            sections: '++id,object',
            profileComponents: '++id,object',
            profiles: '++id,object',
            valueSets: '++id,object'
        });
        return _this;
    }
    return ObjectsDatabase;
}(__WEBPACK_IMPORTED_MODULE_0_dexie__["a" /* default */]));



/***/ }),

/***/ "../../../../../src/app/service/profilecomponents/profilecomponents.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponentsService; });
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


var ProfileComponentsService = (function () {
    function ProfileComponentsService(http) {
        this.http = http;
    }
    ProfileComponentsService.prototype.getProfileComponents = function (libId, callback) {
        this.http.get('api/profilecomponent-library/' + libId + '/profilecomponents').map(function (res) { return res.json(); }).subscribe(function (data) {
            callback(data);
        });
    };
    ProfileComponentsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], ProfileComponentsService);
    return ProfileComponentsService;
}());



/***/ }),

/***/ "../../../../../src/app/service/segments/segments.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SegmentsService; });
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


var SegmentsService = (function () {
    function SegmentsService(http) {
        this.http = http;
    }
    SegmentsService.prototype.getSegments = function (libId, callback) {
        this.http.get('api/segment-library/' + libId + '/segments').map(function (res) { return res.json(); }).subscribe(function (data) {
            callback(data);
        });
    };
    SegmentsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], SegmentsService);
    return SegmentsService;
}());



/***/ }),

/***/ "../../../../../src/app/service/userService/user.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
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
 * Created by ena3 on 3/5/18.
 */


var UserService = (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.getAll = function () {
        return this.http.get('/api/users');
    };
    UserService.prototype.getById = function (id) {
        return this.http.get('/api/users/' + id);
    };
    UserService.prototype.create = function (user) {
        return this.http.post('/register', user, { observe: 'response' });
    };
    UserService.prototype.update = function (user) {
        return this.http.put('/api/users/' + user.id, user);
    };
    UserService.prototype.delete = function (id) {
        return this.http.delete('/api/users/' + id);
    };
    UserService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "../../../../../src/app/service/valueSets/valueSets.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValueSetsService; });
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


var ValueSetsService = (function () {
    function ValueSetsService(http) {
        this.http = http;
    }
    ValueSetsService.prototype.getValueSets = function (libId, callback) {
        this.http.get('api/table-library/' + libId + '/tables').map(function (res) { return res.json(); }).subscribe(function (data) {
            callback(data);
        });
    };
    ValueSetsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], ValueSetsService);
    return ValueSetsService;
}());



/***/ }),

/***/ "../../../../../src/app/service/workspace/workspace.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Entity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return WorkspaceService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm5/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5__ = __webpack_require__("../../../../ts-md5/dist/md5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5__);
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
 * Created by hnt5 on 10/25/17.
 */

var Entity = (function () {
    function Entity() {
    }
    Entity.IG = "IG";
    Entity.SEGMENT = "SEGMENT";
    Entity.DATATYPE = "DATATYPE";
    Entity.CURRENTNODE = "CurrentNode";
    return Entity;
}());

var WorkspaceService = (function () {
    function WorkspaceService(http) {
        this.http = http;
        this.map = {};
    }
    WorkspaceService.prototype.getCurrent = function (key) {
        return this.map[key];
    };
    WorkspaceService.prototype.getAppInfo = function () {
        return this.appInfo;
    };
    WorkspaceService.prototype.setAppInfo = function (info) {
        this.appInfo = info;
    };
    WorkspaceService.prototype.setCurrent = function (key, obj) {
        var str = JSON.stringify(obj);
        this.currentHash = __WEBPACK_IMPORTED_MODULE_3_ts_md5_dist_md5__["Md5"].hashStr(str);
        if (this.map[key]) {
            this.map[key].next(obj);
        }
        else {
            var elm = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](obj);
            this.map[key] = elm;
        }
    };
    WorkspaceService.prototype.getPreviousHash = function () {
        console.log(this.currentHash);
        return this.currentHash;
    };
    WorkspaceService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
    ], WorkspaceService);
    return WorkspaceService;
}());



/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_hammerjs__ = __webpack_require__("../../../../hammerjs/hammer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_hammerjs__);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map