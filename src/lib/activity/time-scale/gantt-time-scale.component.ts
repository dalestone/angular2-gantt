import { Component, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';
import { Zooming } from '../../shared/interfaces';

@Component({
    selector: 'time-scale',
    template: `
        <div class="time_scale" [ngStyle]="setTimescaleStyle()">
            <div class="time_scale_line" [ngStyle]="setTimescaleLineStyle('none')">
                @for (date of timeScale; track date.getTime()) {
                <div class="time_scale_cell" [ngStyle]="setTimescaleCellStyle()" [ngClass]="(isDayWeekend(date)) ? 'weekend' : ''">{{date | date: 'dd-MM-yyyy'}}</div>
                }
            </div>
            @if (zoomLevel === 'hours') {
            <div class="time_scale_line" [ngStyle]="setTimescaleLineStyle('1px solid #cecece')">
                @for (hour of getHours(); track $index) {
                <div class="time_scale_cell" [ngStyle]="setHourCellStyle()">{{hour}}</div>
                }
            </div>
            }
        </div>`,
    styles: [`
        .weekend {
            background-color: #f8fafc;
        }

        .time_scale {
            font-size: 12px;
            border-bottom: 1px solid var(--gantt-border-soft);
            background-color: var(--gantt-surface);
            color: var(--gantt-text-muted);
            font-weight: 600;
        }

        .time_scale_line {
            box-sizing: border-box;
        }

        .time_scale_line:first-child {
            border-top: none;
        }

        .time_scale_cell {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            border-right: 1px solid var(--gantt-border-soft);
            text-align: center;
            height: 100%;
            box-sizing: border-box;
        }`
    ],
    providers: [
        GanttService
    ],
    standalone: false
})
export class GanttTimeScaleComponent implements OnInit {
    @Input() timeScale: any;
    @Input() dimensions: any;
    @Input() zoom: any;
    @Input() zoomLevel: any;
    @Input() timelineZoom: number = 1;

    constructor(public ganttService: GanttService) { }

    ngOnInit() {
        this.zoom.subscribe((zoomLevel: string) => {
            this.zoomLevel = zoomLevel;                        
        });;
    }

    public setTimescaleStyle() {
        return {
            'width': this.dimensions.width + 'px'
        };
    }

    public setTimescaleLineStyle(borderTop: string) {
        return {
            'height': this.ganttService.rowHeight + 'px',
            'line-height': this.ganttService.rowHeight + 'px',
            'position': 'relative',
            'border-top': borderTop
        };
    }

    public setTimescaleCellStyle() {
        var width = this.ganttService.cellWidth;
        var hoursInDay = 24;
        var hourSeperatorPixels = 23; // we don't include the first 

        if(this.zoomLevel ===  Zooming[Zooming.hours]) {
            width = this.ganttService.hourCellWidth * hoursInDay + hourSeperatorPixels; 
        }

        return {            
            'width': Math.round(width * this.timelineZoom) + 'px'
        };
    }

    public setHourCellStyle() {
        return {
            'width': Math.round(this.ganttService.hourCellWidth * this.timelineZoom) + 'px'
        };
    }

    public isDayWeekend(date: Date): boolean {
        return this.ganttService.isDayWeekend(date);
    }

    public getHours(): string[] {
        return this.ganttService.getHours(this.timeScale.length);
    }
}
