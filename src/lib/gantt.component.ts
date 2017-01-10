import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { NgStyle } from '@angular/common';
import { GanttService } from './shared/services/gantt.service';

@Component({
    selector: 'gantt',
    template: `
        <div style="width: 100%">
            <div class="gantt_container" (window:resize)="onResize($event)" [ngStyle]="{ 'width': ganttContainerWidth - 18 + 'px' }">
                <gantt-header [name]="_project.name"></gantt-header>
                <gantt-activity [project]="_project" [options]="_options"></gantt-activity>
                <gantt-footer [project]="_project"></gantt-footer>
            </div>
        </div>
    `,
    styleUrls: [`
        .gantt_container {
            font-family: Arial;
            font-size: 13px;
            border: 1px solid #cecece;
            position: relative;
            white-space: nowrap;   
            margin-top: 20px;
        }
    `],
    providers: []
})
export class GanttComponent implements OnInit {
    private _options: any;
    private _project: any;

    @Input()
    set options(options: any) {
        if (options) {
            this._options = options;
        } else {
            this.setDefaultOptions();
        }
    }
    get options() { return this._options };

    @Input()
    set project(project: any) {
        if (project) {
            this._project = project;
        } else {
            this.setDefaultProject();
        }
    }
    get project() { return this._project };

    private ganttContainerWidth: number;

    constructor(private ganttService: GanttService) { }

    ngOnInit() { }

    setSizes(): void {
        this.ganttContainerWidth = this.ganttService.calculateContainerWidth();
    }

    setDefaultOptions() {
        let start = new Date();
        let end = this.ganttService.addDays(start, 7);

        this._options = {
            scale: {
                start: start,
                end: end
            }
        }
    }

    setDefaultProject() {
        this._project = {
            id: '',
            name: '',
            tasks: []
        }
    }

    onResize($event: any): void {
        this.setSizes();
    }
}
