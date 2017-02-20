import { Component, Input } from '@angular/core';

@Component({
    selector: 'gantt-footer',
    template: `<div class="gantt-footer"></div>`,
    styles: [`
        .gantt-footer {
            background-color: whitesmoke;
            height: 36px;    
            border-top: 1px solid #e0e0e0;
        }

        .gantt-footer-actions {
            float:right;
        }
    `]
})
export class GanttFooterComponent {
    @Input() project: any;
    constructor() { }
}