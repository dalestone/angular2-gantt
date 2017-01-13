import { Component, OnInit, Input, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';

import { GanttService } from '../shared/services/gantt.service';
import { GanttConfig } from '../shared/services/gantt-config.service';
// import { IGanttOptions } from '../shared/interfaces';

@Component({
    selector: 'gantt-activity',
    template: `
    <div class="actions_bar">
    <strong> Zooming: &nbsp; </strong>
    <label>
        <input name="scales" (click)="zoomTasks('hours')" type="radio"><span>Hours</span>
    </label>
    <label>
        <input name="scales" (click)="zoomTasks('days')" type="radio" checked="true"><span>Days</span>
    </label>
    </div>
    <div class="grid" #ganttGrid [ngStyle]="{ 'height': ganttActivityHeight + 'px', 'width': 300 + 'px'}">
    <div class="grid_scale" [ngStyle]="setGridScaleStyle()">
        <div class="grid_head_cell" *ngFor="let column of gridColumns" [style.width]="column.width">
            <label style="padding-left:15px">{{column.name}}</label>
        </div>

    </div>
    <div class="grid_data" #ganttGridData [ngStyle]="{ 'height': project.tasks.length * ganttService.barTop + ganttService.rowHeight * 3 + 'px'}">
        <div class="grid_row" [ngStyle]="setGridRowStyle()"
            *ngFor="let data of project.tasks" [style.backgroundcolor]="rowHighlight(data)">
            <div class="grid_cell" style="width: 300px">
        <div class="gantt_tree_content">{{data.name}}</div>
    </div>
    </div>
    </div>
    </div><div class="gantt_activity" (window:resize)="onResize($event)" [ngStyle]="{ 'height': ganttActivityHeight + 'px', 'width': ganttActivityWidth - 18 + 'px'}">
        <time-scale [zoom]="zoom" [scale]="scale" [dimensions]="dimensions"></time-scale>
        <div class="gantt_activity_area" #ganttActivityArea [ngStyle]="{ 'height': project.tasks.length * ganttService.rowHeight + 'px', 'width': containerWidth + 'px'}">
            <activity-background [zoom]="zoom" [scale]="scale" [grid]="grid" [dimensions]="dimensions" [project]="project"></activity-background>
            <activity-bars [zoom]="zoom" [scale]="scale" [dimensions]="dimensions" [project]="project"></activity-bars>
        </div>
    </div>
    <div class="gantt_vertical_scroll" #verticalScroll (scroll)="onVerticalScroll(verticalScroll, ganttGrid, ganttActivityArea)">
        <div [ngStyle]="{ 'height': project.tasks.length * ganttService.rowHeight + ganttService.rowHeight * 3 + 'px'}"></div>
    </div>
    `,
    styleUrls: [`
        .gantt_activity {
                /*overflow-x: hidden;*/
                overflow-x: auto;
                height: 250px;
                overflow-y: hidden;
                display: inline-block;
                vertical-align: top;
                position:relative;
            }

            .gantt_activity_area {
                position: relative;
                overflow-x: hidden;
                overflow-y: hidden;
                -webkit-user-select: none;
            }

            .gantt_vertical_scroll {
                background-color: transparent;
                overflow-x: hidden;
                overflow-y: scroll;
                position: absolute;
                right: 0;
                display: block;
                height: 247px;
                width: 18px;
                top: 87px;
            }

            .gantt_activity {
                /*overflow-x: hidden;*/
                overflow-x: auto;
                height: 250px;
                overflow-y: hidden;
                display: inline-block;
                vertical-align: top;
                position:relative;
            }

            .gantt_activity_area {
                position: relative;
                overflow-x: hidden;
                overflow-y: hidden;
                -webkit-user-select: none;
            }

            .gantt_vertical_scroll {
                background-color: transparent;
                overflow-x: hidden;
                overflow-y: scroll;
                position: absolute;
                right: 0;
                display: block;
                height: 283px;
                width: 18px;
                top: 80px;
            }

                .grid {
            overflow-x: hidden;
            overflow-y: hidden;
            display: inline-block;
            vertical-align: top;
            border-right: 1px solid #cecece;
        }

        .grid_scale {
            color: #6b6b6b;
            font-size: 12px;
            border-bottom: 1px solid #cecece;
            background-color: #fff;
        }

        .grid_head_cell {
            /*color: #a6a6a6;*/
            border-top: none !important;
            border-right: none !important;
            line-height: inherit;
            box-sizing: border-box;
            display: inline-block;
            vertical-align: top;
            border-right: 1px solid #cecece;
            /*text-align: center;*/
            position: relative;
            cursor: default;
            height: 100%;
            -moz-user-select: -moz-none;
            -webkit-user-select: none;
            overflow: hidden;
        }

        .grid_data {
            overflow:hidden;   
        }

        .grid_row {
            box-sizing: border-box;
            border-bottom: 1px solid #ebebeb;
            background-color: #fff;
            position: relative;
            -webkit-user-select: none;
        }

        .grid_row:hover {
            background-color: #eeeeee;
        }

        .grid_cell {
            border-right: none;
            color: #454545;
            display: inline-block;
            vertical-align: top;
            padding-left: 6px;
            padding-right: 6px;
            height: 100%;
            overflow: hidden;
            white-space: nowrap;
            font-size: 13px;
            box-sizing: border-box;
        }

        .actions_bar {
            /*border-top: 1px solid #cecece;*/
            border-bottom: 1px solid #cecece;
            clear: both;
            /*margin-top: 90px;*/
            height: 28px;
            background: #fafafa;
            color: #494949;
            font-family: Arial, sans-serif;
            font-size: 13px;
            padding-left: 15px;
            line-height: 25px;
        }

        .gantt_tree_content {
            padding-left:15px;
        }
    `]
})
export class GanttActivityComponent implements OnInit, AfterViewInit {
    @Input() project: any;
    @Input() options: any;

    private zoom: EventEmitter<string> = new EventEmitter<string>();

    private timeScale: any;
    private background: any;
    private bars: any;
    private left = 0;
    private rowsCount: number = 0;
    private cellsCount: number = 0;
    private dates: any[] = [];
    private start: Date;
    private end: Date;
    private containerHeight: any;
    private containerWidth: any;

    private activityContainerSizes: any;
    private ganttActivityHeight: any;
    private ganttActivityWidth: any;
    private zoomLevel: string = 'days';

    private scale: any = {
        start: null,
        end: null
    };

    private grid: any = {
        rows: 0,
        cells: { dates: [] }
    };

    private dimensions = {
        height: 0,
        width: 0
    };

    private data: any[] = [];

    private gridData: any[] = [];
    private gridColumns: any[] = [];
    private gridDataHeight = 0;

    public gridScale: any;

    constructor(
        public elem: ElementRef,
        private ganttService: GanttService) {

        // set the zoom level to days
        this.zoom.emit(this.zoomLevel);
    }

    // TODO(dale): this needs to be refactored as its very messy!
    ngOnInit() {
        this.start = this.options.scale.start;
        this.end = this.options.scale.end;
        this.dates = this.ganttService.calculateScale(this.start, this.end);
        this.gridData = this.project.tasks;
        this.calculateRowsLength();
        this.calculateCellsLength();
        this.containerWidth = this.calculateContainerWidth();
        this.containerHeight = this.calculateContainerHeight();
        this.activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();

        // important that these are called last as it relies on values calculated above.
        this.setScale();
        this.setGrid();
        this.setDimensions();
        this.setData();
        this.setSizes();
        this.setGridColumns();
        this.gridDataHeight = this.calculateGridDataHeight();
    }

    ngAfterViewInit() {
        //TODO(dale): determine the best way to set default zoom level based on options passed
        //this.zoomTasks(this.options.zooming);
    }

    onVerticalScroll(verticalScroll: any, ganttGrid: any, ganttActivityArea: any): void {
        this.ganttService.scrollTop(verticalScroll, ganttGrid, ganttActivityArea);
    }

    onResize(event: any): void {
        let activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();
        this.ganttActivityHeight = activityContainerSizes.height;
        this.ganttActivityWidth = activityContainerSizes.width;
    }

    rowHighlight(data: any) {
        let backgroundColour = '';
        return backgroundColour;
    }

    setScale() {
        this.scale.start = this.start;
        this.scale.end = this.end;
    }

    setGrid() {
        this.grid.rows = this.rowsCount;
        this.grid.cells.dates = this.dates;
    }

    setDimensions() {
        this.dimensions.height = this.containerHeight;
        this.dimensions.width = this.containerWidth;
    }

    setData() {
        this.data = this.gridData;
    }

    setGridRowStyle() {
        return {
            'height': this.ganttService.rowHeight + 'px',
            'line-height': this.ganttService.rowHeight + 'px'
        };
    }

    zoomTasks(level: string) {
        this.zoomLevel = level;
        this.zoom.emit(this.zoomLevel);
        this.containerWidth = this.calculateContainerWidth();
        this.setDimensions();
        document.querySelector('.gantt_activity').scrollLeft = 0 // reset scroll left
    }

    private setGridScaleStyle() {
        var height = this.ganttService.rowHeight;

        if (this.zoomLevel === 'hours') {
            height *= 2;
        }

        return {
            'height': height + 'px',
            'line-height': height + 'px',
            'width': '300px'
        };
    }

    private calculateContainerHeight(): number {
        let containerHeight = this.rowsCount * this.ganttService.rowHeight;

        return containerHeight;
    }

    private calculateContainerWidth(): number {
        let containerWidth = 0;

        if (this.zoomLevel === 'hours') {
            containerWidth = this.cellsCount * this.ganttService.hourCellWidth * 24 + this.ganttService.hourCellWidth
        } else {
            containerWidth = this.cellsCount * this.ganttService.cellWidth + this.ganttService.cellWidth;
        }
        return containerWidth;
    }

    private calculateRowsLength(): void {
        this.rowsCount = this.gridData.length;
    }

    private calculateCellsLength(): void {
        this.cellsCount = this.dates.length;
    }

    private setSizes(): void {
        this.ganttActivityHeight = this.activityContainerSizes.height;
        this.ganttActivityWidth = this.activityContainerSizes.width;
    }

    private setGridColumns() {
        return this.gridColumns = [
            { name: 'Task', width: 346 }
        ];
    }

    private calculateGridDataHeight(): number {
        return this.gridData.length * this.ganttService.barTop;
    }
}


