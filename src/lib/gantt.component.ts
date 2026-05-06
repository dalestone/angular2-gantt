import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GanttService } from './shared/services/gantt.service';
import { IGanttOptions, Project } from './shared/interfaces';

@Component({
    selector: 'gantt',
    template: `
        <div style="width: 100%">
            <div class="gantt_container" (window:resize)="onResize($event)">
                <gantt-header [name]="_project.name" [startDate]="_project.startDate"></gantt-header>
                <gantt-activity [project]="_project" [options]="_options" (onGridRowClick)="gridRowClicked($event)"></gantt-activity>
                <gantt-footer [project]="_project"></gantt-footer>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            width: 100%;
        }

        .gantt_container {
            --gantt-surface: #ffffff;
            --gantt-surface-muted: #f8fafc;
            --gantt-surface-subtle: #f1f5f9;
            --gantt-border: #d8dee8;
            --gantt-border-soft: #e8edf3;
            --gantt-text: #111827;
            --gantt-text-muted: #667085;
            --gantt-accent: #0e7490;
            --gantt-accent-soft: #e6f7fb;
            --gantt-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);

            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            font-size: 13px;
            color: var(--gantt-text);
            background: var(--gantt-surface);
            border: 1px solid var(--gantt-border);
            border-radius: 8px;
            box-shadow: var(--gantt-shadow);
            overflow: hidden;
            position: relative;
            white-space: nowrap;   
            margin-top: 0;
        }
    `],
    standalone: false,
    providers: []
})
export class GanttComponent implements OnInit {
    public _project: Project;
    public _options: IGanttOptions;

    //TODO(dale): this may be causing an issue in the tree builder?
    @Input()
    set project(project: any) {
        if (project) {
            this._project = project;
        } else {
            this.setDefaultProject();
        }
    }
    get project() { return this._project };

    @Input() 
    set options(options: any) {
        if (options.scale) {
            this._options = options;
        } else {
            this.setDefaultOptions();
        }
    }
    get options() { return this._options };

    @Output() onGridRowClick: EventEmitter<any> = new EventEmitter<any>();
    
    public ganttContainerWidth: number;

    constructor(private ganttService: GanttService) { }

    ngOnInit() {

     }

    setSizes(): void {
        this.ganttContainerWidth = this.ganttService.calculateContainerWidth();
    }

    setDefaultOptions() {
        var scale = this.ganttService.calculateGridScale(this._project.tasks);

        this._options = {
            scale: scale
        }
    }

    setDefaultProject() {
        this._project = {
            id: '',
            name: '',
            startDate: null,
            tasks: []
        }
    }

    gridRowClicked(task:any) {
        this.onGridRowClick.emit(task);
    }

    onResize($event: any): void {
        this.setSizes();
    }
}
