import { Component, Input } from '@angular/core';

@Component({
    selector: 'gantt-footer',
    template: `
        <div class="gantt-footer">
            <span>{{ project?.tasks?.length || 0 }} tasks</span>
        </div>
    `,
    styles: [`
        .gantt-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            min-height: 36px;
            padding: 0 16px;
            box-sizing: border-box;
            background: var(--gantt-surface-muted);
            border-top: 1px solid var(--gantt-border-soft);
            color: var(--gantt-text-muted);
            font-size: 12px;
            font-weight: 600;
        }

        .gantt-footer-actions {
            float:right;
        }
    `],
    standalone: false
})
export class GanttFooterComponent {
    @Input() project: any;
    constructor() { }
}
