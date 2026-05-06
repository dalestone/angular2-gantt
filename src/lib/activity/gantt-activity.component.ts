import { Component, OnInit, Input, Output, EventEmitter, ElementRef, AfterViewInit, ViewChild, ChangeDetectionStrategy, OnChanges, DoCheck } from '@angular/core';

import { GanttService } from '../shared/services/gantt.service';
import { GanttConfig } from '../shared/services/gantt-config.service';
import { IGanttOptions, Zooming } from '../shared/interfaces';

@Component({
    selector: 'gantt-activity',
    template: `
    <div class="actions_bar">
        <div class="actions_spacer"></div>
        <div class="toolbar" aria-label="Gantt controls">
            <button class="toolbar_button" [class.active]="zoomLevel === 'hours'" (click)="zoomTasks('hours')" type="button">Hour</button>
            <button class="toolbar_button" [class.active]="zoomLevel === 'days'" (click)="zoomTasks('days')" type="button">Day</button>
            <button class="toolbar_button icon_button" (click)="expand()" type="button" [innerHTML]="activityActions.expandedIcon" aria-label="Toggle expanded view"></button>
        </div>
    </div>
    <div class="grid" #ganttGrid [ngStyle]="{ 'height': ganttActivityHeight, 'width': ganttService.gridWidth + 'px'}">
    <div class="grid_scale" [ngStyle]="setGridScaleStyle()">
        @for (column of gridColumns; track column.name) {
        <div class="grid_head_cell" [style.width]="column.width + 'px'" [style.left]="column.left + 'px'">
            <label>{{column.name}} @if (column.name === 'Duration') { <span>{{ ganttService.calculateTotalDuration(ganttService.TASK_CACHE) }}</span> }</label>            
        </div>
        }
        <div class="grid_head_cell">
            <button class="tree_toggle" (click)="toggleAllChildren()" type="button">{{ treeExpanded ? '&#x25b2;' : '&#x25bc;' }}</button>
        </div>
    </div>
    <div class="grid_data" #ganttGridData [ngStyle]="{ 'height': ganttService.calculateGanttHeight() }">
    @for (data of ganttService.groupData(ganttService.TASK_CACHE); track data.id) {
    <div #row (click)="toggleChildren(row, data)" class="grid_row" [ngStyle]="setGridRowStyle(ganttService.isParent(data.treePath))" [attr.data-id]="ganttService.setIdPrefix(data.id)"  [attr.data-isParent]="ganttService.isParent(data.treePath)" [attr.data-parentid]="ganttService.setIdPrefix(data.parentId)">
            <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[0].width + 'px' }">
                <div class="status_icon" [innerHTML]="getStatusIcon(data.status, data.percentComplete)" [style.color]="getStatusIconColor(data.status, data.percentComplete)"></div>
            </div>
            <div class="grid_cell" [ngStyle]=" { 'width': gridColumns[1].width + 'px', 'padding-left': ganttService.isChild(data.treePath) }">
                <div class="gantt_tree_content">{{data.name}}</div>                
            </div>
            <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[2].width + 'px' }">
                <!--<div>{{ ganttService.isParent(data.treePath) === true ? ganttService.calculateParentTotalPercentage(data, project.tasks) : data.percentComplete }}</div>-->
                <div>{{ data.percentComplete }}</div>
            </div>
            <div class="grid_cell" [ngStyle]="{ 'width': gridColumns[3].width + 'px'}">
                <div> {{ ganttService.calculateDuration(data) }}</div>
            </div>
        </div>
    }
    </div>
    </div><div class="gantt_activity" (window:resize)="onResize($event)" [ngStyle]="{ 'height': ganttActivityHeight, 'width': ganttActivityWidth - 18 + 'px'}">
        <time-scale [zoom]="zoom" [zoomLevel]="zoomLevel" [timeScale]="ganttService.TIME_SCALE" [dimensions]="dimensions"></time-scale>
        <div class="gantt_activity_area" #ganttActivityArea [ngStyle]="{ 'height': ganttService.calculateGanttHeight(), 'width': containerWidth + 'px'}">
            <activity-background [zoom]="zoom" [zoomLevel]="zoomLevel" [timeScale]="ganttService.TIME_SCALE" [tasks]="ganttService.TASK_CACHE"></activity-background>
            <activity-bars [zoom]="zoom" [zoomLevel]="zoomLevel" [timeScale]="ganttService.TIME_SCALE" [dimensions]="dimensions" [tasks]="ganttService.TASK_CACHE"></activity-bars>
        </div>
    </div>
    <div class="gantt_vertical_scroll" #verticalScroll (scroll)="onVerticalScroll(verticalScroll, ganttGrid, ganttActivityArea)" [ngStyle]="{'display': activityActions.expanded === true ? 'none' : 'block' }">
        <div [ngStyle]="{ 'height': ganttService.calculateGanttHeight() }"></div>
    </div>
    `,
    styles: [`
        .gantt_activity {
            height: 250px;
            overflow-y: hidden;
            overflow-x: scroll;
            display: inline-block;
            vertical-align: top;
            position: relative;
            background: var(--gantt-surface);
            scrollbar-color: #b6c3d1 transparent;
            scrollbar-width: thin;
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
            top: 92px;
            scrollbar-color: #b6c3d1 transparent;
            scrollbar-width: thin;
        }

        .grid {
            overflow-x: hidden;
            overflow-y: hidden;
            display: inline-block;
            vertical-align: top;
            border-right: 1px solid var(--gantt-border);
            background: var(--gantt-surface);
        }

        .grid_scale {
            color: var(--gantt-text-muted);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            border-bottom: 1px solid var(--gantt-border-soft);
            background-color: var(--gantt-surface-subtle);
        }

        .grid_head_cell {
            line-height: inherit;
            box-sizing: border-box;
            display: inline-block;
            vertical-align: top;
            border-right: 1px solid var(--gantt-border-soft);
            position: relative;
            cursor: default;
            height: 100%;
            -webkit-user-select: none;
            user-select: none;
            overflow: hidden;
            padding: 0 10px;
        }

        .grid_head_cell label {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            height: 100%;
        }

        .grid_head_cell span {
            color: var(--gantt-text);
            font-weight: 800;
        }

        .grid_data {
            overflow:hidden;   
        }

        .grid_row {
            box-sizing: border-box;
            border-bottom: 1px solid var(--gantt-border-soft);
            background-color: var(--gantt-surface);
            position: relative;
            -webkit-user-select: none;
            user-select: none;
            transition: background-color 120ms ease, box-shadow 120ms ease;
        }

        .grid_row[data-isparent="true"] {
            background: #fbfcfe;
        }

        .grid_row:hover {
            background-color: var(--gantt-accent-soft);
            box-shadow: inset 3px 0 0 var(--gantt-accent);
        }

        .grid_cell {
            border-right: none;
            color: var(--gantt-text);
            display: inline-block;
            vertical-align: top;
            padding-left: 10px;
            padding-right: 10px;
            height: 100%;
            overflow: hidden;
            white-space: nowrap;
            font-size: 13px;
            box-sizing: border-box;
        }

        .actions_bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--gantt-border-soft);
            clear: both;
            height: 36px;
            background: var(--gantt-surface-muted);
            color: var(--gantt-text);
            font-size: 13px;
            padding: 0 10px 0 14px;
            line-height: 1;
        }

        .toolbar {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            border: 1px solid var(--gantt-border-soft);
            border-radius: 7px;
            background: var(--gantt-surface);
            padding: 3px;
        }

        .toolbar_button,
        .tree_toggle {
            border: 0;
            border-radius: 5px;
            background: transparent;
            color: var(--gantt-text-muted);
            cursor: pointer;
            font-size: 12px;
            font-weight: 700;
            height: 26px;
            min-width: 42px;
            padding: 0 9px;
            transition: background-color 120ms ease, color 120ms ease;
        }

        .toolbar_button:hover,
        .tree_toggle:hover {
            background: var(--gantt-surface-subtle);
            color: var(--gantt-text);
        }

        .toolbar_button.active {
            background: var(--gantt-accent);
            color: #fff;
        }

        .icon_button,
        .tree_toggle {
            min-width: 28px;
            width: 28px;
            padding: 0;
            font-size: 14px;
        }

        .gantt_tree_content {
            overflow: hidden;
            padding-left: 10px;
            text-overflow: ellipsis;
        }

        .status_icon {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-size: 13px;
            font-weight: 800;
        }
    `],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Default
})
export class GanttActivityComponent implements OnInit, DoCheck {
    @Input() project: any;
    @Input() options: any;
    @Output() onGridRowClick: EventEmitter<any> = new EventEmitter<any>();

    public upTriangle: string = '&#x25b2;' // BLACK UP-POINTING TRIANGLE
    public downTriangle: string = '&#x25bc;'; // BLACK DOWN-POINTING TRIANGLE
    public zoom: EventEmitter<string> = new EventEmitter<string>();
    public activityActions = {
        expanded: false,
        expandedIcon: this.downTriangle
    }

    public timeScale: any;

    public start: Date;
    public end: Date;
    public containerHeight: any;
    public containerWidth: any;

    public activityContainerSizes: any;
    public ganttActivityHeight: any;
    public ganttActivityWidth: any;
    public zoomLevel: string = Zooming[Zooming.hours];

    public treeExpanded = false;

    public scale: any = {
        start: null,
        end: null
    };

    public dimensions = {
        height: 0,
        width: 0
    };

    public data: any[] = [];

    public gridColumns: any[] = [
        { name: '', left: 0, width: 16 },
        { name: 'Task', left: 20, width: 330 },
        { name: '%', left: 8, width: 40 },
        { name: 'Duration', left: 14, width: 140 }
    ];

    constructor(
        public elem: ElementRef,
        public ganttService: GanttService) {
    }

    ngOnInit() {
        // Cache the project data and only work with that. Only show parent tasks by default
        this.ganttService.TASK_CACHE = this.project.tasks.slice(0).filter((item: any) => {
            return item.treePath.split('/').length === 1;
        });
        this.ganttService.TIME_SCALE = this.ganttService.calculateScale(this.options.scale.start, this.options.scale.end);

        this.zoomLevel = this.options.zooming;
        this.start = this.options.scale.start;
        this.end = this.options.scale.end;
        this.containerWidth = this.calculateContainerWidth();
        this.containerHeight = this.calculateContainerHeight();
        this.activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();

        // important that these are called last as it relies on values calculated above.
        this.setScale();
        this.setDimensions();
        this.setSizes();

        this.expand(); // default to expanded
    }

    /** Custom model check */
    ngDoCheck() {
        // do a check to see whether any new tasks have been added. If the task is a child then push into array if tree expanded?
        var tasksAdded = this.ganttService.doTaskCheck(this.project.tasks, this.treeExpanded);

        // only force expand if tasks are added and tree is already expanded
        if (tasksAdded && this.activityActions.expanded) {
            this.expand(true);
        }
    }

    /** On vertical scroll set the scroll top of grid and activity  */
    onVerticalScroll(verticalScroll: any, ganttGrid: any, ganttActivityArea: any): void {
        this.ganttService.scrollTop(verticalScroll, ganttGrid, ganttActivityArea);
    }

    /** Removes or adds children for given parent tasks back into DOM by updating TASK_CACHE */
    toggleChildren(rowElem: any, task: any) {
        try {
            let isParent: boolean = "true" === rowElem.getAttribute('data-isparent');
            let parentId: string = rowElem.getAttribute('data-parentid').replace("_", ""); // remove id prefix
            let children: any = document.querySelectorAll('[data-parentid="' + rowElem.getAttribute('data-parentid') + '"][data-isparent=false]');

            // use the task cache to allow deleting of items without polluting the project.tasks array
            if (isParent) {
                // remove children from the DOM as we don't want them if we are collapsing the parent
                if (children.length > 0) {
                    let childrenIds: any[] = this.ganttService.TASK_CACHE.filter((task: any) => {
                        return task.parentId == parentId && task.treePath.split('/').length > 1;
                    }).map((item: any) => { return item.id });

                    childrenIds.forEach((item: any) => {
                        var removedIndex = this.ganttService.TASK_CACHE.map((item: any) => { return item.id }).indexOf(item);

                        this.ganttService.TASK_CACHE.splice(removedIndex, 1);
                    });

                    if (this.activityActions.expanded) {
                        this.expand(true);
                    }

                } else {
                    // CHECK the project cache to see if this parent id has any children
                    // and if so push them back into array so DOM is updated
                    let childrenTasks: any[] = this.project.tasks.filter((task: any) => {
                        return task.parentId === parentId && task.treePath.split('/').length > 1;
                    });

                    childrenTasks.forEach((task: any) => {
                        this.ganttService.TASK_CACHE.push(task);
                    });

                    if (this.activityActions.expanded) {
                        this.expand(true);
                    }
                }
            }

            this.onGridRowClick.emit(task);

        } catch (err) { }
    }

    /** Removes or adds children tasks back into DOM by updating TASK_CACHE */
    toggleAllChildren() {
        try {
            var children: any = document.querySelectorAll('[data-isparent=false]');
            var childrenIds: string[] = Array.prototype.slice.call(children).map((item: any) => {
                return item.getAttribute('data-id').replace("_", ""); // remove id prefix
            });

            // push all the children array items into cache
            if (this.treeExpanded) {
                if (children.length > 0) {
                    let childrenIds: string[] = this.ganttService.TASK_CACHE.filter((task: any) => {
                        return task.treePath.split('/').length > 1;
                    }).map((item: any) => { return item.id });

                    childrenIds.forEach((item: any) => {
                        var removedIndex = this.ganttService.TASK_CACHE.map((item: any) => { return item.id }).indexOf(item);
                        this.ganttService.TASK_CACHE.splice(removedIndex, 1);
                    });
                }

                this.treeExpanded = false;

                if (this.activityActions.expanded) {
                    this.expand(true);
                }
            } else {
                // get all children tasks in project input
                let childrenTasks: any[] = this.project.tasks.filter((task: any) => {
                    return task.treePath.split('/').length > 1;
                });

                if (children.length > 0) {
                    // filter out these children as they already exist in task cache
                    childrenTasks = childrenTasks.filter((task: any) => {
                        return childrenIds.indexOf(task.id) === -1;
                    });
                }

                childrenTasks.forEach((task: any) => {
                    this.ganttService.TASK_CACHE.push(task);
                });

                this.treeExpanded = true;

                if (this.activityActions.expanded) {
                    this.expand(true);
                }
            }
        } catch (err) { }
    }

    /** On resize of browser window dynamically adjust gantt activity height and width */
    onResize(event: any): void {
        let activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();
        if (this.activityActions.expanded) {
            this.ganttActivityHeight = this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight + this.ganttService.rowHeight * 3 + 'px';
        } else {
            this.ganttActivityHeight = activityContainerSizes.height + 'px';;
        }

        this.ganttActivityWidth = activityContainerSizes.width;
    }

    setScale() {
        this.scale.start = this.start;
        this.scale.end = this.end;
    }

    setDimensions() {
        this.dimensions.height = this.containerHeight;
        this.dimensions.width = this.containerWidth;
    }

    setGridRowStyle(isParent: boolean): any {
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

    /** Set the zoom level e.g hours, days */
    zoomTasks(level: string) {
        this.zoomLevel = level;
        this.zoom.emit(this.zoomLevel);
        this.containerWidth = this.calculateContainerWidth();
        this.setDimensions();
        (document.querySelector('.gantt_activity') as HTMLElement).scrollLeft = 0 // reset scroll left, replace with @ViewChild?
    }

    /** Expand the gantt grid and activity area height */
    expand(force?: boolean): void {
        var verticalScroll = document.querySelector('.gantt_vertical_scroll') as HTMLElement;
        var ganttActivityHeight: string = `${this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight + this.ganttService.rowHeight * 3}px`;

        if (force && this.activityActions.expanded) {
            this.ganttActivityHeight = ganttActivityHeight;
        } else if (this.activityActions.expanded) {
            this.activityActions.expanded = false;
            this.activityActions.expandedIcon = this.downTriangle;
            this.ganttActivityHeight = '300px';
        } else {
            verticalScroll.scrollTop = 0;

            this.activityActions.expanded = true;
            this.activityActions.expandedIcon = this.upTriangle;
            this.ganttActivityHeight = ganttActivityHeight;
        }
    }

    /** Get the status icon unicode string */
    getStatusIcon(status: string, percentComplete: number): string {
        var checkMarkIcon: string = '&#x2714;';
        var upBlackPointer: string = '&#x25b2;';
        var crossMarkIcon: string = '&#x2718;';

        if (status === "Completed" || percentComplete === 100 && status !== "Error") {
            return checkMarkIcon;
        } else if (status === "Warning") {
            return upBlackPointer;
        } else if (status === "Error") {
            return crossMarkIcon;
        }
        return '';
    }

    /** Get the status icon color */
    getStatusIconColor(status: string, percentComplete: number): string {
        if (status === "Completed" || percentComplete === 100 && status !== "Error") {
            return 'green';
        } else if (status === "Warning") {
            return 'orange';
        } else if (status === "Error") {
            return 'red';
        }
        return '';
    }

    public setGridScaleStyle() {
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

    public calculateContainerHeight(): number {
        return this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight;
    }

    public calculateContainerWidth(): number {
        if (this.zoomLevel === Zooming[Zooming.hours]) {
            return this.ganttService.TIME_SCALE.length * this.ganttService.hourCellWidth * 24 + this.ganttService.hourCellWidth
        } else {
            return this.ganttService.TIME_SCALE.length * this.ganttService.cellWidth + this.ganttService.cellWidth;
        }
    }

    public setSizes(): void {
        this.ganttActivityHeight = this.activityContainerSizes.height + 'px';
        this.ganttActivityWidth = this.activityContainerSizes.width;
    }
}
