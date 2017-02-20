import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';
import { Zooming } from '../../shared/interfaces';

@Component({
    selector: 'activity-background',
    template: `
    <div #bg class="gantt_activity_bg">
        <div class="gantt_activity_row" [ngStyle]="setRowStyle()" *ngFor="let row of ganttService.groupData(tasks)">
            <div class="gantt_activity_cell" [ngStyle]="setCellStyle()" *ngFor="let cell of cells; let l = last" [ngClass]="[(isDayWeekend(cell)) ? 'weekend' : '', l ? 'last_column_cell' : '']"></div>
        </div>
    </div>
    `,
    styles: [`
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
            background-color:whitesmoke;
        }
    `]
})
export class GanttActivityBackgroundComponent implements OnInit {
    @Input() tasks: any;
    @Input() timeScale:any;
    @Input() zoom: any;
    @Input() zoomLevel: string;

    @ViewChild('bg') bg: ElementRef;

    private rows: any[] = [];
    private cells: any[] = [];

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


    //TODO(dale): replace with either svg or canvas
    // exceeding the maximum length/width/area on most browsers renders the canvas
    // unusable (it will ignore any draw commands, even in the usable area)
    // private drawGrid2(): void {
    //     this.bg.nativeElement.innerHTML = '';
    //     //grid width and height
    //     var bw = 1384; // maximum width 16384 CHROME
    //     var bh = 300; //this.project.tasks.length * this.ganttService.rowHeight;
    //     var rowHeight = this.ganttService.rowHeight;
    //     var cellWidth = 0;

    //     if (this.zoomLevel === Zooming[Zooming.hours]) {
    //         cellWidth = this.ganttService.hourCellWidth;
    //     } else {
    //         cellWidth = this.ganttService.cellWidth;
    //     }

    //     var canvas = document.createElement('canvas');
    //     canvas.setAttribute("width", bw.toString());
    //     canvas.setAttribute("height", bh.toString());
    //     var context = canvas.getContext("2d");

    //     var lineSpacer = 0;
    //     // vertical lines
    //     for (var x = 0; x <= bw; x += cellWidth) {
    //         lineSpacer += cellWidth / cellWidth;

    //         context.moveTo(x + lineSpacer - 1.5, 0);
    //         context.lineTo(x + lineSpacer - 1.5, bh);
    //     }

    //     // horizontal lines
    //     for (var x = 0; x <= bh; x += rowHeight) {
    //         context.moveTo(0, x);
    //         context.lineTo(bw , x);
    //     }

    //     context.strokeStyle = "#e0e0e0";
    //     context.stroke();

    //     this.bg.nativeElement.append(canvas);
    // }


// var canvas = $('<canvas/>').attr({width: cw, height: ch}).appendTo('body');

// var context = canvas.get(0).getContext("2d");

// function drawBoard(){
//     for (var x = 0; x <= bw; x += 40) {
//         context.moveTo(0.5 + x + p, p);
//         context.lineTo(0.5 + x + p, bh + p);
//     }


//     for (var x = 0; x <= bh; x += 40) {
//         context.moveTo(p, 0.5 + x + p);
//         context.lineTo(bw + p, 0.5 + x + p);
//     }

//     context.strokeStyle = "black";
//     context.stroke();
// }

// drawBoard();