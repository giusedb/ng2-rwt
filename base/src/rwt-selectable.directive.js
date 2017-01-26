"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var RwtSelectableDirective = (function (_super) {
    __extends(RwtSelectableDirective, _super);
    function RwtSelectableDirective(rwt, er) {
        var _this = _super.call(this, rwt) || this;
        _this.er = er;
        var self = _this;
        return _this;
    }
    Object.defineProperty(RwtSelectableDirective.prototype, "rwtSelectable", {
        set: function (value) {
            var self = this;
            this.ref = value;
            this.ngOnDestroy();
            this.on('unselected-' + this.ref.constructor.modelName, function (ref) {
                if ((ref == self.ref) && self.ref.$selected) {
                    self.ref.$selected = false;
                    self.er.nativeElement.classList.remove('rwt-selected');
                }
            });
            this.on('selected-' + this.ref.constructor.modelName, function (ref) {
                if ((ref == self.ref) && !self.ref.$selected) {
                    self.ref.$selected = true;
                    self.er.nativeElement.classList.add('rwt-selected');
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    RwtSelectableDirective.prototype.click = function () {
        this.rwt.select(this.ref);
        return false;
    };
    return RwtSelectableDirective;
}(rwt_service_1.RwtServed));
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