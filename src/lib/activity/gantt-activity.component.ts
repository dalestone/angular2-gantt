import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { GanttService } from '../shared/services/gantt.service';
import { GanttConfig } from '../shared/services/gantt-config.service'; 

@Component({
    selector: 'gantt-activity',
    templateUrl: './gantt-activity.component.html',
    styleUrls: [ './gantt-activity.component.css' ],
})
export class GanttActivityComponent implements OnInit {
    @Input() project: any;
    @Input() options: any;

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

    onVerticalScroll(verticalScroll: any, ganttGrid: any, ganttActivityArea: any): void {
        this.ganttService.scrollTop(verticalScroll, ganttGrid, ganttActivityArea);
    }

    // onWheel(verticalScroll, ganttGrid, ganttActivityArea) {
        //  this._ganttScrollService.scrollTop(verticalScroll, ganttGrid, ganttActivityArea);                 
        //  return false; // return false to stop page scrolling
        // console.log('wheel');
    // }

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

