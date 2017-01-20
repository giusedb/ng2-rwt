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
var RwtSelectionOutletComponent = (function (_super) {
    __extends(RwtSelectionOutletComponent, _super);
    function RwtSelectionOutletComponent(rwt) {
        var _this = _super.call(this, rwt) || this;
        _this.item = null;
        _this.persistent = false;
        return _this;
    }
    RwtSelectionOutletComponent.prototype.ngOnInit = function () {
        var self = this;
        this.item = this.rwt.getSelectionFor(this.resource);
        this.on('selected-' + this.resource, function (item) {
            self.item = item;
        });
        if (this.persistent !== false) {
            this.rwt.makePersistentSelection(this.resource);
        }
    };
    return RwtSelectionOutletComponent;
}(rwt_service_1.RwtServed));
RwtSelectionOutletComponent = __decorate([
    core_1.Component({
        // tslint:disable-next-line:component-selector
        selector: 'rwt-selection-outlet,[selection-outlet]',
        template: '<template [ngIf]="item"><ng-content></ng-content></template>',
        // tslint:disable-next-line:use-input-property-decorator
        inputs: ['resource', 'persistent'],
        // tslint:disable-next-line:use-output-property-decorator
        outputs: ['item'],
    }),
    __metadata("design:paramtypes", [rwt_service_1.RwtService])
], RwtSelectionOutletComponent);
exports.RwtSelectionOutletComponent = RwtSelectionOutletComponent;
//# sourceMappingURL=rwt-selection-outlet.component.js.map