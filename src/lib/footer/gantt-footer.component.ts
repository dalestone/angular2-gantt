import { Component, Input } from '@angular/core';

@Component({
    selector: 'gantt-footer',
    template: `<div class="gantt-footer"></div>`,
    styleUrls: [`
        .gantt-footer {
            background-color: #FAFAFA;
            height: 36px;    
            border-top: 1px solid #CECECE;
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