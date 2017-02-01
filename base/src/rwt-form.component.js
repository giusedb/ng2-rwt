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
// tslint:disable-next-line:max-line-length
var core_1 = require("@angular/core");
var rwt_service_1 = require("./rwt.service");
var rwt_form_1 = require("./rwt-form");
var RwtFormInlineComponent = (function (_super) {
    __extends(RwtFormInlineComponent, _super);
    function RwtFormInlineComponent(rwt, cd) {
        return _super.call(this, rwt, cd) || this;
    }
    Object.defineProperty(RwtFormInlineComponent.prototype, "rwtFormInline", {
        set: function (value) {
            _super.prototype.setAttributes.call(this, value);
        },
        enumerable: true,
        configurable: true
    });
    return RwtFormInlineComponent;
}(rwt_form_1.RwtForm));
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtFormInlineComponent.prototype, "rwtFormInline", null);
RwtFormInlineComponent = __decorate([
    core_1.Component({
        // tslint:disable-next-line:component-selector
        selector: 'rwt-form-inline',
        template: "\n  <form novalidate (submit)=\"submit()\">\n    {{ title }}\n    <ng-content></ng-content>\n  </form>",
    }),
    __metadata("design:paramtypes", [rwt_service_1.RwtService, core_1.ChangeDetectorRef])
], RwtFormInlineComponent);
exports.RwtFormInlineComponent = RwtFormInlineComponent;
var RwtFormTemplateComponent = (function (_super) {
    __extends(RwtFormTemplateComponent, _super);
    function RwtFormTemplateComponent(rwt, cd) {
        return _super.call(this, rwt, cd) || this;
    }
    Object.defineProperty(RwtFormTemplateComponent.prototype, "rwtFormTemplate", {
        set: function (value) {
            _super.prototype.setAttributes.call(this, value);
        },
        enumerable: true,
        configurable: true
    });
    return RwtFormTemplateComponent;
}(rwt_form_1.RwtForm));
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtFormTemplateComponent.prototype, "rwtFormTemplate", null);
RwtFormTemplateComponent = __decorate([
    core_1.Component({
        // tslint:disable-next-line:component-selector
        selector: '[rwtFormTemplate]',
        template: 'rwt form with template {{ template }}'
    }),
    __metadata("design:paramtypes", [rwt_service_1.RwtService, core_1.ChangeDetectorRef])
], RwtFormTemplateComponent);
exports.RwtFormTemplateComponent = RwtFormTemplateComponent;
function createFeModel(editableTemplates, staticTemplates) {
    if (editableTemplates === void 0) { editableTemplates = {}; }
    if (staticTemplates === void 0) { staticTemplates = {}; }
    // editable templates
    var defaultTemplates = {
        // tslint:disable-next-line:max-line-length
        integer: '<input [required]="required" [min]="min" [max]="max" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}" type="number">',
        float: '<input [required]="required" [min]="min" [max]="max" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}" type="number">',
        // tslint:disable-next-line:max-line-length
        boolean: '<input [required]="required" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}" type="checkbox">',
        text: '<textarea [pattern]="pattern" [minlength]="minlength" [maxlength]="maxlength" [required]="required" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}"></textarea>',
        // tslint:disable-next-line:max-line-length
        default: '<input [required]="required" [pattern]="pattern" [minlength]="minlength" [maxlength]="maxlength" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}" type="text">',
        id: '{{ value }}',
        choices: "<select [required]=\"required\" [(ngModel)]=\"form.obj[fieldName]\">\n                  <option [ngValue]=\"choice\" *ngFor=\"let choice of form.choiceItems[fieldName]\">{{\u00A0choice }}</option>\n              </select>",
        date: '<input [required]="required" type="date" [(ngModel)]="form.obj[fieldName]">',
        error: '<div class="rwt-error" *ngIf="form.edit && form.errors[fieldName]">{{ form.errors[fieldName] }}</div>',
        // tslint:disable-next-line:max-line-length
        password: '<input [required]="required" [pattern]="pattern" [minlength]="minlength" [maxlength]="maxlength" [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ field.name }}" type="password">',
    };
    console.log('ciao');
    var typeTemplates = Lazy(defaultTemplates)
        .keys()
        .concat(Lazy(editableTemplates).keys())
        .unique()
        .map(function (fieldType) { return [fieldType, (fieldType in editableTemplates) ? editableTemplates[fieldType] : defaultTemplates[fieldType]]; })
        .toObject();
    var errorTemplate = typeTemplates.error;
    var defaultWidget = typeTemplates.default;
    delete typeTemplates.error;
    delete typeTemplates.default;
    var fieldTypeTemplates = Lazy(typeTemplates).map(function (v, k) { return '<template ngSwitchCase="' + k + '">' + v + '</template>\n'; }).toString();
    // static templates
    var defaultStatic = '{{ form.obj[fieldName]}}';
    if ('default' in staticTemplates) {
        defaultStatic = staticTemplates.default;
        delete staticTemplates.default;
    }
    var staticTemplate = Lazy(staticTemplates)
        .map(function (template, fieldName) { return '<template ngSwitchCase="' + fieldName + '">' + template + '</template>\n'; })
        .toString();
    console.log(staticTemplate);
    var template = "\n      <template [ngIf]=\"form.ready\">\n        <template [ngIf]=\"form.edit && field.writable\">\n          <span [ngSwitch]=\"field.widget\">\n        "
        + fieldTypeTemplates +
        " <template ngSwitchDefault>" + defaultWidget + "</template>\n          </span>\n        </template>\n        <template [ngIf]=\"!(form.edit && field.writable) && form.obj\">\n          <span [ngSwitch]=\"field.widget\">"
        + staticTemplate +
        " <template ngSwitchDefault>" +
        defaultStatic +
        "</template>\n          </span>\n        </template>\n        <template [ngIf]=\"form.errors[fieldName]\">" + errorTemplate + "</template>\n      </template>\n    ";
    var RwtFeModel = (function () {
        // tslint:disable-next-line:component-class-suffix
        function RwtFeModel() {
        }
        Object.defineProperty(RwtFeModel.prototype, "value", {
            get: function () {
                return this.form.obj[this.fieldName];
            },
            set: function (val) {
                this.form.obj[this.fieldName] = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RwtFeModel.prototype, "rwtFeModel", {
            set: function (value) {
                this.fieldName = value;
                this.field = this.form.allFields[value];
                this.value = this.form.obj[value];
                // if field has validators
                // assuming them as part of Component
                var names = {
                    required: 1,
                    min: 1,
                    max: 1,
                    minlength: 1,
                    maxlength: 1,
                    pattern: 1,
                };
                if (this.field.validators) {
                    for (var name_1 in this.field.validators) {
                        if (name_1 in names) {
                            this[name_1] = this.field.validators[name_1];
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        RwtFeModel.prototype.ngOnInit = function () {
        };
        return RwtFeModel;
    }());
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RwtFeModel.prototype, "rwtFeModel", null);
    RwtFeModel = __decorate([
        core_1.Component({
            // tslint:disable-next-line:component-selector
            selector: '[rwtFeModel]',
            // tslint:disable-next-line:use-input-property-decorator
            inputs: ['form'],
            template: template,
        })
    ], RwtFeModel);
    return RwtFeModel;
}
exports.createFeModel = createFeModel;
var types = {};
var statics = {};
try {
    var tw = require('type-widgets.js');
    types = tw.templateWidgets;
    if (tw.templateStatics) {
        statics = tw.templateStatics;
    }
    // tslint:disable-next-line:no-console
    console.info('found custom field types for ' + Lazy(types).keys().toArray().join(', '));
}
catch (e) {
    console.warn('field-types.js is not found', e);
}
exports.RwtFeModelComponent = createFeModel(types, statics);
//# sourceMappingURL=rwt-form.component.js.map