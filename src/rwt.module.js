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
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var rwt_service_1 = require('./rwt.service');
var shared_1 = require('./shared');
var rwt_data_component_1 = require('./rwt-data.component');
var rwt_toggle_directive_1 = require('./rwt-toggle.directive');
var rwt_selectable_directive_1 = require('./rwt-selectable.directive');
var rwt_selection_outlet_component_1 = require('./rwt-selection-outlet.component');
var rwt_form_component_1 = require('./rwt-form.component');
var rwt_multiselectable_directive_1 = require('./rwt-multiselectable.directive');
var rwt_multiselection_outlet_component_1 = require('./rwt-multiselection-outlet.component');
exports.RwtFeModelComponent = rwt_form_component_1.createFeModel({});
var RwtModule = (function () {
    function RwtModule() {
    }
    RwtModule.forRoot = function (config) {
        return {
            ngModule: RwtModule,
            providers: [
                { provide: shared_1.RwtModuleConfig, useValue: config }
            ]
        };
    };
    RwtModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
            ],
            declarations: [
                rwt_data_component_1.RwtDataComponent,
                rwt_toggle_directive_1.RwtToggleDirective,
                rwt_selectable_directive_1.RwtSelectableDirective,
                rwt_selection_outlet_component_1.RwtSelectionOutletComponent,
                rwt_form_component_1.RwtFormInlineComponent,
                rwt_multiselectable_directive_1.RwtMultiselectableDirective,
                rwt_multiselection_outlet_component_1.RwtMultiselectionOutletComponent,
                exports.RwtFeModelComponent,
            ],
            providers: [rwt_service_1.RwtService],
            exports: [rwt_data_component_1.RwtDataComponent,
                rwt_toggle_directive_1.RwtToggleDirective,
                rwt_selectable_directive_1.RwtSelectableDirective,
                rwt_selection_outlet_component_1.RwtSelectionOutletComponent,
                rwt_form_component_1.RwtFormInlineComponent,
                rwt_multiselectable_directive_1.RwtMultiselectableDirective,
                rwt_multiselection_outlet_component_1.RwtMultiselectionOutletComponent,
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], RwtModule);
    return RwtModule;
}());
exports.RwtModule = RwtModule;
//# sourceMappingURL=rwt.module.js.map