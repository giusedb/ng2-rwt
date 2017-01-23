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
var Choice = (function () {
    function Choice(element) {
        if (element && (element.constructor === Array)) {
            this.id = element[0];
            this.text = (element.length === 0) ? this.id : element[1];
        }
        else {
            this.id = element;
            this.text = element.toString();
        }
    }
    Choice.prototype.toString = function () {
        return this.text;
    };
    return Choice;
}());
exports.Choice = Choice;
var RwtForm = (function (_super) {
    __extends(RwtForm, _super);
    function RwtForm(rwt, cd) {
        var _this = _super.call(this, rwt) || this;
        _this.cd = cd;
        _this.choiceItems = {}; // { field name : }
        _this.fieldFilters = {};
        _this.edit = false;
        _this.title = null;
        _this.ready = false;
        _this.isNew = false;
        _this.errors = {};
        _this.transFieldFunction = {};
        // tslint:disable-next-line:member-ordering
        _this.sent = new core_1.EventEmitter();
        _this.orm = rwt.orm;
        _this.formIdx = RwtForm.idx++;
        return _this;
    }
    Object.defineProperty(RwtForm.prototype, "waiting", {
        get: function () {
            return !this.ready;
        },
        set: function (value) {
            this.ready = !value;
        },
        enumerable: true,
        configurable: true
    });
    RwtForm.prototype.updateObject = function () {
        var _this = this;
        if (this.values) {
            // update each object key
            Lazy(this.values).each(function (v, k) {
                _this.obj[k] = v;
            });
        }
    };
    RwtForm.prototype.acquireObject = function (obj) {
        /**
         * create an editable copy of real object
         * backup an original copy and acquire remoe references if any
         */
        var remoteReferences = [];
        if (obj) {
            this.originalObject = obj;
            this.oldObj = obj.asRaw();
        }
        // make a copy
        return Lazy(this.oldObj).toObject();
    };
    RwtForm.prototype.updateFields = function () {
        var _this = this;
        /**
         * Update field definition deeply
         */
        var extras = [];
        if (this.extraFields) {
            // integrate field default
            Lazy(this.extraFields)
                .filter(function (field, fieldName) { return !(fieldName in _this.allFields); })
                .each(function (field, fieldName) {
                // setting id as field name
                if (!('id' in field)) {
                    field.id = fieldName;
                }
                // setting name as capitalized field name
                if (!('name' in field)) {
                    field.name = fieldName.split(' ').map(_this.orm.utils.capitalize).join(' ');
                }
                if (!('type' in field)) {
                    field.widget = 'string';
                    field.type = 'string';
                }
                if (!('writable' in field) && !('readable' in field)) {
                    field.writable = true;
                }
            });
            // deep merge for each field
            Lazy(this.extraFields).each(function (v, k) {
                if (typeof v === 'object') {
                    var exists = false;
                    if (!(k in _this.allFields)) {
                        _this.allFields[k] = {};
                    }
                    else {
                        exists = true;
                    }
                    v = Lazy(_this.allFields[k])
                        .merge(v)
                        .toObject();
                }
                _this.allFields[k] = v;
            });
            extras = Lazy(this.extraFields)
                .filter(function (fieldName, field) { return !(fieldName in _this.model.fields); })
                .keys();
        }
        // redefine fields to show
        this.fields = Lazy(this.showFields)
            .concat(extras)
            .unique()
            .filter(function (f) { return _this.allFields[f].readable || _this.allFields[f].writable; })
            .map(function (f) { return _this.allFields[f]; }).toArray();
        this.fields.forEach(function (field) {
            // if a field requires an fixed choice it will default to choiche widget
            if (field.validators && field.validators.valid) {
                if (field.widget === field.type) {
                    field.widget = 'choices';
                }
                _this.choiceItems[field.id] = Lazy(field.validators.valid)
                    .map(function (x) { return new Choice(x); }).toArray();
            }
        });
        // waiting for references resolution
        var missingReferences = this.fields.filter(function (field) { return field.type === 'reference'; });
        var referenceLen = missingReferences.length;
        if (referenceLen && this.originalObject) {
            for (var _i = 0, missingReferences_1 = missingReferences; _i < missingReferences_1.length; _i++) {
                var field = missingReferences_1[_i];
                var val = this.originalObject['_' + field.id];
                if (val) {
                    this.rwt.get(field.to, val)
                        .then(function (x) {
                        referenceLen--;
                        if (!referenceLen) {
                            _this.obj = _this.acquireObject(_this.originalObject);
                            _this.ready = true;
                            _this.cd.detectChanges();
                        }
                    });
                }
                else {
                    referenceLen--;
                }
            }
        }
        return !(referenceLen && this.originalObject);
    };
    RwtForm.prototype.finalize = function (editable) {
        /**
         * Finalizes object and field creation
         */
        this.ready = this.updateFields();
        this.updateObject();
        this.editable = editable || false;
        this.cd.detectChanges();
    };
    RwtForm.prototype.setAttributes = function (attributes) {
        /**
         * Redefine all attributes for form rendering
         */
        var self = this;
        this.ready = false;
        this.title = attributes.title || null;
        this.showFields = attributes.showFields || null;
        this.extraFields = attributes.fieldDefs || null;
        this.values = attributes.values || {};
        this.verb = this.verb || null;
        this.errors = {};
        if (attributes.object) {
            this.isNew = false;
            this.gotModel(attributes.object.constructor);
            this.obj = this.acquireObject(attributes.object);
            this.finalize(attributes.editable);
        }
        else if (attributes.record) {
            var x_1 = attributes.record;
            this.isNew = false;
            this.orm.get(attributes.resource, x_1).then(function (obj) {
                if (obj) {
                    attributes.object = obj;
                    self.setAttributes(attributes);
                }
                else {
                    console.error('Object ' + attributes.resource + ' with id ' + x_1 + ' is unaccessible');
                }
            }, function (error) {
                self.ready = true;
            });
        }
        else if (attributes.resource) {
            this.isNew = true;
            this.orm.getModel(attributes.resource)
                .then(this.gotModel.bind(this))
                .then(function () {
                self.obj = {};
                self.finalize(attributes.editable);
            });
        }
        else {
        }
    };
    Object.defineProperty(RwtForm.prototype, "editable", {
        get: function () { return this.edit; },
        set: function (value) {
            var _this = this;
            if (value !== this.edit) {
                var numChoiches_1 = Lazy(this.fields)
                    .filter(function (field) { return (((field.type === 'reference')
                    || field.validators.valid)
                    && (field.writable)); })
                    .size();
                var _loop_1 = function (field) {
                    if ((field.type === 'reference') && (field.writable)) {
                        this_1.ready = false;
                        this_1.orm.query(field.to, this_1.fieldFilters[field.id] || {})
                            .then(function (references) {
                            _this.choiceItems[field.id] = references;
                            numChoiches_1--;
                            if (numChoiches_1 === 0) {
                                _this.ready = true;
                                _this.cd.markForCheck();
                            }
                        });
                    }
                };
                var this_1 = this;
                // fetching choiches for references
                for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
                    var field = _a[_i];
                    _loop_1(field);
                }
                if (value) {
                    this.errors = {};
                }
                else {
                    this.obj = Lazy(this.oldObj).toObject();
                }
                this.edit = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    RwtForm.prototype.gotModel = function (model, callBack) {
        this.model = model;
        // copy original model fields
        this.allFields = Lazy(model.fields).toObject();
        if (!this.showFields) {
            this.showFields = model.fieldsOrder;
        } // else fields remain user defined
        // tslint:disable-next-line:no-unused-expression
        callBack && callBack();
    };
    RwtForm.prototype.toggleEdit = function () {
        this.editable = !this.edit;
    };
    RwtForm.prototype.submit = function () {
        var _this = this;
        var orm = this.orm;
        function toDate(x) {
            if (x) {
                var d = new Date(x);
                return (d.getTime() + orm.utils.tzOffset) / 1000;
            }
        }
        var lazyFields = Lazy(this.fields);
        var sendFields = Lazy(this.allFields)
            .values()
            .filter(function (field) { return (field.writable && lazyFields.contains(field)) || (field.id in _this.values); })
            .toArray();
        var sendValues = sendFields.map(function (field) {
            var value = _this.obj[field.id];
            if (field.widget === 'choices') {
                return value ? value.id : null;
            }
            switch (field.type) {
                case 'date': return toDate(value);
                case 'datetime': return toDate(value);
                case 'boolean': {
                    switch (value) {
                        case 'F': return 'F';
                        case 'T': return 'T';
                        case null: return null;
                        default: return Boolean(_this.obj[field.id]);
                    }
                }
                // tslint:disable-next-line:no-switch-case-fall-through
                case 'integer':
                    // tslint:disable-next-line:radix
                    return parseInt(value);
                case 'floar': return parseFloat(value);
                case 'reference': return value ? value.id : undefined;
                case 'string': {
                    if (field.validators.valid) {
                        return value ? value.id : null;
                    }
                    else {
                        return value;
                    }
                }
                // tslint:disable-next-line:no-switch-case-fall-through
                default: return _this.obj[field.id];
            }
        });
        // reference to original object if any
        var originalObject = {};
        if (this.originalObject) {
            originalObject = this.originalObject.asRaw();
        }
        // creating object to send to server
        var sendObject = Lazy(sendFields)
            .pluck('id')
            .zip(sendValues)
            .filter(function (x) { return x[1] !== originalObject[x[0]]; })
            .toObject();
        // this object may be without id
        if (originalObject.id) {
            sendObject.id = originalObject.id;
        }
        var endPoint = orm.$orm.connection.cachedStatus.endPoint;
        var url = null;
        if (this.model) {
            if (this.verb) {
                url = this.model.modelName + '/' + this.verb;
            }
            else {
                url = this.model.modelName + '/' + (this.isNew ? 'put' : 'post');
            }
        }
        this.ready = false;
        orm.$sendToEndpoint(url, sendObject).then(function (id) {
            if ((id === '') && _this.originalObject) {
                id = _this.originalObject.id;
            }
            setTimeout((function () {
                var _this = this;
                this.rwt.get(this.model.modelName, id)
                    .then(function (obj) {
                    _this.obj = _this.acquireObject(obj);
                    _this.ready = true;
                    try {
                        _this.cd.markForCheck();
                    }
                    catch (e) { }
                });
            }).bind(_this), 200);
            _this.errors = {};
            _this.editable = false;
            _this.sent.emit();
        }, function (errDef) {
            _this.errors = errDef.errors || {};
            _this.ready = true;
        });
    };
    return RwtForm;
}(rwt_service_1.RwtServed));
RwtForm.idx = 0;
__decorate([
    core_1.ViewChild('mainForm'),
    __metadata("design:type", core_1.ElementRef)
], RwtForm.prototype, "mainForm", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], RwtForm.prototype, "sent", void 0);
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
}(RwtForm));
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
        id: '{{ form.obj[fieldName] }}',
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