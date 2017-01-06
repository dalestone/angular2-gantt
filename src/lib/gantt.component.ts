import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { NgStyle} from '@angular/common';
import { GanttService } from './shared/services/gantt.service';

@Component({
    selector: 'gantt',
    template: `
        <div style="width: 100%">
            <div class="gantt_container" (window:resize)="onResize($event)" [ngStyle]="{ 'width': ganttContainerWidth - 18 + 'px' }">
                <gantt-header [name]="project.name"></gantt-header>
                <gantt-activity [project]="project" [options]="options"></gantt-activity>
                <gantt-footer [project]="project"></gantt-footer>
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

    @Input() options: any;
    @Input() project: any;

    private ganttContainerWidth: number;

    constructor(private ganttService: GanttService) { }

    ngOnInit() {
        this.setSizes();
    }

    setSizes(): void {
        this.ganttContainerWidth = this.ganttService.calculateContainerWidth();
    }

    onResize($event: any): void {
        this.setSizes();
    }
}
