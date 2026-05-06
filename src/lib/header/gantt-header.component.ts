import { Component, Input } from '@angular/core';

@Component({
    selector: 'gantt-header',
    template: `
        <div class="gantt-header">
            <div class="gantt-header-title">
                <div class="gantt-header-main">
                    <span class="gantt-header-kicker">Project</span>
                    <strong>{{ name }}</strong>
                </div>
                <div class="gantt-header-date">Started {{ startDate | date: 'mediumDate'}}</div>
            </div>
        </div>
    `,
    styles: [`
        .gantt-header {
            background: linear-gradient(180deg, var(--gantt-surface), var(--gantt-surface-muted));
            min-height: 62px;
            border-bottom: 1px solid var(--gantt-border-soft);
        }

        .gantt-header-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            min-height: 62px;
            padding: 12px 18px;
            box-sizing: border-box;
        }

        .gantt-header-main {
            display: flex;
            flex-direction: column;
            gap: 3px;
            min-width: 0;
        }

        .gantt-header-kicker {
            color: var(--gantt-accent);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }

        strong {
            display: block;
            overflow: hidden;
            color: var(--gantt-text);
            font-size: 17px;
            font-weight: 700;
            letter-spacing: 0;
            text-overflow: ellipsis;
        }

        .gantt-header-date {
            flex: 0 0 auto;
            border: 1px solid var(--gantt-border-soft);
            border-radius: 999px;
            background: var(--gantt-surface);
            color: var(--gantt-text-muted);
            font-size: 12px;
            font-weight: 600;
            padding: 7px 10px;
        }

        .gantt-header-actions {
            display: inline;
            float: right;
            padding: 6px;
        }
    `],
    standalone: false
})
export class GanttHeaderComponent {
    @Input() name:any;
    @Input() startDate: Date;
}
