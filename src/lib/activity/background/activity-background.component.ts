import { Component, OnInit, Input } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';

@Component({
    selector: 'activity-background',
    templateUrl: './activity-background.component.html',
    styleUrls: ['./activity-background.component.css']
})
export class GanttActivityBackgroundComponent implements OnInit {
    @Input() scale: any;
    @Input() grid: any;
    @Input() dimensions: any;

    private containerHeight: any;
    private containerWidth: any;
    private rows: any[] = [];
    private cells: any[] = [];

    constructor(private ganttService: GanttService) { }

    ngOnInit() {
        this.drawGrid();
    }

    isDayWeekend(date: Date): boolean {
        return this.ganttService.isDayWeekend(date);
    }

    private setBackgroundStyle() {
        return {
            'height': this.containerHeight + 'px',
            'width': this.containerWidth + 'px'
        };
    }

    private setRowStyle() {
        return {
            'height': this.ganttService.rowHeight + 'px'            
        };
    }

    private setCellStyle() {
        return {
            'width': this.ganttService.cellWidth + 'px'
        };
    }

    private drawGrid(): void {
        this.rows = new Array(this.grid.rows);
        this.cells = this.grid.cells.dates;
        this.containerHeight = this.dimensions.height;
        this.containerWidth = this.dimensions.width;
    }
}
