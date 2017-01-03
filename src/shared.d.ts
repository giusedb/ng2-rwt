import { Component, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
export declare function createComponentFactory(resolver: ComponentFactoryResolver, metadata: Component): ComponentFactory<any>;
export interface IRwtModuleConfig {
    endPoint: string;
    loginFunction?: Function;
    types?: {
        integer?: string;
    };
}
export declare class RwtModuleConfig implements IRwtModuleConfig {
    types: any;
    endPoint: string;
    loginFunction: Function;
}
