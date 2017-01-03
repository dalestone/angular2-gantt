import { Injectable } from '@angular/core';

@Injectable()
export class GanttConfig {
    public cellWidth: number = 76;
    public rowHeight: number = 25;
    public activityHeight: number = 300;
    public barHeight = 20;
    public barLineHeight = 20;
    public barMoveable = false;
}
