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
    @Input() zoom: any

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
        this.rows = new Array(this.grid.rows);

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

        // this.containerHeight = this.dimensions.height;
        // this.containerWidth = this.dimensions.width;
    }
}
