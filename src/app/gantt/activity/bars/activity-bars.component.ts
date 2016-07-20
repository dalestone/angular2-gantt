import { Component, OnInit, Input } from '@angular/core';
import { NgStyle} from '@angular/common';
import { GanttService } from '../../gantt.service';

@Component({
    selector: 'activity-bars',
    templateUrl: './app/gantt/activity/area/bars.html',
    styleUrls: [ './bars.css' ],
    providers: [
        GanttService
    ]
})
export class GanttActivityBarsComponent implements OnInit {
    @Input() scale;

    @Input() dimensions;

    @Input() data;

    private containerHeight: number = 0;
    private containerWidth: number = 0;
    private bars = [];
    private timescale;

    constructor(private ganttService: GanttService) { }

    ngOnInit() {
        this.timescale = this.ganttService.calculateScale(this.scale.start, this.scale.end);
        this.containerHeight = this.dimensions.height;
        this.containerWidth = this.dimensions.width;
        this.drawBars();
    }

    expandLeft($event, bar) {
        $event.stopPropagation();

        var ganttService = this.ganttService;
        var startX = $event.clientX;
        var startBarWidth = bar.style.width;
        var startBarLeft = bar.style.left;

        function doDrag(e) {
            var cellWidth = ganttService.cellWidth;
            var barWidth = startBarWidth - e.clientX + startX;
            var days = Math.round(barWidth / cellWidth);

            bar.style.width = days * cellWidth + days;
            bar.style.left = (startBarLeft - (days * cellWidth) - days);
        }

        this.addMouseEventListeners(doDrag)

        return false;
    }

    expandRight($event, bar) {
        $event.stopPropagation();

        var ganttService = this.ganttService;
        var startX = $event.clientX;
        var startBarWidth = bar.style.width;
        var startBarEndDate = bar.task.end;
        var startBarLeft = bar.style.left;

        function doDrag(e) {
            var cellWidth = ganttService.cellWidth;
            var barWidth = startBarWidth + e.clientX - startX;
            var days = Math.round(barWidth / cellWidth);

            if (barWidth < cellWidth) {
                barWidth = cellWidth;
                days = Math.round(barWidth / cellWidth);
            }
            bar.style.width = ((days * cellWidth) + days); // rounds to the nearest cell            
        }

        this.addMouseEventListeners(doDrag)

        return false;
    }

    move($event, bar) {
        $event.stopPropagation();

        var ganttService = this.ganttService;
        var startX = $event.clientX;
        var startBarLeft = bar.style.left;

        function doDrag(e) {
            var cellWidth = ganttService.cellWidth;
            var barLeft = startBarLeft + e.clientX - startX;
            var days = Math.round(barLeft / cellWidth);

            //TODO: determine how many days the bar can be moved
            // if (days < maxDays) {
            bar.style.left = ((days * cellWidth) + days); // rounded to nearest cell

            // keep bar in bounds of grid
            if (barLeft < 0) {
                bar.style.left = 0;
            }
            // }
            //TODO: it needs to take into account the max number of days.
            //TODO: it needs to take into account the current days.
            //TODO: it needs to take into account the right boundary.
        }

        this.addMouseEventListeners(doDrag)

        return false;
    }

    private drawProgress(bar) {
        var width = bar.style.width;
        var percentComplete = bar.task.percentComplete;
        var progress = this.ganttService.calculateBarProgress(width, percentComplete);

        return progress;
    }

    private drawBars(): void {
        this.bars = this.ganttService.calculateBars(this.data, this.timescale);
    }

    private addMouseEventListeners(dragFn) {

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