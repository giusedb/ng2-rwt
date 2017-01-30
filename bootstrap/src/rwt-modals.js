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
var bootstrap_1 = require("angular2-modal/plugins/bootstrap");
var angular2_modal_1 = require("angular2-modal");
var __1 = require("../..");
var RwtAskDirective = (function () {
    function RwtAskDirective(modal) {
        this.modal = modal;
        this.accept = new core_1.EventEmitter();
        this.reject = new core_1.EventEmitter();
    }
    RwtAskDirective.prototype.click = function (evt) {
        var _this = this;
        var dialog = this.modal.confirm();
        if (this.rwtTitle) {
            dialog.title(this.rwtTitle);
        }
        dialog.message(this.text)
            .showClose(true)
            .open()
            .then(function (dialog) {
            dialog.result.then(function (result) {
                _this.accept.emit(result);
            }, function (result) {
                _this.reject.emit(result);
            });
        });
    };
    Object.defineProperty(RwtAskDirective.prototype, "rwtAsk", {
        set: function (value) {
            this.text = value;
        },
        enumerable: true,
        configurable: true
    });
    return RwtAskDirective;
}());
__decorate([
    core_1.HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RwtAskDirective.prototype, "click", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtAskDirective.prototype, "rwtAsk", null);
RwtAskDirective = __decorate([
    core_1.Directive({
        // tslint:disable-next-line:directive-selector
        selector: '[rwtAsk]',
        // tslint:disable-next-line:use-output-property-decorator
        outputs: ['accept', 'reject'],
        inputs: ['rwtTitle']
    }),
    __metadata("design:paramtypes", [bootstrap_1.Modal])
], RwtAskDirective);
exports.RwtAskDirective = RwtAskDirective;
var RwtErrorHandlerComponent = (function (_super) {
    __extends(RwtErrorHandlerComponent, _super);
    function RwtErrorHandlerComponent(rwt, modal) {
        var _this = _super.call(this, rwt) || this;
        _this.modal = modal;
        _this.errors = [];
        _this.tracebacks = [];
        return _this;
    }
    RwtErrorHandlerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.on('error-json', function (error) {
            error.time = new Date();
            this.lastError = error;
            this.errors.push(error);
        }.bind(this));
        this.on('error-json-500', function (error) {
            error.time = new Date();
            _this.lastTrace = error;
            _this.tracebacks.push(error);
            _this.showLastTrace();
        });
    };
    RwtErrorHandlerComponent.prototype.showLastError = function () {
        this.showError(this.lastError);
    };
    RwtErrorHandlerComponent.prototype.showError = function (error) {
        this.modal.alert()
            .dialogClass('danger')
            .showClose(true)
            .title(error.time)
            .message(JSON.stringify(error))
            .open();
    };
    RwtErrorHandlerComponent.prototype.showLastTrace = function () {
        this.showTrace(this.lastTrace);
    };
    RwtErrorHandlerComponent.prototype.showTrace = function (error) {
        this.modal.alert()
            .dialogClass('danger')
            .showClose(true)
            .title('Exception ' + error.exception)
            .message('<pre>' + error.traceback.join('\n') + '</pre>')
            .open();
    };
    return RwtErrorHandlerComponent;
}(__1.RwtServed));
__decorate([
    core_1.ViewChild('modalError'),
    __metadata("design:type", Object)
], RwtErrorHandlerComponent.prototype, "modalError", void 0);
RwtErrorHandlerComponent = __decorate([
    core_1.Component({
        // tslint:disable-next-line:component-selector
        selector: 'rwt-error-handler',
        template: "\n    <template [ngIf]=\"tracebacks.length\">\n        <div class=\"btn btn-danger\" (click)=\"showLastTrace()\">\n            show last Traceback\n        </div>\n        <div class=\"btn btn-danger\" [rwtToggle]=\"{bindTo: this, attribute: 'showingTraces'}\" [class.active]=\"showingTraces\">\n            show all errors\n        </div>\n        <div class=\"card\" *ngIf=\"showingTraces\">\n            <ul class=\"list-group\">\n                <li class=\"list-group-item\" (click)=\"showError(error)\" *ngFor=\"let error of tracebacks\">\n                    {{ error.exception }}\n                </li>\n            </ul>\n        </div>\n    </template>\n    <template [ngIf]=\"errors.length\">\n        <div class=\"btn btn-secondary\" (click)=\"showLastError()\">\n            show last error\n        </div>\n        <div [class.active]=\"showingErrors\" class=\"btn btn-secondary\" [rwtToggle]=\"{bindTo: this, attribute: 'showingErrors'}\">\n            show all errors\n        </div>\n        <div class=\"card\" *ngIf=\"showingErrors\">\n            <ul class=\"list-group\">\n                <li class=\"list-group-item\" (click)=\"showError(error)\" *ngFor=\"let error of errors\">\n                    {{ error.time | date : 'dd/MM/yy hh:mm:ss'}}\n                </li>\n            </ul>\n        </div>\n    </template>\n  "
    }),
    __metadata("design:paramtypes", [__1.RwtService, bootstrap_1.Modal])
], RwtErrorHandlerComponent);
exports.RwtErrorHandlerComponent = RwtErrorHandlerComponent;
var RwtModalForm = (function (_super) {
    __extends(RwtModalForm, _super);
    function RwtModalForm(rwt, modal, cd) {
        var _this = _super.call(this, rwt, cd) || this;
        _this.modal = modal;
        return _this;
    }
    Object.defineProperty(RwtModalForm.prototype, "rwtModalForm", {
        set: function (value) {
            if (value.title) {
                this.title = value.title;
                delete value.title;
            }
            this.formConfig = value;
        },
        enumerable: true,
        configurable: true
    });
    RwtModalForm.prototype.click = function (evt) {
        var _this = this;
        this.modal.open(this.modalContent, angular2_modal_1.overlayConfigFactory({ isBlocking: false }, bootstrap_1.BSModalContext))
            .then(function (dialog) {
            _this.modalDialog = dialog;
            dialog.result.then(function (result) {
                console.log('result', result);
            });
        });
    };
    return RwtModalForm;
}(__1.RwtForm));
__decorate([
    core_1.ViewChild('modalContent'),
    __metadata("design:type", core_1.TemplateRef)
], RwtModalForm.prototype, "modalContent", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtModalForm.prototype, "rwtModalForm", null);
__decorate([
    core_1.HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RwtModalForm.prototype, "click", null);
RwtModalForm = __decorate([
    core_1.Component({
        selector: '[rwtModalForm]',
        exportAs: 'rwt-modal',
        template: "\n    <template #modalContent let-dialog=\"dialogRef\" let-ctx=\"dialogRef.context\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\" *ngIf=\"title\">\n                <h2>\n                    {{ title }}\n                    <button aria-label=\"Close\" class=\"close\" type=\"button\" (click)=\"dialog.close()\">\n                        <span aria-hidden=\"true\">\u00D7</span>\n                    </button>\n                </h2>\n            </div>\n            <div class=\"modal-body\">\n                <div class=\"table table-striped\"\n                    [rwtTableForm]=\"formConfig\" \n                    #form (sent)=\"dialog.close()\">\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <div class=\"btn btn-primary\"\n                    *ngIf=\"form.edit\"\n                    (click)=\"form.submit()\">\n                    Save\n                </div>\n                <div class=\"btn btn-outline-secondary\" (click)=\"dialog.close()\">\n                    Cancel\n                </div>\n            </div>\n        </div>\n    </template>\n    <div class=\"btn btn-default\">\n        <ng-content></ng-content>\n    </div>\n    "
    }),
    __metadata("design:paramtypes", [__1.RwtService, bootstrap_1.Modal, core_1.ChangeDetectorRef])
], RwtModalForm);
exports.RwtModalForm = RwtModalForm;
var ModalFormContentComponent = (function () {
    function ModalFormContentComponent(dialog) {
        this.dialog = dialog;
        this.ctx = dialog.context;
        this.dialog = dialog;
    }
    return ModalFormContentComponent;
}());
ModalFormContentComponent = __decorate([
    core_1.Component({
        selector: 'modalFormContent',
        encapsulation: core_1.ViewEncapsulation.None,
        template: "\n        <div class=\"modal-content\">\n            <div class=\"modal-header\" *ngIf=\"ctx.title\">\n                <h2>\n                    {{ ctx.title }}\n                    <button aria-label=\"Close\" class=\"close\" type=\"button\" (click)=\"dialog.close()\">\n                        <span aria-hidden=\"true\">\u00D7</span>\n                    </button>\n                </h2>\n            </div>\n            <div class=\"modal-body\">\n                <div class=\"table table-striped\"\n                    [rwtTableForm]=\"ctx.formConfig\" \n                    #form (sent)=\"dialog.close()\">\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <div class=\"btn btn-primary\"\n                    *ngIf=\"form.edit\"\n                    (click)=\"form.submit()\">\n                    Save\n                </div>\n                <div class=\"btn btn-outline-secondary\" (click)=\"dialog.close()\">\n                    Cancel\n                </div>\n            </div>\n        </div>\n    "
    }),
    __metadata("design:paramtypes", [angular2_modal_1.DialogRef])
], ModalFormContentComponent);
exports.ModalFormContentComponent = ModalFormContentComponent;
var RwtModalFormTableDirective = (function () {
    function RwtModalFormTableDirective(modal) {
        this.modal = modal;
    }
    RwtModalFormTableDirective.prototype.click = function (evt) {
        var _this = this;
        //    console.log('viewRef',this.viewRef);
        this.modal.open(ModalFormContentComponent, angular2_modal_1.overlayConfigFactory(this.context, bootstrap_1.BSModalContext))
            .then(function (dialog) {
            _this.dialog = dialog;
            _this.context.dialog = dialog;
        });
    };
    Object.defineProperty(RwtModalFormTableDirective.prototype, "rwtModalFormTable", {
        set: function (value) {
            var title = null;
            if (value.title) {
                title = value.title;
                delete value.title;
            }
            this.context = {
                formConfig: value,
            };
            if (title) {
                this.context.title = title;
            }
        },
        enumerable: true,
        configurable: true
    });
    return RwtModalFormTableDirective;
}());
__decorate([
    core_1.HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RwtModalFormTableDirective.prototype, "click", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtModalFormTableDirective.prototype, "rwtModalFormTable", null);
RwtModalFormTableDirective = __decorate([
    core_1.Directive({
        // tslint:disable-next-line:directive-selector
        selector: '[rwtModalFormTable]',
    }),
    __metadata("design:paramtypes", [bootstrap_1.Modal])
], RwtModalFormTableDirective);
exports.RwtModalFormTableDirective = RwtModalFormTableDirective;
var RwtModalFormDirective = (function () {
    function RwtModalFormDirective(dialog) {
        this.dialog = dialog;
        this.ctx = dialog.context;
    }
    return RwtModalFormDirective;
}());
RwtModalFormDirective = __decorate([
    core_1.Directive({
        selector: '[rwtModalForm]'
    }),
    __metadata("design:paramtypes", [angular2_modal_1.DialogRef])
], RwtModalFormDirective);
exports.RwtModalFormDirective = RwtModalFormDirective;
//# sourceMappingURL=rwt-modals.js.map