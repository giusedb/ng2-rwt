import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Overlay } from 'angular2-modal';
import { VexModalModule } from 'angular2-modal/plugins/vex';
import { RwtAskDirective } from './rwt-modals';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        VexModalModule,
    ],
    exports: [
        RwtAskDirective
    ],
    declarations: [
        RwtAskDirective
    ],
})
export class RwtBootstrapModule {
    public static forRoot() {
        return {
            ngModule: RwtBootstrapModule,
        };
    }
}
