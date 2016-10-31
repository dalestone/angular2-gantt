import { NgModule } from '@angular/core';
import { GanttActivityComponent } from './gantt-activity.component';
import { GanttTimeScaleComponent } from './time-scale/gantt-time-scale.component';
import { GanttActivityBackgroundComponent } from './background/activity-background.component';
import { GanttActivityBarsComponent } from './bars/activity-bars.component';

@NgModule({
    imports: [],
    exports: [],
    declarations: [
        GanttActivityComponent,
        GanttTimeScaleComponent,
        GanttActivityBackgroundComponent,
        GanttActivityBarsComponent
    ],
    providers: [],
})
export class GanttActivityModule { }
