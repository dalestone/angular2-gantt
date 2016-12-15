import { Component } from '@angular/core';
import { Project, Options } from 'ng2-gantt';

@Component({
    selector: 'demo-app',
    templateUrl: './demo-app.component.html'
})
export class DemoAppComponent {

    constructor() {}

    // Default options
    options: Options = {                
        scale: {
            start: new Date(2016, 1, 1),
            end: new Date(2016, 2, 30)
        }
    };

    project: Project =  {
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

}
