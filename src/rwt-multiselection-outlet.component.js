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
var rwt_service_1 = require('./rwt.service');
var RwtMultiselectionOutletComponent = (function () {
    function RwtMultiselectionOutletComponent(rwt) {
        this.rwt = rwt;
    }
    RwtMultiselectionOutletComponent.prototype.ngOnInit = function () {
        this.selected = this.rwt.getMultiSelection(this.name);
    };
    Object.defineProperty(RwtMultiselectionOutletComponent.prototype, "rwtMultiselectionOutlet", {
        set: function (value) {
            var self = this;
            this.name = value.name;
            this.sortOrder = value.sortBy;
            this.sortDirection = value.sortDirection == 'asc';
            if (this.eSelected) {
                this.rwt.unbind(this.eSelected);
            }
            this.eSelected = this.rwt.on('update-multiselection-' + this.name, function (selection) {
                if (self.sortOrder) {
                    self.selected = Lazy(selection).sortBy(self.sortOrder).toArray();
                }
                else {
                    self.selected = selection;
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], RwtMultiselectionOutletComponent.prototype, "rwtMultiselectionOutlet", null);
    RwtMultiselectionOutletComponent = __decorate([
        core_1.Component({
            selector: '[rwtMultiselectionOutlet]',
            template: '<ng-content></ng-content>',
            outputs: ['selected'],
        }), 
        __metadata('design:paramtypes', [rwt_service_1.RwtService])
    ], RwtMultiselectionOutletComponent);
    return RwtMultiselectionOutletComponent;
}());
exports.RwtMultiselectionOutletComponent = RwtMultiselectionOutletComponent;
//# sourceMappingURL=rwt-multiselection-outlet.component.js.map