import { ModuleWithProviders } from '@angular/core';
import { IRwtModuleConfig } from './src/shared';
export * from './src/rwt.service';
export * from './src/shared';
export * from './src/rwt-data.component';
export * from './src/rwt-selectable.directive';
export * from './src/rwt-selection-outlet.component';
export * from './src/rwt-toggle.directive';
export * from './src/rwt-multiselection-outlet.component';
export * from './src/rwt-multiselectable.directive';
export declare class RwtModule {
    static forRoot(config: IRwtModuleConfig): ModuleWithProviders;
}
