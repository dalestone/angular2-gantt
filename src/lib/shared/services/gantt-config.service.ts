import { Injectable } from '@angular/core';

@Injectable()
export class GanttConfig {
    public cellWidth: number = 88;
    public rowHeight: number = 30;
    public activityHeight: number = 360;
    public barHeight = 18;
    public barLineHeight = 18;
    public barMoveable = false;
}
