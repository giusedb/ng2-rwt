import { NgModule, ModuleWithProviders, Component, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RwtService } from './rwt.service';
import { RwtModuleConfig, IRwtModuleConfig } from './shared';
import { RwtDataComponent } from './rwt-data.component';
import { RwtToggleDirective } from './rwt-toggle.directive';
import { RwtSelectableDirective } from './rwt-selectable.directive';
import { RwtSelectionOutletComponent } from './rwt-selection-outlet.component';
import { RwtFormInlineComponent, createFeModel /*RwtFormTemplateComponent*/ } from './rwt-form.component';
import { RwtMultiselectableDirective } from './rwt-multiselectable.directive';
import { RwtMultiselectionOutletComponent } from './rwt-multiselection-outlet.component';

export const RwtFeModelComponent: Type<any> = createFeModel({});

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    RwtDataComponent, 
    RwtToggleDirective, 
    RwtSelectableDirective, 
    RwtSelectionOutletComponent, 
    RwtFormInlineComponent, 
    RwtMultiselectableDirective, 
    RwtMultiselectionOutletComponent,
    RwtFeModelComponent,
    /*RwtFormTemplateComponent*/
  ],
  providers: [RwtService],
  exports: [RwtDataComponent, 
    RwtToggleDirective, 
    RwtSelectableDirective, 
    RwtSelectionOutletComponent, 
    RwtFormInlineComponent, 
    RwtMultiselectableDirective, 
    RwtMultiselectionOutletComponent,
    /*RwtFormTemplateComponent*/
  ],
})
export class RwtModule { 
  public static forRoot(config: IRwtModuleConfig): ModuleWithProviders {
    return {
      ngModule: RwtModule,
      providers: [
        {provide: RwtModuleConfig, useValue: config }
      ]
    }
  }
}
