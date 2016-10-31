import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent }   from './app.component';
import { GanttModule } from './gantt/gantt.module';

@NgModule({
    imports: [
        CommonModule, 
        GanttModule
    ],
    exports: [],
    declarations: [
    ],
    providers: [],
})
export class AppModule { }
