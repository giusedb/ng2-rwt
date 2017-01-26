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
var shared_1 = require("./shared");
if (!window) {
    // tslint:disable-next-line:no-shadowed-variable
    var window_1 = this;
}
var RwtService = (function () {
    function RwtService(config, app) {
        this.app = app;
        this.singleSelections = {};
        this.multiSelections = {};
        this.persistentSelections = {};
        var orm = this.orm = new rwt(config.endPoint, config.loginFunction);
        window.orm = orm;
        orm.on('got-data', function () {
            app.tick();
        });
        this.on = orm.on.bind(orm);
        this.get = orm.get.bind(orm);
        this.emit = orm.emit.bind(orm);
        this.unbind = orm.unbind.bind(orm);
        orm.unbind(orm.$orm.validationEvent);
    }
    RwtService.prototype.select = function (obj) {
        var resource = obj.constructor.modelName;
        if (this.singleSelections[resource]) {
            this.emit('unselected-' + resource, this.singleSelections[resource]);
        }
        this.singleSelections[resource] = obj;
        this.emit('selected-' + resource, obj);
        if (resource in this.persistentSelections) {
            this.savePersistent(resource, obj.id);
        }
        this.app.tick();
    };
    RwtService.prototype.savePersistent = function (resource, value) {
        localStorage['pS:' + resource] = value;
    };
    RwtService.prototype.makePersistentSelection = function (resource) {
        this.persistentSelections[resource] = true;
    };
    RwtService.prototype.getSelectionFor = function (resource) {
        if (resource in this.singleSelections) {
            return this.singleSelections[resource];
        }
        var key = 'pS:' + resource;
        if (key in localStorage) {
            var self_1 = this;
            // tslint:disable-next-line:radix
            var ids = parseInt(localStorage[key]);
            this.orm.get(resource, ids).then(function (item) {
                if (item) {
                    self_1.select(item);
                }
            });
        }
        return null;
    };
    RwtService.prototype.toggleMulti = function (name, obj) {
        if (!(name in this.multiSelections)) {
            this.multiSelections[name] = {};
        }
        if (obj.id in this.multiSelections[name]) {
            delete this.multiSelections[name][obj.id];
            obj.$multiselected = false;
        }
        else {
            this.multiSelections[name][obj.id] = obj;
            obj.$multiselected = true;
        }
        this.emit('update-multiselection-' + name, this.getMultiSelection(name));
    };
    RwtService.prototype.selectMulti = function (name, obj) {
        if (!(name in this.multiSelections)) {
            this.multiSelections[name] = {};
        }
        this.multiSelections[name][obj.id] = obj;
        obj.$multiselected = true;
        this.emit('update-multiselection-' + name, this.getMultiSelection(name));
    };
    RwtService.prototype.unSelectMulti = function (name, obj) {
        if (!(name in this.multiSelections)) {
            this.multiSelections[name] = {};
        }
        if (obj.id in this.multiSelections[name]) {
            delete this.multiSelections[name][obj.id];
            obj.$multiselected = false;
        }
        this.emit('update-multiselection-' + name, this.getMultiSelection(name));
    };
    RwtService.prototype.getMultiSelection = function (name) {
        return Lazy(this.multiSelections[name]).values().toArray();
    };
    return RwtService;
}());
RwtService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [shared_1.RwtModuleConfig, core_1.ApplicationRef])
], RwtService);
exports.RwtService = RwtService;
var RwtServed = (function () {
    // tslint:disable-next-line:no-shadowed-variable
    function RwtServed(rwt) {
        this.rwt = rwt;
        this.eventHandlers = [];
        this.waiting = false;
    }
    RwtServed.prototype.on = function (eventName, eventHandler) {
        this.eventHandlers.push(this.rwt.on(eventName, eventHandler));
    };
    RwtServed.prototype.ngOnDestroy = function () {
        this.eventHandlers.forEach(this.rwt.unbind);
    };
    return RwtServed;
}());
exports.RwtServed = RwtServed;
//# sourceMappingURL=rwt.service.js.map