import { Component, Input } from '@angular/core';

@Component({
    selector: 'gantt-header',
    templateUrl: './gantt-header.component.html',
    styleUrls: [ './gantt-header.component.css' ]
})
export class GanttHeaderComponent {

    @Input() name;
}