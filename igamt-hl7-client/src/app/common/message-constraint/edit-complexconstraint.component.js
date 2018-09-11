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
var EditComplexConstraintComponent = (function () {
    function EditComplexConstraintComponent(configService) {
        this.configService = configService;
    }
    EditComplexConstraintComponent.prototype.ngOnInit = function () {
        this.verbs = this.configService._simpleConstraintVerbs;
        this.operators = this.configService._operators;
        this.formatTypes = this.configService._formatTypes;
    };
    __decorate([
        core_1.Input()
    ], EditComplexConstraintComponent.prototype, "constraint", void 0);
    __decorate([
        core_1.Input()
    ], EditComplexConstraintComponent.prototype, "idMap", void 0);
    __decorate([
        core_1.Input()
    ], EditComplexConstraintComponent.prototype, "treeData", void 0);
    __decorate([
        core_1.Input()
    ], EditComplexConstraintComponent.prototype, "limited", void 0);
    __decorate([
        core_1.Input()
    ], EditComplexConstraintComponent.prototype, "ifVerb", void 0);
    __decorate([
        core_1.Input()
    ], EditComplexConstraintComponent.prototype, "groupName", void 0);
    EditComplexConstraintComponent = __decorate([
        core_1.Component({
            selector: 'edit-complex-constraint',
            templateUrl: './edit-complexconstraint.component.html',
            styleUrls: ['./edit-complexconstraint.component.css'],
            viewProviders: [{ provide: forms_1.ControlContainer, useExisting: forms_1.NgForm }]
        })
    ], EditComplexConstraintComponent);
    return EditComplexConstraintComponent;
}());
exports.EditComplexConstraintComponent = EditComplexConstraintComponent;
