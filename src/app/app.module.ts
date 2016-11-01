import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }   from './app.component';
import { GanttModule } from './gantt/gantt.module';

@NgModule({
    imports: [
        BrowserModule,
        GanttModule
    ],
    exports: [],
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
