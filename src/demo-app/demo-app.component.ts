import { Component } from '@angular/core';
//import { Project, Options } from 'ng2-gantt';

import { Project, IGanttOptions, Zooming} from '../lib';

@Component({
    selector: 'demo-app',
    templateUrl: './demo-app.component.html'
})
export class DemoAppComponent {
    // Default options
    options: IGanttOptions = {
        scale: {
            start: new Date(2017, 0, 1),
            end: new Date(2017, 1, 1)
        },
        zooming: Zooming[Zooming.hours]
    };

    project: Project = {
        'id': 'dd10f0b6-b8a4-4b2d-a7df-b2c3d63b4a01',
        'name': 'Angular2 Gantt',
        'tasks': [
            {
                'id': '1',
                'name': 'Lorem ipsum dolor sit amet.',
                'resource': 'res1',
                'start': new Date('2017-01-01T00:00:00.0Z'),
                'end': new Date('2017-01-03T00:00:00.0Z'),
                'percentComplete': 0
            },
            {
                'id': '2',
                'name': 'Praesent molestie lobortis mi non tempor.',
                'resource': 'res1',
                'start': new Date('2017-01-03T00:00:00.0Z'),
                'end': new Date('2017-01-05T00:00:00.0Z'),
                'percentComplete': 0
            },
            {
                'id': '3',
                'name': 'Cras sollicitudin egestas velit sit amet aliquam.',
                'resource': 'res2',
                'start': new Date('2017-01-05T00:00:00.0Z'),
                'end': new Date('2017-01-06T00:00:00.0Z'),
                'percentComplete': 0
            },
            {
                'id': '4',
                'name': 'Donec ac augue est.',
                'resource': 'res2',
                'start': new Date('2017-01-06T00:00:00.0Z'),
                'end': new Date('2017-01-07T00:00:00.0Z'),
                'percentComplete': 0
            },
            {
                'id': '5',
                'name': 'Lorem ipsum dolor sit amet.',
                'resource': 'res1',
                'start': new Date('2017-01-07T00:00:00.0Z'),
                'end': new Date('2017-01-22T00:00:00.0Z'),
                'percentComplete': 0
            },
            {
                'id': '6',
                'name': 'Praesent molestie lobortis mi non tempor.',
                'resource': 'res1',
                'start': new Date('2017-01-22T00:00:00.0Z'),
                'end': new Date('2017-01-23T00:00:00.0Z')
            },
            {
                'id': '7',
                'name': 'Cras sollicitudin egestas velit sit amet aliquam.',
                'resource': 'res2',
                'start': new Date('2017-01-23T00:00:00.0Z'),
                'end': new Date('2017-01-24T00:00:00.0Z')
            },
            {
                'id': '8',
                'name': 'Donec ac augue est.',
                'resource': 'res2',
                'start': new Date('2017-01-24T00:00:00.0Z'),
                'end': new Date('2017-01-26T00:00:00.0Z')
            }
        ]
    };

    constructor() {}

    createTask(element:any) {
        var selectedStatus = element.options[element.selectedIndex].value;

        var task = {
            'id': '',
            'name': 'new task',
            'percentComplete': 0,
            'start': new Date('2017-01-01T03:30:00.0Z'),
            'end': new Date('2017-01-03T15:30:00.0Z'),
            'status': selectedStatus
        }

        this.project.tasks.push(task);
    }

    updateTasks() {
        for (var i = 0; i < this.project.tasks.length; i++) {
            let task = this.project.tasks[i];

            let progress = setInterval(function () {
                if (task.percentComplete === 100) {
                    task.status = "Completed";
                    clearInterval(progress);
                } else {
                    if (task.percentComplete === 25) {
                        task.status = "Warning";
                    } else if (task.percentComplete === 50) {
                        task.status = "Error";
                    } else if (task.percentComplete === 75) {
                        task.status = "Information";
                    }

                    task.percentComplete += 1;
                }
            }, 200);
        }
    }
}
