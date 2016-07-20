import {
    it,
    inject,
    describe,
    beforeEachProviders,
    expect
} from '@angular/core/testing';
import { GanttService } from './gantt.service';
describe('Gantt Service', () => {
    beforeEachProviders(() => [
        GanttService
    ]);
    it('should return day is weekend', inject([GanttService], (ganttService: GanttService) => {
        var result = ganttService.isDayWeekend(new Date(2016, 5, 11));
        var expectedResult = true;

        expect(result).toBe(expectedResult);
    }));
    it('should return day is not weekend', inject([GanttService], (ganttService: GanttService) => {
        var result = ganttService.isDayWeekend(new Date(2016, 5, 13));
        var expectedResult = false;

        expect(result).toBe(expectedResult);
    }));
    it('should add x days to date', inject([GanttService], (ganttService: GanttService) => {     
        var result = ganttService.addDays(new Date(2016, 5, 13), 2);
        var expectedResult = new Date(2016, 5, 15);

        expect(result).toEqual(expectedResult);
    }));
    it('should remove x days from date', inject([GanttService], (ganttService: GanttService) => {
        var result = ganttService.removeDays(new Date(2016, 5, 20), 2);
        var expectedResult = new Date(2016, 5, 18);

        expect(result).toEqual(expectedResult);
    }));
    it('should return difference in dates in days', inject([GanttService], (ganttService: GanttService) => {
        var result = ganttService.calculateDiffDays(new Date(2016, 5, 15), new Date(2016, 5, 20));
        var expectedResult = 5;

        expect(result).toBe(expectedResult);
    }));
    it('should create date range array given start and end dates', inject([GanttService], (ganttService: GanttService) => {
        var start = new Date(2016, 5, 15);
        var end = new Date(2016, 5, 18);
        var result = ganttService.calculateScale(start, end);
        var expectedResult = [ new Date(2016, 5, 15), new Date(2016, 5, 16), new Date(2016, 5, 17), new Date(2016, 5, 18)];

        expect(result).toEqual(expectedResult);
    }));
    it('should calculate the progress bar width', inject([GanttService], (ganttService) => {
        var barWidth = 100;
        var percentComplete = 50;
        var result = ganttService.calculateBarProgress(barWidth, percentComplete);
        var expectedResult = 48;

        expect(result).toBe(expectedResult);
    }));
});

