import { Injectable } from '@angular/core';
import { GanttConfig } from './gantt-config.service';
import { IBarStyle, Task, IScale, Zooming } from '../interfaces';
import { GroupByPipe } from '../../shared/pipes/groupBy.pipe';

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
    public gridWidth: number = 560;
    private barStyles: IBarStyle[] = [
        { status: "information", backgroundColor: "rgb(18,195, 244)", border: "1px solid #2196F3", progressBackgroundColor: "#2196F3" },
        { status: "warning", backgroundColor: "#FFA726", border: "1px solid #EF6C00", progressBackgroundColor: "#EF6C00" },
        { status: "error", backgroundColor: "#EF5350", border: "1px solid #C62828", progressBackgroundColor: "#C62828" },
        { status: "completed", backgroundColor: "#66BB6A", border: "1px solid #2E7D32", progressBackgroundColor: "#2E7D32" }
    ];
    public TASK_CACHE: any[];
    public TIME_SCALE: any[];

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
        var hoursInDay: number = 24;

        if (start != null) {
            if (typeof start === "string") {
                start = new Date();
            }

            for (var i = 0; i < scale.length; i++) {
                if (start.getDate() === scale[i].getDate()) {
                    if (hours) {
                        left = i * hoursInDay * this.hourCellWidth + hoursInDay * i + this.calculateBarLeftDelta(start, hours);
                    } else {
                        left = i * this.cellWidth + i + this.calculateBarLeftDelta(start, hours);
                    }
                    break;
                }
            }
        }
        return left;
    }

    /** Calculates the height of the gantt grid, activity and vertical scroll */
    public calculateGanttHeight(): string {        
        return `${this.TASK_CACHE.length * this.rowHeight + this.rowHeight * 3}px`;
    }

    private calculateBarLeftDelta(start: Date, hours?: boolean): number {
        var offset: number = 0;
        var hoursInDay: number = 24;
        var minutesInHour: number = 60;
        var secondsInHour: number = 3600;
        var startHours: number = start.getHours() + start.getMinutes() / minutesInHour + start.getSeconds() / secondsInHour;

        if (hours) {
            offset = this.hoursCellWidth / hoursInDay * startHours - startHours;
        } else {
            offset = this.cellWidth / hoursInDay * startHours;
        }
        return offset;
    }

    public isParent(treePath: string): boolean {

        try {
            var depth = treePath.split('/').length;

            if (depth === 1) {
                return true;
            }
        }
        catch (err) {
            return false;
        }
        return false;
    }

    public isChild(treePath: string) {
        if (this.isParent(treePath)) {
            return '0px';
        }
        return '20px';
    }

    /** Calculate the bar styles */
    public calculateBar(task: any, index: number, scale: any, hours?: boolean) {
        var barStyle = this.getBarStyle(task.status);
        //console.log(this.barTop * index + 2)
        return {
            'top': this.barTop * index + 2 + 'px',
            'left': this.calculateBarLeft(task.start, scale, hours) + 'px',
            'height': this.barHeight + 'px',
            'line-height': this.barLineHeight + 'px',
            'width': this.calculateBarWidth(task.start, task.end, hours) + 'px',
            'background-color': barStyle["background-color"],
            'border': barStyle["border"]
        }
    }

    /** Get the bar style based on task status */
    private getBarStyle(taskStatus: string = ""): any {
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

    /** Get the progresss bar background colour based on task status */
    public getBarProgressStyle(taskStatus: string = ""): any {
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
                style["background-color"] = this.barStyles[0].progressBackgroundColor;
                break;
        }

        return style;
    }

    /** Calculates the bar progress width in pixels given task percent complete */
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

    /** Calculates the difference in two dates and returns number of days */
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

    /** Calculates the difference in two dates and returns number of hours */
    public calculateDuration(task: any): string {
        try {
            if (task.start != null && task.end != null) {
                let oneHour = 60 * 60 * 1000;
                let diffHours = (Math.abs((task.start.getTime() - task.end.getTime()) / oneHour));
                let duration = diffHours;

                if (duration > 24) {
                    return `${Math.round(duration / 24)} day(s)`; // duration in days
                } else if (duration > 1) {
                    return `${Math.round(duration)} hr(s)`; // duration in hours
                } else {
                    let minutes = duration * 60;

                    if (minutes < 1) {
                        return `${Math.round(minutes * 60)} second(s)`; // duration in seconds
                    }
                    return `${Math.round(minutes)} min(s)` // duration in minutes
                }
            }

            return '';
        } catch (err) {
            return '';
        }
    }

    calculateTotalDuration(tasks: any[]): string {
        try {
            tasks = tasks.filter(t => t.parentId === t.id); // only calculate total duration with parent tasks
            
            let totalHours = 0;
            let oneHour = 60 * 60 * 1000;
            for (let i = 0; i < tasks.length; i++) {
                let start = tasks[i].start;
                let end = tasks[i].end;

                if (start != null && end != null) {
                    let duration = Math.abs(tasks[i].end.getTime() - tasks[i].start.getTime()) / oneHour; // duration in hours
                    totalHours += duration;
                }
            }

            if (totalHours === 0) {
                return '';
            }

            if (totalHours > 24) {
                return `${Math.round(totalHours / 24)} day(s)`; // duration in days
            } else if (totalHours > 1) {
                return `${Math.round(totalHours)} hr(s)`; // duration in hours
            } else {
                let minutes = totalHours * 60;

                if (minutes < 1) {
                    return `${Math.round(minutes * 60)} second(s)`; // duration in seconds
                }
                return `${Math.round(minutes)} min(s)` // duration in minutes
            }
        } catch (err) {
            return '';
        }
    }

    /** Calculate the total percentage of a group of tasks */
    calculateTotalPercentage(node: any): number {
        var totalPercent: number = 0;
        var children = node.children;

        if (children.length > 0) {
            children.forEach((child: any) => {
                totalPercent += isNaN(child.percentComplete) ? 0 : child.percentComplete;
            });

            return Math.ceil(totalPercent / children.length);
        } else {
            return isNaN(node.percentComplete) ? 0 : node.percentComplete;
        }
    }

    /** Calculate the total percent of the parent task */
    calculateParentTotalPercentage(parent: any, tasks: any[]) {
        var children = tasks.filter((task:any) => {
            return task.parentId === parent.id && task.id != parent.id
        }); // get only children tasks ignoring parent.

        var totalPercent: number = 0;
        
        if (children.length > 0) {
            children.forEach((child:any) => {
                totalPercent += isNaN(child.percentComplete) ? 0 : child.percentComplete;
            });

            return Math.ceil(totalPercent / children.length);
        } else {
            return isNaN(parent.percentComplete) ? 0 : parent.percentComplete;
        }
    }

    /** Calculate the gantt scale range given the start and end date of tasks*/
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

    /** Determines whether given date is a weekend */
    public isDayWeekend(date: Date): boolean {
        let day = date.getDay();

        if (day === 6 || day === 0) {
            return true;
        }
        return false;
    }

    /** Add x number of days to a date object */
    public addDays(date: Date, days: number): Date {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    //** Remove x number of days from a date object */
    public removeDays(date: Date, days: number): Date {
        let result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }

    /** Calculates the grid scale for gantt based on tasks start and end dates */
    public calculateGridScale(tasks: Task[]): IScale {
        var start: Date;
        var end: Date;
        var dates = tasks.map((task:any) => {
            return {
                start: new Date(task.start),
                end: new Date(task.end)
            }
        });

        start = new Date(Math.min.apply(null, dates.map(function (t) {
            return t.start;
        })));

        end = new Date(Math.max.apply(null, dates.map(function (t) {
            return t.end;
        })));

        return {
            start: start,
            end: end
        }
    }

    /** Create an hours array for use in time scale component */
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

    //TODO(dale): determine whether this is needed
    public calculateContainerWidth(): number {
        this.windowInnerWidth = window.innerWidth;
        let containerWidth = (innerWidth - 18);

        return containerWidth;
    }

    public calculateActivityContainerDimensions(): any {
        var scrollWidth: number = 18;
        this.windowInnerWidth = window.innerWidth;
        let width = this.windowInnerWidth - this.gridWidth - scrollWidth;

        return { height: this.activityHeight, width: width };
    }

    /** Set the vertical scroll top positions for gantt */
    public scrollTop(verticalScrollElem: any, ganttGridElem: any, ganttActivityAreaElem: any) {
        let verticalScrollTop = verticalScrollElem.scrollTop;
        let scroll = this.setScrollTop;

        // debounce
        if (verticalScrollTop !== null && verticalScrollTop !== undefined) {
            setTimeout(function() {
                scroll(verticalScrollTop, ganttActivityAreaElem);
                scroll(ganttActivityAreaElem.scrollTop, ganttGridElem);

            }, 50);
        }
    }

    /** Group data by id , only supports one level*/
    public groupData(tasks: any): any {
        var merged:any = [];
        var groups:any = new GroupByPipe().transform(tasks, (task:any) => {
            return [task.treePath.split('/')[0]]
        });
        return merged.concat.apply([], groups);
    }

    /** Create tree of data */
    public transformData(input: any): any {
        var output:any = [];
        for (var i = 0; i < input.length; i++) {
            var chain:any = input[i].id.split('/');
            var currentNode:any = output;
            for (var j = 0; j < chain.length; j++) {
                var wantedNode:any = chain[j];
                var lastNode:any = currentNode;
                for (var k = 0; k < currentNode.length; k++) {
                    if (currentNode[k].name == wantedNode) {
                        currentNode = currentNode[k].children;
                        break;
                    }
                }
                // If we couldn't find an item in this list of children
                // that has the right name, create one:
                if (lastNode == currentNode) {
                    //TODO(dale): determine way to show percent complete on correct child  
                    var newNode:any = currentNode[k] = {
                        name: wantedNode,
                        percentComplete: input[i].percentComplete,
                        start: input[i].start,
                        end: input[i].end,
                        children: []
                    };
                    currentNode = newNode.children;
                }
            }
        }
        return output;
    }

    /** Checks whether any new data needs to be added to task cache  */
    public doTaskCheck(tasks: any[], treeExpanded: boolean): boolean {
        var cachedTaskIds = this.TASK_CACHE.map((task:any) => { return task.id });
        var itemsToCache: any[] = [];

        if (treeExpanded) {
            // push children and parent tasks that are not cached
            tasks.filter((task:any) => {
                return cachedTaskIds.indexOf(task.id) === -1
            }).forEach((task:any) => {
                itemsToCache.push(task);
            })
        } else {
            // only look at tasks that are not cached
            tasks.filter((task:any) => { 
                return cachedTaskIds.indexOf(task.id) === -1 && task.treePath.split('/').length === 1 
            }).forEach((task:any) => {
                itemsToCache.push(task);
            });
        }

        itemsToCache.forEach((item:any) => {
            this.TASK_CACHE.push(item);
        });

        if (itemsToCache.length > 0) {
            return true;
        }

        return false;
    }

    /** Set a id prefix so CSS3 query selector can work with ids that contain numbers */
    public setIdPrefix(id: string): string {        
        return `_${id}`;
    }

    // /** Remove the id prefix to allow querying of data */
    // public removeIdPrefix(id: string): string {
    //     return id.substring(1, id.length - 1);
    // }

    /** Set the scroll top property of a native DOM element */
    private setScrollTop(scrollTop: number, element: any): void {
        if (element !== null && element !== undefined) {
            element.scrollTop = scrollTop;
        }
    }
}
