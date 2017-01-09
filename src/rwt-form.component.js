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
var RwtForm = (function () {
    function RwtForm(rwt, cd) {
        this.rwt = rwt;
        this.cd = cd;
        this.edit = false;
        this.title = null;
        this.ready = false;
        this.isNew = false;
        this.orm = rwt.orm;
        this.formIdx = RwtForm.idx++;
    }
    RwtForm.prototype.ngOnInit = function () { };
    RwtForm.prototype.setAttributes = function (attributes) {
        var self = this;
        this.ready = false;
        this.title = attributes.title || null;
        this.showFields = attributes.showFields || null;
        if (attributes.object) {
            this.isNew = false;
            this.gotModel(attributes.object.constructor);
            this.editable = attributes.editable || false;
            this.obj = attributes.object;
            this.ready = true;
            this.cd.detectChanges();
        }
        else if (attributes.record) {
            var x = attributes.record;
            this.isNew = false;
            this.orm.get(attributes.resource, x).then(function (obj) {
                attributes.object = obj;
                self.setAttributes(attributes);
            });
        }
        else if (attributes.resource) {
            this.isNew = true;
            this.orm.getModel(attributes.resource)
                .then(this.gotModel.bind(this))
                .then(function () {
                self.editable = attributes.editable;
                self.ready = true;
                self.cd.detectChanges();
            });
        }
    };
    Object.defineProperty(RwtForm.prototype, "editable", {
        get: function () { return this.edit; },
        set: function (value) {
            if (value != this.edit) {
                if (value) {
                    if (this.isNew) {
                        this.oldObj = this.obj = new this.model();
                    }
                    else {
                        this.oldObj = this.obj;
                        this.obj = this.obj.copy();
                    }
                }
                else {
                    if (this.isNew) {
                        this.obj = new this.model();
                    }
                    else {
                        this.obj = this.oldObj;
                    }
                }
                this.edit = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    RwtForm.prototype.gotModel = function (model, callBack) {
        var _this = this;
        this.model = model;
        this.allFields = model.fields;
        var j = Lazy(this.showFields).keys();
        if (this.showFields) {
            this.fields = Lazy(this.allFields).filter(function (f) { return j.contains(f); }).toArray();
        }
        else {
            this.fields = Lazy(model.fieldsOrder).map(function (f) { return _this.allFields[f]; }).toArray();
        }
        callBack && callBack();
    };
    RwtForm.prototype.toggleEdit = function () {
        this.editable = !this.edit;
    };
    RwtForm.prototype.submit = function () {
        this.obj.save().then(function () {
            this.editable = false;
        }.bind(this), function (error) {
            alert(error);
        }.bind(this));
    };
    return RwtForm;
}());
RwtForm.idx = 0;
exports.RwtForm = RwtForm;
;
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
}(RwtForm));
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtFormInlineComponent.prototype, "rwtFormInline", null);
RwtFormInlineComponent = __decorate([
    core_1.Component({
        selector: '[rwtFormInline]',
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
}(RwtForm));
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtFormTemplateComponent.prototype, "rwtFormTemplate", null);
RwtFormTemplateComponent = __decorate([
    core_1.Component({
        selector: '[rwtFormTemplate]',
        template: 'rwt form with template {{ template }}'
    }),
    __metadata("design:paramtypes", [rwt_service_1.RwtService, core_1.ChangeDetectorRef])
], RwtFormTemplateComponent);
exports.RwtFormTemplateComponent = RwtFormTemplateComponent;
function createFeModel(typeTemplates) {
    var defaultTemplates = {
        integer: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="number">',
        float: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="number">',
        boolean: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="checkbox">',
        text: '<textarea [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}"></textarea>',
        default: '<input [(ngModel)]="form.obj[fieldName]" class="form-control" placeholder="{{ fieldName }}" type="text">',
        reference: 'reference to: {{ fieldName }}',
        id: '{{ form.obj[fieldName] }}',
        error: '<div class="rwt-error" *ngIf="form.errors[fieldName]">{{ form.errors[fieldName] }}</div>',
    };
    typeTemplates = Lazy(defaultTemplates)
        .keys()
        .concat(Lazy(typeTemplates).keys())
        .unique()
        .map(function (fieldType) { return [fieldType, (fieldType in typeTemplates) ? typeTemplates[fieldType] : defaultTemplates[fieldType]]; })
        .toObject();
    var fieldTypeTemplates = Lazy(typeTemplates).map(function (v, k) { return '<template ngSwitchCase="' + k + '">' + v + '</template>\n'; }).toString();
    var template = "\n      <template ngIf=\"form.ready\">  \n        <span *ngIf=\"form.edit && field.writable\">\n          <span [ngSwitch]=\"field.type\">\n        "
        + fieldTypeTemplates +
        " <template ngSwitchDefault><input [(ngModel)]=\"form.obj[fieldName]\" class=\"form-control\" placeholder=\"{{ fieldName }}\" type=\"text\"></template>\n          </span>\n          </span>\n        <span *ngIf=\"!(form.edit && field.writable) && form.obj\">\n          {{ form.obj[fieldName]}}\n        </span>\n      </template>\n    ";
    var RwtFeModel = (function () {
        function RwtFeModel() {
        }
        Object.defineProperty(RwtFeModel.prototype, "rwtFeModel", {
            set: function (value) {
                this.fieldName = value;
                this.field = this.form.allFields[value];
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
            selector: '[rwtFeModel]',
            inputs: ['form'],
            template: template,
        }),
        __metadata("design:paramtypes", [])
    ], RwtFeModel);
    return RwtFeModel;
}
exports.createFeModel = createFeModel;
var types = {};
try {
    types = require('field-types.js').types;
    console.info('found cusrom field types for ' + Lazy(types).keys().toArray().join(', '));
}
catch (e) {
    console.warn('field-types.js is not found', e);
}
exports.RwtFeModelComponent = createFeModel(types);
//# sourceMappingURL=rwt-form.component.js.map