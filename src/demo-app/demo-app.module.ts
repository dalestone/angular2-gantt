import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { DemoAppComponent }   from './demo-app.component';
//import { GanttModule  } from 'ng2-gantt';
import { GanttModule } from '../lib'

// import { TreeModule } from 'angular2-tree-component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        GanttModule,
        // TreeModule
    ],
    exports: [],
    declarations: [
        DemoAppComponent,
    ],
    providers: [],
    bootstrap: [DemoAppComponent]
})
export class DemoAppModule { }
