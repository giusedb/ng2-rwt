import { NgModule, ModuleWithProviders, Component, Type, NgModuleFactory, Injector,  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RwtService } from "./src/rwt.service";
import { RwtModuleConfig, IRwtModuleConfig } from "./src/shared";
import { RwtDataComponent } from "./src/rwt-data.component";
import { RwtToggleDirective, RwtSetDirective } from "./src/rwt-toggle.directive";
import { RwtSelectableDirective } from "./src/rwt-selectable.directive";
import { RwtSelectionOutletComponent, RwtSelectionOutletDirective } from "./src/rwt-selection-outlet.component";
import { RwtFormInlineComponent, RwtFeModelComponent, createFeModel, /*RwtFormTemplateComponent*/ } from "./src/rwt-form.component";
import { RwtMultiselectableDirective } from "./src/rwt-multiselectable.directive";
import { RwtMultiselectionOutletComponent } from "./src/rwt-multiselection-outlet.component";

export * from "./src/rwt.service";
export * from "./src/shared";
export * from "./src/rwt-data.component";
export * from "./src/rwt-selectable.directive";
export * from "./src/rwt-selection-outlet.component";
export * from "./src/rwt-toggle.directive";
export * from "./src/rwt-multiselection-outlet.component";
export * from "./src/rwt-multiselectable.directive";
export * from "./src/rwt-form.component";

let extraModules = [];
// demo only

import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
extraModules.push(NKDatetimeModule);

// demo

let baseImports = [
  CommonModule,
  FormsModule,
];

let moduleDef: NgModule = {
  imports: baseImports.concat(extraModules),
  declarations: [
    RwtDataComponent,
    RwtToggleDirective,
    RwtSelectableDirective,
    RwtSelectionOutletComponent,
    RwtSelectableDirective,
    RwtFormInlineComponent,
    RwtMultiselectableDirective,
    RwtMultiselectionOutletComponent,
    RwtFeModelComponent,
    RwtSelectionOutletDirective,
    RwtSetDirective,
    /*RwtFormTemplateComponent*/
  ],
  exports: [RwtDataComponent,
    RwtToggleDirective,
    RwtSelectableDirective,
    RwtSelectionOutletComponent,
    RwtSelectableDirective,
    RwtFormInlineComponent,
    RwtMultiselectableDirective,
    RwtMultiselectionOutletComponent,
    RwtFeModelComponent,
    RwtSelectionOutletDirective,
    RwtSetDirective,
    /*RwtFormTemplateComponent*/
  ],
  providers: [ RwtService ]
};

@NgModule(moduleDef)
export class RwtModule {
  // tslint:disable-next-line:no-shadowed-variable
/*  public static forRoot(config: IRwtModuleConfig, extraModules: Array<any>): ModuleWithProviders {
    return {
      ngModule: RwtModule,
      providers: [
        {provide: RwtModuleConfig, useValue: config },
        RwtService,
      ]
    };
  }
  public static forRoot(extraModules: NgModule[] = []): ModuleWithProviders {
    return {
      ngModule: createModule(extraModules),
    };
  }
*/
};

export function createModule (extraModules: NgModule[] = []): Type<NgModule> {
  moduleDef.imports = moduleDef.imports.concat(extraModules);
  @NgModule(moduleDef)
  class RWT { }
  return RWT;
}
