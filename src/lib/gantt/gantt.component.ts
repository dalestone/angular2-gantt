import { Component, OnInit, Input } from '@angular/core';
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

    ganttContainerWidth: number;

    constructor(private ganttService: GanttService) { }

    ngOnInit() {
        this.setSizes();
    }

    setSizes(): void {
        this.ganttContainerWidth = this.ganttService.calculateContainerWidth();
    }

    onResize($event): void {
        this.setSizes();
    }
}
