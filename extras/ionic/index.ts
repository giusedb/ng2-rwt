import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RwtModule } from '../..';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RwtModule,
    ],
    exports: [
        RwtAskDirective,
        RwtErrorHandlerComponent,
        RwtModalForm,
        RwtTableFormComponent,
    ],
    declarations: [
        RwtAskDirective,
        RwtErrorHandlerComponent,
        RwtModalForm,
        RwtTableFormComponent,
    ],
})
export class RwtBootstrapModule {
    public static forRoot() {
        return {
            ngModule: RwtBootstrapModule,
        };
    }
}
