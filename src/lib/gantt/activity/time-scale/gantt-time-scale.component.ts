import { Component, OnInit, Input } from '@angular/core';
import { GanttService } from '../../services/gantt.service';

@Component({
    selector: 'time-scale',
    templateUrl: './gantt-time-scale.component.html',
    styleUrls: [ './gantt-time-scale.component.css' ],
    providers: [
        GanttService
    ]
})
export class GanttTimeScaleComponent implements OnInit {
    @Input() scale;
    @Input() dimensions;
        
    private scaleLine: Date[];
    private cellWidth = 0;
    
    constructor(private ganttService: GanttService) { 
        this.cellWidth = ganttService.cellWidth;
    }

    ngOnInit() {                
        this.drawScale(this.scale.start, this.scale.end);
    }
    
    private drawScale(start: Date, end: Date): void {
        this.scaleLine = this.ganttService.calculateScale(start, end);
    }

    private isDayWeekend(date: Date): boolean {                
        return this.ganttService.isDayWeekend(date);
    }
}