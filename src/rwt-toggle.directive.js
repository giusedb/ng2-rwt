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
var core_1 = require('@angular/core');
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
        console.log('click');
        this.obj[this.attrName] = !this.obj[this.attrName];
        return false;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], RwtToggleDirective.prototype, "rwtToggle", null);
    __decorate([
        core_1.HostListener('click'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], RwtToggleDirective.prototype, "click", null);
    RwtToggleDirective = __decorate([
        core_1.Directive({
            selector: '[rwtToggle]',
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], RwtToggleDirective);
    return RwtToggleDirective;
}());
exports.RwtToggleDirective = RwtToggleDirective;
//# sourceMappingURL=rwt-toggle.directive.js.map