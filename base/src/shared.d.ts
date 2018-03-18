import { Component, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
export declare function createComponentFactory(resolver: ComponentFactoryResolver, metadata: Component): ComponentFactory<any>;
export interface IRwtModuleConfig {
    endPoint: string;
    loginFunction?: Function;
}
export declare class RwtModuleConfig implements IRwtModuleConfig {
    /**
     * type dicts
     */
    types: any;
    /**
     * Primary rwt endPoint
     */
    endPoint: string;
    /**
     * A login function
     */
    loginFunction: Function;
}
export interface IError {
    /**
     * Exception caught by server
     */
    exception: string;
    /**
     * All traceback from server
     */
    traceback: string[];
    /**
     * when error occurred
     */
    time: Date;
}
