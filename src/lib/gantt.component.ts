import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { NgStyle} from '@angular/common';
import { GanttService } from './shared/services/gantt.service';

@Component({
    selector: 'gantt',
    templateUrl: './gantt.component.html',
    styleUrls: [ './gantt.component.css' ],
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
