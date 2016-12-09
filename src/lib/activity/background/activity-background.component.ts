import { Component, OnInit, Input } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';

@Component({
    selector: 'activity-background',
    templateUrl: './activity-background.component.html',
    styleUrls: [ './activity-background.component.css' ]
})
export class GanttActivityBackgroundComponent implements OnInit {
    @Input() scale:any;
    @Input() grid:any;
    @Input() dimensions:any;

    private containerHeight:any;
    private containerWidth:any;
    private rows:any[] = [];
    private cells:any[] = [];
    private cellWidth:any;

    constructor(private ganttService: GanttService) {
        this.cellWidth = ganttService.cellWidth;
    }

    ngOnInit() {
        this.drawGrid();
    }

    isDayWeekend(date: Date): boolean {
        return this.ganttService.isDayWeekend(date);
    }

    private drawGrid(): void {
        this.rows = new Array(this.grid.rows);
        this.cells = this.grid.cells.dates;
        this.containerHeight = this.dimensions.height;
        this.containerWidth = this.dimensions.width;
    }
}
