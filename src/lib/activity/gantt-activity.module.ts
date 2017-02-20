import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GanttActivityComponent } from './gantt-activity.component';
import { GanttTimeScaleComponent } from './time-scale/gantt-time-scale.component';
import { GanttActivityBackgroundComponent } from './background/activity-background.component';
import { GanttActivityBarsComponent } from './bars/activity-bars.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        GanttActivityComponent,
        GanttTimeScaleComponent,
        GanttActivityBackgroundComponent,
        GanttActivityBarsComponent
    ],
    declarations: [
        GanttActivityComponent,
        GanttTimeScaleComponent,
        GanttActivityBackgroundComponent,
        GanttActivityBarsComponent,
        ///TreeBuilder, TreeParentRepeater, TreeChildrenRepeater,
    ],
    providers: [],
})
export class GanttActivityModule { }
