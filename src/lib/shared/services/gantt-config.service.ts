import { Injectable } from '@angular/core';

@Injectable()
export class GanttConfig {
    public cellWidth: number = 76;
    public rowHeight: number = 35;
    public activityHeight: number = 300;
    public barHeight = 30;
    public barLineHeight = 30;
    public barMoveable = false;
}