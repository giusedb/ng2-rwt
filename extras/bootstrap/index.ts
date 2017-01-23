import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { RwtAskDirective, RwtErrorHandlerComponent, RwtModalFormDirective, 
    RwtModalFormTableDirective, ModalFormContentComponent } from './rwt-modals';
import { RwtTableFormComponent } from './rwt-form.component';
import { RwtModule } from '../..';


@NgModule({
    entryComponents: [
        ModalFormContentComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        BootstrapModalModule,
        RwtModule,
    ],
    exports: [
        RwtAskDirective,
        RwtErrorHandlerComponent,
        RwtModalFormDirective,
        RwtModalFormTableDirective,
        RwtTableFormComponent,
    ],
    declarations: [
        RwtAskDirective,
        RwtErrorHandlerComponent,
        RwtModalFormDirective,
        RwtModalFormTableDirective,
        RwtTableFormComponent,
        ModalFormContentComponent,
    ],
})
export class RwtBootstrapModule {
    public static forRoot() {
        return {
            ngModule: RwtBootstrapModule,
        };
    }
}
