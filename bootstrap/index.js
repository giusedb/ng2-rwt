"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var angular2_modal_1 = require("angular2-modal");
var bootstrap_1 = require("angular2-modal/plugins/bootstrap");
var rwt_modals_1 = require("./src/rwt-modals");
var rwt_form_component_1 = require("./src/rwt-form.component");
var base_1 = require("../base");
var RwtBootstrapModule = (function () {
    function RwtBootstrapModule() {
    }
    return RwtBootstrapModule;
}());
RwtBootstrapModule = __decorate([
    core_1.NgModule({
        entryComponents: [
            rwt_modals_1.ModalFormContentComponent,
        ],
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            base_1.RwtModule,
            angular2_modal_1.ModalModule.forRoot(),
            bootstrap_1.BootstrapModalModule,
        ],
        exports: [
            rwt_modals_1.RwtAskDirective,
            rwt_modals_1.RwtErrorHandlerComponent,
            rwt_modals_1.RwtModalFormDirective,
            rwt_modals_1.RwtModalFormTableDirective,
            rwt_form_component_1.RwtTableFormComponent,
        ],
        declarations: [
            rwt_modals_1.RwtAskDirective,
            rwt_modals_1.RwtErrorHandlerComponent,
            rwt_modals_1.RwtModalFormDirective,
            rwt_modals_1.RwtModalFormTableDirective,
            rwt_form_component_1.RwtTableFormComponent,
            rwt_modals_1.ModalFormContentComponent,
        ],
    })
], RwtBootstrapModule);
exports.RwtBootstrapModule = RwtBootstrapModule;
//# sourceMappingURL=index.js.map