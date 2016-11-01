/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';

import { GanttService } from './gantt.service';

describe('Gantt Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [GanttService]
        });
    });
    it('should return day is weekend', inject([GanttService], (ganttService: GanttService) => {
        let result = ganttService.isDayWeekend(new Date(2016, 5, 11));
        let expectedResult = true;

        expect(result).toBe(expectedResult);
    }));
    it('should return day is not weekend', inject([GanttService], (ganttService: GanttService) => {
        let result = ganttService.isDayWeekend(new Date(2016, 5, 13));
        let expectedResult = false;

        expect(result).toBe(expectedResult);
    }));
    it('should add x days to date', inject([GanttService], (ganttService: GanttService) => {
        let result = ganttService.addDays(new Date(2016, 5, 13), 2);
        let expectedResult = new Date(2016, 5, 15);

        expect(result).toEqual(expectedResult);
    }));
    it('should remove x days from date', inject([GanttService], (ganttService: GanttService) => {
        let result = ganttService.removeDays(new Date(2016, 5, 20), 2);
        let expectedResult = new Date(2016, 5, 18);

        expect(result).toEqual(expectedResult);
    }));
    it('should return difference in dates in days', inject([GanttService], (ganttService: GanttService) => {
        let result = ganttService.calculateDiffDays(new Date(2016, 5, 15), new Date(2016, 5, 20));
        let expectedResult = 5;

        expect(result).toBe(expectedResult);
    }));
    it('should create date range array given start and end dates', inject([GanttService], (ganttService: GanttService) => {
        let start = new Date(2016, 5, 15);
        let end = new Date(2016, 5, 18);
        let result = ganttService.calculateScale(start, end);
        let expectedResult = [ new Date(2016, 5, 15), new Date(2016, 5, 16), new Date(2016, 5, 17), new Date(2016, 5, 18)];

        expect(result).toEqual(expectedResult);
    }));
    it('should calculate the progress bar width', inject([GanttService], (ganttService) => {
        let barWidth = 100;
        let percentComplete = 50;
        let result = ganttService.calculateBarProgress(barWidth, percentComplete);
        let expectedResult = 48;

        expect(result).toBe(expectedResult);
    }));
});

