import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { GanttService } from '../services/gantt.service';
import { GanttConfig } from '../gantt-config'; // Testing...

// <activity-bars [scale]="scale" [dimensions]="dimensions" [data]="data"></activity-bars>

@Component({
    selector: 'gantt-activity',
    templateUrl: './gantt-activity.component.html',
    styleUrls: [ './gantt-activity.component.css' ],
    providers: [
        GanttConfig
    ]
})
export class GanttActivityComponent implements OnInit {
    private timeScale;
    private background;
    private bars;
    private left = 0;
    private rowsCount: number = 0;
    private cellsCount: number = 0;
    private dates = [];
    private start: Date;
    private end: Date;
    private containerHeight;
    private containerWidth;

    private activityContainerSizes;
    private ganttActivityHeight;
    private ganttActivityWidth;

    private scale = {
        start: null,
        end: null
    };

    private grid = {
        rows: 0,
        cells: { dates: [] }
    };

    private dimensions = {
        height: 0,
        width: 0
    };

    private data = [];

    @Input() project;

    @Input() options;

    private gridData = [];
    private gridColumns = [];
    private gridDataHeight = 0;

    constructor(
        public elem: ElementRef,
        private ganttService: GanttService) {
    }

    ngOnInit() {
        // TODO: this needs to be refactored as its very messy!
        this.start = this.options.scale.start;
        this.end = this.options.scale.end;
        this.dates = this.ganttService.calculateScale(this.start, this.end);
        this.gridData = this.project.tasks;
        this.calculateRowsLength();
        this.calculateCellsLength();
        this.containerWidth = this.calculateContainerWidth() + this.ganttService.cellWidth;
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

    onVerticalScroll(verticalScroll, ganttGrid, ganttActivityArea): void {
        this.ganttService.scrollTop(verticalScroll, ganttGrid, ganttActivityArea);
    }

    // onWheel(verticalScroll, ganttGrid, ganttActivityArea) {
        //  this._ganttScrollService.scrollTop(verticalScroll, ganttGrid, ganttActivityArea);                 
        //  return false; // return false to stop page scrolling
        // console.log('wheel');
    // }

    onResize(event): void {
        let activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();
        this.ganttActivityHeight = activityContainerSizes.height;
        this.ganttActivityWidth = activityContainerSizes.width;
    }

    rowHighlight(data) {
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

    private calculateContainerHeight(): number {
        let containerHeight = this.rowsCount * this.ganttService.rowHeight;

        return containerHeight;
    }

    private calculateContainerWidth(): number {
        let containerWidth = this.cellsCount * this.ganttService.cellWidth;

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

