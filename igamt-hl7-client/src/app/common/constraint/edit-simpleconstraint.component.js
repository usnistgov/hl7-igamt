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
var EditSimpleConstraintComponent = (function () {
    function EditSimpleConstraintComponent(configService) {
        this.configService = configService;
    }
    EditSimpleConstraintComponent.prototype.ngOnInit = function () {
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
    EditSimpleConstraintComponent.prototype.addValue = function () {
        if (!this.constraint.complement.values)
            this.constraint.complement.values = [];
        this.constraint.complement.values.push('');
    };
    EditSimpleConstraintComponent.prototype.generateAssertionScript = function (constraint) {
        constraint.path1 = "OBX-4[" + constraint.instanceNum + "].1[1]";
        constraint.positionPath1 = "4[" + constraint.instanceNum + "].1[1]";
        constraint.assertionScript = "<PlainText Path=\"4[" + constraint.instanceNum + "].1[1]\" Text=\"AAAA\" IgnoreCase=\"false\"/>";
    };
    __decorate([
        core_1.Input()
    ], EditSimpleConstraintComponent.prototype, "constraint", void 0);
    __decorate([
        core_1.Input()
    ], EditSimpleConstraintComponent.prototype, "idMap", void 0);
    __decorate([
        core_1.Input()
    ], EditSimpleConstraintComponent.prototype, "treeData", void 0);
    __decorate([
        core_1.Input()
    ], EditSimpleConstraintComponent.prototype, "ifVerb", void 0);
    __decorate([
        core_1.Input()
    ], EditSimpleConstraintComponent.prototype, "groupName", void 0);
    EditSimpleConstraintComponent = __decorate([
        core_1.Component({
            selector: 'edit-simple-constraint',
            templateUrl: './edit-simpleconstraint.component.html',
            styleUrls: ['./edit-simpleconstraint.component.css'],
            viewProviders: [{ provide: forms_1.ControlContainer, useExisting: forms_1.NgForm }]
        })
    ], EditSimpleConstraintComponent);
    return EditSimpleConstraintComponent;
}());
exports.EditSimpleConstraintComponent = EditSimpleConstraintComponent;
