import { Component, OnInit, Input } from '@angular/core';
import { NgStyle} from '@angular/common';
import { GanttService } from './services/gantt.service';

@Component({
    selector: 'gantt',
    templateUrl: './gantt.component.html',
    styleUrls: [ './gantt.component.css' ],
    providers: []
})
export class GanttComponent implements OnInit {

    // Default options
    options = {
        scale: {
            start: new Date(2016, 1, 1),
            end: new Date(2016, 2, 30)
        }
    };

    project =  {
                'id': 'dd10f0b6-b8a4-4b2d-a7df-b2c3d63b4a01',
                'name': 'Angular2 Gantt',
                'tasks': [
                    {
                        'id': '1', 'name':
                        'TASK01',
                        'resource': 'res1',
                        'start': new Date('2016-02-10T00:00:00.0Z'),
                        'end': new Date('2016-02-22T00:00:00.0Z')
                    },
                    {
                        'id': '2',
                        'name': 'TASK02',
                        'resource': 'res1',
                        'start': new Date('2016-02-22T00:00:00.0Z'),
                        'end': new Date('2016-02-23T00:00:00.0Z')
                    },
                    {
                        'id': '3',
                        'name': 'TASK03',
                        'resource': 'res2',
                        'start': new Date('2016-02-23T00:00:00.0Z'),
                        'end': new Date('2016-02-24T00:00:00.0Z')
                    },
                    {
                        'id': '4',
                        'name': 'TASK04',
                        'resource': 'res2',
                        'start': new Date('2016-02-24T00:00:00.0Z'),
                        'end': new Date('2016-02-26T00:00:00.0Z')
                    },
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
