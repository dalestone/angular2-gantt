import { Component, Input } from '@angular/core';
import { NgStyle} from '@angular/common';

@Component({
    selector: 'gantt-header',
    templateUrl: './app/gantt/header.html',
    styleUrls: [ './header.css' ],
    directives: [
        NgStyle
    ]
})
export class GanttHeaderComponent {

    @Input()
    name;
}