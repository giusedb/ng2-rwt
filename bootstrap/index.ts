import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { RwtAskDirective, RwtErrorHandlerComponent, RwtModalFormDirective,
    RwtModalFormTableDirective, ModalFormContentComponent } from './src/rwt-modals';
import { RwtTableFormComponent } from './src/rwt-form.component';
import { RwtModule, IRwtModuleConfig } from '../base';

export function getImports(config: IRwtModuleConfig, extraModules: Array<any>): Array<any> {
  let baseImports = [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    RwtModule.forRoot(config, extraModules),
  ];
  Array.prototype.push.apply(baseImports, extraModules);
  return baseImports;
}

export function createModule(config: IRwtModuleConfig, dependencies?: any[]): Type<any> | ModuleWithProviders | any {
    @NgModule({
        entryComponents: [
            ModalFormContentComponent,
        ],
        imports: [
            CommonModule,
            FormsModule,
            ModalModule.forRoot(),
            BootstrapModalModule,
//            RwtModule.forRoot(config, dependencies),
                ],
        exports: [
            RwtAskDirective,
            RwtErrorHandlerComponent,
            RwtModalFormDirective,
            RwtModalFormTableDirective,
            RwtTableFormComponent,
            RwtModule,
        ].concat(dependencies),
        declarations: [
            RwtAskDirective,
            RwtErrorHandlerComponent,
            RwtModalFormDirective,
            RwtModalFormTableDirective,
            RwtTableFormComponent,
            ModalFormContentComponent,
        ],
    })
    class RwtBootstrapModule {
        public static forRoot(config: IRwtModuleConfig, dependencies?: Array<any>) {
            if (dependencies) {
                return createModule(config, dependencies).forRoot(config);
            }
            return {
                ngModule: RwtBootstrapModule,
            };
        }
    }
    return RwtBootstrapModule;
}
export let RwtBootstrapModule = createModule(null);
