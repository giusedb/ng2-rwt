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
var RwtSelectableDirective = (function () {
    function RwtSelectableDirective(rwt, er) {
        this.rwt = rwt;
        this.er = er;
        var self = this;
    }
    Object.defineProperty(RwtSelectableDirective.prototype, "rwtSelectable", {
        set: function (value) {
            var self = this;
            this.ref = value;
            if (this.eSelection) {
                this.rwt.unbind(this.eSelection);
            }
            if (this.eUnSelection) {
                this.rwt.unbind(this.eSelection);
            }
            this.eUnSelection = this.rwt.on('unselected-' + this.ref.constructor.modelName, function (ref) {
                if ((ref == self.ref) && self.ref.$selected) {
                    self.ref.$selected = false;
                    self.er.nativeElement.classList.remove('rwt-selected');
                }
            });
            this.eSelection = this.rwt.on('selected-' + this.ref.constructor.modelName, function (ref) {
                if ((ref == self.ref) && !self.ref.$selected) {
                    self.ref.$selected = true;
                    self.er.nativeElement.classList.add('rwt-selected');
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    RwtSelectableDirective.prototype.ngOnDestroy = function () {
        this.rwt.unbind(this.eSelection);
    };
    RwtSelectableDirective.prototype.click = function () {
        this.rwt.select(this.ref);
        return false;
    };
    return RwtSelectableDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtSelectableDirective.prototype, "rwtSelectable", null);
__decorate([
    core_1.HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RwtSelectableDirective.prototype, "click", null);
RwtSelectableDirective = __decorate([
    core_1.Directive({
        selector: '[rwtSelectable]'
    }),
    __metadata("design:paramtypes", [rwt_service_1.RwtService, core_1.ElementRef])
], RwtSelectableDirective);
exports.RwtSelectableDirective = RwtSelectableDirective;
//# sourceMappingURL=rwt-selectable.directive.js.map