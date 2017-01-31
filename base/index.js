"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var rwt_service_1 = require("./src/rwt.service");
var rwt_data_component_1 = require("./src/rwt-data.component");
var rwt_toggle_directive_1 = require("./src/rwt-toggle.directive");
var rwt_selectable_directive_1 = require("./src/rwt-selectable.directive");
var rwt_selection_outlet_component_1 = require("./src/rwt-selection-outlet.component");
var rwt_form_component_1 = require("./src/rwt-form.component");
var rwt_multiselectable_directive_1 = require("./src/rwt-multiselectable.directive");
var rwt_multiselection_outlet_component_1 = require("./src/rwt-multiselection-outlet.component");
__export(require("./src/rwt.service"));
__export(require("./src/shared"));
__export(require("./src/rwt-data.component"));
__export(require("./src/rwt-selectable.directive"));
__export(require("./src/rwt-selection-outlet.component"));
__export(require("./src/rwt-toggle.directive"));
__export(require("./src/rwt-multiselection-outlet.component"));
__export(require("./src/rwt-multiselectable.directive"));
__export(require("./src/rwt-form.component"));
__export(require("./src/rwt-form"));
var extraModules = [];
// demo only
var ng2_datetime_1 = require("ng2-datetime/ng2-datetime");
extraModules.push(ng2_datetime_1.NKDatetimeModule);
// demo
var baseImports = [
    common_1.CommonModule,
    forms_1.FormsModule,
];
var moduleDef = {
    imports: baseImports.concat(extraModules),
    declarations: [
        rwt_data_component_1.RwtDataComponent,
        rwt_toggle_directive_1.RwtToggleDirective,
        rwt_selectable_directive_1.RwtSelectableDirective,
        rwt_selection_outlet_component_1.RwtSelectionOutletComponent,
        rwt_selectable_directive_1.RwtSelectableDirective,
        rwt_form_component_1.RwtFormInlineComponent,
        rwt_multiselectable_directive_1.RwtMultiselectableDirective,
        rwt_multiselection_outlet_component_1.RwtMultiselectionOutletComponent,
        rwt_form_component_1.RwtFeModelComponent,
        rwt_selection_outlet_component_1.RwtSelectionOutletDirective,
        rwt_toggle_directive_1.RwtSetDirective,
    ],
    exports: [rwt_data_component_1.RwtDataComponent,
        rwt_toggle_directive_1.RwtToggleDirective,
        rwt_selectable_directive_1.RwtSelectableDirective,
        rwt_selection_outlet_component_1.RwtSelectionOutletComponent,
        rwt_selectable_directive_1.RwtSelectableDirective,
        rwt_form_component_1.RwtFormInlineComponent,
        rwt_multiselectable_directive_1.RwtMultiselectableDirective,
        rwt_multiselection_outlet_component_1.RwtMultiselectionOutletComponent,
        rwt_form_component_1.RwtFeModelComponent,
        rwt_selection_outlet_component_1.RwtSelectionOutletDirective,
        rwt_toggle_directive_1.RwtSetDirective,
    ],
    providers: [rwt_service_1.RwtService]
};
var RwtModule = (function () {
    function RwtModule() {
    }
    return RwtModule;
}());
RwtModule = __decorate([
    core_1.NgModule(moduleDef)
], RwtModule);
exports.RwtModule = RwtModule;
;
function createModule(extraModules) {
    if (extraModules === void 0) { extraModules = []; }
    moduleDef.imports = moduleDef.imports.concat(extraModules);
    var RWT = (function () {
        function RWT() {
        }
        return RWT;
    }());
    RWT = __decorate([
        core_1.NgModule(moduleDef)
    ], RWT);
    return RWT;
}
exports.createModule = createModule;
//# sourceMappingURL=index.js.map