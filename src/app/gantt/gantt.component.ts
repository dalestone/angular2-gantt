import { Component, OnInit, Input } from '@angular/core';
import { NgStyle} from '@angular/common';

import { GanttHeaderComponent } from './header/gantt-header.component';
import { GanttActivityComponent } from './activity/gantt-activity.component';
import { GanttFooterComponent } from './footer/gantt-footer.component';
import { GanttService } from './gantt.service';

@Component({
    selector: 'gantt',
    templateUrl: './app/gantt/gantt.html',
    styleUrls: [ './gantt.css' ],
    directives: [
        NgStyle,
        GanttHeaderComponent,
        GanttActivityComponent,
        GanttFooterComponent
    ],
    providers: [
        GanttService
    ]
})
export class GanttComponent implements OnInit {

    // Default options

    options = {
        scale: {
            start: new Date(2016, 1, 1),
            end: new Date(2016, 7, 30)
        }
    };

    project =  { 
                "id": "dd10f0b6-b8a4-4b2d-a7df-b2c3d63b4a01",
                "name": "Angular2 Gantt",
                "tasks": [
                    { "id": "", "name": "TASK01", "resource": "", "start": "2016-02-10T00:00:00.0Z", "end": "2016-02-22T00:00:00.0Z" },
                    { "id": "", "name": "TASK02", "resource": "", "start": "2016-02-22T00:00:00.0Z", "end": "2016-02-23T00:00:00.0Z" },
                    { "id": "", "name": "TASK03", "resource": "", "start": "2016-02-23T00:00:00.0Z", "end": "2016-02-24T00:00:00.0Z" },
                    { "id": "", "name": "TASK04", "resource": "", "start": "2016-02-24T00:00:00.0Z", "end": "2016-02-26T00:00:00.0Z" },
                    { "id": "", "name": "TASK04", "resource": "", "start": "2016-02-26T00:00:00.0Z", "end": "2016-03-01T00:00:00.0Z" },
                    { "id": "", "name": "TASK04", "resource": "", "start": "2016-03-01T00:00:00.0Z", "end": "2016-03-02T00:00:00.0Z" },
                    { "id": "", "name": "TASK04", "resource": "", "start": "2016-03-01T00:00:00.0Z", "end": "2016-03-02T00:00:00.0Z" },
                    { "id": "", "name": "TASK04", "resource": "", "start": "2016-03-02T00:00:00.0Z", "end": "2016-03-03T00:00:00.0Z" },
                    { "id": "", "name": "TASK04", "resource": "", "start": "2016-03-02T00:00:00.0Z", "end": "2016-03-03T00:00:00.0Z" },
                    { "id": "", "name": "TASK04", "resource": "", "start": "2016-03-02T00:00:00.0Z", "end": "2016-03-03T00:00:00.0Z" },
                    { "id": "", "name": "TASK04", "resource": "", "start": "2016-03-02T00:00:00.0Z", "end": "2016-03-09T00:00:00.0Z" },
                    { "id": "", "name": "TASK04", "resource": "", "start": "2016-03-08T00:00:00.0Z", "end": "2016-03-09T00:00:00.0Z" },
                    { "id": "", "name": "TASK04", "resource": "", "start": "2016-03-08T00:00:00.0Z", "end": "2016-03-09T00:00:00.0Z" },
                ]
            };

    ganttContainerWidth;

    constructor(private ganttService: GanttService) { }

    ngOnInit() {
        this.setSizes();
    }

    setSizes() {
        this.ganttContainerWidth = this.ganttService.calculateContainerWidth();
    }

    onResize($event) {
        this.setSizes();
    }
}