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
var __1 = require("../..");
var RwtTableFormComponent = (function (_super) {
    __extends(RwtTableFormComponent, _super);
    function RwtTableFormComponent(rwt, cd, er) {
        var _this = _super.call(this, rwt, cd) || this;
        _this.classes = er.nativeElement.getAttribute('class');
        er.nativeElement.setAttribute('class', '');
        return _this;
    }
    Object.defineProperty(RwtTableFormComponent.prototype, "rwtTableForm", {
        set: function (value) {
            _super.prototype.setAttributes.call(this, value);
        },
        enumerable: true,
        configurable: true
    });
    return RwtTableFormComponent;
}(__1.RwtForm));
RwtTableFormComponent = __decorate([
    core_1.Component({
        // tslint:disable-next-line:component-selector
        selector: '[rwtTableForm]',
        // tslint:disable-next-line:use-input-property-decorator
        inputs: ['rwtTableForm'],
        template: "\n    <span *ngIf=\"waiting\">\n      Waiting ..... \n    </span>\n    <form novalidate (submit)=\"submit()\" #mainForm>\n      <table [class]=\"classes\">\n          <tr *ngIf=\"title\" scope=\"row\">\n              <th colspan=\"2\">\n                  {{ title }}\n              </th>\n          </tr>\n          <tr *ngFor=\"let field of fields\">\n              <td><label for=\"{{ field.id }}\"><b>{{ field.name }}</b></label></td>\n              <td [rwtFeModel]=\"field.id\" [form]=\"this\"></td>\n          </tr>\n          <input type=\"submit\" [hidden]=\"true\">\n      </table>\n    </form>\n  ",
    }),
    __metadata("design:paramtypes", [__1.RwtService, core_1.ChangeDetectorRef, core_1.ElementRef])
], RwtTableFormComponent);
exports.RwtTableFormComponent = RwtTableFormComponent;
//# sourceMappingURL=rwt-form.component.js.map