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
var core_1 = require("@angular/core");
var rwt_service_1 = require("./rwt.service");
var RwtDataComponent = (function () {
    function RwtDataComponent(rwt, cd) {
        this.persistentAttributes = [];
        this.items = [];
        this.orm = rwt.orm;
        this.select = rwt.select.bind(rwt);
        this.gotDataEventHandler = this.orm.on('got-data', function () {
            cd.detectChanges();
        });
    }
    /**
     * Fetches needed dat from server
     */
    RwtDataComponent.prototype.fetch = function () {
        var ths = this;
        this.orm.get(this.resource, this.filter).then(function (items) {
            ths.items = items;
        });
    };
    /**
     * Called when items are updated
     * It understand if items are showables or not and remove or add items to this view
     */
    RwtDataComponent.prototype.onUpdateItems = function (items) {
        console.log('update:', items);
    };
    /**
     * Called when new items marked as deleted
     * It delete items
     */
    RwtDataComponent.prototype.onDeleteItems = function (items) {
        console.log('delete', items);
        var itms = Lazy(items);
        this.items = this.items.filter(function (x) { return !itms.contains(x.id); });
    };
    /**
     * Called when new items are fetched from client
     * It adds items to the view according with filters
     */
    RwtDataComponent.prototype.onNewItems = function (items) {
        console.log('new', items);
        // adding all items who pass filter selection
        Array.prototype.push.apply(this.items, items.filter(this.filterFunction).toArray());
    };
    Object.defineProperty(RwtDataComponent.prototype, "rwtData", {
        /**
         * main initialize funcion
         */
        set: function (value) {
            console.log(value);
            if ('resource' in value) {
                this.resource = value['resource'];
                if (value['filter']) {
                    this.filter = value['filter'];
                }
                else {
                    this.filter = {};
                }
                if ('persistentAttributes' in value) {
                    this.orm.addPersistentAttributes(value.resource, value.persistentAttributes);
                }
                this.fetch();
            }
            if (value.filter) {
                this.orm.getModel(this.resource).then(function (model) {
                    this.filterFunction = this.orm.utils.makeFilter(model, this.filter);
                }.bind(this));
            }
            else {
                this.filterFunction = Boolean;
            }
            // if I have a filter i have to unregister it from eventMangers
            if (this.updateFilterHandler) {
                this.orm.unbind(this.updateFilterHandler);
            }
            if (this.deleteFilterHandler) {
                this.orm.unbind(this.deleteFilterHandler);
            }
            if (this.newFilterHandler) {
                this.orm.unbind(this.newFilterHandler);
            }
            // and then relink it to new function
            this.newFilterHandler = this.orm.on('new-' + this.resource, this.onNewItems.bind(this));
            this.updateFilterHandler = this.orm.on('updated-' + this.resource, this.onUpdateItems.bind(this));
            this.deleteFilterHandler = this.orm.on('deleted-' + this.resource, this.onDeleteItems.bind(this));
        },
        enumerable: true,
        configurable: true
    });
    RwtDataComponent.prototype.ngOnInit = function () {
    };
    RwtDataComponent.prototype.ngOnDestroy = function () {
        this.orm.unbind(this.gotDataEventHandler);
    };
    return RwtDataComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], RwtDataComponent.prototype, "rwtData", null);
RwtDataComponent = __decorate([
    core_1.Component({
        // tslint:disable-next-line:component-selector
        selector: '[rwtData]',
        template: '<ng-content></ng-content>',
        exportAs: 'rwt-data',
    }),
    __metadata("design:paramtypes", [rwt_service_1.RwtService, core_1.ChangeDetectorRef])
], RwtDataComponent);
exports.RwtDataComponent = RwtDataComponent;
//# sourceMappingURL=rwt-data.component.js.map