import { Component, Input } from '@angular/core';

@Component({
    selector: 'gantt-footer',
    templateUrl: './gantt-footer.component.html',
    styleUrls: [ './gantt-footer.component.css' ],
    providers: [ ]
})
export class GanttFooterComponent {
    @Input() project;
    constructor() { }
}