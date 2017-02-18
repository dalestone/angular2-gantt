import { Component, Input } from '@angular/core';

@Component({
    selector: 'gantt-footer',
    template: `<div class="gantt-footer"></div>`,
    styleUrls: ['gantt-footer.component.scss']
})
export class GanttFooterComponent {
    @Input() project: any;
    constructor() { }
}
