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
    @Input() zoom: string;

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

    private setTimescaleLineStyle(borderTop:string) {
        return {
            'height': this.ganttService.rowHeight + 'px',
            'line-height': this.ganttService.rowHeight + 'px',
            'position': 'relative',
            'border-top': borderTop
        };
    }

    private setTimescaleCellStyle() {
        return { 
            'width': 855 + 'px' 
        };
    }

    private drawScale(start: Date, end: Date): void {
        this.scaleLine = this.ganttService.calculateScale(start, end);
    }

    private isDayWeekend(date: Date): boolean {
        return this.ganttService.isDayWeekend(date);
    }

    private getHours() : string[] {
        var hours:string[] = [];

        while(hours.length <= this.scaleLine.length * 24) {
            for (var i = 0; i <= 23; i++) {
                if (i < 10) {
                    hours.push('0' + i.toString());
                } else {
                    hours.push(i.toString());
                }
            }
        }

        return hours;
    }
}