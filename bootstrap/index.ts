import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { RwtAskDirective, RwtErrorHandlerComponent, RwtModalFormDirective,
    RwtModalFormTableDirective, ModalFormContentComponent } from './src/rwt-modals';
import { RwtTableFormComponent } from './src/rwt-form.component';
import { RwtModule, IRwtModuleConfig } from '../base';


@NgModule({
    entryComponents: [
        ModalFormContentComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RwtModule,
        ModalModule.forRoot(),
        BootstrapModalModule,
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
export class RwtBootstrapModule { }
