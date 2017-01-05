import { Component, OnInit, Input } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';

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
    @Input() scale: any;
    @Input() grid: any;
    @Input() dimensions: any;
    @Input() zoom: any
    @Input() project: any;

    // private containerHeight: any;
    // private containerWidth: any;
    private rows: any[] = [];
    private cells: any[] = [];
    private zoomLevel: string = 'days';

    constructor(private ganttService: GanttService) { }

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

    //TODO(dale) add to gantt config
    private setCellStyle() {
        var width = this.ganttService.cellWidth;

        if (this.zoomLevel === 'hours') {
            width = 20; 
        }

        return {
            'width': width + 'px'
        };
    }

    //TODO(dale): improve performance, only render current view
    private drawGrid(): void {
        //this.rows = new Array(this.project.tasks.length);
        //console.log(this.project.tasks.length);

        if (this.zoomLevel === 'hours') {
            this.cells = [];

            this.grid.cells.dates.forEach((date: any) => {
                for (var i = 0; i < 23; i++) {
                    this.cells.push(date);
                }
            });
        } else {
            this.cells = this.grid.cells.dates;
        }
    }
}
