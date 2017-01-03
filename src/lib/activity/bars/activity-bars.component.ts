import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { GanttService } from '../../shared/services/gantt.service';

@Component({
    selector: 'activity-bars',
    templateUrl: './activity-bars.component.html',
    styleUrls: ['./activity-bars.component.css'],
    providers: [
        GanttService
    ]
})
export class GanttActivityBarsComponent implements OnInit {
    @Input() scale: any;
    @Input() dimensions: any;
    @Input() project: any;
    @Input() zoom: any;

    private containerHeight: number = 0;
    private containerWidth: number = 0;
    private timescale: any;
    private zoomLevel: string;

    //TODO(dale): this needs to be able to handle passes, e.g show multiple lines? last 3?

    constructor(private ganttService: GanttService) { }

    ngOnInit() {
        this.timescale = this.ganttService.calculateScale(this.scale.start, this.scale.end);
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

        if (this.zoomLevel === 'hours') {
            style = this.ganttService.calculateBar(task, index, this.timescale, true);
        } else {
            style = this.ganttService.calculateBar(task, index, this.timescale);
        }
        return style;
    }

    private drawProgress(task: any, bar: any) {
        return this.ganttService.calculateBarProgress(this.ganttService.getComputedStyle(bar, 'width'), task.percentComplete);
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
