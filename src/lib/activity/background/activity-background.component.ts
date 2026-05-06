import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';
import { Zooming } from '../../shared/interfaces';

@Component({
    selector: 'activity-background',
    template: `
    <div #bg class="gantt_activity_bg">
        @for (row of ganttService.groupData(tasks); track row.id) {
        <div class="gantt_activity_row" [ngStyle]="setRowStyle()">
            @for (cell of cells; track $index; let l = $last) {
            <div class="gantt_activity_cell" [ngStyle]="setCellStyle()" [ngClass]="[(isDayWeekend(cell)) ? 'weekend' : '', l ? 'last_column_cell' : '']"></div>
            }
        </div>
        }
    </div>
    `,
    styles: [`
        .gantt_activity_bg {
            overflow: hidden;
            background: var(--gantt-surface);
        }

        .gantt_activity_row {
            border-bottom: 1px solid var(--gantt-border-soft);
            background-color: var(--gantt-surface);
            box-sizing: border-box;
        }

        .gantt_activity_cell {
            display: inline-block;
            height: 100%;
            border-right: 1px solid #eef2f7;
            box-sizing: border-box;
        }

        .weekend {
            background-color: #f8fafc;
        }
    `],
    standalone: false
})
export class GanttActivityBackgroundComponent implements OnInit {
    @Input() tasks: any;
    @Input() timeScale:any;
    @Input() zoom: any;
    @Input() zoomLevel: string;
    @Input() timelineZoom: number = 1;

    @ViewChild('bg') bg: ElementRef;

    public rows: any[] = [];
    public cells: any[] = [];

    constructor(public ganttService: GanttService) { }

    ngOnInit() {
        this.drawGrid();

        this.zoom.subscribe((zoomLevel: string) => {
            this.zoomLevel = zoomLevel;
            this.drawGrid();
        });
    }

    isDayWeekend(date: Date): boolean {
        return this.ganttService.isDayWeekend(date);
    }

    public setRowStyle() {
        return {
            'height': this.ganttService.rowHeight + 'px'
        };
    }

    public setCellStyle() {
        var width = this.ganttService.cellWidth;

        if (this.zoomLevel === Zooming[Zooming.hours]) {
            width = this.ganttService.hourCellWidth;
        }

        return {
            'width': Math.round(width * this.timelineZoom) + 'px'
        };
    }

    public drawGrid(): void {
        if (this.zoomLevel === Zooming[Zooming.hours]) {
            this.cells = [];

            this.timeScale.forEach((date: any) => {
                for (var i = 0; i <= 23; i++) {
                    this.cells.push(date);
                }
            });
        } else {
            this.cells = this.timeScale;
        }
    }
}
