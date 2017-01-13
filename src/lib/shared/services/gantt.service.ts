import { Injectable } from '@angular/core';
import { GanttConfig } from './gantt-config.service';
import { IBarStyle } from '../interfaces';

@Injectable()
export class GanttService {
    public rowHeight: number = 0;
    public hourCellWidth: number = 60; // change to 60 so minutes can been seen more easily
    public hoursCellWidth: number = this.hourCellWidth * 25;
    public cellWidth: number = 0;
    public windowInnerWidth: number = 0;
    public activityHeight: number = 0;
    public barHeight: number = 0;
    public barLineHeight: number = 0;
    public barTop: number = 0;
    public barMoveable: boolean = false;
    private barStyles: IBarStyle[] = [
        { status: "information", backgroundColor: "rgb(18,195, 244)", border: "1px solid #2196F3", progressBackgroundColor: "#2196F3" },
        { status: "warning", backgroundColor: "#FFA726", border: "1px solid #EF6C00", progressBackgroundColor: "#EF6C00" },
        { status: "error", backgroundColor: "#EF5350", border: "1px solid #C62828", progressBackgroundColor: "#C62828" },
        { status: "completed", backgroundColor: "#66BB6A", border: "1px solid #2E7D32", progressBackgroundColor: "#2E7D32" }
    ];

    constructor() {
        let _ganttConfig = new GanttConfig();

        this.rowHeight = _ganttConfig.rowHeight;
        this.cellWidth = _ganttConfig.cellWidth;
        this.activityHeight = _ganttConfig.activityHeight;
        this.barHeight = _ganttConfig.barHeight;
        this.barLineHeight = _ganttConfig.barLineHeight;
        this.barTop = _ganttConfig.rowHeight;
        this.barMoveable = _ganttConfig.barMoveable;
    }

    private calculateBarWidth(start: Date, end: Date, hours?: boolean): number {

        if (typeof start === "string") {
            start = new Date(start);
        }

        if (typeof end === "string") {
            end = new Date(end);
        }

        let days = this.calculateDiffDays(start, end);
        let width: number = days * this.cellWidth + days;

        if (hours) {
            width = days * this.hourCellWidth * 24 + days * 24;
        }

        return width;
    }

    private calculateBarLeft(start: Date, scale: any[], hours?: boolean): number {
        var left: number = 0;

        for (var i = 0; i < scale.length; i++) {
            if (start.getDate() === scale[i].getDate()) {
                if (hours) {
                    left = i * this.hoursCellWidth + i + this.calculateBarLeftDelta(start, hours);
                } else {
                    left = i * this.cellWidth + i + this.calculateBarLeftDelta(start, hours);
                }
                break;
            }
        }
        return left;
    }

    private calculateBarLeftDelta(start: Date, hours?: boolean) {
        var offset: number = 0;
        var hoursInDay: number = 24;
        var minutesInHour: number = 60;
        var secondsInHour: number = 3600;
        var startHours: number = start.getHours() + start.getMinutes() / minutesInHour + start.getSeconds() / secondsInHour;

        if (hours) {
            offset = this.hoursCellWidth / hoursInDay * startHours;
        } else {
            offset = this.cellWidth / hoursInDay * startHours;
        }
        return offset;
    }

    public calculateBar(task: any, index: number, scale: any, hours?: boolean) {
        var barColour = this.getBarColour(task.status);

        return {
            'top': this.barTop * index + 2 + 'px',
            'left': this.calculateBarLeft(task.start, scale, hours) + 'px',
            'height': this.barHeight + 'px',
            'line-height': this.barLineHeight + 'px',
            'width': this.calculateBarWidth(task.start, task.end, hours) + 'px',
            'background-color': barColour["background-color"],
            'border': barColour["border"]
        }
    }

    private getBarColour(taskStatus: string = ""): any {
        var style = {};

        try {
            taskStatus = taskStatus.toLowerCase();
        } catch (err) {
            taskStatus = "";
        }

        switch (taskStatus) {
            case "information":
                style["background-color"] = this.barStyles[0].backgroundColor;
                style["border"] = this.barStyles[0].border;
                break;
            case "warning":
                style["background-color"] = this.barStyles[1].backgroundColor;
                style["border"] = this.barStyles[1].border;
                break;
            case "error":
                style["background-color"] = this.barStyles[2].backgroundColor;
                style["border"] = this.barStyles[2].border;
                break;
            case "completed":
                style["background-color"] = this.barStyles[3].backgroundColor;
                style["border"] = this.barStyles[3].border;
                break;
            default:
                style["background-color"] = "rgb(18,195, 244)";
                style["border"] = "1px solid #2196F3";
                break;
        }

        return style;
    }

    public getBarProgressColour(taskStatus: string = ""): any {
        var style = {};

        try {
            taskStatus = taskStatus.toLowerCase();
        } catch (err) {
            taskStatus = "";
        }

        switch (taskStatus) {
            case "information":
                style["background-color"] = this.barStyles[0].progressBackgroundColor;
                break;
            case "warning":
                style["background-color"] = this.barStyles[1].progressBackgroundColor;
                break;
            case "error":
                style["background-color"] = this.barStyles[2].progressBackgroundColor;
                break;
            case "completed":
                style["background-color"] = this.barStyles[3].progressBackgroundColor;
                break;
            default:
                style["background-color"] = "rgb(18,195, 244)";
                break;
        }

        return style;
    }

    public calculateBarProgress(width: number, percent: number): string {
        if (typeof percent === "number") {
            if (percent > 100) {
                percent = 100;
            }
            let progress: number = (width / 100) * percent - 2;

            return `${progress}px`;
        }
        return `${0}px`;
    }

    public calculateDiffDays(start: Date, end: Date): number {
        try {
            let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds /ms
            let diffDays = Math.abs((start.getTime() - end.getTime()) / (oneDay));
            let days = diffDays; // don't use Math.round as it will draw an incorrect bar

            return days;
        } catch (err) {
            return 0;
        }
    }

    public calculateScale(start: Date = new Date(), end: Date = this.addDays(start, 7)) {
        let scale: any[] = [];

        try {
            while (start.getTime() <= end.getTime()) {
                scale.push(start);
                start = this.addDays(start, 1);
            }
            return scale;

        } catch (err) {
            return scale;
        }
    }

    public isDayWeekend(date: Date): boolean {
        let day = date.getDay();

        if (day === 6 || day === 0) {
            return true;
        }
        return false;
    }

    public addDays(date: Date, days: number) {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    public removeDays(date: Date, days: number) {
        let result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }

    public getHours(cols: number): string[] {
        var hours: string[] = [];

        while (hours.length <= cols * 24) {
            for (var i = 0; i <= 23; i++) {
                if (i < 10) {
                    hours.push('0' + i.toString());
                } else {
                    hours.push(i.toString());
                }
            }
        }

        return hours;
    }

    public getComputedStyle(element: any, attribute: any) {
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

    public scrollTop(verticalScrollElem: any, ganttGridElem: any, ganttActivityAreaElem: any) {
        let verticalScrollTop = verticalScrollElem.scrollTop;

        if (verticalScrollTop !== null && verticalScrollTop !== undefined) {
            this.setGridScrollTop(verticalScrollTop, ganttGridElem);
            this.setAreaScrollTop(verticalScrollTop, ganttActivityAreaElem);
        }
    }

    private setGridScrollTop(scrollTop: number, element: any): void {
        if (element !== null && element !== undefined) {
            element.scrollTop = scrollTop;
        }
    }

    private setAreaScrollTop(scrollTop: number, element: any): void {
        if (element !== null && element !== undefined) {
            element.scrollTop = scrollTop;
        }
    }
}
