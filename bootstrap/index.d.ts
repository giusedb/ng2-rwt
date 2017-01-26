import { ModuleWithProviders, Type } from '@angular/core';
import { IRwtModuleConfig } from '../base';
export declare function getImports(config: IRwtModuleConfig, extraModules: Array<any>): Array<any>;
export declare function createModule(config: IRwtModuleConfig, dependencies?: any[]): Type<any> | ModuleWithProviders | any;
export declare let RwtBootstrapModule: any;
