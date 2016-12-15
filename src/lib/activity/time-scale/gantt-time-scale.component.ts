import { Component, OnInit, Input } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';

@Component({
    selector: 'time-scale',
    templateUrl: './gantt-time-scale.component.html',
    styleUrls: ['./gantt-time-scale.component.css'],
    providers: [
        GanttService
    ]
})
export class GanttTimeScaleComponent implements OnInit {
    @Input() scale: any;
    @Input() dimensions: any;

    private scaleLine: Date[];

    constructor(private ganttService: GanttService) { }

    ngOnInit() {
        this.drawScale(this.scale.start, this.scale.end);
    }

    private setTimescaleStyle() {
        return {
            'width': this.dimensions.width + 'px'
        };
    }

    private setTimescaleLineStyle() {
        return {
            'height': this.ganttService.rowHeight + 'px',
            'line-height': this.ganttService.rowHeight + 'px',
            'position': 'relative'
        };
    }

    private setTimescaleCellStyle() {
        return { 
            'width': this.ganttService.cellWidth + 'px' 
        };
    }

    private drawScale(start: Date, end: Date): void {
        this.scaleLine = this.ganttService.calculateScale(start, end);
    }

    private isDayWeekend(date: Date): boolean {
        return this.ganttService.isDayWeekend(date);
    }
}