import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DemoAppComponent }   from './demo-app.component';
//import { GanttModule  } from 'ng2-gantt';
import { GanttModule } from '../lib'

@NgModule({
    imports: [
        BrowserModule,
        GanttModule
    ],
    exports: [],
    declarations: [
        DemoAppComponent
    ],
    providers: [],
    bootstrap: [DemoAppComponent]
})
export class DemoAppModule { }
