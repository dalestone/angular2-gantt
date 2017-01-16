import { Component, OnInit, Input } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';
import { Zooming } from '../../shared/interfaces';

@Component({
    selector: 'activity-background',
    template: `
    <div class="gantt_activity_bg">
        <div class="gantt_activity_row" [ngStyle]="setRowStyle()" *ngFor="let row of project.tasks">
            <div class="gantt_activity_cell" [ngStyle]="setCellStyle()" *ngFor="let cell of cells; let l = last" [ngClass]="[(isDayWeekend(cell)) ? 'weekend' : '', l ? 'last_column_cell' : '']"></div>
        </div>
    </div>
    `,
    styleUrls: [`
        .gantt_activity_bg {
            overflow: hidden;    
        }

        .gantt_activity_row {
            border-bottom: 1px solid #ebebeb;
            background-color: #fff;
            box-sizing: border-box;
        }

        .gantt_activity_cell {
            display: inline-block;
            height: 100%;
            border-right: 1px solid #ebebeb;
        }

        .weekend {
            background-color:#FAFAFA;
        }
    `]
})
export class GanttActivityBackgroundComponent implements OnInit {
    @Input() project: any;
    @Input() grid: any;
    @Input() zoom: any;
    @Input() zoomLevel: string;

    private rows: any[] = [];
    private cells: any[] = [];

    constructor(private ganttService: GanttService) {

    }

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

    private setRowStyle() {
        return {
            'height': this.ganttService.rowHeight + 'px'
        };
    }

    private setCellStyle() {
        var width = this.ganttService.cellWidth;

        if (this.zoomLevel === Zooming[Zooming.hours]) {
            width = this.ganttService.hourCellWidth; 
        }

        return {
            'width': width + 'px'
        };
    }

    private drawGrid(): void {
        if (this.zoomLevel === Zooming[Zooming.hours]) {
            this.cells = [];

            this.grid.cells.dates.forEach((date: any) => {
                for (var i = 0; i <= 23; i++) {
                    this.cells.push(date);
                }
            });
        } else {
            this.cells = this.grid.cells.dates;
        }
    }
}
