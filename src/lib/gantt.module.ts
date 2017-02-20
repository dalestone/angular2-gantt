import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GanttComponent } from './gantt.component';
import { GanttHeaderComponent } from './header/gantt-header.component';
import { GanttFooterComponent } from './footer/gantt-footer.component';
import { GanttService } from './shared/services/gantt.service';
import { GanttActivityModule } from './activity/gantt-activity.module';

import { GroupByPipe } from './shared/pipes/groupBy.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GanttActivityModule,
    ],
    exports: [
        GanttComponent
    ],
    declarations: [
        GanttComponent,
        GanttHeaderComponent,
        GanttFooterComponent,  
        GroupByPipe      
    ],
    providers: [GanttService],
})
export class GanttModule { }