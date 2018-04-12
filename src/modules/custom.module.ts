import { NgModule } from '@angular/core';
import { SgNotificationComponent, SgNotificationService } from '../components';
import {
    MatIconModule
} from '@angular/material';

@NgModule({
    declarations: [
        SgNotificationComponent
    ],
    imports: [
        MatIconModule
    ], // modules needed to run this module
    exports: [
        SgNotificationComponent
    ],
    providers: [
        SgNotificationService
    ], // additional providers needed for this module
    entryComponents: [
        SgNotificationComponent
    ]
})
export class CustomModule { }
