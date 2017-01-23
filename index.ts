import { NgModule, ModuleWithProviders, Component, Type } from "@angular/core";
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

export function getImports(extraModules: Array<any>): Array<any> {
  let baseImports = [
    CommonModule,
    FormsModule,
  ];
  if (extraModules) {
    Array.prototype.push.apply(baseImports, extraModules);
  }
  return baseImports;
}

export function createModule(extraModules?: Array<any>): Type<any> | ModuleWithProviders | any {
  @NgModule({
    imports: getImports(extraModules),
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
  })
  class RwtModule {
    // tslint:disable-next-line:no-shadowed-variable
    public static forRoot(config: IRwtModuleConfig, extraModules: Array<any>): ModuleWithProviders {
      if (extraModules) {
        return createModule(extraModules).forRoot(config);
      }
      return {
        ngModule: RwtModule,
        providers: [
          {provide: RwtModuleConfig, useValue: config },
          RwtService,
        ]
      };
    }
  }
  return RwtModule;
}
export let RwtModule = createModule();
console.log("RwtModule created");
