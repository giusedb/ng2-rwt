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
var rwt_service_1 = require("./rwt.service");
var RwtMultiselectableDirective = (function () {
    function RwtMultiselectableDirective(rwt) {
        this.rwt = rwt;
        this.obj = null;
        this.name = null;
    }
    Object.defineProperty(RwtMultiselectableDirective.prototype, "rwtMultiselectable", {
        set: function (value) {
            this.name = value.name;
            this.obj = value.bindTo;
        },
        enumerable: true,
        configurable: true
    });
    RwtMultiselectableDirective.prototype.click = function (evt) {
        this.rwt.toggleMulti(this.name, this.obj);
    };
    return RwtMultiselectableDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtMultiselectableDirective.prototype, "rwtMultiselectable", null);
__decorate([
    core_1.HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], RwtMultiselectableDirective.prototype, "click", null);
RwtMultiselectableDirective = __decorate([
    core_1.Directive({
        selector: '[rwtMultiselectable]'
    }),
    __metadata("design:paramtypes", [rwt_service_1.RwtService])
], RwtMultiselectableDirective);
exports.RwtMultiselectableDirective = RwtMultiselectableDirective;
//# sourceMappingURL=rwt-multiselectable.directive.js.map