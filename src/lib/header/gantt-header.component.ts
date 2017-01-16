import { Component, Input } from '@angular/core';

@Component({
    selector: 'gantt-header',
    template: `
        <div class="gantt-header">
            <div class="gantt-header-title">{{ name }}</div>
        </div>
    `,
    styleUrls: [`
        .gantt-header {
            background-color: #FAFAFA;
            height: 50px;
            border-bottom: 1px solid #CECECE;
        }

        .gantt-header-title {
            padding: 15px;   
            display: inline-block;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 20px;
        }

        .gantt-header-actions {
            display: inline;
            float: right;
            padding: 6px;
        }
    `] 
})
export class GanttHeaderComponent {
    @Input() name:any;
}