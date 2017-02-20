import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';
import { Zooming } from '../../shared/interfaces';

@Component({
    selector: 'activity-bars',
    template: `
    <div class="gantt_activity_bars_area" [ngStyle]="{ 'height': containerHeight + 'px', 'width': containerWidth + 'px' }">
        <div #bar class="gantt_activity_line" *ngFor="let task of ganttService.groupData(tasks); let i = index" [ngStyle]="drawBar(task, i)">
            <div class="gantt_activity_progress" [ngStyle]="drawProgress(task, bar)"></div>
            <div class="gantt_activity_progress_drag" style="left: 518px"></div>
            <div class="gantt_activity_content"></div>
            <div class="gantt_activity_link_control gantt_activity_right" style="height: 26px; line-height: 30px">
                <div class="gantt_link_point"></div>
            </div>
            <div class="gantt_activity_link_control gantt_activity_left" style="height: 26px; line-height: 30px">
                <div class="gantt_link_point"></div>
            </div>
        </div>
    </div>
    `,
    styles: [`
    .gantt_activity_line {
        /*border-radius: 2px;*/
        position: absolute;
        box-sizing: border-box;
        background-color: rgb(18,195,244);
        border: 1px solid #2196F3;
        -webkit-user-select: none;
    }

    .gantt_activity_line:hover {
        /*cursor: move;*/
    }

    .gantt_activity_progress {
        text-align: center;
        z-index: 0;
        background: #2196F3;
        position: absolute;
        min-height: 18px;
        display: block;
        height: 18px;
    }

    .gantt_activity_progress_drag {
        height: 8px;
        width: 8px;
        bottom: -4px;
        margin-left: 4px;
        background-position: bottom;
        background-image: "";
        background-repeat: no-repeat;
        z-index: 2;
    }

    .gantt_activity_content {
        font-size: 12px;
        color: #fff;
        width: 100%;
        top: 0;
        position: absolute;
        white-space: nowrap;
        text-align: center;
        line-height: inherit;
        overflow: hidden;
        height: 100%;
    }

    .gantt_activity_link_control {
        position: absolute;
        width: 13px;
        top: 0;   
    }

    .gantt_activity_right {
        right: 0;
    }

    .gantt_activity_left {
        left: 0;
    }

    .gantt_activity_right:hover {
        cursor:w-resize;
    }

    .gantt_activity_left:hover {
        cursor:w-resize;
    }
    `],
    providers: [
        GanttService
    ]
})
export class GanttActivityBarsComponent implements OnInit {
    @Input() timeScale: any;
    @Input() dimensions: any;
    @Input() tasks: any;
    @Input() zoom: any;
    @Input() zoomLevel: any;

    private containerHeight: number = 0;
    private containerWidth: number = 0;

    constructor(private ganttService: GanttService) { }

    ngOnInit() {
        this.containerHeight = this.dimensions.height;
        this.containerWidth = this.dimensions.width;

        this.zoom.subscribe((zoomLevel: string) => {
            this.zoomLevel = zoomLevel;
        });;
    }

    //TODO(dale): the ability to move bars needs reviewing and there are a few quirks
    expandLeft($event: any, bar: any) {
        $event.stopPropagation();

        let ganttService = this.ganttService;
        let startX = $event.clientX;
        let startBarWidth = bar.style.width;
        let startBarLeft = bar.style.left;

        function doDrag(e: any) {
            let cellWidth = ganttService.cellWidth;
            let barWidth = startBarWidth - e.clientX + startX;
            let days = Math.round(barWidth / cellWidth);

            bar.style.width = days * cellWidth + days;
            bar.style.left = (startBarLeft - (days * cellWidth) - days);
        }

        this.addMouseEventListeners(doDrag);

        return false;
    }

    expandRight($event: any, bar: any) {
        $event.stopPropagation();

        let ganttService = this.ganttService;
        let startX = $event.clientX;
        let startBarWidth = bar.style.width;
        let startBarEndDate = bar.task.end;
        let startBarLeft = bar.style.left;

        function doDrag(e: any) {
            let cellWidth = ganttService.cellWidth;
            let barWidth = startBarWidth + e.clientX - startX;
            let days = Math.round(barWidth / cellWidth);

            if (barWidth < cellWidth) {
                barWidth = cellWidth;
                days = Math.round(barWidth / cellWidth);
            }
            bar.style.width = ((days * cellWidth) + days); // rounds to the nearest cell            
        }

        this.addMouseEventListeners(doDrag);

        return false;
    }

    move($event: any, bar: any) {
        $event.stopPropagation();

        let ganttService = this.ganttService;
        let startX = $event.clientX;
        let startBarLeft = bar.style.left;

        function doDrag(e: any) {
            let cellWidth = ganttService.cellWidth;
            let barLeft = startBarLeft + e.clientX - startX;
            let days = Math.round(barLeft / cellWidth);

            // TODO: determine how many days the bar can be moved
            // if (days < maxDays) {
            bar.style.left = ((days * cellWidth) + days); // rounded to nearest cell

            // keep bar in bounds of grid
            if (barLeft < 0) {
                bar.style.left = 0;
            }
            // }
            // TODO: it needs to take into account the max number of days.
            // TODO: it needs to take into account the current days.
            // TODO: it needs to take into account the right boundary.
        }

        this.addMouseEventListeners(doDrag);

        return false;
    }

    private drawBar(task: any, index: number) {
        let style = {};

        if (this.zoomLevel === Zooming[Zooming.hours]) {
            style = this.ganttService.calculateBar(task, index, this.timeScale, true);
        } else {
            style = this.ganttService.calculateBar(task, index, this.timeScale);
        }
        return style;
    }

    private drawProgress(task: any, bar: any):any {
        var barStyle = this.ganttService.getBarProgressStyle(task.status);
        var width = this.ganttService.calculateBarProgress(this.ganttService.getComputedStyle(bar, 'width'), task.percentComplete);

        return {
            'width': width,
            'background-color': barStyle["background-color"],
        };
    }

    private addMouseEventListeners(dragFn: any) {

        function stopFn() {
            document.documentElement.removeEventListener('mousemove', dragFn, false);
            document.documentElement.removeEventListener('mouseup', stopFn, false);
            document.documentElement.removeEventListener('mouseleave', stopFn, false);
        }

        document.documentElement.addEventListener('mousemove', dragFn, false);
        document.documentElement.addEventListener('mouseup', stopFn, false);
        document.documentElement.addEventListener('mouseleave', stopFn, false);
    }
}
