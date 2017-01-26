"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var RwtToggleDirective = (function () {
    function RwtToggleDirective(cd) {
        this.cd = cd;
    }
    Object.defineProperty(RwtToggleDirective.prototype, "rwtToggle", {
        set: function (value) {
            this.attrName = value.attribute;
            this.obj = value.bindTo;
        },
        enumerable: true,
        configurable: true
    });
    RwtToggleDirective.prototype.click = function () {
        this.obj[this.attrName] = !this.obj[this.attrName];
        return false;
    };
    return RwtToggleDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtToggleDirective.prototype, "rwtToggle", null);
__decorate([
    core_1.HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RwtToggleDirective.prototype, "click", null);
RwtToggleDirective = __decorate([
    core_1.Directive({
        // tslint:disable-next-line:directive-selector
        selector: '[rwtToggle]',
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], RwtToggleDirective);
exports.RwtToggleDirective = RwtToggleDirective;
var RwtSetDirective = (function () {
    function RwtSetDirective(cd) {
        this.cd = cd;
    }
    Object.defineProperty(RwtSetDirective.prototype, "rwtSet", {
        set: function (value) {
            this.attrName = value.attribute;
            this.obj = value.bindTo;
            this.value = value.value;
        },
        enumerable: true,
        configurable: true
    });
    RwtSetDirective.prototype.click = function () {
        this.obj[this.attrName] = this.value;
        return false;
    };
    return RwtSetDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtSetDirective.prototype, "rwtSet", null);
__decorate([
    core_1.HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RwtSetDirective.prototype, "click", null);
RwtSetDirective = __decorate([
    core_1.Directive({
        selector: '[rwtSet]'
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], RwtSetDirective);
exports.RwtSetDirective = RwtSetDirective;
//# sourceMappingURL=rwt-toggle.directive.js.map