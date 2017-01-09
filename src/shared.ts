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
  public types: any;
  public endPoint: string;
  public loginFunction: Function;
}

