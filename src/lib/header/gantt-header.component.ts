import { Component, Input } from '@angular/core';

@Component({
    selector: 'gantt-header',
    template: `
        <div class="gantt-header">
            <div class="gantt-header-title">{{ name }}</div>
        </div>
    `,
    styleUrls: ['gantt-header.component.scss']
})
export class GanttHeaderComponent {
    @Input() name:any;
}
