import { Component, ComponentFactory, ComponentFactoryResolver } from '@angular/core';

export function createComponentFactory(resolver: ComponentFactoryResolver, metadata: Component): ComponentFactory<any> {
    const cmpClass = class DynamicComponent {};
    const decoratedCmp = Component(metadata)(cmpClass);
    return resolver.resolveComponentFactory(decoratedCmp);
}

export interface IRwtModuleConfig {
  endPoint: string;
  loginFunction?: Function;
}


export class RwtModuleConfig implements IRwtModuleConfig {
  /**
   * type dicts
   */
  public types: any;
  /**
   * Primary rwt endPoint
   */
  public endPoint: string;
  /**
   * A login function
   */
  public loginFunction: Function;
}

export interface IError {
  /**
   * Exception caught by server
   */
  exception: string;
  /**
   * All traceback from server
   */
  traceBack: string[];
  /**
   * when error occurred
   */
  time: Date;
}