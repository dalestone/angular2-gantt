import { Injectable } from '@angular/core';
import { GanttConfig } from '../gantt-config';

@Injectable()
export class GanttService {
    public rowHeight: number = 0;
    public cellWidth: number = 0;
    public windowInnerWidth: number = 0;
    public activityHeight: number = 0;
    public activityWidth: number = 0;
    public barHeight: number = 0;
    public barLineHeight: number = 0;
    public barTop: number = 0;

    constructor() {
        let _ganttConfig = new GanttConfig();

        this.rowHeight = _ganttConfig.rowHeight;
        this.cellWidth = _ganttConfig.cellWidth;
        this.activityHeight = _ganttConfig.activityHeight;
        this.barHeight = _ganttConfig.barHeight;
        this.barLineHeight = _ganttConfig.barLineHeight;
        this.barTop = _ganttConfig.rowHeight;
    }

    private calculateBarWidth(start: Date, end: Date): number {
        let days = this.calculateDiffDays(start, end);
        let width: number = days * this.cellWidth + days;

        return width;
    }

    private calculateBarLeft(start: Date, scale: any[]): number {
        let left = 0;
        for (let i = 0; i < scale.length; i++) {
            if (start.valueOf() === scale[i].valueOf()) {
                left = i * this.cellWidth + i;
            }
        }
        return left;
    }

    public calculateBars(lines, scale) {
        let top: number = 2;
        let bars = [];

        // console.log(lines);
        // console.log(scale);

        for (let line of lines) {
            let barStyle = this.calculateBarStyle(line.resource);

            bars.push({
                style: {
                    top: top,
                    left: this.calculateBarLeft(line.start, scale), // 76
                    height: this.barHeight,
                    lineHeight: this.barLineHeight,
                    width: this.calculateBarWidth(line.start, line.end), // 76 
                    backgroundColour: barStyle.backgroundColour,
                    border: barStyle.border
                },
                task: {
                    id: line.id,
                    name: line.name,
                    percentComplete: line.percentComplete,
                    start: line.start,
                    end: line.end
                }
            });
            top += this.barTop;
        }

        return bars;
    }

    private calculateBarStyle(resource: string) {
        let lineStyle = { backgroundColour: '', border: '' };

        return lineStyle;
    }

    public calculateBarProgress(width: number, percent: number) {
        let progress = (width / 100) * percent - 2;
        return progress;
    }

    public calculateDiffDays(start: Date, end: Date): number {
        let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds /ms
        let diffDays = Math.abs((start.getTime() - end.getTime()) / (oneDay));
        let days = Math.round(diffDays);

        return days;
    }

    public calculateScale(start: Date, end: Date) {
        let scale = [];

        while (start.getTime() <= end.getTime()) {
            scale.push(start);

            start = this.addDays(start, 1);
        }
        return scale;
    }

    public isDayWeekend(date: Date): boolean {
        let day = date.getDay();

        if (day === 6 || day === 0) {
            return true;
        }
        return false;
    }

    public addDays(date, days) {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    public removeDays(date, days) {
        let result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }

    // TESTING
    public getComputedStyle(element, attribute) {
        return parseInt(document.defaultView.getComputedStyle(element)[attribute], 10);
    }

    public calculateContainerWidth(): number {
        this.windowInnerWidth = window.innerWidth;
        let containerWidth = (innerWidth - 18);

        return containerWidth;
    }

    public calculateActivityContainerDimensions(): any {
        this.windowInnerWidth = window.innerWidth;
        let width = (this.windowInnerWidth - 319); // (-18) if you want to take into account scroll bar width

        return { height: this.activityHeight, width: width };
    }

    public scrollTop(verticalScrollElem, ganttGridElem, ganttActivityAreaElem) {
        let verticalScrollTop = verticalScrollElem.scrollTop;

        if (verticalScrollTop !== null && verticalScrollTop !== undefined) {
            this.setGridScrollTop(verticalScrollTop, ganttGridElem);
            this.setAreaScrollTop(verticalScrollTop, ganttActivityAreaElem);
        }
    }

    private setGridScrollTop(scrollTop: number, element): void {
        if (element !== null && element !== undefined) {
            element.scrollTop = scrollTop;
        }
    }

    private setAreaScrollTop(scrollTop: number, element): void {
        if (element !== null && element !== undefined) {
            element.scrollTop = scrollTop;
        }
    }
}
