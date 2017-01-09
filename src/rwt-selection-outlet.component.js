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
var RwtSelectionOutletComponent = (function () {
    function RwtSelectionOutletComponent(rwt) {
        this.rwt = rwt;
        this.item = null;
        this.persistent = false;
    }
    RwtSelectionOutletComponent.prototype.ngOnInit = function () {
        var self = this;
        this.item = this.rwt.getSelectionFor(this.resource);
        this.eSelection = this.rwt.on('selected-' + this.resource, function (item) {
            self.item = item;
        });
        if (this.persistent !== false) {
            this.rwt.makePersistentSelection(this.resource);
        }
    };
    RwtSelectionOutletComponent.prototype.ngOnDestroy = function () {
        this.rwt.unbind(this.eSelection);
    };
    return RwtSelectionOutletComponent;
}());
RwtSelectionOutletComponent = __decorate([
    core_1.Component({
        selector: 'rwt-selection-outlet',
        template: '<ng-content></ng-content>',
        inputs: ['resource', 'persistent'],
        outputs: ['item'],
    }),
    __metadata("design:paramtypes", [rwt_service_1.RwtService])
], RwtSelectionOutletComponent);
exports.RwtSelectionOutletComponent = RwtSelectionOutletComponent;
//# sourceMappingURL=rwt-selection-outlet.component.js.map