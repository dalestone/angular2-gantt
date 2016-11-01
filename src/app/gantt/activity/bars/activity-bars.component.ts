import { Component, OnInit, Input } from '@angular/core';
import { GanttService } from '../../services/gantt.service';

@Component({
    selector: 'activity-bars',
    templateUrl: './activity-bars.component.html',
    styleUrls: [ './activity-bars.component.css' ],
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

        let ganttService = this.ganttService;
        let startX = $event.clientX;
        let startBarWidth = bar.style.width;
        let startBarLeft = bar.style.left;

        function doDrag(e) {
            let cellWidth = ganttService.cellWidth;
            let barWidth = startBarWidth - e.clientX + startX;
            let days = Math.round(barWidth / cellWidth);

            bar.style.width = days * cellWidth + days;
            bar.style.left = (startBarLeft - (days * cellWidth) - days);
        }

        this.addMouseEventListeners(doDrag);

        return false;
    }

    expandRight($event, bar) {
        $event.stopPropagation();

        let ganttService = this.ganttService;
        let startX = $event.clientX;
        let startBarWidth = bar.style.width;
        let startBarEndDate = bar.task.end;
        let startBarLeft = bar.style.left;

        function doDrag(e) {
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

    move($event, bar) {
        $event.stopPropagation();

        let ganttService = this.ganttService;
        let startX = $event.clientX;
        let startBarLeft = bar.style.left;

        function doDrag(e) {
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

    private drawProgress(bar) {
        let width = bar.style.width;
        let percentComplete = bar.task.percentComplete;
        let progress = this.ganttService.calculateBarProgress(width, percentComplete);

        return progress;
    }

    private drawBars(): void {
        this.bars = this.ganttService.calculateBars(this.data, this.timescale);
        console.log(this.bars);
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
