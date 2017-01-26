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
function getImports(config, extraModules) {
    var baseImports = [
        common_1.CommonModule,
        forms_1.FormsModule,
        angular2_modal_1.ModalModule.forRoot(),
        bootstrap_1.BootstrapModalModule,
        base_1.RwtModule.forRoot(config, extraModules),
    ];
    Array.prototype.push.apply(baseImports, extraModules);
    return baseImports;
}
exports.getImports = getImports;
function createModule(config, dependencies) {
    var RwtBootstrapModule = RwtBootstrapModule_1 = (function () {
        function RwtBootstrapModule() {
        }
        RwtBootstrapModule.forRoot = function (config, dependencies) {
            if (dependencies) {
                return createModule(config, dependencies).forRoot(config);
            }
            return {
                ngModule: RwtBootstrapModule_1,
            };
        };
        return RwtBootstrapModule;
    }());
    RwtBootstrapModule = RwtBootstrapModule_1 = __decorate([
        core_1.NgModule({
            entryComponents: [
                rwt_modals_1.ModalFormContentComponent,
            ],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                angular2_modal_1.ModalModule.forRoot(),
                bootstrap_1.BootstrapModalModule,
            ],
            exports: [
                rwt_modals_1.RwtAskDirective,
                rwt_modals_1.RwtErrorHandlerComponent,
                rwt_modals_1.RwtModalFormDirective,
                rwt_modals_1.RwtModalFormTableDirective,
                rwt_form_component_1.RwtTableFormComponent,
                base_1.RwtModule,
            ].concat(dependencies),
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
    return RwtBootstrapModule;
    var RwtBootstrapModule_1;
}
exports.createModule = createModule;
exports.RwtBootstrapModule = createModule(null);
//# sourceMappingURL=index.js.map