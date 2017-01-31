import { Component, OnInit, Input, Output, EventEmitter, ElementRef, AfterViewInit, ViewChild, ChangeDetectionStrategy, OnChanges } from '@angular/core';

import { GanttService } from '../shared/services/gantt.service';
import { GanttConfig } from '../shared/services/gantt-config.service';
import { IGanttOptions, Zooming } from '../shared/interfaces';

@Component({
    selector: 'gantt-activity',
    template: `
    <div class="actions_bar">
        <div style="float:right">
            <label>
                <button (click)="zoomTasks('hours')" style="background-color:whitesmoke; border:none; font-size:16px">Hour</button>
            </label>
            <label>
                <button (click)="zoomTasks('days')" style="background-color:whitesmoke; border:none; font-size:16px">Day</button>
            </label>
            <button (click)="expand()" style="background-color:whitesmoke; border:none; font-size:21px; cursor:pointer" [innerHTML]="activityActions.expandedIcon"></button>
        </div>
    </div>
    <div class="grid" #ganttGrid [ngStyle]="{ 'height': ganttActivityHeight, 'width': ganttService.gridWidth + 'px'}">
    <div class="grid_scale" [ngStyle]="setGridScaleStyle()">
        <div class="grid_head_cell" *ngFor="let column of gridColumns" [style.width]="column.width + 'px'" [style.left]="column.left + 'px'">
            <label>{{column.name}}</label>            
        </div>
        <div class="grid_head_cell">
            <button (click)="toggleAllChildren()" style="background-color:whitesmoke; border:none; font-size:21px; cursor:pointer">&#x21D5;</button>
        </div>
    </div>
    <div class="grid_data" #ganttGridData [ngStyle]="{ 'height': project.tasks.length * ganttService.barTop + ganttService.rowHeight * 3 + 'px'}">
        <div *ngFor="let data of ganttService.groupData(project.tasks)">
            <div #row (click)="toggleChildren(row)" class="grid_row" [ngStyle]="setGridRowStyle(ganttService.isParent(data.treePath))" [style.display]="ganttService.isParent(data.treePath) === true ? 'block': 'none'"  [attr.data-isParent]="ganttService.isParent(data.treePath)" [attr.data-parentid]="data.parentId">
                <div class="grid_cell" [ngStyle]=" { 'width': gridColumns[0].width + 'px', 'padding-left': ganttService.isChild(data.treePath) }">
                    <div class="gantt_tree_content">{{data.name}}</div>                
                </div>
                <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[1].width + 'px' }">
                    <div>{{data.percentComplete}}</div>
                </div>
                <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[2].width + 'px'}">
                    <div> {{ ganttService.calculateDuration(data) }}</div>
                </div>
            </div>
        </div>
    </div>
    </div><div class="gantt_activity" (window:resize)="onResize($event)" [ngStyle]="{ 'height': ganttActivityHeight, 'width': ganttActivityWidth - 18 + 'px'}">
        <time-scale [zoom]="zoom" [zoomLevel]="zoomLevel" [scale]="scale" [dimensions]="dimensions"></time-scale>
        <div class="gantt_activity_area" #ganttActivityArea [ngStyle]="{ 'height': project.tasks.length * ganttService.rowHeight + 'px', 'width': containerWidth + 'px'}">
            <activity-background [zoom]="zoom" [zoomLevel]="zoomLevel" [grid]="grid" [project]="project"></activity-background>
            <activity-bars [zoom]="zoom" [zoomLevel]="zoomLevel" [scale]="scale" [dimensions]="dimensions" [project]="project"></activity-bars>
        </div>
    </div>
    <div class="gantt_vertical_scroll" #verticalScroll (scroll)="onVerticalScroll(verticalScroll, ganttGrid, ganttActivityArea)" [ngStyle]="{'display': activityActions.expanded === true ? 'none' : 'block' }">
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
            border-bottom: 1px solid #e0e0e0;
            background-color: whitesmoke;
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
            border-bottom: 1px solid #e0e0e0;
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
            border-bottom: 1px solid #e0e0e0;
            clear: both;
            /*margin-top: 90px;*/
            height: 28px;
            background: whitesmoke;
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
export class GanttActivityComponent implements OnInit {
    @Input() project: any;
    @Input() options: any;

    private showDetail: boolean = true;

    private upTriangle: string = '&#x25b2;' // BLACK DOWN-POINTING TRIANGLE
    private downTriangle: string = '&#x25bc;'; // BLACK UP-POINTING TRIANGLE

    private zoom: EventEmitter<string> = new EventEmitter<string>();

    private activityActions = {
        expanded: false,
        expandedIcon: this.downTriangle
    }

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
    private zoomLevel: string = Zooming[Zooming.hours];

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
    public gridColumns: any[] = [
        { name: 'Task', left: 20, width: 350 },
        { name: '%', left: 8, width: 40 },
        { name: 'Duration', left: 14, width: 120 }
    ];
    private gridDataHeight = 0;

    public gridScale: any;

    constructor(
        public elem: ElementRef,
        private ganttService: GanttService) {
    }

    ngOnInit() {
        this.zoomLevel = this.options.zooming;
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
        this.gridDataHeight = this.calculateGridDataHeight();
    }

    onVerticalScroll(verticalScroll: any, ganttGrid: any, ganttActivityArea: any): void {
        this.ganttService.scrollTop(verticalScroll, ganttGrid, ganttActivityArea);
    }

    //TODO(dale): this is surely possible with angular template syntax?
    toggleChildren(rowElem: any) {
        try {
            var isParent: boolean = "true" === rowElem.getAttribute('data-isparent');
            var children: any = document.querySelectorAll('[data-parentid=' + rowElem.getAttribute('data-parentid') + ']');

            if (isParent) {
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    if (child.getAttribute('data-isparent') === "false") {
                        if (child.style.display === 'none') {
                            child.style.display = 'block'
                        } else {
                            child.style.display = 'none';
                        }
                    }
                }
            }
        } catch (err) {

        }
    }

    toggleAllChildren() {
        try {
            var children: any = document.querySelectorAll('[data-isparent=false]');

            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.style.display === 'none') {
                    child.style.display = 'block';
                } else {
                    child.style.display = 'none';
                }
            }
        } catch (err) {

        }
    }

    onResize(event: any): void {
        let activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();
        if (this.activityActions.expanded) {
            this.ganttActivityHeight = this.project.tasks.length * this.ganttService.rowHeight + this.ganttService.rowHeight * 3 + 'px';
        } else {
            this.ganttActivityHeight = activityContainerSizes.height + 'px';;
        }

        this.ganttActivityWidth = activityContainerSizes.width;
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

    setGridRowStyle(isParent: boolean) {
        if (isParent) {
            return {
                'height': this.ganttService.rowHeight + 'px',
                'line-height': this.ganttService.rowHeight + 'px',
                'font-weight': 'bold',
                'cursor': 'pointer'
            };
        }

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
        document.querySelector('.gantt_activity').scrollLeft = 0 // reset scroll left, replace with @ViewChild?
    }

    expand() {
        if (this.activityActions.expanded) {
            this.activityActions.expanded = false;
            this.activityActions.expandedIcon = this.downTriangle;
            this.ganttActivityHeight = '300px';
        } else {
            var verticalScroll = document.querySelector('.gantt_vertical_scroll');
            verticalScroll.scrollTop = 0;

            this.activityActions.expanded = true;
            this.activityActions.expandedIcon = this.upTriangle;
            this.ganttActivityHeight = this.project.tasks.length * this.ganttService.rowHeight + this.ganttService.rowHeight * 3 + 'px';
        }
    }

    private setGridScaleStyle() {
        var height = this.ganttService.rowHeight;

        if (this.zoomLevel === Zooming[Zooming.hours]) {
            height *= 2;
        }

        return {
            'height': height + 'px',
            'line-height': height + 'px',
            'width': this.ganttService.gridWidth + 'px'
        };
    }

    private calculateContainerHeight(): number {
        let containerHeight = this.rowsCount * this.ganttService.rowHeight;

        return containerHeight;
    }

    private calculateContainerWidth(): number {
        let containerWidth = 0;

        if (this.zoomLevel === Zooming[Zooming.hours]) {
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
        this.ganttActivityHeight = this.activityContainerSizes.height + 'px';
        this.ganttActivityWidth = this.activityContainerSizes.width;
    }

    private calculateGridDataHeight(): number {
        return this.gridData.length * this.ganttService.barTop;
    }
}


//** <tree-builder [nodes]="ganttService.transformData(project.tasks)"></tree-builder> */
@Component({
    selector: 'tree-builder',
    template: '<tree-parent-repeater *ngFor="let node of nodes" [node]="node"></tree-parent-repeater>'
})
export class TreeBuilder {
    _nodes: any = [
        {
            name: "testing", children: [
                { name: "testing2", children: [{ name: "testing4", children: [] }] }
            ]
        },
        {
            name: "testing3", children: []
        }
    ];

    @Input() nodes: any;
}

@Component({
    selector: 'tree-parent-repeater',
    styleUrls: [`
        .grid_row {
            box-sizing: border-box;
            border-bottom: 1px solid #e0e0e0;
            background-color: #fff;
            position: relative;
            -webkit-user-select: none;
            cursor:pointer;
            height:25px;
            line-height:25px;
            font-size:16px;
        }

        .grid_row:hover {
            background-color: whitesmoke;
        }
  `],
    template: `
    <div>
        <div (click)="toggle()" class="grid_row">
            <div style="display:inline-block; width:10px; padding-left:4px; font-size:14px">{{ expanded !== true ? '&#x25b6;' : '&#x25bc;' }}</div>
            <div style="display:inline-block; width:350px">{{ node.name }}</div>
            <div style="display:inline-block; width:40px">{{ node.percentComplete }}</div>
            <div style="display:inline-block; width:40px">0</div>
        </div>
        <tree-children-repeater *ngIf="expanded" [root]="node"></tree-children-repeater>
    </div>
  `
})
export class TreeParentRepeater {
    @Input() node: any;
    expanded: boolean = true;

    toggle = () => {
        if (this.expanded) {
            this.expanded = false;
        } else {
            this.expanded = true;
        }
    }
}

@Component({
    selector: 'tree-children-repeater',
    styleUrls: [`
        .grid_row {
            box-sizing: border-box;
            border-bottom: 1px solid #e0e0e0;
            background-color: #fff;
            position: relative;
            -webkit-user-select: none;
            cursor:pointer;
            height:25px;
            line-height:25px;
            font-size:16px;
        }

        .grid_row:hover {
            background-color: whitesmoke;
        }
  `],
    template: `
    <div *ngIf="root.children.length > 0">
      <div *ngFor="let child of root.children" style="padding-left:20px">
          <div (click)="toggle()" class="grid_row">
            <div style="display:inline-block; width:10px; padding-left:4px; font-size:14px">{{ expanded !== true ? '&#x25b6;' : '&#x25bc;' }}</div>
            <div style="display:inline-block; width:330px">{{ child.name }}</div>
            <div style="display:inline-block; width:40px">{{ child.percentComplete }}</div>
            <div style="display:inline-block; width:40px">0</div>
          </div>
          <tree-children-repeater *ngIf="expanded" [root]="child"></tree-children-repeater>
      </div>
    </div>
  `
})
export class TreeChildrenRepeater {
    @Input() root: any;
    expanded: boolean = true;

    toggle = () => {
        if (this.expanded) {
            this.expanded = false;
        } else {
            this.expanded = true;
        }
    }
}

        // OLD WAY WITHOUT TREE
        // <!--<div class="grid_row" [ngStyle]="setGridRowStyle()" *ngFor="let data of project.tasks">
        //     <div class="grid_cell" [ngStyle]=" { 'width': gridColumns[0].width + 'px', 'padding-left': '20px' }">
        //         <div class="gantt_tree_content">{{data.name}}</div>                
        //     </div>
        //     <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[1].width + 'px' }">
        //         <div>{{data.percentComplete}}</div>
        //     </div>
        //     <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[2].width + 'px'}">
        //         <div> {{ ganttService.calculateDuration(data) }}</div>
        //     </div>
        // </div>-->

    // <!--<div class="grid_row" [ngStyle]="setGridRowStyle()">
    //     <div class="grid_cell" [ngStyle]=" { 'width': gridColumns[0].width + 'px' }">
    //         <div class="gantt_tree_content"><b>{{ group[0].id.split('/')[0] }}</b></div>                
    //     </div>
    //     <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[1].width + 'px' }">{{ ganttService.calculateTotalPercentage(group)}}</div>
    //     <div class="grid_cell" [ngStyle]="{ 'width': '65px'}">{{ ganttService.calculateTotalDuration(group) }}</div>
    //     <div class="grid_cell">
    //     	<button (click)="toggle(groupContainer)" style="background-color:#fff; border:none">{{ true == true ? '&#x25bc;' : '&#x25b2;' }}</button>
    //     </div>
    // </div>
    // <div [id]="group[0].id.split('/')[0] + '_container'" style="display:block;">
    //     <div class="grid_row" [ngStyle]="setGridRowStyle()" *ngFor="let data of group">
    //         <div class="grid_cell" [ngStyle]=" { 'width': gridColumns[0].width + 'px', 'padding-left': '20px' }">
    //             <div class="gantt_tree_content">{{data.name}}</div>                
    //         </div>
    //         <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[1].width + 'px' }">
    //             <div>{{data.percentComplete}}</div>
    //         </div>
    //         <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[2].width + 'px'}">
    //             <div> {{ ganttService.calculateDuration(data) }}</div>
    //         </div>
    //     </div>
    // </div>-->

        //     <!--<div #groupContainer *ngFor="let node of ganttService.createTree(project.tasks)">
        //     <div class="grid_row" [ngStyle]="setGridRowStyle()">
        //         <div class="grid_cell" [ngStyle]=" { 'width': gridColumns[0].width + 'px' }">
        //             <button style="background-color:#fff; border:none">&#x25bc;</button>
        //             {{ node.name }}
        //         </div>
        //         <div class="grid_cell"  [ngStyle]="{ 'width': gridColumns[1].width + 'px' }">{{ ganttService.calculateTotalPercentage(node) }}</div>
        //     </div>
        //     <div class="grid_row" [ngStyle]="setGridRowStyle()" *ngFor="let child of node.children">
        //         <div class="grid_cell" [ngStyle]=" { 'width': gridColumns[0].width + 'px', 'padding-left': '40px' }">{{ child.name }}</div>
        //         <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[1].width + 'px' }">{{ child.percentComplete }}</div>
        //         <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[2].width + 'px'}">{{ ganttService.calculateDuration(child) }}</div>
        //     </div>
        // </div>-->