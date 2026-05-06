import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';
import { Zooming } from '../../shared/interfaces';

@Component({
    selector: 'activity-bars',
    template: `
    <div class="gantt_activity_bars_area" [ngStyle]="{ 'height': containerHeight + 'px', 'width': containerWidth + 'px' }">
        @for (task of ganttService.groupData(tasks); track task.id; let i = $index) {
        <div #bar class="gantt_activity_line" [ngStyle]="drawBar(task, i)">
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
        }
    </div>
    `,
    styles: [`
    .gantt_activity_line {
        position: absolute;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 999px;
        background-color: #22d3ee;
        border: 1px solid rgba(14, 116, 144, 0.5);
        box-shadow: 0 6px 14px rgba(14, 116, 144, 0.16);
        -webkit-user-select: none;
        user-select: none;
        transition: filter 120ms ease, box-shadow 120ms ease, transform 120ms ease;
    }

    .gantt_activity_line::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.36), rgba(255, 255, 255, 0) 50%, rgba(15, 23, 42, 0.08));
        pointer-events: none;
        z-index: 2;
    }

    .gantt_activity_line:hover {
        cursor: default;
        filter: saturate(1.08);
        box-shadow: 0 8px 18px rgba(14, 116, 144, 0.22);
        transform: translateY(-1px);
    }

    .gantt_activity_progress {
        text-align: center;
        z-index: 1;
        background: #0891b2;
        position: absolute;
        min-height: 18px;
        display: block;
        height: 18px;
        border-radius: 999px 0 0 999px;
        opacity: 1;
        box-shadow: inset -2px 0 0 rgba(255, 255, 255, 0.8), 2px 0 7px rgba(15, 23, 42, 0.18);
        transition: width 180ms linear;
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
        opacity: 0;
        transition: opacity 120ms ease;
    }

    .gantt_activity_line:hover .gantt_activity_link_control {
        opacity: 1;
    }

    .gantt_activity_right {
        right: 0;
    }

    .gantt_activity_left {
        left: 0;
    }

    .gantt_activity_right:hover {
        cursor: w-resize;
    }

    .gantt_activity_left:hover {
        cursor: w-resize;
    }
    `],
    providers: [
        GanttService
    ],
    standalone: false
})
export class GanttActivityBarsComponent implements OnInit {
    @Input() timeScale: any;
    @Input() dimensions: any;
    @Input() tasks: any;
    @Input() zoom: any;
    @Input() zoomLevel: any;

    public containerHeight: number = 0;
    public containerWidth: number = 0;

    constructor(public ganttService: GanttService) { }

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
            let barWidth = parseFloat(startBarWidth) - e.clientX + startX;
            let days = Math.round(barWidth / cellWidth);

            bar.style.width = days * cellWidth + days;
            bar.style.left = (parseFloat(startBarLeft) - (days * cellWidth) - days) + 'px';
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
            let barWidth = parseFloat(startBarWidth) + e.clientX - startX;
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
            let barLeft = parseFloat(startBarLeft) + e.clientX - startX;
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

    public drawBar(task: any, index: number) {
        let style = {};

        if (this.zoomLevel === Zooming[Zooming.hours]) {
            style = this.ganttService.calculateBar(task, index, this.timeScale, true);
        } else {
            style = this.ganttService.calculateBar(task, index, this.timeScale);
        }
        return style;
    }

    public drawProgress(task: any, bar: any):any {
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
