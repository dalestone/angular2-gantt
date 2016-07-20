import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { GanttComponent } from './gantt/gantt.component';

@Component({
    selector: 'app',
    templateUrl: './app/app.html',
    directives: [ ROUTER_DIRECTIVES, GanttComponent ],
})

export class AppComponent {

    constructor() {

    }

}