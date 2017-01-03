import { Component, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';
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
    @Input() zoom: any;

    private scaleLine: Date[];
    private zoomLevel: string;

    constructor(private ganttService: GanttService) {}

    ngOnInit() {
        this.drawScale(this.scale.start, this.scale.end);

        this.zoom.subscribe((zoomLevel: string) => {
            this.zoomLevel = zoomLevel;                        
        });;
    }

    private setTimescaleStyle() {
        return {
            'width': this.dimensions.width + 'px'
        };
    }

    private setTimescaleLineStyle(borderTop: string) {
        return {
            'height': this.ganttService.rowHeight + 'px',
            'line-height': this.ganttService.rowHeight + 'px',
            'position': 'relative',
            'border-top': borderTop
        };
    }

    //TODO(dale): this should be read from gantt config
    private setTimescaleCellStyle() {
        var width = this.ganttService.cellWidth;

        if(this.zoomLevel === 'hours') {
            width = 20 * 24 + 15;
        }

        return {
            'width': width + 'px'
        };
    }

    private drawScale(start: Date, end: Date): void {
        this.scaleLine = this.ganttService.calculateScale(start, end);
    }

    private isDayWeekend(date: Date): boolean {
        return this.ganttService.isDayWeekend(date);
    }

    private getHours(): string[] {
        return this.ganttService.getHours(this.scaleLine.length);
    }
}